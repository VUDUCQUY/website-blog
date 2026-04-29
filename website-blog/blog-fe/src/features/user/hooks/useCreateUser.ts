import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';
import { useAuthStore } from '@/features/auth/store/authStore';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { token: currentToken } = useAuthStore.getState();

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      console.log('🛠 [useCreateUser] Current Admin Token:', currentToken ? 'Present' : 'MISSING');
      
      // For now, we use /auth/register but we might want a dedicated admin endpoint later
      // NOTE: We don't use useSignup here to avoid auto-logging into the new account
      const signUpData = {
        ...dto,
        confirmPassword: dto.password,
      };
      const { data } = await apiClient.post<{ user: User }>('/auth/register', signUpData);
      
      // RESTORE Admin Session if it was lost/overwritten by the registration call
      if (currentToken) {
        const { user } = useAuthStore.getState();
        if (user) {
          useAuthStore.getState().setAuth(user, currentToken);
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', currentToken);
          }
          console.log('✅ [useCreateUser] Admin session restored successfully');
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateUserDto) => {
      // For now, we use /auth/register but we might want a dedicated admin endpoint later
      // NOTE: We don't use useSignup here to avoid auto-logging into the new account
      const { data } = await apiClient.post<{ user: User }>('/auth/register', dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

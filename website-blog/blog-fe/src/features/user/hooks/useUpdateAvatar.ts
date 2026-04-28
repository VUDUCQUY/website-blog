import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/hooks/useAuth';
import apiClient from '@/lib/api-client';
import { User } from '@/features/auth/types';

export function useUpdateAvatar() {
  const { updateUser } = useAuth();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await apiClient.post<{ profile: User }>('/users/profile/avatar', formData);
      return response.data;
    },
    onSuccess: (data) => {
      updateUser(data.profile);
    },
  });
}

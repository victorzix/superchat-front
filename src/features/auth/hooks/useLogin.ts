import { useMutation } from '@tanstack/react-query';
import { login } from '../services/authService';
import { useRouter } from 'next/navigation';

export function useLogin() {
	const router = useRouter();

	return useMutation({
		mutationFn: login,
		onSuccess: () => {
			console.log('Login realizado com sucesso!');
			router.push('/dashboard');
		},
	});
}

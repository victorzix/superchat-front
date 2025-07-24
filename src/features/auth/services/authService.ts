import { api } from '@/lib/axios';
import { LoginFormData } from '../schemas/loginSchema';

export async function login(data: LoginFormData) {
	const response = await api.post('/user/login', data);
	return response.data;
}

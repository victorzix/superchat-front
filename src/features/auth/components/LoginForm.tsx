'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import { useHookFormMask } from 'use-mask-input';
import { FaEye, FaPhone, FaSpinner } from "react-icons/fa6";
import { TbPassword } from "react-icons/tb";
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "motion/react";
import { isValidBrazilianMobile } from '@/utils/validatePhone';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const registerWithMask = useHookFormMask(register)

  const { mutate: login, isPending } = useLogin();

  useEffect(() => {
    const subscription = watch((value) => {
      if (value.phone) setPhoneNumber(value.phone);
      if (error) setError(null);
    });
    return () => subscription.unsubscribe();
  }, [watch, error]);

  const onSubmit = (data: LoginFormData) => {
    login(data, {
      onError: (error: any) => {
        setError(error.response.data.response.message);
      }
    });
  };

  return (
    <motion.form layout transition={{ layout: { duration: 0.5 } }} onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-3/4 shadow-xl py-8 px-4 rounded-lg">
      <div className='*:not-first:mt-2'>
        <div className='relative'>
          <Input className='peer ps-9' {...registerWithMask('phone', "(99) [9]9999-9999", {
            placeholder: '',
            showMaskOnHover: false,
            showMaskOnFocus: false,
            autoUnmask: true,
            allowMinus: true,
          })} />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <FaPhone size={16} aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className='*:not-first:mt-2'>
        <div className='relative'>
          <Input className='peer ps-9 pe-9' type={isPasswordVisible ? 'text' : 'password'} {...register('password')} />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <TbPassword size={16} aria-hidden="true" />
          </div>
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="button"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <FaEye size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div>
        <a className='text-xs text-gray-400'>Ou cadastre-se agora</a>
      </div>

      <AnimatePresence>
        {isValid && (
          <motion.div
            key="submit-wrapper"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              layout
              className="btn-primary"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <button type='submit'
                className={`flex items-center justify-center w-full py-1 rounded-sm text-sm text-secondary enabled:bg-primary disabled:bg-gray-300 disabled:cursor-not-allowed enabled:cursor-pointer transition-all duration-700`}
                disabled={!isValidBrazilianMobile(phoneNumber) || isPending || !!error}>
                {isPending ? <FaSpinner className='animate-spin' /> : error ? error : !isValidBrazilianMobile(phoneNumber) ? 'Numero inválido' : 'Entrar'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}

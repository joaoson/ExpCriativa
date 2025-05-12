import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnimatedIcon from '@/components/AnimatedIcon';
import { ArrowLeft, Lock } from 'lucide-react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const resetSchema = z
  .object({
    password: z.string().min(6, 'Minimum of 6 characters'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetData = z.infer<typeof resetSchema>;

const useQuery = () => new URLSearchParams(useLocation().search);

const ResetPassword: React.FC = () => {
  const query = useQuery();
  const token = query.get('token') || '';
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<ResetData>({ resolver: zodResolver(resetSchema) });

  const onSubmit = async (data: ResetData) => {
    try {
      await axios.post('/api/auth/reset-password', {
        token,
        password: data.password,
      });
      toast({
        title: 'Password reseted!',
        description: 'You can now login with your new password.',
      });
      navigate('/login');
    } catch (err) {
      toast({
        title: 'Failed to reset password',
        description: 'Invalid or expired link.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-charity-light-blue flex flex-col">
      <div className="container max-w-md mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
        {/* Back Link */}
        <Link
          to="/login"
          className="inline-flex items-center text-charity-blue hover:text-charity-blue/80 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to login
        </Link>

        {/* Icon + Title */}
        <div className="flex flex-col items-center mb-8">
          <AnimatedIcon
            icon={Lock}
            size={32}
            color="#FBAF00"
            bgColor="#FFF8E1"
            className="p-4 shadow-soft"
            animation="float"
          />
          <h1 className="mt-4 text-3xl font-bold text-charity-dark">
            Reset password
          </h1>
          <p className="text-charity-dark/70 text-center mt-2">
            Input new password.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-medium p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Nova Senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      New password
                    </FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 block w-full rounded-md border-gray-300
                                 shadow-sm focus:border-indigo-500
                                 focus:ring focus:ring-indigo-200
                                 focus:ring-opacity-50"
                    />
                    <FormMessage className="text-sm text-red-600 mt-1" />
                  </FormItem>
                )}
              />

              {/* Confirmar Senha */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Confirm password
                    </FormLabel>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="mt-1 block w-full rounded-md border-gray-300
                                 shadow-sm focus:border-indigo-500
                                 focus:ring focus:ring-indigo-200
                                 focus:ring-opacity-50"
                    />
                    <FormMessage className="text-sm text-red-600 mt-1" />
                  </FormItem>
                )}
              />

              {/* Botão */}
              <Button
                type="submit"
                className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white"
              >
                Reset password
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Heart, Lock, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedIcon from '@/components/AnimatedIcon';
import { useAuth,AuthProvider } from '@/components/auth-context';

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login ,isAuthenticated} = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
  
    try {
      const res = await fetch("http://localhost:5107/api/Auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      function parseJwt(token: string) {
        const base64Url = token.split('.')[1];           // parte do meio
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload) as {
          sub: string; jti: string; exp: number;
          iss: string; aud: string;
        };
      }
  
      // ❶ Handle non‑200 status codes early
      if (!res.ok) {
        const errorText =
          (await res.text()) || `Login failed with status ${res.status}`;
        throw new Error(errorText);
      }

      // ❷ Parse the JSON payload
      const { token } = await res.json() as { token: string };

      // ❸ Decodifica o payload
      const payload = parseJwt(token);   // { sub, jti, exp, ... }
      const userEmail = payload.sub;     // --> "joao@test.com"
      login(token, userEmail);
  
      // ❸ Persist the token & update context
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userEmail", userEmail);

  
      // ❹ Toast success
      toast({
        title: "Login bem‑sucedido!",
        description:`Bem‑vindo de volta, ${userEmail}!`,
        variant: "default",
      });
  
      // ❺ Redirect
      navigate("/dashboard");
    } catch (err: unknown) {
      const error =
        err instanceof Error ? err : new Error("Erro desconhecido no login.");
      toast({
        title: "Falha no login",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-charity-light-blue flex flex-col">
      <div className="container max-w-md mx-auto px-4 py-12 flex-grow flex flex-col justify-center">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center text-charity-blue hover:text-charity-blue/80 mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex justify-center mb-4">
            <AnimatedIcon
              icon={Heart}
              size={32}
              color="#FBAF00"
              bgColor="#FFF8E1"
              className="p-4 shadow-soft"
              animation="float"
            />
          </div>
          <h1 className="text-3xl font-bold text-charity-dark mb-2">Welcome to Lumen</h1>
          <p className="text-charity-dark/70">Log in with your account and start helping the world</p>
        </div>

        <div className="bg-white rounded-2xl shadow-medium p-8">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input
                              placeholder="your@email.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* <div className="flex justify-end">
                    <Link to="#" className="text-sm text-charity-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div> */}
                  
                  <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                    Log In
                  </Button>
                </form>
              </Form>

              <div className="flex items-center my-6">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-4 text-sm text-gray-500">Or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>
              <Link to={"/signup"}>
                <Button variant='outline' className="w-full py-6">
                    Create an Account
                </Button>
              </Link>

          <div className="mt-8 text-center text-sm text-charity-dark/70">
            By continuing, you agree to Lumen's
            <Link to="/terms" onClick={() => window.scrollTo(0, 0)} className="text-charity-blue hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="/policy" onClick={() => window.scrollTo(0, 0)} className="text-charity-blue hover:underline ml-1">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
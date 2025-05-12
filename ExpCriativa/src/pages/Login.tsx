import { useEffect } from 'react';
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
import { useAuth } from '@/components/auth-context';
import { UserResponse } from '@/models/UserResponse';

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

async function getUsers(token:string) {
  try {
    const response = await fetch("https://localhost:7142/api/Users", {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    },
    });

    const data: UserResponse[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch donations:", error);
  }
}

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, isAuthenticated, parseJwt, getJwtToken} = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const token = await getJwtToken(values.email, values.password)
  
      // Decodifica o payload
      const payload = parseJwt(token);   // { sub, jti, exp, ... }
      const userEmail = payload.sub;     // --> "joao@test.com"

      const users: UserResponse[] = await getUsers(token);
      const filteredUser = users.filter(user => user.userEmail == userEmail)

      if (!filteredUser) {
        throw new Error("Non existent user.")
      }

      login(token, userEmail, filteredUser[0].userId);

      toast({
        title: "Login bem‑sucedido!",
        description:`Bem‑vindo de volta, ${userEmail}!`,
        variant: "default",
      });
  
      navigate("/donations");
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
            <Link to="#" className="text-charity-blue hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="#" className="text-charity-blue hover:underline ml-1">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
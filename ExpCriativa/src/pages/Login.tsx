import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CalendarIcon, Heart, Lock, Mail, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedIcon from '@/components/AnimatedIcon';
import { format, differenceInYears } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// CPF Validation Function
const validateCPF = (cpf: string) => {
  // Remove any non-numeric characters
  cpf = cpf.replace(/[^\d]/g, '');

  // CPF must be exactly 11 digits
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // Invalid if all digits are the same (e.g., 111.111.111-11)
  }

  // CPF checksum validation
  const calculateChecksum = (cpf: string, length: number) => {
    let sum = 0;
    let weight = length + 1;

    for (let i = 0; i < length; i++) {
      sum += parseInt(cpf[i]) * weight--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calculateChecksum(cpf, 9);
  const secondDigit = calculateChecksum(cpf, 10);

  return cpf[9] === String(firstDigit) && cpf[10] === String(secondDigit);
};

// Phone Validation Schema
const phoneValidation = z.object({
  countryCode: z.enum(['BR', 'US', 'PT'], {
    errorMap: () => ({ message: "Please select a valid country" })
  }),
  phoneNumber: z.string()
}).refine(
  (data) => {
    // Remove all non-digit characters
    const cleanedNumber = data.phoneNumber.replace(/\D/g, '');

    switch (data.countryCode) {
      case 'BR': // Brazil
        // Brazilian phone numbers: 10-11 digits (with or without area code)
        return /^(\d{10,11})$/.test(cleanedNumber);
      case 'US': // United States
        // US phone numbers: exactly 10 digits
        return /^(\d{10})$/.test(cleanedNumber);
      case 'PT': // Portugal
        // Portuguese phone numbers: 9 digits
        return /^(\d{9})$/.test(cleanedNumber);
      default:
        return false;
    }
  },
  { message: "Invalid phone number format" }
);

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Signup Schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  phone: phoneValidation,
  cpf: z.string()
    .refine(val => val.replace(/[^\d]/g, '').length === 11, { 
      message: "CPF must be 11 digits" 
    })
    .refine(val => validateCPF(val), {
      message: "Invalid CPF",
    }),
  dateOfBirth: z.coerce.date()
    .refine((date) => {
      const age = differenceInYears(new Date(), date);
      return age >= 18;
    }, { message: "You must be at least 18 years old" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).transform((data) => {
  // Optional: format the phone number before final submission
  if (data.phone) {
    data.phone.phoneNumber = data.phone.phoneNumber.replace(/\D/g, '');
  }
  return data;
});

const Login = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      cpf: "",
      phone: {
        countryCode: "BR", // Default to Brazil
        phoneNumber: "",
      },
      dateOfBirth: undefined,
    },
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("Login values:", values);
    
    // Simulate successful login
    toast({
      title: "Login Successful",
      description: "Welcome back to KindHearts!",
      variant: "default",
    });
    
    // Redirect to donation page (or another appropriate page)
    setTimeout(() => navigate('/#donate'), 1000);
  };

  const onSignupSubmit = (values: z.infer<typeof signupSchema>) => {
    console.log("Signup values:", values);
    
    // Simulate successful signup
    toast({
      title: "Account Created",
      description: "Welcome to KindHearts! Thank you for joining our mission.",
      variant: "default",
    });
    
    // Redirect to donation page (or another appropriate page)
    setTimeout(() => navigate('/#donate'), 1000);
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
          <p className="text-charity-dark/70">Sign in to make a difference in children's lives</p>
        </div>

        <div className="bg-white rounded-2xl shadow-medium p-8">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
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
                  
                  <div className="flex justify-end">
                    <Link to="#" className="text-sm text-charity-blue hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  
                  <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                    Login
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  <FormField
                    control={signupForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input
                              placeholder="John Doe"
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
                    control={signupForm.control}
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
                    control={signupForm.control}
                    name="cpf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CPF</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input
                              placeholder="Enter your CPF"
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
                    control={signupForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Select
                              value={field.value?.countryCode}
                              onValueChange={(countryCode) => {
                                field.onChange({
                                  ...field.value,
                                  countryCode
                                });
                              }}
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="BR">
                                  <div className="flex items-center">
                                    🇧🇷 +55
                                  </div>
                                </SelectItem>
                                <SelectItem value="US">
                                  <div className="flex items-center">
                                    🇺🇸 +1
                                  </div>
                                </SelectItem>
                                <SelectItem value="PT">
                                  <div className="flex items-center">
                                    🇵🇹 +351
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              type="tel"
                              placeholder="Phone Number"
                              className="flex-1"
                              value={field.value?.phoneNumber || ''}
                              onChange={(e) => {
                                const cleanedValue = e.target.value.replace(/\D/g, '');
                                field.onChange({
                                  ...field.value,
                                  phoneNumber: cleanedValue
                                });
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={signupForm.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input
                              type="date"
                              placeholder="Enter your date of birth"
                              className="pl-10"
                              {...field}
                              value={field.value instanceof Date 
                                ? field.value.toISOString().split('T')[0] 
                                : field.value || ''}
                              onChange={(e) => {
                                const dateValue = e.target.value 
                                  ? new Date(e.target.value) 
                                  : undefined;
                                field.onChange(dateValue);
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signupForm.control}
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
                  
                  <FormField
                    control={signupForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
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
                    Create Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-center text-sm text-charity-dark/70">
            By continuing, you agree to Lumen'
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
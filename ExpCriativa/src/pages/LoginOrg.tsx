import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Heart, Lock, Mail, User, MapPin, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AnimatedIcon from '@/components/AnimatedIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// CNPJ Validation Function
const validateCNPJ = (cnpj: string) => {
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size += 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1));
};

// Phone validation
const phoneValidation = z.object({
  countryCode: z.enum(['BR', 'US', 'PT'], {
    errorMap: () => ({ message: "Please select a valid country" })
  }),
  phoneNumber: z.string()
}).refine((data) => {
  const cleaned = data.phoneNumber.replace(/\D/g, '');
  switch (data.countryCode) {
    case 'BR': return /^(\d{10,11})$/.test(cleaned);
    case 'US': return /^(\d{10})$/.test(cleaned);
    case 'PT': return /^(\d{9})$/.test(cleaned);
    default: return false;
  }
}, { message: "Invalid phone number format" });

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Signup Schema (organization)
const signupSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
  cnpj: z.string()
    .refine(val => val.replace(/\D/g, '').length === 14, { message: "CNPJ must be 14 digits" })
    .refine(validateCNPJ, { message: "Invalid CNPJ" }),
  address: z.string().min(5, { message: "Address is required" }),
  admin: z.string().min(2, { message: "Administrator name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: phoneValidation,
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).transform((data) => {
  if (data.phone) {
    data.phone.phoneNumber = data.phone.phoneNumber.replace(/\D/g, '');
  }
  return data;
});

const LoginOrg = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const navigate = useNavigate();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "", cnpj: "", address: "", admin: "",
      email: "", password: "", confirmPassword: "",
      phone: { countryCode: "BR", phoneNumber: "" }
    }
  });

  const onLoginSubmit = (values: z.infer<typeof loginSchema>) => {
    console.log("LoginOrg - login:", values);
    toast({ title: "Login Successful", description: "Welcome back!", variant: "default" });
    setTimeout(() => navigate('/'), 1000);
  };

  const onSignupSubmit = (values: z.infer<typeof signupSchema>) => {
    console.log("LoginOrg - signup:", values);
    toast({ title: "Organization Registered", description: "Thanks for joining!", variant: "default" });
    setTimeout(() => navigate('/'), 1000);
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
            <AnimatedIcon icon={Heart} size={32} color="#FBAF00" bgColor="#FFF8E1" className="p-4 shadow-soft" animation="float" />
          </div>
          <h1 className="text-3xl font-bold text-charity-dark mb-2">Welcome to Lumen</h1>
          <p className="text-charity-dark/70">Register to join our mission</p>
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
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                          <Input placeholder="org@email.com" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                    Login
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="signup">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                  {[
                    { name: "name", label: "Organization Name", icon: Briefcase },
                    { name: "cnpj", label: "CNPJ", icon: Briefcase },
                    { name: "address", label: "Address", icon: MapPin },
                    { name: "admin", label: "Administrator Name", icon: User },
                    { name: "email", label: "Email", icon: Mail },
                  ].map(({ name, label, icon: Icon }) => (
                    <FormField key={name} control={signupForm.control} name={name as any} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input placeholder={label} className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}

                  {/* Phone */}
                  <FormField control={signupForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          <Select
                            value={field.value?.countryCode}
                            onValueChange={(countryCode) => field.onChange({ ...field.value, countryCode })}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="BR">🇧🇷 +55</SelectItem>
                              <SelectItem value="US">🇺🇸 +1</SelectItem>
                              <SelectItem value="PT">🇵🇹 +351</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            className="flex-1"
                            value={field.value?.phoneNumber || ''}
                            onChange={(e) => field.onChange({ ...field.value, phoneNumber: e.target.value })}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  {/* Password */}
                  {["password", "confirmPassword"].map((name) => (
                    <FormField key={name} control={signupForm.control} name={name as any} render={({ field }) => (
                      <FormItem>
                        <FormLabel>{name === "password" ? "Password" : "Confirm Password"}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                            <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  ))}

                  <Button type="submit" className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white">
                    Register Organization
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center text-sm text-charity-dark/70">
            By continuing, you agree to our
            <Link to="#" className="text-charity-blue hover:underline mx-1">Terms of Service</Link>
            and
            <Link to="#" className="text-charity-blue hover:underline ml-1">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOrg;

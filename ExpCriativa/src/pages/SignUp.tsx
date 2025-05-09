import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Briefcase, CalendarIcon, Heart, Lock, Mail, MapPin, User } from 'lucide-react';
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
import { validateCNPJ, validateCPF, phoneValidation } from '@/lib/utils';


// Signup Schema
const personSchema = z.object({
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

const ongSchema = z.object({
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

const SignUp = () => {
  const [activeTab, setActiveTab] = useState<string>("person");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Signup form
  const personForm = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
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

  const onPersonSubmit = async (values: z.infer<typeof personSchema>) => {
    try {
      
      const formData = new FormData();
      formData.append("UserEmail", values.email);
      formData.append("UserPassword", values.password);
      formData.append("UserStatus", "Active");
      console.log("Sending signup request to backend...");
      console.table(formData)
      console.log(values.email)
      const response = await fetch('http://localhost:5107/api/Users', {
        method: 'POST',
        
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
  
      toast({
        title: "Account Created",
        description: "Welcome to KindHearts! Thank you for joining our mission.",
        variant: "default",
      });
  
      //setTimeout(() => navigate('/#donate'), 1000);
  
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const ongForm = useForm<z.infer<typeof ongSchema>>({
    resolver: zodResolver(ongSchema),
    defaultValues: {
      name: "", cnpj: "", address: "", admin: "",
      email: "", password: "", confirmPassword: "",
      phone: { countryCode: "BR", phoneNumber: "" }
    }
    });
  
  const onOngSubmit = (values: z.infer<typeof ongSchema>) => {
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
          <p className="text-charity-dark/70">Create an account and start making a difference</p>
        </div>

        <div className="bg-white rounded-2xl shadow-medium p-8">
          <Tabs defaultValue="person" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="person">Person</TabsTrigger>
              <TabsTrigger value="ngo">NGO</TabsTrigger>
            </TabsList>

            <TabsContent value="person">
              <Form {...personForm}>
                <form onSubmit={personForm.handleSubmit(onPersonSubmit)} className="space-y-4">
                  <FormField
                    control={personForm.control}
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
                    control={personForm.control}
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
                    control={personForm.control}
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
                    control={personForm.control}
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
                    control={personForm.control}
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
                    control={personForm.control}
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
                    control={personForm.control}
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

            <TabsContent value="ngo">
              <Form {...ongForm}>
                <form onSubmit={ongForm.handleSubmit(onOngSubmit)} className="space-y-4">
                  {[
                    { name: "name", label: "Organization Name", icon: Briefcase },
                    { name: "cnpj", label: "CNPJ", icon: Briefcase },
                    { name: "address", label: "Address", icon: MapPin },
                    { name: "admin", label: "Administrator Name", icon: User },
                    { name: "email", label: "Email", icon: Mail },
                  ].map(({ name, label, icon: Icon }) => (
                    <FormField key={name} control={ongForm.control} name={name as any} render={({ field }) => (
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
                  <FormField control={ongForm.control} name="phone" render={({ field }) => (
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
                    <FormField key={name} control={ongForm.control} name={name as any} render={({ field }) => (
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
                    Create Account
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          
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

export default SignUp;
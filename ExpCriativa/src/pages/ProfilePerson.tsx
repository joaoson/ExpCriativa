import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Lock, Mail, User } from 'lucide-react';
import { differenceInYears } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { validateCPF, phoneValidation, formatDateBRtoUS } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserResponse } from '@/models/UserResponse';
import { toast, useToast } from '@/hooks/use-toast';

const personSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .optional()
      .or(z.literal('')),
    confirmPassword: z
      .string()
      .optional()
      .or(z.literal('')),
    phone: phoneValidation,
    cpf: z
      .string()
      .refine((val) => val.replace(/[^\d]/g, '').length === 11, {
        message: "CPF must be 11 digits",
      })
      .refine((val) => validateCPF(val), {
        message: "Invalid CPF",
      }),
    dateOfBirth: z
      .coerce
      .date()
      .refine((date) => differenceInYears(new Date(), date) >= 18, {
        message: "You must be at least 18 years old",
      }),
  })
  .refine(
    (data) => {
    if (data.password && !data.confirmPassword) {
        return false;
    }

    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }

    if (!data.password && data.confirmPassword) {
        return false;
    }

    return true;
    },   
    {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }
    
  )
  .transform((data) => {
    if (data.phone) {
      data.phone.phoneNumber = data.phone.phoneNumber.replace(/\D/g, '');
    }

    if (!data.password) {
      delete data.password;
      delete data.confirmPassword;
    }

return data;
});

// PEGAR USERID E DONORID VIA ENDPOINT PARA DADOS COMO CPF ETC

const ProfilePerson = () => {

    const token = localStorage.getItem("accessToken");
    
    const { toast } = useToast();
    const [user, setUser] = useState<UserResponse>();

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
        }
    })

    async function getUser(id: number) {
        try {
            const response = await fetch(`https://localhost:7142/api/Users/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            });

            const data: UserResponse = await response.json();
            setUser(data);
            console.log(data)

            personForm.reset({
                email: data.userEmail,
                dateOfBirth: formatDateBRtoUS(data.userBirthDate.toString()),
                phone: {
                    phoneNumber: data.userPhone
                }
            })
        } catch (error) {
            console.error("Failed to fetch donations:", error);
        }
    }

    async function updateUser (userId: number, payload: UserResponse, token: string) {
        try {
            const formData = new FormData();
            formData.append("UserEmail", payload.userEmail);
            formData.append("UserPhone", payload.userPhone);
            formData.append("UserStatus", payload.userStatus);
            formData.append("UserBirthDate", payload.userBirthDate.toISOString());
            formData.append("UserPassword", payload.userPassword);

            const response = await fetch(`https://localhost:7142/api/Users/${userId}`, {
                method: "PUT",
                headers: {
                "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedUser = await response.json();

            toast({
                title: "Operation successful!",
                description: "Your information has been updated.",
                variant: "default",
            });
            
            return updatedUser;
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
        }
    };

    function onPersonSubmit(values: z.infer<typeof personSchema>) {
        const payload: UserResponse = {
            userEmail: values.email,
            userPassword: "teste123", // carregar senha dinamicamente
            userStatus: "active", // carregar dinamicamente?
            userBirthDate: new Date(values.dateOfBirth),
            userPhone: values.phone.phoneNumber
        };

        if (values.password && values.confirmPassword) {
            if (values.password === values.confirmPassword) {
                payload.userPassword = values.password;
            } else {
                console.error("Passwords don't match");
                return;
            }
        }

        console.log("Submitting:", payload);
        updateUser(user.userId, payload, token)
    }

    useEffect(() => {
        getUser(4)
    }, [])
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Fill in your personal details</CardDescription>
            </CardHeader>

            <CardContent>
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
                            <Input placeholder="John Doe" className="pl-10" {...field} />
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
                            <Input placeholder="your@email.com" className="pl-10" {...field} />
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
                            <Input placeholder="Enter your CPF" className="pl-10" {...field} />
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
                                onValueChange={(countryCode) =>
                                field.onChange({ ...field.value, countryCode })
                                }
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
                                onChange={(e) => {
                                const cleanedValue = e.target.value.replace(/\D/g, '');
                                field.onChange({
                                    ...field.value,
                                    phoneNumber: cleanedValue,
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
                                value={
                                field.value instanceof Date
                                    ? field.value.toISOString().split('T')[0]
                                    : field.value || ''
                                }
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <Button
                    type="submit"
                    className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white"
                    >
                    Update
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>

    )
}

export default ProfilePerson;
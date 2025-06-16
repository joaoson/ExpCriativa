import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon, Lock, Mail, User } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { validateCPF, phoneValidation, formatDateBRtoUS, formatCPF } from '@/lib/utils';
import { toast, useToast } from '@/hooks/use-toast';
import { DonorProfileResponse, DonorResponse } from '@/models/DonorResponse';
import { useAuth } from './auth-context';

const personSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    phone: phoneValidation,
    cpf: z
      .string()
      .optional(),
    birth: z.string().optional()
  })
  .transform((data) => {
    if (data.phone) {
      data.phone.phoneNumber = data.phone.phoneNumber.replace(/\D/g, '');
    }

    return data;
});

interface UpdateDonorProfileProps {
  onClose: () => void;
}

const UpdateDonorProfile = ({ onClose }: UpdateDonorProfileProps) => {
    const personForm = useForm<z.infer<typeof personSchema>>({
        resolver: zodResolver(personSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          cpf: "",
          birth: "",
          phone: {
            countryCode: "BR",
            phoneNumber: "",
          },
        }
    })

    const token = localStorage.getItem("accessToken");
    const id = localStorage.getItem("userId")
    const email = localStorage.getItem("userEmail")
    
    const { getJwtToken, login, parseJwt } = useAuth();
    const { toast } = useToast();
    const [user, setUser] = useState<DonorResponse>();

    async function getUser(id: string) {
        try {
            const response = await fetch(`https://localhost:7142/api/Users/${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data: DonorResponse = await response.json();
            setUser(data);
            personForm.reset({
                name: data.donorProfile.name,
                email: data.userEmail,
                cpf: formatCPF(data.donorProfile.document),
                birth: data.donorProfile.birthDate,
                phone: {
                    phoneNumber: data.donorProfile.phone
                }
            })
        } catch (error) {
            console.error("Failed to fetch information:", error);
            toast({
                title: "Failed to fetch your information...",
                description:`Sorry. There was an error when trying to get your information: ${error}!`,
                variant: "destructive",
            });
        }
    }

    async function updateDonor(values: z.infer<typeof personSchema>) {
        try {
            const formData = new FormData();
            formData.append("Name", values.name);
            formData.append("Document", user.donorProfile.document);
            formData.append("Phone", values.phone.phoneNumber);
            const formattedDate = formatDateBRtoUS(user.donorProfile.birthDate)
            formData.append("BirthDate", new Date(formattedDate).toISOString());
            // const shouldClearImage = false;
            // formData.append("ClearImage", String(shouldClearImage));

            const response = await fetch(`https://localhost:7142/api/Users/${id}/profile/donor`, {
                method: "PUT",
                headers: {
                "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await response.json();
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
        }
    };

    async function updateCoreUser(values: z.infer<typeof personSchema>) {
        try {
            const body = {
                userEmail: values.email,
                userPassword: values.password,
                role: user.role
            }

            const response = await fetch(`https://localhost:7142/api/Users/${id}/core`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            await response.json();
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
        }
    };

    async function onPersonSubmit(values: z.infer<typeof personSchema>) {
        try {
            await updateDonor(values)

            if (values.password) {
                const tokenUpdate = await getJwtToken(email, values.password)

                if (!tokenUpdate) {
                    throw new Error(`Invalid token`);
                }

                await updateCoreUser(values)

                const token = await getJwtToken(values.email, values.password)
                console.log(values.password)
                const payload = parseJwt(token);
                const userEmail = payload.sub;
    
                login(token, userEmail, user.id, user.role);
            }

            toast({
                title: "Operation successful!",
                description: "Your information has been updated.",
                variant: "default",
            });
            onClose()
        } catch (error) {
            toast({
                title: "Unable to update your information.",
                description:`There was an error and your information was not updated: ${error}!`,
                variant: "destructive",
            });
        }        
    }

    useEffect(() => {
        const id = localStorage.getItem("userId")
        getUser(id)
    }, [])
    
    return (
        <div>
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
                        <Input className="pl-10" {...field} disabled/>
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={personForm.control}
                name="birth"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                        <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray h-5 w-5" />
                        <Input className="pl-10" {...field} disabled/>
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
                    name="password"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Password</FormLabel>
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

                <Button
                type="submit"
                className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white"
                >
                Update
                </Button>
            </form>
            </Form>
        </div>
    )
}

export default UpdateDonorProfile;
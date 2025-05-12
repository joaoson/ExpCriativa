import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnimatedIcon from '@/components/AnimatedIcon';
import { ArrowLeft, Heart, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

const forgotSchema = z.object({
    email: z.string().email({ message: 'Invalid E-mail' }),
});
type ForgotData = z.infer<typeof forgotSchema>;

const ForgotPassword: React.FC = () => {
    const { toast } = useToast();
    const form = useForm<ForgotData>({
        resolver: zodResolver(forgotSchema),
    });

    const onSubmit = async (data: ForgotData) => {
        try {
            await axios.post('/api/auth/forgot-password', { email: data.email });
            toast({
                title: 'E-mail sent',
                description:
                    'Check your inbox to reset your password.',
            });
        } catch (err) {
            toast({
                title: 'Failed sending e-mail',
                description: 'Try again later.',
                variant: 'destructive',
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
                    <h1 className="text-3xl font-bold text-charity-dark mb-2">Forgot my password</h1>
                    <p className="text-charity-dark/70"> Please enter your registered email, and we will send you a recovery link.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-medium p-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Registered e-mail:
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="your-email@example.com"
                                        className="mt-1 block w-full rounded-md border-gray-300
                               shadow-sm focus:border-indigo-500
                               focus:ring focus:ring-indigo-200
                               focus:ring-opacity-50"
                                    />
                                    <FormMessage className="text-sm text-red-600 mt-1" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full py-6 bg-charity-blue hover:bg-charity-blue/90 text-white"
                        >
                            Send recovery e-mail
                        </Button>
                    </form>
                </Form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

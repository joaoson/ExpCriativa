import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Copy, QrCode } from 'lucide-react';
import { OrganizationResponse } from '@/models/OrganizationResponse';
import { DonationResponse } from '@/models/DonationResponse';

const donationSchema = z.object({
  amount: z.coerce
    .number({
      required_error: "Donation must be at least R$1.00",
      invalid_type_error: "Donation must be at least R$1.00",
    })
    .min(1, { message: "Donation must be at least R$1.00" })
    .transform(val => parseFloat(val.toFixed(2))),
  message: z.string().optional(),
});

interface DonationDialogProps {
  organization: OrganizationResponse;
  onClose: () => void;
}

export const DonationPayment: React.FC<DonationDialogProps> = ({ organization, onClose }) => {
  const [paymentStep, setPaymentStep] = useState<'form' | 'pix'>('form');
  const [pixCode, setPixCode] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [donationMessage, setDonationMessage] = useState("");

  const token = localStorage.getItem("accessToken")
  const userId = localStorage.getItem("userId")

  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: undefined,
    },
  });

  const handlePayment = (values: z.infer<typeof donationSchema>) => {
    const fakePixString = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}520400005303986540${values.amount.toFixed(2).length.toString().padStart(2, '0')}${values.amount.toFixed(2)}5802BR5925${organization.orgName.substring(0,25).padEnd(25, ' ')}6009SAO PAULO62070503***6304E4A9`;
    
    setPixCode(fakePixString);
    setDonationAmount(values.amount);
    setDonationMessage(values.message?.trim() ?? "No message inserted")
    setPaymentStep('pix');
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(pixCode);
    toast({
      title: "PIX Code Copied!",
      description: "You can now paste the code into your bank's app.",
    });
  };

  const insertDonation = async () => {
    const body = {
      donationMethod: "PIX",
      donationDate: new Date(),
      donationAmount: donationAmount,
      status: 1,
      donationIsAnonymous: false,
      donationDonorMessage: donationMessage,
      donorId: userId,
      orgId: organization.userId
    }

    try {
        const response = await fetch("https://localhost:7142/api/Donations", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(body)
        });

        const data: DonationResponse = await response.json();
        toast({
          title: "Payment Registered",
          description:`We received confirmation from your payment!`,
          variant: "default",
        });
        console.log(data)
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        toast({
          title: "Payment Failed",
          description:`There was an error and your payment didn't register: ${error}!`,
          variant: "destructive",
        });
    }

    onClose()
  }

  return (
    <div>
      {paymentStep === 'form' && (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (BRL)</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-charity-gray">R$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="50.00"
                          className="pl-10"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="A message to the organization..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full btn-primary py-6 mt-4">
                Generate PIX
              </Button>
            </form>
          </Form>
        </>
      )}

      {paymentStep === 'pix' && (
        <div className="text-center">
            <h3 className="text-xl font-bold text-charity-dark">Complete Your Donation</h3>
            <p className="text-charity-gray mb-4">Scan the QR code with your banking app.</p>
            <div className="flex justify-center my-6">
                <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`}
                    alt="PIX QR Code"
                    className="rounded-lg shadow-md"
                />
            </div>
            <p className="text-charity-gray text-sm mb-2">Or use the code below:</p>
            <div className="relative bg-gray-100 p-3 rounded-lg">
                <p className="text-xs text-charity-dark font-mono break-all pr-10">{pixCode}</p>
                <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2" onClick={handleCopyToClipboard}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
             <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button className="w-full btn-primary" onClick={insertDonation}>
                    I've Paid
                </Button>
            </div>
        </div>
      )}
    </div>
  );
};

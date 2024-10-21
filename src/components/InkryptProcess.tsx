import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createInscriptionOrder, getOrderStatus, makePaymentWithWallet } from '../utils/unisatApi';
import PaymentModal from './PaymentModal';
import { Loader2 } from 'lucide-react';

interface InkryptProcessProps {
  title: string;
  content: string;
  onClose: () => void;
}

const InkryptProcess: React.FC<InkryptProcessProps> = ({ title, content, onClose }) => {
  const [step, setStep] = useState<'disclaimer' | 'loading' | 'payment' | 'status'>('disclaimer');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setStep('loading');
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
      setStep('disclaimer');
      return;
    }

    try {
      const inscriptionContent = JSON.stringify({
        title,
        body: content,
        date: new Date().toISOString(),
        address: walletAddress,
      });

      const order = await createInscriptionOrder(inscriptionContent, 'text/plain', walletAddress);

      if (order && order.orderId) {
        setOrderId(order.orderId);
        setOrderStatus(order.status);
        setStep('payment');
        toast({
          title: "Inscription Order Created",
          description: "Your content has been prepared for inscription. Please complete the payment to finalize.",
        });
      } else {
        throw new Error('Failed to create inscription order');
      }
    } catch (error) {
      console.error('Error creating inscription:', error);
      toast({
        title: "Inscription Failed",
        description: "There was an error creating the inscription. Please try again.",
        variant: "destructive",
      });
      setStep('disclaimer');
    }
  };

  const handlePayment = async () => {
    if (!orderId) return;

    try {
      await makePaymentWithWallet(orderId);
      setStep('status');
      toast({
        title: "Payment Initiated",
        description: "Payment has been initiated. Please wait for confirmation.",
      });
    } catch (error) {
      console.error('Error making payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error making the payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (orderId && (orderStatus === 'pending' || orderStatus === 'payment_notenough')) {
      intervalId = setInterval(async () => {
        try {
          const status = await getOrderStatus(orderId);
          setOrderStatus(status.status);
          if (status.status === 'minted' || status.status === 'closed') {
            clearInterval(intervalId);
            toast({
              title: "Inscription Completed",
              description: "Your content has been successfully inscribed on the Bitcoin blockchain.",
            });
            onClose();
          }
        } catch (error) {
          console.error('Error checking order status:', error);
        }
      }, 10000); // Check every 10 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId, orderStatus, toast, onClose]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inkrypt Your Content</DialogTitle>
          <DialogDescription>
            {step === 'disclaimer' && "Inscribe your content to the Bitcoin blockchain."}
            {step === 'loading' && "Creating your inscription order..."}
            {step === 'payment' && "Complete the payment to finalize your inscription."}
            {step === 'status' && "Checking the status of your inscription."}
          </DialogDescription>
        </DialogHeader>
        {step === 'disclaimer' && (
          <>
            <div className="py-4">
              <p>By proceeding, you acknowledge that:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>Your content will be permanently inscribed on the Bitcoin blockchain.</li>
                <li>Once inscribed, the content cannot be altered or removed.</li>
                <li>The inscription process requires a payment in Bitcoin.</li>
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={onClose} variant="outline">Cancel</Button>
              <Button onClick={handleConfirm}>Confirm & Proceed</Button>
            </DialogFooter>
          </>
        )}
        {step === 'loading' && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Creating inscription order...</span>
          </div>
        )}
        {step === 'payment' && orderId && (
          <PaymentModal 
            orderId={orderId} 
            onClose={() => setStep('status')}
            onPayment={handlePayment}
          />
        )}
        {step === 'status' && (
          <div className="py-4">
            <p>Your inscription is being processed. Current status: {orderStatus}</p>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mt-4" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InkryptProcess;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createInscriptionOrder, getOrderStatus, getPaymentDetails } from '../utils/unisatApi';
import PaymentModal from './PaymentModal';

interface InkryptProcessProps {
  title: string;
  content: string;
  onClose: () => void;
}

const InkryptProcess: React.FC<InkryptProcessProps> = ({ title, content, onClose }) => {
  const [step, setStep] = useState<'disclaimer' | 'payment' | 'status'>('disclaimer');
  const [orderId, setOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleConfirm = async () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before inscribing.",
        variant: "destructive",
      });
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
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inkrypt Your Content</DialogTitle>
          <DialogDescription>
            {step === 'disclaimer' && "Inscribe your content to the Bitcoin blockchain."}
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
        {step === 'payment' && orderId && (
          <PaymentModal 
            orderId={orderId} 
            onClose={() => {
              setStep('status');
            }}
          />
        )}
        {step === 'status' && (
          <div>
            <p>Your inscription is being processed. Please wait...</p>
            {/* Add more detailed status information here */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InkryptProcess;
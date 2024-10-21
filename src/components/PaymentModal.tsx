import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getPaymentDetails, getOrderStatus } from '@/utils/unisatApi';

interface PaymentModalProps {
  orderId: string;
  onClose: () => void;
  onPayment: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ orderId, onClose, onPayment }) => {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [orderStatus, setOrderStatus] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const details = await getPaymentDetails(orderId);
        setPaymentDetails(details);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch payment details. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchPaymentDetails();
    const intervalId = setInterval(checkOrderStatus, 10000); // Check status every 10 seconds

    return () => clearInterval(intervalId);
  }, [orderId]);

  const checkOrderStatus = async () => {
    try {
      const status = await getOrderStatus(orderId);
      setOrderStatus(status.status);
      if (status.status === 'minted' || status.status === 'closed') {
        toast({
          title: "Payment Completed",
          description: "Your inscription has been successfully created!",
        });
        onClose();
      }
    } catch (error) {
      console.error('Error checking order status:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Complete Your Payment</h2>
      {paymentDetails ? (
        <div>
          <p className="mb-2">Amount: {paymentDetails.amount} sats</p>
          <p className="mb-4">Status: {orderStatus}</p>
          <Button onClick={onPayment} className="w-full mb-2">Pay with Connected Wallet</Button>
          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </div>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default PaymentModal;
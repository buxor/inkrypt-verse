import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPaymentDetails, getOrderStatus } from '@/utils/unisatApi';
import { useToast } from "@/components/ui/use-toast";

interface PaymentModalProps {
  orderId: string;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ orderId, onClose }) => {
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
    const intervalId = setInterval(checkOrderStatus, 5000); // Check status every 5 seconds

    return () => clearInterval(intervalId);
  }, [orderId]);

  const checkOrderStatus = async () => {
    try {
      const status = await getOrderStatus(orderId);
      setOrderStatus(status.status);
      if (status.status === 'completed') {
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
        </DialogHeader>
        {paymentDetails ? (
          <div>
            <p>Amount: {paymentDetails.amount} BTC</p>
            <p>Address: {paymentDetails.address}</p>
            <img src={`data:image/png;base64,${paymentDetails.qrcode}`} alt="Payment QR Code" />
            <p>Status: {orderStatus}</p>
          </div>
        ) : (
          <p>Loading payment details...</p>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
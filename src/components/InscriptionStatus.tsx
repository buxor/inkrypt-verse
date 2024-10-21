import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getOrderStatus } from '../utils/unisatApi';
import { Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface InscriptionStatusProps {
  inscription: {
    orderId: string;
    status: string;
    payAddress: string;
    amount: number;
    title: string;
    date: string;
  };
}

const InscriptionStatus: React.FC<InscriptionStatusProps> = ({ inscription }) => {
  const [status, setStatus] = useState(inscription.status);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (status !== 'minted' && status !== 'closed') {
        setIsLoading(true);
        try {
          const updatedStatus = await getOrderStatus(inscription.orderId);
          setStatus(updatedStatus.status);
          
          // Update status in localStorage
          const ongoingInscriptions = JSON.parse(localStorage.getItem('ongoingInscriptions') || '[]');
          const updatedInscriptions = ongoingInscriptions.map((insc: any) => 
            insc.orderId === inscription.orderId ? { ...insc, status: updatedStatus.status } : insc
          );
          localStorage.setItem('ongoingInscriptions', JSON.stringify(updatedInscriptions));
        } catch (error) {
          console.error('Error checking inscription status:', error);
        }
        setIsLoading(false);
      }
    };

    checkStatus();
    const intervalId = setInterval(checkStatus, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [inscription.orderId, status]);

  const formatBTCAmount = (sats: number) => {
    const btc = sats / 100000000;
    return btc.toFixed(8);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{inscription.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">Created on {new Date(inscription.date).toLocaleString()}</p>
        <p className="mb-2">Status: {isLoading ? <Loader2 className="inline animate-spin" /> : status}</p>
        {status === 'pending' && (
          <>
            <p className="mb-2">Payment required: {inscription.amount} sats ({formatBTCAmount(inscription.amount)} BTC)</p>
            <QRCodeSVG 
              value={`bitcoin:${inscription.payAddress}?amount=${formatBTCAmount(inscription.amount)}`} 
              size={150} 
              className="mb-2"
            />
            <p className="text-xs break-all">{inscription.payAddress}</p>
          </>
        )}
        {status === 'minted' && (
          <p className="text-green-600">Inscription completed successfully!</p>
        )}
        {status === 'closed' && (
          <p className="text-red-600">Inscription process closed or failed.</p>
        )}
        <Button 
          onClick={() => setIsLoading(true)} 
          disabled={isLoading || status === 'minted' || status === 'closed'}
          className="mt-4"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : 'Refresh Status'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InscriptionStatus;
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAddress, BitcoinNetworkType } from 'sats-connect';

const Header = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ['payment'],
          message: 'Address for receiving payments',
          network: {
            type: BitcoinNetworkType.Testnet
          },
        },
        onFinish: (response: { addresses: { address: string }[] }) => {
          setAddress(response.addresses[0].address);
          toast({
            title: "Wallet Connected",
            description: `Connected with address: ${response.addresses[0].address.slice(0, 10)}...`,
          });
        },
        onCancel: () => {
          toast({
            title: "Connection Cancelled",
            description: "Wallet connection was cancelled.",
            variant: "destructive",
          });
        },
      };

      await getAddress(getAddressOptions);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary">Inkrypt</Link>
        <nav>
          {address ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {`${address.slice(0, 6)}...${address.slice(-4)}`}
              </span>
              <Button onClick={handleDisconnect} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
                <LogOut className="mr-2 h-4 w-4" /> Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={handleConnect} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
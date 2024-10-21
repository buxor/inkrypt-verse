import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getAddress, BitcoinNetworkType, AddressPurpose } from 'sats-connect';

const Header = () => {
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  const handleConnect = async () => {
    try {
      const getAddressOptions = {
        payload: {
          purposes: ['ordinals', 'payment'] as AddressPurpose[],
          message: 'Address for Inkrypt',
          network: {
            type: BitcoinNetworkType.Mainnet
          },
        },
        onFinish: (response: { addresses: { address: string }[] }) => {
          const newAddress = response.addresses[0].address;
          setAddress(newAddress);
          localStorage.setItem('walletAddress', newAddress);
          toast({
            title: "Wallet Connected",
            description: `Connected with address: ${newAddress.slice(0, 10)}...`,
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
    localStorage.removeItem('walletAddress');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const isHomePage = location.pathname === '/';
  const logoSrc = isHomePage ? '/inkrypt-full-logo.svg' : '/inkrypt-icon.svg';
  const logoClass = isHomePage ? 'h-10' : 'h-8';

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src={logoSrc} alt="Inkrypt" className={`${logoClass} mx-auto object-cover`} />
        </Link>
        <nav className="flex items-center space-x-4">
          {address && (
            <Link to="/account" className="text-sm text-primary hover:underline">
              My Account
            </Link>
          )}
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
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Header = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature coming soon!",
    });
  };

  return (
    <header className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-yellow-500">Inkrypt</h1>
        <nav>
          <Button onClick={handleConnect} variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-black">
            Connect Wallet
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
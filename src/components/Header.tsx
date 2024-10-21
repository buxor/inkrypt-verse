import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from 'lucide-react';

const Header = () => {
  const { toast } = useToast();

  const handleConnect = () => {
    toast({
      title: "Wallet Connection",
      description: "Wallet connection feature coming soon!",
    });
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Inkrypt</h1>
        <nav>
          <Button onClick={handleConnect} variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">
            <LogIn className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
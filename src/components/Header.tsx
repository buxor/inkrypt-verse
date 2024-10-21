import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <Link to="/" className="text-2xl font-bold text-primary">Inkrypt</Link>
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
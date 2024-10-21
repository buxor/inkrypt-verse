import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleList from '@/components/ArticleList';
import { BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAddress, BitcoinNetworkType, AddressPurpose } from 'sats-connect';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartWriting = async () => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      // Clear any existing draft before navigating to the editor
      localStorage.removeItem('draftTitle');
      localStorage.removeItem('draftContent');
      navigate('/editor');
    } else {
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
            localStorage.setItem('walletAddress', newAddress);
            toast({
              title: "Wallet Connected",
              description: `Connected with address: ${newAddress.slice(0, 10)}...`,
            });
            navigate('/editor');
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-6">Immortalize your writing</h1>
          <p className="text-xl mb-8 text-muted-foreground">Decentralized publishing on the Bitcoin blockchain</p>
          <Button onClick={handleStartWriting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <BookOpen className="mr-2 h-4 w-4" /> Start Writing
          </Button>
        </section>
        <ArticleList />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
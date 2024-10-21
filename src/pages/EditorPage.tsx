import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Editor from '@/components/Editor';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const draft = location.state?.draft;

  const handleDiscard = () => {
    const walletAddress = localStorage.getItem('walletAddress');
    if (!walletAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet before discarding a draft.",
        variant: "destructive",
      });
      return;
    }

    if (draft?.id) {
      const allDrafts = JSON.parse(localStorage.getItem('drafts') || '[]');
      const updatedAllDrafts = allDrafts.filter((d: any) => !(d.id === draft.id && d.address === walletAddress));
      localStorage.setItem('drafts', JSON.stringify(updatedAllDrafts));

      toast({
        title: "Draft Discarded",
        description: "Your draft has been successfully discarded.",
      });
    }

    navigate('/account');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Editor 
          initialTitle={draft?.title || ''} 
          initialContent={draft?.content || ''} 
          draftId={draft?.id || null}
        />
        <div className="fixed bottom-8 left-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="rounded-full px-6 py-3 shadow-lg transition-all duration-200">
                Discard
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently discard your draft.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDiscard}>Discard</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditorPage;
import { useState } from 'react';

import { AppHeader } from '@/components/layouts';
import { SignUpForm, TermsContent } from '@/components/signup';

export const SignUpPage = () => {

  const [isAgreed, setIsAgreed] = useState<{ service: boolean; privacy: boolean } | null>(null);

  const handleAgreed = (agreements: { service: boolean; privacy: boolean }) => {
    setIsAgreed(agreements);
  };

  const [tosId, setTosId] = useState<string | undefined>("");
  const [topId, setTopId] = useState<string | undefined>("");

  return (
   <div className="min-h-svh flex flex-col">
      <header className="sticky top-0 z-10 flex justify-end p-4 bg-background">
        <AppHeader />
      </header>
      <main className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable_both-edges] pb-16">
        {!isAgreed ? (
          <TermsContent 
            onAgreed={handleAgreed}
            setTosId={setTosId}
            setTopId={setTopId}
          />
        ) : (
          <SignUpForm 
            agreements={isAgreed}
            tosId={tosId}
            topId={topId}
          />
        )}
      </main>
    </div>
  );
};

export default SignUpPage;

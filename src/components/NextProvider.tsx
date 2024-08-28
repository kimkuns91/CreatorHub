'use client';

import { QueryClient, QueryClientProvider } from 'react-query';

import GoogleAnalytics from '@/lib/googleAnalytics';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from 'react-query/devtools';
import { RecoilRoot } from 'recoil';
import Sidebar from './SideBar';

interface Props {
  children?: React.ReactNode
}

const queryClient = new QueryClient();

export const NextProvider = ({ children }: Props) => {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GoogleAnalytics />
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </RecoilRoot>
  );
};

export const NextLayout = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between max-w-7xl mx-auto">
      <div className="hidden sm:inline border-r h-screen sticky top-0 w-[16rem]">
        <Sidebar setIsOpen={setIsOpen} />
      </div>
      <div className="w-2xl flex-1">{children}</div>
      <div className="lg:flex-col p-3 h-screen border-l hidden lg:flex w-[24rem]">
        <div className="sticky top-0 bg-white py-2">
          <input
            type="text"
            placeholder="검색"
            className="bg-gray-100 border border-gray-200 rounded-3xl text-sm w-full px-4 py-2"
          ></input>
        </div>
        {/* <News /> */}
      </div>
      {/* <ModalMenu isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
    </div>
  );
};

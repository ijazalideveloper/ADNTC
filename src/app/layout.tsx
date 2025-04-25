import React from 'react';
import { Metadata } from 'next';
import Providers from '@/components/providers/Providers';
import AppLayout from '@/components/layout/AppLayout';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'A web-based Task Manager application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-container">
            <AppLayout>{children}</AppLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
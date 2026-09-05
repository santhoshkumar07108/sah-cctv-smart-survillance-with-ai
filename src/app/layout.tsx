'use client';

import React from 'react';
import './globals.css';
import { DemoSimulationProvider } from '@/context/DemoSimulationContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>IBVAP — Intelligent Border Video Analytics Platform | Sashastra Seema Bal</title>
        <meta
          name="description"
          content="Government-grade AI surveillance dashboard for India's Sashastra Seema Bal (SSB) border security forces."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-[#0A0E1A] text-[#E2E8F0] antialiased min-h-screen overflow-x-hidden selection:bg-[#00E5FF] selection:text-[#0A0E1A]">
        <DemoSimulationProvider>
          {children}
        </DemoSimulationProvider>
      </body>
    </html>
  );
}



'use client';

import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Push Notification App",
//   description: "Send push notifications to your users",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createPagesBrowserClient());

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionContextProvider supabaseClient={supabaseClient} initialSession={null}>
          {children}
        </SessionContextProvider>
      </body>
    </html>
  )
}

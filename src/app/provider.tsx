"use client"
import { ThemeProvider } from '@/components/theme_provider'
import { NextUIProvider } from '@nextui-org/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableSystem
    >
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  )
}

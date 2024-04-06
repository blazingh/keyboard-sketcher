"use client"
import { createContext, useState } from 'react';

const initialOptions = {
  renderOuline: true as boolean
}

type contextType = {
  options: typeof initialOptions
  updateOption: <K extends keyof typeof initialOptions>(key: K, value: typeof initialOptions[K]) => void
}

export const workSpaceOptionsContext = createContext<contextType | null>(null);

export function WorkSpaceOtpionsContextProvider({ children }: any) {

  const [options, setOptions] = useState(initialOptions)

  const updateOption: contextType['updateOption'] = (key, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: value
    }));
  };

  return (
    <workSpaceOptionsContext.Provider value={{ options, updateOption }}>
      {children}
    </workSpaceOptionsContext.Provider>
  )
}


"use client"
import { createContext, useState } from 'react';

const initialOptions = {
  renderOuline: true as boolean,
  showNodeController: true as boolean,
  openBar: "" as "" | "left" | "right",
  selectActiv: true as boolean,
  multiselection: true as boolean,
}

type contextType = {
  options: typeof initialOptions
  updateOption: <K extends keyof typeof initialOptions>(key: K, value: typeof initialOptions[K]) => void
}

export const workSpaceContext = createContext<contextType | null>(null);

export function WorkSpaceContextProvider({ children }: any) {

  const [options, setOptions] = useState(initialOptions)

  const updateOption: contextType['updateOption'] = (key, value) => {
    setOptions(prevOptions => ({
      ...prevOptions,
      [key]: value
    }));
  };

  return (
    <workSpaceContext.Provider value={{ options, updateOption }}>
      {children}
    </workSpaceContext.Provider>
  )
}


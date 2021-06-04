import { createContext, ReactNode, useEffect, useState, useContext, MouseEventHandler } from 'react';

interface DashboardProviderProps {
   children: ReactNode;
}

interface DashboardContextData {

}

export const DashboardContext = createContext({} as DashboardContextData);

export function DashboardProvider ({ children } : DashboardProviderProps) {

   return <DashboardContext.Provider value={{ 

   }}>
      {children}
   </DashboardContext.Provider>
}

export const useDashboard = () => useContext(DashboardContext)
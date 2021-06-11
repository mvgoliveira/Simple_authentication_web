import { createContext, ReactNode, useState, useContext } from 'react';
import Router from 'next/router';
import jwt from 'jsonwebtoken';

import { api } from '../services/api';
import Cookies from 'js-cookie';

interface AuthProviderProps {
   children: ReactNode;
}

type User = {
   id: string;
   name: string;
   email: string;
   admin: boolean;
}

interface AuthContextData {
   isValidating: boolean;
   error: boolean;
   login: (email: string, password: string) => void;
   loadUserFromCookies: (userData: User) => void;
   logout: () => void;
   setError: (value: boolean) => void;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider ({ children } : AuthProviderProps) {
   const [isValidating, setIsValidating] = useState(false);
   const [error, setError] = useState(false);
   
   async function loadUserFromCookies(userData: User) {
      
   }

   const login = async (email: string, password: string) => {
      setIsValidating(true);
      let userData = null;
      
      try {
         const { data } = await api.post('/login', { email, password });
         Cookies.set('token', data.token, { expires: 60 });
         api.defaults.headers.Authorization = `Bearer ${data.token}`

         const verify = jwt.verify(data.token, process.env.TOKEN_SECRET);

         userData = { 
            id: verify.id, 
            name: verify.name, 
            email,
            admin: verify.admin
         };

         if (userData) {
            Router.replace("/dashboard/1");
            setIsValidating(false);
         }

      } catch (error) {
         setError(true);  
         setIsValidating(false);
      }
   }

   const logout = async () => {
      Cookies.remove('token');
      delete api.defaults.headers.Authorization
      Router.replace("/")
   }

   return <AuthContext.Provider value={{ 
      error,
      isValidating,
      login,
      logout,
      loadUserFromCookies,
      setError
   }}>
      {children}
   </AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
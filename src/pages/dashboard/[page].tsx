import { GetServerSideProps } from 'next';
import jwt from 'jsonwebtoken';

import { api } from '../../services/api';

import UserDashboard  from './_user';
import AdminDashboard  from './_admin';

export default function dashboard ({ admin, usersData, page }) {

   return (
      admin === false 
         ? <UserDashboard/> //true
         : <AdminDashboard usersData={usersData} page={page}/> //false
   )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
   
   const { token } = req.cookies;
   const { page } = params;

   let users = null;  
   let admin = null;

   try {
      if (token) {
         const verify = jwt.verify(token, process.env.TOKEN_SECRET);
         admin = verify.admin;

         if (admin === true) {
            users = await api.get(`/users/${page}`, { headers: {'Authorization': `Bearer ${token}`} });
            
            if (Number(page) <= 0) {
               return {
                  redirect: {
                     permanent: false,
                     destination: `/dashboard/1`
                  }
               }
            } else {
               
            }

            if (users.data.users.length <= 0) {
               return {
                  redirect: {
                     permanent: false,
                     destination: `/dashboard/${Number(page) - 1}`
                  }
               }
            }

            return {
               props: {
                  admin, 
                  usersData: users.data.users,
                  page
               },
            }
         } else {
            return {
               props: {
                  admin
               },
            }
         }
      }   
   } catch (error) {
      return {
         redirect: {
            permanent: false,
            destination: '/'
         }
      }
   }

   return {
      redirect: {
         permanent: false,
         destination: '/'
      }
   }
}
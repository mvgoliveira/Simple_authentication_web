import { GetServerSideProps } from "next";

export default function dashboard() {}

export const getServerSideProps: GetServerSideProps = async () => {
   return {
      redirect: {
         permanent: false,
         destination: `/dashboard/1`
      }
   }
}
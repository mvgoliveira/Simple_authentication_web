import { useRouter } from "next/router";
import { useEffect } from "react";

function Redirect({ to }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);  
  }, [to]);

  return null;
}

export { Redirect }
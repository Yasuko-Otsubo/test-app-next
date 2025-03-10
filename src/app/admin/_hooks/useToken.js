import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { useRouter } from "next/navigation";

const useToken = () => {
  const { token } = useSupabaseSession();
  const router = useRouter();

  if(token) {
    alert("トークンが無効です");
    router.push('../../login')
  }
  return token;
};

export default useToken;
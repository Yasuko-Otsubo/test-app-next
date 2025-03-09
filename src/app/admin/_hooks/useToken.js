import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const useToken = () => {
  const { token } = useSupabaseSession();

  if(token) {
    alert("トークンが無効です");
    Router.push('../../login')
  }
  return token;
};

export default useToken;
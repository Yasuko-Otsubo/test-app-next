import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react"

export const useSupabaseSession = () => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect (() => {
    const fetcher = async () => {
      const {
        data: { session } ,
      } = await supabase.auth.getSession()
      setSession(session)
      setToken(session?.access_token || null)
      setIsLoading(false)
    }
    fetcher();

    //ログイン状態の監視
    //onAuthStateChange() は Supabase の 認証状態（ログイン・ログアウト）の変更を監視 する関数
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setToken(session?.access_token || null);
    });
    return () => {
      //監視を解除する
      authListener.subscription.unsubscribe();
    }
  }, [])
  return {session, isLoading, token}
}
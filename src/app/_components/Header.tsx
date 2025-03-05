"use client";

import Link from 'next/link'
import React from 'react'
import { useSupabaseSession } from '../_hooks/useSupabaseSession'
import { supabase } from '@/utils/supabase';
import styles from "./styles.module.css";

export const Header: React.FC = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const { session, isLoding } = useSupabaseSession()

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.h_link}>
        Blog
      </Link>
      {!isLoding && (
        <div className={styles.h_right}>
          {session ? (
            <>
              <Link href="/admin" className={styles.h_link}>
                管理画面
              </Link>
              <button onClick={handleLogout}>ログアウト</button>
            </>
          ) : (
            <>
              <Link href="/contact" className={styles.h_link}>
                お問い合わせ
              </Link>
              <Link href="/login" className={styles.h_link}>
                ログイン
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
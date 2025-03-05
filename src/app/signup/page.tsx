'use client'

import { supabase } from '@/utils/supabase' // 前の工程で作成したファイル
import { useState } from 'react'
import styles from '../page.module.css'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/login`,
      },
    })
    if (error) {
      console.error(error);
      alert('登録に失敗しました')
    } else {
      setEmail('')
      setPassword('')
      alert('確認メールを送信しました。')
    }
  }

  return (
    <div className={styles.signUp}>
      <form onSubmit={handleSubmit} className={styles.S_form}>
        <div className={styles.S_list}>
          <label
            htmlFor="email"
            className={styles.S_label}
          >
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className={styles.S_input}
            placeholder="name@company.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className={styles.S_label}
          >
            パスワード
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className={styles.S_input}
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <button
            type="submit"
            className={styles.S_btn}
          >
            登録
          </button>
        </div>
      </form>
    </div>
  )
}
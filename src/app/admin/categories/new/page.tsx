"use client";

import React, { useState } from "react";
import styles from "../_styles/categories.module.css"
import { useRouter } from "next/navigation";

const CategoryNewPage: React.FC = () => {
  const [name, setName] = useState("");
  const router = useRouter();

    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
  
  try {
    const res = await fetch('/api/admin/categories', {
      method : 'POST',
      headers : { 'Content-Type' : 'application/json'},
      body : JSON.stringify({ name }),
    });

    if(res.ok) {
      router.push('/admin/categories');
    } else {
      alert("投稿に失敗しました");
    }
  } catch ( error ) {
    console.log("エラー:" , error);
  }
};
  return (
    <>
    <div className={styles.main}>
    <h2>カテゴリー作成</h2>
      <form onSubmit={handleSubmit}>
      <div className={styles.n_article}>
        <label>カテゴリー</label>
        <input type="text" id="category" value={name} onChange={(e) => setName(e.target.value)}/>
      </div>
      <div className={styles.n_btn}>
        <button type="submit" className={styles.put}>作成</button>
      </div>

      </form>
    </div>


    </>
  );
}
export default CategoryNewPage;

"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../../_styles/main.module.css";
import { Category } from "@/_types/Categories";

const BlogNewPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [categories, setCategories] = useState<{ id: number }[]>([]); // カテゴリーをオブジェクトの配列として管理
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const res = await fetch(`/api/admin/categories`);
        const data = await res.json();
        setAllCategories(data.categories);
      } catch ( error ) {
        console.log("カテゴリー取得失敗", error);
        alert("カテゴリーを取得できません");
      }
    };

    fetchCategories();
  },[]);

  //カテゴリー選択
  const handleChangeCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectId = Number(e.target.value);
    setCategories([{id: selectId}]);
  };

  //ページがリロードされないように e.preventDefault() を呼び出す
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, thumbnailUrl, categories }),
      });

      if (res.ok) {
        router.push(`/admin/posts`);
      } else {
        const errorData = await res.json(); // エラーメッセージを取得
        alert(`投稿に失敗しました: ${errorData.message}`); // エラーメッセージを表示
      }
    } catch (error) {
      console.log("エラー:", error);
    }
    
  };


  return (
    <>
      <div className={styles.n_main}>
        <form onSubmit={handleSubmit}>
          <h2>記事作成</h2>
          <div className={styles.n_article}>
            <label>タイトル</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>内容</label>
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>サムネイルURL</label>
            <input
              type="text"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>カテゴリー</label>
            <select
             value={categories[0]?.id || ""}
             
             onChange={handleChangeCategory}>
              <option value="">カテゴリー選択</option>
             {allCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
             ))}
           </select>
          </div>
          <div className={styles.n_btn}>
            <button type="submit" className={styles.link}>作成</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogNewPage;

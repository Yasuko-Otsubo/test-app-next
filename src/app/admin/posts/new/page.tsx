"use client";

import React, { useState, useEffect, FormEvent } from "react";
import styles from "../_styles/main.module.css";
import { useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/app/_types/Categories";

const BlogNewPage: React.FC = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectCategories, setSelectCategories] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // カテゴリー 一覧取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories`);
        const data: { categories : Category[]} = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.log("カテゴリーの取得失敗", error);
      }
    };
    fetchCategories();
  }, []);

  // POST
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/admin/posts`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: selectCategories.map((id) => ({ id })),
        }),
      });
      alert("新規作成しました");
      router.push("/admin/posts");
    } catch (error) {
      console.log("新規作成失敗", error);
      alert("新規作成に失敗しました");
    }
  };

  return (
    <div className={styles.n_main}>
      <h2>新規作成</h2>
      <PostForm
        mode="new"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        categories={allCategories}
        selectCategories={selectCategories}
        setSelectCategories={setSelectCategories}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BlogNewPage;

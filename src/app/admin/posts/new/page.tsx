"use client";

import React, { useState, FormEvent } from "react";
import styles from "../_styles/main.module.css";
import { useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

const BlogNewPage: React.FC = () => {
  const router = useRouter();
  const { token } = useSupabaseSession();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailImageKey, setThumbnailImageKey] = useState("");
  const [selectCategories, setSelectCategories] = useState<number[]>([]);

  // POST
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if(!token) return;

    try {
      await fetch(`/api/admin/posts`, {
        method: "POST",
        headers: { 
          "Content-type": "application/json",
          Authorization: token,
       },
        body: JSON.stringify({
          title,
          content,
          thumbnailImageKey,
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
        thumbnailImageKey={thumbnailImageKey}
        setThumbnailImageKey={setThumbnailImageKey}
        selectCategories={selectCategories}
        setSelectCategories={setSelectCategories}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default BlogNewPage;

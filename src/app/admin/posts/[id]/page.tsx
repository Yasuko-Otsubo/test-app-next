"use client";

import React, { useEffect, useState } from "react";
import styles from "../_styles/main.module.css";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/app/_types/Categories";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";

type FormValue = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: number[];
};

interface Post {
  title: string;
  content: string;
  thumbnailImageKey: string;
  postCategories: { category: Category }[];
}

interface ApiResponse {
  post: Post;
}

const BlogEditPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useSupabaseSession();
  const [initialData, setInitialData] = useState<FormValue | undefined>(undefined);


  // GET
  useEffect(() => {
    if(!token) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
        );

        const data: ApiResponse = await res.json();
        const formatted: FormValue = {
          title: data.post.title,
          content: data.post.content,
          thumbnailImageKey: data.post.thumbnailImageKey,
          categories: data.post.postCategories.map((c) => c.category.id),
        };
        setInitialData(formatted);
      } catch (error) {
        console.log("記事の取得失敗", error);
        alert("記事取得できませんでした。");
      }
    };
    fetchPost();
  }, [id, token]);


  // PUT
  const handleSubmit = async (data: FormValue) => {
    if(!token) return; 
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { 
          "Content-type": "application/json",
          Authorization: token,
         },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          thumbnailImageKey: data.thumbnailImageKey,
          categories: data.categories.map((id) => ({ id })),
        }),
      });
      alert("更新しました");
      router.push("/admin/posts");
    } catch (error) {
      console.log("更新失敗", error);
      alert("更新に失敗しました");
    }
  };


  // DELETE
  const handleDelete = async () => {
    if(!token) return;
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        }
      });
      alert("記事を削除しました");
      router.push("/admin/posts");
    } catch (error) {
      console.log("記事削除失敗", error);
      alert("記事の削除を失敗しました");
    }
  };

  return (
    <div className={styles.n_main}>
      <h2 className={styles.h2}>記事編集</h2>
      {initialData ? (
      <PostForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    ) : (
      <p>読み込み中...</p>
    )}
    </div>
  );
};

export default BlogEditPage;

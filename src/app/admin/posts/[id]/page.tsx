"use client";

import React, { useState, useEffect, FormEvent } from "react";
import styles from "../_styles/main.module.css";
import { useParams, useRouter } from "next/navigation";
import { PostForm } from "../_components/PostForm";
import { Category } from "@/app/_types/Categories";


interface Post {
  title: string;
  content: string;
  thumbnailUrl: string;
  postCategories: { category: Category }[];
}

interface ApiResponse {
  post: Post;
}

const BlogEditPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectCategories, setSelectCategories] = useState<number[]>([]);
  //const [allCategories, setAllCategories] = useState<Category[]>([]);

  // GET
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        const data: ApiResponse = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailUrl(data.post.thumbnailUrl);
        setSelectCategories(
          data.post.postCategories.map((c) => c.category.id)
        );
      } catch (error) {
        console.log("記事の取得失敗", error);
        alert("記事取得できませんでした。");
      }
    };
    fetchPost();
  }, [id]);


  // PUT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          thumbnailUrl,
          categories: selectCategories.map((id) => ({ id })),
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
    try {
      await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
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
      <h2>記事編集</h2>
      <PostForm
        mode="edit"
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        thumbnailUrl={thumbnailUrl}
        setThumbnailUrl={setThumbnailUrl}
        //allCategories={allCategories}
        selectCategories={selectCategories}
        setSelectCategories={setSelectCategories}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BlogEditPage;

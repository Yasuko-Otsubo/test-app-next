"use client";

import React, { useState, useEffect, FormEvent } from "react";
import styles from "../../_styles/main.module.css";
import { useParams, useRouter } from "next/navigation";
import { Category } from "@/app/_types/Categories";

const BlogEditPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [selectCategories, setSelectCategories] = useState<number[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  //GET
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        const data = await res.json();
        //取得したものそれぞれにセット
        setTitle(data.post.title);
        setContent(data.post.content);
        setThumbnailUrl(data.post.thumbnailUrl);
        setSelectCategories(
          data.post.postCategories.map((c: any) => c.category.id)
        );
      } catch (error) {
        console.log("記事の取得失敗", error);
        alert("記事取得できませんでした。");
      }
    };
    fetchPost();
  }, [id]);

  //カテゴリー 一覧取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/admin/categories`);
        const data = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.log("カテゴリーの取得失敗", error);
      }
    };
    fetchCategories();
  }, []);

  //PUT
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

  //DELETE
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
    <>
      <div className={styles.n_main}>
        <h2>記事編集</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.n_article}>
            <label>タイトル</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>内容</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>サムネイルURL</label>
            <input
              type="text"
              id="thumbnailUrl"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />
          </div>
          <div className={styles.n_article}>
            <label>カテゴリー</label>
            <select
              id="category"
              value={selectCategories.map(String)} // IDの配列を文字列に
              onChange={(e) =>
                setSelectCategories(
                  Array.from(e.target.selectedOptions).map((opt) =>
                    Number(opt.value)
                  )
                )
              }
              multiple
            >
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.e_btn}>
            <button type="submit" className={styles.put}>
              更新
            </button>
            <button
              type="button"
              className={styles.delete}
              onClick={handleDelete}
            >
              削除
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BlogEditPage;

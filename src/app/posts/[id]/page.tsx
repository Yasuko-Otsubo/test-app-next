"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "../styles/styles.module.css"; // スタイルを適切にインポート
import Image from "next/image";
import { Post } from "@/app/_types/post";
import { supabase } from "@/utils/supabase";

const BlogPage: React.FC = () => {
  const { id } = useParams(); // IDを取得
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/posts/${id}`); // 特定の投稿を取得
        if (!res.ok) {
          throw new Error("記事取得に失敗しました");
        }
        const { post } = await res.json(); // APIレスポンスからpostを取得
        setPost(post);
      } catch (error) {
        console.log("記事取得失敗", error);
        setError("記事取得に失敗しました。"); // エラーメッセージを設定
      } finally {
        setLoading(false);
      }
    };
    fetcher();
  }, [id]);

  useEffect(() => {
    if (!post?.thumbnailImageKey) return; // thumbnailImageKeyがない場合は処理を中断
    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from("post_thumbnail")//supabase name envで確認できる
        .getPublicUrl(post.thumbnailImageKey); //がぞうのurl

      setThumbnailImageUrl(publicUrl);
    };

    fetcher();
  }, [post?.thumbnailImageKey]);



  if (loading) {
    return <p className={styles.b_p}>記事読み込み中...</p>;
  }

  if (error) {
    return <p className={styles.b_p}>{error}</p>; // エラーメッセージを表示
  }

  if (!post) {
    return <p className={styles.b_p}>記事がありません</p>;
  }

  const formContent = (content: string) => {
    return content.split('\n').reduce<React.ReactNode[]>((acc, item, index) => {
      return acc.concat(item, <br key={index} />);
    }, []);
  };
  return (
    <>
      <div className={styles.blogpage}>
        <Image
          className={styles.b_img}
          //▲a
          src={thumbnailImageUrl || 'https://placehold.jp/800x400.png'} // URLの形式を確認
          width={800}
          height={400}
          alt={post.title}
        />
        <div className={styles.b_sub}>
          <div className={styles.b_time}>
            {post.createdAt?.substring(0, 10).replace(/-/g, "/")}{" "}
            {/* 日付のフォーマット */}
          </div>
          <div className={styles.b_category}>
            {post.postCategories.map((category) => (
              <div className={styles.b_cate_area} key={category.category.id}>
                {category.category.name}
              </div>
            ))}
          </div>
        </div>
        <h2 className={styles.h2}>{post.title}</h2>
        <div className={styles.content} >
        {formContent(post.content)}
        </div>
      </div>
    </>
  );
};

export default BlogPage;

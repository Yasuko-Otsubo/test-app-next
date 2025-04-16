"use client";

import { useEffect, useState } from "react";
import styles from "./_styles/page.module.css";
import Link from "next/link";
import { MicroCmsPost } from "./_types/MicroCmsPost";


type MicroCmsResponse = {
  posts: MicroCmsPost[];
};

// テキストの文字数と改行文字の変換
const truncateText = (text: string, maxLength: number) => {
  // <br>タグを改行文字に変換
  const cleanText = text.replace(/<br\s*\/?>/g, "\n").trim();
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  return cleanText.substring(0, maxLength) + "...";
};

const Home: React.FC = () => {
  // データ用の状態管理
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("/api/posts");

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data: MicroCmsResponse = await res.json();
        console.log("Fetched Data:", data); // データの構造を確認


        if (!data.posts) {
          throw new Error("No contents found");
        }

        setPosts(data.posts);
      } catch (error) {
        console.error("Fetch error:", error);
        setPosts([]); // エラー時に空の配列を設定
      }
    };

    fetcher();
  }, []);

  if (posts === null) {
    return <p className={styles.h_loading}>データ取得中・・・</p>;
  }
  if (posts.length === 0) {
    return <p className={styles.h_loading}>ブログが見つかりません。</p>;
  }

  if (Array.isArray(posts) && posts.length > 0) {
  return (
    <div className={styles.h_main}>
      {posts.map((post) => (
        <article className={styles.h_sec} key={post.id}>
          <Link className={styles.h_link} href={`/posts/${post.id}`}>
            <div className={styles.h_sec_upper}>
              <time className={styles.h_time}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
              <div className={styles.h_category}>
                {post.categories?.map((category) => (
                  <div className={styles.h_cate_area} key={category.id}>
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
            <h2 className={styles.h2}>{post.title}</h2>
            <p
              className={styles.h_p}
              dangerouslySetInnerHTML={{
                __html: truncateText(post.content, 56),
              }}
            ></p>
          </Link>
        </article>
      ))}
    </div>
  );
};
}

export default Home;

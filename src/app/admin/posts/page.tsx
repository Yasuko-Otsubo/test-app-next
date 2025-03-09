"use client";

import { useState, useEffect } from "react";
import styles from "./_styles/main.module.css";
import Link from "next/link";
import { Post } from "@/app/_types/post";
import useToken from "@/app/admin/_hooks/useToken";

//GET
const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const token = useToken();

  useEffect(() => {
    //console.log("token:", token);
    if (!token) return;

    const fetchPost = async () => {
      try {
      const res = await fetch("/api/admin/posts",{
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
    });
      const { posts } = await res.json();
      setPosts([...posts]);
    } catch (error) {
      console.error("APIエラー:", error);
    }
  };

  fetchPost();
}, [token]);

  return (
    <div className={styles.main}>
      <div className={styles.upper}>
        <h2>記事一覧</h2>
        <Link href={`/admin/posts/new`} className={styles.link}>
          <div className={styles.new}>新規作成</div>
        </Link>
      </div>
      <div className={styles.m_list}>
        {posts.map((post) => (
          <ul className={styles.inner} key={post.id}>
            <Link href={`posts/${post.id}`} className={styles.link}>
              <h3>{post.title}</h3>
              <li>{new Date(post.createdAt).toLocaleDateString()}</li>
            </Link>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default PostPage;

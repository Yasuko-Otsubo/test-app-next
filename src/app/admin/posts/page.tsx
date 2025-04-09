"use client";

import { useState, useEffect } from "react";
import styles from "./_styles/main.module.css";
import Link from "next/link";
import { Post } from "@/app/_types/post";

//GET
const PostPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch("/api/posts");
      const { posts } = await res.json();
      setPosts(posts);
    };

    fetchPost();
  }, []);

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

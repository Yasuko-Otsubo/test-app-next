"use client";

import { useEffect, useState } from "react";
import styles from "../styles/styles.module.css";
import { useParams } from "next/navigation";
//import Header from "@/app/_components/Header";
import Image from "next/image";
import { MicroCmsPost } from "@/app/_types/MicroCmsPost";

//APIレスポンスがどのようなデータ構造を持つかを定義
//type ApiResponse = {
//  post: Post;
//};

//投稿データの構造を定義
//type Post = {
//  id: string;
//  title: string;
//  content: string;
//  createdAt: string;
//  thumbnailUrl: string;
//  categories: string[];
//};

const BlogPage: React.FC = () => {
  const { id } = useParams(); // URLが/posts/1の場合、idには1が格納されます
  //component→ヘッダなど使いまわし系

  //データ用の状態管理
  const [post, setPost] = useState<MicroCmsPost | null>(null); //nullをいれるのはまだ値が設定されていない状態を表現するため
  const [loading, setLoading] = useState(true);
  //const [error, setError] = useState<string | null>(null);

  ///////////////////////コンポーネントが初期化される、またはidが変更されるとuseEffectが実行///////////////////////
  useEffect(() => {
    const fetcher = async () => {

      const res = await fetch(
        `https://vz534fnsc5.microcms.io/api/v1/posts/${id}`,　// microCMSのエンドポイント
        {
          headers: {
            'X-MICROCMS-API-KEY': '7cesolS8yyb8n8dZUEtFK7JIklzEwu4jVH9t', // APIキーをセット
          },
        },
      )
      const data = await res.json()
      setPost(data) // dataをそのままセット
      setLoading(false)
    }

    fetcher()
  }, [id])

  // エラーハンドリング
//  if (error) {
//    return <p className={styles.b_p}>{error}</p>;
//  }
if(loading) {
    return <p className={styles.b_p}>記事読み込み中</p>;
}
if(post === null) {
  return <p className={styles.b_p}>記事ありません</p>;
}

  return (
    <>
      <div className={styles.blogpage}>
          <>
            <Image
              className={styles.b_img}
              src={post.thumbnail.url}
              width={800}
              height={400}
              alt="Thumbnail"
            />
            <div className={styles.b_sub}>
              <time className={styles.b_time}>
                {new Date(post.createdAt).toLocaleDateString()}
              </time>
              <div className={styles.b_category}>
                {post.categories?.map((category) => (
                  <div className={styles.b_cate_area} key={category.id}>
                    {category.name}
                  </div>
                ))}
              </div>
            </div>
            <h2 className={styles.h2}>{post.title}</h2>
            <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
          </>
      </div>
    </>
  );
};
export default BlogPage;

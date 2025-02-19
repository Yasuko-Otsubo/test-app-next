"use client";

import React, { FormEvent, useEffect, useState } from "react";
import styles from "../_styles/categories.module.css"
import { useParams, useRouter } from 'next/navigation';
import { PostForm } from "../_components/PostForm";

type Category = { name: string };

const EditCategoryPage = () => {
  const [name, setName] = useState('');
  const { id } = useParams();
  const router = useRouter();
  console.log("取得したID:", id); // デバッグ用


  //GET
  useEffect(() => {
    const fetchPost = async() => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`);
        const data: { category: Category } = await res.json();
        setName(data.category.name);
      } catch ( error ) {
        console.log("カテゴリーの取得失敗", error);
        alert("カテゴリーの取得に失敗しました");
      }
    };
    fetchPost();
  }, [id]);

  //

  //PUT
  const handleSubmit = async(e:FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/admin/categories/${id}`,{
        method : "PUT",
        headers : {"Content-type" : "application/json"},
        body : JSON.stringify({
          name
        }),
      });
        alert("更新しました");
        router.push("/admin/categories");
      } catch ( error ) {
        console.log("更新失敗" , error);
        alert("更新失敗しました")
      }
    };

    //DELETE
    const handleDelete = async() => {
      try {
        await fetch(`/api/admin/categories/${id}`, {
          method : "DELETE",
        });
        alert("削除しました");
        router.push("/admin/categories");
      } catch ( error ) {
        console.log("削除失敗", error);
        alert("削除失敗しました")
      }
    };
  
  return (
    <>
    <div className={styles.main}>
    <h2>カテゴリー編集</h2>
    <PostForm 
      mode="edit"
      name={name}
      setName={setName}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      />
    </div>


    </>
  );
};

export default EditCategoryPage;

"use client";

import React, { useEffect, useState } from "react";
import styles from "../_styles/categories.module.css";
import { useParams, useRouter } from "next/navigation";
import { CategoryForm } from "../_components/CategoryForm";
import { useSupabaseSession } from "@/app/_hooks/useSupabaseSession";
import { SubmitHandler } from "react-hook-form";

type FormValue = { name: string };

const EditCategoryPage = () => {
  const [initialName, setInitialName] = useState(""); 
  const { id } = useParams();
  const router = useRouter();
  console.log("取得したID:", id); // デバッグ用
  const { token } = useSupabaseSession();

  //GET
  useEffect(() => {
    if(!token) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/admin/categories/${id}`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        const data: { category: FormValue } = await res.json();
        setInitialName(data.category.name);
      } catch (error) {
        console.log("カテゴリーの取得失敗", error);
        alert("カテゴリーの取得に失敗しました");
      }
    };
    fetchCategory();
  }, [id, token]);

  //PUT
  const handleSubmit: SubmitHandler<FormValue> = async(data) => {
    if(!token) return;
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
           "Content-type": "application/json",
          Authorization: token,
         },
        body: JSON.stringify({
          name: data.name,
        }),
      });
      alert("更新しました");
      router.push("/admin/categories");
    } catch (error) {
      console.log("更新失敗", error);
      alert("更新失敗しました");
    }
  };

  //DELETE
  const handleDelete = async () => {
    if(!token) return;
    try {
      await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        }
      });
      alert("削除しました");
      router.push("/admin/categories");
    } catch (error) {
      console.log("削除失敗", error);
      alert("削除失敗しました");
    }
  };

  return (
    <>
      <div className={styles.main}>
        <h2 className={styles.h2}>カテゴリー編集</h2>
        <CategoryForm
          mode="edit"
          initialName={initialName}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default EditCategoryPage;

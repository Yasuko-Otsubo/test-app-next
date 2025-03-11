"use client";

import React, { useEffect, useState } from "react";
import styles from "../_styles/categories.module.css";
import { useRouter } from "next/navigation";
import { Category } from "@/app/_types/Categories";
import { PostForm } from "../_components/CategoryForm";
import useToken from "@/app/admin/_hooks/useToken";


const CategoryNewPage: React.FC = () => {
  const [name, setName] = useState("");
  const token = useToken();
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      if(!token) return;
      try {
        const res = await fetch("/api/admin/categories",{
          headers: {
            Authorization: token,
          },
        });
        if (!res.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data: { categories: Category[] } = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.log("カテゴリー取得失敗", error);
        alert("カテゴリーの取得失敗しました");
      }
    };
    fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (categories.find((category) => category.name === name)) {
      setErrorMessage("このカテゴリー名は重複しています。別の名前を使用してください");
      return;
    }
  
    try {
      await fetch(`/api/admin/categories`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: token!,
        },
        body: JSON.stringify({
          name,
        }),
      });
      alert("新規作成しました");
      router.push("/admin/categories");
    } catch (error) {
      console.log("新規作成失敗", error);
      alert("新規作成に失敗しました");
    }

};

  return (
    <>
      <div className={styles.main}>
        <h2>カテゴリー作成</h2>
        <PostForm
          mode="new"
          name={name}
          setName={setName}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
        />
      </div>
    </>
  );
};
export default CategoryNewPage;

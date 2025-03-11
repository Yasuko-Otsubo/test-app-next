"use client";

import React, { useEffect, useState } from "react";
import styles from "./_styles/categories.module.css";
import Link from "next/link";
import { Category } from "@/app/_types/Categories";
import useToken from "../_hooks/useToken";

//GET
const CategoryNewPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const token = useToken();

  useEffect(() => {
    if (!token) return;

    const fetcher = async () => {
      const res = await fetch("/api/admin/categories",{
        headers: {
        Authorization: token,

        },
      }
      );
      const { categories } = await res.json();
      setCategories(categories);
    };

    fetcher();
  }, [token]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.upper}>
          <h2>カテゴリー 一覧</h2>
          <Link href={`/admin/categories/new`} className={styles.link}>
            <div className={styles.new}>新規作成</div>
          </Link>
        </div>
        {categories.map((category) => {
          return (
          <h4 key={category.id} className={styles.h4}>
            <Link
              href={`/admin/categories/${category.id}`}
              className={styles.link}
            >
              {category.name}
            </Link>
          </h4>

          )
})}
      </div>
    </>
  );
};

export default CategoryNewPage;

"use client";

import { useForm } from "react-hook-form";
import styles from "../_styles/categories.module.css";
import React, { useEffect } from "react";

type FormValue = {
  name: string;
}

interface Props {
  mode: "new" | "edit";
  initialName?: string;
  onSubmit: (data: FormValue) => void;
  errorMessage?: string;
  onDelete?: () => void;
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  initialName = '',
  onSubmit,
  onDelete,
  errorMessage,
}) => {

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, 
} = useForm<FormValue>({
    defaultValues: {
      name: initialName
    },
  });

  useEffect (() =>{
    setValue("name", initialName);
  },[initialName, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.n_article}>
        <label htmlFor="name">カテゴリー</label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: '名前を入力して下さい',
          })}
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
      </div>
      <div>
        <div className={styles.n_btn}>
          <button type="submit" className={styles.put}>
            {mode === "edit" ? "更新" : "作成"}
          </button>
          {onDelete && (
            <button type="button" onClick={onDelete} disabled={isSubmitting}>
              削除
            </button>
          )}
        </div>
      </div>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </form>
  );
};

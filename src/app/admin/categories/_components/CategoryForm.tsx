import styles from "../_styles/categories.module.css";
import React from "react";

interface Props {
  mode: "new" | "edit";
  name: string;
  setName: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  errorMessage?: string;
  onDelete?: () =>void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  errorMessage,
}) => {
  return (
    <form onSubmit={onSubmit}>
    <div className={styles.n_article}>
      <label>カテゴリー</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div>
      <div className={styles.n_btn}>
      <button type="submit" className={styles.put}>
        {mode === "edit" ? "更新" : "作成"}
      </button>
      {onDelete && (
        <button type="button" onClick={onDelete}>
          削除
        </button>
      )}
      </div>
    </div>
    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
  </form>

  );
};
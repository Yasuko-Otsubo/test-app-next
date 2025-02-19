import styles from "../_styles/main.module.css";
import { Category } from "@/app/_types/Categories";
import React from "react";
import SelectCategories from "./SelectCategories";

//Propsを定義
interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailUrl: string;
  setThumbnailUrl: (thumbnailUrl: string) => void;
  categories: Category[];
  selectCategories: number[]; // 現在選択されているカテゴリーのID
  setSelectCategories: (categories: number[]) => void;
  allCategories: Category[]; // すべてのカテゴリー
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailUrl,
  setThumbnailUrl,
  setSelectCategories,
  selectCategories,
  allCategories,
  onSubmit,
  onDelete,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className={styles.n_article}>
        <label>タイトル</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className={styles.n_article}>
        <label>内容</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className={styles.n_article}>
        <label>サムネイルURL</label>
        <input
          type="text"
          id="thumbnailUrl"
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
        />
      </div>
      <div className={styles.n_article}>
        <label>カテゴリー</label>
        <SelectCategories
          selectCategories={selectCategories}
          setCategories={setSelectCategories}
          allCategories={allCategories}
        />
      </div>
      <div className={styles.e_btn}>
        <button type="submit" className={styles.put}>
          {mode === "edit" ? "更新" : "作成"}
        </button>
        {onDelete && (
          <button type="button" className={styles.delete} onClick={onDelete}>
            削除
          </button>
        )}
      </div>
    </form>
  );
};

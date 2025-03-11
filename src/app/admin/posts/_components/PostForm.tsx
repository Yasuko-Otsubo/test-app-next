import styles from "../_styles/main.module.css";
//import { Category } from "@/app/_types/Categories";
import React, { ChangeEvent, useEffect, useState } from "react";
import SelectCategories from "./SelectCategories";
import { supabase } from '@/utils/supabase'　
import { v4 as uuidv4 } from 'uuid'  // 固有IDを生成するライブラリ
import Image from "next/image";

//Propsを定義
interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string
  setThumbnailImageKey: (thumbnailImageKey: string) => void
  //categories: Category[];
  selectCategories: number[]; // 現在選択されているカテゴリーのID
  setSelectCategories: (categories: number[]) => void;
  //allCategories?: Category[]; // すべてのカテゴリー
  onSubmit: (e: React.FormEvent) => void;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  setTitle,
  content,
  setContent,
  thumbnailImageKey,
  setThumbnailImageKey,
  setSelectCategories,
  selectCategories,
  onSubmit,
  onDelete,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )
  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    // eventから画像を取得
    const file = event.target.files[0] // 選択された画像を取得

    // private/は必ずつけること
    const filePath = `private/${uuidv4()}` // ファイル名を指定

    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post_thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに画像のパスが格納されているので、thumbnailImageKeyに格納
    setThumbnailImageKey(data.path)
  }

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!thumbnailImageKey)  return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post_thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

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
        <label htmlFor="thumbnailImageKey">サムネイルURL</label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
          accept="image/*"
        />
        {thumbnailImageUrl && (
          <div>
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div className={styles.n_article}>
        <label>カテゴリー</label>
        <SelectCategories
          selectCategories={selectCategories}
          setCategories={setSelectCategories}
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

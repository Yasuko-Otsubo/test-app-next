import styles from "../_styles/main.module.css";
import React, { ChangeEvent, useEffect, useState } from "react";
import SelectCategories from "./SelectCategories";
import { supabase } from '@/utils/supabase';
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";

type FormValue = {
  title: string;
  content: string;
  thumbnailImageKey: string;
  categories: number[];
}

//Propsを定義
interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void
  selectCategories: number[]; // 現在選択されているカテゴリーのID
  setSelectCategories: (categories: number[]) => void;
  onSubmit: (data: FormValue) => Promise<void>;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  title,
  content,
  thumbnailImageKey,
  selectCategories,
  onSubmit,
  onDelete,
}) => {

  const { register, handleSubmit, control, setValue, watch } = useForm<FormValue>({
    defaultValues: {
      title,
      content,
      thumbnailImageKey: thumbnailImageKey || '',
      categories: selectCategories || [],
    },
  });
  
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  useEffect(() => {
    setValue("title", title);
    setValue("content", content);
    setValue("thumbnailImageKey", thumbnailImageKey || '');
    setValue("categories", selectCategories);
  }, [title, content, thumbnailImageKey, selectCategories, setValue]);
  
    const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    // eventから画像を取得
    const file = event.target.files[0] // 選択された画像を取得
    console.log("選択された画像:", file);

    // private/は必ずつけること
    const filePath = `private/${uuidv4()}` // ファイル名を指定

    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post-thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示
    if (error) {
      console.error("画像のアップロードに失敗:", error.message);
      alert(error.message)
      return
    }
    console.log("アップロード成功:", data);

    // data.pathに画像のパスが格納されているので、thumbnailImageKeyに格納
    watch("thumbnailImageKey")
    setValue("thumbnailImageKey", data.path)
  }

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!thumbnailImageKey)  return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post-thumbnail')
        .getPublicUrl(thumbnailImageKey)
        console.log("取得した画像URL:", publicUrl);

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.n_article}>
        <label>タイトル</label>
        <input
          type="text"
          {...register ("title", {
            required: 'タイトルを入力してください',
          })}
          id="title"
        />
      </div>
      <div className={styles.n_article}>
        <label>内容</label>
        <textarea
          id="content"
          {...register("content", {
          })}
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
              style={{ width: "auto", height: "auto" }} 
            />
            </div>
        )}
      </div>
      <div className={styles.n_article}>
        <label>カテゴリー</label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
          <SelectCategories
            selectCategories={field.value}
            setCategories={field.onChange}
          />
          )}
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
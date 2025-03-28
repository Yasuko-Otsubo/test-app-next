import styles from "../_styles/main.module.css";
//import { Category } from "@/app/_types/Categories";
import React, { ChangeEvent/*, useState*/ } from "react";
import SelectCategories from "./SelectCategories";
import { supabase } from "@/utils/supabase";
import { v4 as uuidv4 } from 'uuid';

//Propsを定義
interface Props {
  mode: "new" | "edit";
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  thumbnailImageKey: string;
  setThumbnailImageKey: (thumbnailImageKey: string) => void;
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

  //const [thumbnailImageKey, setThumbnailImageKey] = useState('');
  const handleImageChange = async(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if(!event.target.files || event.target.files.length == 0) {
      return 
    }

    const file = event.target.files[0] //選択された画像
    const filePath = `private/${uuidv4()}`//uuidというのは、固有のIDを生成するためのライブラリ

    const { data, error } = await supabase.storage
    .from('post-thumbnail')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    //アップロードに失敗したらエラーを表示して終了
    if(error) {
      alert(error.message)
      return
    }
    setThumbnailImageKey(data.path)
  }
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
          value={thumbnailImageKey}
          onChange={handleImageChange}　accept="image/*"
        />
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

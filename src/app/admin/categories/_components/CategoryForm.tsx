import { useForm } from "react-hook-form";
import styles from "../_styles/categories.module.css";
import React from "react";

type FormValue = {
  name: string;
}

interface Props {
  mode: "new" | "edit";
  name: string;
  setName: (name: string) => void;
  onSubmit: (data: FormValue) => void;
  errorMessage?: string;
  onDelete?: () => void;
}

export const PostForm: React.FC<Props> = ({
  mode,
  name,
  setName,
  onSubmit,
  onDelete,
  errorMessage,
}) => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormValue>({
    defaultValues: {
      name,
    },
  });

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
          value={name}  // use `name` from state to control the value
          onChange={(e) => setName(e.target.value)}  // still update local state, if needed
        />
        {errors.name && <p className={styles.error}>{errors.name.message}</p>}
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

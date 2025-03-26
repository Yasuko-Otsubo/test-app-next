import React, { useEffect, useState } from "react";
import { Category } from "@/app/_types/Categories";

interface Props {
  selectCategories: number[];
  setCategories: (categories: number[]) => void;
}

const SelectCategories: React.FC<Props> = ({
  selectCategories,
  setCategories
}) => {

  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async() => {
      try {
        const res = await fetch(`/api/admin/categories`);
        const data: { categories : Category[] } = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.log("カテゴリー取得失敗" , error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <select
      id="category"
      value={selectCategories.map(String)} // IDの配列を文字列に
      onChange={(e) =>
        setCategories(
          Array.from(e.target.selectedOptions).map((opt) =>
            Number(opt.value)
          )
        )
      }
      multiple
    >
      {allCategories?.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCategories;

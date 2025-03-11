import React, { useEffect, useState } from "react";
import { Category } from "@/app/_types/Categories";
import useToken from "../../_hooks/useToken";

interface Props {
  selectCategories: number[];
  setCategories: (categories: number[]) => void;
}

const SelectCategories: React.FC<Props> = ({
  selectCategories,
  setCategories
}) => {

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const token = useToken();
  
  useEffect(() => {
    const fetchCategories = async() => {
      if(!token) return;

      try {
        const res = await fetch(`/api/admin/categories`,{
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
        });
        const data: { categories : Category[] } = await res.json();
        setAllCategories(data.categories);
      } catch (error) {
        console.log("カテゴリー取得失敗" , error);
      }
    };
    fetchCategories();
  }, [token]);
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

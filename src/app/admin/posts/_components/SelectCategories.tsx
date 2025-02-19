import React from "react";
import { Category } from "@/app/_types/Categories";

interface Props {
  selectCategories: number[];
  setCategories: (categories: number[]) => void;
  allCategories: Category[];
}

const SelectCategories: React.FC<Props> = ({
  selectCategories,
  setCategories,
  allCategories,
}) => {
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
      {allCategories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default SelectCategories;

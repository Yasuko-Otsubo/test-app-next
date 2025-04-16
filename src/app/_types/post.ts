import { Category } from "./Categories"

export interface Post {
  id :             number
  title :          string
  content :        string
  thumbnailImageKey :   string
  createdAt :      string
  updatedAt :      string
  postCategories : { category: Category }[]
}


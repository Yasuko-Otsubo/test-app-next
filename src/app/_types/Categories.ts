export interface Category {
  id :      number
  name :      string
  createdAt : string
  updatedAt : string
  //posts     PostCategory[]
}


export interface PostCategory {
  category: Category; // Category型を持つ
}

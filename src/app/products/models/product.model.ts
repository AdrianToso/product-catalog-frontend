export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  category: Category;
}

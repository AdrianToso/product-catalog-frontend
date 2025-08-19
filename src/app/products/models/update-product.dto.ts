export interface UpdateProductDto {
  id: string; 
  name: string;
  description: string;
  imageUrl?: string;
  categoryId: string;
}
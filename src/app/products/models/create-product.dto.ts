export interface CreateProductDto {
  name: string;
  description: string;
  imageUrl?: string;
  categoryId: string;
}
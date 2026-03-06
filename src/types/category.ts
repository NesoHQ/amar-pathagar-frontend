export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bookCount: number;
}

export interface CategoryCarouselProps {
  categories: Category[];
}

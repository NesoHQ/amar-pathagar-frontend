export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  available: boolean;
  category: string;
  description?: string;
  isbn?: string;
  publishedYear?: number;
}

export interface BookCardProps {
  book: Book;
  onWishlistToggle?: (bookId: string) => void;
  isWishlisted?: boolean;
}

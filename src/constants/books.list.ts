/**
 * Mock data for books list page
 * Extended book data with more fields for filtering and display
 */

export interface BookListItem {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  category: string;
  status: 'available' | 'reading' | 'requested' | 'on_hold';
  current_holder?: {
    id: string;
    name: string;
  } | null;
  total_reads: number;
  average_rating: number;
  description?: string;
  isbn?: string;
  published_year?: number;
  pages?: number;
}

export const MOCK_BOOKS_LIST: BookListItem[] = [
  // Engineering Books
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    cover_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 45,
    average_rating: 4.7,
    published_year: 2008,
    pages: 464,
  },
  {
    id: '2',
    title: 'Design Patterns',
    author: 'Gang of Four',
    cover_url: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
    category: 'Engineering',
    status: 'reading',
    total_reads: 38,
    average_rating: 4.6,
    published_year: 1994,
    pages: 395,
  },
  {
    id: '3',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    cover_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 52,
    average_rating: 4.8,
    published_year: 1999,
    pages: 352,
  },
  {
    id: '4',
    title: 'System Design Interview',
    author: 'Alex Xu',
    cover_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 67,
    average_rating: 4.9,
    published_year: 2020,
    pages: 280,
  },
  {
    id: '5',
    title: 'Refactoring',
    author: 'Martin Fowler',
    cover_url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&q=80',
    category: 'Engineering',
    status: 'requested',
    total_reads: 41,
    average_rating: 4.5,
    published_year: 1999,
    pages: 448,
  },
  {
    id: '6',
    title: 'Code Complete',
    author: 'Steve McConnell',
    cover_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 35,
    average_rating: 4.7,
    published_year: 2004,
    pages: 960,
  },

  // Science Fiction
  {
    id: '7',
    title: 'Dune',
    author: 'Frank Herbert',
    cover_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80',
    category: 'Science Fiction',
    status: 'available',
    total_reads: 89,
    average_rating: 4.8,
    published_year: 1965,
    pages: 688,
  },
  {
    id: '8',
    title: 'Foundation',
    author: 'Isaac Asimov',
    cover_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    category: 'Science Fiction',
    status: 'reading',
    total_reads: 76,
    average_rating: 4.7,
    published_year: 1951,
    pages: 255,
  },
  {
    id: '9',
    title: 'Neuromancer',
    author: 'William Gibson',
    cover_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80',
    category: 'Science Fiction',
    status: 'available',
    total_reads: 54,
    average_rating: 4.6,
    published_year: 1984,
    pages: 271,
  },
  {
    id: '10',
    title: 'The Three-Body Problem',
    author: 'Liu Cixin',
    cover_url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80',
    category: 'Science Fiction',
    status: 'available',
    total_reads: 92,
    average_rating: 4.9,
    published_year: 2008,
    pages: 400,
  },
  {
    id: '11',
    title: 'Snow Crash',
    author: 'Neal Stephenson',
    cover_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80',
    category: 'Science Fiction',
    status: 'available',
    total_reads: 48,
    average_rating: 4.5,
    published_year: 1992,
    pages: 559,
  },
  {
    id: '12',
    title: "Ender's Game",
    author: 'Orson Scott Card',
    cover_url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80',
    category: 'Science Fiction',
    status: 'reading',
    total_reads: 71,
    average_rating: 4.7,
    published_year: 1985,
    pages: 324,
  },

  // Literature
  {
    id: '13',
    title: '1984',
    author: 'George Orwell',
    cover_url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 103,
    average_rating: 4.8,
    published_year: 1949,
    pages: 328,
  },
  {
    id: '14',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 98,
    average_rating: 4.9,
    published_year: 1960,
    pages: 336,
  },
  {
    id: '15',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    category: 'Literature',
    status: 'reading',
    total_reads: 87,
    average_rating: 4.7,
    published_year: 1813,
    pages: 432,
  },
  {
    id: '16',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 94,
    average_rating: 4.6,
    published_year: 1925,
    pages: 180,
  },
  {
    id: '17',
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    cover_url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 79,
    average_rating: 4.8,
    published_year: 1967,
    pages: 417,
  },
  {
    id: '18',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    cover_url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 82,
    average_rating: 4.5,
    published_year: 1951,
    pages: 277,
  },

  // Self-Help
  {
    id: '19',
    title: 'Atomic Habits',
    author: 'James Clear',
    cover_url: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
    category: 'Self-Help',
    status: 'available',
    total_reads: 125,
    average_rating: 4.9,
    published_year: 2018,
    pages: 320,
  },
  {
    id: '20',
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    cover_url: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&q=80',
    category: 'Self-Help',
    status: 'reading',
    total_reads: 110,
    average_rating: 4.7,
    published_year: 2020,
    pages: 256,
  },
  {
    id: '21',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    cover_url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80',
    category: 'Self-Help',
    status: 'available',
    total_reads: 95,
    average_rating: 4.7,
    published_year: 2011,
    pages: 499,
  },
  {
    id: '22',
    title: 'The Power of Now',
    author: 'Eckhart Tolle',
    cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&q=80',
    category: 'Self-Help',
    status: 'available',
    total_reads: 88,
    average_rating: 4.6,
    published_year: 1997,
    pages: 236,
  },
  {
    id: '23',
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    cover_url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&q=80',
    category: 'Self-Help',
    status: 'available',
    total_reads: 102,
    average_rating: 4.9,
    published_year: 1946,
    pages: 165,
  },
  {
    id: '24',
    title: 'The 7 Habits of Highly Effective People',
    author: 'Stephen Covey',
    cover_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80',
    category: 'Self-Help',
    status: 'reading',
    total_reads: 91,
    average_rating: 4.5,
    published_year: 1989,
    pages: 381,
  },

  // Business
  {
    id: '25',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    cover_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80',
    category: 'Business',
    status: 'available',
    total_reads: 73,
    average_rating: 4.6,
    published_year: 2011,
    pages: 336,
  },
  {
    id: '26',
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    category: 'Business',
    status: 'available',
    total_reads: 68,
    average_rating: 4.5,
    published_year: 2014,
    pages: 224,
  },
  {
    id: '27',
    title: 'Good to Great',
    author: 'Jim Collins',
    cover_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80',
    category: 'Business',
    status: 'available',
    total_reads: 65,
    average_rating: 4.7,
    published_year: 2001,
    pages: 300,
  },
  {
    id: '28',
    title: 'The Innovator\'s Dilemma',
    author: 'Clayton M. Christensen',
    cover_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80',
    category: 'Business',
    status: 'reading',
    total_reads: 59,
    average_rating: 4.6,
    published_year: 1997,
    pages: 288,
  },
  {
    id: '29',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    cover_url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=400&q=80',
    category: 'Business',
    status: 'available',
    total_reads: 62,
    average_rating: 4.7,
    published_year: 2014,
    pages: 304,
  },
  {
    id: '30',
    title: 'Crossing the Chasm',
    author: 'Geoffrey A. Moore',
    cover_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
    category: 'Business',
    status: 'available',
    total_reads: 56,
    average_rating: 4.5,
    published_year: 1991,
    pages: 227,
  },

  // More books to reach 50+
  {
    id: '31',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    cover_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 44,
    average_rating: 4.8,
    published_year: 2009,
    pages: 1312,
  },
  {
    id: '32',
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    cover_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80',
    category: 'Engineering',
    status: 'available',
    total_reads: 78,
    average_rating: 4.7,
    published_year: 2015,
    pages: 687,
  },
  {
    id: '33',
    title: 'The Martian',
    author: 'Andy Weir',
    cover_url: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&q=80',
    category: 'Science Fiction',
    status: 'available',
    total_reads: 85,
    average_rating: 4.8,
    published_year: 2011,
    pages: 369,
  },
  {
    id: '34',
    title: 'Ready Player One',
    author: 'Ernest Cline',
    cover_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80',
    category: 'Science Fiction',
    status: 'reading',
    total_reads: 77,
    average_rating: 4.6,
    published_year: 2011,
    pages: 374,
  },
  {
    id: '35',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 90,
    average_rating: 4.6,
    published_year: 1932,
    pages: 311,
  },
  {
    id: '36',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    cover_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
    category: 'Literature',
    status: 'available',
    total_reads: 112,
    average_rating: 4.9,
    published_year: 1954,
    pages: 1178,
  },
  {
    id: '37',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    cover_url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&q=80',
    category: 'History',
    status: 'available',
    total_reads: 108,
    average_rating: 4.8,
    published_year: 2011,
    pages: 443,
  },
  {
    id: '38',
    title: 'Educated',
    author: 'Tara Westover',
    cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    category: 'Biography',
    status: 'reading',
    total_reads: 96,
    average_rating: 4.7,
    published_year: 2018,
    pages: 334,
  },
  {
    id: '39',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
    category: 'Fiction',
    status: 'available',
    total_reads: 105,
    average_rating: 4.5,
    published_year: 1988,
    pages: 197,
  },
  {
    id: '40',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    category: 'Fiction',
    status: 'available',
    total_reads: 89,
    average_rating: 4.8,
    published_year: 2020,
    pages: 304,
  },
];

// Helper function to filter books
export function filterBooks(
  books: BookListItem[],
  filters: {
    search?: string;
    category?: string;
    status?: string;
    sort?: string;
  }
): BookListItem[] {
  let filtered = [...books];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter((book) => book.category === filters.category);
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((book) => book.status === filters.status);
  }

  // Sort
  if (filters.sort) {
    switch (filters.sort) {
      case 'title_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating_desc':
        filtered.sort((a, b) => b.average_rating - a.average_rating);
        break;
      case 'rating_asc':
        filtered.sort((a, b) => a.average_rating - b.average_rating);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.published_year || 0) - (a.published_year || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => (a.published_year || 0) - (b.published_year || 0));
        break;
      default:
        // relevance - keep original order
        break;
    }
  }

  return filtered;
}

// Helper function to paginate books
export function paginateBooks(
  books: BookListItem[],
  page: number = 1,
  limit: number = 18
) {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBooks = books.slice(startIndex, endIndex);

  return {
    data: paginatedBooks,
    pagination: {
      total: books.length,
      page,
      limit,
      totalPages: Math.ceil(books.length / limit),
      hasNextPage: endIndex < books.length,
      hasPreviousPage: page > 1,
      nextPage: endIndex < books.length ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
}

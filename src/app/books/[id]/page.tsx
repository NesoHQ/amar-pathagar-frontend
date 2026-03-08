'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';
import { booksService, ideasService, reviewsService, handoverService } from '@/services';
import { PageHeader } from '@/components/common/page.header';
import { LoginPromptDialog } from '@/components/ui/dynamic.dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DynamicTabs, DynamicTabContent } from '@/components/ui/dynamic.tabs';
import { useInfiniteScroll } from '@/hooks/use.infinite.scroll';
import ConfirmModal from '@/components/confirm.modal';
import { Loader } from '@/components/ui/loader';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();
  const { success, error, warning } = useToastStore();
  
  const [book, setBook] = useState<any>(null);
  const [ideas, setIdeas] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [ideaForm, setIdeaForm] = useState({ title: '', content: '' });
  const [isRequested, setIsRequested] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(3);
  const [discussionsToShow, setDiscussionsToShow] = useState(5);
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest' | 'lowest'>('recent');
  const [discussionSort, setDiscussionSort] = useState<'recent' | 'popular'>('recent');
  const [activeTab, setActiveTab] = useState('reviews');
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    confirmColor?: 'red' | 'green' | 'blue' | 'orange';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [loginPrompt, setLoginPrompt] = useState<{
    isOpen: boolean;
    action: string;
  }>({
    isOpen: false,
    action: 'perform this action',
  });

  // Sorted and filtered data
  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (reviewSort) {
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [reviews, reviewSort]);

  const sortedDiscussions = useMemo(() => {
    const sorted = [...ideas];
    switch (discussionSort) {
      case 'popular':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'recent':
      default:
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [ideas, discussionSort]);

  // Review statistics
  const reviewStats = useMemo(() => {
    if (reviews.length === 0) return null;
    const total = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total;
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: (reviews.filter(r => r.rating === rating).length / total) * 100
    }));
    return { total, avgRating, distribution };
  }, [reviews]);

  // Infinite scroll for reviews
  const loadMoreReviews = () => {
    if (isLoadingReviews) return;
    setIsLoadingReviews(true);
    setTimeout(() => {
      setReviewsToShow(prev => prev + 3);
      setIsLoadingReviews(false);
    }, 300); // Simulate loading delay
  };

  const { observerTarget: reviewsObserverTarget } = useInfiniteScroll({
    onLoadMore: loadMoreReviews,
    hasMore: sortedReviews.length > reviewsToShow,
    isLoading: isLoadingReviews,
    threshold: 200,
  });

  // Infinite scroll for discussions
  const loadMoreDiscussions = () => {
    if (isLoadingDiscussions) return;
    setIsLoadingDiscussions(true);
    setTimeout(() => {
      setDiscussionsToShow(prev => prev + 5);
      setIsLoadingDiscussions(false);
    }, 300); // Simulate loading delay
  };

  const { observerTarget: discussionsObserverTarget } = useInfiniteScroll({
    onLoadMore: loadMoreDiscussions,
    hasMore: sortedDiscussions.length > discussionsToShow,
    isLoading: isLoadingDiscussions,
    threshold: 200,
  });

  useEffect(() => {
    if (_hasHydrated && params.id) {
      loadBook();
      loadIdeas();
      loadReviews();
      if (isAuthenticated) {
        checkIfRequested();
      }
    }
  }, [isAuthenticated, _hasHydrated, params.id]);

  const loadBook = async () => {
    try {
      const mockBook = {
        id: params.id,
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        cover_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&q=80',
        category: 'Engineering',
        status: 'available',
        total_reads: 45,
        average_rating: 4.7,
        max_reading_days: 14,
        isbn: '978-0132350884',
        published_year: 2008,
        pages: 464,
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn\'t have to be that way. This book will teach you the best practices of writing clean, readable, and maintainable code.',
        tags: ['Software Engineering', 'Best Practices', 'Programming', 'Code Quality'],
        current_holder: null,
        current_holder_id: null,
      };
      setBook(mockBook);
    } catch (error) {
      console.error('Failed to load book:', error);
    }
  };

  const checkIfRequested = async () => {
    try {
      setIsRequested(false);
    } catch (error) {
      console.error('Failed to check request status:', error);
    }
  };

  const loadIdeas = async () => {
    try {
      const mockIdeas = [
        {
          id: '1',
          title: 'Great insights on code refactoring',
          content: 'This book completely changed how I think about writing code. The chapter on meaningful names was particularly enlightening.',
          user: { username: 'john_dev', id: '1' },
          upvotes: 12,
          downvotes: 1,
          created_at: new Date('2024-01-15').toISOString(),
        },
        {
          id: '2',
          title: 'Must-read for every developer',
          content: 'If you\'re serious about software development, this book is essential. The examples are clear and the principles are timeless.',
          user: { username: 'sarah_codes', id: '2' },
          upvotes: 8,
          downvotes: 0,
          created_at: new Date('2024-02-20').toISOString(),
        },
        {
          id: '3',
          title: 'Practical examples throughout',
          content: 'Love how each concept is backed by real-world examples. Makes it easy to apply in your own projects.',
          user: { username: 'mike_tech', id: '3' },
          upvotes: 15,
          downvotes: 2,
          created_at: new Date('2024-03-01').toISOString(),
        },
        {
          id: '4',
          title: 'Changed my coding style',
          content: 'After reading this, I refactored my entire codebase. The improvement in readability is remarkable.',
          user: { username: 'lisa_dev', id: '4' },
          upvotes: 6,
          downvotes: 0,
          created_at: new Date('2024-03-10').toISOString(),
        },
        {
          id: '5',
          title: 'Best practices explained well',
          content: 'The author does an excellent job explaining why certain practices matter, not just what they are.',
          user: { username: 'tom_codes', id: '5' },
          upvotes: 10,
          downvotes: 1,
          created_at: new Date('2024-03-15').toISOString(),
        },
        {
          id: '6',
          title: 'A bit dated but still relevant',
          content: 'Some examples use older technologies, but the core principles are timeless and applicable today.',
          user: { username: 'anna_dev', id: '6' },
          upvotes: 4,
          downvotes: 3,
          created_at: new Date('2024-03-20').toISOString(),
        },
      ];
      setIdeas(mockIdeas);
    } catch (error) {
      console.error('Failed to load ideas:', error);
      setIdeas([]);
    }
  };

  const loadReviews = async () => {
    try {
      const mockReviews = [
        {
          id: '1',
          rating: 5,
          comment: 'Absolutely essential reading for any software developer. The principles in this book have made me a better programmer.',
          user: { username: 'alex_tech', full_name: 'Alex Johnson' },
          created_at: new Date('2024-01-10').toISOString(),
        },
        {
          id: '2',
          rating: 4,
          comment: 'Very detailed and practical. Some examples are a bit dated but the core concepts are timeless.',
          user: { username: 'maria_dev', full_name: 'Maria Garcia' },
          created_at: new Date('2024-02-05').toISOString(),
        },
        {
          id: '3',
          rating: 5,
          comment: 'This book should be required reading in computer science programs. Changed my entire approach to coding.',
          user: { username: 'david_codes', full_name: 'David Chen' },
          created_at: new Date('2024-02-28').toISOString(),
        },
        {
          id: '4',
          rating: 5,
          comment: 'A masterpiece! Every chapter is packed with wisdom. I keep coming back to it.',
          user: { username: 'emma_dev', full_name: 'Emma Wilson' },
          created_at: new Date('2024-03-01').toISOString(),
        },
        {
          id: '5',
          rating: 4,
          comment: 'Great book with practical examples. The refactoring chapter alone is worth the price.',
          user: { username: 'james_code', full_name: 'James Brown' },
          created_at: new Date('2024-03-05').toISOString(),
        },
        {
          id: '6',
          rating: 5,
          comment: 'Clear, concise, and incredibly useful. A must-have for any developer\'s library.',
          user: { username: 'sophia_tech', full_name: 'Sophia Lee' },
          created_at: new Date('2024-03-10').toISOString(),
        },
        {
          id: '7',
          rating: 3,
          comment: 'Good content but some parts feel repetitive. Still worth reading though.',
          user: { username: 'oliver_dev', full_name: 'Oliver Martinez' },
          created_at: new Date('2024-03-12').toISOString(),
        },
        {
          id: '8',
          rating: 5,
          comment: 'This book transformed how I write code. Can\'t recommend it enough!',
          user: { username: 'ava_codes', full_name: 'Ava Anderson' },
          created_at: new Date('2024-03-15').toISOString(),
        },
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
      setReviews([]);
    }
  };

  const handleRequest = async () => {
    if (!isAuthenticated) {
      setLoginPrompt({ isOpen: true, action: 'request this book' });
      return;
    }
    if (!user || user.success_score < 20) {
      warning('Your success score must be at least 20 to request books.');
      return;
    }
    try {
      await booksService.request(params.id as string);
      success('Book requested successfully!');
      setIsRequested(true);
      loadBook();
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to request book');
    }
  };

  const handleCancelRequest = async () => {
    if (!isAuthenticated) {
      setLoginPrompt({ isOpen: true, action: 'cancel this request' });
      return;
    }
    try {
      await booksService.cancelRequest(params.id as string);
      success('Request cancelled successfully!');
      setIsRequested(false);
      loadBook();
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to cancel request');
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginPrompt({ isOpen: true, action: 'post in the discussion' });
      return;
    }
    try {
      await ideasService.create({
        book_id: params.id as string,
        ...ideaForm,
      });
      setIdeaForm({ title: '', content: '' });
      setShowIdeaForm(false);
      loadIdeas();
      success('Idea posted! +3 points');
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to post idea');
    }
  };

  const handleVote = async (ideaId: string, voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated) {
      setLoginPrompt({ isOpen: true, action: 'vote on discussions' });
      return;
    }
    try {
      await ideasService.vote(ideaId, voteType);
      success('Vote recorded!');
      loadIdeas();
    } catch (err: any) {
      error(err.response?.data?.error || 'Failed to vote');
    }
  };

  if (!_hasHydrated || !book) {
    return (
      <Loader size="lg" fullScreen/>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-600';
      case 'reading': return 'bg-blue-600';
      case 'requested': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <PageHeader
          title=""
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Books', href: '/books' },
            { label: book.title },
          ]}
        />

        {/* Book Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <div className="relative aspect-2/3 rounded-lg overflow-hidden border-2 shadow-lg" style={{ borderColor: 'var(--border)' }}>
                <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3">
                  <Badge className={`${getStatusColor(book.status)} text-white border-0 text-xs uppercase font-bold`}>
                    {book.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                {book.title}
              </h1>
              <p className="text-lg md:text-xl" style={{ color: 'var(--muted-foreground)' }}>
                by {book.author}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--muted-foreground)' }}>⭐</span>
                <span className="font-medium">{book.average_rating}</span>
                <span style={{ color: 'var(--muted-foreground)' }}>({book.total_reads} reads)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{book.category}</Badge>
              </div>
              {book.published_year && (
                <div style={{ color: 'var(--muted-foreground)' }}>
                  Published: {book.published_year}
                </div>
              )}
              {book.pages && (
                <div style={{ color: 'var(--muted-foreground)' }}>
                  {book.pages} pages
                </div>
              )}
            </div>

            <div>
              <h2 className="text-sm uppercase font-bold mb-2" style={{ color: 'var(--muted-foreground)' }}>
                About this book
              </h2>
              <p className="text-base leading-relaxed" style={{ color: 'var(--foreground)' }}>
                {book.description}
              </p>
            </div>

            {book.tags && book.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {book.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isRequested ? (
                <>
                  <div className="flex-1 px-4 py-3 border-2 border-green-600 bg-green-50 dark:bg-green-950 text-center rounded-lg">
                    <p className="text-sm font-bold uppercase text-green-700 dark:text-green-400">
                      ✓ Requested
                    </p>
                  </div>
                  <Button
                    onClick={handleCancelRequest}
                    variant="outline"
                    className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  >
                    Cancel Request
                  </Button>
                </>
              ) : book.status === 'available' ? (
                <Button
                  onClick={handleRequest}
                  className="flex-1"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  Request This Book
                </Button>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  Max Reading Period
                </p>
                <p className="text-sm font-medium">{book.max_reading_days} days</p>
              </div>
              <div>
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--muted-foreground)' }}>
                  ISBN
                </p>
                <p className="text-sm font-medium">{book.isbn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Reviews and Discussions */}
        <DynamicTabs
          defaultValue="reviews"
          tabs={[
            { value: 'reviews', label: 'Reviews', count: reviews.length, icon: '⭐' },
            { value: 'discussions', label: 'Discussions', count: ideas.length, icon: '💬' },
          ]}
          onTabChange={setActiveTab}
        >
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <DynamicTabContent value="reviews" className="space-y-6">
            {reviewStats && (
              <div className="border rounded-lg p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-4xl font-bold mb-1">{reviewStats.avgRating.toFixed(1)}</div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(reviewStats.avgRating) ? 'text-yellow-500' : 'text-gray-300'}>
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      Based on {reviewStats.total} reviews
                    </div>
                  </div>
                  <div className="flex-1 max-w-xs ml-8 space-y-2">
                    {reviewStats.distribution.map(({ rating, count, percentage }, index) => (
                      <div key={rating} className="flex items-center gap-2 text-sm">
                        <span className="w-8">{rating}★</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--muted)' }}>
                          <div
                            className="h-full bg-yellow-500 transition-all duration-700 ease-out"
                            style={{ 
                              width: `${percentage}%`,
                              animationDelay: `${index * 100}ms`,
                              animation: 'expandWidth 0.8s ease-out forwards'
                            }}
                          />
                        </div>
                        <span className="w-8 text-right" style={{ color: 'var(--muted-foreground)' }}>
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">All Reviews</h3>
              <select
                value={reviewSort}
                onChange={(e) => setReviewSort(e.target.value as any)}
                className="px-3 py-1.5 border rounded-lg text-sm transition-all duration-200 hover:border-(--primary) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
            </div>

            <div className="space-y-4">
              {sortedReviews.slice(0, reviewsToShow).map((review, index) => (
                <div
                  key={review.id}
                  className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                  style={{ 
                    borderColor: 'var(--border)', 
                    backgroundColor: 'var(--card)',
                    animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.user.full_name || review.user.username}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            {sortedReviews.length > reviewsToShow && (
              <div ref={reviewsObserverTarget} className="flex justify-center py-4">
                {isLoadingReviews && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                    <span>Loading more reviews...</span>
                  </div>
                )}
              </div>
            )}

            {sortedReviews.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No reviews yet. Be the first to review this book!
                </p>
              </div>
            )}
          </DynamicTabContent>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <DynamicTabContent value="discussions" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">All Discussions</h3>
                <select
                  value={discussionSort}
                  onChange={(e) => setDiscussionSort(e.target.value as any)}
                  className="px-3 py-1.5 border rounded-lg text-sm transition-all duration-200 hover:border-(--primary) focus:border-(--primary) focus:ring-2 focus:ring-(--primary)/20"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
              <Button
                onClick={() => {
                  if (!isAuthenticated) {
                    setLoginPrompt({ isOpen: true, action: 'create a discussion post' });
                    return;
                  }
                  setShowIdeaForm(!showIdeaForm);
                }}
                size="sm"
              >
                {showIdeaForm ? 'Cancel' : '+ New Post'}
              </Button>
            </div>

            {showIdeaForm && (
              <div
                className="border rounded-lg p-4"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                <form onSubmit={handleSubmitIdea} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={ideaForm.title}
                      onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                      placeholder="Discussion title..."
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      value={ideaForm.content}
                      onChange={(e) => setIdeaForm({ ...ideaForm, content: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
                      rows={4}
                      placeholder="Share your thoughts..."
                      required
                    />
                  </div>
                  <Button type="submit" size="sm">
                    Post Discussion
                  </Button>
                </form>
              </div>
            )}

            {sortedDiscussions.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  No discussions yet. Be the first to start one!
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {sortedDiscussions.slice(0, discussionsToShow).map((idea, index) => (
                    <div
                      key={idea.id}
                      className="border rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:scale-[1.01]"
                      style={{ 
                        borderColor: 'var(--border)', 
                        backgroundColor: 'var(--card)',
                        animation: `fadeInUp 0.4s ease-out ${index * 0.05}s both`
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{idea.title}</h3>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            by {idea.user.username} • {new Date(idea.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            onClick={() => handleVote(idea.id, 'upvote')}
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 h-auto text-xs transition-all duration-200 hover:scale-110 hover:border-green-500"
                          >
                            👍 {idea.upvotes}
                          </Button>
                          <Button
                            onClick={() => handleVote(idea.id, 'downvote')}
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 h-auto text-xs transition-all duration-200 hover:scale-110 hover:border-red-500"
                          >
                            👎 {idea.downvotes}
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)' }}>
                        {idea.content}
                      </p>
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: 'var(--border)' }}>
                        <span style={{ color: 'var(--muted-foreground)' }}>
                          Score: {idea.upvotes - idea.downvotes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Infinite scroll trigger */}
                {sortedDiscussions.length > discussionsToShow && (
                  <div ref={discussionsObserverTarget} className="flex justify-center py-4">
                    {isLoadingDiscussions && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
                        <span>Loading more discussions...</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </DynamicTabContent>
          )}
        </DynamicTabs>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmColor={confirmModal.confirmColor}
      />

      <LoginPromptDialog
        isOpen={loginPrompt.isOpen}
        onClose={() => setLoginPrompt({ ...loginPrompt, isOpen: false })}
        action={loginPrompt.action}
      />

      {/* Global Animations */}
      <style jsx global>{`
        @keyframes expandWidth {
          from {
            width: 0;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '@/components/shared/PostCard';
import {
  PlusCircle, Search, Filter, RefreshCw,
  MessageSquare, Users, Tag, ArrowDownAZ,
  Clock, CalendarDays, X, PowerCircle,
} from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  category?: string;
  tags?: string[];
  likes: string[];
  comments: string[];
  createdAt: string;
  updatedAt: string;
}

export default function CommunityForum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); // Changed from empty string to 'all'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOption, setSortOption] = useState('latest');

  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';

  useEffect(() => {
    // Check if user is logged in
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    // Fetch posts when component mounts or when search/category changes
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let url = '/api/post/all';

        if (category || search) {
          url += '?';
          if (category && category !== 'all') url += `category=${category}`; // Only add if not 'all'
          if (category && category !== 'all' && search) url += '&';
          if (search) url += `search=${search}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Set state based on URL params
    if (category) setSelectedCategory(category);
    if (search) setSearchTerm(search);
  }, [category, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let queryParams = new URLSearchParams();

    if (selectedCategory && selectedCategory !== 'all') queryParams.set('category', selectedCategory);
    if (searchTerm) queryParams.set('search', searchTerm);

    const queryString = queryParams.toString();
    router.push(`/community${queryString ? `?${queryString}` : ''}`);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);

    let queryParams = new URLSearchParams();
    if (category && category !== 'all') queryParams.set('category', category);
    if (searchTerm) queryParams.set('search', searchTerm);

    const queryString = queryParams.toString();
    router.push(`/community${queryString ? `?${queryString}` : ''}`);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all'); // Changed from empty string to 'all'
    router.push('/community');
  };

  // Get filtered posts based on active tab and sort option
  const getFilteredPosts = () => {
    let filtered = [...posts];

    // Filter by category tab
    if (activeTab === 'career') {
      filtered = filtered.filter(post => post.category === 'Career Advice' || post.category === 'Job Search');
    } else if (activeTab === 'resume') {
      filtered = filtered.filter(post => post.category === 'Resume Help');
    } else if (activeTab === 'interview') {
      filtered = filtered.filter(post => post.category === 'Interview Tips');
    } else if (activeTab === 'networking') {
      filtered = filtered.filter(post => post.category === 'Networking');
    }

    // Sort posts
    if (sortOption === 'latest') {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'popular') {
      filtered.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
    } else if (sortOption === 'alphabetical') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    return filtered;
  };

  const categories = [
    'General',
    'Career Advice',
    'Resume Help',
    'Interview Tips',
    'Job Search',
    'Networking'
  ];

  const filteredPosts = getFilteredPosts();

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array(3).fill(0).map((_, index) => (
      <Card key={index} className="mb-6 shadow-sm border-gray-200">
        <CardHeader className="pb-2">
          <Skeleton className="h-7 w-3/4 mb-2" />
          <div className="flex space-x-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="py-3">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
        <CardFooter className="flex justify-between pt-3">
          <Skeleton className="h-5 w-32" />
          <div className="flex space-x-3">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
              Community Forum
            </h1>
            <p className="mt-2 text-gray-600">Connect, share, and learn with fellow community members</p>
          </div>

          {isLoggedIn && (
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link href="/community/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          )}
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 border-none shadow-md overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Filter className="mr-2 h-4 w-4 text-blue-600" />
              Search & Filters
            </CardTitle>
            <CardDescription>Find specific posts or browse by category</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search posts..."
                      className="pl-10 border-gray-300"
                    />
                  </div>
                </div>

                <div className="md:w-1/4">
                  <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Changed from empty string to 'all' */}
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 md:w-auto">
                  <Button type="submit">
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>

                  {(searchTerm || selectedCategory !== 'all') && ( // Changed condition
                    <Button variant="outline" onClick={handleClearFilters}>
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>

              {(searchTerm || selectedCategory !== 'all') && ( // Changed condition
                <div className="flex items-center pt-2">
                  <p className="text-sm text-gray-500 mr-2">Active filters:</p>
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        {searchTerm}
                      </Badge>
                    )}
                    {selectedCategory !== 'all' && ( // Changed condition
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {selectedCategory}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Post Navigation */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 bg-white border border-gray-200 shadow-sm p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Users className="h-4 w-4 mr-2" />
                All Posts
              </TabsTrigger>
              <TabsTrigger value="career" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <CalendarDays className="h-4 w-4 mr-2" />
                Career Advice
              </TabsTrigger>
              <TabsTrigger value="resume" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Resume Help
              </TabsTrigger>
              <TabsTrigger value="interview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Users className="h-4 w-4 mr-2" />
                Interview Tips
              </TabsTrigger>
              <TabsTrigger value="networking" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <Tag className="h-4 w-4 mr-2" />
                Networking
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-end">
            <label className="text-sm text-gray-500 mr-2 whitespace-nowrap">Sort by:</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-40 border-gray-300">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="latest">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Latest
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    {/* Changed from FireExtinguisherIcon to Fire */}
                    <PowerCircle className="h-4 w-4 mr-2" />
                    Popular
                  </div>
                </SelectItem>
                <SelectItem value="alphabetical">
                  <div className="flex items-center">
                    <ArrowDownAZ className="h-4 w-4 mr-2" />
                    A-Z
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rest of your component remains unchanged */}
        {loading ? (
          <div className="space-y-6">
            {renderSkeletons()}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-2 mt-2" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 border-dashed border-2 border-gray-200 bg-gray-50">
            <CardContent className="flex flex-col items-center">
              <div className="bg-white p-5 rounded-full mb-4 shadow-sm">
                <MessageSquare className="h-12 w-12 text-blue-200" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No posts found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {searchTerm || selectedCategory !== 'all'
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Be the first to start a discussion in our community forum!"}
              </p>

              <div className="mt-6 flex gap-3">
                {(searchTerm || selectedCategory !== 'all') ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Filters
                  </Button>
                ) : isLoggedIn ? (
                  <Button asChild>
                    <Link href="/community/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create First Post
                    </Link>
                  </Button>
                ) : (
                  <Button asChild variant="outline">
                    <Link href="/auth/login">
                      <Users className="mr-2 h-4 w-4" />
                      Log In to Post
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {filteredPosts.length > 0 && !loading && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center text-sm text-gray-500">
              <p>Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</p>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      <span>Back to top</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scroll to top of page</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
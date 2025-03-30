"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    Loader2, ChevronLeft, User, MessageSquare, Heart,
    Share2, Edit, Trash2, Tag as TagIcon, BookmarkPlus, MoreHorizontal,
    ThumbsUp
} from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Components
import CommentList from '@/components/shared/CommentList';
import CommentForm from '@/components/shared/CommentForm';

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

interface Comment {
    _id: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    post: string;
    parentComment?: string;
    likes: string[];
    createdAt: string;
}

interface User {
    id: string;
    username: string;
    email: string;
}

export default function PostDetailPage() {
    // Get route parameters using useParams
    const params = useParams();
    const postId = params.id as string;

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const checkAuthStatus = async () => {
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error('Auth check error:', error);
            }
        };

        checkAuthStatus();
    }, []);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            if (!postId) return;

            setLoading(true);
            try {
                // Fetch post
                const postResponse = await fetch(`/api/post/one?id=${postId}`);
                if (!postResponse.ok) {
                    if (postResponse.status === 404) {
                        router.push('/community');
                        return;
                    }
                    throw new Error('Failed to fetch post');
                }

                const postData = await postResponse.json();
                setPost(postData.post);

                // Set liked state if user is logged in
                if (user && postData.post.likes.includes(user.id)) {
                    setIsLiked(true);
                }

                // Fetch comments
                const commentsResponse = await fetch(`/api/post/comment?postId=${postId}`);
                if (!commentsResponse.ok) {
                    console.log("Failed to fetch comments:", commentsResponse.statusText);
                } else {
                    const commentsData = await commentsResponse.json();
                    setComments(commentsData.comments || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to load content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndComments();
    }, [postId, router, user]);

    const handleCommentAdded = (newComment: Comment) => {
        setComments((prevComments) => [newComment, ...prevComments]);
        if (post) {
            setPost({
                ...post,
                comments: [...post.comments, newComment._id]
            });
        }
    };

    const handleDeletePost = async () => {
        if (!postId) return;

        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            const response = await fetch(`/api/post/one?id=${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete post');
            }

            router.push('/community');
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const handleLikePost = async () => {
        if (!user || !post) return;

        try {
            const response = await fetch(`/api/post/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId: post._id }),
            });

            if (!response.ok) {
                console.log('Failed to like post');
                // throw new Error('Failed to like post');
            }

            const data = await response.json();

            // Update post with new likes array
            setPost({
                ...post,
                likes: data.likes
            });

            // Toggle liked state
            setIsLiked(!isLiked);

        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const sharePost = () => {
        if (navigator.share) {
            navigator.share({
                title: post?.title || 'Shared post',
                text: `Check out this post: ${post?.title}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="animate-spin h-10 w-10 text-blue-600 mb-4" />
                <p className="text-gray-600">Loading post...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => router.push('/community')}>
                    Return to Forum
                </Button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Alert className="mb-6 border-yellow-200 bg-yellow-50">
                    <AlertTitle>Post not found</AlertTitle>
                    <AlertDescription>
                        {"The post you're looking for might have been removed or doesn't exist."}
                    </AlertDescription>
                </Alert>
                <Button variant="outline" onClick={() => router.push('/community')}>
                    {"Return to Forum"}
                </Button>
            </div>
        );
    }

    const isAuthor = user && user.id === post.author._id;
    const formattedDate = (new Date(post.createdAt).toLocaleString());

    // Get author initials for avatar
    const authorInitials = post.author.username
        .split(' ')
        .map(name => name?.[0] || '')
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/community"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 group bg-white px-4 py-2 rounded-full shadow-sm transition-all hover:shadow"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                        Back to Forum
                    </Link>

                    {user && (
                        <div className="flex items-center space-x-2">


                            {/* A button to like  */}
                            {/* <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={handleLikePost} className={isLiked ? "text-red-600 border-red-200 hover:bg-red-50" : ""}>
                                            <Heart className={`h-5 w-5 ${isLiked ? "fill-red-600" : ""}`} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{isLiked ? 'Unlike post' : 'Like post'}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider> */}

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={sharePost}>
                                            <Share2 className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Share post</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <BookmarkPlus className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Save post</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    )}
                </div>

                <Card className="mb-8 border-none shadow-xl overflow-hidden sm:rounded-lg sm:shadow-lg md:shadow-xl lg:rounded-xl lg:shadow-2xl">
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                    <CardHeader className="px-4 sm:px-6 md:px-8 lg:px-10">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl font-bold text-gray-900 leading-tight">
                                    {post.title}
                                </CardTitle>

                                <div className="flex items-center mt-4 space-x-4">
                                    
                                    <div className="flex items-center flex-wrap gap-3 sm:flex-nowrap">
                                        <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                                                {authorInitials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={`/profile/${post.author._id}`}
                                                className="font-medium text-blue-600 hover:underline truncate"
                                            >
                                                {post.author.username}
                                            </Link>
                                            <p className="text-xs text-gray-500 ">{formattedDate}</p>
                                        </div>
                                    </div>

                                    <Separator orientation="vertical" className="h-8" />



                                    <div className="flex flex-wrap items-end gap-4 text-gray-500 text-sm">
                                        <div className="flex items-center">
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {isAuthor && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={`/community/edit/${post._id}`} className="flex items-center">
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit post
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-red-600 focus:text-red-600"
                                            onClick={handleDeletePost}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete post
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        {(post.category || (post.tags && post.tags.length > 0)) && (
                            <div className="flex flex-wrap items-center gap-2 mt-4">
                                {post.category && (
                                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                        <TagIcon className="h-3 w-3 mr-1" />
                                        {post.category}
                                    </Badge>
                                )}

                                {post.tags && post.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="bg-gray-50 hover:bg-gray-100"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardHeader>

                    <Separator />

                    <CardContent className="py-6">
                        <div className="prose prose-blue max-w-none md:text-xl text-md">
                            {post.content.split('\n').map((paragraph, index) => (
                                paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                            Comments ({comments.length})
                        </CardTitle>
                        <CardDescription>
                            Join the conversation and share your thoughts
                        </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6">
                        {user ? (
                            <CommentForm
                                postId={post._id}
                                onCommentAdded={handleCommentAdded}
                            />
                        ) : (
                            <Alert className="bg-blue-50 border-blue-100 text-blue-800 mb-6">
                                <AlertTitle className="font-medium">Join the conversation</AlertTitle>
                                <AlertDescription>
                                    <Link href="/auth/login" className="text-blue-600 hover:underline font-medium">
                                        Log in
                                    </Link>{' '}
                                    to comment on this post.
                                </AlertDescription>
                            </Alert>
                        )}

                        {comments.length > 0 ? (
                            <div className="mt-8">
                                <Tabs defaultValue="newest" className="w-full">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="newest">Newest</TabsTrigger>
                                        <TabsTrigger value="oldest">Oldest</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="newest">
                                        <CommentList
                                            comments={[...comments].sort((a, b) =>
                                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                                            )}
                                            currentUser={user}
                                            postId={post._id}
                                            onCommentAdded={handleCommentAdded}
                                        />
                                    </TabsContent>

                                    <TabsContent value="oldest">
                                        <CommentList
                                            comments={[...comments].sort((a, b) =>
                                                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                                            )}
                                            currentUser={user}
                                            postId={post._id}
                                            onCommentAdded={handleCommentAdded}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-gray-50 rounded-lg mt-6">
                                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No comments yet</p>
                                <p className="text-gray-400 text-sm mt-1">Be the first to share your thoughts!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
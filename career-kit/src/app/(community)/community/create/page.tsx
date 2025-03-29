"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Loader2, Tags, Tag, Save, MessageSquareText, ListFilter, X } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [tagList, setTagList] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState("write");

    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const checkAuthStatus = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    setIsLoggedIn(true);
                } else {
                    // Redirect to login if not authenticated
                    router.push('/auth/login?redirect=/community/create');
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/auth/login?redirect=/community/create');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, [router]);

    // Process tags as they're typed
    useEffect(() => {
        if (tags.trim()) {
            setTagList(tags.split(',').map(tag => tag.trim()).filter(tag => tag));
        } else {
            setTagList([]);
        }
    }, [tags]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await fetch('/api/post/all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    content,
                    category: category || undefined,
                    tags: tagList.length > 0 ? tagList : undefined,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create post');
            }
            
            const data = await response.json();
            router.push(`/community/post/${data.post._id}`);
        } catch (error: any) {
            console.error('Error creating post:', error);
            setError(error.message || 'Failed to create post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const removeTag = (tagIndex: number) => {
        const newTagList = [...tagList];
        newTagList.splice(tagIndex, 1);
        setTagList(newTagList);
        setTags(newTagList.join(', '));
    };

    const categories = [
        'General',
        'Career Advice',
        'Resume Help',
        'Interview Tips',
        'Job Search',
        'Networking'
    ];

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center mb-6 text-blue-600">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    <span>Loading</span>
                </div>
                
                <Skeleton className="h-8 w-48 mb-6" />
                
                <Card className="border-none shadow-xl">
                    <CardHeader>
                        <Skeleton className="h-6 w-full max-w-[250px] mb-2" />
                        <Skeleton className="h-4 w-full max-w-[400px]" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-28 ml-auto" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (!isLoggedIn) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Link
                    href="/community"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group bg-white px-4 py-2 rounded-full shadow-sm transition-all hover:shadow"
                >
                    <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Back to Forum
                </Link>

                <Card className="border-none shadow-xl bg-white overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                    
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                            <MessageSquareText className="mr-2 h-5 w-5 text-blue-600" />
                            Create a New Post
                        </CardTitle>
                        <CardDescription className="text-gray-600">
                            Share your thoughts, questions, or insights with the community
                        </CardDescription>
                    </CardHeader>

                    {error && (
                        <div className="px-6">
                            <Alert variant="destructive" className="mb-4 border-l-4 border-red-600">
                                <AlertTitle className="font-bold">Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium flex items-center">
                                    Title <span className="text-red-500 ml-1">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter a descriptive title"
                                    className="focus-visible:ring-blue-500 border-gray-300 transition-all"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    A clear title helps others find your post
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-medium flex items-center">
                                    <ListFilter className="h-4 w-4 mr-1 text-gray-500" />
                                    Category
                                </Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="focus:ring-blue-500 border-gray-300 transition-all">
                                        <SelectValue placeholder="Select a category (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-sm font-medium flex items-center">
                                    Content <span className="text-red-500 ml-1">*</span>
                                </Label>
                                
                                <Tabs defaultValue="write" className="w-full" onValueChange={setCurrentTab}>
                                    <TabsList className="grid w-full grid-cols-2 mb-2">
                                        <TabsTrigger value="write">Write</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="write" className="mt-0">
                                        <Textarea
                                            id="content"
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Share your thoughts, questions, or insights..."
                                            className="min-h-[200px] focus-visible:ring-blue-500 border-gray-300 transition-all"
                                            required
                                        />
                                    </TabsContent>
                                    <TabsContent value="preview" className="mt-0">
                                        <div className="border rounded-md min-h-[200px] p-4 prose max-w-none bg-gray-50">
                                            {content ? (
                                                <div>{content}</div>
                                            ) : (
                                                <p className="text-gray-400 italic">Preview will appear here...</p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="tags" className="text-sm font-medium flex items-center">
                                    <Tags className="h-4 w-4 mr-1 text-gray-500" />
                                    Tags
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-3 text-gray-400">
                                        <Tag className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="tags"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        className="pl-10 focus-visible:ring-blue-500 border-gray-300 transition-all"
                                        placeholder="Enter tags separated by commas (optional)"
                                    />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Example: resume, interview, remote-work
                                </p>

                                {tagList.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {tagList.map((tag, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary" 
                                                className="flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 transition-colors"
                                            >
                                                <Tag className="h-3 w-3 text-blue-500" />
                                                {tag}
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeTag(index)}
                                                                className="ml-1 text-gray-400 hover:text-gray-700"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Remove tag</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <Separator className="my-2" />

                        <CardFooter className="flex justify-between pt-6 pb-6">
                            <p className="text-sm text-gray-500 italic">
                                {currentTab === "preview" ? "Looking good?" : "Review before posting"}
                            </p>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 px-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Publish Post
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Remember to follow our <Link href="/community/guidelines" className="text-blue-600 hover:underline">community guidelines</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
import React from 'react';
import Link from 'next/link';
import { Heart, MessageSquare, Calendar, Tag, ArrowUpRight, Share2 } from 'lucide-react';

// Shadcn UI Components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  likes: string[];
  comments: string[];
  createdAt: string;
  tags?: string[];
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  // Truncate content to a preview
  const preview = post.content.length > 150
    ? `${post.content.substring(0, 150)}...`
    : post.content;

  // Format date with improved readability
  const createdDate = new Date(post.createdAt);
  const formattedDate = createdDate.toLocaleDateString('en-US');
  // const formattedDate = createdDate.toLocaleDateString('en-US', {
  //   month: 'short',
  //   day: 'numeric', 
  //   year: createdDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  // });
  
  // Get author initials for avatar fallback
  const authorInitials = post.author.username
    .split(' ')
    .map(name => name?.[0] || '')
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden border-gray-200 bg-white group relative">
      {/* Colorful accent bar with animation */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      <CardHeader className="pb-1 pt-5 px-5">
        <div className="flex justify-between items-start gap-3">
          <Link 
            href={`/community/post/${post._id}`} 
            className="group/title block flex-1"
          >
            <h2 className="text-xl md:text-3xl font-bold leading-tight group-hover/title:text-blue-600 transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>
          
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/community/post/${post._id}`} className="ml-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View full post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/community/post/${post._id}`)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy link to post</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {post.category && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 text-xs font-medium">
              <Tag className="h-3 w-3 mr-1.5" />
              {post.category}
            </Badge>
          )}
          
          {post.tags && post.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-gray-600 bg-gray-50 hover:bg-gray-100 px-2.5 py-0.5 text-xs">
              {tag}
            </Badge>
          ))}
          
          {post.tags && post.tags.length > 2 && (
            <Badge variant="outline" className="text-gray-500 bg-transparent px-2 py-0.5 text-xs">
              +{post.tags.length - 2} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-3 px-5">
        <p className="text-gray-700 text-md md:text-xl leading-relaxed tracking-wide">{preview}</p>
        
        {post.content.length > 150 && (
          <Link 
            href={`/community/post/${post._id}`} 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center mt-2"
          >
            Read more 
            <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        )}
      </CardContent>
      
      <Separator className="my-2 bg-gray-100" />
      
      <CardFooter className=" px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Avatar className="h-7 w-7 mr-2 ring-2 ring-white shadow-sm">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-medium">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            
            <Link
              href={`/profile/${post.author._id}`}
              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              {post.author.username}
            </Link>
          </div>
          
          <span className="hidden sm:inline text-gray-400">•</span>
          
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
            <span className="text-gray-500 text-xs">{formattedDate}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors">
            <Heart className={`h-4 w-4 ${post.likes.length > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
            <span className={`${post.likes.length > 0 ? 'text-gray-700' : 'text-gray-500'}`}>
              {post.likes.length > 0 ? post.likes.length : 'Like'}
            </span>
          </div>
          
          <Link href={`/community/post/${post._id}#comments`}>
            <div className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-full transition-colors">
              <MessageSquare className={`h-4 w-4 ${post.comments.length > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className={`${post.comments.length > 0 ? 'text-gray-700' : 'text-gray-500'}`}>
                {post.comments.length > 0 ? `${post.comments.length} ${post.comments.length === 1 ? 'comment' : 'comments'}` : 'Comment'}
              </span>
            </div>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
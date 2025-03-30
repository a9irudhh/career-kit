"use client";

import React, { useState } from 'react';
import CommentForm from './CommentForm';

interface User {
  id: string;
  username: string;
  email: string;
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

interface CommentListProps {
  comments: Comment[];
  currentUser: User | null;
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}



export default function CommentList({
  comments,
  currentUser,
  postId,
  onCommentAdded
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Filter top-level comments
  const topLevelComments = comments.filter(comment => !comment.parentComment);
  
  // Get replies to a specific comment
  const getReplies = (commentId: string) => {
    return comments.filter(comment => comment.parentComment === commentId);
  };
  
  const handleReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };
  
  const handleCancelReply = () => {
    setReplyingTo(null);
  };
  
  const renderComment = (comment: Comment, isReply = false) => {
    const replies = getReplies(comment._id);
    const isAuthor = currentUser && currentUser.id === comment.author._id;
    
    return (
      <div 
        key={comment._id} 
        className={`${isReply ? 'ml-6 mt-3 pl-3 border-l-2 border-gray-200' : 'mb-6 pb-6 border-b border-gray-200'}`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-1">
            <span className="font-medium">{comment.author.username}</span>
            {isAuthor && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Author
              </span>
            )}
            <span className="text-gray-500 text-xs ml-2">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          
          {currentUser && (
            <button
              onClick={() => handleReply(comment._id)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Reply
            </button>
          )}
        </div>
        
        <div className="mt-1 text-gray-800">
          {comment.content}
        </div>
        
        {replyingTo === comment._id && (
          <div className="mt-3">
            <CommentForm
              postId={postId}
              parentCommentId={comment._id}
              onCommentAdded={onCommentAdded}
              onCancel={handleCancelReply}
            />
          </div>
        )}
        
        {replies.length > 0 && (
          <div className="mt-3">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-6">
      {topLevelComments.map(comment => renderComment(comment))}
    </div>
  );
}
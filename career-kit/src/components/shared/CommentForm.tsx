"use client";

import React, { useState } from 'react';
import { Loader } from 'lucide-react';

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
  };
  post: string;
  parentComment?: string;
  createdAt: string;
}

interface CommentFormProps {
  postId: string;
  parentCommentId?: string;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
}

export default function CommentForm({
  postId,
  parentCommentId,
  onCommentAdded,
  onCancel
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      const response = await fetch(`/api/post/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          postId,
          parentCommentId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to post comment');
      }
      
      const data = await response.json();
      setContent('');
      onCommentAdded(data.comment);
      
      if (onCancel) {
        onCancel();
      }
    } catch (error: any) {
      console.error('Error posting comment:', error);
      setError(error.message || 'Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentCommentId ? "Write a reply..." : "Join the discussion..."}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={parentCommentId ? 3 : 4}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            parentCommentId ? 'Reply' : 'Post Comment'
          )}
        </button>
      </div>
    </form>
  );
}
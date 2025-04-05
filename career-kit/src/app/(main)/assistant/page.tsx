'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bot, User } from "lucide-react";
import { motion } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/main/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 mb-4">Chat with our AI Assistant</h1>
          <p className="text-blue-700 max-w-xl mx-auto text-lg">
            Ask anything related to your uploaded documents or general questions.
          </p>
        </div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-10 backdrop-blur-md bg-white/70 border border-blue-200 border-b-0 rounded-t-2xl px-6 py-4 shadow-md">
          <h2 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-500" />
            AI Chat
          </h2>
        </div>

        {/* Main Chat Card */}
        <Card className="w-full shadow-xl border border-t-0 rounded-t-none rounded-b-2xl border-blue-200 bg-white">
          <CardContent className="px-6 py-5">
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      {msg.sender === 'bot' ? (
                        <Bot className="w-5 h-5 text-blue-500" />
                      ) : (
                        <User className="w-5 h-5 text-blue-500" />
                      )}
                      <div
                        className={`px-5 py-4 rounded-xl shadow max-w-[75%] text-sm whitespace-pre-wrap leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    className="flex justify-start"
                  >
                    <div className="w-fit px-5 py-4 rounded-lg bg-blue-50 text-blue-500 text-sm animate-pulse">
                      Typing...
                    </div>
                  </motion.div>
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            {/* Input section */}
            <div className="mt-6 flex items-center gap-3">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 rounded-full border-blue-300 focus:ring-blue-500"
                aria-label="Type your message"
              />
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Send message"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Send'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

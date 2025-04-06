'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2, Bot, User, Send, ArrowDown, Lightbulb, Copy, 
  RefreshCcw, BookOpen, Sparkles, Briefcase, GraduationCap,
  Search, PanelRight, History, Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I\'m your CareerKit AI assistant. I can help with job search, resume tips, interview prep, and career advice. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [infoPanelOpen, setInfoPanelOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState('topics');

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Example suggestions
  const suggestions = [
    "Help me prepare for a technical interview",
    "How can I improve my resume?",
    "Tips for networking in tech",
    "How to negotiate a job offer"
  ];

  // Example conversation topics
  const topics = [
    { icon: <Briefcase className="h-4 w-4" />, title: "Career Planning", description: "Long-term career development" },
    { icon: <GraduationCap className="h-4 w-4" />, title: "Interview Prep", description: "Ace your next interview" },
    { icon: <BookOpen className="h-4 w-4" />, title: "Resume Building", description: "Craft a winning resume" },
    { icon: <Search className="h-4 w-4" />, title: "Job Search", description: "Find your ideal position" },
  ];

  // Example conversation history
  const chatHistory = [
    { title: "Resume formatting tips", date: "4h ago" },
    { title: "Technical interview for frontend dev", date: "Yesterday" },
    { title: "Salary negotiation advice", date: "Apr 2" },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Toggle responsive sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Toggle info panel
  const toggleInfoPanel = () => setInfoPanelOpen(!infoPanelOpen);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      console.log(err)
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Top navigation bar */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 justify-between z-10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-xl hidden sm:block bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700">
              Career Assistant
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-white text-indigo-600 border-indigo-200 hidden sm:flex items-center">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400 inline-block"></span>
            AI Assistant Online
          </Badge>

          <Button variant="ghost" size="icon" onClick={toggleInfoPanel} className="text-slate-600">
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="w-full max-w-[280px] border-r border-slate-200 bg-white flex flex-col z-20 absolute md:relative h-[calc(100vh-4rem)]"
            >
              <div className="p-4 flex justify-between items-center">
                <h2 className="font-semibold text-slate-700">Career Kit</h2>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                  <X className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              <Tabs value={activeSidebarTab} onValueChange={setActiveSidebarTab} className="flex-1 flex flex-col">
                <TabsList className="grid grid-cols-2 w-[95%] mx-auto mb-2">
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="topics" className="flex-1 p-3">
                  <div className="grid grid-cols-1 gap-2">
                    {topics.map((topic, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="h-auto py-3 px-4 flex items-start justify-start gap-3 bg-white hover:bg-blue-50"
                        onClick={() => handleSuggestionClick(`Let's discuss ${topic.title.toLowerCase()}`)}
                      >
                        <div className="p-2 bg-blue-100 rounded-md text-blue-700">
                          {topic.icon}
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-slate-800">{topic.title}</p>
                          <p className="text-xs text-slate-500">{topic.description}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="history" className="flex-1 p-3">
                  <div className="space-y-2">
                    {chatHistory.map((chat, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-md hover:bg-slate-100 cursor-pointer">
                        <History className="h-4 w-4 text-slate-400" />
                        <div>
                          <p className="text-sm font-medium">{chat.title}</p>
                          <p className="text-xs text-slate-500">{chat.date}</p>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-4 text-slate-500 text-xs"
                      onClick={() => setMessages([{ sender: 'bot', text: 'Hello! I\'m your CareerKit AI assistant. How can I help you today?' }])}
                    >
                      <RefreshCcw className="h-3.5 w-3.5 mr-1" />
                      New Conversation
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main chat area */}
        <div className="flex-1 relative flex flex-col overflow-hidden">
          {/* Backdrop when sidebar is open on mobile */}
          {sidebarOpen && (
            <div
              className="absolute inset-0 bg-black/20 z-10 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Chat messages area */}
          <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 px-4 md:px-8 py-6"
          >
            <div className="max-w-3xl mx-auto space-y-6">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`group flex items-end gap-2 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className={`h-8 w-8 ${msg.sender === 'user' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                        <AvatarFallback>
                          {msg.sender === 'user' ? <User className="h-4 w-4 bg-emerald-500 text-white" /> : <Bot className="h-4 w-4 bg-blue-500 text-white" />}
                        </AvatarFallback>

                      </Avatar>

                      <div className="space-y-1">
                        <div
                          className={`px-4 py-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap leading-relaxed ${msg.sender === 'user'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-none'
                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                            }`}
                        >
                          {msg.text}
                        </div>

                        {msg.sender === 'bot' && (
                          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1 space-x-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => copyToClipboard(msg.text)}
                                  >
                                    <Copy className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Copy to clipboard</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsUp className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>This was helpful</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider> */}

                            {/* <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <ThumbsDown className="h-3 w-3 text-slate-400" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{"This wasn't helpful"}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-indigo-500">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-sm flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                          className="h-2 w-2 bg-indigo-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                          className="h-2 w-2 bg-indigo-400 rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                          className="h-2 w-2 bg-indigo-400 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-slate-500">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Scroll down button */}
            {showScrollButton && (
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-5 right-5 rounded-full shadow-md bg-white border-indigo-100 hover:bg-indigo-50"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4 text-indigo-600" />
              </Button>
            )}
          </ScrollArea>

          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="px-4 md:px-8 py-3 bg-gradient-to-b from-transparent to-blue-50/50">
              <div className="max-w-3xl mx-auto">
                <p className="flex items-center text-xs text-slate-500 mb-2">
                  <Lightbulb className="h-3 w-3 mr-1 text-amber-500" />
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="bg-white text-xs py-1 px-3 h-auto rounded-full text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Separator className="bg-slate-200" />

          {/* Input section */}
          <div className="p-4 md:p-6 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 rounded-full border-slate-200 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 py-6 px-4 shadow-sm"
                  aria-label="Type your message"
                />
                <Button
                  onClick={sendMessage}
                  disabled={loading}
                  className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                  aria-label="Send message"
                >
                  {loading ?
                    <Loader2 className="h-5 w-5 animate-spin" /> :
                    <Send className="h-5 w-5" />
                  }
                </Button>
              </div>

              <div className="mt-2 text-center">
                <span className="text-xs text-slate-400">
                  AI responses are generated based on available information and may not always be accurate.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right info panel */}
        <AnimatePresence>
          {infoPanelOpen && (
            <motion.div
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="w-[350px] border-l border-slate-200 bg-white flex-col hidden lg:flex overflow-auto"
            >
              <div>
                <div className="p-4 border-b border-slate-200 flex justify-between">
                  <h2 className="font-semibold text-slate-700">Career Resources</h2>
                  <Button variant="ghost" size="icon" onClick={toggleInfoPanel}>
                    <X className="h-4 w-4 text-slate-500" />
                  </Button>
                </div>

                <div className="p-4 flex-1">
                  <h3 className="text-sm text-slate-500 mb-3">Popular Resources</h3>

                  <div className="space-y-2">
                    <Card className="bg-indigo-50/50 border-indigo-100">
                      <CardContent className="p-4">
                        <div className="mb-2 flex justify-between items-start">
                          <Badge className="bg-indigo-100 text-indigo-600 hover:bg-indigo-100">Guide</Badge>
                          <BookOpen className="h-4 w-4 text-indigo-500" />
                        </div>
                        <h4 className="font-medium mb-1">Technical Interview Handbook</h4>
                        <p className="text-xs text-slate-600">Comprehensive guide to technical interviews with practice questions</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-50/50 border-blue-100">
                      <CardContent className="p-4">
                        <div className="mb-2 flex justify-between items-start">
                          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Template</Badge>
                          <Briefcase className="h-4 w-4 text-blue-500" />
                        </div>
                        <h4 className="font-medium mb-1">Resume Templates</h4>
                        <p className="text-xs text-slate-600">Industry-specific resume templates and examples</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-purple-50/50 border-purple-100">
                      <CardContent className="p-4">
                        <div className="mb-2 flex justify-between items-start">
                          <Badge className="bg-purple-100 text-purple-600 hover:bg-purple-100">Tool</Badge>
                          <Sparkles className="h-4 w-4 text-purple-500" />
                        </div>
                        <h4 className="font-medium mb-1">Salary Negotiation Tool</h4>
                        <p className="text-xs text-slate-600">Data-driven insights for negotiating your compensation package</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator className="my-5" />

                  <h3 className="text-sm text-slate-500 mb-3">Related Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">Resume Optimization</Badge>
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">LinkedIn Profile</Badge>
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">Technical Skills</Badge>
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">Remote Work</Badge>
                    <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 cursor-pointer">Career Change</Badge>
                  </div>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}



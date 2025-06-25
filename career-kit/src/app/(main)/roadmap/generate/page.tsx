"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  GraduationCap, 
  Map, 
  BarChart4, 
  BookOpen, 
  ArrowRight,
  Code
} from "lucide-react";
import { generateCareerRoadmap } from '@/gemini-calls/roadmap-creator';

const RoadmapGenerator = () => {
    const [jobTitle, setJobTitle] = useState('');
    const [level, setLevel] = useState('BEGINNER');
    const [timeRange, setTimeRange] = useState('1-YEAR');
    const [customTime, setCustomTime] = useState('');
    const [isCustomTime, setIsCustomTime] = useState(false);
    const [generatedRoadmap, setGeneratedRoadmap] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Set isCustomTime when timeRange changes
    useEffect(() => {
        setIsCustomTime(timeRange === 'CUSTOM');
    }, [timeRange]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Use custom time value if selected, otherwise use predefined timeRange
            const timeRangeToUse = isCustomTime ? `CUSTOM-${customTime}` : timeRange;
            const dataFromGemini = await generateCareerRoadmap(jobTitle, level, timeRangeToUse);
            console.log('Generated Roadmap:', dataFromGemini);
            setGeneratedRoadmap(dataFromGemini);
        } catch (error) {
            console.error('Error generating roadmap:', error);
        } finally {
            setIsLoading(false);
        }
    };

    
// Add this new function after handleSubmit
const handleSaveToDatabase = async () => {
    if (!generatedRoadmap) return;
    
    setIsLoading(true);
    
    try {
        const response = await fetch('/api/roadmaps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jobTitle,
                level,
                timeRange: isCustomTime ? `CUSTOM-${customTime}` : timeRange,
                roadmapContent: generatedRoadmap,
                createdAt: new Date().toISOString(),
            }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Roadmap saved successfully:', result);
            // You can add a success notification here
            alert('Roadmap saved successfully!');
        } else {
            throw new Error('Failed to save roadmap');
        }
    } catch (error) {
        console.error('Error saving roadmap:', error);
        alert('Failed to save roadmap. Please try again.');
    } finally {
        setIsLoading(false);
    }
};

    return (
        <div className="container mx-auto py-8 max-w-5xl">
            {/* Existing header and feature sections remain unchanged */}
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    Career Roadmap Generator
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Get a personalized career development plan tailored to your goals, experience level, and timeline
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                {/* Feature sections remain unchanged */}
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Map className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Personalized Path</h3>
                    <p className="text-gray-600 text-sm">Custom roadmap based on your current skill level and career goals</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Timeline Based</h3>
                    <p className="text-gray-600 text-sm">Structured timeline with achievable milestones for your career progression</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 flex flex-col items-center text-center">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <BarChart4 className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Industry Insights</h3>
                    <p className="text-gray-600 text-sm">Current trends, salary benchmarks, and in-demand skills for your role</p>
                </div>
            </div>

            <Card className="mb-12 border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 pt-4">
                    <CardTitle className="flex items-center text-blue-800">
                        <Briefcase className="mr-2  w-5" />
                        Generate Your Career Roadmap
                    </CardTitle>
                    <CardDescription>
                        Enter your desired job title, current skill level, and timeframe to get a personalized roadmap
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Job Title</label>
                            <Input
                                placeholder="e.g. Full Stack Developer, Data Scientist, UX Designer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Your Current Level</label>
                                <Select value={level} onValueChange={setLevel}>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select your level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Timeframe</label>
                                <Select value={timeRange} onValueChange={setTimeRange}>
                                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                        <SelectValue placeholder="Select timeframe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1-YEAR">1 Year</SelectItem>
                                        <SelectItem value="2-YEARS">2 Years</SelectItem>
                                        <SelectItem value="3-YEARS">3 Years</SelectItem>
                                        <SelectItem value="5-YEARS">5 Years</SelectItem>
                                        <SelectItem value="CUSTOM">Custom Timeframe</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Custom time input that appears when "Custom Timeframe" is selected */}
                        {isCustomTime && (
                            <div className="mt-4 flex items-center">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium mb-2 text-gray-700">
                                        Enter Custom Time Period (months)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 18"
                                        value={customTime}
                                        onChange={(e) => setCustomTime(e.target.value)}
                                        min="1"
                                        max="120"
                                        required={isCustomTime}
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="ml-4 mt-8 text-sm text-gray-500">
                                    months
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || (isCustomTime && !customTime)}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                                    Generating Your Roadmap...
                                </>
                            ) : (
                                <>
                                    <GraduationCap className="mr-2 h-4 w-4" />
                                    Generate My Roadmap
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* The rest of your component remains unchanged */}
            {generatedRoadmap && (
                <div>

        <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
                <div className="mr-3 h-10 w-1 bg-blue-600"></div>
                <h2 className="text-2xl font-bold text-gray-800">Your Career Roadmap</h2>
            </div>
            <Button
                onClick={handleSaveToDatabase}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
            >
                {isLoading ? (
                    <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Save to Library
                    </>
                )}
            </Button>
        </div>
                    
                    <Tabs defaultValue="roadmap" className="mb-10">
                        <TabsList className="mb-4 w-full sm:w-auto">
                            <TabsTrigger value="roadmap" className="text-sm">
                                <Map className="h-4 w-4 mr-2" />
                                Roadmap
                            </TabsTrigger>
                            <TabsTrigger value="print" className="text-sm">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Print View
                            </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="roadmap" className="p-0">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-4 sm:p-8">
                                <div
                                    className="roadmap-content"
                                    dangerouslySetInnerHTML={{ __html: generatedRoadmap }}
                                />
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="print" className="p-0">
                            <div className="bg-white rounded-lg shadow-lg border border-gray-100 p-8">
                                <div 
                                    className="print-view font-serif"
                                    dangerouslySetInnerHTML={{ __html: generatedRoadmap }}
                                />
                                <div className="mt-6 text-center">
                                    <Button
                                        onClick={() => window.print()}
                                        variant="outline" 
                                        className="flex items-center justify-center text-blue-600 hover:bg-blue-50"
                                    >
                                        <BookOpen className="mr-2 h-4 w-4" />
                                        Print Roadmap
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
            
            {/* Resource section at bottom */}
            <div className="mt-16 border-t border-gray-200 pt-10">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Career Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-start">
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Code className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">Technical Interview Prep</h4>
                                    <p className="text-sm text-gray-600 mt-1">Practice for coding interviews with our question library</p>
                                    <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                                        <span>Explore questions</span>
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-6">
                            <div className="flex items-start">
                                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <BookOpen className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-800">Community Forum</h4>
                                    <p className="text-sm text-gray-600 mt-1">Connect with others on similar career paths</p>
                                    <Button variant="link" className="p-0 h-auto mt-2 text-blue-600">
                                        <span>Join discussions</span>
                                        <ArrowRight className="ml-1 h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RoadmapGenerator;
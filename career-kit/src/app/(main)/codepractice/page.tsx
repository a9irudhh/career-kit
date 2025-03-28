'use client';

import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { GenerateQuestion } from '@/gemini-calls/qna-code';

// Import Shadcn UI components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Code, FileCode, RefreshCw } from "lucide-react";

const programmingConcepts = [
    'Arrays',
    'Strings',
    'Hash Tables',
    'Stacks',
    'Queues',
    'Heaps',
    'Graphs',
    'Linked Lists',
    'Trees and Graphs',
    'Dynamic Programming',
    'Recursion',
    'Sorting Algorithms',
    'Searching Algorithms',
    'Object-Oriented Programming',
    'Functional Programming',
];

const programmingLanguages = [
    { id: 'cpp', name: 'C++' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'csharp', name: 'C#' },
    { id: 'go', name: 'Go' },
    { id: 'rust', name: 'Rust' },
];

const CodePracticePage = () => {
    const [selectedConcept, setSelectedConcept] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState(programmingLanguages[0]);
    const [generatedProblem, setGeneratedProblem] = useState<{
        title: string;
        description: string;
        testCases: { input: string; output: string }[];
        explanation: string;
    }>({
        title: '',
        description: '',
        testCases: [],
        explanation: '',
    });
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState({ success: false, message: '', details: '' });
    const [showResult, setShowResult] = useState(false);
    const [refreshingQuestion, setRefreshingQuestion] = useState(false);

    // Generate a problem using Gemini AI
    const generateProblem = async (concept) => {
        setIsLoading(true);
        try {
            const problem = await GenerateQuestion(concept);
            console.log('Generated Problem:', problem);
            // Parse the JSON response from the AI
            if (problem) {
                setGeneratedProblem({
                    title: problem.title,
                    description: problem.description,
                    testCases: problem.testCases,
                    explanation: problem.explanation,
                });
            } else {
                setGeneratedProblem({
                    title: 'No problem generated',
                    description: 'Please try again later.',
                    testCases: [],
                    explanation: '',
                });
            }
        } catch (error) {
            console.error('Error generating problem:', error);
            setGeneratedProblem({
                title: 'Error generating problem',
                description: 'There was an error generating a problem. Please try again.',
                testCases: [],
                explanation: '',
            });
        } finally {
            setIsLoading(false);
            setRefreshingQuestion(false);
        }
    };

    // Handle concept selection
    const handleConceptChange = (value) => {
        setSelectedConcept(value);
        if (value) {
            generateProblem(value);
            setCode(''); // Clear code when new problem is generated
            setShowResult(false);
        }
    };

    // Handle refreshing the question
    const handleRefreshQuestion = () => {
        if (selectedConcept) {
            setRefreshingQuestion(true);
            setCode(''); // Clear code when refreshing problem
            setShowResult(false);
            generateProblem(selectedConcept);
        }
    };

    // Handle language selection
    const handleLanguageChange = (value) => {
        const language = programmingLanguages.find(lang => lang.id === value);
        setSelectedLanguage(language);
    };

    // Handle code changes
    const handleCodeChange = (value) => {
        setCode(value);
    };

    // Handle code submission
    const handleSubmitCode = async () => {
        setIsLoading(true);
        try {
            // In a real application, you would send the code to a backend service
            // that would run the code against the test cases
            // For now, we'll simulate with a fake response

            setTimeout(() => {
                // Simulate code evaluation
                const success = Math.random() > 0.5;

                setResult({
                    success,
                    message: success ? 'All test cases passed!' : 'Some test cases failed.',
                    details: success
                        ? 'Your solution passed all test cases efficiently.'
                        : 'Your solution failed on test case #2. Expected output was different from actual output.'
                });

                setShowResult(true);
                setIsLoading(false);
            }, 1500);

        } catch (error) {
            console.error('Error submitting code:', error);
            setResult({
                success: false,
                message: 'Error evaluating code',
                details: error.message
            });
            setShowResult(true);
            setIsLoading(false);
        }
    };

    // Clear the code editor
    const handleClearCode = () => {
        setCode('');
        setShowResult(false);
    };

    return (
        <div className="container max-w-7xl mx-auto py-8 px-4">
            <div className="flex flex-col space-y-2 mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Coding Practice</h1>
                <p className="text-muted-foreground">
                    Select a concept, solve the generated problem, and test your solution.
                </p>
            </div>

            {/* Concept Selector with Shadcn UI */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Select a Programming Concept</CardTitle>
                    <CardDescription>
                        Choose a programming topic to generate a practice problem
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={selectedConcept}
                        onValueChange={handleConceptChange}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a concept" />
                        </SelectTrigger>
                        <SelectContent>
                            {programmingConcepts.map((concept) => (
                                <SelectItem key={concept} value={concept}>
                                    {concept}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {isLoading && !generatedProblem.title ? (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin">
                        <RefreshCw className="h-10 w-10 text-primary" />
                    </div>
                </div>
            ) : selectedConcept && generatedProblem.title ? (
                <div className="grid grid-cols-1 gap-6">
                    {/* Problem Section */}
                    <Card>
                        <CardHeader className="bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileCode className="h-5 w-5" />
                                    <CardTitle>{generatedProblem.title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{selectedConcept}</Badge>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={handleRefreshQuestion}
                                        disabled={refreshingQuestion}
                                        className="flex items-center gap-1"
                                    >
                                        {refreshingQuestion ? (
                                            <>
                                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                                <span>Refreshing</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="h-3.5 w-3.5" />
                                                <span>New Question</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Problem Description</h3>
                                <div className="prose max-w-none text-muted-foreground">
                                    <p className="whitespace-pre-line">{generatedProblem.description}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Example Test Cases</h3>
                                <div className="bg-muted rounded-md p-4">
                                    {generatedProblem.testCases && generatedProblem.testCases.length > 0 ? (
                                        <ul className="space-y-4">
                                            {generatedProblem.testCases.map((testCase, index) => (
                                                <li key={index} className="border border-border rounded-md p-3 bg-card">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium mb-1">Input:</p>
                                                            <code className="text-sm p-2 bg-muted rounded block">
                                                                {testCase.input}
                                                            </code>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium mb-1">Expected Output:</p>
                                                            <code className="text-sm p-2 bg-muted rounded block">
                                                                {testCase.output.toString()}
                                                            </code>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted-foreground italic">No test cases available</p>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {
                                /* <div>
                                    <h3 className="text-lg font-semibold mb-2">Approach</h3>
                                    <p className="whitespace-pre-line text-muted-foreground">{generatedProblem.explanation}</p>
                                </div> */
                            }

                        </CardContent>
                    </Card>

                    {/* Solution Section */}
                    <Card>
                        <CardHeader className="bg-muted/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Code className="h-5 w-5" />
                                    <div>
                                        <CardTitle>Your Solution</CardTitle>
                                        <CardDescription>
                                            Implement your solution below
                                        </CardDescription>
                                    </div>
                                </div>
                                <Select
                                    value={selectedLanguage.id}
                                    onValueChange={handleLanguageChange}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {programmingLanguages.map((language) => (
                                            <SelectItem key={language.id} value={language.id}>
                                                {language.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="border rounded overflow-hidden mb-4 p-4" style={{ height: '400px' }}>
                                <MonacoEditor
                                    height="100%"
                                    language={selectedLanguage.id}
                                    value={code}
                                    onChange={handleCodeChange}
                                    theme="vs-dark"
                                    options={{
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        fontSize: 14,
                                    }}
                                />
                            </div>

                            {/* Results Section */}
                            {showResult && (
                                <Alert
                                    variant={result.success ? "default" : "destructive"}
                                    className="mt-4"
                                >
                                    <div className="flex items-center gap-2">
                                        {result.success ? (
                                            <CheckCircle className="h-5 w-5" />
                                        ) : (
                                            <XCircle className="h-5 w-5" />
                                        )}
                                        <AlertTitle>{result.message}</AlertTitle>
                                    </div>
                                    <AlertDescription className="mt-2">
                                        {result.details}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={handleClearCode}>
                                Clear
                            </Button>
                            <Button
                                onClick={handleSubmitCode}
                                disabled={isLoading || !code.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting
                                    </>
                                ) : (
                                    "Submit"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            ) : null}
        </div>
    );
};

export default CodePracticePage;
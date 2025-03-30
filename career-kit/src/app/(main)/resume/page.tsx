'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileDown, Copy, Share2, PlusCircle, X, Briefcase, GraduationCap, Link, FolderKanban } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateResume } from '@/gemini-calls/resume-builder';

// Individual item schemas
const educationItemSchema = z.object({
    institution: z.string().min(2, "Institution name is required"),
    degree: z.string().min(2, "Degree name is required"),
    year: z.string().min(2, "Graduation year is required"),
});

const experienceItemSchema = z.object({
    company: z.string().min(2, "Company name is required"),
    position: z.string().min(2, "Position is required"),
    duration: z.string().min(2, "Duration is required"),
    description: z.string().min(10, "Please provide more details"),
});

const projectItemSchema = z.object({
    name: z.string().min(2, "Project name is required"),
    description: z.string().min(10, "Please provide more details"),
    technologies: z.string().min(2, "Technologies used are required"),
});

const linkItemSchema = z.object({
    platform: z.string().min(2, "Platform name is required"),
    url: z.string().url("Please enter a valid URL"),
});

// Form validation schema
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(5, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email address"),
    skills: z.string().min(5, "Please list some of your skills"),
    extraCurricular: z.string().optional(),
});

const ResumeWizPage = () => {
    const [activeTab, setActiveTab] = useState("form");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // State for storing list items
    const [educationItems, setEducationItems] = useState<z.infer<typeof educationItemSchema>[]>([]);
    const [experienceItems, setExperienceItems] = useState<z.infer<typeof experienceItemSchema>[]>([]);
    const [projectItems, setProjectItems] = useState<z.infer<typeof projectItemSchema>[]>([]);
    const [linkItems, setLinkItems] = useState<z.infer<typeof linkItemSchema>[]>([]);

    // Forms for adding individual items
    const educationForm = useForm<z.infer<typeof educationItemSchema>>({
        resolver: zodResolver(educationItemSchema),
        defaultValues: { institution: "", degree: "", year: "" }
    });

    const experienceForm = useForm<z.infer<typeof experienceItemSchema>>({
        resolver: zodResolver(experienceItemSchema),
        defaultValues: { company: "", position: "", duration: "", description: "" }
    });

    const projectForm = useForm<z.infer<typeof projectItemSchema>>({
        resolver: zodResolver(projectItemSchema),
        defaultValues: { name: "", description: "", technologies: "" }
    });

    const linkForm = useForm<z.infer<typeof linkItemSchema>>({
        resolver: zodResolver(linkItemSchema),
        defaultValues: { platform: "", url: "" }
    });

    const [resumeData, setResumeData] = useState<{
        summary: string;
        sections: { title: string; content: any }[];
    }>({
        summary: "",
        sections: [],
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            skills: "",
            extraCurricular: "",
        },
    });

    // Handlers for adding items to each list
    const addEducation = (data: z.infer<typeof educationItemSchema>) => {
        setEducationItems([...educationItems, data]);
        educationForm.reset();

    };

    const addExperience = (data: z.infer<typeof experienceItemSchema>) => {
        setExperienceItems([...experienceItems, data]);
        experienceForm.reset();

    };

    const addProject = (data: z.infer<typeof projectItemSchema>) => {
        setProjectItems([...projectItems, data]);
        projectForm.reset();

    };

    const addLink = (data: z.infer<typeof linkItemSchema>) => {
        setLinkItems([...linkItems, data]);
        linkForm.reset();

    };

    // Handlers for removing items from each list
    const removeEducation = (index: number) => {
        setEducationItems(educationItems.filter((_, i) => i !== index));
    };

    const removeExperience = (index: number) => {
        setExperienceItems(experienceItems.filter((_, i) => i !== index));
    };

    const removeProject = (index: number) => {
        setProjectItems(projectItems.filter((_, i) => i !== index));
    };

    const removeLink = (index: number) => {
        setLinkItems(linkItems.filter((_, i) => i !== index));
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        setError(null);
        setIsGenerating(true);

        try {
            // Validate that at least some items have been added


            const response = await generateResume({
                personalInfo: {
                    name: values.name,
                    phone: values.phone,
                    email: values.email,
                },
                education: educationItems,
                experience: experienceItems,
                projects: projectItems,
                links: linkItems,
                skills: values.skills,
                extraCurricular: values.extraCurricular || "",
            });

            console.log("Generated Resume Data:", response);




            setResumeData(response);

            // Switch to preview tab and show success toast
            setActiveTab("preview");

        } catch (error) {
            console.error('Error:', error);
            setError(error instanceof Error ? error.message : "Failed to generate the resume. Please try again.");

        } finally {
            setIsGenerating(false);
        }
    };

    const handleExport = () => {

    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Professional Resume Builder</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        {"Create a professionally formatted resume in minutes with our AI-powered tool. Add your details section by section, and we'll generate a tailored resume for your job applications."}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex justify-center mb-6">
                        <TabsList className="grid w-[400px] grid-cols-2">
                            <TabsTrigger value="form">Create Resume</TabsTrigger>
                            <TabsTrigger value="preview" disabled={resumeData.sections.length === 0}>
                                Preview
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="form">
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">1</span> Personal Information
                                </CardTitle>
                                <CardDescription>
                                    Start with your basic contact details
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="John Doe" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="+1 555-123-4567" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="email"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email Address</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="john.doe@example.com" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>

                        {/* Education Section */}
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">2</span> Education
                                    <Badge variant="outline" className="ml-2">
                                        {educationItems.length} {educationItems.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Add your educational background
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...educationForm}>
                                    <form onSubmit={educationForm.handleSubmit(addEducation)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={educationForm.control}
                                                name="institution"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Institution</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="University of California" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={educationForm.control}
                                                name="degree"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Degree</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={educationForm.control}
                                                name="year"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Year</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="2020-2024" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" className="mt-2" size="sm">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Education
                                        </Button>
                                    </form>
                                </Form>

                                {educationItems.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-2">Added Education</h4>
                                        <ScrollArea className="h-[200px] rounded-md border p-4">
                                            <div className="space-y-3">
                                                {educationItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-slate-50">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <GraduationCap className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium">{item.degree}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600">{item.institution} | {item.year}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Experience Section */}
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">3</span> Professional Experience
                                    <Badge variant="outline" className="ml-2">
                                        {experienceItems.length} {experienceItems.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Add your work experience
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...experienceForm}>
                                    <form onSubmit={experienceForm.handleSubmit(addExperience)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={experienceForm.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Company</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Google" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={experienceForm.control}
                                                name="position"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Position</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Software Engineer" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={experienceForm.control}
                                                name="duration"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Duration</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Jan 2020 - Present" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={experienceForm.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe your responsibilities and achievements"
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="mt-2" size="sm">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Experience
                                        </Button>
                                    </form>
                                </Form>

                                {experienceItems.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-2">Added Experience</h4>
                                        <ScrollArea className="h-[200px] rounded-md border p-4">
                                            <div className="space-y-3">
                                                {experienceItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-slate-50">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <Briefcase className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium">{item.position}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600">{item.company} | {item.duration}</p>
                                                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => removeExperience(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Projects Section */}
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">4</span> Projects
                                    <Badge variant="outline" className="ml-2">
                                        {projectItems.length} {projectItems.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Add your notable projects (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...projectForm}>
                                    <form onSubmit={projectForm.handleSubmit(addProject)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={projectForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Project Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="E-commerce Platform" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={projectForm.control}
                                                name="technologies"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Technologies Used</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="React, Node.js, MongoDB" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <FormField
                                            control={projectForm.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe the project, its purpose, and your contributions"
                                                            className="min-h-[100px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit" className="mt-2" size="sm">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Project
                                        </Button>
                                    </form>
                                </Form>

                                {projectItems.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-2">Added Projects</h4>
                                        <ScrollArea className="h-[200px] rounded-md border p-4">
                                            <div className="space-y-3">
                                                {projectItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-start p-3 rounded-lg bg-slate-50">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <FolderKanban className="h-4 w-4 text-blue-600" />
                                                                <span className="font-medium">{item.name}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600">Technologies: {item.technologies}</p>
                                                            <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Links Section */}
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">5</span> Professional Links
                                    <Badge variant="outline" className="ml-2">
                                        {linkItems.length} {linkItems.length === 1 ? 'item' : 'items'}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    Add your online profiles and portfolios
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...linkForm}>
                                    <form onSubmit={linkForm.handleSubmit(addLink)} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={linkForm.control}
                                                name="platform"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Platform</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="LinkedIn, GitHub, Portfolio" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={linkForm.control}
                                                name="url"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>URL</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="https://linkedin.com/in/username" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <Button type="submit" className="mt-2" size="sm">
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Link
                                        </Button>
                                    </form>
                                </Form>

                                {linkItems.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-medium mb-2">Added Links</h4>
                                        <ScrollArea className="h-[150px] rounded-md border p-4">
                                            <div className="space-y-3">
                                                {linkItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
                                                        <div className="flex items-center gap-2">
                                                            <Link className="h-4 w-4 text-blue-600" />
                                                            <span className="font-medium">{item.platform}</span>
                                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline truncate max-w-[250px]">
                                                                {item.url}
                                                            </a>
                                                        </div>
                                                        <Button variant="ghost" size="sm" onClick={() => removeLink(index)}>
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Final Section - Skills and Extra Curricular */}
                        <Card className="w-full shadow-md border-slate-200 bg-white mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <span className="text-blue-600 mr-2">6</span> Additional Information
                                </CardTitle>
                                <CardDescription>
                                    Add your skills and extra-curricular activities
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...form}>
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="skills"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Skills</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="List your technical and soft skills"
                                                            className="min-h-[80px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="extraCurricular"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Extra-Curricular Activities (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="List your volunteer work, certifications, awards, etc."
                                                            className="min-h-[80px]"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </Form>
                            </CardContent>
                        </Card>

                        {error && (
                            <Alert className="mt-4 mb-4" variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button
                                onClick={form.handleSubmit(handleSubmit)}
                                className="w-full md:w-auto"
                                size="lg"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating Resume...
                                    </>
                                ) : (
                                    "Generate Professional Resume"
                                )}
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="preview">

                        {resumeData.sections.length > 0 && (

                            // Resume Preview Section

                            <div className="space-y-8">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold text-slate-800 mb-3 sm:mb-0">
                                            Your Professional Resume
                                        </h2>
                                        <div className="flex space-x-2">
                                            <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-300 hover:bg-slate-100">
                                                <FileDown className="mr-2 h-4 w-4 text-blue-600" />
                                                Export PDF
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-300 hover:bg-slate-100">
                                                <Copy className="mr-2 h-4 w-4 text-blue-600" />
                                                Copy
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={handleExport} className="border-slate-300 hover:bg-slate-100">
                                                <Share2 className="mr-2 h-4 w-4 text-blue-600" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Print Controls */}
                                    <div className="hidden print:block text-right mb-4">
                                        <p className="text-sm text-slate-500">Generated with CareerKit Resume Builder</p>
                                    </div>

                                    <Card className="border border-slate-200 print:border-none print:shadow-none bg-white">
                                        <CardContent className="p-8 print:p-4">
                                            <div className="max-w-3xl mx-auto">
                                                {/* Resume Header */}
                                                <div className="mb-8 border-b-2 border-slate-300 pb-4">
                                                    <h1 className="text-4xl font-bold text-center text-slate-900 mb-3">
                                                        {form.getValues("name") || "Your Name"}
                                                    </h1>
                                                    <div className="flex flex-wrap justify-center gap-x-4 text-sm font-medium text-slate-600">
                                                        {/* Contact Info Section Rendering */}
                                                        {resumeData.sections.find(s => s.title === "Contact Information")?.content.map((item, i) => (
                                                            <React.Fragment key={i}>
                                                                {i > 0 && <span className="hidden sm:inline-block">•</span>}
                                                                <span className="inline-block">{item}</span>
                                                            </React.Fragment>
                                                        ))}

                                                        {linkItems.length > 0 && (
                                                            <>
                                                                <span className="hidden sm:inline-block">•</span>
                                                                <div className="flex flex-wrap items-center gap-x-3">
                                                                    {linkItems.map((link, i) => (
                                                                        <a
                                                                            key={i}
                                                                            href={link.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline inline-flex items-center"
                                                                        >
                                                                            {link.platform}
                                                                        </a>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Summary Section */}
                                                <div className="mb-6">
                                                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                                                        Professional Summary
                                                    </h2>
                                                    <p className="text-slate-700 leading-relaxed text-base">{resumeData.summary}</p>
                                                </div>

                                                {/* Skills Section (Render as list) */}
                                                {resumeData.sections.find(s => s.title === "Skills") && (
                                                    <div className="mb-6">
                                                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                                                            Skills
                                                        </h2>
                                                        <div className="flex flex-wrap gap-2">
                                                            {resumeData.sections.find(s => s.title === "Skills")?.content.map((skill, idx) => (
                                                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Projects Section (Special rendering for project objects) */}
                                                {resumeData.sections.find(s => s.title === "Projects") && (
                                                    <div className="mb-6">
                                                        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                                                            Projects
                                                        </h2>
                                                        <div className="space-y-4">
                                                            {resumeData.sections.find(s => s.title === "Projects")?.content.map((project, idx) => (
                                                                <div key={idx} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                                                                    <div className="flex flex-wrap justify-between items-start mb-2">
                                                                        <h3 className="font-semibold text-lg text-slate-800">{project.title}</h3>
                                                                        <div className="text-sm text-slate-600 bg-slate-200 px-2 py-1 rounded">
                                                                            {project.technologies}
                                                                        </div>
                                                                    </div>
                                                                    <p className="text-slate-700 text-sm leading-relaxed">
                                                                        {project.description}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Render any remaining sections not handled above */}
                                                {resumeData.sections
                                                    .filter(section => !["Contact Information", "Skills", "Projects"].includes(section.title))
                                                    .map((section, index) => (
                                                        <div key={index} className="mb-6">
                                                            <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2 mb-3">
                                                                {section.title}
                                                            </h2>

                                                            {Array.isArray(section.content) && typeof section.content[0] === 'string' ? (
                                                                <ul className="list-disc pl-5 space-y-2 text-slate-700">
                                                                    {section.content.map((item, idx) => (
                                                                        <li key={idx} className="leading-relaxed">{item}</li>
                                                                    ))}
                                                                </ul>
                                                            ) : Array.isArray(section.content) && typeof section.content[0] === 'object' ? (
                                                                <div className="space-y-4">
                                                                    {section.content.map((item, idx) => (
                                                                        <div key={idx} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                                                                            {Object.entries(item).map(([key, value]) => (
                                                                                <div key={key}>
                                                                                    <h3 className="font-semibold text-base text-slate-800 capitalize mb-2">
                                                                                        {key === 'title' ? value : key}
                                                                                    </h3>
                                                                                    {key !== 'title' && (
                                                                                        <p className="text-slate-700">
                                                                                            {value}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : typeof section.content === 'object' ? (
                                                                <div className="space-y-4">
                                                                    {Object.entries(section.content).map(([key, value]) => (
                                                                        <div key={key} className="bg-slate-50 p-4 rounded-md border border-slate-100">
                                                                            <h3 className="font-semibold text-base text-slate-800 capitalize mb-2">{key}</h3>
                                                                            <p className="text-slate-700">
                                                                                {Array.isArray(value) ? value.join(', ') : value}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-slate-700 leading-relaxed">{section.content}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Resume Quality Indicators */}
                                    <div className="mt-6 bg-slate-50 rounded-lg p-4 border border-slate-200 print:hidden">
                                        <h3 className="font-semibold text-slate-800 mb-2 flex items-center">
                                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                            Resume Quality Analysis
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
                                            <div className="bg-white p-3 rounded-md border border-slate-200">
                                                <div className="flex items-center mb-1">
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                                    </div>
                                                    <span className="ml-2 text-sm font-medium text-slate-700">85%</span>
                                                </div>
                                                <p className="text-xs text-slate-600">ATS Compatibility</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-slate-200">
                                                <div className="flex items-center mb-1">
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: resumeData.sections.length >= 3 ? '80%' : '60%' }}></div>
                                                    </div>
                                                    <span className="ml-2 text-sm font-medium text-slate-700">
                                                        {resumeData.sections.length >= 3 ? '80%' : '60%'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-600">Completeness</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-md border border-slate-200">
                                                <div className="flex items-center mb-1">
                                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                                                    </div>
                                                    <span className="ml-2 text-sm font-medium text-slate-700">75%</span>
                                                </div>
                                                <p className="text-xs text-slate-600">Content Quality</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Resume Tips */}
                                    <div className="mt-4 print:hidden">
                                        <details className="group">
                                            <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-800 hover:text-blue-600">
                                                <span className="text-sm flex items-center">
                                                    <svg className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Pro Resume Tips
                                                </span>
                                                <svg className="h-4 w-4 transition-all duration-300 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </summary>
                                            <div className="mt-2 text-sm text-slate-600 space-y-2">
                                                <p>• Consider adding more projects to showcase your development experience</p>
                                                <p>• Expand your skills section with specific frameworks, libraries, or tools</p>
                                                <p>• Add an Education section to highlight your academic background</p>
                                            </div>
                                        </details>
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-3 print:hidden">
                                    <Button variant="outline" onClick={() => setActiveTab("form")} className="border-slate-300">
                                        Back to Editor
                                    </Button>
                                    <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Export as PDF
                                    </Button>
                                </div>
                            </div>


                            // End of Resume Preview Section
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default ResumeWizPage;
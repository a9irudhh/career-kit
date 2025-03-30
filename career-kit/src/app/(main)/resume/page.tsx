'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ResumeWizPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        links: '',
        schooling: '',
        professionalExp: '',
        skills: '',
        projects: '',
        extraCurricular: '',
    });

    const [responseData, setResponseData] = useState<{
        summary: string;
        sections: { title: string; content: any }[];
    }>({
        summary: "",
        sections: [],
    });

    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('/api/main/resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    schooling: formData.schooling,
                    professionalExp: formData.professionalExp,
                    skills: formData.skills,
                    projects: formData.projects,
                    extraCurricular: formData.extraCurricular,
                }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            setResponseData(data.data);
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to generate the resume. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Resume Wizard</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {['name', 'phone', 'links', 'schooling', 'professionalExp', 'skills', 'projects', 'extraCurricular'].map((field) => (
                        <div key={field}>
                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
                                {field.replace(/([A-Z])/g, ' $1')}
                            </label>
                            <textarea
                                id={field}
                                name={field}
                                placeholder={`Enter your ${field}`}
                                value={formData[field as keyof typeof formData]}
                                onChange={handleChange}
                                required
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <Button type="submit" className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300">
                        Generate Resume
                    </Button>
                </form>

                {error && (
                    <Alert className="mt-8" variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {responseData.sections.length > 0 && (
                    <div className="mt-8">
                        <Card className="bg-gray-50">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-center text-gray-800">
                                    {formData.name || "Your Name"}
                                </CardTitle>
                                <p className="text-center text-gray-600">
                                    {formData.phone} | {formData.links}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-700">Summary</h2>
                                    <p className="text-gray-600">{responseData.summary}</p>
                                </div>
                                <Separator />

                                {responseData.sections.map((section, index) => (
                                    <div key={index} className="mb-6">
                                        <h3 className="text-lg font-bold text-gray-700">{section.title}</h3>
                                        {Array.isArray(section.content) ? (
                                            <ul className="list-disc list-inside text-gray-600">
                                                {section.content.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        ) : typeof section.content === 'object' ? (
                                            <div className="space-y-2">
                                                {Object.entries(section.content).map(([key, value]) => (
                                                    <p key={key} className="text-gray-600">
                                                        <span className="font-semibold capitalize">{key}:</span>{' '}
                                                        {Array.isArray(value) ? value.join(', ') : value}
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">{section.content}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeWizPage;

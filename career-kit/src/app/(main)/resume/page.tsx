'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Eye, 
  Download, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  FileText,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Resume {
  _id: string;
  personalInfo: {
    name: string;
    phone: string;
    email: string;
  };
  generatedContent: {
    summary: string;
    sections: Array<{ title: string; content: any }>;
  };
  createdAt: string;
  updatedAt: string;
}

const ResumesPage = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 6,
    pages: 0
  });
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch resumes
  const fetchResumes = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/resumes?page=${page}&limit=6`);
      const data = await response.json();

      if (response.ok) {
        setResumes(data.resumes);
        setPagination(data.pagination);
      } else {
        console.error('Failed to fetch resumes:', data.error);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete resume
  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchResumes(currentPage);
        if (selectedResume && selectedResume._id === resumeId) {
          setShowModal(false);
          setSelectedResume(null);
        }
      } else {
        alert('Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    }
  };

  // View resume
  const handleView = (resume: Resume) => {
    setSelectedResume(resume);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResume(null);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchResumes(page);
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-2">Manage your saved resumes</p>
          </div>
          <Link href="/resume/build">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Clock className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading resumes...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && resumes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No resumes found</h3>
          <p className="text-gray-500 mb-6">Create your first resume to get started</p>
          <Link href="/resume/build">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Resume
            </Button>
          </Link>
        </div>
      )}

      {/* Resumes Grid */}
      {!loading && resumes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {resumes.map((resume) => (
              <Card key={resume._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {resume.personalInfo.name}'s Resume
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {resume.personalInfo.email}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {resume.generatedContent.summary}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(resume)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* Add download logic */}}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resume._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal for viewing resume */}
      {showModal && selectedResume && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedResume.personalInfo.name}{"'s Resume"}
              </h2>
              <Button variant="outline" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Resume content display logic here */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Professional Summary</h3>
                  <p className="text-gray-700">{selectedResume.generatedContent.summary}</p>
                </div>
                {selectedResume.generatedContent.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <div className="text-gray-700">
                      {Array.isArray(section.content) ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {section.content.map((item, idx) => (
                            <li key={idx}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>{JSON.stringify(section.content)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumesPage;
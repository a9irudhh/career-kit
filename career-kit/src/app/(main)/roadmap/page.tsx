'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Calendar, 
  Briefcase, 
  Eye, 
  Download, 
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  MapPin,
  X,
  Globe,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';

interface Roadmap {
  _id: string;
  jobTitle: string;
  level: string;
  timeRange: string;
  roadmapContent: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  createdBy?: string;
  isOwner: boolean;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface CurrentUser {
  userId: string;
  username: string;
}

const Roadmaps = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'my'
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 6,
    pages: 0
  });
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Fetch roadmaps
  const fetchRoadmaps = async (page = 1, jobTitle = '', level = '', myRoadmaps = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '6'
      });
      
      if (jobTitle) params.append('jobTitle', jobTitle);
      if (level && level !== 'all') params.append('level', level);
      if (myRoadmaps) params.append('myRoadmaps', 'true');

      const response = await fetch(`/api/roadmaps?${params}`);
      const data = await response.json();

      if (response.ok) {
        setRoadmaps(data.roadmaps);
        setPagination(data.pagination);
        setCurrentUser(data.currentUser);
      } else {
        console.error('Failed to fetch roadmaps:', data.error);
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete roadmap (only for owners)
  const handleDelete = async (roadmapId: string) => {
    if (!confirm('Are you sure you want to delete this roadmap?')) return;

    try {
      const response = await fetch(`/api/roadmaps/${roadmapId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchRoadmaps(
          currentPage, 
          searchTerm, 
          levelFilter === 'all' ? '' : levelFilter,
          activeTab === 'my'
        );
        // If we're viewing the deleted roadmap in modal, close it
        if (selectedRoadmap && selectedRoadmap._id === roadmapId) {
          setShowModal(false);
          setSelectedRoadmap(null);
        }
      } else {
        alert('Failed to delete roadmap');
      }
    } catch (error) {
      console.error('Error deleting roadmap:', error);
      alert('Failed to delete roadmap');
    }
  };

  // Download roadmap as HTML
  const handleDownload = (roadmap: Roadmap) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${roadmap.jobTitle} Roadmap</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              line-height: 1.6;
              color: #333;
            }
            .header { 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 10px; 
              margin-bottom: 20px; 
            }
            .meta { 
              color: #666; 
              font-size: 14px; 
              margin-bottom: 20px; 
            }
            @media print {
              body { margin: 0; }
              .header { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${roadmap.jobTitle} Career Roadmap</h1>
            <div class="meta">
              Level: ${roadmap.level} | Timeline: ${formatTimeRange(roadmap.timeRange)} | 
              Created: ${new Date(roadmap.createdAt).toLocaleDateString()}
              ${roadmap.createdBy ? ` | By: ${roadmap.createdBy}` : ''}
            </div>
          </div>
          ${roadmap.roadmapContent}
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${roadmap.jobTitle.replace(/\s+/g, '_')}_roadmap.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // View roadmap in modal
  const handleView = (roadmap: Roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoadmap(null);
  };

  // Handle search and filter
  const handleSearch = () => {
    setCurrentPage(1);
    fetchRoadmaps(1, searchTerm, levelFilter === 'all' ? '' : levelFilter, activeTab === 'my');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchRoadmaps(page, searchTerm, levelFilter === 'all' ? '' : levelFilter, activeTab === 'my');
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
    fetchRoadmaps(1, searchTerm, levelFilter === 'all' ? '' : levelFilter, tab === 'my');
  };

  // Format time range for display
  const formatTimeRange = (timeRange: string) => {
    if (timeRange.startsWith('CUSTOM-')) {
      const months = timeRange.replace('CUSTOM-', '');
      return `${months} month${parseInt(months) !== 1 ? 's' : ''}`;
    }
    
    const timeMap: { [key: string]: string } = {
      '1-YEAR': '1 Year',
      '2-YEARS': '2 Years',
      '3-YEARS': '3 Years',
      '5-YEARS': '5 Years'
    };
    
    return timeMap[timeRange] || timeRange;
  };

  // Get level color
  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'BEGINNER': 'bg-green-100 text-green-800',
      'INTERMEDIATE': 'bg-yellow-100 text-yellow-800',
      'ADVANCED': 'bg-red-100 text-red-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal]);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Career Roadmaps</h1>
            <p className="text-gray-600 mt-2">
              {activeTab === 'all' 
                ? 'Explore career roadmaps shared by the community' 
                : 'Manage your personal career roadmaps'
              }
            </p>
          </div>
          <Link href="/roadmap/generate">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Roadmap
            </Button>
          </Link>
        </div>

        {/* Tabs for All vs My Roadmaps */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              All Roadmaps
            </TabsTrigger>
            <TabsTrigger value="my" className="flex items-center">
              <UserCheck className="h-4 w-4 mr-2" />
              My Roadmaps
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by job title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="BEGINNER">Beginner</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="ADVANCED">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="w-full md:w-auto">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Clock className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading roadmaps...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && roadmaps.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No roadmaps found</h3>
          <p className="text-gray-500 mb-6">
            {activeTab === 'my' 
              ? "You haven't created any roadmaps yet"
              : searchTerm || (levelFilter && levelFilter !== 'all')
                ? "Try adjusting your search criteria" 
                : "No roadmaps have been shared yet"
            }
          </p>
          <Link href="/roadmap/generate">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Roadmap
            </Button>
          </Link>
        </div>
      )}

      {/* Roadmaps Grid */}
      {!loading && roadmaps.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {roadmaps.map((roadmap) => (
              <Card key={roadmap._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {roadmap.jobTitle}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getLevelColor(roadmap.level)}>
                        {roadmap.level}
                      </Badge>
                      {roadmap.isOwner && (
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          Mine
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTimeRange(roadmap.timeRange)}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(roadmap.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {roadmap.createdBy && !roadmap.isOwner && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <User className="h-4 w-4 mr-1" />
                      By {roadmap.createdBy}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(roadmap)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(roadmap)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                    {roadmap.isOwner && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(roadmap._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
                  let pageNumber;
                  if (pagination.pages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= pagination.pages - 2) {
                    pageNumber = pagination.pages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
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

      {/* Modal for viewing roadmap */}
      {showModal && selectedRoadmap && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <div className="flex-1 mr-4">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {selectedRoadmap.jobTitle}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <Badge className={getLevelColor(selectedRoadmap.level)}>
                    {selectedRoadmap.level}
                  </Badge>
                  <span>{formatTimeRange(selectedRoadmap.timeRange)}</span>
                  <span>{new Date(selectedRoadmap.createdAt).toLocaleDateString()}</span>
                  {selectedRoadmap.createdBy && (
                    <span>By {selectedRoadmap.createdBy}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownload(selectedRoadmap)}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleCloseModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div 
              className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]"
              dangerouslySetInnerHTML={{ __html: selectedRoadmap.roadmapContent }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmaps;
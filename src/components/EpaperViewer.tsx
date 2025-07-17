import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'react-pdf/build/pdf.worker.min.js?url';
import { ChevronLeft, ChevronRight, Download, Scissors, Archive, Home, Info, Phone, Shield } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const EpaperViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    loadTodaysPDF();
  }, []);

  const loadTodaysPDF = async () => {
    setIsLoading(true);
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    const filename = `${day}-${month}-${year}.pdf`;
    
    try {
      const response = await fetch(`/${filename}`, { method: 'HEAD' });
      if (response.ok) {
        setPdfUrl(`/${filename}`);
      } else {
        // Try the existing PDF in public folder
        setPdfUrl('/17-07-2025_11zon.pdf');
      }
    } catch {
      setPdfUrl('/17-07-2025_11zon.pdf');
    }
    setIsLoading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    setError(`Failed to load PDF: ${error.message}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Flash India News...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/aksharakalam.png" 
                alt="Flash India News" 
                className="h-12 md:h-16 w-auto"
              />
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Home className="w-4 h-4 mr-1" />
                Home
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Info className="w-4 h-4 mr-1" />
                About Us
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                Contact Us
              </a>
              <a href="#" className="flex items-center text-gray-700 hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4 mr-1" />
                Privacy Policy
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Page Thumbnails */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="font-bold text-gray-800 mb-4">Pages</h3>
              <div className="space-y-4">
                {[...Array(totalPages)].map((_, i) => (
                  <div 
                    key={i + 1} 
                    className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                      currentPage === i + 1 ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    <div className="bg-gray-50 p-2">
                      <Document
                        file={pdfUrl}
                        loading={<div className="h-32 bg-gray-200 animate-pulse"></div>}
                      >
                        <Page
                          pageNumber={i + 1}
                          width={200}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                    </div>
                    <div className="p-2 text-center">
                      <span className="text-sm font-medium">Page {i + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main PDF Viewer */}
          <div className="flex-1">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Page Navigation */}
                <div className="flex items-center space-x-4">
                  <select 
                    className="border border-gray-300 rounded px-3 py-2 bg-white"
                    value={currentPage}
                    onChange={(e) => handlePageChange(parseInt(e.target.value))}
                  >
                    {[...Array(totalPages)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Page {i + 1}
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded ${
                          currentPage === page
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        disabled={page > totalPages}
                      >
                        {page}
                      </button>
                    ))}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <button
                          onClick={() => handlePageChange(totalPages)}
                          className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded"
                        >
                          »
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors flex items-center">
                    PDF
                  </button>
                  <button className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors flex items-center">
                    <Scissors className="w-4 h-4 mr-1" />
                    Clip
                  </button>
                  <button className="bg-gray-800 text-white px-4 py-2 rounded font-semibold hover:bg-gray-700 transition-colors flex items-center">
                    <Archive className="w-4 h-4 mr-1" />
                    Archive
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Display */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* PDF Header */}
              <div className="bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold text-center">Flash India News</h2>
                <p className="text-center text-sm opacity-90">Date: {formatDate()}</p>
              </div>

              {/* PDF Content */}
              <div className="flex justify-center bg-gray-200 min-h-screen p-4">
                {error ? (
                  <div className="text-center py-12">
                    <p className="text-red-600 mb-4">{error}</p>
                    <p className="text-gray-600">Please check if the PDF file exists</p>
                  </div>
                ) : (
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                          <p className="text-gray-600">Loading PDF...</p>
                        </div>
                      </div>
                    }
                  >
                    <div className="shadow-lg">
                      <Page
                        pageNumber={currentPage}
                        scale={scale}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                      />
                    </div>
                  </Document>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-8">
        <div className="container mx-auto px-4">
          {/* Social Media Icons */}
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-blue-500 hover:text-blue-400 transition-colors">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">f</div>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">X</div>
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">
              <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">📷</div>
            </a>
            <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">💬</div>
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center space-y-1">
            <p className="text-sm">
              Copyright (c) flashindianews All Rights Reserved
            </p>
            <p className="text-sm">
              Developed By SSIT 8143363500
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Navigation - Fixed at bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <select 
            className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value))}
          >
            {[...Array(totalPages)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Page {i + 1}
              </option>
            ))}
          </select>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-1">
            <button className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-semibold">
              PDF
            </button>
            <button className="bg-yellow-400 text-black px-3 py-2 rounded text-sm font-semibold">
              ✂
            </button>
            <button className="bg-gray-800 text-white px-3 py-2 rounded text-sm">
              📁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpaperViewer;
import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronRight, Scissors, Archive, Home, Info, Phone, Shield, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react';

// Set up PDF.js worker with local import
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const EpaperViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState(800);

  useEffect(() => {
    loadTodaysPDF();
    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);
    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const updatePageWidth = () => {
    const container = document.querySelector('.pdf-main-container');
    if (container) {
      const containerWidth = container.clientWidth;
      setPageWidth(Math.min(containerWidth - 40, 800));
    }
  };

  const loadTodaysPDF = async () => {
    setIsLoading(true);
    setError(null);
    
    // Generate today's filename in DD-MM-YY format
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear().toString().slice(-2);
    const todayFilename = `${day}-${month}-${year}.pdf`;
    
    // Try to load today's PDF first
    try {
      const response = await fetch(`/${todayFilename}`, { method: 'HEAD' });
      if (response.ok) {
        setPdfUrl(`/${todayFilename}`);
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.log(`Today's PDF (${todayFilename}) not found, trying fallback...`);
    }

    // Try existing PDFs as fallback
    const fallbackPDFs = [
      '/17-07-2025_11zon.pdf',
      '/demo-epaper.pdf'
    ];

    for (const pdfPath of fallbackPDFs) {
      try {
        const response = await fetch(pdfPath, { method: 'HEAD' });
        if (response.ok) {
          setPdfUrl(pdfPath);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.log(`Fallback PDF ${pdfPath} not found`);
      }
    }

    // If no PDF found, set error
    setError(`Today's e-paper (${todayFilename}) is not yet available. Please check back later.`);
    setIsLoading(false);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setError(null);
    setCurrentPage(1);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF load error:', error);
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

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    for (let i = 1; i <= Math.min(maxVisiblePages, totalPages); i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            currentPage === i
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    if (totalPages > maxVisiblePages) {
      pages.push(
        <span key="ellipsis" className="px-2 text-gray-500">...</span>
      );
      pages.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-sm font-medium"
        >
          »
        </button>
      );
    }

    return pages;
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
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              <div className="ml-4 text-blue-600 font-bold text-xl telugu-text">
                ఫ్లాష్ ఇండియా
              </div>
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
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h3 className="font-bold text-gray-800 mb-4">Pages</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {error ? (
                  <div className="text-center text-red-600 text-sm">
                    Unable to load pages
                  </div>
                ) : (
                  [...Array(totalPages)].map((_, i) => (
                    <div 
                      key={i + 1} 
                      className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:shadow-md ${
                        currentPage === i + 1 ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      <div className="bg-gray-50 p-2">
                        {pdfUrl && (
                          <Document
                            file={pdfUrl}
                            loading={<div className="h-24 bg-gray-200 animate-pulse rounded"></div>}
                            error={<div className="h-24 bg-red-100 flex items-center justify-center text-red-600 text-xs">Error</div>}
                          >
                            <Page
                              pageNumber={i + 1}
                              width={180}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        )}
                      </div>
                      <div className="p-2 text-center bg-white">
                        <span className="text-sm font-medium">Page {i + 1}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Main PDF Viewer */}
          <div className="flex-1 pdf-main-container">
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md mb-4 p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Page Navigation */}
                <div className="flex items-center space-x-4">
                  <select 
                    className="border border-gray-300 rounded px-3 py-2 bg-white text-sm"
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
                    {renderPageNumbers()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <button 
                    className="bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-500 transition-colors"
                    onClick={() => window.open(pdfUrl, '_blank')}
                  >
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
              <div className="flex justify-center bg-gray-50 min-h-screen p-4">
                {error ? (
                  <div className="text-center py-12">
                    <div className="text-red-600 mb-4 text-lg">{error}</div>
                    <p className="text-gray-600">Please check back later for today's e-paper</p>
                    <button 
                      onClick={loadTodaysPDF}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : pdfUrl ? (
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
                    <div className="shadow-lg bg-white">
                      <Page
                        pageNumber={currentPage}
                        width={pageWidth}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        className="max-w-full"
                      />
                    </div>
                  </Document>
                ) : null}
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
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </div>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                <Twitter className="w-4 h-4" />
              </div>
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-400 transition-colors">
              <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </div>
            </a>
            <a href="#" className="text-green-500 hover:text-green-400 transition-colors">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <MessageCircle className="w-4 h-4" />
              </div>
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
import React, { useState, useEffect } from 'react';
import { Calendar, Archive, Home, Newspaper } from 'lucide-react';
import PDFViewer from './PDFViewer';
import ArchiveViewer from './ArchiveViewer';
import { getTodayFilename, getPDFUrl, formatDateForDisplay, checkPDFExists } from '../utils/dateUtils';

type ViewMode = 'today' | 'archive';

const EpaperMain = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [currentPDF, setCurrentPDF] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodaysPaper();
  }, []);

  const loadTodaysPaper = async () => {
    setIsLoading(true);
    setError(null);
    
    const todayFilename = getTodayFilename();
    const pdfExists = await checkPDFExists(todayFilename);
    
    if (pdfExists) {
      setCurrentPDF(getPDFUrl(todayFilename));
      setCurrentDate(todayFilename.replace('.pdf', ''));
    } else {
      // Fallback to a demo PDF or show error
      setCurrentPDF('/demo-epaper.pdf');
      setCurrentDate(todayFilename.replace('.pdf', ''));
      setError(`Today's e-paper (${todayFilename}) is not yet available. Showing demo.`);
    }
    
    setIsLoading(false);
  };

  const handleSelectArchivePDF = (filename: string, date: string) => {
    setCurrentPDF(getPDFUrl(filename));
    setCurrentDate(date);
    setViewMode('today');
  };

  const handleBackToToday = () => {
    loadTodaysPaper();
    setViewMode('today');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Flash India News...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/aksharakalam.png" 
                alt="Flash India News" 
                className="h-12 md:h-16 w-auto mr-4"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Flash India News</h1>
                <p className="text-sm text-gray-600">Digital E-paper</p>
              </div>
            </div>
            
            <nav className="flex items-center space-x-4">
              <button
                onClick={handleBackToToday}
                className={`flex items-center px-4 py-2 rounded transition-colors ${
                  viewMode === 'today' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <Newspaper className="w-4 h-4 mr-2" />
                Today's Paper
              </button>
              
              <button
                onClick={() => setViewMode('archive')}
                className={`flex items-center px-4 py-2 rounded transition-colors ${
                  viewMode === 'archive' 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-700 hover:text-red-600'
                }`}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>{error}</p>
        </div>
      )}

      {/* Main Content */}
      <main>
        {viewMode === 'today' ? (
          <PDFViewer 
            pdfUrl={currentPDF} 
            date={formatDateForDisplay(currentDate)}
          />
        ) : (
          <ArchiveViewer onSelectPDF={handleSelectArchivePDF} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p className="text-sm">
          © 2025 Flash India News. All rights reserved. | 
          <span className="ml-2">Digital E-paper System</span>
        </p>
      </footer>
    </div>
  );
};

export default EpaperMain;
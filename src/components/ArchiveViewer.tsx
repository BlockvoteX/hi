import React, { useState, useEffect } from 'react';
import { Calendar, Search, Download, Eye } from 'lucide-react';

interface ArchiveItem {
  date: string;
  filename: string;
  displayDate: string;
  pages: number;
}

interface ArchiveViewerProps {
  onSelectPDF: (filename: string, date: string) => void;
}

const ArchiveViewer: React.FC<ArchiveViewerProps> = ({ onSelectPDF }) => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [filteredArchives, setFilteredArchives] = useState<ArchiveItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    // Generate sample archive data
    const generateArchives = () => {
      const archiveList: ArchiveItem[] = [];
      const currentDate = new Date();
      
      // Generate last 30 days of archives
      for (let i = 0; i < 30; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        
        const filename = `${day}-${month}-${year}.pdf`;
        const displayDate = date.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        archiveList.push({
          date: `${day}-${month}-${year}`,
          filename,
          displayDate,
          pages: 8
        });
      }
      
      return archiveList;
    };

    const archiveData = generateArchives();
    setArchives(archiveData);
    setFilteredArchives(archiveData);
  }, []);

  useEffect(() => {
    let filtered = archives;

    if (searchTerm) {
      filtered = filtered.filter(archive =>
        archive.displayDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        archive.date.includes(searchTerm)
      );
    }

    if (selectedMonth) {
      filtered = filtered.filter(archive => {
        const archiveMonth = archive.date.split('-')[1];
        return archiveMonth === selectedMonth;
      });
    }

    if (selectedYear) {
      filtered = filtered.filter(archive => {
        const archiveYear = archive.date.split('-')[2];
        return archiveYear === selectedYear;
      });
    }

    setFilteredArchives(filtered);
  }, [searchTerm, selectedMonth, selectedYear, archives]);

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  const years = ['25', '24', '23', '22', '21'];

  return (
    <div className="bg-white">
      <div className="bg-gray-800 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            E-paper Archive
          </h2>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search by date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 rounded text-gray-900 focus:outline-none"
            />
          </div>
          
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-2 rounded text-gray-900 focus:outline-none"
            >
              <option value="">All Months</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3 py-2 rounded text-gray-900 focus:outline-none"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>
                  20{year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedMonth('');
                setSelectedYear('');
              }}
              className="w-full px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Archive List */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArchives.map((archive) => (
            <div key={archive.date} className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{archive.displayDate}</h3>
                  <span className="text-sm text-gray-500">{archive.pages} pages</span>
                </div>
                
                <div className="mb-4">
                  <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm">PDF Preview</p>
                      <p className="text-xs">{archive.filename}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSelectPDF(archive.filename, archive.date)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  
                  <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredArchives.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No e-papers found for the selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchiveViewer;
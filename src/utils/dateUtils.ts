export const formatDateForFilename = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}-${month}-${year}`;
};

export const formatDateForDisplay = (dateString: string): string => {
  const [day, month, year] = dateString.split('-');
  const fullYear = `20${year}`;
  const date = new Date(parseInt(fullYear), parseInt(month) - 1, parseInt(day));
  
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getTodayFilename = (): string => {
  return formatDateForFilename(new Date());
};

export const checkPDFExists = async (filename: string): Promise<boolean> => {
  try {
    const response = await fetch(`/public/${filename}`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

export const getPDFUrl = (filename: string): string => {
  return `/public/${filename}`;
};
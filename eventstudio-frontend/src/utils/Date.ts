import moment from 'moment-timezone';
export const formatIsoDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 || 12; // Convert 24h to 12h format
  const formattedMinutes = minutes.toString().padStart(2, '0'); // Ensure two digits

  return `${month} ${day}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const normalizeDate = (dateString: string): string => {
  // Check if the date is already in the correct format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // Handle MM/DD/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts.map(Number);
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      // Convert to YYYY-MM-DD format
      return new Date(year, month - 1, day).toISOString().split('T')[0];
    }
  }

  // Return an empty string or a fallback value if the format is unrecognized
  console.warn('Invalid date format:', dateString);
  return '';
};

// Generate timezone list with UTC offsets
export const timezones = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).utcOffset(); // Get offset in minutes
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  const formattedOffset = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

  return {
    label: `(${formattedOffset}) ${tz.replace('_', ' ')}`,
    value: formattedOffset
  };
});

export const getTimezoneLabel = (value: string): string | undefined => {
  const timezone = timezones.find((tz) => tz.value === value);
  return timezone ? timezone.label : undefined;
};

//get time from datetime
export const getTimeFromDate = (date: string): string => {
  return new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

//get date from datetime
export const getDateFromDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GB');
};

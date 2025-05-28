// filepath: c:\Users\alex3\OneDrive\Escritorio\Universidad\Barber software\barber-front\src\utils\dateHelpers.js
export const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
};

export const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

export const getDaysBetweenDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end - start;
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};
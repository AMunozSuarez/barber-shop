export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6; // Minimum length of 6 characters
};

export const validateRequired = (value) => {
  return value.trim() !== '';
};

export const validateAppointmentForm = (formData) => {
  const { email, password, barberId, date, time } = formData;
  const errors = {};

  if (!validateRequired(email) || !validateEmail(email)) {
    errors.email = 'Invalid email address';
  }

  if (!validateRequired(password) || !validatePassword(password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!validateRequired(barberId)) {
    errors.barberId = 'Barber selection is required';
  }

  if (!validateRequired(date)) {
    errors.date = 'Date is required';
  }

  if (!validateRequired(time)) {
    errors.time = 'Time is required';
  }

  return errors;
};
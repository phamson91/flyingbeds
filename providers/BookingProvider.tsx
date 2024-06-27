'use client';

import { BookingContextProvider } from '@/hooks/useBooking';

interface BookingProviderProps {
  children: React.ReactNode;
}

const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  return <BookingContextProvider>{children}</BookingContextProvider>;
};

export default BookingProvider;

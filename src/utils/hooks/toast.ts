import { useCallback, useMemo, useState } from 'react';
import { toast, ToastPosition } from 'react-toastify';
import { AxiosError } from 'axios';
import AppError from '../../error/AppError';
import { BadInternetConnection } from '../../error/BadInternetConnection';

interface UseErrorToastResult {
  handleError: (error: unknown) => void;
  error: string | null;
  clearError: () => void;
}
const toastErrorConfiguration = {
  position: "top-center" as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
}

const useErrorToast = (): UseErrorToastResult => {
  const [error, setError] = useState<string | null>(null);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof AppError) {
      toast.error(`${error.errorType}: ${error.message}`, toastErrorConfiguration);
      setError(`${error.errorType}: ${error.message}`);
    } else if (error instanceof AxiosError) {
      if (error.status?.toString()?.startsWith('4') || error.status?.toString()?.startsWith('5')) {
        toast.error(error.message, toastErrorConfiguration);
        setError(error.message);
      } else if (error.request) {
        toast.error('No response from server. Please try again later.', toastErrorConfiguration);
        setError('No response from server. Please try again later.');
      } else {
        setError(error.message || 'Request setup error');
      }
    } else if(error instanceof BadInternetConnection){
      toast.error(error.message)
      setError(error.message)
    } else if (error instanceof Error) {
      toast.error('An unexpected error occurred. Check your internet connection!', toastErrorConfiguration);
      setError('An unexpected error occurred. Check your internet connection!');
    } else {
      toast.error('An unknown error occurred.', toastErrorConfiguration);
      setError('An unknown error occurred.');
    }
  }, [])

  const clearError = useCallback(() => {
    setError(null);
  }, [])

  const value = useMemo(() => {return {handleError, error, clearError} }, [clearError, error, handleError])

  return value;
};

export default useErrorToast;

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const extractErrorDetail = (error) => {
  const resData = error?.response?.data;
  if (resData?.detail) {
    const detail = resData.detail;
    // console.log(detail);
    if (typeof detail === 'string') return [detail];
    if (Array.isArray(detail)) {
      return detail.map((err) =>
        err.loc ? `Error in ${err.loc[1]}: ${err.msg}` : err.msg || 'Unknown error'
      );
    }

    return [JSON.stringify(detail)];
  }

  if (error?.message) return [error.message];
  return ['An unexpected error occurred.'];
};

const onErrorHandler = (error) => {
  const messages = extractErrorDetail(error);
  // console.log(messages);
  messages.forEach((msg) => toast.error(msg));
};

export const handleSuccessToast = (res, fallbackMessage = 'Success') => {
  if (res?.detail && typeof res.detail === 'string') {
    toast.success(res.detail);
  } else if (Array.isArray(res?.detail)) {
    res.detail.forEach((msg) => {
      toast.success(typeof msg === 'string' ? msg : JSON.stringify(msg));
    });
  } else if (res?.details && typeof res.details === 'string') {
    toast.success(res.details);
  } else if (res?.message) {
    toast.success(res.message);
  } else {
    toast.success(fallbackMessage);
  }
};

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: onErrorHandler,
  }),
  mutationCache: new MutationCache({
    onError: onErrorHandler,
  }),
});

export default queryClient;

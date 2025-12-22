import { QueryClient } from '@tanstack/react-query'

import { QUERY } from '../constants/values'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: QUERY.REFETCH_ON_WINDOW_FOCUS,
      retry: QUERY.RETRY,
      staleTime: QUERY.STALE_TIME_MS,
    },
  },
})

export default queryClient

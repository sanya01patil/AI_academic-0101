import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { router } from './router';
import { ToastProvider } from './components/ToastProvider';

import { useSocket } from './hooks/useSocket';

const SocketWrapper = () => {
  useSocket();
  // @ts-ignore
  return <RouterProvider router={router} /> as any;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SocketWrapper />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;

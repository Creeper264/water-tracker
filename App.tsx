import React from 'react';
import App from './src';
import ErrorBoundary from './src/components/ErrorBoundary';

export default function RootApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Api from './@containers/TodoList/Api/Api';
import ErrorApi from './@containers/TodoList/Api/ErrorApi';
import TodoList from './@containers/TodoList/TodoList';

import './App.css';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <p className='text-3xl font-bold text-blue-500'>
          Edit and save to reload.
        </p>
        <p className='text-3xl font-bold text-blue-100 bg-white text-green-900 hover:text-red-900 hover:-translate-y-[500px] duration-[3000ms] py-10'>
          Edit and save to reload.
        </p>
      </header>
      <TodoList />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Api />
        <ErrorBoundary fallback={<div>error...</div>}>
          <ErrorApi />
        </ErrorBoundary>
      </React.Suspense>
    </div>
  );
}

export default App;

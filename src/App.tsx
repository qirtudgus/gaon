import React, { Ref, useImperativeHandle, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Api from './@containers/TodoList/Api/Api';
import TodoList from './@containers/TodoList/TodoList';
import { forwardRef } from 'react';
import './App.css';
import Query from './@containers/TodoList/query/Query';

function App() {
  const ref = useRef<ChildMethods>(null);

  return (
    <div className='App'>
      <header className=' w-full h-[50px] bg-red-500'></header>
      <MyInput ref={ref} />
      <button
        onClick={() => {
          if (ref.current !== null) {
            ref.current.usingFocus();
          }
        }}
      >
        usingFocus 버튼
      </button>
      <button
        onClick={() => {
          if (ref.current !== null) {
            ref.current.valueCheck();
          }
        }}
      >
        valueCheck 버튼
      </button>
      {/* <header className='App-header'>
        <p className='text-3xl font-bold text-blue-500'>
          Edit and save to reload.
        </p>
        <p className='text-3xl font-bold text-blue-100 bg-white text-green-900 hover:text-red-900 hover:-translate-y-[500px] duration-[3000ms] py-10'>
          Edit and save to reload.
        </p>
      </header> */}

      <TodoList />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Api />
        <ErrorBoundary fallback={<div>error...</div>}>
          {/* <ErrorApi /> */}
        </ErrorBoundary>
        <Query />
      </React.Suspense>
      <footer className='w-full h-[57px]  bg-red-400'></footer>
    </div>
  );
}

interface ChildMethods {
  usingFocus: () => void;
  valueCheck: () => void;
}

interface ChildProps {
  // ...
}

const MyInput = forwardRef<ChildMethods, ChildProps>(function MyInput(
  props,
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(
    ref,
    () => {
      return {
        //커스텀메서드 작성
        usingFocus() {
          inputRef.current?.focus();
        },
        valueCheck() {
          if (inputRef.current !== null) {
            alert(inputRef.current.value);
          }
        },
      };
    },
    [],
  );

  return <input {...props} ref={inputRef} />;
});

export default App;

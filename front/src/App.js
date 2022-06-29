import React from 'react';
import './reset.css';
import './App.css';
//import { useCallback, useEffect, useRef, useState } from 'react';
//import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main></Main>}>
          <Route path="today" element={<div>일</div>}></Route>
          <Route path="week" element={<div>주</div>}></Route>
          <Route path="month" element={<div>월</div>}></Route>
          <Route path="year" element={<div>년</div>}></Route>
          <Route path="plan" element={<div>일정</div>}></Route>
          <Route path="customday" element={<div>4일</div>}></Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;

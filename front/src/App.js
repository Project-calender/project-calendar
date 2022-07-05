import React from 'react';
import './reset.css';
import './App.css';
//import { useCallback, useEffect, useRef, useState } from 'react';
//import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import YearCalendarPage from './pages/YearCalendarPage';
import MonthCalendarPage from './pages/MonthCalendarPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main></Main>}>
          <Route path="day" element={<div>일</div>}></Route>
          <Route path="week" element={<div>주</div>}></Route>
          <Route path="month" element={<MonthCalendarPage />}></Route>
          <Route path="year" element={<YearCalendarPage />}></Route>
          <Route path="plan" element={<div>일정</div>}></Route>
          <Route path="customday" element={<div>4일</div>}></Route>
        </Route>
        <Route path="/login" element={<Login></Login>}></Route>
        <Route path="/join" element={<Join></Join>}></Route>
      </Routes>
    </div>
  );
}

export default App;

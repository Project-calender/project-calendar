import React from 'react';
import './reset.css';
import './App.css';
import { Route, Routes } from 'react-router-dom';

import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import YearCalendarPage from './pages/YearCalendarPage';
import MonthCalendarPage from './pages/MonthCalendarPage';
import { CALENDAR_URL, USER_URL } from './constants/path';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={CALENDAR_URL.MAIN} element={<Main />}>
          <Route path={CALENDAR_URL.DAY} element={<div>일</div>}></Route>
          <Route path={CALENDAR_URL.WEEK} element={<div>주</div>}></Route>
          <Route
            path={CALENDAR_URL.MONTH}
            element={<MonthCalendarPage />}
          ></Route>
          <Route
            path={CALENDAR_URL.YEAR}
            element={<YearCalendarPage />}
          ></Route>
          <Route path={CALENDAR_URL.AGENDA} element={<div>일정</div>}></Route>
          <Route path={CALENDAR_URL.CUSTOMDAY} element={<div>4일</div>}></Route>
        </Route>
        <Route path={USER_URL.LOGIN} element={<Login />}></Route>
        <Route path={USER_URL.JOIN} element={<Join />}></Route>
      </Routes>
    </div>
  );
}

export default App;

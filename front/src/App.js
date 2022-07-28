import React from 'react';
import './reset.css';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';

import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import YearCalendarPage from './pages/YearCalendarPage';
import MonthCalendarPage from './pages/MonthCalendarPage';
import DayCalendarPage from './pages/DayCalendarPage';
import AlertPage from './pages/AlertPage';
import { CALENDAR_PATH, USER_PATH } from './constants/path';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={CALENDAR_PATH.MAIN} element={<Main />}>
          <Route index element={<Navigate to={CALENDAR_PATH.MONTH} />}></Route>
          <Route path={CALENDAR_PATH.DAY} element={<DayCalendarPage />}></Route>
          <Route path={CALENDAR_PATH.WEEK} element={<div>주</div>}></Route>
          <Route
            path={CALENDAR_PATH.MONTH}
            element={<MonthCalendarPage />}
          ></Route>
          <Route
            path={CALENDAR_PATH.YEAR}
            element={<YearCalendarPage />}
          ></Route>
          <Route path={CALENDAR_PATH.AGENDA} element={<div>일정</div>}></Route>
          <Route
            path={CALENDAR_PATH.CUSTOMDAY}
            element={<div>4일</div>}
          ></Route>
          <Route path={CALENDAR_PATH.ALERT} element={<AlertPage />}></Route>
        </Route>
        <Route path={USER_PATH.LOGIN} element={<Login />}></Route>
        <Route path={USER_PATH.JOIN} element={<Join />}></Route>
        <Route path="*" element={<Navigate to={CALENDAR_PATH.MONTH} />} />
      </Routes>
    </div>
  );
}

export default App;

import React from 'react';
import './reset.css';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';

import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import Setting from './pages/Setting';
import YearCalendarPage from './pages/YearCalendarPage';
import MonthCalendarPage from './pages/MonthCalendarPage';
import DayCalendarPage from './pages/DayCalendarPage';
import WeekCalendarPage from './pages/WeekCalendarPage';
import FourDaysCalendarPage from './pages/FourDaysCalendarPage';
import AlertPage from './pages/AlertPage';
import AllEvent from './pages/AllEvent';
import Search from './components/searchDetall';
import EditEventPage from './pages/EditEventPage';
import ChangeMemberInfo from './pages/ChangeMemberInfo';
import LoginSuccess from './pages/LoginSuccess';

import { CALENDAR_PATH, EVENT_PATH, USER_PATH } from './constants/path';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={CALENDAR_PATH.MAIN} element={<Main />}>
          <Route index element={<Navigate to={CALENDAR_PATH.MONTH} />}></Route>
          <Route path={CALENDAR_PATH.DAY} element={<DayCalendarPage />}></Route>
          <Route
            path={CALENDAR_PATH.WEEK}
            element={<WeekCalendarPage />}
          ></Route>
          <Route
            path={CALENDAR_PATH.MONTH}
            element={<MonthCalendarPage />}
          ></Route>
          <Route
            path={CALENDAR_PATH.YEAR}
            element={<YearCalendarPage />}
          ></Route>
          <Route path={CALENDAR_PATH.AGENDA} element={<AllEvent />}></Route>
          <Route
            path={CALENDAR_PATH.CUSTOMDAY}
            element={<FourDaysCalendarPage />}
          ></Route>
          <Route path={CALENDAR_PATH.SEARCH} element={<Search />}></Route>
          <Route path={CALENDAR_PATH.ALERT} element={<AlertPage />}></Route>
        </Route>
        <Route path={USER_PATH.LOGIN} element={<Login />}></Route>
        <Route path={USER_PATH.LOGINSUCCESS} element={<LoginSuccess />}></Route>
        <Route path={USER_PATH.JOIN} element={<Join />}></Route>
        <Route path="*" element={<Navigate to={CALENDAR_PATH.MONTH} />} />
        <Route path={USER_PATH.SETTING} element={<Setting />}></Route>
        <Route path={EVENT_PATH.EDIT_EVENT} element={<EditEventPage />}></Route>
        <Route
          path={USER_PATH.CHANGE_INFO}
          element={<ChangeMemberInfo />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;

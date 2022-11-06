import React from 'react';
import './reset.css';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';

import Main from './pages/Main';
import Login from './pages/Login';
import Join from './pages/Join';
import CalendarSetupPage from './pages/CalendarSetupPage';
import YearCalendarPage from './pages/YearCalendarPage';
import MonthCalendarPage from './pages/MonthCalendarPage';
import DayCalendarPage from './pages/DayCalendarPage';
import WeekCalendarPage from './pages/WeekCalendarPage';
import FourDaysCalendarPage from './pages/FourDaysCalendarPage';
import AlertPage from './pages/AlertPage';
import AgendaCalendarPage from './pages/AgendaCalendarPage';
import SearchEventPage from './components/SearchEventPage';
import EditEventPage from './pages/EditEventPage';
import ChangeMemberInfo from './pages/ChangeMemberInfo';
import LoginSuccess from './pages/LoginSuccess';

import { CALENDAR_PATH, EVENT_PATH, USER_PATH } from './constants/path';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={CALENDAR_PATH.MAIN} element={<Main />}>
          <Route index element={<Navigate to={CALENDAR_PATH.MONTH} />} />
          <Route path={CALENDAR_PATH.DAY} element={<DayCalendarPage />} />
          <Route path={CALENDAR_PATH.WEEK} element={<WeekCalendarPage />} />
          <Route path={CALENDAR_PATH.MONTH} element={<MonthCalendarPage />} />
          <Route path={CALENDAR_PATH.YEAR} element={<YearCalendarPage />} />
          <Route path={CALENDAR_PATH.AGENDA} element={<AgendaCalendarPage />} />
          <Route
            path={CALENDAR_PATH.CUSTOMDAY}
            element={<FourDaysCalendarPage />}
          />
          <Route path={CALENDAR_PATH.SEARCH} element={<SearchEventPage />} />
          <Route path={CALENDAR_PATH.ALERT} element={<AlertPage />} />
        </Route>
        <Route path={CALENDAR_PATH.SETUP} element={<CalendarSetupPage />} />
        <Route path={EVENT_PATH.EDIT_EVENT} element={<EditEventPage />} />
        <Route path={USER_PATH.LOGIN} element={<Login />} />
        <Route path={USER_PATH.LOGINSUCCESS} element={<LoginSuccess />} />
        <Route path={USER_PATH.JOIN} element={<Join />} />
        <Route path={USER_PATH.CHANGE_INFO} element={<ChangeMemberInfo />} />
        <Route path="*" element={<Navigate to={CALENDAR_PATH.MONTH} />} />
      </Routes>
    </div>
  );
}

export default App;

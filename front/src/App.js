import React from 'react';
import './reset.css';
import './App.css';
//import { useCallback, useEffect, useRef, useState } from 'react';
//import { useSelector } from 'react-redux';
//import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
//import axios from 'axios';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; //폰트어썸
import {} from '@fortawesome/free-solid-svg-icons'; //폰트어썸
import Calendar from './components/Calendar';

/* 설치됨 redux,axios,fortawesome,router */

function App() {
  return (
    <div className="App">
      <Calendar></Calendar>
    </div>
  );
}

export default App;

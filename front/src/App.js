import './reset.css';
import './App.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; //폰트어썸
import { } from "@fortawesome/free-solid-svg-icons"; //폰트어썸

/* 설치됨 redux,axios,fortawesome,router */

function App() {
  let navigate = useNavigate();
  let reduxState = useSelector((state) => {return state}); //redux state 가지고 오는 변수

  return (
    <div className="App">
      <Routes>
      </Routes>
    </div>
  );
}

export default App;

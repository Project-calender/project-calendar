import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styles from './style.module.css';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import SideNav from '../../components/SideNav';
import { USER_PATH } from '../../constants/path';
import { useDispatch } from 'react-redux';
import { resetUser } from '../../store/user';
import useSocket from '../../hooks/useSocket';

const Index = () => {
  const socket = useSocket();
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (socket && userInfo) {
      socket.emit('login', { id: userInfo.id });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('alertTest', data => {
        alert(data.alert);
      });
    }
  }, []);

  let [isSideBarOn, toggleSideBar] = useState(true);
  let [MenuActive, setMenuActive] = useState(1);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetUser());
  }, [dispatch]);

  const accessToken = sessionStorage.getItem('accessToken');
  if (!accessToken) {
    sessionStorage.clear();
    localStorage.clear();
    return <Navigate to={USER_PATH.LOGIN} />;
  }

  return (
    <div>
      <section className={styles.section}>
        <NavBar
          toggleSideBar={toggleSideBar}
          MenuActive={MenuActive}
          setMenuActive={setMenuActive}
        ></NavBar>
        <article className={styles.article}>
          <SideBar isSideBarOn={isSideBarOn} />
          <Outlet></Outlet>
          <SideNav></SideNav>
        </article>
      </section>
    </div>
  );
};

export default Index;

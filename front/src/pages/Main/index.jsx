import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import styles from './style.module.css';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import SideNav from '../../components/SideNav';
import { USER_PATH } from '../../constants/path';

const Index = () => {
  let [isSideBarOn, toggleSideBar] = useState(true);

  const user = localStorage.getItem('userInfo');
  if (!user) {
    sessionStorage.clear();
    localStorage.clear();
    return <Navigate to={USER_PATH.LOGIN} />;
  }

  return (
    <div>
      <section className={styles.section}>
        <NavBar toggleSideBar={toggleSideBar}></NavBar>
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

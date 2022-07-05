import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './style.module.css';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import SideNav from '../../components/SideNav';

const Index = () => {
  /* SideBar */
  let [sideBar, setSideBar] = useState(false); //sideBar 숨김 컨트롤

  return (
    <div>
      <section className={styles.section}>
        <NavBar sideBar={sideBar} setSideBar={setSideBar}></NavBar>
        <article className={styles.article}>
          <SideBar sideBar={sideBar} />
          <Outlet></Outlet>
          <SideNav></SideNav>
        </article>
      </section>
    </div>
  );
};

export default Index;

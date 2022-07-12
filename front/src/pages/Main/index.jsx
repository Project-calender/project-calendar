import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styles from './style.module.css';
import NavBar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import SideNav from '../../components/SideNav';
import { useDispatch } from 'react-redux';
import { fetchEvents } from '../../store/thunk';

const Index = () => {
  let [isSideBarOn, toggleSideBar] = useState(true); //sideBar 숨김 컨트롤

  const dispatch = useDispatch();
  dispatch(fetchEvents());
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

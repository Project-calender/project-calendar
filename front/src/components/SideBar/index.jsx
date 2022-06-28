import React from 'react';
import styles from './style.module.css';
import AddEventButton from './AddEventButton';

const index = () => {
  return (
    <aside className={styles.container}>
      <AddEventButton />
    </aside>
  );
};

export default index;

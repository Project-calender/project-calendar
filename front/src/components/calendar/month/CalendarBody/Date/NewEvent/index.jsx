import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { EventBarContext } from '../../../../../../context/EventBarContext';
import EventBar from '../EventBar';

const Index = ({ dateTime }) => {
  const eventBars = useContext(EventBarContext);
  const eventBar = eventBars.find(({ time }) => dateTime === time);

  return <EventBar eventBar={eventBar} />;
};

Index.propTypes = {
  dateTime: PropTypes.number,
};

export default Index;

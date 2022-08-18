import React from 'react';
import YearConlendar from '../../components/calendar/YearConlendar';
import EventListModalLayout from '../../modal/layout/EventListModalLayout';
import EventDetailModalLayout from '../../modal/layout/EventDetailModalLayout';

const Index = () => {
  return (
    <EventDetailModalLayout>
      <EventListModalLayout>
        <YearConlendar />
      </EventListModalLayout>
    </EventDetailModalLayout>
  );
};

export default Index;

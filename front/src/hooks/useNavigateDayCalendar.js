import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CALENDAR_URL } from '../constants/path';
import { selectDate } from '../store/date';

export default function useNavigateDayCalendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function moveDayCalendar(date) {
    if (date) dispatch(selectDate(date));
    navigate(CALENDAR_URL.DAY);
  }

  return { moveDayCalendar };
}

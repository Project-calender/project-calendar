import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CALENDAR_PATH } from '../constants/path';
import { selectDate } from '../store/date';

export default function useNavigateDayCalendar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function moveDayCalendar(date) {
    if (date) dispatch(selectDate(date));
    navigate(CALENDAR_PATH.DAY);
  }

  return { moveDayCalendar };
}

import { useDispatch } from 'react-redux';
import { addMonth } from '../store/date';

export default function useAddMonthByWheel(e) {
  const dispatch = useDispatch();

  function changeMonth() {
    if (e.deltaY > 0) dispatch(addMonth(1));
    else dispatch(addMonth(-1));
  }

  return { changeMonth };
}

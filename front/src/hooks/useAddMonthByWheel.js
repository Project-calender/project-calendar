import { useDispatch } from 'react-redux';
import { addMonth } from '../store/date';

export default function useAddMonthByWheel() {
  const dispatch = useDispatch();

  function changeMonth(e) {
    if (e.nativeEvent.ctrlKey) return;
    if (e.deltaY > 0) dispatch(addMonth(1));
    else dispatch(addMonth(-1));
  }

  return { changeMonth };
}

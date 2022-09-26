import { useState } from 'react';
import { useEffect } from 'react';

export default function usePopupClose(ref) {
  const [toggle, setToggle] = useState();

  //알림창 외부 클릭시 알림창 닫기
  const clickModalOutside = event => {
    if (!ref.current.contains(event.target)) {
      setToggle(false);
    } else {
      setToggle(true);
    }
  };

  //알림창 외부 클릭시 알림창 닫기
  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  return toggle;
}

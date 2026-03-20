import { useEffect, useState } from "react";

export default function useMinimumDelay(loading, delay = 600) {
  const [show, setShow] = useState(loading);

  useEffect(() => {
    let timer;

    if (!loading) {
      // delay hiding skeleton
      timer = setTimeout(() => {
        setShow(false);
      }, delay);
    } else {
      // immediately show skeleton when loading starts
      setShow(true);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [loading, delay]);

  return show;
}
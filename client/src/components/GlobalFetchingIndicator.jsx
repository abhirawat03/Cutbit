import { useIsFetching } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function GlobalFetchingIndicator() {
  const isFetching = useIsFetching();
  const [visible, setVisible] = useState(false);
  console.log("isFetching:", isFetching);

   useEffect(() => {
    let showTimer;
    let hideTimer;

    if (isFetching) {
      // show after delay
      showTimer = setTimeout(() => setVisible(true), 200);
    } else {
      // slight delay before hiding → smoother UX
      hideTimer = setTimeout(() => setVisible(false), 150);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isFetching]);


  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-[loading_1.2s_ease-in-out_infinite] z-50" />
  );
}
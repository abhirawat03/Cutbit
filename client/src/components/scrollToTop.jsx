import { useEffect} from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    // ❌ skip dashboard routes
    if (location.pathname.startsWith("/dashboard")) return;

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);
  return null
}

export default ScrollToTop;
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function HeaderTitle() {
  const [title, setTitle] = useState("");
  let location = useLocation();

  useEffect(() => {
    const str = location.pathname;
    if (str === "/member") {
      setTitle("OUR PEOPLE");
    } else {
      const n = str.lastIndexOf("/");
      const result = str.substring(n + 1);
      setTitle(result.toUpperCase());
    }
  }, [location]);

  return title;
}

export default HeaderTitle;

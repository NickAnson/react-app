import { useState } from "react";
import { useLocation } from "react-router-dom";

interface Props {
  items: { redirect: string; name: string }[];
}

const TitleBar = ({ items }: Props) => {
  const location = useLocation();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className={`topnav ${isMenuOpen ? "open" : ""}`}>
      <div className="menu-icon" onClick={toggleMenu}>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
        <div className="icon-bar"></div>
      </div>
      <div className="nav-items">
        {items.map((item) => {
          const isActive =
            location.pathname === item.redirect ||
            (item.redirect !== "/" &&
              location.pathname.startsWith(item.redirect));

          return (
            <a
              href={item.redirect}
              className={`nav-item ${isActive ? "current" : ""}`}
              key={item.redirect}
            >
              {item.name}
            </a>
          );
        })}
      </div>
      {isMenuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </div>
  );
};

export default TitleBar;

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Style from './Navbar.module.css';
import { useState } from 'react';
import { links } from '../helper';
import NavbarHeader from './NavbarHeader';

const Navbar = () => {
  const [isActive, setIsActive] = useState('dashboard');

  return (
    <div className="flex flex-col gap-2 p-5 h-screen justify-start items-start px-9 ">
      <NavbarHeader />
      <div className="flex flex-col justify-center items-start gap-3 w-[230px]">
        {links.map((link) => (
          <Link
            onClick={() => setIsActive(link.value)}
            className={`${Style.navLink} ${
              isActive === link.value ? Style.active : ''
            }`}
            key={link.value}
            to={link.to}
          >
            <div className={Style.navbar}>
              <div className={Style.navbarIcon}>
                <FontAwesomeIcon
                  icon={link.icons}
                  size="sm"
                  className={Style.fontIcon}
                />
              </div>
              {link.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;

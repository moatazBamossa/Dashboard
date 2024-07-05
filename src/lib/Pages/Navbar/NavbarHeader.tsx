import logo from '@assets/logo.svg';
const NavbarHeader = () => {
  return (
    <div className="flex gap-3 p-3 justify-center items-center ">
      <img height={20} src={logo} />
      <p>HR.360</p>
    </div>
  );
};

export default NavbarHeader;

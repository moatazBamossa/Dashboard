import {
  faHome,
  faTable,
  faUser,
  faBank,
  faChartLine,
  faSignIn,
  faUserEdit
} from '@fortawesome/free-solid-svg-icons';

export const links = [
  {
    value: 'dashboard',
    name: 'Dashboard',
    to: '/',
    icons: faHome
  },
  {
    value: 'tables',
    name: 'Tables',
    to: '/Tables',
    icons: faTable
  },
  {
    value: 'billing',
    name: 'Billing',
    to: '/Billing',
    icons: faBank
  },
  {
    value: 'rtl',
    name: 'RTL',
    to: '/RTL',
    icons: faChartLine
  },
  {
    value: 'Profile',
    name: 'Profile',
    to: '/Profile',
    icons: faUser
  },
  {
    value: 'signIn',
    name: 'Sign In',
    to: '/SignIn',
    icons: faSignIn
  },
  {
    value: 'signUp',
    name: 'Sign Up',
    to: '/SignUp',
    icons: faUserEdit
  }
];

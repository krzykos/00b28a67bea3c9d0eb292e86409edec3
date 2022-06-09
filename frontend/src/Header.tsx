import './Header.css';
import logo from './marche-health-logo.svg';

export default function Header() {
  return (
    <div className="Header">
      <img src={logo} className="logo" alt="logo" />
    </div>
  );
}

import { Link } from 'react-router-dom';
import rentiaLogo from '../assets/Rentia_logo.webp';

export default function Logo({ inverse = false, className = '' }) {
  return (
    <Link to="/" aria-label="Rentia, ir al inicio" className={`inline-block ${className}`}>
      <img
        src={rentiaLogo}
        alt="Rentia"
        className={`h-auto w-24 object-contain md:w-28 ${inverse ? 'brightness-0 invert' : ''}`}
      />
    </Link>
  );
}

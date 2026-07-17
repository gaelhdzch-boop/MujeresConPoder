import { COLORS } from '../constants/colors';

export const Navbar = ({ onLogoClick }) => {
  return (
    <nav className="navbar navbar-light bg-light px-4 py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <button className="navbar-brand fw-bold btn btn-link p-0 d-flex align-items-center gap-2" type="button" onClick={onLogoClick}>
          <img src="/logo.ico" alt="OMNIA KIN logo" style={{ width: 32, height: 32, objectFit: 'contain' }} />
          <span className="fw-bold" style={{ color: COLORS.primary }}>OMNIA KIN</span>
        </button>
      </div>
    </nav>
  );
};

import { COLORS } from '../constants/colors';

export const HeroSection = ({ onCreateAccountClick }) => {
  return (
    <section className="hero-section text-center p-5 position-relative" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="container py-5">
        <h1 className="display-4 fw-bold mb-0">
          <span style={{ color: COLORS.primary }}>Crece a tu propio ritmo</span>
        </h1>
        <h2 className="h4 fw-normal mb-4" style={{ color: COLORS.darkPrimary }}>
          con tu propia red
        </h2>
        
        <p 
          className="lead mx-auto mb-4 fw-bold" 
          style={{ maxWidth: '600px', color: COLORS.mediumPrimary }}
        >
          Tu talento, nuestras herramientas. Encuentra la formación, el mercado y el respaldo financiero que necesitas para llevar tu negocio al siguiente nivel. Un ecosistema creado por y para mujeres que no se detienen.
        </p>
        
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button 
            className="btn btn-lg rounded-pill px-4 text-white"
            style={{ backgroundColor: COLORS.primary, border: 'none' }}
            onClick={onCreateAccountClick}
          >
            Comenzar
          </button>
          <button 
            className="btn btn-light btn-lg rounded-pill px-4"
            style={{ color: COLORS.primary }}
            onClick={() => console.log('Conoce más clicked')}
          >
            Conoce más
          </button>
        </div>
      </div>
    </section>
  );
};

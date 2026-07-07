import { COLORS } from '../constants/colors';

export const OpportunitiesBanner = () => {
  return (
    <section id="oportunidades" className="text-center p-5 position-relative" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="container">
        <div className="p-5 rounded-4 text-center shadow-sm" style={{ backgroundColor: '#ffffff' }}>
          <h2 className="fw-bold mb-3" style={{ color: COLORS.primary }}>Oportunidades para ti</h2>
          <p className="mx-auto mb-4" style={{ maxWidth: '700px', color: COLORS.mediumPrimary }}>
            Descubre empleos, becas, convocatorias de programas de gobierno, financiamiento y mentorías diseñadas para mujeres emprendedoras.
          </p>
          <button
            className="btn btn-lg rounded-pill px-4 text-white"
            style={{ backgroundColor: COLORS.primary, border: 'none' }}
            onClick={() => console.log('Explorar oportunidades clicked')}
          >
            Explorar oportunidades &rarr;
          </button>
        </div>
      </div>
    </section>
  );
};

import { COLORS } from '../constants/colors';

export const OpportunitiesBanner = () => {
  return (
    <section id="oportunidades" className="container py-5 mb-5">
      <div 
        className="p-5 rounded-4 text-center shadow-sm"
        style={{ backgroundColor: COLORS.opportunitiesBg }}
      >
        <h2 className="fw-bold mb-3">Oportunidades para ti</h2>
        <p 
          className="mx-auto mb-4"
          style={{ maxWidth: '700px' }}
        >
          Descubre empleos, becas, convocatorias de programas de gobierno, financiamiento y mentorías todo específicamente para mujeres emprendedoras
        </p>
        <button 
          className="btn bg-white rounded-pill px-4 py-2 fw-bold"
          style={{ color: '#000', border: 'none' }}
          onClick={() => console.log('Explorar oportunidades clicked')}
        >
          Explorar oportunidades &rarr;
        </button>
      </div>
    </section>
  );
};

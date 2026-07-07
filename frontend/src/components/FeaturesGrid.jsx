import { COLORS } from '../constants/colors';

const features = [
  {
    title: 'Cursos',
    description: 'Capacítate cuando quieras',
    bgColor: COLORS.cardBg1,
  },
  {
    title: 'Finanzas',
    description: 'Lleva tus números fácil',
    bgColor: COLORS.cardBg2,
  },
  {
    title: 'Marketplace',
    description: 'Vende lo que haces',
    bgColor: COLORS.cardBg3,
  },
  {
    title: 'Comunidad',
    description: 'Conoce otras mujeres',
    bgColor: COLORS.cardBg4,
  },
];

export const FeaturesGrid = () => {
  return (
    <section id="cursos" className="container py-5 text-center">
      <h2 className="fw-bold mb-4">
        Todo lo que necesitas, <br /> 
        <span style={{ color: COLORS.primary }}>JUNTO</span>
      </h2>
      
      <div className="row g-4 mt-2">
        {features.map((feature) => (
          <div key={feature.title} className="col-md-6">
            <div 
              className="card h-100 p-4 border-0 shadow-sm rounded-4"
              style={{ backgroundColor: feature.bgColor }}
            >
              <div className="card-body text-start">
                <h3 className="card-title fw-bold">{feature.title}</h3>
                <p className="card-text">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

import '../styles/Comunidad.css';

const publicacionesEjemplo = [
  {
    id: 1,
    categoria: 'Emprendimiento',
    autor: 'Lucía',
    tiempo: 'Hace 2 horas',
    titulo: 'Consejos para lanzar tu primer producto digital',
    texto: 'Quiero compartir los 3 errores que cometí al principio y cómo los solucioné para vender con más confianza.',
    reacciones: 24,
    comentarios: 8,
  },
  {
    id: 2,
    categoria: 'Finanzas',
    autor: 'Ana',
    tiempo: 'Hace 4 horas',
    titulo: '¿Cómo separas gastos del negocio y gastos personales?',
    texto: 'Estoy armando mi primera libreta de control y quiero saber qué te funciona a ti.',
    reacciones: 14,
    comentarios: 3,
  },
];

const comunidades = ['#General', '#Emprendimiento', '#Bienestar', '#Finanzas'];
const mentoras = ['Contadora experta', 'Mentora digital', 'Psicóloga de negocio'];

export default function Comunidad() {
  return (
    <section id="comunidad" className="comunidad-section">
      <div className="comunidad-header text-center">
        <span className="comunidad-kicker">Comunidad</span>
        <h2>Comparte ideas, aprende y conectate con otras emprendedoras</h2>
        <p>Un espacio seguro para inspirarte, resolver dudas y llevar tus proyectos más lejos.</p>
      </div>

      <div className="comunidad-layout container">
        <aside className="comunidad-sidebar">
          <div className="comunidad-panel">
            <h3>Explorar</h3>
            <ul>
              {comunidades.map((item) => (
                <li key={item}>
                  <a href={`#${item.replace('#', '').toLowerCase()}`} className="comunidad-link">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="comunidad-main">
          <div className="comunidad-panel comunidad-post-box">
            <textarea
              placeholder="¿Qué quieres compartir hoy con la comunidad?..."
              aria-label="Escribe una publicación"
              rows="4"
            />
            <button type="button" className="btn btn-primary comunidad-btn">
              Publicar
            </button>
          </div>

          {publicacionesEjemplo.map((post) => (
            <article key={post.id} className="comunidad-card">
              <div className="comunidad-card-header">
                <span className="comunidad-badge">{post.categoria}</span>
                <span className="comunidad-meta">
                  {post.autor} • {post.tiempo}
                </span>
              </div>
              <h3>{post.titulo}</h3>
              <p>{post.texto}</p>
              <div className="comunidad-card-footer">
                <span>{post.reacciones} reacciones</span>
                <span>{post.comentarios} comentarios</span>
              </div>
            </article>
          ))}
        </main>

        <aside className="comunidad-widget">
          <div className="comunidad-panel">
            <h3>Mentoras activas</h3>
            <ul>
              {mentoras.map((mentora) => (
                <li key={mentora}>{mentora}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

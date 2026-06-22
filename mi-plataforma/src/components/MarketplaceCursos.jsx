import { useMemo, useState } from 'react';
import { COLORS } from '../constants/colors';
import '../styles/MarketplaceCursos.css';

const courses = [
  {
    id: 'emprende-desde-cero',
    titulo: 'Emprende desde cero',
    categoria: 'Emprendimiento',
    nivel: 'Básico',
    duracion: '6 horas',
    descripcion: 'Define tu idea, identifica a tus clientas y prepara una primera oferta lista para vender.',
  },
  {
    id: 'ventas-redes-sociales',
    titulo: 'Ventas por redes sociales',
    categoria: 'Digital',
    nivel: 'Intermedio',
    duracion: '5 horas',
    descripcion: 'Aprende a mostrar productos, escribir mensajes de venta y responder dudas sin perder tiempo.',
  },
  {
    id: 'finanzas-negocio',
    titulo: 'Finanzas para mi negocio',
    categoria: 'Finanzas',
    nivel: 'Básico',
    duracion: '7 horas',
    descripcion: 'Organiza ingresos, gastos, precios y metas para tomar mejores decisiones cada semana.',
  },
];

const productosEjemplo = [
  {
    id: 'bolsas-tejidas',
    nombre: 'Bolsas tejidas',
    categoria: 'Moda',
    precio: '$450 MXN',
    ciudad: 'CDMX',
    descripcion: 'Artesanías hechas a mano para transportar tu día con estilo.',
  },
  {
    id: 'asesoria',
    nombre: 'Asesoría de emprendimiento',
    categoria: 'Servicios',
    precio: '$950 MXN',
    ciudad: 'Online',
    descripcion: 'Sesión de 1 hora para estructurar tu propuesta de valor y plan de ventas.',
  },
];

export default function MarketplaceCursos() {
  const [cursoSeleccionado, setCursoSeleccionado] = useState(courses[0]);
  const [categoria, setCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const cursosFiltrados = useMemo(() => {
    return courses.filter((curso) => {
      const coincideCategoria = categoria === 'Todos' || curso.categoria === categoria;
      const coincideBusqueda = !busqueda || curso.titulo.toLowerCase().includes(busqueda.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
  }, [categoria, busqueda]);

  return (
    <section id="marketplace" className="mc-section marketplace-section">
      <div className="mc-section-header text-center">
        <span className="mc-kicker">Marketplace</span>
        <h2>Vende y encuentra productos pensados para ti</h2>
        <p>Descubre cursos, servicios y productos creados por mujeres emprendedoras como tú.</p>
      </div>

      <div className="mc-overview">
        <div className="mc-overview-copy">
          <h2>Capacitación y comercio en un mismo lugar</h2>
          <p>Explora cursos para crecer, publica tus productos y conecta con clientas que buscan algo especial.</p>
          <div className="mc-overview-actions">
            <button className="mc-primary-link" style={{ backgroundColor: COLORS.primary, color: '#fff' }}>Ver cursos</button>
            <button className="mc-secondary-link" style={{ borderColor: COLORS.primary, color: COLORS.primary }}>Publicar producto</button>
          </div>
        </div>
        <div className="mc-overview-panel">
          <strong>{courses.length} cursos</strong>
          <span>Filtrado para emprendedoras</span>
        </div>
      </div>

      <div className="mc-market-layout">
        <aside className="mc-market-tools">
          <div className="mc-filter-group">
            <span>Filtrar por categoría</span>
            <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              <option>Todos</option>
              <option>Emprendimiento</option>
              <option>Digital</option>
              <option>Finanzas</option>
            </select>
          </div>
          <div className="mc-filter-group">
            <span>Buscar curso</span>
            <input
              type="text"
              placeholder="Escribe una palabra clave"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>
        </aside>

        <div className="mc-market-content">
          <div className="mc-course-grid">
            {cursosFiltrados.map((curso) => (
              <article key={curso.id} className="mc-course-card" onClick={() => setCursoSeleccionado(curso)}>
                <div>
                  <span className="mc-chip">{curso.categoria}</span>
                  <h3>{curso.titulo}</h3>
                  <p>{curso.descripcion}</p>
                </div>
                <div className="mc-course-meta">
                  <span>{curso.nivel}</span>
                  <span>{curso.duracion}</span>
                </div>
              </article>
            ))}
          </div>

          <article className="mc-featured-card">
            <h3>{cursoSeleccionado.titulo}</h3>
            <p>{cursoSeleccionado.descripcion}</p>
            <div className="mc-featured-meta">
              <span>{cursoSeleccionado.categoria}</span>
              <span>{cursoSeleccionado.nivel}</span>
            </div>
            <button className="mc-card-button">Inscribirme</button>
          </article>

          <article className="mc-market-card">
            <h3>Productos destacados</h3>
            <div className="mc-product-list">
              {productosEjemplo.map((producto) => (
                <div key={producto.id} className="mc-product-item">
                  <strong>{producto.nombre}</strong>
                  <span>{producto.categoria}</span>
                  <p>{producto.descripcion}</p>
                  <div className="mc-product-footer">
                    <span>{producto.precio}</span>
                    <span>{producto.ciudad}</span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

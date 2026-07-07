import { useEffect, useMemo, useState } from 'react';
import { COLORS } from '../constants/colors';
import { authService } from '../services/api';
import '../styles/Cursos.css';

const cursosBase = [
  {
    id: 'emprende-desde-cero',
    titulo: 'Emprende desde cero',
    categoria: 'Emprendimiento',
    nivel: 'Básico',
    duracion: '6 horas',
    precio: '$199 MXN',
    descripcion: 'Define tu idea, identifica a tus clientas y prepara una primera oferta lista para vender.',
    aprendizajes: ['Validar tu idea', 'Ordenar precios base', 'Preparar una oferta simple'],
  },
  {
    id: 'ventas-redes-sociales',
    titulo: 'Ventas por redes sociales',
    categoria: 'Digital',
    nivel: 'Intermedio',
    duracion: '5 horas',
    precio: '$249 MXN',
    descripcion: 'Aprende a mostrar productos, escribir mensajes de venta y responder dudas sin perder tiempo.',
    aprendizajes: ['Crear contenido claro', 'Responder objeciones', 'Medir publicaciones'],
  },
  {
    id: 'finanzas-negocio',
    titulo: 'Finanzas para mi negocio',
    categoria: 'Finanzas',
    nivel: 'Básico',
    duracion: '7 horas',
    precio: '$299 MXN',
    descripcion: 'Organiza ingresos, gastos, precios y metas para tomar mejores decisiones cada semana.',
    aprendizajes: ['Separar finanzas', 'Calcular utilidad', 'Definir metas semanales'],
  },
];

export default function Cursos() {
  const [categoria, setCategoria] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [progresoCursos, setProgresoCursos] = useState({});
  const [cursoSeleccionado, setCursoSeleccionado] = useState(cursosBase[0]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProgreso = async () => {
      if (!localStorage.getItem('token')) {
        setLoading(false);
        return;
      }

      try {
        const data = await authService.getUserCourses();
        const mapa = {};
        (data.courses || []).forEach((curso) => {
          mapa[curso.curso_id] = Number(curso.progreso || 0);
        });
        setProgresoCursos(mapa);
      } catch (err) {
        setError(err.message || 'No se pudo cargar tu progreso');
      } finally {
        setLoading(false);
      }
    };

    cargarProgreso();
  }, []);

  const cursosFiltrados = useMemo(() => {
    return cursosBase.filter((curso) => {
      const porCat = categoria === 'Todos' || curso.categoria === categoria;
      const porBusq = !busqueda || curso.titulo.toLowerCase().includes(busqueda.toLowerCase());
      return porCat && porBusq;
    });
  }, [categoria, busqueda]);

  const guardarInscripcion = async (curso, siguienteProgreso) => {
    if (!localStorage.getItem('token')) {
      setError('Inicia sesión para guardar tu inscripción y progreso.');
      return;
    }

    try {
      const progresoActual = Number(progresoCursos[curso.id] || 0);
      const progreso = Math.max(progresoActual, siguienteProgreso);

      if (progresoActual > 0) {
        await authService.updateCourseProgress(curso.id, progreso);
      } else {
        await authService.registerCourse(curso.id, progreso);
      }

      setProgresoCursos((prev) => ({ ...prev, [curso.id]: progreso }));
      setCursoSeleccionado(curso);
      setMessage(`Tu avance en "${curso.titulo}" se guardó en ${progreso}%.`);
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo guardar el curso');
    }
  };

  const inscribirse = async (curso) => {
    await guardarInscripcion(curso, 10);
  };

  const avanzarCurso = async (curso) => {
    const progresoActual = Number(progresoCursos[curso.id] || 0);
    const siguiente = Math.min(100, progresoActual + 25);
    await guardarInscripcion(curso, siguiente);
  };

  const reiniciarCurso = async (curso) => {
    if (!localStorage.getItem('token')) {
      setError('Inicia sesión para reiniciar tu progreso.');
      return;
    }

    try {
      await authService.updateCourseProgress(curso.id, 0);
      setProgresoCursos((prev) => ({ ...prev, [curso.id]: 0 }));
      setCursoSeleccionado(curso);
      setMessage(`Reiniciaste el avance de "${curso.titulo}".`);
      setError('');
    } catch (err) {
      setError(err.message || 'No se pudo reiniciar el curso');
    }
  };

  return (
    <section id="cursos" className="cursos-page p-5">
      <div className="container">
        <div className="cursos-header text-center mb-4">
          <h2 style={{ color: COLORS.primary }}>Cursos</h2>
          <p style={{ color: COLORS.mediumPrimary }}>Formación práctica para crecer tu negocio.</p>
        </div>

        <div className="d-flex gap-3 mb-4 flex-wrap">
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="form-select w-auto">
            <option>Todos</option>
            <option>Emprendimiento</option>
            <option>Digital</option>
            <option>Finanzas</option>
          </select>
          <input className="form-control" placeholder="Buscar curso" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        {message && <div className="curso-alert success">{message}</div>}
        {error && <div className="curso-alert error">{error}</div>}

        <div className="curso-grid">
          {cursosFiltrados.map((curso) => {
            const progreso = Number(progresoCursos[curso.id] || 0);
            const inscrito = progreso > 0;

            return (
              <article key={curso.id} className={`curso-card ${cursoSeleccionado.id === curso.id ? 'curso-card-active' : ''}`}>
                <div className="curso-card-body">
                  <div className="curso-card-top">
                    <span className="curso-chip">{curso.categoria}</span>
                    <span className="curso-badge">{inscrito ? `${progreso}%` : 'Sin iniciar'}</span>
                  </div>
                  <h3>{curso.titulo}</h3>
                  <p className="curso-description">{curso.descripcion}</p>
                  <p className="small text-muted">{curso.categoria} • {curso.nivel} • {curso.duracion}</p>
                  <div className="curso-progress">
                    <div className="curso-progress-bar">
                      <span style={{ width: `${progreso}%` }} />
                    </div>
                  </div>
                  <div className="curso-actions">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setCursoSeleccionado(curso)} type="button">
                      Ver más
                    </button>
                    <button className="btn btn-sm btn-primary" onClick={() => inscribirse(curso)} style={{ backgroundColor: COLORS.primary, border: 'none' }} type="button">
                      {inscrito ? 'Continuar' : 'Inscribirme'}
                    </button>
                  </div>
                  {inscrito > 0 && (
                    <div className="curso-actions secondary-actions">
                      <button className="btn btn-sm btn-outline-primary" onClick={() => avanzarCurso(curso)} type="button">
                        +25%
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => reiniciarCurso(curso)} type="button">
                        Reiniciar
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="curso-detail-card">
          <div className="curso-detail-copy">
            <span className="curso-chip">Ruta recomendada</span>
            <h3>{cursoSeleccionado.titulo}</h3>
            <p>{cursoSeleccionado.descripcion}</p>
            <div className="curso-meta">
              <span>{cursoSeleccionado.categoria}</span>
              <span>{cursoSeleccionado.nivel}</span>
              <span>{cursoSeleccionado.duracion}</span>
              <span>{cursoSeleccionado.precio}</span>
            </div>
          </div>
          <div className="curso-detail-list">
            <h4>Qué aprenderás</h4>
            <ul>
              {cursoSeleccionado.aprendizajes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {loading && <p className="text-muted mt-3">Cargando tu progreso...</p>}
      </div>
    </section>
  );
}

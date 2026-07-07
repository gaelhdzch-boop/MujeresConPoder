import { useMemo, useState } from 'react';
import asesoriaImg from '../assets/marketplace/asesoria-imagen.png';
import bolsasImg from '../assets/marketplace/bolsas-tejidas.png';
import pastelesImg from '../assets/marketplace/pasteles.png';
import velasImg from '../assets/marketplace/velas-artesanales.png';
import './MarketplaceCursos.css';

const cursos = [
  {
    id: 'emprende-desde-cero',
    titulo: 'Emprende desde cero',
    categoria: 'Emprendimiento',
    nivel: 'Básico',
    duracion: '6 horas',
    modulos: 4,
    avance: 0,
    modalidad: 'Autoguiado',
    instructor: 'Renata Solís',
    insignia: 'Inicio recomendado',
    descripcion:
      'Define tu idea, identifica a tus clientas y prepara una primera oferta lista para vender.',
    objetivo: 'Sales con una propuesta clara, un perfil de clienta y tus primeros pasos de venta.',
    recursos: ['Videoclases', 'Guía PDF', 'Plantilla de plan'],
    aprendizajes: ['Validar tu idea', 'Ordenar precios base', 'Preparar una oferta simple'],
    color: 'rosa',
  },
  {
    id: 'ventas-redes-sociales',
    titulo: 'Ventas por redes sociales',
    categoria: 'Digital',
    nivel: 'Intermedio',
    duracion: '5 horas',
    modulos: 3,
    avance: 0,
    modalidad: 'Con ejercicios',
    instructor: 'Mariana López',
    insignia: 'Más solicitado',
    descripcion:
      'Aprende a mostrar productos, escribir mensajes de venta y responder dudas sin perder tiempo.',
    objetivo: 'Construyes una mini estrategia de contenido y un guion para convertir mensajes en pedidos.',
    recursos: ['Checklist', 'Ejercicios', 'Plantillas de mensajes'],
    aprendizajes: ['Crear contenido claro', 'Responder objeciones', 'Medir publicaciones'],
    color: 'amarillo',
  },
  {
    id: 'finanzas-negocio',
    titulo: 'Finanzas para mi negocio',
    categoria: 'Finanzas',
    nivel: 'Básico',
    duracion: '7 horas',
    modulos: 5,
    avance: 0,
    modalidad: 'Práctico',
    instructor: 'Carolina Méndez',
    insignia: 'Con plantilla',
    descripcion:
      'Organiza ingresos, gastos, precios y metas para tomar mejores decisiones cada semana.',
    objetivo: 'Terminas con una hoja de control y una rutina sencilla para revisar números.',
    recursos: ['Hoja de cálculo', 'Lecturas', 'Actividades'],
    aprendizajes: ['Separar finanzas', 'Calcular utilidad', 'Definir metas semanales'],
    color: 'verde',
  },
  {
    id: 'marca-personal',
    titulo: 'Marca personal para emprendedoras',
    categoria: 'Emprendimiento',
    nivel: 'Intermedio',
    duracion: '4 horas',
    modulos: 4,
    avance: 0,
    modalidad: 'Proyecto final',
    instructor: 'Paula Herrera',
    insignia: 'Nueva edición',
    descripcion:
      'Construye una identidad clara para que tu negocio sea reconocible, confiable y fácil de recomendar.',
    objetivo: 'Creas una guía breve de voz, colores, mensajes y promesa de marca.',
    recursos: ['Guía visual', 'Ejemplos', 'Tarea final'],
    aprendizajes: ['Nombrar tu diferencia', 'Unificar mensajes', 'Diseñar una guía básica'],
    color: 'lila',
  },
  {
    id: 'fotografia-producto',
    titulo: 'Fotografía de producto con celular',
    categoria: 'Digital',
    nivel: 'Básico',
    duracion: '3 horas',
    modulos: 3,
    avance: 0,
    modalidad: 'Taller',
    instructor: 'Daniela Torres',
    insignia: 'Rápido de aplicar',
    descripcion:
      'Mejora tus fotos usando luz natural, composición simple y edición básica desde el teléfono.',
    objetivo: 'Publicas fotos más limpias para catálogo, redes y fichas de marketplace.',
    recursos: ['Ejemplos', 'Lista de tomas', 'Reto práctico'],
    aprendizajes: ['Usar luz natural', 'Preparar fondos', 'Editar sin exceso'],
    color: 'azul',
  },
  {
    id: 'costos-precios',
    titulo: 'Costos y precios sin enredos',
    categoria: 'Finanzas',
    nivel: 'Avanzado',
    duracion: '6 horas',
    modulos: 4,
    avance: 0,
    modalidad: 'Con calculadora',
    instructor: 'Lucía Paredes',
    insignia: 'Para escalar',
    descripcion:
      'Calcula costos, margen, descuentos y precio final sin vender por debajo de tu esfuerzo.',
    objetivo: 'Sales con una calculadora de precios ajustada a productos o servicios.',
    recursos: ['Calculadora', 'Casos reales', 'Sesión de dudas'],
    aprendizajes: ['Identificar costos ocultos', 'Definir margen', 'Probar escenarios'],
    color: 'menta',
  },
];

const productosIniciales = [];

const categoriasCursos = ['Todos', 'Emprendimiento', 'Digital', 'Finanzas'];
const nivelesCursos = ['Todos', 'Básico', 'Intermedio', 'Avanzado'];
const categoriasMarketplace = ['Todos', 'Artesanías', 'Alimentos', 'Servicios', 'Moda'];
const opcionesOrden = [
  { valor: 'destacados', texto: 'Destacados' },
  { valor: 'precio-menor', texto: 'Precio menor' },
  { valor: 'precio-mayor', texto: 'Precio mayor' },
  { valor: 'ventas', texto: 'Más vendidos' },
];

const imagenPorCategoria = {
  Artesanías: velasImg,
  Alimentos: pastelesImg,
  Servicios: asesoriaImg,
  Moda: bolsasImg,
};

const formularioVacio = {
  nombre: '',
  categoria: 'Artesanías',
  precio: '',
  negocio: '',
  ciudad: '',
  descripcion: '',
};

const normalizarTexto = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const obtenerPrecioValor = (precio) => {
  const numero = Number(precio.replace(/[^\d.]/g, ''));
  return Number.isFinite(numero) ? numero : 0;
};

const formatearPrecio = (precio) => {
  const limpio = precio.trim();

  if (!limpio) {
    return 'A cotizar';
  }

  if (limpio.toLowerCase().includes('cotizar') || limpio.includes('$')) {
    return limpio;
  }

  return `$${limpio} MXN`;
};

export default function MarketplaceCursos() {
  const [categoriaCurso, setCategoriaCurso] = useState('Todos');
  const [nivelCurso, setNivelCurso] = useState('Todos');
  const [cursoSeleccionado, setCursoSeleccionado] = useState(cursos[0]);
  const [mensajeCurso, setMensajeCurso] = useState('');
  const [categoriaProducto, setCategoriaProducto] = useState('Todos');
  const [ordenProducto, setOrdenProducto] = useState('destacados');
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(productosIniciales);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [mensajeFormulario, setMensajeFormulario] = useState('');

  const cursosFiltrados = useMemo(() => {
    return cursos.filter((curso) => {
      const coincideCategoria = categoriaCurso === 'Todos' || curso.categoria === categoriaCurso;
      const coincideNivel = nivelCurso === 'Todos' || curso.nivel === nivelCurso;

      return coincideCategoria && coincideNivel;
    });
  }, [categoriaCurso, nivelCurso]);

  const productosFiltrados = useMemo(() => {
    const textoBusqueda = normalizarTexto(busqueda.trim());

    const filtrados = productos.filter((producto) => {
      const coincideCategoria =
        categoriaProducto === 'Todos' || producto.categoria === categoriaProducto;
      const coincideBusqueda =
        !textoBusqueda ||
        normalizarTexto(
          `${producto.nombre} ${producto.negocio} ${producto.autora} ${producto.descripcion} ${producto.ciudad}`,
        ).includes(textoBusqueda);

      return coincideCategoria && coincideBusqueda;
    });

    return [...filtrados].sort((a, b) => {
      if (ordenProducto === 'precio-menor') {
        return a.precioValor - b.precioValor;
      }

      if (ordenProducto === 'precio-mayor') {
        return b.precioValor - a.precioValor;
      }

      if (ordenProducto === 'ventas') {
        return b.ventas - a.ventas;
      }

      return b.rating - a.rating;
    });
  }, [busqueda, categoriaProducto, ordenProducto, productos]);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setFormulario((actual) => ({ ...actual, [name]: value }));
  };

  const seleccionarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setMensajeCurso('');
  };

  const inscribirseCurso = () => {
    setMensajeCurso(`Inscripción preparada para "${cursoSeleccionado.titulo}".`);
  };

  const publicarProducto = (evento) => {
    evento.preventDefault();

    if (!formulario.nombre.trim() || !formulario.descripcion.trim()) {
      setMensajeFormulario('Agrega al menos el nombre y una descripción breve.');
      return;
    }

    const precio = formatearPrecio(formulario.precio);
    const nuevoProducto = {
      id: `publicacion-${Date.now()}`,
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria,
      tipo: formulario.categoria === 'Servicios' ? 'Servicio' : 'Producto',
      precio,
      precioValor: obtenerPrecioValor(precio),
      negocio: formulario.negocio.trim() || 'Mi emprendimiento',
      autora: 'Nueva emprendedora',
      ciudad: formulario.ciudad.trim() || 'Local',
      descripcion: formulario.descripcion.trim(),
      etiqueta: 'Recién publicado',
      entrega: 'Contacto directo con la oferente',
      rating: 0,
      ventas: 0,
      imagen: imagenPorCategoria[formulario.categoria] || velasImg,
    };

    setProductos((actuales) => [nuevoProducto, ...actuales]);
    setProductoSeleccionado(nuevoProducto);
    setCategoriaProducto('Todos');
    setOrdenProducto('destacados');
    setBusqueda('');
    setFormulario(formularioVacio);
    setMensajeFormulario('Publicación agregada al catálogo de ejemplo.');
  };

  return (
    <div className="marketplace-cursos">
      <section className="mc-overview" aria-labelledby="ecosistema-title">
        <div className="mc-overview-copy">
          <span className="mc-kicker">Aprendizaje + ventas</span>
          <h2 id="ecosistema-title">Impulsa tu negocio en un solo lugar</h2>
          <p>
            Explora cursos accionables, publica tus productos y encuentra servicios de otras
            emprendedoras sin salir de la plataforma.
          </p>

          <div className="mc-overview-actions">
            <a className="mc-primary-link" href="#cursos">
              Ver cursos
            </a>
            <a className="mc-secondary-link" href="#marketplace">
              Ir al marketplace
            </a>
          </div>
        </div>

        <div className="mc-overview-panel" aria-label="Resumen de plataforma">
          <div>
            <strong>0</strong>
            <span>Cursos inscritos</span>
          </div>
          <div>
            <strong>0.0</strong>
            <span>Calificación promedio</span>
          </div>
          <div>
            <strong>0</strong>
            <span>Ventas registradas</span>
          </div>
        </div>
      </section>

      <section className="mc-section mc-section-cursos" id="cursos" aria-labelledby="cursos-title">
        <div className="mc-section-header">
          <span className="mc-kicker">Capacitación y formación</span>
          <h2 id="cursos-title">Cursos para crecer tu negocio</h2>
          <p>
            Rutas cortas con recursos, avances y actividades para fortalecer habilidades digitales,
            financieras y de emprendimiento.
          </p>
        </div>

        <div className="mc-metric-grid" aria-label="Indicadores de cursos">
          <div>
            <span>Ruta sugerida</span>
            <strong>Emprende + Finanzas</strong>
          </div>
          <div>
            <span>Tiempo registrado</span>
            <strong>0 horas</strong>
          </div>
          <div>
            <span>Recursos completados</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="mc-learning-layout">
          <div className="mc-learning-main">
            <div className="mc-toolbar">
              <div className="mc-filter-group">
                <span>Categoría</span>
                <div className="mc-filter-row" aria-label="Filtrar cursos por categoría">
                  {categoriasCursos.map((categoria) => (
                    <button
                      aria-pressed={categoriaCurso === categoria}
                      className={categoriaCurso === categoria ? 'mc-chip mc-chip-active' : 'mc-chip'}
                      key={categoria}
                      onClick={() => setCategoriaCurso(categoria)}
                      type="button"
                    >
                      {categoria}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mc-filter-group">
                <span>Nivel</span>
                <div className="mc-filter-row" aria-label="Filtrar cursos por nivel">
                  {nivelesCursos.map((nivel) => (
                    <button
                      aria-pressed={nivelCurso === nivel}
                      className={nivelCurso === nivel ? 'mc-chip mc-chip-active' : 'mc-chip'}
                      key={nivel}
                      onClick={() => setNivelCurso(nivel)}
                      type="button"
                    >
                      {nivel}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mc-course-grid">
              {cursosFiltrados.map((curso) => (
                <article
                  className={`mc-course-card mc-course-card-${curso.color}`}
                  key={curso.id}
                >
                  <div className="mc-card-meta">
                    <span>{curso.insignia}</span>
                    <span>{curso.modalidad}</span>
                  </div>
                  <h3>{curso.titulo}</h3>
                  <p>{curso.descripcion}</p>

                  <div className="mc-course-facts">
                    <span>{curso.categoria}</span>
                    <span>{curso.nivel}</span>
                    <span>{curso.duracion}</span>
                  </div>

                  <div className="mc-progress-label">
                    <span>{curso.modulos} módulos</span>
                    <strong>{curso.avance}% completado</strong>
                  </div>
                  <div className="mc-progress" aria-label={`Avance del curso ${curso.avance}%`}>
                    <span style={{ width: `${curso.avance}%` }} />
                  </div>

                  <button
                    className="mc-card-button"
                    onClick={() => seleccionarCurso(curso)}
                    type="button"
                  >
                    Ver ruta
                  </button>
                </article>
              ))}
            </div>

            {!cursosFiltrados.length && (
              <div className="mc-empty-state">
                <h3>No hay cursos con esos filtros</h3>
                <p>Prueba con otra categoría o cambia el nivel seleccionado.</p>
              </div>
            )}
          </div>

          <aside className="mc-course-detail" aria-labelledby="curso-detalle-title">
            <span className="mc-mini-label">Ruta seleccionada</span>
            <h3 id="curso-detalle-title">{cursoSeleccionado.titulo}</h3>
            <p>{cursoSeleccionado.objetivo}</p>

            <div className="mc-detail-list">
              <div>
                <span>Instructora</span>
                <strong>{cursoSeleccionado.instructor}</strong>
              </div>
              <div>
                <span>Duración</span>
                <strong>{cursoSeleccionado.duracion}</strong>
              </div>
              <div>
                <span>Formato</span>
                <strong>{cursoSeleccionado.modalidad}</strong>
              </div>
            </div>

            <div className="mc-resource-list" aria-label="Aprendizajes del curso">
              {cursoSeleccionado.aprendizajes.map((aprendizaje) => (
                <span key={aprendizaje}>{aprendizaje}</span>
              ))}
            </div>

            <div className="mc-resource-box">
              <span>Materiales</span>
              <p>{cursoSeleccionado.recursos.join(' · ')}</p>
            </div>

            <button className="mc-submit-button" onClick={inscribirseCurso} type="button">
              Inscribirme
            </button>
            {mensajeCurso && <p className="mc-form-message">{mensajeCurso}</p>}
          </aside>
        </div>
      </section>

      <section
        className="mc-section mc-section-marketplace"
        id="marketplace"
        aria-labelledby="marketplace-title"
      >
        <div className="mc-section-header">
          <span className="mc-kicker">Vinculación comercial</span>
          <h2 id="marketplace-title">Marketplace de emprendedoras</h2>
          <p>
            Un catálogo para publicar, buscar y consultar productos o servicios ofrecidos por
            mujeres emprendedoras.
          </p>
        </div>

        <div className="mc-market-layout">
          <aside className="mc-publish-card" aria-labelledby="publicar-title">
            <span className="mc-mini-label">Publicación rápida</span>
            <h3 id="publicar-title">Sube tu producto o servicio</h3>
            <p>
              Este flujo visual deja lista la experiencia para conectarla después con usuarios,
              imágenes reales y pagos.
            </p>

            <form className="mc-form" onSubmit={publicarProducto}>
              <label>
                Nombre
                <input
                  name="nombre"
                  onChange={actualizarCampo}
                  placeholder="Ej. Pulseras artesanales"
                  type="text"
                  value={formulario.nombre}
                />
              </label>

              <label>
                Categoría
                <select name="categoria" onChange={actualizarCampo} value={formulario.categoria}>
                  {categoriasMarketplace
                    .filter((categoria) => categoria !== 'Todos')
                    .map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                Precio
                <input
                  name="precio"
                  onChange={actualizarCampo}
                  placeholder="Ej. 180 o A cotizar"
                  type="text"
                  value={formulario.precio}
                />
              </label>

              <label>
                Emprendimiento
                <input
                  name="negocio"
                  onChange={actualizarCampo}
                  placeholder="Nombre de tu marca"
                  type="text"
                  value={formulario.negocio}
                />
              </label>

              <label>
                Ciudad o modalidad
                <input
                  name="ciudad"
                  onChange={actualizarCampo}
                  placeholder="Ej. Guadalajara o En línea"
                  type="text"
                  value={formulario.ciudad}
                />
              </label>

              <label>
                Descripción
                <textarea
                  name="descripcion"
                  onChange={actualizarCampo}
                  placeholder="Cuenta qué ofreces y cómo pueden pedirlo"
                  rows="4"
                  value={formulario.descripcion}
                />
              </label>

              <button className="mc-submit-button" type="submit">
                Guardar publicación
              </button>
            </form>

            {mensajeFormulario && <p className="mc-form-message">{mensajeFormulario}</p>}
          </aside>

          <div className="mc-market-content">
            <div className="mc-market-tools">
              <label className="mc-search-label">
                Buscar en marketplace
                <input
                  onChange={(evento) => setBusqueda(evento.target.value)}
                  placeholder="Buscar producto, negocio, ciudad o emprendedora"
                  type="search"
                  value={busqueda}
                />
              </label>

              <label className="mc-select-label">
                Ordenar
                <select
                  onChange={(evento) => setOrdenProducto(evento.target.value)}
                  value={ordenProducto}
                >
                  {opcionesOrden.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                      {opcion.texto}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mc-filter-row" aria-label="Filtrar productos por categoría">
                {categoriasMarketplace.map((categoria) => (
                  <button
                    aria-pressed={categoriaProducto === categoria}
                    className={
                      categoriaProducto === categoria ? 'mc-chip mc-chip-active' : 'mc-chip'
                    }
                    key={categoria}
                    onClick={() => setCategoriaProducto(categoria)}
                    type="button"
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>

            {productoSeleccionado && (
              <article className="mc-featured-product">
                <img
                  alt={`Imagen de ${productoSeleccionado.nombre}`}
                  src={productoSeleccionado.imagen}
                />
                <div>
                  <span className="mc-mini-label">Detalle seleccionado</span>
                  <h3>{productoSeleccionado.nombre}</h3>
                  <p>{productoSeleccionado.descripcion}</p>

                  <div className="mc-featured-meta">
                    <span>{productoSeleccionado.negocio}</span>
                    <span>{productoSeleccionado.ciudad}</span>
                    <span>{productoSeleccionado.entrega}</span>
                  </div>
                </div>
                <div className="mc-featured-action">
                  <span>{productoSeleccionado.etiqueta}</span>
                  <strong>{productoSeleccionado.precio}</strong>
                  <a
                    href={`mailto:contacto@mujeresconpoder.mx?subject=Me interesa ${encodeURIComponent(
                      productoSeleccionado.nombre,
                    )}`}
                  >
                    Contactar
                  </a>
                </div>
              </article>
            )}

            <div className="mc-product-grid" aria-live="polite">
              {productosFiltrados.map((producto) => (
                <article className="mc-product-card" key={producto.id}>
                  <img alt={`Imagen de ${producto.nombre}`} src={producto.imagen} />
                  <div className="mc-product-body">
                    <div className="mc-card-meta">
                      <span>{producto.tipo}</span>
                      <span>{producto.etiqueta}</span>
                    </div>
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                    <div className="mc-product-stats">
                      <span>{producto.rating.toFixed(1)} calificación</span>
                      <span>{producto.ventas} ventas</span>
                    </div>
                    <div className="mc-product-footer">
                      <div>
                        <strong>{producto.precio}</strong>
                        <span>{producto.negocio}</span>
                      </div>
                      <button
                        className="mc-outline-button"
                        onClick={() => setProductoSeleccionado(producto)}
                        type="button"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!productosFiltrados.length && (
              <div className="mc-empty-state">
                <h3>No hay publicaciones registradas</h3>
                <p>El catálogo aparecerá aquí cuando se carguen productos desde la base de datos.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

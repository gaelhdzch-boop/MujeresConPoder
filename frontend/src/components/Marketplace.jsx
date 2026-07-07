import { useState } from 'react';
import { COLORS } from '../constants/colors';
import '../styles/Marketplace.css';

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
  {
    id: 'kits-costura',
    nombre: 'Kits de costura',
    categoria: 'Hogar',
    precio: '$250 MXN',
    ciudad: 'Guadalajara',
    descripcion: 'Kits pequeños para iniciar tus primeros productos textiles.',
  },
];

export default function Marketplace() {
  const [productos] = useState(productosEjemplo);
  const [filtro, setFiltro] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const productosFiltrados = productos.filter((p) => {
    const porCategoria = filtro === 'Todos' || p.categoria === filtro;
    const porBusqueda = !busqueda || p.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return porCategoria && porBusqueda;
  });

  return (
    <section id="marketplace" className="marketplace-page p-5" style={{ backgroundColor: COLORS.lightBg }}>
      <div className="container">
        <div className="market-header text-center mb-4">
          <h2 style={{ color: COLORS.primary }}>Marketplace</h2>
          <p style={{ color: COLORS.mediumPrimary }}>Encuentra productos y servicios creados por mujeres emprendedoras.</p>
        </div>

        <div className="market-controls mb-4 d-flex gap-3 flex-wrap">
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="form-select w-auto">
            <option>Todos</option>
            <option>Moda</option>
            <option>Servicios</option>
            <option>Hogar</option>
          </select>
          <input className="form-control w-50" placeholder="Buscar producto" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
        </div>

        <div className="product-grid">
          {productosFiltrados.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-image placeholder">IMG</div>
              <div className="product-body">
                <h3>{p.nombre}</h3>
                <p className="text-muted small">{p.categoria} • {p.ciudad}</p>
                <p className="product-desc">{p.descripcion}</p>
                <div className="product-footer d-flex justify-content-between align-items-center">
                  <strong className="product-price">{p.precio}</strong>
                  <button className="btn btn-sm btn-primary" style={{ backgroundColor: COLORS.primary, border: 'none' }}>Comprar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

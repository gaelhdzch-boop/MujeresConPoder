import { useState, useEffect } from 'react';
import '../styles/Finanzas.css';

const Finanzas = () => {
  const fechaActual = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const tituloMes = fechaActual.charAt(0).toUpperCase() + fechaActual.slice(1);

  const [movimientos, setMovimientos] = useState(() => {
    const guardados = localStorage.getItem('mis-finanzas');
    return guardados ? JSON.parse(guardados) : [];
  });
  
  const [vista, setVista] = useState('Todo');
  const [nuevo, setNuevo] = useState({ concepto: '', monto: '', tipo: 'ingreso', cuenta: 'Negocio', id: null });
  const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

  useEffect(() => {
    localStorage.setItem('mis-finanzas', JSON.stringify(movimientos));
  }, [movimientos]);

  const guardarMovimiento = (e) => {
    e.preventDefault();
    if (!nuevo.concepto || !nuevo.monto) return;
    if (nuevo.id) {
      setMovimientos(movimientos.map(m => m.id === nuevo.id ? { ...nuevo, fecha: m.fecha } : m));
    } else {
      setMovimientos([...movimientos, { ...nuevo, id: Date.now(), fecha: new Date().toLocaleDateString() }]);
    }
    setNuevo({ concepto: '', monto: '', tipo: 'ingreso', cuenta: 'Negocio', id: null });
    setMostrandoFormulario(false);
  };

  const eliminarMovimiento = (id) => setMovimientos(movimientos.filter(m => m.id !== id));
  const prepararEdicion = (m) => { setNuevo(m); setMostrandoFormulario(true); };

  // Cálculos dinámicos
  const totalIngresos = movimientos.filter(m => (vista === 'Todo' || m.cuenta === vista) && m.tipo === 'ingreso').reduce((acc, m) => acc + parseFloat(m.monto || 0), 0);
  const totalGastos = movimientos.filter(m => (vista === 'Todo' || m.cuenta === vista) && m.tipo === 'gasto').reduce((acc, m) => acc + parseFloat(m.monto || 0), 0);
  const balance = totalIngresos - totalGastos;
  const movimientosFiltrados = movimientos.filter(m => vista === 'Todo' || m.cuenta === vista);

  return (
    <div className="container mt-5 finanzas-container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <h2 className="fw-bold text-center text-md-start">Mi Presupuesto - {tituloMes}</h2>
        
        <div className="btn-group shadow-sm border-rosa">
          {['Todo', 'Negocio', 'Personal'].map(v => (
            <button key={v} className={`btn ${vista === v ? 'btn-activo' : 'btn-inactivo'}`} onClick={() => setVista(v)}>{v}</button>
          ))}
        </div>

        <button className="btn text-white px-4 bg-rosa" onClick={() => setMostrandoFormulario(!mostrandoFormulario)}>+ Registrar</button>
      </div>

      {mostrandoFormulario && (
        <form onSubmit={guardarMovimiento} className="card p-3 mb-4 d-flex flex-column flex-md-row gap-2 formulario-rosa">
          <input className="form-control" placeholder="Concepto" value={nuevo.concepto} onChange={e => setNuevo({...nuevo, concepto: e.target.value})} />
          <input type="number" className="form-control" placeholder="Monto" value={nuevo.monto} onChange={e => setNuevo({...nuevo, monto: e.target.value})} />
          <select className="form-select" value={nuevo.tipo} onChange={e => setNuevo({...nuevo, tipo: e.target.value})}>
            <option value="ingreso">Ingreso</option>
            <option value="gasto">Gasto</option>
          </select>
          <select className="form-select" value={nuevo.cuenta} onChange={e => setNuevo({...nuevo, cuenta: e.target.value})}>
            <option value="Negocio">Negocio</option>
            <option value="Personal">Personal</option>
          </select>
          <button type="submit" className="btn text-white px-4 bg-rosa">Guardar</button>
        </form>
      )}

      <div className="row">
        <div className="col-12 col-md-8">
          {/* Tarjeta de Balance Mejorada */}
          <div className="card-balance">
            <p className="m-0">BALANCE DEL MES</p>
            <h1 className="fw-bold m-0">${balance.toLocaleString()}</h1>
            <p className="m-0 mb-3">MXN - Ahorro neto</p>
            
            <div className="row">
              <div className="col-6">
                <div className="p-2 rounded bg-white bg-opacity-25">
                  <small className="d-block">Ingresos</small>
                  <span className="fw-bold">${totalIngresos.toLocaleString()}</span>
                </div>
              </div>
              <div className="col-6">
                <div className="p-2 rounded bg-white bg-opacity-25">
                  <small className="d-block">Gastos</small>
                  <span className="fw-bold">${totalGastos.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <table className="table bg-white shadow-sm tabla-radius">
            <tbody>
              {movimientosFiltrados.length > 0 ? (
                movimientosFiltrados.map(m => (
                  <tr key={m.id}>
                    <td>{m.concepto} <br/> <small className="text-muted">{m.fecha}</small></td>
                    <td className="text-end fw-bold">{m.tipo === 'ingreso' ? '+' : '-'}${parseFloat(m.monto).toLocaleString()}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-primary mx-1" onClick={() => prepararEdicion(m)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarMovimiento(m.id)}>Borrar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center py-4 text-muted">No hay movimientos.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="col-12 col-md-4 mt-4 mt-md-0">
          <div className="card p-4 card-recomendacion">
            <h6 className="fw-bold">Recomendación</h6>
            <p className="small">
              {balance === 0 
                ? "Aún no tienes movimientos registrados." 
                : (totalGastos > (totalIngresos * 0.5) 
                    ? "Tus gastos superan el 50% de tus ingresos. ¡Cuidado!" 
                    : "Tu presupuesto es saludable.")
              }
            </p>
            <hr />
            <h6 className="fw-bold"> Recursos sugeridos</h6>
            <ul className="list-unstyled mb-0">
              <li className="mb-2"><a href="#" className="text-decoration-none text-dark">Cómo armar un presupuesto</a></li>
              <li className="mb-2"><a href="#" className="text-decoration-none text-dark">Ahorro para emprendedoras</a></li>
              <li><a href="#" className="text-decoration-none text-dark">Diferencia entre flujo y utilidad</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finanzas;
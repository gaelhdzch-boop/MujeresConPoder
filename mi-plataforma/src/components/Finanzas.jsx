import { useMemo, useState } from 'react';
import { COLORS } from '../constants/colors';
import '../styles/Finanzas.css';  

const initialMovements = [];

const categories = ['Ingresos', 'Gastos'];

export default function Finanzas() {
  const [movements, setMovements] = useState(initialMovements);
  const [form, setForm] = useState({ concepto: '', categoria: 'Ingresos', monto: '' });
  const [costo, setCosto] = useState('');
  const [margen, setMargen] = useState(20);
  const [message, setMessage] = useState('');

  const summary = useMemo(() => {
    const ingresos = movements
      .filter((m) => m.categoria === 'Ingresos')
      .reduce((sum, m) => sum + m.monto, 0);
    const gastos = movements
      .filter((m) => m.categoria === 'Gastos')
      .reduce((sum, m) => sum + m.monto, 0);
    return {
      ingresos,
      gastos,
      utilidad: ingresos - gastos,
      porcentaje: ingresos ? Math.min(Math.round((gastos / ingresos) * 100), 100) : 0,
    };
  }, [movements]);

  const precioSugerido = useMemo(() => {
    const costoNumero = Number(costo) || 0;
    const margenNumero = Number(margen) || 0;
    return costoNumero + costoNumero * (margenNumero / 100);
  }, [costo, margen]);

  const formatMoney = (value) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addMovement = (event) => {
    event.preventDefault();
    const monto = Number(form.monto);
    if (!form.concepto.trim() || !monto || monto <= 0) {
      setMessage('Completa todos los campos con valores válidos.');
      return;
    }

    setMovements((prev) => [
      {
        id: Date.now(),
        concepto: form.concepto.trim(),
        categoria: form.categoria,
        monto,
        fecha: new Date().toLocaleDateString('es-ES'),
      },
      ...prev,
    ]);
    setForm({ concepto: '', categoria: 'Ingresos', monto: '' });
    setMessage('Movimiento registrado exitosamente.');
  };

  return (
    <section id="finanzas" className="finanzas-section">
      <div className="finanzas-header text-center">
        <span className="finanzas-kicker">Finanzas</span>
        <h2>Controla tu dinero con claridad</h2>
        <p>
          Maneja ingresos, gastos y precios desde una vista simple, clara y con el estilo de tu plataforma.
        </p>
      </div>

      <div className="finanzas-summary">
        <article className="finanzas-card">
          <span>Ingresos</span>
          <strong>{formatMoney(summary.ingresos)}</strong>
        </article>
        <article className="finanzas-card">
          <span>Gastos</span>
          <strong>{formatMoney(summary.gastos)}</strong>
        </article>
        <article className="finanzas-card">
          <span>Utilidad</span>
          <strong>{formatMoney(summary.utilidad)}</strong>
        </article>
      </div>

      <div className="finanzas-layout">
        <div className="finanzas-main">
          <article className="finanzas-panel">
            <div className="finanzas-panel-header">
              <div>
                <span>Balance mensual</span>
                <h3>Gastos vs ingresos</h3>
              </div>
              <strong>{summary.porcentaje}%</strong>
            </div>
            <div className="finanzas-progress">
              <span style={{ width: `${summary.porcentaje}%`, backgroundColor: COLORS.primary }} />
            </div>
            <p>Visualiza cuánto representan tus gastos del total de ingresos registrados.</p>
          </article>

          <article className="finanzas-panel">
            <div className="finanzas-panel-header">
              <div>
                <span>Movimientos recientes</span>
                <h3>Últimos registros</h3>
              </div>
              <strong>{movements.length}</strong>
            </div>

            <div className="finanzas-table">
              {movements.length ? (
                movements.slice(0, 6).map((movement) => (
                  <div key={movement.id} className="finanzas-row">
                    <div>
                      <strong>{movement.concepto}</strong>
                      <small>{movement.fecha}</small>
                    </div>
                    <span className={movement.categoria === 'Ingresos' ? 'tag-income' : 'tag-expense'}>
                      {movement.categoria}
                    </span>
                    <strong>{formatMoney(movement.monto)}</strong>
                  </div>
                ))
              ) : (
                <div className="finanzas-empty">
                  <strong>No hay movimientos</strong>
                  <span>Agrega tus primeros ingresos o gastos para ver el resumen.</span>
                </div>
              )}
            </div>
          </article>
        </div>

        <aside className="finanzas-side">
          <article className="finanzas-panel">
            <div className="finanzas-panel-header">
              <div>
                <span>Nuevo movimiento</span>
                <h3>Registra tu flujo</h3>
              </div>
            </div>
            <form className="finanzas-form" onSubmit={addMovement}>
              <label>
                Concepto
                <input
                  name="concepto"
                  value={form.concepto}
                  onChange={handleChange}
                  placeholder="Ej. Venta de productos"
                />
              </label>
              <label>
                Categoría
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Monto
                <input
                  type="number"
                  min="1"
                  name="monto"
                  value={form.monto}
                  onChange={handleChange}
                  placeholder="Ej. 1200"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Agregar movimiento
              </button>
            </form>
            {message && <p className="finanzas-alert">{message}</p>}
          </article>

          <article className="finanzas-panel">
            <div className="finanzas-panel-header">
              <div>
                <span>Calculadora de precio</span>
                <h3>Define tu costo</h3>
              </div>
            </div>
            <div className="finanzas-calculator">
              <label>
                Costo por producto
                <input
                  type="number"
                  min="0"
                  value={costo}
                  onChange={(event) => setCosto(event.target.value)}
                  placeholder="Ej. 180"
                />
              </label>
              <label className="range-label">
                Margen deseado <strong>{margen}%</strong>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={margen}
                  onChange={(event) => setMargen(event.target.value)}
                />
              </label>
              <div className="finanzas-price-result">
                <span>Precio sugerido</span>
                <strong>{formatMoney(precioSugerido)}</strong>
              </div>
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}

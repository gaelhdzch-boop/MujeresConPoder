export const SessionClosed = ({ onReturnHome }) => {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Sesión cerrada</h1>
        <p>Has cerrado sesión correctamente.</p>
        <button
          onClick={onReturnHome}
          style={{
            marginTop: '1rem',
            background: '#0d6efd',
            color: '#fff',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default SessionClosed;

import './BarraSuperior.css';

const enlaces = [
  { texto: 'Cursos', href: '#cursos' },
  { texto: 'Marketplace', href: '#marketplace' },
  { texto: 'Oportunidades', href: '#oportunidades' },
  { texto: 'Finanzas', href: '#finanzas' },
];

export default function BarraSuperior() {
  const abrirEnNuevaPestana = (evento, href) => {
    evento.preventDefault();

    const url = new URL(window.location.href);
    url.hash = href;
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="barra-superior">
      <nav className="barra-superior__contenido" aria-label="Navegacion principal">
        <a className="barra-superior__logo" href="#inicio">
          Logo
        </a>

        <div className="barra-superior__enlaces">
          {enlaces.map((enlace) => (
            <a
              aria-label={`Abrir ${enlace.texto} en una nueva pestaña`}
              href={enlace.href}
              key={enlace.href}
              onClick={(evento) => abrirEnNuevaPestana(evento, enlace.href)}
              rel="noreferrer"
              target="_blank"
            >
              {enlace.texto}
            </a>
          ))}
        </div>

        <div className="barra-superior__acciones">
          <a className="barra-superior__entrar" href="#entrar">
            Entrar
          </a>
          <a className="barra-superior__crear" href="#crear-cuenta">
            Crear cuenta
          </a>
        </div>
      </nav>
    </header>
  );
}

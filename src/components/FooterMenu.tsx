import React from 'react';

export default function FooterMenu() {
  return (
    <div className="border-t-2 pt-5 border-gray-200">
      <div className="flex gap-2">
        <div>
          <a href="https://www.facebook.com/sanmartingt" target="_blank" rel="noopener noreferrer">
            <img src="/btn-facebook.svg" alt="Facebook" />
          </a>
        </div>
        <div>
          <a href="https://www.instagram.com/sanmartingt/" target="_blank" rel="noopener noreferrer">
            <img src="/btn-instagram.svg" alt="Instagram" />
          </a>
        </div>
      </div>
      <div className="pt-5 pb-3 text-sm">
        <div className="sm:flex hidden gap-4 text-sm text-gray-500">
          <div>
            <a href="/#PuntoReunion">Punto de reunión</a>
          </div>
          <div>
            <a href="/#BeneficioDe">A beneficio de</a>
          </div>
          <div>
            <a href="/#CanalesDeVenta">Canales de venta</a>
          </div>
        </div>
      </div>
      <div className="pb-20 text-xs text-gray-400">
        2024 San Martín Bakery. todos los derechos reservados.
      </div>
    </div>
  );
}

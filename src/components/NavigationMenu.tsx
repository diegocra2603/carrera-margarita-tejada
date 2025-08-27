import React from 'react';

export default function NavigationMenu() {
  return (
    <div className="bg-[#F5D72C]">
      <div className="container mx-auto px-5 sm:pt-3 pb-3">
        <div className="sm:flex gap-4 rtl hidden">
          <div className="">
            <a href="/#PuntoReunion">Punto de reunión</a>
          </div>
          <div className="border-s-2 pl-4 border-gray-950">
            <a href="/#BeneficioDe">A beneficio de</a>
          </div>
          <div className="border-s-2 pl-4 border-gray-950">
            <a href="/#CanalesDeVenta">Canales de venta</a>
          </div>
        </div>
      </div>
    </div>
  );
}

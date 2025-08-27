import React from 'react';

export default function DistanciaCompra() {
  return (
    <div className="pt-10">
      <div className="text-2xl font-bold font-azul">
        Comprar
      </div>
      <div className="text-xl">
        Quieres comprar tu Ticket digital presiona comprar ahora
      </div>
      <div className="grid sm:grid-cols-4 grid-cols-2 sm:gap-5 gap-3 pt-10 pb-10">
        <div id="Comprar" className="bannerPrecio bg-cover bg-center" data-aos="flip-left" data-aos-duration="1000">
          <a>
            <div className="relative sm:h-full sm:w-full h-[120px]">
              <div className="absolute w-full h-[84%] flex justify-center items-center">
                <div>
                  <div className="font-amarillo sm:text-md text-xs">Valor</div>
                  <div className="sm:text-3xl text-2xl font-bold text-white">
                    Q125
                  </div>
                </div>
              </div>
              <div className="bg-[#F5D72C] absolute z-10 bottom-0 w-full text-center font-bold font-azul pt-1 pb-1 sm:text-xl text-xs">
                Comprar ahora
              </div>
            </div>
          </a>
        </div>

        <div className="bannerDistancia bg-cover bg-center sm:col-span-3">
          <div className="flex pt-10 pb-10">
            <div className="sm:w-[340px] w-[100px] mx-auto" data-aos="zoom-in" data-aos-duration="500">
              <img className="w-full" src="/distancia-trans.png" alt="Distancia" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

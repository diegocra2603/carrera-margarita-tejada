import React from 'react';

export default function RegistraTicket() {
  return (
    <div className="pt-10 pb-10">
      <div id="btnRegistro" className="bannerDistancia bg-cover bg-center sm:col-span-3">
        <div className="flex pt-10 pb-10">
          <div className="mx-auto text-center" data-aos="zoom-in" data-aos-duration="500">
            <a 
              href="/registro-ticket" 
              className="bg-yellow-400 border-2 border-yellow-400 text-black font-bold py-4 px-8 rounded-lg text-xl hover:bg-transparent hover:text-white hover:border hover:border-2 hover:border-yellow-400 transition duration-300 ease-in-out"
            >
              REGISTRA TU TICKET
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

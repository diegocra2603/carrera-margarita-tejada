import React from 'react';

export default function MenuHeader() {
  return (
    <div className="bg-[#003B7A]">
      <div className="container mx-auto px-5 pt-5 pb-5">
        <div className="grid grid-cols-4">
          <div className="col-span-3">
            <div className="sm:w-[166px] w-[140px]">
              <a href="/">
                <img className="w-full" src="/logo-completo.svg" alt="Logo San Martín" />
              </a>
            </div>
          </div>
          
          <div className="flex justify-end items-center gap-6">
            <div className="sm:w-[100px] w-[60px]">
              <a href="/compra" className="bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full text-sm hover:bg-transparent hover:text-yellow-500 hover:border hover:border-yellow-500 transition duration-300 ease-in-out">
                COMPRAR
              </a>
            </div>
            <div className="sm:w-[100px] w-[60px]">
              <a href="#" className="bg-yellow-500 text-blue-900 font-bold py-2 px-6 rounded-full text-sm hover:bg-transparent hover:text-yellow-500 hover:border hover:border-yellow-500 transition duration-300 ease-in-out">
                REGISTRARSE
              </a>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
}

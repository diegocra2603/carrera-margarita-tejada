import React from 'react';
import MenuButton from './MenuButton';

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
            <MenuButton href="/compra" variant="primary">
              COMPRAR
            </MenuButton>
            <MenuButton href="#" variant="primary">
              REGISTRARSE
            </MenuButton>
          </div>
         
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function BannerInicio() {
  return (
    <div className="bannerInicio bg-cover overflow-hidden">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-2 gap-5">
          <div className="flex items-center">
            <motion.div 
              className="logo-carrera"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img className="w-full" src="/logo-carrera.svg" alt="Logo Carrera" />
            </motion.div>
          </div>
          <div>
            <motion.div 
              className="ninos"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              {/* Imagen principal */}
              <img 
                className="w-full transform transition-transform duration-700 hover:scale-105" 
                src="/ninos-banner.png" 
                alt="Niños" 
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

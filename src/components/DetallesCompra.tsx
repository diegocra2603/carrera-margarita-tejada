import React from 'react';
import { motion } from 'framer-motion';

interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  distancia: string;
  fechaNacimiento: string;
  ipu: string;
}

interface DetallesCompraProps {
  participantes: Participante[];
  total: number;
}

export default function DetallesCompra({ participantes, total }: DetallesCompraProps) {
  // Obtener precio por distancia
  const obtenerPrecio = (distancia: string) => {
    switch (distancia) {
      case '5K': return 100;
      case '10K': return 180;
      default: return 0;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Detalle de la Compra
      </h2>
      
      <div className="space-y-4">
        {participantes.map((participante, index) => (
          <motion.div
            key={participante.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">
                Participante {participante.id}
              </h3>
              <span className="text-sm text-gray-500">
                Q{obtenerPrecio(participante.distancia)}
              </span>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Nombre:</strong> {participante.nombre} {participante.apellido}</p>
              <p><strong>Distancia:</strong> {participante.distancia}</p>
              <p><strong>Fecha de nacimiento:</strong> {new Date(participante.fechaNacimiento).toLocaleDateString('es-GT')}</p>
              {participante.ipu && (
                <p><strong>IPU:</strong> {participante.ipu}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen de totales */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>Q{total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Comisión de servicio:</span>
            <span>Q0.00</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <span className="text-blue-600">Q{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

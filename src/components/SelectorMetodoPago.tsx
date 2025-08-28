import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface SelectorMetodoPagoProps {
  metodoSeleccionado: string;
  onMetodoChange: (metodo: string) => void;
}

export default function SelectorMetodoPago({ metodoSeleccionado, onMetodoChange }: SelectorMetodoPagoProps) {
  return (
    <div className="mb-6">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
        Selecciona tu método de pago
      </Typography>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Tarjeta de Crédito */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            onClick={() => onMetodoChange('tarjeta')}
            sx={{
              cursor: 'pointer',
              border: metodoSeleccionado === 'tarjeta' ? '2px solid #003B7A' : '2px solid transparent',
              backgroundColor: metodoSeleccionado === 'tarjeta' ? '#f0f8ff' : 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#003B7A',
                backgroundColor: '#f0f8ff'
              }
            }}
          >
            <CardContent className="text-center p-4">
              <div className="text-4xl mb-2">💳</div>
              <Typography variant="h6" fontWeight="bold" color="#003B7A">
                Tarjeta de Crédito
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Paga con tu tarjeta de crédito o débito
              </Typography>
            </CardContent>
          </Card>
        </motion.div>

        {/* Zigi */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            onClick={() => onMetodoChange('zigi')}
            sx={{
              cursor: 'pointer',
              border: metodoSeleccionado === 'zigi' ? '2px solid #003B7A' : '2px solid transparent',
              backgroundColor: metodoSeleccionado === 'zigi' ? '#f0f8ff' : 'white',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#003B7A',
                backgroundColor: '#f0f8ff'
              }
            }}
          >
            <CardContent className="text-center p-4">
              <div className="mb-2">
                <img 
                  src="/zigi.png" 
                  alt="Zigi" 
                  className="w-12 h-12 mx-auto object-contain"
                />
              </div>
              <Typography variant="h6" fontWeight="bold" color="#003B7A">
                Zigi
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Paga con Zigi de forma rápida y segura
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

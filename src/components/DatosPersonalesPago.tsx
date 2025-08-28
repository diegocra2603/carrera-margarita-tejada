import React from 'react';
import { TextField, Typography } from '@mui/material';

interface DatosPersonalesPagoProps {
  datosPago: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  onInputChange: (campo: string, valor: string) => void;
}

export default function DatosPersonalesPago({ datosPago, onInputChange }: DatosPersonalesPagoProps) {
  return (
    <div className="space-y-4">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        Información personal
      </Typography>
      
      <TextField
        label="Nombre completo"
        value={datosPago.nombre}
        onChange={(e) => onInputChange('nombre', e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Tu nombre completo"
        required
      />

      <TextField
        label="Correo electrónico"
        type="email"
        value={datosPago.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="tu@email.com"
        required
      />

      <TextField
        label="Teléfono"
        type="tel"
        value={datosPago.telefono}
        onChange={(e) => onInputChange('telefono', e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="12345678"
        inputProps={{ maxLength: 8 }}
        required
      />

      <TextField
        label="Dirección"
        value={datosPago.direccion}
        onChange={(e) => onInputChange('direccion', e.target.value)}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="Tu dirección completa"
        required
      />
    </div>
  );
}

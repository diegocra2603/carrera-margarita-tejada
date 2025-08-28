import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Box, ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import DatosPersonalesPago from './DatosPersonalesPago';
import InformacionTarjeta from './InformacionTarjeta';
import DetallesCompra from './DetallesCompra';

// Configurar dayjs para usar español
dayjs.locale('es');

// Crear tema personalizado con el color corporativo
const theme = createTheme({
  palette: {
    primary: {
      main: '#003B7A',
      light: '#1a4a8a',
      dark: '#002a5a',
      contrastText: '#ffffff',
    },
  },
});

interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  distancia: string;
  fechaNacimiento: string;
  ipu: string;
}

interface DatosCompra {
  participantes: Participante[];
  total: number;
  cantidad: number;
}

export default function FormularioPago() {
  const [datosCompra, setDatosCompra] = useState<DatosCompra | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [datosPago, setDatosPago] = useState({
    telefono: '',
    direccion: '',
    nombre: '',
    email: ''
  });

  useEffect(() => {
    // Cargar datos de la compra desde sessionStorage
    const datosGuardados = sessionStorage.getItem('datosCompra');
    if (datosGuardados) {
      try {
        const datos = JSON.parse(datosGuardados);
        setDatosCompra(datos);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos de compra:', error);
        // Redirigir a compra si hay error en los datos
        window.location.href = '/compra';
      }
    } else {
      // Redirigir a compra si no hay datos
      window.location.href = '/compra';
    }
  }, []);

  const handleInputChange = (campo: string, valor: string) => {
    setDatosPago(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // Validar formulario
  const validarFormulario = () => {
    return (
      datosPago.nombre.trim() !== '' &&
      datosPago.email.trim() !== '' &&
      datosPago.telefono.trim() !== '' &&
      datosPago.direccion.trim() !== '' &&
      cardNumber.replace(/\s/g, '').length >= 13 &&
      cardName.trim() !== '' &&
      cardExpiry.length === 5 &&
      cardCvv.length >= 3
    );
  };

  const handlePagar = async () => {
    if (!validarFormulario()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpiar sesión
      sessionStorage.removeItem('datosCompra');
      
      alert('¡Pago procesado exitosamente!');
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de compra...</p>
        </div>
      </div>
    );
  }

  if (!datosCompra) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se encontraron datos de compra</p>
          <button 
            onClick={() => window.location.href = '/compra'}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ir a compra
          </button>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Componente de detalles de compra */}
              <DetallesCompra 
                participantes={datosCompra.participantes}
                total={datosCompra.total}
              />

              {/* Formulario de pago */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información de Pago
                </h2>
                
                <div className="space-y-4">
                  {/* Componente de datos personales */}
                  <DatosPersonalesPago 
                    datosPago={datosPago}
                    onInputChange={handleInputChange}
                  />

                  {/* Componente de información de tarjeta */}
                  <InformacionTarjeta
                    cardNumber={cardNumber}
                    cardName={cardName}
                    cardExpiry={cardExpiry}
                    cardCvv={cardCvv}
                    onCardNumberChange={setCardNumber}
                    onCardNameChange={setCardName}
                    onCardExpiryChange={setCardExpiry}
                    onCardCvvChange={setCardCvv}
                  />
                </div>

                {/* Botón de pago */}
                <Box sx={{ mt: 5, pt: 4, borderTop: '2px solid', borderColor: 'divider' }}>
                  <Button
                    variant="contained"
                    disabled={isSubmitting || !validarFormulario()}
                    size="large"
                    fullWidth
                    onClick={handlePagar}
                    sx={{ 
                      py: 2, 
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {isSubmitting ? 'Procesando...' : `Confirmar y pagar Q${datosCompra.total}`}
                  </Button>
                </Box>

                {/* Información adicional */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-600">
                    Al completar el pago, recibirás un correo de confirmación con los detalles de tu compra.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

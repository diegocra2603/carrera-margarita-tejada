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
import SelectorMetodoPago from './SelectorMetodoPago';


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
  const [metodoPago, setMetodoPago] = useState('tarjeta');

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

  // Validar formulario según el método de pago
  const validarFormulario = () => {
    const datosPersonalesValidos = (
      datosPago.nombre.trim() !== '' &&
      datosPago.email.trim() !== '' &&
      datosPago.telefono.trim() !== '' &&
      datosPago.direccion.trim() !== ''
    );

    if (metodoPago === 'tarjeta') {
      return datosPersonalesValidos &&
        cardNumber.replace(/\s/g, '').length >= 13 &&
        cardName.trim() !== '' &&
        cardExpiry.length === 5 &&
        cardCvv.length >= 3;
    } else {
      // Para Zigi solo necesitamos datos personales
      return datosPersonalesValidos;
    }
  };

  // Generar link de pago para Zigi
  const generarLinkZigi = () => {
    // Aquí podrías integrar con la API real de Zigi
    // Por ahora generamos un link de ejemplo
    const linkBase = 'https://zigi.com.gt/pay';
    const parametros = new URLSearchParams({
      amount: datosCompra?.total.toString() || '0',
      reference: `carrera-${Date.now()}`,
      description: 'Carrera Margarita Tejada',
      email: datosPago.email,
      name: datosPago.nombre
    });
    
    return `${linkBase}?${parametros.toString()}`;
  };

  const handlePagar = async () => {
    if (!validarFormulario()) {
      alert('Por favor completa todos los campos correctamente');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Estructurar datos según el formato requerido
      const datosEnviar = {
        quantity: datosCompra?.cantidad || 0,
        participants: datosCompra?.participantes.map(participante => ({
          firstName: participante.nombre,
          lastName: participante.apellido,
          distance: participante.distancia,
          birthDate: new Date(participante.fechaNacimiento).toISOString(),
          ipu: participante.ipu || ""
        })) || [],
        purchaseData: {
          firstName: datosPago.nombre.split(' ')[0] || datosPago.nombre,
          lastName: datosPago.nombre.split(' ').slice(1).join(' ') || "",
          email: datosPago.email,
          address: datosPago.direccion
        },
        paymentMethod: metodoPago === 'tarjeta' ? 1 : 2,
        cardData: metodoPago === 'tarjeta' ? {
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryMonth: cardExpiry.split('/')[0] || "",
          expiryYear: cardExpiry.split('/')[1] || "",
          cvv: cardCvv,
          cardholderName: cardName
        } : undefined
      };

   
      console.log("datosEnviar", datosEnviar);

      // Enviar datos a la API
      console.log('\n=== ENVIANDO A LA API ===');
      const response = await fetch('http://localhost:7227/api/v1/productcarrera/register-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosEnviar)
      });

      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('Respuesta de la API:', responseData);

      if (metodoPago === 'zigi') {
        // Para Zigi, redirigir a la página de confirmación
        if (responseData.success && responseData.paymentUrl) {
          // Guardar el link de pago en sessionStorage para la página de confirmación
          sessionStorage.setItem('zigiPaymentUrl', responseData.paymentUrl);
          sessionStorage.setItem('zigiPaymentData', JSON.stringify(responseData));
          window.location.href = '/confirmacion';
          return;
        } else {
          throw new Error('No se pudo generar el link de pago con Zigi');
        }
      }

      // Para tarjeta de crédito, procesar respuesta exitosa
      if (responseData.success) {
        // Limpiar sesión
        sessionStorage.removeItem('datosCompra');
        
        alert('¡Pago procesado exitosamente!');
        window.location.href = '/';
      } else {
        throw new Error(responseData.message || 'Error en el procesamiento del pago');
      }
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al procesar el pago: ${errorMessage}. Intenta nuevamente.`);
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

                  {/* Selector de método de pago */}
                  <SelectorMetodoPago
                    metodoSeleccionado={metodoPago}
                    onMetodoChange={setMetodoPago}
                  />

                  {/* Componente de información de tarjeta - solo si se selecciona tarjeta */}
                  {metodoPago === 'tarjeta' && (
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
                  )}

                  {/* Información de Zigi - solo si se selecciona Zigi */}
                  {metodoPago === 'zigi' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="text-center">
                        <img 
                          src="/zigi.png" 
                          alt="Zigi" 
                          className="w-12 h-12 mx-auto mb-3"
                        />
                        <p className="text-blue-800 mb-3">
                          Al hacer clic en "Generar Link de Pago" se creará tu enlace de pago con Zigi
                        </p>
                      </div>
                    </motion.div>
                  )}
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
                    {isSubmitting ? 'Procesando...' : 
                     metodoPago === 'zigi' ? 'Generar Link de Pago' : 
                     `Confirmar y pagar Q${datosCompra.total}`}
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

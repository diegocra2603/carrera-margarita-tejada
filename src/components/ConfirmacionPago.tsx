import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Box, Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material';
import QRCode from 'react-qr-code';

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

export default function ConfirmacionPago() {
  const [datosCompra, setDatosCompra] = useState<DatosCompra | null>(null);
  const [zigiPaymentUrl, setZigiPaymentUrl] = useState<string>('');
  const [zigiPaymentData, setZigiPaymentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de la compra y pago desde sessionStorage
    const datosGuardados = sessionStorage.getItem('datosCompra');
    const paymentUrl = sessionStorage.getItem('zigiPaymentUrl');
    const paymentData = sessionStorage.getItem('zigiPaymentData');

    if (datosGuardados && paymentUrl) {
      try {
        setDatosCompra(JSON.parse(datosGuardados));
        setZigiPaymentUrl(paymentUrl);
        if (paymentData) {
          setZigiPaymentData(JSON.parse(paymentData));
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        window.location.href = '/compra';
      }
    } else {
      // Redirigir a compra si no hay datos
      window.location.href = '/compra';
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(zigiPaymentUrl);
    alert('Link copiado al portapapeles');
  };

  const handleOpenLink = () => {
    window.open(zigiPaymentUrl, '_blank');
  };

  const handleFinalizarCompra = () => {
    // Limpiar todos los datos de sesión
    sessionStorage.removeItem('datosCompra');
    sessionStorage.removeItem('zigiPaymentUrl');
    sessionStorage.removeItem('zigiPaymentData');
    
    alert('¡Gracias por tu compra! Recibirás una confirmación por correo electrónico.');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  if (!datosCompra || !zigiPaymentUrl) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No se encontraron datos de pago</p>
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
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mensaje de éxito */}
        <Alert severity="success" className="mb-6">
          <AlertTitle>¡Compra Registrada Exitosamente!</AlertTitle>
          <p className="mt-2">
            Tu compra ha sido registrada y está pendiente de pago. 
            Una vez que completes el pago, recibirás una confirmación por correo electrónico.
          </p>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detalles de la compra */}
          <Card className="h-fit">
            <CardContent>
              <Typography variant="h6" className="mb-4 font-bold text-gray-900">
                Detalle de la Compra
              </Typography>
              
              <div className="space-y-4">
                {datosCompra.participantes.map((participante, index) => (
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
                        Q{participante.distancia === '5K' ? 100 : 180}
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

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">Q{datosCompra.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pago con Zigi */}
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-bold text-gray-900">
                Pago con Zigi
              </Typography>
              
              <div className="text-center space-y-4">
                <img 
                  src="/zigi.png" 
                  alt="Zigi" 
                  className="w-16 h-16 mx-auto"
                />
                
                <Typography variant="body1" className="text-gray-700">
                  Escanea el código QR para completar tu pago de forma segura
                </Typography>

                {/* Código QR */}
                <Box className="flex justify-center p-4 bg-white border border-gray-200 rounded-lg">
                  <QRCode
                    value={zigiPaymentUrl}
                    size={200}
                    level="H"
                    fgColor="#003B7A"
                    bgColor="white"
                  />
                </Box>

                {/* Enlace */}
                <div className="space-y-2">
                  <Typography variant="body2" className="text-gray-600">
                    O copia este enlace:
                  </Typography>
                  <Box className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Typography 
                      variant="body2" 
                      className="font-mono text-sm break-all text-gray-700"
                    >
                      {zigiPaymentUrl}
                    </Typography>
                  </Box>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outlined"
                    onClick={handleCopyLink}
                    sx={{
                      borderColor: '#003B7A',
                      color: '#003B7A',
                      '&:hover': {
                        borderColor: '#002a5a',
                        backgroundColor: '#f0f8ff'
                      }
                    }}
                  >
                    Copiar Enlace
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleOpenLink}
                    sx={{
                      bgcolor: '#003B7A',
                      '&:hover': {
                        bgcolor: '#002a5a'
                      }
                    }}
                  >
                    Abrir Enlace
                  </Button>
                </div>

                <Typography variant="caption" className="text-gray-500 block mt-4">
                  Una vez completado el pago, recibirás una confirmación por correo electrónico.
                </Typography>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón para finalizar */}
        <Box className="mt-8 text-center">
          <Button
            variant="contained"
            size="large"
            onClick={handleFinalizarCompra}
            sx={{
              bgcolor: '#003B7A',
              py: 2,
              px: 4,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#002a5a'
              }
            }}
          >
            Finalizar Compra
          </Button>
        </Box>
      </motion.div>
    </div>
  );
}

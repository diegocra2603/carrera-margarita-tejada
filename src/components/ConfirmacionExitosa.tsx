import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button, Box, Card, CardContent, Typography, Alert, AlertTitle } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import ReceiptIcon from '@mui/icons-material/Receipt';

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

export default function ConfirmacionExitosa() {
  const [datosCompra, setDatosCompra] = useState<DatosCompra | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar datos de la compra desde sessionStorage
    const datosGuardados = sessionStorage.getItem('datosCompra');

    if (datosGuardados) {
      try {
        setDatosCompra(JSON.parse(datosGuardados));
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

  const handleFinalizarCompra = () => {
    // Limpiar todos los datos de sesión
    sessionStorage.removeItem('datosCompra');
    sessionStorage.removeItem('zigiPaymentUrl');
    sessionStorage.removeItem('zigiPaymentData');
    
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
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Mensaje de éxito */}
        <Alert severity="success" className="mb-6">
          <AlertTitle>¡Transacción Completada Exitosamente!</AlertTitle>
          <p className="mt-2">
            Tu pago ha sido procesado correctamente. 
            Recibirás una confirmación por correo electrónico con todos los detalles de tu compra.
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
                  <span>Total Pagado:</span>
                  <span className="text-green-600">Q{datosCompra.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de confirmación */}
          <Card>
            <CardContent>
              <Typography variant="h6" className="mb-4 font-bold text-gray-900">
                Confirmación de Pago
              </Typography>
              
              <div className="space-y-6">
                {/* Estado del pago */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <CheckCircleIcon className="text-green-600 text-4xl mx-auto mb-2" />
                  <Typography variant="h6" className="text-green-800 font-bold">
                    Pago Aprobado
                  </Typography>
                  <Typography variant="body2" className="text-green-700">
                    Tu transacción ha sido procesada exitosamente
                  </Typography>
                </motion.div>

                {/* Información del correo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <EmailIcon className="text-blue-600 mt-1" />
                  <div>
                    <Typography variant="body1" className="font-semibold text-blue-800">
                      Confirmación por Correo
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      Recibirás un correo electrónico con el comprobante de pago y los detalles de tu inscripción.
                    </Typography>
                  </div>
                </motion.div>

                {/* Información del recibo */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <ReceiptIcon className="text-gray-600 mt-1" />
                  <div>
                    <Typography variant="body1" className="font-semibold text-gray-800">
                      Comprobante de Pago
                    </Typography>
                    <Typography variant="body2" className="text-gray-700">
                      Guarda este comprobante como respaldo de tu transacción.
                    </Typography>
                  </div>
                </motion.div>

                {/* Información adicional */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                  <Typography variant="body2" className="text-yellow-800">
                    <strong>Importante:</strong> Lleva este comprobante el día de la carrera para recoger tu kit de corredor.
                  </Typography>
                </motion.div>
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
            Volver al Inicio
          </Button>
        </Box>
      </motion.div>
    </div>
  );
}

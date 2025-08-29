import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

// Configurar dayjs para usar español
dayjs.locale('es');

interface Participante {
  id: number;
  nombre: string;
  apellido: string;
  distancia: string;
  fechaNacimiento: string;
  ipu: string;
}

export default function FormularioCompra() {
  const [cantidad, setCantidad] = useState<number>(1);
  const [participantes, setParticipantes] = useState<Participante[]>([
    {
      id: 1,
      nombre: '',
      apellido: '',
      distancia: '',
      fechaNacimiento: '',
      ipu: ''
    }
  ]);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  const [showDataLoaded, setShowDataLoaded] = useState<boolean>(false);

  // Cargar datos existentes al montar el componente
  useEffect(() => {
    const loadExistingData = () => {
      const storedData = sessionStorage.getItem('datosCompra');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // Verificar si los datos son válidos para el formulario de compra
          if (parsedData.participantes && parsedData.participantes.length > 0) {
            setHasExistingData(true);
            setCantidad(parsedData.participantes.length);
            setParticipantes(parsedData.participantes);
            setIsValid(validarFormulario(parsedData.participantes));
            
            // Mostrar alerta de datos cargados
              setShowDataLoaded(true);
              
              // Ocultar la alerta después de 5 segundos
              setTimeout(() => setShowDataLoaded(false), 5000);
          }
        } catch (error) {
          console.error('Error al cargar datos de la sesión:', error);
        }
      }
    };

    loadExistingData();
  }, []);

  // Validar que todos los campos obligatorios estén completos
  const validarFormulario = (participantes: Participante[]) => {
    return participantes.every(participante => 
      participante.nombre.trim() !== '' &&
      participante.apellido.trim() !== '' &&
      participante.distancia !== '' &&
      participante.fechaNacimiento !== ''
    );
  };

  // Actualizar cantidad y regenerar array de participantes
  const handleCantidadChange = (nuevaCantidad: number) => {
    setCantidad(nuevaCantidad);
    
    const nuevosParticipantes: Participante[] = [];
    for (let i = 1; i <= nuevaCantidad; i++) {
      // Mantener datos existentes si ya existen
      const participanteExistente = participantes.find(p => p.id === i);
      nuevosParticipantes.push({
        id: i,
        nombre: participanteExistente?.nombre || '',
        apellido: participanteExistente?.apellido || '',
        distancia: participanteExistente?.distancia || '',
        fechaNacimiento: participanteExistente?.fechaNacimiento || '',
        ipu: participanteExistente?.ipu || ''
      });
    }
    
    setParticipantes(nuevosParticipantes);
    setIsValid(validarFormulario(nuevosParticipantes));
  };

  // Actualizar datos de un participante específico
  const handleParticipanteChange = (id: number, campo: keyof Participante, valor: string) => {
    const nuevosParticipantes = participantes.map(participante =>
      participante.id === id ? { ...participante, [campo]: valor } : participante
    );
    
    setParticipantes(nuevosParticipantes);
    setIsValid(validarFormulario(nuevosParticipantes));
  };

  // Actualizar fecha de nacimiento usando dayjs
  const handleFechaNacimientoChange = (id: number, fecha: dayjs.Dayjs | null) => {
    const fechaString = fecha ? fecha.format('YYYY-MM-DD') : '';
    const nuevosParticipantes = participantes.map(participante =>
      participante.id === id ? { ...participante, fechaNacimiento: fechaString } : participante
    );
    
    setParticipantes(nuevosParticipantes);
    setIsValid(validarFormulario(nuevosParticipantes));
  };

  // Calcular edad a partir de la fecha de nacimiento
  const calcularEdad = (fechaNacimiento: string) => {
    if (!fechaNacimiento) return 0;
    const hoy = dayjs();
    const fechaNac = dayjs(fechaNacimiento);
    return hoy.diff(fechaNac, 'year');
  };

  // Validar distancia según edad
  const validarDistancia = (edad: number, distancia: string) => {
    if (edad < 13) return false; // Solo mayores de 13 años
    if (distancia === '5K' || distancia === '10K') return true;
    return false;
  };

  // Obtener precio por distancia
  const obtenerPrecio = (distancia: string) => {
    switch (distancia) {
      case '5K': return 100;
      case '10K': return 180;
      default: return 0;
    }
  };

  // Calcular total
  const calcularTotal = () => {
    return participantes.reduce((total, participante) => {
      return total + obtenerPrecio(participante.distancia);
    }, 0);
  };

  // Función para borrar datos de la sesión
  const handleClearData = () => {
    sessionStorage.removeItem('datosCompra');
    setHasExistingData(false);
    setShowDataLoaded(false);
    
    // Resetear el formulario
    setCantidad(1);
    setParticipantes([{
      id: 1,
      nombre: '',
      apellido: '',
      distancia: '',
      fechaNacimiento: '',
      ipu: ''
    }]);
    setIsValid(false);
  };

  const handleContinuar = () => {
    if (isValid) {
      // Guardar datos en sessionStorage para la página de pago
      const datosCompra = {
        participantes,
        total: calcularTotal(),
        cantidad: participantes.length
      };
      sessionStorage.setItem('datosCompra', JSON.stringify(datosCompra));
      
      // Redirigir a la página de pago
      window.location.href = '/pagar';
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Alerta de datos cargados */}
          {showDataLoaded && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <p className="text-blue-800">
                  Se han cargado datos existentes de una sesión anterior. Puedes continuar con tu compra o borrar los datos para empezar de nuevo.
                </p>
                {hasExistingData && (
                  <button 
                    onClick={handleClearData}
                    className="ml-4 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                  >
                    Borrar datos
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Selección de cantidad */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Selecciona la cantidad de tickets
            </h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Cantidad:
              </label>
              <select
                value={cantidad}
                onChange={(e) => handleCantidadChange(Number(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'ticket' : 'tickets'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Formularios de participantes */}
          <div className="space-y-6">
            {participantes.map((participante, index) => {
              const edad = calcularEdad(participante.fechaNacimiento);
              const distanciaValida = validarDistancia(edad, participante.distancia);
              const precio = obtenerPrecio(participante.distancia);
              
              return (
                <motion.div
                  key={participante.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <h4 className="text-lg font-medium text-gray-900 mb-4">
                    Participante {participante.id}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={participante.nombre}
                        onChange={(e) => handleParticipanteChange(participante.id, 'nombre', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa tu nombre"
                      />
                    </div>

              {/* Apellido */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={participante.apellido}
                        onChange={(e) => handleParticipanteChange(participante.id, 'apellido', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa tu apellido"
                      />
                    </div>

                    {/* Fecha de nacimiento con DatePicker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de nacimiento *
                      </label>
                  <DatePicker
                        value={participante.fechaNacimiento ? dayjs(participante.fechaNacimiento) : null}
                        onChange={(fecha) => handleFechaNacimientoChange(participante.id, fecha)}
                        maxDate={dayjs().subtract(13, 'year')}
                        minDate={dayjs().subtract(100, 'year')}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                            size: "small",
                            placeholder: "Selecciona tu fecha de nacimiento",
                            sx: {
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                '& fieldset': {
                                  borderColor: '#d1d5db',
                                },
                                '&:hover fieldset': {
                                  borderColor: '#3b82f6',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#3b82f6',
                                },
                              },
                            }
                          }
                        }}
                      />
                      {participante.fechaNacimiento && (
                        <p className="text-sm text-gray-600 mt-1">
                          Edad: {edad} años
                        </p>
                      )}
                    </div>

              {/* Distancia */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Distancia *
                      </label>
                      <select
                        value={participante.distancia}
                        onChange={(e) => handleParticipanteChange(participante.id, 'distancia', e.target.value)}
                        className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          participante.distancia && !distanciaValida 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
                      >
                        <option value="">Selecciona una distancia</option>
                        {edad >= 13 && (
                          <>
                            <option value="5K">5K - Q100</option>
                            <option value="10K">10K - Q180</option>
                          </>
                        )}
                      </select>
                      {participante.distancia && !distanciaValida && (
                        <p className="text-sm text-red-600 mt-1">
                          Solo participantes mayores de 13 años pueden registrarse
                        </p>
                      )}
                      {participante.distancia && precio > 0 && (
                        <p className="text-sm text-green-600 mt-1 font-medium">
                          Precio: Q{precio}
                        </p>
                      )}
                    </div>

                    {/* IPU - Campo opcional */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IPU (Identificación Personal Única)
                        <span className="text-gray-500 text-xs ml-1">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={participante.ipu}
                        onChange={(e) => handleParticipanteChange(participante.id, 'ipu', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingresa tu IPU (opcional)"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Si tienes un IPU, puedes ingresarlo para facilitar tu identificación
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Resumen de total */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total a pagar:
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  Q{calcularTotal()}
                </span>
              </div>
            </motion.div>
          )}

          {/* Botón continuar */}
          <div className="mt-8 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContinuar}
              disabled={!isValid}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                isValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isValid ? 'Continuar con el pago' : 'Completa todos los campos'}
            </motion.button>
          </div>

          {/* Resumen de validación */}
          {!isValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
            >
              <p className="text-sm text-yellow-800">
                Por favor completa todos los campos obligatorios (*) para continuar.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      </LocalizationProvider>
  );
}

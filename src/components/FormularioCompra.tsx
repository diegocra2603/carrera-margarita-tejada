import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

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

// Esquema de validación con Zod
const compraSchema = z.object({
  nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  apellido: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  correo: z.string()
    .email('Ingresa un correo electrónico válido'),
  fechaNacimiento: z.any()
    .refine((date) => {
      if (!date) return false;
      const birthDate = dayjs(date);
      const today = dayjs();
      const age = today.diff(birthDate, 'year');
      return age >= 5 && age <= 100;
    }, 'La edad debe estar entre 5 y 100 años'),
  distancia: z.string()
    .min(1, 'Selecciona una distancia'),
  cantidad: z.string()
    .min(1, 'Selecciona una cantidad')
    .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 10, 'La cantidad debe estar entre 1 y 10')
});

type CompraFormData = z.infer<typeof compraSchema>;

export default function FormularioCompra() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [showDataLoaded, setShowDataLoaded] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<CompraFormData>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      nombre: '',
      apellido: '',
      correo: '',
      fechaNacimiento: null,
      distancia: '',
      cantidad: ''
    }
  });

  // Cargar datos existentes de la sesión al montar el componente
  useEffect(() => {
    const loadExistingData = () => {
      const storedData = sessionStorage.getItem('purchaseData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          
          // Verificar si los datos son válidos para el formulario de compra
          if (parsedData.nombre && parsedData.apellido && parsedData.correo) {
            setHasExistingData(true);
            
            // Cargar los datos en el formulario
            setValue('nombre', parsedData.nombre);
            setValue('apellido', parsedData.apellido);
            setValue('correo', parsedData.correo);
            
            // Convertir la fecha de nacimiento de string a dayjs
            if (parsedData.fechaNacimiento) {
              const [day, month, year] = parsedData.fechaNacimiento.split('/');
              const birthDate = dayjs(`${year}-${month}-${day}`);
              setValue('fechaNacimiento', birthDate);
            }
            
            setValue('distancia', parsedData.distancia || '');
            setValue('cantidad', parsedData.cantidad || '');
            
            // Mostrar alerta de datos cargados solo si el usuario regresa de la página de pago
            const isReturningFromPayment = sessionStorage.getItem('returningFromPayment');
            if (isReturningFromPayment) {
              setShowDataLoaded(true);
              sessionStorage.removeItem('returningFromPayment');
              
              // Ocultar la alerta después de 5 segundos
              setTimeout(() => setShowDataLoaded(false), 5000);
            }
          }
        } catch (error) {
          console.error('Error al cargar datos de la sesión:', error);
        }
      }
    };

    loadExistingData();
  }, [setValue]);

  // Función para borrar datos de la sesión
  const handleClearData = () => {
    sessionStorage.removeItem('purchaseData');
    setHasExistingData(false);
    setShowDataLoaded(false);
    
    // Resetear el formulario
    reset({
      nombre: '',
      apellido: '',
      correo: '',
      fechaNacimiento: null,
      distancia: '',
      cantidad: ''
    });
  };

  const onSubmit = async (data: CompraFormData) => {
    setIsSubmitting(true);
    try {
      // Guardar datos en sessionStorage
      const purchaseData = {
        ...data,
        fechaNacimiento: data.fechaNacimiento ? data.fechaNacimiento.format('DD/MM/YYYY') : '',
        total: parseInt(data.cantidad) * 125, // Q125 por ticket
        timestamp: new Date().toISOString()
      };
      
      sessionStorage.setItem('purchaseData', JSON.stringify(purchaseData));
      
      // Redirigir a la página de pago
      window.location.href = '/pagar';
      
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Error al procesar la compra. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Paper elevation={2} sx={{ p: 4 }}>
          {/* Alerta de datos cargados */}
          {showDataLoaded && (
            <Alert 
              severity="info" 
              sx={{ mb: 3 }}
              action={
                hasExistingData && (
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleClearData}
                    sx={{ ml: 2 }}
                  >
                    Borrar datos
                  </Button>
                )
              }
            >
              Se han cargado datos existentes de una sesión anterior. Puedes continuar con tu compra o borrar los datos para empezar de nuevo.
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, maxWidth: '800px' }}>
              
              {/* Nombre */}
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    placeholder="Tu nombre"
                    error={!!errors.nombre}
                    helperText={errors.nombre?.message}
                    fullWidth
                    variant="outlined"
                    size="medium"
                  />
                )}
              />

              {/* Apellido */}
              <Controller
                name="apellido"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido"
                    placeholder="Tu apellido"
                    error={!!errors.apellido}
                    helperText={errors.apellido?.message}
                    fullWidth
                    variant="outlined"
                    size="medium"
                  />
                )}
              />

              {/* Correo electrónico */}
              <Controller
                name="correo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo electrónico"
                    type="email"
                    placeholder="tu@email.com"
                    error={!!errors.correo}
                    helperText={errors.correo?.message}
                    fullWidth
                    variant="outlined"
                    size="medium"
                    sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}
                  />
                )}
              />

              {/* Fecha de nacimiento */}
              <Controller
                name="fechaNacimiento"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={field.value}
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        size: "medium",
                        error: !!errors.fechaNacimiento,
                        helperText: errors.fechaNacimiento?.message as string,
                        placeholder: "Selecciona tu fecha de nacimiento"
                      }
                    }}
                    maxDate={dayjs().subtract(5, 'year')}
                    minDate={dayjs().subtract(100, 'year')}
                  />
                )}
              />

              {/* Distancia */}
              <Controller
                name="distancia"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.distancia}>
                    <InputLabel>Distancia</InputLabel>
                    <Select
                      {...field}
                      label="Distancia"
                      size="medium"
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      <MenuItem value="5k">5K</MenuItem>
                      <MenuItem value="10k">10K</MenuItem>
                    </Select>
                    {errors.distancia && (
                      <Typography variant="caption" color="error">
                        {errors.distancia.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              {/* Cantidad */}
              <Controller
                name="cantidad"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.cantidad}>
                    <InputLabel>Cantidad</InputLabel>
                    <Select
                      {...field}
                      label="Cantidad"
                      size="medium"
                    >
                      <MenuItem value="">
                        <em>Seleccionar</em>
                      </MenuItem>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <MenuItem key={num} value={num.toString()}>
                          Tickets {num}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.cantidad && (
                      <Typography variant="caption" color="error">
                        {errors.cantidad.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Botones de acción */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mt: 4, 
              pt: 3, 
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              {/* Botón para borrar datos (solo si hay datos existentes) */}
              {hasExistingData && (
                <Button
                  variant="outlined"
                  color="error"
                  size="medium"
                  onClick={handleClearData}
                  disabled={isSubmitting}
                >
                  Borrar datos guardados
                </Button>
              )}
              
              {/* Botón de envío */}
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                size="large"
                sx={{ ml: 'auto' }}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar y pagar'}
              </Button>
            </Box>
          </form>
        </Paper>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  TextField, 
  Button, 
  Box,
  Typography,
  Paper,
  ThemeProvider,
  createTheme,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';

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
const pagoSchema = z.object({
  telefono: z.string()
    .min(8, 'El teléfono debe tener al menos 8 dígitos')
    .max(8, 'El teléfono debe tener máximo 8 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números'),
  direccion: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(200, 'La dirección no puede exceder 200 caracteres'),
  numeroTarjeta: z.string()
    .min(1, 'El número de tarjeta es requerido')
    .refine((value) => {
      // Remover espacios para validar solo dígitos
      const digits = value.replace(/\s/g, '');
      return digits.length >= 13 && digits.length <= 16 && /^\d+$/.test(digits);
    }, 'El número de tarjeta debe tener entre 13 y 16 dígitos'),
  nombreTarjeta: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  fechaExpiracion: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Formato inválido (MM/YY)'),
  cvv: z.string()
    .min(3, 'El CVV debe tener 3 dígitos')
    .max(4, 'El CVV debe tener máximo 4 dígitos')
    .regex(/^\d+$/, 'Solo se permiten números')
});

type PagoFormData = z.infer<typeof pagoSchema>;

// Tipos de tarjetas
const cardTypes = {
  visa: {
    pattern: /^4/,
    name: 'Visa',
    logo: '💳',
    color: '#1a1f71'
  },
  mastercard: {
    pattern: /^5[1-5]/,
    name: 'Mastercard',
    logo: '💳',
    color: '#eb001b'
  },
  amex: {
    pattern: /^3[47]/,
    name: 'American Express',
    logo: '💳',
    color: '#006fcf'
  },
  discover: {
    pattern: /^6(?:011|5)/,
    name: 'Discover',
    logo: '💳',
    color: '#ff6000'
  }
};

export default function FormularioPago() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any>(null);
  const [cardType, setCardType] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');

  useEffect(() => {
    // Obtener datos de la sesión
    const storedData = sessionStorage.getItem('purchaseData');
    if (storedData) {
      setPurchaseData(JSON.parse(storedData));
    } else {
      // Si no hay datos, redirigir a compra
      window.location.href = '/compra';
    }
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<PagoFormData>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      telefono: '',
      direccion: '',
      numeroTarjeta: '',
      nombreTarjeta: '',
      fechaExpiracion: '',
      cvv: ''
    }
  });

  // Observar cambios en el número de tarjeta
  const watchedCardNumber = watch('numeroTarjeta');
  const watchedCardName = watch('nombreTarjeta');
  const watchedCardExpiry = watch('fechaExpiracion');

  useEffect(() => {
    setCardNumber(watchedCardNumber || '');
    setCardName(watchedCardName || '');
    setCardExpiry(watchedCardExpiry || '');
    
    // Detectar tipo de tarjeta
    if (watchedCardNumber) {
      for (const [type, info] of Object.entries(cardTypes)) {
        if (info.pattern.test(watchedCardNumber)) {
          setCardType(info);
          break;
        }
      }
    } else {
      setCardType(null);
    }
  }, [watchedCardNumber, watchedCardName, watchedCardExpiry]);

  const onSubmit = async (data: PagoFormData) => {
    setIsSubmitting(true);
    try {
      // Limpiar datos formateados para envío
      const cleanData = {
        ...data,
        numeroTarjeta: data.numeroTarjeta.replace(/\s/g, ''), // Remover espacios
        fechaExpiracion: data.fechaExpiracion.replace('/', '') // Remover /
      };
      
      // Aquí puedes enviar los datos de pago a tu API
      console.log('Datos de pago (limpios):', cleanData);
      console.log('Datos de compra:', purchaseData);
      
      // Simular envío a API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpiar sesión
      sessionStorage.removeItem('purchaseData');
      
      // Mostrar mensaje de éxito
      alert('¡Pago procesado exitosamente!');
      
      // Redirigir a página principal
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Error al procesar el pago. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!purchaseData) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Typography>Cargando datos de compra...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Resumen de compra - LADO IZQUIERDO */}
          <Box sx={{ 
            width: { xs: '100%', md: '40%' },
            minWidth: { md: '350px' }
          }}>
            <Paper elevation={2} sx={{ 
              p: 3, 
              height: 'fit-content', 
              position: { md: 'sticky' }, 
              top: { md: 20 },
              mb: { xs: 3, md: 0 }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Detalle de compra
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => window.location.href = '/compra'}
                  sx={{ fontSize: '0.75rem' }}
                >
                  ← Regresar
                </Button>
              </Box>

              <Box sx={{ border: '2px solid #e0e0e0', borderRadius: 2, p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main', 
                    borderRadius: 2, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 3,
                    color: 'white'
                  }}>
                    🏃
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      Información compra
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      {purchaseData.distancia.toUpperCase()}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Cantidad: {purchaseData.cantidad} tickets
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ borderTop: '2px solid #e0e0e0', pt: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Nombre:</Typography>
                      <Typography variant="body1" fontWeight="medium">{purchaseData.nombre} {purchaseData.apellido}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Email:</Typography>
                      <Typography variant="body1" fontWeight="medium">{purchaseData.correo}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" color="text.secondary">Fecha nacimiento:</Typography>
                      <Typography variant="body1" fontWeight="medium">{purchaseData.fechaNacimiento}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    pt: 3, 
                    borderTop: '2px solid #e0e0e0',
                    bgcolor: 'primary.main',
                    color: 'white',
                    p: 2,
                    borderRadius: 1
                  }}>
                    <Typography variant="h5" fontWeight="bold">Total a pagar</Typography>
                    <Typography variant="h4" fontWeight="bold">Q{purchaseData.total}</Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Formulario de pago - LADO DERECHO */}
          <Box sx={{ 
            width: { xs: '100%', md: '60%' },
            flex: 1
          }}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                Información de pago
              </Typography>

                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                 {/* Preview de tarjeta */}
                 <Box>
                   <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                     Información de tarjeta
                   </Typography>
                   <Card 
                     sx={{ 
                       background: cardType ? `linear-gradient(135deg, ${cardType.color} 0%, ${cardType.color}dd 100%)` : 'linear-gradient(135deg, #666 0%, #999 100%)',
                       color: 'white',
                       mb: 3,
                       borderRadius: 2
                     }}
                   >
                     <CardContent sx={{ p: 3 }}>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                         <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                           {cardType ? cardType.name : 'Tarjeta'}
                         </Typography>
                         <Typography variant="h3">
                           {cardType ? cardType.logo : '💳'}
                         </Typography>
                       </Box>
                       <Typography variant="h6" sx={{ fontFamily: 'monospace', mb: 2, letterSpacing: 2 }}>
                         {cardNumber || '**** **** **** ****'}
                       </Typography>
                       <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                         <Typography variant="body1">
                           {cardName || 'NOMBRE DEL TITULAR'}
                         </Typography>
                         <Typography variant="body1">
                           {cardExpiry || 'MM/YY'}
                         </Typography>
                       </Box>
                     </CardContent>
                   </Card>
                 </Box>

                 {/* Número de tarjeta */}
                 <Controller
                   name="numeroTarjeta"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Número de tarjeta"
                       placeholder="1234 5678 9012 3456"
                       error={!!errors.numeroTarjeta}
                       helperText={errors.numeroTarjeta?.message}
                       fullWidth
                       variant="outlined"
                       size="medium"
                       inputProps={{ maxLength: 19 }}
                       onChange={(e) => {
                         // Formatear número de tarjeta
                         let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                         if (value.length > 16) value = value.slice(0, 16);
                         
                         // Agregar espacios cada 4 dígitos
                         const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                         field.onChange(formatted);
                       }}
                     />
                   )}
                 />

                 {/* Nombre de la tarjeta */}
                 <Controller
                   name="nombreTarjeta"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Nombre de la tarjeta"
                       placeholder="NOMBRE APELLIDO"
                       error={!!errors.nombreTarjeta}
                       helperText={errors.nombreTarjeta?.message}
                       fullWidth
                       variant="outlined"
                       size="medium"
                     />
                   )}
                 />

                 {/* Fecha de expiración y CVV */}
                 <Box sx={{ display: 'flex', gap: 2 }}>
                   <Controller
                     name="fechaExpiracion"
                     control={control}
                     render={({ field }) => (
                       <TextField
                         {...field}
                         label="Fecha de expiración (MM/YY)"
                         placeholder="12/25"
                         error={!!errors.fechaExpiracion}
                         helperText={errors.fechaExpiracion?.message}
                         fullWidth
                         variant="outlined"
                         size="medium"
                         inputProps={{ maxLength: 5 }}
                         onChange={(e) => {
                           // Formatear fecha de expiración
                           let value = e.target.value.replace(/\D/g, '');
                           if (value.length > 4) value = value.slice(0, 4);
                           
                           // Agregar / después del mes
                           if (value.length >= 2) {
                             value = value.slice(0, 2) + '/' + value.slice(2);
                           }
                           field.onChange(value);
                         }}
                       />
                     )}
                   />

                   <Controller
                     name="cvv"
                     control={control}
                     render={({ field }) => (
                       <TextField
                         {...field}
                         label="CVV"
                         placeholder="123"
                         error={!!errors.cvv}
                         helperText={errors.cvv?.message}
                         sx={{ minWidth: '120px' }}
                         variant="outlined"
                         size="medium"
                         inputProps={{ maxLength: 4 }}
                       />
                     )}
                   />
                 </Box>

                 {/* Teléfono */}
                 <Controller
                   name="telefono"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Teléfono"
                       type="tel"
                       placeholder="12345678"
                       error={!!errors.telefono}
                       helperText={errors.telefono?.message}
                       fullWidth
                       variant="outlined"
                       size="medium"
                       inputProps={{ maxLength: 8 }}
                     />
                   )}
                 />

                 {/* Dirección */}
                 <Controller
                   name="direccion"
                   control={control}
                   render={({ field }) => (
                     <TextField
                       {...field}
                       label="Dirección"
                       placeholder="Tu dirección completa"
                       error={!!errors.direccion}
                       helperText={errors.direccion?.message}
                       fullWidth
                       variant="outlined"
                       size="medium"
                     />
                   )}
                 />
               </Box>

              {/* Botón de pago */}
              <Box sx={{ mt: 5, pt: 4, borderTop: '2px solid', borderColor: 'divider' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  size="large"
                  fullWidth
                  sx={{ 
                    py: 2, 
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar y pagar'}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </form>
    </ThemeProvider>
  );
}

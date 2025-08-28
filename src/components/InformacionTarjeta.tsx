import React, { useEffect } from 'react';
import { TextField, Typography, Box, Card, CardContent } from '@mui/material';

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

interface InformacionTarjetaProps {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  onCardNumberChange: (value: string) => void;
  onCardNameChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvvChange: (value: string) => void;
}

export default function InformacionTarjeta({
  cardNumber,
  cardName,
  cardExpiry,
  cardCvv,
  onCardNumberChange,
  onCardNameChange,
  onCardExpiryChange,
  onCardCvvChange
}: InformacionTarjetaProps) {
  const [cardType, setCardType] = React.useState<any>(null);

  // Detectar tipo de tarjeta
  useEffect(() => {
    if (cardNumber) {
      for (const [type, info] of Object.entries(cardTypes)) {
        if (info.pattern.test(cardNumber.replace(/\s/g, ''))) {
          setCardType(info);
          break;
        }
      }
    } else {
      setCardType(null);
    }
  }, [cardNumber]);

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\s/g, '').replace(/\D/g, '');
    if (digits.length > 16) return digits.slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  // Formatear fecha de expiración
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length > 4) return digits.slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  return (
    <div className="space-y-4">
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, mt: 3 }}>
        Información de tarjeta
      </Typography>

      {/* Preview de tarjeta */}
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

      {/* Número de tarjeta */}
      <TextField
        label="Número de tarjeta"
        value={cardNumber}
        onChange={(e) => onCardNumberChange(formatCardNumber(e.target.value))}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="1234 5678 9012 3456"
        inputProps={{ maxLength: 19 }}
        required
      />

      {/* Nombre de la tarjeta */}
      <TextField
        label="Nombre de la tarjeta"
        value={cardName}
        onChange={(e) => onCardNameChange(e.target.value.toUpperCase())}
        fullWidth
        variant="outlined"
        size="medium"
        placeholder="NOMBRE APELLIDO"
        required
      />

      {/* Fecha de expiración y CVV */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Fecha de expiración (MM/YY)"
          value={cardExpiry}
          onChange={(e) => onCardExpiryChange(formatExpiry(e.target.value))}
          fullWidth
          variant="outlined"
          size="medium"
          placeholder="12/25"
          inputProps={{ maxLength: 5 }}
          required
        />

        <TextField
          label="CVV"
          value={cardCvv}
          onChange={(e) => onCardCvvChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
          sx={{ minWidth: '120px' }}
          variant="outlined"
          size="medium"
          placeholder="123"
          inputProps={{ maxLength: 4 }}
          required
        />
      </Box>
    </div>
  );
}

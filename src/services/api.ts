// Servicios de API para el lado del servidor
import { config } from '../config/env';

// Tipos para las respuestas de la API
export interface TicketResponse {
  id: number;
  codigo: string;
  estado: number;
  platform: number;
  distance?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  ipu?: string;
  quantity?: number;
  total?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  quantity: number;
  participants: Array<{
    firstName: string;
    lastName: string;
    distance: string;
    birthDate: string;
    email: string;
    ipu: string;
  }>;
  purchaseData: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
  };
  paymentMethod: number;
  cardData?: {
    cardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardholderName: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  transactionId?: string;
}

// Función helper para construir URLs de la API
function buildApiUrl(endpoint: string): string {
  const baseUrl = config.apiBaseUrl.replace(/\/$/, ''); // Remover trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remover leading slash
  return `${baseUrl}/${cleanEndpoint}`;
}

// Servicio para obtener información de un ticket
export async function getTicketInfo(ticketId: string): Promise<TicketResponse> {
  try {
    const url = buildApiUrl(`api/v1/productcarrera/${ticketId}`);
    console.log('Buscando ticket en:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const ticket = await response.json();
    console.log('Ticket encontrado:', ticket);
    
    return ticket;
  } catch (error) {
    console.error('Error al obtener información del ticket:', error);
    throw error;
  }
}

// Servicio para registrar un pago
export async function registerPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  try {
    const url = buildApiUrl('api/v1/productcarrera/register-payment');
    console.log('Registrando pago en:', url);
    console.log('Datos del pago:', paymentData);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
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
    
    return responseData;
  } catch (error) {
    console.error('Error al registrar el pago:', error);
    throw error;
  }
}

// Función para convertir número de estado a texto
export function getEstadoTexto(estadoNumero: number): string {
  switch (estadoNumero) {
    case 1: return 'Activo';
    case 2: return 'Inactivo';
    case 3: return 'Vendido';
    case 4: return 'Pendiente de Pago';
    default: return 'Desconocido';
  }
}

// Función para convertir número de plataforma a texto
export function getPlatformTexto(platformNumero: number): string {
  switch (platformNumero) {
    case 1: return 'Físico';
    case 2: return 'Digital';
    default: return 'Desconocida';
  }
}

// Función para obtener la clase CSS del estado
export function getEstadoClass(estado: string): string {
  if (!estado) return 'bg-gray-100 text-gray-800';
  
  switch (estado.toLowerCase()) {
    case 'activo':
      return 'bg-green-100 text-green-800';
    case 'inactivo':
      return 'bg-gray-100 text-gray-800';
    case 'vendido':
      return 'bg-blue-100 text-blue-800';
    case 'pendiente de pago':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

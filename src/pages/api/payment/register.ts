import type { APIRoute } from 'astro';
import { registerPayment, type PaymentRequest } from '../../../services/api';

export const POST: APIRoute = async ({ request }) => {
  try {
    const paymentData: PaymentRequest = await request.json();
    
    console.log('=== ENDPOINT DE PAGO ===');
    console.log('Datos recibidos:', paymentData);
    
    const result = await registerPayment(paymentData);
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error en endpoint de pago:', error);
    
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

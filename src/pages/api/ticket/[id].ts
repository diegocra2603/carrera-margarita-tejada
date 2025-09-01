import type { APIRoute } from 'astro';
import { getTicketInfo } from '../../../services/api';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) {
    return new Response(JSON.stringify({ error: 'ID de ticket requerido' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const ticket = await getTicketInfo(id);
    
    return new Response(JSON.stringify(ticket), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error al obtener ticket:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

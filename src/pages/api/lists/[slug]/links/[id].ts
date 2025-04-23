import type { APIRoute } from 'astro';
import prisma from '../../../../../lib/prisma';

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { slug, id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Link ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const formData = await request.formData();
    const method = formData.get('_method')?.toString();

    if (method !== 'DELETE') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const list = await prisma.list.findUnique({
      where: { slug }
    });

    if (!list) {
      return new Response(JSON.stringify({ error: 'List not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.link.delete({
      where: {
        id: parseInt(id),
        listId: list.id
      }
    });

    return new Response(null, {
      status: 303,
      headers: { Location: `/list/${slug}` }
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete link' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
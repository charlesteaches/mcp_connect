import type { APIRoute } from 'astro';
import prisma from '../../../lib/prisma';

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { slug } = params;
    const formData = await request.formData();
    const method = formData.get('_method')?.toString();

    if (method !== 'DELETE') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the list and all associated links
    await prisma.list.delete({
      where: { slug }
    });

    return new Response(null, {
      status: 303,
      headers: { Location: '/' }
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
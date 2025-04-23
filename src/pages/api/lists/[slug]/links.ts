import type { APIRoute } from 'astro';
import prisma from '../../../../lib/prisma';
import { getUrlMetadata } from '../../../../lib/metadata';

export const POST: APIRoute = async ({ request, params }) => {
  try {
    const { slug } = params;
    const formData = await request.formData();
    const url = formData.get('url')?.toString();

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
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

    // Fetch metadata for the URL
    const metadata = await getUrlMetadata(url);

    // Create the link with metadata
    await prisma.link.create({
      data: {
        url,
        title: metadata.title,
        description: metadata.description,
        listId: list.id,
        createdAt: new Date()
      }
    });

    return new Response(null, {
      status: 303,
      headers: { Location: `/list/${slug}` }
    });
  } catch (error) {
    console.error('Error adding link:', error);
    return new Response(JSON.stringify({ error: 'Failed to add link' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
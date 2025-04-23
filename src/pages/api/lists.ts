import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import prisma from '../../lib/prisma';

export const prerender = false; // Disable static pre-rendering for this endpoint

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/x-www-form-urlencoded')) {
      return new Response(
        JSON.stringify({ error: 'Content type must be application/x-www-form-urlencoded' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title')?.toString() || '';
    const description = formData.get('description')?.toString();
    const customSlug = formData.get('customSlug')?.toString();

    // Generate or use custom slug
    const slug = customSlug || nanoid(10);

    // Check if slug already exists
    const existingList = await prisma.list.findUnique({
      where: { slug }
    });

    if (existingList) {
      return new Response(
        JSON.stringify({ error: 'This URL is already taken. Please choose another one.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new list
    const list = await prisma.list.create({
      data: {
        title,
        description,
        slug,
        createdAt: new Date()
      }
    });

    return new Response(null, {
      status: 303,
      headers: { Location: `/list/${list.slug}` }
    });
  } catch (error) {
    console.error('Error creating list:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create list. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
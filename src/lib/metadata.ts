import metascraper from 'metascraper';
import title from 'metascraper-title';
import description from 'metascraper-description';
import fetch from 'node-fetch';

const scraper = metascraper([
  title(),
  description()
]);

export async function getUrlMetadata(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const metadata = await scraper({ html, url });
    
    return {
      title: metadata.title || '',
      description: metadata.description || ''
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: '',
      description: ''
    };
  }
}
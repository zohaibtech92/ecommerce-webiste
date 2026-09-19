export default async function handler(request, response) {
  const { default: handleVercelRequest } = await import('../../server/vercelHandler.js');
  const query = new URL(request.url || '/', 'http://localhost').search;
  return handleVercelRequest(request, response, `/api/products${query}`);
}

export default async function handler(request, response) {
  const { default: handleVercelRequest } = await import('../../server/vercelHandler.js');
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  const productIdOrSlug = request.query?.idOrSlug
    || request.query?.['...idOrSlug']
    || requestUrl.searchParams.get('idOrSlug');
  return handleVercelRequest(request, response, `/api/products/${productIdOrSlug}`);
}

export default async function handler(request, response) {
  const { default: handleVercelRequest } = await import('../../server/vercelHandler.js');
  const requestUrl = new URL(request.url || '/', 'http://localhost');
  const orderId = request.query?.id
    || request.query?.['...id']
    || requestUrl.searchParams.get('id');
  return handleVercelRequest(request, response, `/api/orders/${orderId}`);
}

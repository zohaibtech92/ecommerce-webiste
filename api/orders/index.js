export default async function handler(request, response) {
  const { default: handleVercelRequest } = await import('../../server/vercelHandler.js');
  return handleVercelRequest(request, response, '/api/orders');
}

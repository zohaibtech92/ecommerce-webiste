let databaseConnection;
let app;
let connectDB;

export default async function handler(request, response) {
  try {
    if (!app || !connectDB) {
      ({ default: app } = await import('../server/app.js'));
      ({ default: connectDB } = await import('../server/config/db.js'));
    }

    if (!databaseConnection) {
      databaseConnection = connectDB().catch((error) => {
        databaseConnection = undefined;
        throw error;
      });
    }

    await databaseConnection;

    // Vercel can expose catch-all segments as `path` or `...path`.
    const requestQuery = request.query || {};
    const rawUrl = new URL(request.url || '/', 'http://localhost');
    const pathSegments = requestQuery.path
      || requestQuery['...path']
      || rawUrl.searchParams.get('path')
      || rawUrl.searchParams.get('...path');
    if (pathSegments) {
      const path = Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments;
      const query = new URL(request.url || '/', 'http://localhost');
      query.searchParams.delete('path');
      query.searchParams.delete('...path');
      request.url = `/api/${String(path).replace(/^\/+/, '')}${query.search}`;
    } else if (request.url && !request.url.startsWith('/api')) {
      request.url = `/api${request.url.startsWith('/') ? '' : '/'}${request.url}`;
    }

    return app(request, response);
  } catch (error) {
    console.error('[Vercel API] Database initialization failed:', error);
    return response.status(500).json({
      success: false,
      message: 'Database connection failed. Check MONGODB_URI and MongoDB Atlas network access.',
    });
  }
}
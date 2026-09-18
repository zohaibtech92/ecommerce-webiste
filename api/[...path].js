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

    // Vercel may strip the /api prefix before invoking a catch-all function.
    if (request.url && !request.url.startsWith('/api')) {
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
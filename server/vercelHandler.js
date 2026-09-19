import app from './app.js';
import connectDB from './config/db.js';

let databaseConnection;

export default async function handleVercelRequest(request, response, routePath) {
  try {
    if (!databaseConnection) {
      databaseConnection = connectDB().catch((error) => {
        databaseConnection = undefined;
        throw error;
      });
    }

    await databaseConnection;
    request.url = routePath;
    return app(request, response);
  } catch (error) {
    console.error('[Vercel API] Request failed:', error);
    return response.status(500).json({
      success: false,
      message: 'Database connection failed. Check MONGODB_URI and MongoDB Atlas network access.',
    });
  }
}
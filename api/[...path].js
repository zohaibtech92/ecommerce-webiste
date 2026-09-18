import app from '../server/app.js';
import connectDB from '../server/config/db.js';

let databaseConnection;

export default async function handler(request, response) {
  try {
    if (!databaseConnection) {
      databaseConnection = connectDB().catch((error) => {
        databaseConnection = undefined;
        throw error;
      });
    }

    await databaseConnection;
    return app(request, response);
  } catch (error) {
    console.error('[Vercel API] Database initialization failed:', error);
    return response.status(500).json({
      success: false,
      message: 'Database connection failed. Check MONGODB_URI and MongoDB Atlas network access.',
    });
  }
}
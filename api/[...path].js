import dotenv from 'dotenv';
dotenv.config();

import app from '../server/app.js';
import connectDB from '../server/config/db.js';

let databaseConnection;

export default async function handler(request, response) {
  if (!databaseConnection) {
    databaseConnection = connectDB().catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }

  await databaseConnection;
  return app(request, response);
}
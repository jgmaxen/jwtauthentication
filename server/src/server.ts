import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const forceDatabaseRefresh = false; // ❗ Set to `true` if you want to reset the database
const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001; // ✅ Ensure PORT is dynamically assigned

// ✅ Fix for `__dirname` in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());
app.use(routes);

// ✅ Ensure database connection before starting the server
sequelize
  .sync({ force: forceDatabaseRefresh })
  .then(() => {
    console.log('✅ Database synchronized');

    // ✅ Explicitly listen on Render's dynamic port
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

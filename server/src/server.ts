import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';

const forceDatabaseRefresh = false; // ❗ Set this to `true` if you want to reset the database
const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Serves static files from the correct directory (fix for deployment)
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use(express.json());
app.use(routes);

// ✅ Ensure database connection before starting the server
sequelize
  .sync({ force: forceDatabaseRefresh })
  .then(() => {
    console.log('✅ Database synchronized');
    app.listen(PORT, () => {
      console.log(`✅ Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // ❗ Exit process if DB fails
  });

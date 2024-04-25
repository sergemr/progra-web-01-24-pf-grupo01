// server/server.js
require('dotenv').config();

const express = require('express');
const db = require('./modelos'); // Import your Sequelize models
const cors = require('cors');
const routes = require('./api/rol');

const app = express();
const port = process.env.PUERTO_APP || 3001;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Test the database connection
db.sequelize.authenticate()
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Unable to connect to the database:', err));

// Drop all tables and re-create them
db.sequelize.sync({ force: true })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err) => {
        console.error('Error synchronizing database:', err);
    });

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

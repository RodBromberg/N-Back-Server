const express = require('express');
const app = express();
const cors = require('cors');

const usersRoutes = require('./routes/users');


app.use(cors());
app.use(express.json());


app.use('/api/users', usersRoutes);
// Add more routes as needed


app.listen(8000, () => {
    console.log('Server is running on port 8000');
  });
  
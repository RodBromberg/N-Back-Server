const express = require('express');
const app = express();
const cors = require('cors');

const usersRoutes = require('./routes/users/user')



app.use(cors());
app.use(express.json());


app.use('/api/users', usersRoutes);
// email confirmation
// *** To Be Refactored Upon Approval
app.get('/confirm', async (req, res) => {
  const { token } = req.query;
  
  try {
    const user = await usersService.confirmUser(token);
    res.status(200).json({ message: 'User confirmed successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// app.use('/api/users/users', usersRoutes);
// app.use('/api/users', usersNew)
// Add more routes as needed


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
  
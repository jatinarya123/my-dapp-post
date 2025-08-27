const express = require('express');
const cors = require('cors');
const app = express();


const authRoutes = require('../auth/login'); 


app.use(cors());
app.use(express.json());


app.use('/auth', authRoutes); 

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
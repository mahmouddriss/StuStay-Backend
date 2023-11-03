
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const authRoute = require('./routes/AuthRoute');
const userRoute = require('./routes/UserRoute');


const app = express();

// Connect to your MongoDB database
mongoose.connect('mongodb+srv://mahmouddriss:fOL7IeCGeoO5eMal@cluster0.scij7rk.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Your code here
});

// Configure Express to parse JSON
app.use(bodyParser.json());
app.use('/user', authRoute)
app.use('/user', userRoute)

app.use(express.static('public'));  
app.use('/user/avatar', express.static('uploads/avatar'));



const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT)
})






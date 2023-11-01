import express from 'express';
const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 9090;

//app.get('/' ,(req,res)=> {
   // res.status(200).json({message:'hello world!'});
//})

import gameRoutes from './routes/game.js';
app.use(express.json());
app.use('/game',gameRoutes);

app.listen (port,hostname,() => {

    console.log(`Server running at http://localhost:${port}/`);
});


import express from "express";
import cors from 'cors';
import http from 'http';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config()

import {globalErrorHandler} from './utils/globalErrorHandler';

import authRouter from './routes/auth';

const app = express();

app.use(cors())
app.use(function (req: any, res: any, next: any) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-Requested-With,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

app.use(bodyParser.json())

app.use('/v1/api', authRouter);

const server = http.createServer(app);
app.use(globalErrorHandler);


// const io = require('socket.io')(server);
// const ioInstance = require('./sockerInstance')
// ioInstance.createInstance(io)
// const handler = require('./socket/eventHandler')


server.listen(process.env.PORT ?? 3000, ()=> {
    console.log('server is listening to port 3000')    
});


// module.exports =  app;
export default app;

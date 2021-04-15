const express = require('express');

const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const connectionHandler = (ws, msg) => {
   ws.id = msg.id;
   broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
   aWss.clients.forEach((client) => {
      if (client.id === msg.id) {
         client.send(JSON.stringify(msg));
      }
   });
};

app.ws('/', (ws, req) => {
   console.log('connected');
   ws.send('You have connected');
   ws.on('message', (msg) => {
      msg = JSON.parse(msg);
      switch (msg.method) {
         case 'connection':
            connectionHandler(ws, msg);
            break;
         case 'draw':
            broadcastConnection(ws, msg);
      }
   });
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));

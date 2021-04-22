const express = require('express');

const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());

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

app.post('/image', (req, res) => {
   try {
      const data = req.body.img.replace(`data:image/png;base64,`, '');
      fs.writeFileSync(
         path.resolve(__dirname, 'files', `${req.query.id}.jpg`),
         data,
         'base64',
      );
      return res.status(200).json({ message: 'Loaded' });
   } catch (e) {
      return res.status(500).json('error');
   }
});
app.get('/image', (req, res) => {
   try {
      const file = fs.readFileSync(
         path.resolve(__dirname, 'files', `${req.query.id}.jpg`),
      );
      const data = `data:image/png;base64,` + file.toString('base64');
      res.json(data);
   } catch (e) {
      return res.status(500).json('error');
   }
});

app.ws('/', (ws, req) => {
   ws.send('You have connected');
   ws.on('message', (msg) => {
      msg = JSON.parse(msg);
      switch (msg.method) {
         case 'connection':
            connectionHandler(ws, msg);
            break;
         case 'picture':
            broadcastConnection(ws, msg);
         case 'draw':
            broadcastConnection(ws, msg);
            break;
      }
   });
});

app.listen(PORT, () => console.log(`server started on PORT ${PORT}`));

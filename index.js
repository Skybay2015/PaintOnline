const express = require('express');

const app = express();
const WSserver = require('express-ws')(app);
const aWss = WSserver.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

app.use(express.json());

const PORT = process.env.PORT || 5000;

const whitelist = ['http://localhost:3000'​, 'http://localhost:8080'​, 'https://desolate-mesa-61830.herokuapp.com'​]
const corsOptions = {
  origin: function (origin, callback) {
    console.log("** Origin of request " + origin)
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("Origin acceptable")
      callback(null, true)
    } else {
      console.log("Origin rejected")
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'production') {
   // Serve any static files
   app.use(express.static(path.join(__dirname, 'client/build')));
 // Handle React routing, return all requests to React app
   app.get('*', function(req, res) {
     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
   });
 }



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

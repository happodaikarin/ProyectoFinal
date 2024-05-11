const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(bodyParser.json());
const allowedOrigins = ['http://192.168.18.38:5173', 'http://otroOrigenPermitido.com'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);  // Permite la solicitud si el origen es uno de los permitidos
        } else {
            callback(new Error('CORS no permitido para este origen'), false);
        }
    },
    credentials: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'happosai',
    password: 'perr1toPari$',
    database: 'order_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connection established');
});

wss.on('connection', ws => {
    console.log('Client connected');
    ws.on('message', message => {
        console.log('Received message:', message);
        // Retransmit the received message to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

app.post('/api/sales-history', (req, res) => {
  const { orderId, tableNumber, totalPrice, orderData, customerNickname } = req.body;
  const orderDataString = JSON.stringify(orderData);
  const query = 'INSERT INTO sales_history (orderId, tableNumber, totalPrice, orderData, customerNickname) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [orderId, tableNumber, totalPrice, orderDataString, customerNickname], (err, results) => {
      if (err) {
          console.error('Failed to insert into database:', err);
          // Send more detailed error information
          return res.status(500).send({
              error: 'Failed to insert the order into sales history',
              message: err.sqlMessage,  // This provides SQL error details
              code: err.code           // SQL error code
          });
      }
      console.log('Order successfully inserted into sales history with ID:', results.insertId);
      res.status(200).send({
          message: 'Order successfully saved to sales history',
          insertId: results.insertId
      });
  });
});


app.get('/api/sales-history', (req, res) => {
    db.query('SELECT * FROM sales_history', (err, results) => {
        if (err) {
            console.error('Failed to retrieve sales history:', err);
            return res.status(500).send({ error: 'Failed to retrieve sales history from the database' });
        }
        res.status(200).json(results);
    });
});

const PORT = 1231;
server.listen(PORT, () => {
    console.log(`Server running at http://192.168.18.38:${PORT}`);
});

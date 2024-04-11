const WebSocket = require('ws');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const mysql = require('mysql');
const cors = require('cors'); // Requerir el paquete CORS

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware para parsear el cuerpo de las solicitudes HTTP
app.use(bodyParser.json());

// Configuración de CORS para permitir solicitudes desde tu frontend
// Para un entorno de producción, deberías restringir esto a dominios específicos en lugar de permitir todos.
app.use(cors({
  origin: 'http://localhost:5173' // Ajusta este valor según sea necesario
}));

// Resto de tu código de configuración del servidor...


// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'happosai',
  password: 'perr1toPari$',
  database: 'order_db'
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión establecida con la base de datos');
});

app.post('/api/sales-history', (req, res) => {
  const { orderId, tableNumber, totalPrice, orderData } = req.body;

  // Asegurarte de que orderData no sea undefined y tenga el formato correcto.
  if (!orderData) {
    return res.status(400).send({ error: 'orderData no puede ser undefined' });
  }

  let orderDataString;
  try {
    // Esto asegura que orderData sea una cadena JSON válida.
    orderDataString = JSON.stringify(orderData);
  } catch (error) {
    return res.status(400).send({ error: 'orderData debe ser un objeto o arreglo válido.' });
  }

  const query = 'INSERT INTO sales_history (orderId, tableNumber, totalPrice, orderData) VALUES (?, ?, ?, ?)';

  db.query(query, [orderId, tableNumber, totalPrice, orderDataString], (err, results) => {
    if (err) {
      console.error('Error al insertar en la base de datos:', err);
      return res.status(500).send({ error: 'Error al insertar el pedido en la base de datos' });
    }
    console.log('Pedido insertado con éxito en el historial de ventas con ID:', results.insertId);
    res.status(200).send({ message: 'Pedido guardado con éxito en el historial de ventas' });
  });
});




// Endpoint para obtener el historial de ventas
app.get('/api/sales-history', (req, res) => {
  const query = 'SELECT * FROM sales_history';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).send({ error: 'Error al recuperar el historial de ventas de la base de datos' });
    }
    // Enviar los resultados de la consulta al cliente
    res.status(200).json(results);
  });
});


// Manejar conexión WebSocket
wss.on('connection', ws => {
  console.log('Cliente conectado');
  ws.on('message', message => {
    // Suponiendo que 'message' es un string JSON del pedido
    const order = JSON.parse(message);
    const query = 'INSERT INTO sales_history (orderId, tableNumber, totalPrice, orderData) VALUES (?, ?, ?, ?)';

    // Insertar el pedido en la base de datos
    db.query(query, [order.orderId, order.tableNumber, order.totalPrice, JSON.stringify(order)], (err, results) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
        ws.send(JSON.stringify({ error: 'Error al insertar el pedido en la base de datos' }));
        return;
      }
      console.log('Pedido insertado con el ID:', results.insertId);

      // Recuperar el pedido insertado, incluyendo la fecha de creación
      const getOrderQuery = 'SELECT * FROM sales_history WHERE id = ?';

      db.query(getOrderQuery, [results.insertId], (err, orderResults) => {
        if (err) {
          console.error('Error al recuperar el pedido:', err);
          ws.send(JSON.stringify({ error: 'Error al recuperar el pedido de la base de datos' }));
          return;
        }

        // Si se encuentra el pedido, enviarlo a todos los clientes conectados
        const orderWithDate = orderResults[0];
        if (orderWithDate) {
          const orderToSend = {
            ...JSON.parse(orderWithDate.orderData), // Esta línea debería incluir el número de mesa si está en `orderData`
            createdAt: orderWithDate.createdAt // Ya estás enviando la fecha correctamente
          };
          console.log(orderWithDate.createdAt);

          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(orderToSend));
            }
          }); 
        }
      });
    });
  });
});
const PORT = 1231;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
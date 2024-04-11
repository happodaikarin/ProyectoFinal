const express = require('express');
const usuariosRoutes = require('./routes/usuariosRoutes');
const productosRoutes = require('./routes/productosRoutes'); // Agrega la importación de las rutas de productos
const interaccionesRoutes = require('./routes/interaccionesRoutes');

const sequelize = require('./config/database');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/productos', productosRoutes);
app.use('/interacciones', interaccionesRoutes);


sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3030;
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});

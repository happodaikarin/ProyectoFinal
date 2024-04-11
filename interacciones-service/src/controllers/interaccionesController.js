const Interaccion = require('../models/Interaccion');

exports.crearInteraccion = async (req, res) => {
  try {
    const { id_usuario, id_producto, tipo, timestamp, rating } = req.body;
    const nuevaInteraccion = await Interaccion.create({
      id_usuario,
      id_producto,
      tipo,
      timestamp: timestamp || new Date(),
      rating
    });
    res.json(nuevaInteraccion);
  } catch (error) {
    console.error('Error al crear interacción:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};

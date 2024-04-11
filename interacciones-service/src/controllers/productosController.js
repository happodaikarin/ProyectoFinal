const Producto = require('../models/Producto');

exports.sincronizarProducto = async (req, res) => {
  try {
    const productos = req.body; // Assuming this is an array of product objects

    for (const prod of productos) {
      // Use prod.id instead of prod.id_producto
      let producto = await Producto.findOne({ where: { id_producto: prod.id } });

      if (!producto) {
        // If not found, create a new product using all provided properties but ensure the correct property name for id
        producto = await Producto.create({
          id_producto: prod.id,
          nombre: prod.name,
          descripcion: prod.description,
          precio: prod.price,
          categoria: prod.category,
          // Add or adjust any other necessary fields
        });
      } else {
        // Update existing product, make sure to map the incoming properties correctly
        await producto.update({
          nombre: prod.name,
          descripcion: prod.description,
          precio: prod.price,
          categoria: prod.category,
          // Adjust as necessary
        });
      }
    }

    res.json({ message: 'Productos sincronizados exitosamente' });
  } catch (error) {
    console.error('Error al sincronizar productos:', error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
};

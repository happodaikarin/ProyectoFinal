// usuariosController.js

const Usuario = require('../models/Usuario');

exports.sincronizarUsuario = async (req, res) => {
  const { id_usuario, nickname } = req.body;

  try {
    // Busca el usuario por ID. Si no existe, crea uno nuevo.
    let usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      // El usuario no existe, crea uno nuevo
      usuario = await Usuario.create({ id_usuario, nickname });
      return res.status(200).json({ message: 'Usuario creado y sincronizado correctamente', usuario });
    } else {
      // El usuario ya existe, opcionalmente puedes actualizarlo o simplemente devolver un mensaje.
      return res.status(200).json({ message: 'Usuario ya existente y sincronizado', usuario });
    }
  } catch (error) {
    console.error('Error al sincronizar usuario:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

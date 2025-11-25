const jwt = require('jsonwebtoken'); 

//payload: 1 función genera el token. un objeto que contiene un id. Esta función devuelve el token creado.
//Payload: { id: 1 }
const generateToken = (payload) => {
const token = jwt.sign(payload, process.env.SECRET_KEY_JWT, { expiresIn: '1h' });
  return token;
};

//2da función lo decodificas
// verifyToken: decodifica el token cuando quiero saber el token del usuario
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
    generateToken,
    verifyToken,
};
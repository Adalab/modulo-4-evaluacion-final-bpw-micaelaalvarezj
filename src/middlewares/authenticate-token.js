const { verifyToken } = require("../utils/jwt");

const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: "Token inválido" });
    }

    // Adjuntamos a la req el objeto decodificado
    req.user = decoded;
    next();
};

module.exports = {
    authenticateToken,
};
const bcrypt = require("bcrypt");
const mysql = require("../database/mysql-pool");
const { generateToken } = require("../utils/jwt");

const postSignupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (typeof name !== 'string' || name.trim().length === 0 || name.length > 50) {
                return res.status(400).json({
                    error: 'El nombre es obligatorios, deben ser texto y no superar los 50 caracteres.'
                });
            }
        if (typeof email !== 'string' || email.trim().length === 0 || email.length > 50) {
                return res.status(400).json({
                    error: 'El nombre es obligatorios, deben ser texto y no superar los 50 caracteres.'
                });
            }
        if (typeof password !== 'string' || password.trim().length === 0 || password.length > 100) {
                return res.status(400).json({
                    error: 'El nombre es obligatorios, deben ser texto y no superar los 50 caracteres.'
                });
            }
        const passwordHash = await bcrypt.hash(password, 10);

        const query =
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        
        const connection = await mysql.getConnection();
        const data = await connection.query(query, [name, email, passwordHash,]);

        const token = generateToken ({
            id: data[0].insertId,
        });
        res.json({ token, name, id: data[0].insertId });
    } catch (error) {
        console.log(error);
        res.send("Algo ha salido mal")
    }
};

module.exports = {
    postSignupController,
};
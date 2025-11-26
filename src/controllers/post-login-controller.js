const bcrypt = require("bcrypt");
const mysql = require("../database/mysql-pool");
const { generateToken } = require("../utils/jwt");

const postLoginController = async (req, res) => {
    try {
        const { email, password } = req.body;
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
        const query = "SELECT * FROM users WHERE email = ?";
        
        const connection = await mysql.getConnection();
        const [data] = await connection.query(query, [email]);

        const user = data[0];

        if (!user) {
            return res.status(401).json({
                error: "Usuario inválido",
            });
        }

        const isPasswordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.password);
        
        if (!isPasswordCorrect) {
            return res.status(401).json({
                error: "Credenciales inválidas"
            })
        }

        const token = generateToken ({
            id: user.id_user,
        });
        res.json({ token, name: user.name, id: user.id_user });
    } catch (error) {
        console.log(error);
        res.send("Algo ha salido mal")
    }
};

module.exports = {
    postLoginController,
};
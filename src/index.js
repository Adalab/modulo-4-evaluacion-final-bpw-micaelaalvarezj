const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("./database/mysql-pool");
const { authenticateToken } = require("./middlewares/authenticate-token");
const { generateToken } = require("./utils/jwt");
const app = express();
const port = 3000;

require("dotenv").config();

// Configuración para subir límite de respuesta
app.use(express.json({ limit: "25mb" }));
// Para evitar errores de diferente origen cuando se hace la petición
app.use(cors());

// Configuración para escuchar en el puerto definido
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Endpoints
app.get("/recipes", async (req, res) => {
    try {
        const query = "SELECT * FROM recipes WHERE deleted_at IS NULL";

        const connection = await mysql.getConnection();
        const data = await connection.query(query);
        res.json(data[0]);
    } catch {
        res.send("Algo ha ido mal");
    }
});

app.get("/recipe/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }

        const query = "SELECT * FROM recipes WHERE id_recipe = ?";

        const connection = await mysql.getConnection();
        const [data] = await connection.query(query, [Number(id)]);

        res.json(data[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Algo ha ido mal");
    }
});

app.post ("/recipe", authenticateToken, async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body
            if (!name || typeof name !== 'string') {
                return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto' });
            }

            if (typeof ingredients !== 'string' || ingredients.trim().length === 0 || ingredients.length > 500) {
                return res.status(400).json({
                    error: 'Los ingredientes son obligatorios, deben ser texto y no superar los 500 caracteres.'
                });
            }

            if (!instructions || typeof instructions !== 'string') {
                return res.status(400).json({ error: 'Las instrucciones son obligatorias y deben ser un texto' });
            }

        const { id } = req.user;

        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }

        const query = "INSERT INTO recipes (name, ingredients, instructions, fk_user) VALUES (? , ? , ?, ?)"
        const connection = await mysql.getConnection();
        const data = await connection.query(query,[
            name,
            ingredients,
            instructions,
            id]);
            res.status(201).send("Receta creada");
    } catch (error) {
        console.log(error);
        res.send("Algo ha ido mal");
    }
});

app.put("/recipe/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }
        //Le pasaremos todos los datos aunque no se hayan modificado todos desde el frontal
        //Si sigue siendo el mismo lo volvemos a poner
        const { name, ingredients, instructions } = req.body;
        if (!name || typeof name !== 'string') {
                return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto' });
            }

            if (typeof ingredients !== 'string' || ingredients.trim().length === 0 || ingredients.length > 500) {
                return res.status(400).json({
                    error: 'Los ingredientes son obligatorios, deben ser texto y no superar los 500 caracteres.'
                });
            }

            if (!instructions || typeof instructions !== 'string') {
                return res.status(400).json({ error: 'Las instrucciones son obligatorias y deben ser un texto' });
            }

            const { id: userId } = req.user;

            if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }

        //IMPORTANTE: Poner el WHERE para evitar modificar todos los registros
        const query = "UPDATE recipes SET name = ?, ingredients = ?, instructions = ? WHERE id_recipe = ? AND fk_user = ?"
        
        const connection = await mysql.getConnection();
        await connection.query(query, [name, ingredients, instructions, id, userId]);
        
        res.send("Receta actualizada")
    } catch (error) {
        console.log(error);
        res.send("Algo ha ido mal");
    }
});

app.patch("/recipe/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }
        const { id: userId } = req.user;
        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }
        const query = "UPDATE recipes SET deleted_at = NOW() WHERE id_recipe = ? AND fk_user = ?"
        const connection = await mysql.getConnection();
        await connection.query(query, [id, userId]);
        
        res.send("Receta eliminada")
    } catch (error) {
        console.log(error)
        res.send("Algo ha ido mal");
    }
});

app.post("/signup", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
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
});

const express = require("express");
const cors = require("cors");
const mysql = require("./database/mysql-pool");
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

        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).send("Algo ha ido mal");
    }
});

app.post ("/recipe", async (req, res) => {
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

        const query = "INSERT INTO recipes (name, ingredients, instructions) VALUES (? , ? , ?)"
        const connection = await mysql.getConnection();
        const data = await connection.query(query,[
            name,
            ingredients,
            instructions]);
            res.status(201).send("Receta creada");
    } catch {
        res.send("Algo ha ido mal");
    }
});
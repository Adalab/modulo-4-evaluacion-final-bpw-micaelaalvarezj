const mysql = require("../database/mysql-pool");

const postRecipeController = async (req, res) => {
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
};

module.exports = {
    postRecipeController,
};

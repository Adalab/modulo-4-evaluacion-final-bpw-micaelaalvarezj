const mysql = require("../database/mysql-pool");

const putRecipeIdController = async (req, res) => {
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
};

module.exports = {
    putRecipeIdController,
};
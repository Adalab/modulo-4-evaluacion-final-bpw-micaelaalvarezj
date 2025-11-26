const mysql = require("../database/mysql-pool");

const patchRecipeIdController = async (req, res) => {
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
};

module.exports = {
    patchRecipeIdController,
};
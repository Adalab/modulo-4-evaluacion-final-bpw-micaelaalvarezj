const mysql = require("../database/mysql-pool");

const getRecipesController = async (req, res) => {
   try {
        const {id} = req.user
        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }
        const query = "SELECT * FROM recipes WHERE deleted_at IS NULL AND fk_user = ?";

        const connection = await mysql.getConnection();
        const data = await connection.query(query, [Number(id)]);
        res.json(data[0]);
    } catch {
        res.send("Algo ha ido mal");
    }
};

module.exports = {
    getRecipesController,
};
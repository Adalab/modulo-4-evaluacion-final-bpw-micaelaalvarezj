const mysql = require("../database/mysql-pool");

const getRecipeIdController = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "La URL es incorrecta: el id debe ser un número" });
        }

        const query = "SELECT * FROM recipes WHERE id_recipe = ?";

        const connection = await mysql.getConnection();
        const data = await connection.query(query, [Number(id)]);

        res.json(data[0]);

    } catch (err) {
        console.error(err);
        res.status(500).send("Algo ha ido mal");
    }
}
module.exports = {
    getRecipeIdController,
};
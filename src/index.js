const express = require("express");
const cors = require("cors");
const mysql = require("./database/mysql-pool");
const { authenticateToken } = require("./middlewares/authenticate-token");
const { postSignupController } = require("./controllers/post-signup-controller");
const { postLoginController } = require("./controllers/post-login-controller");
const { postRecipeController } = require("./controllers/post-recipe-controller");
const { getRecipesController } = require("./controllers/get-recipes-controller");
const { getRecipeIdController } = require("./controllers/get-recipe-id-controller")
const { putRecipeIdController } = require("./controllers/put-recipe-id-controller")
const { patchRecipeIdController } = require("./controllers/patch-recipe-id-controller")

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
app.get("/recipes", authenticateToken, getRecipesController);

app.get("/recipe/:id", authenticateToken, getRecipeIdController);

app.post ("/recipe", authenticateToken, postRecipeController);

app.put("/recipe/:id", authenticateToken, putRecipeIdController);

app.patch("/recipe/:id", authenticateToken, patchRecipeIdController);

app.post("/signup", postSignupController);

app.post("/login", postLoginController);

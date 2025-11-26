const express = require("express");
const cors = require("cors");
const { authenticateToken } = require("./middlewares/authenticate-token");
const {
    postSignupController,
    postLoginController,
    postRecipeController, 
    getRecipesController,
    getRecipeIdController,
    putRecipeIdController,
    patchRecipeIdController
} = require("./controllers");
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

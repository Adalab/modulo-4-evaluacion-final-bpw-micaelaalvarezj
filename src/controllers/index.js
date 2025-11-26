const { postSignupController } = require("./post-signup-controller");
const { postLoginController } = require("./post-login-controller");
const { postRecipeController } = require("./post-recipe-controller");
const { getRecipesController } = require("./get-recipes-controller");
const { getRecipeIdController } = require("./get-recipe-id-controller");
const { putRecipeIdController } = require("./put-recipe-id-controller");
const { patchRecipeIdController } = require("./patch-recipe-id-controller");

module.exports = {
    postSignupController,
    postLoginController,
    postRecipeController, 
    getRecipesController,
    getRecipeIdController,
    putRecipeIdController,
    patchRecipeIdController
};
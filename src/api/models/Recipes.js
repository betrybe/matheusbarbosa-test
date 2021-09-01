const mongoose = require('../database');

const RecipesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    ingredients: {
        type: String,
        require: true,
    },
    preparation: {
        type: String,
        require: true,
    },
    userId: {
        type: String,
        require: true,
    },
    image: {
        type: String,
    },
}, { versionKey: false });

const Recipes = mongoose.model('Recipes', RecipesSchema);

module.exports = Recipes;
const Recipes = require('../models/Recipes');
const recipesService = require('../service/recipesService');

const addImage = async (req, res) => {
    const recipe = await recipesService.addImage(req.params.id, req.arqExt);

    return res.status(200).send(recipe);
};

const list = async (req, res) => {
    const recipes = await recipesService.list();
    return res.status(200).send(recipes);  
};

const findOne = async (req, res) => {
    const recipe = await recipesService.find(req.params.id);
    if (recipe === 'not found') {
        return res.status(404).send({ message: 'recipe not found' });
    }
    return res.status(200).send(recipe);
};

const create = async (req, res) => {
    const { name, ingredients, preparation } = req.body;
    const recipe = await recipesService.create(name, ingredients, preparation, req.user);
    if (recipe === 'invalid') {
        return res.status(400).send({ message: 'Invalid entries. Try again.' });
    }
    return res.status(201).send({ recipe });
};

const edit = async (req, res) => {
    const { name, ingredients, preparation } = req.body;
    const recipe = await recipesService.edit(name, ingredients, preparation, req.params.id);
    if (recipe === 'missing') {
        res.status(404).send({ message: 'missing data.' });
    } 
    return res.status(200).send(recipe);
};

const exclude = async (req, res) => {
    const filter = { _id: req.params.id };
    const recipe = await recipesService.deletar(req.params.id, req.user);
    if (recipe === 'missing') {
        return res.status(401).send({ message: 'missing auth token' });
    }
    await Recipes.deleteOne(filter);
    return res.status(204).send();
};

module.exports = {
    list,
    findOne,
    create,
    edit,
    exclude,
    addImage,
};
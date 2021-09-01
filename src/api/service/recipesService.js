const { ObjectId } = require('mongoose').Types.ObjectId;

const Recipes = require('../models/Recipes');

async function addImage(id, arqExt) {
    await Recipes.updateOne({ _id: id }, { 
        image: `localhost:3000/src/uploads/${id}.${arqExt}`,
    });
    const recipes = await Recipes.findOne({ _id: id });
    return {
        _id: id,
        userId: recipes.userId,
        name: recipes.name,
        ingredients: recipes.ingredients,
        preparation: recipes.preparation,
        image: recipes.image,
    };
}

const list = async () => {
    const recipes = await Recipes.find();
    return recipes; 
};

const find = async (id) => {
        if (!ObjectId.isValid(id)) {
            return 'not found';
        }    
        const recipes = await Recipes.findById(new ObjectId(id));

        if (!recipes) { return 'not found'; }
        
        return {
            _id: recipes.id,
            name: recipes.name,
            ingredients: recipes.ingredients,
            preparation: recipes.preparation,
        };
};

const create = async (name, ingredients, preparation, reqUser) => {
    const userId = reqUser.id;
    if (!name || !ingredients || !preparation) {
        return 'invalid';
    }
    const recipe = await Recipes.create({ name, ingredients, preparation, userId });
    return recipe;
};

const edit = async (name, ingredients, preparation, id) => {
    const filter = { _id: id };
    const update = { name, ingredients, preparation };
    const recipes = await Recipes.findById(id);
    if (!recipes) return 'missing';
    await Recipes.updateOne(filter, update);
    const recipesEdit = await Recipes.findOne(filter);
    // if (!recipesEdit) return 'missing';
    return recipesEdit;

};

const deletar = async (id, reqUser) => {
    const filter = { _id: id };

    if (!id) return 'missing';

  const recipe = await Recipes.findById(filter);


    if (reqUser.role !== 'admin' && reqUser.id !== recipe.userId) {
        return 'missing';
    }
    
    await Recipes.deleteOne(filter);
    return '';
};

module.exports = {
    list,
    find,
    create,
    edit,
    deletar,
    addImage,
};
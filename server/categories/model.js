const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
    name : {type:String, required:true, unique:true},
    createdAt :{ type: Date, default: Date.now },
});

const categories = mongoose.model('categories', categoriesSchema);

module.exports = {categories};



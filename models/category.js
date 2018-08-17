const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    },
    
})

const Category  =module.exports = mongoose.model('Category',CategorySchema);
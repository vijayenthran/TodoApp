const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contentsSchema = mongoose.Schema({
    content : {type:String, required:true},
    categoryname : {type:String, required:true},
    categoryid : { type: Schema.Types.ObjectId, ref: 'category', required: true},
    completed : {type:Boolean, required:true}
}, {timestamps: true});

const contents = mongoose.model('content', contentsSchema);



module.exports = {contents};

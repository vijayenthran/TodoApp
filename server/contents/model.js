const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const contentsSchema = mongoose.Schema({
    content : {type:String, required:true},
    categoryid : { type: Schema.Types.ObjectId, ref: 'category', required: true},
    completed : {type:Boolean, required:true},
    createdAt :{ type: Date, default: Date.now },
});

const contents = mongoose.model('content', contentsSchema);



module.exports = {contents};

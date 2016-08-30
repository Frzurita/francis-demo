var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bridge = new Schema({

    },
    {
        collection: 'bridges'
    });

module.exports = {
  ingrediente:mongoose.model('bridges', bridge)
};

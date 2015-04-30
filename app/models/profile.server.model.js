'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Profile Schema
 */
var ProfileSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Profile name',
		trim: true
	},
    image: {
        type: String,
        default: ''
        },
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	views: {
		type: Number,
		default: 0
	},
	likes: [{
	  type: Schema.ObjectId,
          ref: 'User'
	}]
});

mongoose.model('Profile', ProfileSchema);
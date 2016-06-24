'use strict';

let
	aop = require('./aop');

const acceptList = ['add', 'update', 'delete'];

let isGenerated;

let Service = function(collection)
{
	if (!(this instanceof Service)) return new Service(collection);
	this.collection = collection;

	if (!isGenerated)
		Generated(collection);
};

let Generated = function(src)
{

};


Service.prototype.findOne = function*()
{
	return aop(yield this.collection.findOne.apply(this.collection, arguments), acceptList);
};

Service.prototype.find = function*()
{
	return aop(yield this.collection.find.apply(this.collection, arguments), acceptList);
};



module.exports = Service;


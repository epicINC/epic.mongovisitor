'use strict';

let
	Vistor = require('epic.visitor');

let
	symbol = Symbol('epic.mongovisitor'),
	defaultHandler = e => e.forEach(item =>
	{
		item.object[symbol] || (item.object[symbol] = []);
		item.object[symbol].push(item)
		console.log(item);
	});


class MongoVisitor extends Vistor
{
	constructor(handler)
	{
		this.handler = handler || defaultHandler;
	}

	object(target, key, index, path)
	{
		super.object(target, key, index, path);
		Object.observe(target, handler);
	}

	array(target, key, index, path)
	{
		super.object(target, key, index, path);
		Array.observe(target, handler);
	}

}


module.exports = MongoVisitor;
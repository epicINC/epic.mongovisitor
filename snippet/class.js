'use strict';

let util = require('../util');

class Visitor
{

	visitor(target, key, index, path)
	{
		if (target === undefined || target === null) return;
		Array.isArray(target, key) ? this.array(target, key, index, path) : this[util.typeof(target)] && this[util.typeof(target)](target, key, index, path);
	};

	object(target, key, index, path)
	{
		Object.keys(target).forEach((name, index) => this.visitor(target[name], name, index, (path ? path + '.' : '') + name));
	};

	array(target, key, index, path)
	{
		target.forEach((val, index) => this.visitor(val, index, index, (path || '') +'['+ index +']'));
	};

};


class MongoVisitor extends Visitor
{

	object(target, key, index, path)
	{
		super.object(target, key, index, path);
		//console.log(target);
	};

	array(target, key, index, path)
	{
		super.array(target, key, index, path);
		//console.log(target);
	};

	number(target, key, index, path)
	{
		console.log(path);
	}

	boolean(target, key, index, path)
	{
		//console.log('boolean'+ target);
	}

}


let data = {id:'1', groups:{'g1':{id:'g1', ts:0}}};


var v = new MongoVisitor();

v.visitor(data);
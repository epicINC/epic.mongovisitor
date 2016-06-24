'use strict';

let
	debug = require('debug')('aop');

const
	symbol = Symbol('listen'),
	defaultHandler = e => e.forEach(item =>
	{
		item.object[symbol] || (item.object[symbol] = []);
		item.object[symbol].push(item)
		console.log(item);
	});


var Visitor = function()
{


};

Visitor.prototype.Visitor = function(target)
{

};

Visitor.prototype.VisitorObject = function(target)
{

};
Visitor.prototype.VisitorArray = function(target)
{

};




let arrayObserve = function(target, handler, acceptList)
{
	if (!target) return target;
	Array.observe(target, handler, acceptList);
	target.forEach(e => observe(e, handler));
	return target;
};
let objectObserve = function(target, handler, acceptList)
{
	if (!target || type(target) !== 'object') return target;
	Object.observe(target, handler, acceptList);
	Object.keys(target).forEach(e => observe(target[e], handler));
	return target;
};

let observe = function(target, handler, acceptList)
{

};

let aop = function(target, handler, acceptList)
{
	if (!target) return;
	if (Array.isArray(handler))
	{
		acceptList = handler;
		handler = undefined;
	}
	if (!handler)
		handler = defaultHandler;
	return observe(target, handler, acceptList);
}


aop.symbol = symbol;


module.exports = aop;



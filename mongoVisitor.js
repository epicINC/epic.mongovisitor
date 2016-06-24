'use strict';


var mongoVisitor = function(symbol)
{
	this.symbol = symbol;
};

mongoVisitor.prototype.build = function(target)
{
	return this.translate(this.visitorObject(target));
};

mongoVisitor.prototype.translate = function(val)
{
	if (!val) return;

	let result = {};

	if (val.add)
		this.copy(val.add, result['$set'] || (result['$set'] = {}));

	if (val.update)
		this.copy(val.update, result['$set'] || (result['$set'] = {}));

	if (val.delete)
		Object.with(result['$unset'] = {}, target => val.delete.forEach(e => target[e] = ''));

	return result;
};

mongoVisitor.prototype.copy = function(src, dest)
{
	if (!src) return dest;
	Object.keys(src).forEach(e => dest[e] = src[e]);
};

mongoVisitor.prototype.visitorObject = function(target, path, result)
{
	if (!target) return;
	var self = this;
	if (!result) result = {};

	if (Array.isArray(target))
		return target.map(e => self.visitorObject(e));

	target[self.symbol] && target[self.symbol].forEach(e =>
	{
		if (e.type === 'delete' || e.object[e.name] === undefined)
			return result['delete'] || (result['delete'] = []).push(path ? path +'.'+ e.name : e.name);

		result[e.type] || (result[e.type] = {});

		result[e.type][path ? path +'.'+ e.name : e.name] = e.object[e.name];
	});

	Object.keys(target).forEach(e =>
	{
		if (typeof(target[e]) !== 'object') return;
		return self.visitorObject(target[e], path ? path +'.'+ e : e, result);
	})

	return result;
};


module.exports = function(aop)
{
	return new mongoVisitor(aop.symbol || app);
};
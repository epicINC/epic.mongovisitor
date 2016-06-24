'use strict';

const
	operatorHandler = new Map();
/*
operatorHandler.add('==', EqualFunc);
operatorHandler.add('exists', ExistsFunc);
operatorHandler.add('!=', NotEqualFunc);

*/

let QueryBuilder = function()
{

};

QueryBuilder.prototype.build = function(query, opts)
{
	Object.keys(query).forEach(e =>
	{
		

	})
};


// https://github.com/facebook/jstransform/blob/master/visitors/es6-arrow-function-visitors.js
let
	// query = {members:['123', '321']}
	query = e => e.id.$exists(false) && e.members in ['123', '321'];
	analyzer = new QueryBuilder();


console.log(query.toString());
'use strict';

let
	aop = require('./aop'),
	visitor = require('./mongoVisitor')(aop),
	Service = require('./service'),
	provider = require('mongo.provider')('mongodb://127.0.0.1:27017/LXTGroup', ['Group', 'Storage', 'Groupv4','Userv4', 'Storagev4']);


provider.service(require('./service'));


provider.use(function*(ctx)
{

	var user = yield ctx.Userv4.findOne({});

	delete user.groups['53e34e95033bd91794192505'];
	user.groups['53e34e4c033bd9179419231d'].as = 4321;
	user.groups['test'] = {id:'test', as: 12345};

	setImmediate(() =>
	{
		let result = visitor.build(user);
		console.log(result);
	});

});


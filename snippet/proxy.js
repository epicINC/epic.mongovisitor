const debug = require('debug')('EpicProxy');

let group = {
    "id" : "f44b96a58d2d85eaf07b435b7506b5c8",
    "name" : "test",
    "creator" : "1000+005056BF4D75-test2",
    "type" : 0,
    "invite" : 0,
    "auth" : 1,
    "ignores" : [],
    "intro" : "",
    "notice" : "",
    "managers" : [ 
        "1000+005056BF4D75-test2", 'a', 'b', 'c'
    ],
    "members" : {
        "1000+005056BF4D75-test2" : {
            "id" : "1000+005056BF4D75-test2",
            "alias" : "",
            "ts" : 1466060102637
        },
        "1000+005056BF4D75-test1t" : {
            "id" : "1000+005056BF4D75-test1t",
            "alias" : "",
            "ts" : 1466060102637
        }
    },
    "tags" : [],
    "ver" : 1,
    "ts" : 1466060102637,
    "as" : 1466060102637,
    "test" : 1
};

const ignoredProperties = {
	array: new Set(['length'])
}


let schema = require('./modelLoader')

const ArrayFunctions = new Set(['splice', 'push', 'pop', 'unshift', 'shift'])

// https://github.com/anywhichway/proxy-observe/blob/master/index.js
const ArrayHandler = path => ({
		get (target, name, receiver) {
			if (ArrayFunctions.has(name))
				return function () {
					return Reflect.apply(Array.prototype[name], target, arguments);
				};


			return target[name];
		},
		set (target, name, value, receiver) {
			console.log('set', arguments);
			return true;
		},
		deleteProperty (target, name) {
			console.log('del', arguments);
			return true;
		}
	}
);


let p = EpicProxy([1,2,3], ArrayHandler());

pp]

console.log(p);


const ObjectHandler = path => ({
	get (target, name, receiver) {
		// debug('get', name, typeof(target[name]));
		if (typeof(target[name]) === 'object') return new Proxy(target[name], handler((path || []).concat(name)))

		return target[name];
	},
	set (target, name, value, receiver) {
						console.log(path);
		let property = schema.cache.get(path.join('.'));
		if (isIgnored(property, name)) return true;



		if (!target.hasOwnProperty(name))
			changes.push(['add', path, name, target[name], value]);
		else
			changes.push(['set', path, name, target[name], value]);
		debug(changes[changes.length - 1]);
		target[name] = value;
		return true;
	},
	deleteProperty (target, name) {
		changes.push(['del', path, name, target[name]]);
		debug(changes[changes.length - 1]);

		let property = schema.cache.get(path.join('.'));
		if (property && property.type === 'array')
			target.splice(name);
		else
			delete target[name];

		return true;
	}
});

const findProperty = (path, name) => {
	let result = schema.cache.get(path.join('.'));
	if (!result) return;

};

const isIgnored = (property, name) => {
	if (!property) return;
	return ignoredProperties[property.type] && ignoredProperties[property.type].has(name);
};

function EpicProxy (data, handler) {
	let changes = [];




	return new Proxy(data, handler);

}

/*
object:
{name: '', object: {}, type: '', oldValue: ''};
["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]

array:
{name: '', object: {}, type: '', oldValue: '', index: 0, removed: '', addedCount: ''};
["add", "update", "delete", "splice"]
// [{type: 'splice', object: <arr>, index: 1, removed: ['B', 'c', 'd'], addedCount: 3}]
*/[
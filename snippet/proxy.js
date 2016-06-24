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


let p = EpicProxy(group);
p.managers.push(11111);
console.log(p.managers, p.managers.length);




function EpicProxy (data, handler) {

	let findProperty = (path, name) => {
		let result = schema.cache.get(path.join('.'));
		if (!result) return;

	};

	let isIgnored = (property, name) => {
		if (!property) return;
		return ignoredProperties[property.type] && ignoredProperties[property.type].has(name);
	}

	let changes = [];

	let defaultHandler = path => ({
			get (target, name, receiver) {
				// debug('get', name, typeof(target[name]));
				if (typeof(target[name]) === 'object') return new Proxy(target[name], handler((path || []).concat(name)))

				return target[name];
			},
			set (target, name, value, receiver) {
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
		}
	);

	handler = handler || defaultHandler;

	return new Proxy(data, handler());

}
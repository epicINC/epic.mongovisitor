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
        "1000+005056BF4D75-test2", 'a', 'b'
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


class ObjectObserver {

	//  acceptlist:
	//  ["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]
	constructor (callback, acceptlist) {
		if (acceptlist !== undefined) {
			let set = new Set(acceptlist);
			this.isAccept = type => set.has(type);
		}
		else
			this.isAccept = () => true;

		this.callback = callback;
	}

	set (target, property, value, receiver) {
		let
			type = target.hasOwnProperty(property) ? 'update' : 'add',
			oldValue = target[property];

		target[property] = value;

		if (this.isAccept(type))
			this.callback({name: property, object: target, type: type, oldValue: oldValue});

		return true;
	}

	deleteProperty (target, property) {
		let oldValue = target[property];
		delete target[property];

		if (this.isAccept('delete'))
			this.callback({name: property, object: target, type: 'delete', oldValue: oldValue});

		return true;		
	}

	defineProperty (target, property, descriptor) {
		Object.defineProperty(target, property, descriptor);
		if (this.isAccept('reconfigure'))
			this.callback({name: property, object: target, type: 'reconfigure'});

		return true;
	}

	setPrototypeOf (target, prototype) {
		let oldvalue = Object.getPrototypeOf(target);
		Object.setPrototypeOf(target, prototype);

		if (this.isAccept('setPrototype'))
			this.callback({name: '__proto__', object: target, type: 'setPrototype', oldValue: oldvalue});

		return true;
	}

	preventExtensions (target) {
		Object.preventExtensions(target);
		if (this.isAccept('preventExtensions'))
			this.callback({object: target, type: 'preventExtensions'});

		return true;
	}
}

class ArrayObserver extends ObjectObserver {

	//  acceptlist:
	//  ["add", "update", "delete", "splice"]
	constructor (callback, acceptlist) {
		super(callback, acceptlist);
	}

	get (target, property, receiver) {
		if (property === 'splice') {
			return this.splice(this, target);

		}

		if (property === "push") {
			 return function (...item) {
		    	this.splice(this.length, 0, ...item);
		    	return item.length;
		    }
    }

    if (property === "pop") {
			 return function () {
		    	return this.splice(this.length - 1, 1)[0];
		    }
    }

    if(property === "unshift") {
			 return function (...item) {
	    		this.splice(0, 0, ...item);
	    		return item.length;
	    	}
		}

		if(property === "shift") {
			return function () {
	    		return this.splice(0, 1)[0];
	    	}
		}

		return target[property];
	}

	splice (self, target) {
		return function (start, deleteCount, ...items) {
			let removed = deleteCount === undefined ? target.splice(start) : target.splice(start, deleteCount, ...items);
			if (self.isAccept('splice'))
				self.callback({object: target, type: 'splice', index: start, removed: removed, addedCount: items.length});
			return removed;
		}
	}

	set (target, property, value, receiver) {
		if (property === 'length') {
			this.splice(this, target)(value);
			return true;
		}

		if (isNaN(property)) {
			this.callback({name: property, object: target, type: 'add', oldValue: oldValue});
		} else if (property < target.length) {
			let oldValue = target[property];
			target[property] = value;
			if (this.isAccept('update'))
				this.callback({name: property, object: target, type: 'update', oldValue: oldValue});
		} else {
			let item = [];
			item[property - target.length] = value;
			this.splice(this, target)(target.length, 0, ...item);
		}
		return true;
	}
}



function observe(target, callback, acceptlist) {

	if (target instanceof  Array || Array.isArray(target))
		return new Proxy(target, new ArrayObserver(callback, acceptlist));
	else
		return new Proxy(target, new ObjectObserver(callback, acceptlist));
}


function deepObserve(target, callback, acceptlist, ...parts) {
	Object.keys(target).forEach(e => {
		if(target[e] instanceof Object) {
				target[e] = deepObserve(target[e], callback, acceptlist, ...parts.concat(e));
		}
	});

	return observe(target, data => {
		data.parts = parts;
		callback(data);
	}, acceptlist, ...parts);
};



let proxy = deepObserve(group, data => {
	console.log(data);
});

proxy.members['1000+005056BF4D75-test2'].id = 'fadfasd';


/*
object:
{name: '', object: {}, type: '', oldValue: ''};
["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]

array:
{name: '', object: {}, type: '', oldValue: '', index: 0, removed: '', addedCount: ''};
["add", "update", "delete", "splice"]
// [{type: 'splice', object: <arr>, index: 1, removed: ['B', 'c', 'd'], addedCount: 3}]
*/
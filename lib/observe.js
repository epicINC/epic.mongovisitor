const debug = require('debug')('epic.observe');

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
		// not number
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

function deep(target, callback, acceptlist, ...parts) {
	Object.keys(target).forEach(e => {
		if(target[e] instanceof Object) {
				target[e] = deep(target[e], callback, acceptlist, ...parts.concat(e));
		}
	});

	return observe(target, data => {
		data.parts = parts;
		callback(data);
	}, acceptlist, ...parts);
};

observe.deep = deep;


module.exports = observe;



/*
object:
{name: '', object: {}, type: '', oldValue: ''};
["add", "update", "delete", "reconfigure", "setPrototype", "preventExtensions"]

array:
{name: '', object: {}, type: '', oldValue: '', index: 0, removed: '', addedCount: ''};
["add", "update", "delete", "splice"]
// [{type: 'splice', object: <arr>, index: 1, removed: ['B', 'c', 'd'], addedCount: 3}]
*/
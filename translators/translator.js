
class Translator {


	join (parts) {
		if (parts.length === 1) return parts[0];
		return parts.join('.');
	}

	add (change) {
		let path =  this.join(change.parts.concat(change.name));
		return {$set: {[path]: change.value }};		
	}


	delete (change) {
		let path =  this.join(change.parts.concat(change.name));
		return {$unset: {[path]: ''}};
	}

	update (change) {
		let path =  this.join(change.parts.concat(change.name));
		return {$set: {[path]: change.value}};
	}

	splice (change) {
		let path =  this.join(change.parts);
		
		if (change.addedCount)
		{
			if (change.value.length === 1)
				return {$push: {[path]: change.value}};
			else
				return {$push: {[path]: {$each: change.value} }};
		}
		if (change.removed.length)
		{
			if (change.object.length === 0)
				return {$set: {[path]: []}};

			let result = {$unset:{}};
			change.removed.forEach((e, i) => {
				result['$unset'][path +'.'+ (change.index + i)] = '';
			});
			return result;
		}

		console.log('change', change);
	}


	translateOne (change) {
		return this[change.type] && this[change.type](change);
	}

	translate (changes) {
		return changes.map(this.translateOne.bind(this));
	}
}


module.exports = Translator;



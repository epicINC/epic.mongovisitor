
class optimizer {

	static distinct (changes) {
		let result = [];
		changes.forEach(e => {
			
		});
	}
}



class Translator {


	path (parts) {
		if (parts.length === 1) return parts[0];
		return parts.join('.');
	}

	add (change) {
		let path =  this.path(change.parts.concat(change.name));
		return {$set: {[path]: change.value }};		
	}


	delete (change) {
		let path =  this.path(change.parts.concat(change.name));
		return {$unset: {[path]: ''}};
	}

	update (change) {
		let path =  this.path(change.parts.concat(change.name));
		return {$set: {[path]: change.value}};
	}

	splice (change) {
		let path =  this.path(change.parts);
		
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
	}


	translateOne (change) {
		return this[change.type] && this[change.type](change);
	}

	translate (changes) {
		this.optimize(changes);
		return changes.map(this.translateOne.bind(this));
	}


	optimize (changes) {
		if (changes.length === 1) {

		}
		
		let result = {}, path;
		changes.forEach(e => {
			path = this.path(e.type === 'splice' ? e.parts : e.parts.concat(e.name));
			result[path] = result[path] || [];
			result[path].push(e);
		});

		Object.keys(result).map(e => result[e]).reduce((previous, current, index, array)=> {
			if (e.type === 'delete' && i > 0)
				return array.splice(0, i + 1);


		})
		console.log(result);
	}

	optimize1 (changes) {
		let result = [], remove = [];
		changes.reduce((previous, current, index, array) => {

			Object.keys(current).forEach(e => {
      		this.merge(previous, current, e);
			});
			if (Object.keys(current).length === 0) {
				remove.push(index);
				return previous;
			}

			return current;
    });
    remove.forEach((e, i)=> {
    	changes.splice(e - i, 1);
    });

		return changes;
	}

	merge1 (left, right, key)
	{
		if (!left[key])
		{
			left[key] = right[key];
			delete right[key];
			return;
		}

		Object.keys(right[key]).forEach(e => {
			left[key][e] = right[key][e];
			delete right[key][e];
		});

		if (Object.keys(right[key]).length === 0)
			delete right[key];
	}


}


module.exports = Translator;




class optimizer {


	static optimize(changes) {
		this.normalize(changes);
		this.distinct(changes);
		this.combine(changes);
	}

	static path (parts) {
		if (parts.length === 1) return parts[0];
		return parts.join('.');
	}

	static normalize(changes) {
		changes.forEach(e => e.path = this.path(e.type === 'splice' ? e.parts : e.parts.concat(e.name)));
	}

	static distinct (changes) {
		let remove, item;
		for (let index = changes.length - 1; index > -1; index--) {
			item = changes[index];
			if (item.type === 'splice') {
				if (item.value.length === 0)
					remove = this.findPrevious(changes, (e, i) => i < index && e.path.startsWith(item.path));					

			} else if (item.type === 'delete')
				remove = this.findPrevious(changes, (e, i) => i < index && e.path.startsWith(item.path));
			else
				remove = this.findPrevious(changes, (e, i) => i < index && e.path.startsWith(item.path));

			if (!remove || remove.length === 0) continue;
			index -= remove.length;
			remove.forEach((e, i) => changes.splice(e - i, 1));
		}


	}

	static findPrevious(changes, predicate) {
		let result = [];
		changes.forEach((e, i) => {
			if (predicate(e, i)) result.push(i);
		});
		return result;
	}

	static combine (changes) {
		let result = [], item = [];
		changes.reduce((previous, current, index, array) => {
			if (previous.path === current.path)
			{
				result.push(...item);
				item.length = 0;
			}
			else
			{
				item.push(current)
			}
			return current;
		});
		if (item.length !== 0) result.push(item);
		console.log(result);
		return result;
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


	one (change) {
		return this[change.type] && this[change.type](change);
	}

	translate (changes) {
		optimizer.optimize(changes);
		return changes.map(this.one.bind(this));
	}




}


module.exports = Translator;



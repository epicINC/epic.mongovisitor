
function loader(name) {
	let result = require('./'+ name), item;
	result.cache = new Map();
	result.indexs = [];
	Object.keys(result.properties).forEach(e => {
		item = result.properties[e];
		if (Array.isArray(item.type)) {
			item.elementType = item.type[0];
			item.type = 'array';
		}
		if (item.index === true || item.id === true) {
			if (item.id === true) result.id = item;
			result.indexs.push(item);
		}

		result.cache.set(e, item);
	});

	return result;
}



module.exports = loader('group');
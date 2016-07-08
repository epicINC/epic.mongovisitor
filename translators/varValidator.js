const ReservedWords = new Set([
// ES3
	'int',
	'byte',
	'char',
	'goto',
	'long',
	'final',
	'float',
	'short',
	'double',
	'native',
	'throws',
	'boolean',
	'abstract',
	'volatile',
	'transient',
	'synchronized',
// ES6 
	'do',
	'if',
	'in',
	'for',
	'let',
	'new',
	'try',
	'var',
	'case',
	'else',
	'enum',
	'eval',
	'false',
	'null',
	'this',
	'true',
	'void',
	'with',
	'await',
	'break',
	'catch',
	'class',
	'const',
	'super',
	'throw',
	'while',
	'yield',
	'delete',
	'export',
	'import',
	'public',
	'return',
	'static',
	'switch',
	'typeof',
	'default',
	'extends',
	'finally',
	'package',
	'private',
	'continue',
	'debugger',
	'function',
	'arguments',
	'interface',
	'protected',
	'implements',
	'instanceof']);

const Operators = new Set([
	' ',
	'	',
	'*',
	'/',
	'%',
	'+',
	'-',
	'!',
	'<',
	'>',
	'=',
	'&',
	'|',
	'?',
	':',
	',',
	'~',
	'^',
	'#',
	"'",
	'\\'
	]);

const isNumberStart(code) {
	return code > 47 && code < 58;
}

module.exports = function (name) {
	if (isNumberStart(name.charCodeAt(0))) return false;
	if (ReservedWords.has(name)) return false;
	for (var i = 0; i < name.length; i++) {
		if (Operators.has(name[i])) return false;
	}
	return true;
}



 


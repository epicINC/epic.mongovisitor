'use strict';

let test = [1,2,3,4];


Array.observe(test, e =>
{
	console.log(e);
});

test[0] = 2;


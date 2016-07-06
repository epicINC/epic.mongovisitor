require('proxy-observe');


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

 

let map = new Map();

let o = Object.deepObserve(group, changes => {
	console.log(this);
	if (!map.has(group))
		return map.set(group, [changes]);
	let result = map.get(group);
	result.push.apply(result, changes);
}, ['Group']);


let translate = function(data) {
	console.log(map.size, map.get(data));
}

o.members['1000+005056BF4D75-test2'].id = 1;

setTimeout(() => {

	translate(group);

}, 10);
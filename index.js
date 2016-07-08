const observe = require('./lib/observe');
const Translator = require('./translators/translator');


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
        "1000+005056BF4D75-test2", '1', '2', '3', '4'
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

const receiver = function (target, acceptlist) {

    let result = observe.deep(group, change => {
        if (!map.has(result))
            map.set(result, []);
        if (change.type === 'splice')
        {
            if (change.addedCount) {
                if (change.addedCount === 1)
                    change.newValue = change.object[change.index];
                else
                    change.newValue = change.object.slice(change.index, change.index + change.addedCount);
            }                
        } else if (change.type === 'update') {
            change.newValue = change.object[change.name];
        }
        map.get(result).push(change);
    });

    return result;
}

let translator = new Translator();

const trackChanges = function (proxy) {
    if (!map.has(proxy)) return;
    let result = translator.translate(map.get(proxy));
    console.log(require('util').inspect(result, { showHidden: false, depth: null }));

    map.set(proxy, []);
}


let proxy = receiver(group);

proxy.managers.push(1);
proxy.managers.pop();
proxy.managers.push(4);
proxy.managers.splice(2, 3);
proxy.managers[6] = 'a';
proxy.managers.length = 0;
proxy.managers = [1,2,3];
delete proxy.managers[3];
trackChanges(proxy);
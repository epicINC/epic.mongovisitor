const observe = require('../lib/observe');

let data = require('./data.json');


let proxy = observe.deep(data, e => {
	console.log('case1', e.type, e.name);
});






return;
describe('direct', () => {


	it('add', done => {

		let proxy = observe.deep(data, e => {
			//e.type.should.eql('add');
			done();
		});
		proxy.test = 1;
	});

	it('update', done => {

		let proxy = observe.deep(data, e => {
			console.log(e);
			//e.type.should.eql('update');
			//done();
		});
		proxy.id = 1;
	});


});


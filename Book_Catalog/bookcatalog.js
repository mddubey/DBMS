var catalog = require('./library-catalog.js').catalog;


var main = function() {
	var arguments = process.argv.slice(2);
	try{
		var input = catalog.getUserInput(arguments);
	}
	catch(err){
		return err;
	}
	return catalog.manageOperation(input);	
};
console.log(main());
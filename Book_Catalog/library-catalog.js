var catalog = {};
exports.catalog = catalog;
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'mritunjay',
  password : '12345',
  database : 'test',
});

var createLine = function(book){
	var keys = Object.keys(book);
	var fields = [book.isbn,book.price,book.author,book.title,book.publisher,book.noOfPages];
	fields = fields.map(function(field){
		return field || '--';
	});
	var line = fields.join('\t\t');
	return line;
};

catalog.formatList = function(rows){
	var head = ['ISBN\t\tPrice\t\tAuthor\t\t\tTitle\t\t\tPublisher\t\tNo of Pages'];
	var lines = [];
	rows.forEach(function(row){
		lines.push(createLine(row));
	});
	lines = head.concat(lines);
	return lines;
};

catalog.getList = function(){	
	var sql = 'select isbn,title,price,author,publisher,noOfPages from bookCatalog';
	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log(catalog.formatList(rows).join('\r\n'));
		});
	connection.end();
	return '';
}

var isNotInArray = function(msg,arr,text){
	if(arr.indexOf(text)==-1)
		throw msg;
};

var getPart = function(text){
	return text.slice(text.indexOf(':')+1);
};

var assignKeyValue = function(fields,result){
	return function(key){
		fields.forEach(function(text){
			if(text.slice(0,key.length+1)==(key+':'))
				result[key] = getPart(text).trim();
		});
	};
};

catalog.getBookDetails = function(record){
	var fields = record.split(';');
	var result = {isbn:'',price:0,author:'',title:'',publisher:'',noOfPages:0};
	var keys = ['isbn','price','author','title','publisher','noOfPages'];
	keys.forEach(assignKeyValue(fields,result));
	return result;
};

var isIsbnPresent = function(record,result){
	if(record.isbn == '""' || !record.isbn)
		throw result.msg = 'isbn cannot be null or blank';
};

catalog.addBookDetails = function(record){
	var result = {msg:'',record:''};
	var recordToSave = catalog.getBookDetails(record);	
	isIsbnPresent(recordToSave,result);
	var isbnGiven = recordToSave.isbn;
	var sql =
	 'INSERT INTO bookCatalog(isbn,title,price,author,publisher,noOfPages) VALUES ("'
	 	+recordToSave.isbn+'","'+recordToSave.title+'",'+recordToSave.price+',"'+
	 	recordToSave.author+'","'+recordToSave.publisher+'",'+recordToSave.noOfPages+')';

	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log('book added successfully:--',recordToSave.isbn);
	});
	connection.end();	
	return '';
};

catalog.deleteRecord = function(isbnNo){
	var sql = 'DELETE from bookCatalog where isbn = '+isbnNo;
	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log('book removed successfully:--',isbnNo);
	});
	connection.end();
	return '';
};

catalog.searchGeneric = function(record){
	var sql = 'select isbn,title,price,author,publisher,noOfPages from bookCatalog where isbn like "%'+
			   record + '%" or author like "%'+ record + '%" or title like "%'+ record + '%" or publisher like "%'+
			   record + '%"';
	console.log(sql);
	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log(catalog.formatList(rows).join('\r\n'));
	});
	connection.end();
	return '';
}

catalog.searchSpecific = function(option,record){
	var sql = 'select isbn,title,price,author,publisher,noOfPages from bookCatalog where '+option+' like "%'+record+'%"';
	console.log(sql);
	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log(catalog.formatList(rows).join('\r\n'));
	});
	connection.end();
	return '';
}

catalog.getBookUpdationDetails = function(record){
	var fields = record.split(';');
	var result = {};
	var keys = ['isbn','price','author','title','publisher','noOfPages'];
	keys.forEach(assignKeyValue(fields,result));
	console.log(result);
	return result;
};

catalog.updateRecord = function(record){
	var details = catalog.getBookUpdationDetails(record);
	var sql = 'update bookCatalog set price = '+ details.price +',author = "'+ details.author 
				+'",publisher = "'+ details.publisher +'",title = "'+ details.title +'",noOfPages = '+
				details.noOfPages +' where isbn = "'+details.isbn+'"';
	console.log(sql);
	connection.connect();
	connection.query(sql, function(err, rows, fields) {
	  	if (err) throw err;

	  	console.log('book details updated:--',details.isbn);
	});
	connection.end();
	return '';
}

//**************************************Validations for getUserInput********************
var record_validation = function(argv,result,issearch){
	if(!result.record || result.record == ''){						
		throw 'option '+argv[0]+' needs a record';			
	};
};
var illegal_options = function(argv){
	var inputPossible = ['add','remove','list','search','update','tags'];
	var msg = 'invalid option '+argv[0];
	isNotInArray(msg,inputPossible,argv[0]);
};
var simple_validation = function(argv,result){
	result.record = argv[1];
	record_validation(argv,result);
};
var remove_validation = function(argv,result){
	if(argv.length<3)
			throw 'unrecognize format\nUsage remove -isbn [isbnKey]';
	if(argv[1]!='-isbn')
		throw 'illegal option '+argv[1];
	result.record = argv[2].trim();
	record_validation(argv,result);
};
var getSearchOptions = function(argv,result){
	argv[1] = argv[1].replace('-tag','-Tags');
	result.option = argv[1].slice(1);
	result.mode = 'searchSpecific';
}
var search_validation = function(argv,result){
	var secondArg = ['-isbn','-author','-title','-publisher','-tag'];
	if(argv.length<=2)
		result.record = argv[1];
	else{
		var msg = 'there is no information about field '+argv[1];
		isNotInArray(msg,secondArg,argv[1]);
		result.record = argv[2];
		getSearchOptions(argv,result);
	};
	if(result.record==null)
		throw 'option '+argv[0]+' needs a record';
};
var tag_validation = function(argv,result){
	var message = 'no option found\nUsage: node bookcatalog tags [OPTION]...'
	isNoOption(argv.slice(1),message);
	var msg = 'option tags does not support an option as '+argv[1]
	isNotInArray(msg,['add','remove','list'],argv[1]);
	result.mode = argv[0]+argv[1];
	result.record = argv[2];
	if(result.mode!='tagslist')
		record_validation(argv,result);
	return result;
};
var isNoOption = function(argv,msg){
	if(argv.length==0)
		throw msg;
};
//**************************************Validations for getUserInput********************
catalog.getUserInput = function(argv){
	var result = {};
	var validation = {
		add:function(){return simple_validation(argv,result)},
		remove:function(){return remove_validation(argv,result)},
		search:function(){return search_validation(argv,result)},
		list:function(){return;},
		update:function(){return simple_validation(argv,result);},
	};
	var msg = 'no option found\nUsage: node bookcatalog [OPTION]...'
	isNoOption(argv,msg);
	result.mode = argv[0];

	illegal_options(argv);
	validation[result.mode]();
	return result;
};
// //******************************************************************
catalog.manageOperation = function(input){	
	var record = input.record;
		var operations = {
		list:function(){return catalog.getList();},
		add:function(){return catalog.addBookDetails(record);},
		remove:function(){return catalog.deleteRecord(record);},
		search:function(){return catalog.searchGeneric(record);},
		searchSpecific:function(){return catalog.searchSpecific(input.option,record);},
		update:function(){return catalog.updateRecord(record);}

	};	
	try{
		return operations[input.mode]();
	}
	catch(err){
		if(err.msg && err.record)
			return createMessage(err);
		else
			return err;
	};	
};

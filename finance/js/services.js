var financeServices = angular.module('financeServices', ['ngResource']);

financeServices.factory('SearchCriteria', function(){

	var observers = [];
	
	function subscribeObserver(callback){
		observers.push(callback);
	};
	
	function notifyObservers(startDate, endDate){
		observers.map(function(callback){
			callback(startDate, endDate);
		});
	};

	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	
	function padZeros(field){
		field = field + '';
		return field.length < 2 ? '0' + field : field;
	};
	
	function formatDate(date){
		return date.getFullYear() + '-' + 
			padZeros(date.getMonth()+1) + '-' + 
			padZeros(date.getDate());
	};
	
	var beginMonth = formatDate(new Date(year, month, 1));
	var endMonth = formatDate(new Date(year, month+1, 0));

	function firstDayOfMonth(){
		return beginMonth;
	};
	
	function lastDayOfMonth(){
		return endMonth;
	};
	
	function setDates(startDt, endDt){
		//startDate = startDt;
		//endDate = endDt;
		notifyObservers(startDt, endDt);
		//alert('in DatePickerService. Start Date is now set to: '+startDate+' and End Date is now set to: '+endDate);
	};
	
	return {
		firstDayOfMonth: firstDayOfMonth, 
		lastDayOfMonth: lastDayOfMonth,
		setDates: setDates, 
		subscribeObserver: subscribeObserver
	}
});

financeServices.factory('Expenses', ['$resource',
	function($resource){
		return $resource('http://linuxbox/transactions/expenses/:id');
}]);

financeServices.factory('Incomes', ['$resource',
	function($resource){
		return $resource('http://linuxbox/transactions/incomes/:id');
}]);

financeServices.factory('ExpenseItems', ['$resource',
	function($resource){
		return $resource('http://linuxbox/budget/expenses/:id');
}]);

financeServices.factory('IncomeItems', ['$resource',
	function($resource){
		return $resource('http://linuxbox/budget/incomes/:id');
}]);

financeServices.factory('TransactionsReport', ['$resource',
	function($resource){
		return $resource('http://linuxbox/reports/transactions');
}]);

financeServices.service('Utils', function(){
	
	function saveAllInputRows(rowsToSave, saveFunction){
		var iteratorArray = rowsToSave.slice(0);
		iteratorArray.map(function(saveItem){
			saveFunction(saveItem);
		});
	};
	
	function isEmpty(thing){
		return thing == '';
	};
	
	function isMalformedDate(tDate){
		re = /^\d\d\d\d-\d\d-\d\d$/;
		return !tDate.match(re);
	};
	
	function deleteRow(item, rowsWithItem){
		var idx = rowsWithItem.indexOf(item);
		rowsWithItem.splice(idx, 1);
	};
	
	function focusOnButton(buttonId){
		document.getElementById(buttonId).focus();
	};
	
	return {
		saveAllInputRows : saveAllInputRows, 
		isEmpty : isEmpty,
		isMalformedDate : isMalformedDate, 
		deleteRow: deleteRow, 
		focusOnButton: focusOnButton
	}	
});

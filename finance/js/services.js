var financeServices = angular.module('financeServices', ['ngResource']);

financeServices.service('DateRange', function(){
	
	function padZeros(field){
		field = field + '';
		return field.length < 2 ? '0' + field : field;
	}	

	function formatDate(date){
		return date.getFullYear() + '-' + 
			padZeros(date.getMonth()+1) + '-' + 
			padZeros(date.getDate());
	}
	
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();

	this.beginMonth = formatDate(new Date(year, month, 1));
	this.endMonth = formatDate(new Date(year, month+1, 0));
		
	this.startDate = this.beginMonth;
	this.endDate = this.endMonth;
	this.setDates = function(startDt, endDt){
		this.startDate = startDt;
		this.endDate = endDt;
		//alert('in DatePickerService. Start Date is now set to: '+this.startDate+' and End Date is now set to: '+this.endDate);
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

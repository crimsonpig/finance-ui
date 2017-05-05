var financeServices = angular.module('financeServices', ['ngResource']);

financeServices.factory('ViewChangeCallbacks', function(){
	
	var viewChangeListeners = [];
	
	function changeToView(newViewName){
		viewChangeListeners.map(function(whenViewChanges){
			whenViewChanges(newViewName);
		});
	};
	
	function addViewChangeListener(callbackFunction){
		viewChangeListeners.push(callbackFunction);
	};
	
	return {
		changeToView: changeToView,
		addViewChangeListener: addViewChangeListener
	}
});

financeServices.factory('SearchCriteria', function(){

	var observers = [];
	
	function subscribeObserver(callback){
		observers.push(callback);
	};
	
	function notifyObservers(startDate, endDate, category){
		observers.map(function(callback){
			callback(startDate, endDate, category);
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

	var startDate = beginMonth;
	var endDate = endMonth;
	var category = '';
	
	function firstDayOfMonth(){
		return beginMonth;
	};
	
	function lastDayOfMonth(){
		return endMonth;
	};

	function search(startDt, endDt, category){
		this.startDate = startDt;
		this.endDate = endDt;
		this.category = category;
		notifyObservers(startDt, endDt, category);
		//alert('in DatePickerService. Start Date is now set to: '+this.startDate+' and End Date is now set to: '+this.endDate);
	};
	
	return {
		firstDayOfMonth: firstDayOfMonth, 
		lastDayOfMonth: lastDayOfMonth,
		startDate: startDate,
		endDate: endDate,
		category: category, 
		search: search, 
		subscribeObserver: subscribeObserver
	}
});

financeServices.factory('Transactions', ['$resource',
	function($resource){
		return $resource('http://localhost:8080/transactions/:id');
}]);

financeServices.factory('BudgetItems', ['$resource',
	function($resource){
		return $resource('http://localhost:8080/budget/:id');
}]);

financeServices.factory('TransactionsReport', ['$resource',
	function($resource){
		return $resource('http://localhost:8080/reports/transactions');
}]);

financeServices.factory('BudgetComparison', ['$resource',
	function($resource){
		return $resource('http://localhost:8080/comparison');
}]);

financeServices.service('Utils', function(){

	function isEmpty(thing){
		return thing == null || thing == '';
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
		isEmpty : isEmpty,
		isMalformedDate : isMalformedDate, 
		deleteRow: deleteRow, 
		focusOnButton: focusOnButton
	}	
});

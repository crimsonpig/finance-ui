var reportControllers = angular.module('reportControllers', []); 

reportControllers.controller('ReportCtrl', ['$scope', 'ViewChangeCallbacks', 'SearchCriteria', 'TransactionsReport', 
	function($scope, ViewChangeCallbacks, SearchCriteria, ReportDataService) {
		ViewChangeCallbacks.changeToView('summary');

		function reloadReportCallback(startDate, endDate, category){
			$scope.report = {expenses:[], incomes:[]};
			if(startDate != '' && endDate != ''){
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				$scope.report = ReportDataService.get(searchCriteria);
			}			
		};
		
		SearchCriteria.subscribeObserver(reloadReportCallback);

		reloadReportCallback(SearchCriteria.startDate, SearchCriteria.endDate, SearchCriteria.category);
		
		$scope.expOrderProp = 'category';
		$scope.expOrderToggle = false;
		$scope.incOrderProp = 'amount';
		$scope.incOrderToggle = false;		
		$scope.showIncomes = true;
		$scope.showExpenses = true;		

		$scope.displayIncomes = function(){
			$scope.showIncomes = !($scope.showIncomes);
		};

		$scope.displayExpenses = function(){
			$scope.showExpenses = !($scope.showExpenses);
		};

		$scope.sortReportItemsBy = function(reportType, fieldName){
			if(reportType == 'expenses'){
				if($scope.expOrderProp == fieldName){
					$scope.expOrderToggle = !($scope.expOrderToggle);
				}else{
					$scope.expOrderProp = fieldName;
					$scope.expOrderToggle = false;
				}
			}
			else if(reportType == 'incomes'){
				if($scope.incOrderProp == fieldName){
					$scope.incOrderToggle = !($scope.incOrderToggle);
				}else{
					$scope.incOrderProp = fieldName;
					$scope.incOrderToggle = false;
				}
			}
		}
}]);


reportControllers.controller('BudgetReportCtrl', ['$scope', 'ViewChangeCallbacks', 'SearchCriteria', 'BudgetReport', 
	function($scope, ViewChangeCallbacks, SearchCriteria, ReportDataService) {
		ViewChangeCallbacks.changeToView('budgetsummary');

		function reloadReportCallback(startDate, endDate, category){
			$scope.report = {expenses:[], incomes:[]};
			if(startDate != '' && endDate != ''){
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				$scope.report = ReportDataService.get(searchCriteria);
			}			
		};
		
		SearchCriteria.subscribeObserver(reloadReportCallback);

		reloadReportCallback(SearchCriteria.startDate, SearchCriteria.endDate, SearchCriteria.category);
		
		$scope.expOrderProp = 'category';
		$scope.expOrderToggle = false;
		$scope.incOrderProp = 'amount';
		$scope.incOrderToggle = false;		
		$scope.showIncomes = true;
		$scope.showExpenses = true;		

		$scope.displayIncomes = function(){
			$scope.showIncomes = !($scope.showIncomes);
		};

		$scope.displayExpenses = function(){
			$scope.showExpenses = !($scope.showExpenses);
		};

		$scope.sortReportItemsBy = function(reportType, fieldName){
			if(reportType == 'expenses'){
				if($scope.expOrderProp == fieldName){
					$scope.expOrderToggle = !($scope.expOrderToggle);
				}else{
					$scope.expOrderProp = fieldName;
					$scope.expOrderToggle = false;
				}
			}
			else if(reportType == 'incomes'){
				if($scope.incOrderProp == fieldName){
					$scope.incOrderToggle = !($scope.incOrderToggle);
				}else{
					$scope.incOrderProp = fieldName;
					$scope.incOrderToggle = false;
				}
			}
		}
}]);

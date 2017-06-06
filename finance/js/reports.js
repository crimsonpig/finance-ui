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
		
		$scope.orderProps = { incomes: 'amount', expenses: 'category' };
		$scope.orderToggles = { incomes: false, expenses: false };	
		$scope.toShow = { incomes: true, expenses: true};

		$scope.displayOrHide = function(section){
			$scope.toShow[section] = !($scope.toShow[section]);
		};

		$scope.sortReportItemsBy = function(reportType, newField){
			existingField = $scope.orderProps[reportType];
			existingToggle = $scope.orderToggles[reportType];
			newToggle = false;
			if(newField == existingField){
				newToggle = !existingToggle;
			} 
			$scope.orderProps[reportType] = newField;
			$scope.orderToggles[reportType] = newToggle;
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
		
		$scope.orderProps = { incomes: 'amount', expenses: 'category' };
		$scope.orderToggles = { incomes: false, expenses: false };
		$scope.toShow = { incomes: true, expenses: true};

		$scope.displayOrHide = function(section){
			$scope.toShow[sect] = !($scope.toShow[sect]);
		};

		$scope.sortReportItemsBy = function(reportType, newField){
			existingField = $scope.orderProps[reportType];
			existingToggle = $scope.orderToggles[reportType];
			newToggle = false;
			if(newField == existingField){
				newToggle = !existingToggle;
			} 
			$scope.orderProps[reportType] = newField;
			$scope.orderToggles[reportType] = newToggle;
		}
}]);

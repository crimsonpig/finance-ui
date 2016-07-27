var reportControllers = angular.module('reportControllers', []); 


reportControllers.controller('SummaryCtrl', ['$scope', function($scope){

		$scope.orderProp = 'category';
		$scope.orderToggle = false;
		$scope.showList = true;		

		$scope.displayList = function(){
			$scope.showList = !($scope.showList);
		};

		$scope.sortItemsBy = function(fieldName){
			if($scope.orderProp == fieldName){
				$scope.orderToggle = !($scope.orderToggle);
			}else{
				$scope.orderProp = fieldName;
				$scope.orderToggle = false;
			}
		}	
	
}]);

reportControllers.controller('ReportCtrl', ['$scope', 'SearchCriteria', 'TransactionsReport', 
	function($scope, SearchCriteria, TransactionsReport) {

		$scope.setViewReport();
				
		function reloadReportCallback(startDate, endDate, category){
			$scope.transactionsReport = {expenses:[], incomes:[]};
			if(startDate != '' && endDate != ''){
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				$scope.transactionsReport = TransactionsReport.get(searchCriteria);
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

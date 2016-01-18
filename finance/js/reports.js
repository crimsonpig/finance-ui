var reportControllers = angular.module('reportControllers', []); 

reportControllers.controller('ReportCtrl', ['$scope', 'SearchCriteria', 'TransactionsReport', 
	function($scope, SearchCriteria, TransactionsReport) {

		$scope.setViewReport();
				
		function reloadReportCallback(startDate, endDate){
			$scope.transactionsReport = {expenses:[], incomes:[]};
			if(startDate != '' && endDate != ''){
				$scope.transactionsReport = TransactionsReport.get({startDt: startDate, endDt: endDate});
			}			
		};
		
		SearchCriteria.subscribeObserver(reloadReportCallback);
		
		reloadReportCallback(SearchCriteria.firstDayOfMonth(), SearchCriteria.lastDayOfMonth());
		
		$scope.expOrderProp = 'category';
		$scope.expOrderToggle = false;
		$scope.incOrderProp = 'amount';
		$scope.incOrderToggle = false;		
		$scope.showIncomes = true;
		$scope.showExpenses = true;		
		
		function clickOnEnter(event, func){
			if(event.keyCode === 13){
				func();
			}
		};
		

		
		$scope.displayIncomes = function(){
			$scope.showIncomes = !($scope.showIncomes);
		};
		
		$scope.kDisplayIncomes = function(event){ 
			clickOnEnter(event, $scope.displayIncomes); 			
		}
		
		$scope.displayExpenses = function(){
			$scope.showExpenses = !($scope.showExpenses);
		};

		$scope.kDisplayExpenses = function(event){
			clickOnEnter(event, $scope.displayExpenses);
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

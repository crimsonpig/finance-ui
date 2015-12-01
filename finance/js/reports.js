var reportControllers = angular.module('reportControllers', []); 

reportControllers.controller('ReportCtrl', ['$scope', '$location', 'DateRange', 'TransactionsReport', 
	function($scope, $location, DateRange, TransactionsReport) {
		var queryString = $location.search();
		if(queryString.startDt != null && queryString.endDt != null){
			debug('In ReportCtrl, reading from query string: start date = '+queryString.startDt+', end date = '+queryString.endDt);
			DateRange.setDates(queryString.startDt, queryString.endDt);
		}
		$scope.setViewReport();
		var startDt = DateRange.startDate;
		var endDt = DateRange.endDate;
		$scope.transactionsReport = {expenses:[], incomes:[]};
		if(startDt != '' && endDt != ''){
			$scope.transactionsReport = TransactionsReport.get({startDt: startDt, endDt: endDt});
		}
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

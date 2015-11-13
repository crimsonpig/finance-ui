var reportControllers = angular.module('reportControllers', []); 

reportControllers.controller('ReportCtrl', ['$scope', '$location', 'DateRange', 'TransactionsReport', 
	function($scope, $location, DateRange, TransactionsReport) {
		var queryString = $location.search();
		if(queryString.startDt != null && queryString.endDt != null){
			debug('In ReportCtrl, reading from query string: start date = '+queryString.startDt+', end date = '+queryString.endDt);
			DateRange.setDates(queryString.startDt, queryString.endDt);
		}
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
	
reportControllers.controller('MonthlyCtrl', ['$scope', '$location', 'DateRange', 'MonthlyReport', 
	function($scope, $location, DateRange, MonthlyReport) {
		var queryString = $location.search();
		if(queryString.startDt != null && queryString.endDt != null){
			debug('In MonthlyCtrl, reading from query string: start date = '+queryString.startDt+', end date = '+queryString.endDt);
			DateRange.setDates(queryString.startDt, queryString.endDt);
		}
		var startDt = DateRange.startDate;
		var endDt = DateRange.endDate;

		$scope.summarizedTransactions = [];
		$scope.incomesTotal = 0.00;
		$scope.expensesTotal = 0.00;
		$scope.netTotal = 0.00;

		if(startDt != '' && endDt != ''){
			$scope.monthlyReport = MonthlyReport.get({startDt: startDt, endDt: endDt}, function(monthlyReport){
				//alert(angular.toJson(monthlyReport,true));		
				$scope.summarizedTransactions = monthlyReport.summarizedTransactions;
				$scope.incomesTotal = monthlyReport.incomesTotal;
				$scope.expensesTotal = monthlyReport.expensesTotal;
				$scope.netTotal = monthlyReport.netTotal;
			});
		}
		
		var monthNames = new Array();
		monthNames[0] = "January";
		monthNames[1] = "February";
		monthNames[2] = "March";
		monthNames[3] = "April";
		monthNames[4] = "May";
		monthNames[5] = "June";
		monthNames[6] = "July";
		monthNames[7] = "August";
		monthNames[8] = "September";
		monthNames[9] = "October";
		monthNames[10] = "November";
		monthNames[11] = "December";
		
		$scope.monthText = function(monthInt){
			return monthNames[monthInt-1];
		};
}]);

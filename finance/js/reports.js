var reportControllers = angular.module('reportControllers', []); 

reportControllers.controller('ReportCtrl', ['$scope', '$location', 'DateRange', 'TransactionsReport', 
	function($scope, $location, DateRange, TransactionsReport) {
		var queryString = $location.search();
		if(queryString.startDt != null && queryString.endDt != null){
			DateRange.setDates(queryString.startDt, queryString.endDt);
		}
		var startDt = DateRange.startDate;
		var endDt = DateRange.endDate;

		if(startDt != '' && endDt != ''){
			$scope.transactionsReport = TransactionsReport.get({startDt: startDt, endDt: endDt});
		}
		$scope.expOrderProp = 'category';
		$scope.expOrderToggle = false;
		$scope.incOrderProp = 'amount';
		$scope.incOrderToggle = false;		
	
		function clickOnEnter(event, func){
			if(event.keyCode === 13){
				func();
			}
		};

		$scope.kDisplayReports = function(event){ 
			clickOnEnter(event, $scope.displayReports); 			
		}
		
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

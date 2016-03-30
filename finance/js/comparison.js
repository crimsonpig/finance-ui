var comparisonControllers = angular.module('comparisonControllers', []); 

comparisonControllers.controller('CompareCtrl', ['$scope', 'SearchCriteria', 'BudgetComparison', 
	function($scope, SearchCriteria, BudgetComparison) {

		$scope.setViewComparison();
				
		function reloadComparisonCallback(startDate, endDate, category){
			$scope.budgetComparison = {expenses:[], incomes:[]};
			if(startDate != '' && endDate != ''){
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				$scope.budgetComparison = BudgetComparison.get(searchCriteria);
			}			
		};
		
		SearchCriteria.subscribeObserver(reloadComparisonCallback);

		reloadComparisonCallback(SearchCriteria.startDate, SearchCriteria.endDate, SearchCriteria.category);
		
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
		
		$scope.sortCompareItemsBy = function(compareType, fieldName){
			if(compareType == 'expenses'){
				if($scope.expOrderProp == fieldName){
					$scope.expOrderToggle = !($scope.expOrderToggle);
				}else{
					$scope.expOrderProp = fieldName;
					$scope.expOrderToggle = false;
				}
			}
			else if(compareType == 'incomes'){
				if($scope.incOrderProp == fieldName){
					$scope.incOrderToggle = !($scope.incOrderToggle);
				}else{
					$scope.incOrderProp = fieldName;
					$scope.incOrderToggle = false;
				}
			}
		}
}]);

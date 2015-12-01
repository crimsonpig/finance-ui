var financeControllers = angular.module('financeControllers', []); 

function debug(text){
		//alert(text);
		console.log(text);
}

financeControllers.controller('SearchCtrl', ['$scope', '$location', 'DateRange', function($scope, $location, DateRange) {
		$scope.viewTrans = false;
		$scope.viewReport = false;

		$scope.DateRange = DateRange;
		$scope.search = function(startDate, endDate){			
			$location.search({"startDt":startDate, "endDt":endDate});
		};
		
		$scope.getQueryString = function(){
			var queryString = $location.search();
			if(queryString.startDt != null && queryString.endDt != null){
				return "?startDt="+queryString.startDt+"&endDt="+queryString.endDt;
			}else{
				return "";
			}
		};
		
		$scope.setViewTrans = function(){
			$scope.viewTrans = true;
			$scope.viewReport = false;
		};
		
		$scope.setViewReport = function(){
			$scope.viewReport = true;
			$scope.viewTrans = false;
		};
}]);

financeControllers.controller('TransCtrl', ['$scope', '$location', 
	'DateRange', 'Expenses', 'Incomes', 'Utils', 
	function ($scope, $location, DateRange, Expenses, Incomes, Utils) {
		var queryString = $location.search();
		if(queryString.startDt == null && queryString.endDt == null){
			$location.search({"startDt":DateRange.beginMonth, "endDt":DateRange.endMonth});
		}
		
		if(queryString.startDt != null && queryString.endDt != null){
			DateRange.setDates(queryString.startDt, queryString.endDt);
		} 
		$scope.setViewTrans();
		
		$scope.expOrderProp = 'tDate';
		$scope.expOrderToggle = true;
		$scope.incOrderProp = 'tDate';
		$scope.incOrderToggle = true;
		$scope.expTotal = 0.00;
		$scope.incTotal = 0.00;
		$scope.showIncomes = true;
		$scope.showExpenses = true;
		$scope.showReceipts = false;
		$scope.displayReceipts = function(){
			$scope.showReceipts = !($scope.showReceipts);
		};
				
		var startDt = DateRange.startDate;
		var endDt = DateRange.endDate;
		if(startDt != '' && endDt != ''){
			$scope.expenses = Expenses.query({startDt: startDt, endDt: endDt});
			$scope.incomes = Incomes.query({startDt: startDt, endDt: endDt});

		}else{
			$scope.expenses = [];
			$scope.incomes = [];
		}

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
		
		$scope.sortTransactionsBy = function(transactionType, fieldName){
			if(transactionType == 'expenses'){
				if($scope.expOrderProp == fieldName){
					$scope.expOrderToggle = !($scope.expOrderToggle);
				}else{
					$scope.expOrderProp = fieldName;
					$scope.expOrderToggle = false;
				}
			}
			else if(transactionType == 'incomes'){
				if($scope.incOrderProp == fieldName){
					$scope.incOrderToggle = !($scope.incOrderToggle);
				}else{
					$scope.incOrderProp = fieldName;
					$scope.incOrderToggle = false;
				}
			}
		}
		
		$scope.expensesToAdd = [];
		$scope.incomesToAdd = [];
		
		$scope.addRow = function(transactionsToAdd){
			transactionsToAdd.push({"tDate": "", "category": "", "amount": 0.00, "isNew": true});
		}

		$scope.hasInputRows = function(transactionsToAdd){
			return transactionsToAdd.length > 0;
		}

		$scope.hasEmptyDt = function(transaction){
			return !transaction.isNew && Utils.isEmpty(transaction.tDate);
		}

		$scope.hasMalformedDt = function(transaction){			
			return !transaction.isNew && Utils.isMalformedDate(transaction.tDate);
		}

		$scope.hasEmptyCategory = function(transaction){
			return !transaction.isNew && Utils.isEmpty(transaction.category);
		}

		$scope.clearAllExpenseInputs = function(){
			$scope.expensesToAdd.length = 0;
			Utils.focusOnButton("btnAddExp");
		}	
		
		$scope.clearAllIncomeInputs = function(){
			$scope.incomesToAdd.length = 0; 
			Utils.focusOnButton("btnAddInc");
		}
		
		$scope.clearExpenseFromInput = function(expense){
			Utils.deleteRow(expense, $scope.expensesToAdd); 
			Utils.focusOnButton("btnAddExp");
		}
		
		$scope.clearIncomeFromInput = function(income){
			Utils.deleteRow(income, $scope.incomesToAdd);
			Utils.focusOnButton("btnAddInc");
		}
		
		$scope.saveExpense = function(expense){
			validateAndPersistExpense(expense);
			Utils.focusOnButton("btnAddExp");
		}
		
		$scope.saveIncome = function(income){
			validateAndPersistIncome(income);
			Utils.focusOnButton("btnAddInc");
		}

		$scope.saveAllExpenseRows = function(){
			Utils.saveAllInputRows($scope.expensesToAdd, validateAndPersistExpense);
			Utils.focusOnButton("btnAddExp");
		}
		
		$scope.saveAllIncomeRows = function(){
			Utils.saveAllInputRows($scope.incomesToAdd, validateAndPersistIncome);
			Utils.focusOnButton("btnAddInc");
		}

		function validateAndPersistExpense(expense){
			validateAndPersistTransaction(expense, Expenses, $scope.expenses, $scope.expensesToAdd);
		}
		
		function validateAndPersistIncome(income){
			validateAndPersistTransaction(income, Incomes, $scope.incomes, $scope.incomesToAdd);
		}
		
		function validateAndPersistTransaction(transaction, saveService, postSaveList, inputList){
			if(!Utils.isEmpty(transaction.category) && !Utils.isEmpty(transaction.tDate) && !Utils.isMalformedDate(transaction.tDate)){
				var tToSave = new Object();
				tToSave.tDate = transaction.tDate;
				tToSave.category = transaction.category.toUpperCase();
				tToSave.amount = parseFloat(transaction.amount);
				var newT = saveService.save(tToSave, function(){
					var tToDisplay = new Object();
					tToDisplay.tid = newT.tid;
					tToDisplay.tDate = newT.tDate;
					tToDisplay.category = newT.category;
					tToDisplay.amount = parseFloat(newT.amount.toFixed(2));
					postSaveList.push(tToDisplay);
					Utils.deleteRow(transaction, inputList);
				}, function(){
					debug("FAILURE TO SAVE");
				});
			}else{
				transaction.isNew = false;
			}
		}
			
		$scope.deleteExpense = function(expense){
			if(confirm('Are you sure you want to delete this transaction?')){
				Expenses.delete({id:expense.tid});
				var idx = $scope.expenses.indexOf(expense);
				$scope.expenses.splice(idx,1);
			}
		}

		$scope.deleteIncome = function(income){
			if(confirm('Are you sure you want to delete this transaction?')){
				Incomes.delete({id:income.tid});
				var idx = $scope.incomes.indexOf(income);
				$scope.incomes.splice(idx,1);
			}
		}

		$scope.getIncomeTotal = function(){
				$scope.incTotal = 0.00;
				angular.forEach($scope.incomes, function(income){ 
					$scope.incTotal += income.amount;
				});
				return $scope.incTotal.toFixed(2);
		}
		
		$scope.getExpenseTotal = function(){
				$scope.expTotal = 0.00;
				angular.forEach($scope.expenses, function(expense){
					$scope.expTotal += expense.amount;
				});
				return $scope.expTotal.toFixed(2);
		}	
		
		$scope.getNetTotal = function(){
				return ($scope.incTotal - $scope.expTotal).toFixed(2);
		}
		
}]);

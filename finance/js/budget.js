var budgetControllers = angular.module('budgetControllers', []); 


budgetControllers.controller('BudgetCtrl', ['$scope', 'ViewSwitches', 
	'SearchCriteria', 'BudgetItems', 'Utils', 
	function ($scope, ViewSwitches, SearchCriteria, BudgetItems, Utils) {
		ViewSwitches.publish('budget');
		
		$scope.expOrderProp = 'category';
		$scope.expOrderToggle = false;
		$scope.incOrderProp = 'startDate';
		$scope.incOrderToggle = false;
		$scope.expItemsTotal = 0.00;
		$scope.incItemsTotal = 0.00;
		$scope.showIncomes = true;
		$scope.showExpenses = true;

		function filterExpenses(budgetItem){
			return budgetItem.itemType == 'E'
		}
		
		function filterIncomes(budgetItem){
			return budgetItem.itemType == 'I'
		}

		function reloadBudgetsCallback(startDate, endDate, category){
			$scope.expenseItems = [];
			$scope.incomeItems = [];
			if(startDate != '' && endDate != ''){	
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				var budgetItems = BudgetItems.query(searchCriteria, function(){
					$scope.expenseItems = budgetItems.filter(filterExpenses)
					$scope.incomeItems = budgetItems.filter(filterIncomes)
				});

			}						
		};
		SearchCriteria.subscribeObserver(reloadBudgetsCallback);
		reloadBudgetsCallback(SearchCriteria.startDate, SearchCriteria.endDate, SearchCriteria.category);

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
		
		$scope.sortItemsBy = function(itemType, fieldName){
			if(itemType == 'expenses'){
				if($scope.expOrderProp == fieldName){
					$scope.expOrderToggle = !($scope.expOrderToggle);
				}else{
					$scope.expOrderProp = fieldName;
					$scope.expOrderToggle = false;
				}
			}
			else if(itemType == 'incomes'){
				if($scope.incOrderProp == fieldName){
					$scope.incOrderToggle = !($scope.incOrderToggle);
				}else{
					$scope.incOrderProp = fieldName;
					$scope.incOrderToggle = false;
				}
			}
		}
		
		$scope.expenseItemsToAdd = [];
		$scope.incomeItemsToAdd = [];
		
		$scope.addRow = function(budgetItemsToAdd){
			budgetItemsToAdd.push({"startDate": "", "endDate": "", "category": "", "amount": 0.00, "isNew": true});
		}

		$scope.hasInputRows = function(budgetItemsToAdd){
			return budgetItemsToAdd.length > 0;
		}

		$scope.hasEmptyDt = function(budgetItem){
			return !budgetItem.isNew && (Utils.isEmpty(budgetItem.startDate) || Utils.isEmpty(budgetItem.endDate));
		}

		$scope.hasMalformedDt = function(budgetItem){			
			return !budgetItem.isNew && (Utils.isMalformedDate(budgetItem.startDate) || Utils.isMalformedDate(budgetItem.endDate));
		}

		$scope.hasEmptyCategory = function(budgetItem){
			return !budgetItem.isNew && Utils.isEmpty(budgetItem.category);
		}

		$scope.clearAllExpenseInputs = function(){
			$scope.expenseItemsToAdd.length = 0;
			Utils.focusOnButton("btnAddExp");
		}	
		
		$scope.clearAllIncomeInputs = function(){
			$scope.incomeItemsToAdd.length = 0; 
			Utils.focusOnButton("btnAddInc");
		}
		
		$scope.clearExpenseFromInput = function(expense){
			Utils.deleteRow(expense, $scope.expenseItemsToAdd); 
			Utils.focusOnButton("btnAddExp");
		}
		
		$scope.clearIncomeFromInput = function(income){
			Utils.deleteRow(income, $scope.incomeItemsToAdd);
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
			Utils.saveAllInputRows($scope.expenseItemsToAdd, validateAndPersistExpense);
			Utils.focusOnButton("btnAddExp");
		}
		
		$scope.saveAllIncomeRows = function(){
			Utils.saveAllInputRows($scope.incomeItemsToAdd, validateAndPersistIncome);
			Utils.focusOnButton("btnAddInc");
		}

		function validateAndPersistExpense(expense){
			validateAndPersistTransaction(expense, "E", $scope.expenseItems, $scope.expenseItemsToAdd);
		}
		
		function validateAndPersistIncome(income){
			validateAndPersistTransaction(income, "I", $scope.incomeItems, $scope.incomeItemsToAdd);
		}
		
		function validateAndPersistTransaction(budgetItem, itemType, postSaveList, inputList){
			if(!Utils.isEmpty(budgetItem.category) && !Utils.isEmpty(budgetItem.startDate) && !Utils.isMalformedDate(budgetItem.startDate)
				&& !Utils.isEmpty(budgetItem.endDate) && !Utils.isMalformedDate(budgetItem.endDate)){
				var itemToSave = new Object();
				itemToSave.startDate = budgetItem.startDate;
				itemToSave.endDate = budgetItem.endDate;				
				itemToSave.itemType = itemType.toUpperCase();
				itemToSave.category = budgetItem.category.toUpperCase();
				itemToSave.amount = parseFloat(budgetItem.amount);
				var newT = BudgetItems.save(itemToSave, function(){
					var itemToDisplay = new Object();
					itemToDisplay.id = newT.id;
					itemToDisplay.startDate = newT.startDate;
					itemToDisplay.endDate = newT.endDate;		
					itemToDisplay.itemType = newT.itemType;			
					itemToDisplay.category = newT.category;
					itemToDisplay.amount = parseFloat(newT.amount.toFixed(2));
					postSaveList.push(itemToDisplay);
					Utils.deleteRow(budgetItem, inputList);
				}, function(){
					debug("FAILURE TO SAVE");
				});
			}else{
				budgetItem.isNew = false;
			}
		}
			
		$scope.deleteExpense = function(expense){
			if(confirm('Are you sure you want to delete this budget item?')){
				BudgetItems.delete({id:expense.id});
				var idx = $scope.expenseItems.indexOf(expense);
				$scope.expenseItems.splice(idx,1);
			}
		}

		$scope.deleteIncome = function(income){
			if(confirm('Are you sure you want to delete this budget item?')){
				BudgetItems.delete({id:income.id});
				var idx = $scope.incomeItems.indexOf(income);
				$scope.incomeItems.splice(idx,1);
			}
		}

		$scope.getIncomeTotal = function(){
				$scope.incItemsTotal = 0.00;
				angular.forEach($scope.incomeItems, function(income){ 
					$scope.incItemsTotal += income.amount;
				});
				return $scope.incItemsTotal.toFixed(2);
		}
		
		$scope.getExpenseTotal = function(){
				$scope.expItemsTotal = 0.00;
				angular.forEach($scope.expenseItems, function(expense){
					$scope.expItemsTotal += expense.amount;
				});
				return $scope.expItemsTotal.toFixed(2);
		}	
		
		$scope.getNetTotal = function(){
				return ($scope.incItemsTotal - $scope.expItemsTotal).toFixed(2);
		}
		
}]);

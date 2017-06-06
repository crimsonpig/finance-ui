var financeControllers = angular.module('financeControllers', []); 

function debug(text){
		//alert(text);
		console.log(text);
}

financeControllers.controller('SearchCtrl', ['$scope', 'ViewChangeCallbacks', 'SearchCriteria', function($scope, ViewChangeCallbacks, SearchCriteria) {

		$scope.currentView = 'transactions';

		$scope.startDate = SearchCriteria.firstDayOfMonth();
		$scope.endDate = SearchCriteria.lastDayOfMonth();
		$scope.search = function(startDate, endDate, category){			
			SearchCriteria.search(startDate, endDate, category);
		};

		function whenViewChanges(viewLoaded){
			$scope.currentView = viewLoaded;
		};
		ViewChangeCallbacks.addViewChangeListener(whenViewChanges);
}]);

financeControllers.controller('TransCtrl', ['$scope', 'ViewChangeCallbacks', 
	'SearchCriteria', 'Transactions', 'Utils', 
	function ($scope, ViewChangeCallbacks, SearchCriteria, Transactions, Utils) {
		ViewChangeCallbacks.changeToView('transactions');

		$scope.expOrderProp = 'tDate';
		$scope.expOrderToggle = true;
		$scope.incOrderProp = 'tDate';
		$scope.incOrderToggle = true;
		$scope.showIncomes = true;
		$scope.showExpenses = true;
		$scope.showReceipts = false;
		$scope.displayReceipts = function(){
			$scope.showReceipts = !($scope.showReceipts);
		};
		
		function filterExpenses(transaction){
			return transaction.tType == 'E'
		}
		
		function filterIncomes(transaction){
			return transaction.tType == 'I'
		}

		function reloadTransactionsCallback(startDate, endDate, category){
			$scope.expenses = [];
			$scope.incomes = [];
			if(startDate != '' && endDate != ''){
				var searchCriteria = {startDt: startDate, endDt: endDate};
				if(category != ''){
					searchCriteria.category = category;
				}
				var transactions = Transactions.query(searchCriteria, function(){
					$scope.expenses = transactions.filter(filterExpenses)
					$scope.incomes = transactions.filter(filterIncomes)
				});

			}						
		};
		SearchCriteria.subscribeObserver(reloadTransactionsCallback);
		reloadTransactionsCallback(SearchCriteria.startDate, SearchCriteria.endDate, SearchCriteria.category);

		$scope.displayIncomes = function(){
			$scope.showIncomes = !($scope.showIncomes);
		};

		$scope.displayExpenses = function(){
			$scope.showExpenses = !($scope.showExpenses);
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
		
		$scope.addRow = function(transactionsToAdd, tType){
			transactionsToAdd.push({"tDate": "", "category": "", "amount": 0.00, "tType": tType, "isNew": true});
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

		$scope.deleteItemFromInputs = function(item, listOfInputs){
			Utils.deleteRow(item, listOfInputs); 
		}

		$scope.saveExpense = function(expense){
			validateAndPersistTransaction(expense, $scope.expenses, $scope.expensesToAdd);
		}
		
		$scope.saveIncome = function(income){
			validateAndPersistTransaction(income, $scope.incomes, $scope.incomesToAdd);
		}

		function validateAndPersistTransaction(transaction, postSaveList, inputList){
			if(!Utils.isEmpty(transaction.category) && !Utils.isEmpty(transaction.tDate) && !Utils.isMalformedDate(transaction.tDate)){
				var tToSave = new Object();
				tToSave.tDate = transaction.tDate;
				tToSave.tType = transaction.tType.toUpperCase();
				tToSave.category = transaction.category.toUpperCase();
				tToSave.amount = parseFloat(transaction.amount);
				var newT = Transactions.save(tToSave, function(){
					var tToDisplay = new Object();
					tToDisplay.tid = newT.tid;
					tToDisplay.tDate = newT.tDate;
					tToDisplay.tType = newT.tType;
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
				Transactions.delete({id:expense.tid});
				var idx = $scope.expenses.indexOf(expense);
				$scope.expenses.splice(idx,1);
			}
		}

		$scope.deleteIncome = function(income){
			if(confirm('Are you sure you want to delete this transaction?')){
				Transactions.delete({id:income.tid});
				var idx = $scope.incomes.indexOf(income);
				$scope.incomes.splice(idx,1);
			}
		}
		
}]);

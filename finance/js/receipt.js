
financeControllers.controller('ReceiptCtrl', ['$scope', 'Utils', 
	function ($scope, Utils) {

		$scope.receiptTaxRate = 7.5;
		$scope.receiptItems = [];
		$scope.receiptItemsSubtotal = 0.00;
		$scope.taxTotal = 0.00;
		$scope.receiptItemsTotal = 0.00;
		$scope.calculatedReceiptItems = {};
		$scope.checkSubtotal = 0.00;
		$scope.checkTax = 0.00;
		$scope.checkTotal = 0.00;

		$scope.addReceiptItem = function(receiptItems){
			receiptItems.push({"category": "", "amount": 0.00, "isTaxable": true});
		}
		$scope.calculatedReceiptItems = [];

		$scope.calculateReceiptItems = function(){
			$scope.calculatedReceiptItems = [];
			var receiptItems = $scope.receiptItems;		
			var taxableSubtotal = 0.00;
			var taxableAmts = {};
			var nonTaxableAmts = {};
			$scope.receiptItemsSubtotal = 0.00;
			$scope.taxTotal = 0.00;
			$scope.receiptItemsTotal = 0.00;
			
			receiptItems.map(function(receiptItem){ 
				if(receiptItem.category != ''){
					var amtToAdd = parseFloat(receiptItem.amount);
					if(receiptItem.isTaxable){
						if(taxableAmts[receiptItem.category] == null){
							taxableAmts[receiptItem.category] = amtToAdd;
						}
						else{
							taxableAmts[receiptItem.category] += amtToAdd;
						}
						taxableSubtotal += amtToAdd; 
					}
					else{
						if(nonTaxableAmts[receiptItem.category] == null){
							nonTaxableAmts[receiptItem.category] = amtToAdd;
						}
						else{
							nonTaxableAmts[receiptItem.category] += amtToAdd;
						}
					}
					$scope.receiptItemsSubtotal += amtToAdd;
				}
			});
			
			var taxTotal = (taxableSubtotal * ($scope.receiptTaxRate / 100));
			$scope.taxTotal = taxTotal.toFixed(2);
			var receiptItemsTotal = $scope.receiptItemsSubtotal + taxTotal;
			$scope.receiptItemsSubtotal = $scope.receiptItemsSubtotal.toFixed(2);
			$scope.receiptItemsTotal = receiptItemsTotal.toFixed(2);
			
			for(taxableAmt in taxableAmts){
				var newSubtotal = taxableAmts[taxableAmt];
				var tax = $scope.taxTotal * (newSubtotal / taxableSubtotal);
				var newTotal = newSubtotal + tax;
				$scope.calculatedReceiptItems.push({"category": taxableAmt, "subtotal": newSubtotal.toFixed(2), "tax": tax.toFixed(2), "total": newTotal.toFixed(2)});
			}
			for(nonTaxableAmt in nonTaxableAmts){
				var newSubtotal = nonTaxableAmts[nonTaxableAmt];
				var newTotal = newSubtotal + 0;
				$scope.calculatedReceiptItems.push({"category": nonTaxableAmt, "subtotal": newSubtotal.toFixed(2), "tax": 0.00,"total": newTotal.toFixed(2)});
			}
			var checkSubtotal = 0.00;
			var checkTax = 0.00;
			var checkTotal = 0.00;
			$scope.calculatedReceiptItems.map(function(calcItem){
				checkSubtotal += parseFloat(calcItem.subtotal);
				checkTax += parseFloat(calcItem.tax);
				checkTotal += parseFloat(calcItem.total);
			});
			$scope.checkSubtotal = checkSubtotal.toFixed(2);
			$scope.checkTax = checkTax.toFixed(2);
			$scope.checkTotal = checkTotal.toFixed(2);
			
		}

		$scope.deleteReceiptItem = function(receiptItem){
			var idx = $scope.receiptItems.indexOf(receiptItem);
			$scope.receiptItems.splice(idx, 1);
			if($scope.calculatedReceiptItems.length > 0){
				$scope.calculateReceiptItems();
			}
			Utils.focusOnButton("btnAddRpt");
		}

		$scope.saveAllReceiptItems = function(){
			if($scope.receiptDate != null && !Utils.isMalformedDate($scope.receiptDate)){
				$scope.calculatedReceiptItems.map(function(calcItem){
					$scope.expensesToAdd.push({"tDate": $scope.receiptDate, "category": calcItem.category, "amount": calcItem.total, "isNew": true});
				});
			}
		}
		
		$scope.deleteAllReceiptItems = function(){
			$scope.calculatedReceiptItems.length = 0;
			$scope.receiptItems.length = 0;
			$scope.receiptItemsSubtotal = 0.00;
			$scope.taxTotal = 0.00;
			$scope.receiptItemsTotal = 0.00;
			$scope.checkSubtotal = 0.00;
			$scope.checkTax = 0.00;
			$scope.checkTotal = 0.00;
			Utils.focusOnButton("btnAddRpt");
		}
}]);

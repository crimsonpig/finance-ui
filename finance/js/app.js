var financeApp = angular.module('finance-app', ['ngRoute', 'financeServices', 'financeControllers', 'reportControllers', 'budgetControllers']); 

financeApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/transactions', {
			controller:'TransCtrl',
			templateUrl:'partials/transactions.html'
		})
		.when('/budget', {
			controller:'BudgetCtrl',
			templateUrl:'partials/budget.html'
		})		
		.when('/summary', {
			controller:'ReportCtrl',
			templateUrl:'partials/reports.html'
		})
		.otherwise({
			redirectTo: '/transactions'
		});
	
	$locationProvider.html5Mode(false);
}]);

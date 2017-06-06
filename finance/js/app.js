var financeApp = angular.module('finance-app', ['ngRoute', 'financeServices', 'financeControllers', 'reportControllers', 'budgetControllers', 'comparisonControllers']); 

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
		.when('/budgetsummary', {
			controller:'BudgetReportCtrl',
			templateUrl:'partials/reports.html'
		})
		.when('/compare', {
			controller:'CompareCtrl',
			templateUrl:'partials/compare.html'
		})
		.otherwise({
			redirectTo: '/transactions'
		});
	
	$locationProvider.html5Mode(false);
}]);

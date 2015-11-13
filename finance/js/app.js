var financeApp = angular.module('finance-app', ['financeServices', 'financeControllers', 'reportControllers']); 

financeApp.config(['$locationProvider', function($locationProvider) {

	$locationProvider.html5Mode(true);
}]);

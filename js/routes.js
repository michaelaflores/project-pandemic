'use strict';

pandemic.config(function($routeProvider) {
    $routeProvider.when(
    	'/view1',
    	{
    		templateUrl: 'partials/partial1.html',
    		controller: 'NodeCtrl'
    	});
    $routeProvider.otherwise(
      {
        redirectTo: '/view1'
      });
});

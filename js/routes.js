'use strict';

pandemic.config(function($routeProvider) {
    $routeProvider.when(
    	'/view1',
    	{
    		templateUrl: 'partials/partial1.html',
    		controller: 'CanvasCtrl'
    	});
    $routeProvider.otherwise(
      {
        redirectTo: '/view1'
      });
});

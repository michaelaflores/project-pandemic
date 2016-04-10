'use strict';

pandemic.controller("MyCtrl1" ,function ($scope, UtilSrvc) {
    $scope.aVariable = 'anExampleValueWithinScope';
    $scope.valueFromService = UtilSrvc.helloWorld("Amy");
});

pandemic.controller("MyCtrl2" ,function ($scope) {

});

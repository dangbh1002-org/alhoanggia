'use strict';

angular.module('product').controller('productController',['$scope','$location','$firebaseArray', function TodoCtrl($scope, $location, $firebaseArray) {

    var fireRef = firebase.database().ref().child("list2");
    $scope.list = $firebaseArray(fireRef);

    // $scope.list.$add({
    //     text: 'def'
    // });


    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
        if ( angular.isDefined( toState.data.pageTitle ) ) {
            $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
            console.log($scope.pageTitle);
        }
    });

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;
}]);
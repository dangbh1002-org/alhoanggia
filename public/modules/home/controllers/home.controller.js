'use strict';

angular.module('product').controller('HomeController',['$scope','$location','$firebaseArray', function TodoCtrl($scope, $location, $firebaseArray) {

    $scope.loadProductList = function () {
        $scope.productListRef = firebase.database().ref().child("products/");
        $scope.productList = $firebaseArray($scope.productListRef);
    };

    $scope.getAuth = function () {
        firebase.auth().onAuthStateChanged(function (auth) {

            $scope.$apply(function () {
                $scope.auth = auth;
                $scope.accList = [];
                $scope.productList = [];
            });

            if (auth) {

                $scope.loadProductList();

                var userRef = firebase.database().ref().child('users/' + $scope.auth.uid);
                userRef.on('value', function (snapshot) {
                    $scope.user = snapshot.val();
                    if ($scope.user.isAdmin) {
                        $scope.loadAccList();
                    }
                });

            }
        });
    };

    $scope.init = function () {

        $scope.getAuth();

    };

    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;
}]);
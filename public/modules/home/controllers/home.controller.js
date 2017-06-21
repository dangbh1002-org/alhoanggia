'use strict';

angular.module('home').controller('HomeController',['$scope', '$location','$firebaseArray', function($scope, $location, $firebaseArray) {

    $scope.loadProductList = function () {
        $scope.productListRef = firebase.database().ref().child("products/");
        $scope.productList = $firebaseArray($scope.productListRef);
    };

    $scope.getAuth = function () {
        firebase.auth().onAuthStateChanged(function (auth) {

            $scope.$apply(function () {
                $scope.auth = auth;
                $scope.productList = [];
            });
            $scope.loadProductList();

        });
    };

    $scope.init = function () {
        $scope.getAuth();
        $scope.videoHeight = window.innerHeight;
    };


}]);
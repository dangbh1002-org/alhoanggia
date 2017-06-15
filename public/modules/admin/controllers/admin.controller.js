'use strict';

angular.module('admin').controller('adminController', ['$scope','$location', '$firebaseArray',function TodoCtrl($scope, $location, $firebaseArray) {

    var fireRef = firebase.database().ref().child("list");
    $scope.list = $firebaseArray(fireRef);

    // $scope.list.$add({
    //     text: 'abc'
    // });


    if ($location.path() === '') {
        $location.path('/');
    }
    $scope.location = $location;
}]);
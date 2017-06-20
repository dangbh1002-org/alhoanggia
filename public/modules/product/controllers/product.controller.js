'use strict';

angular.module('product').controller('ProductController',['$scope', '$rootScope', '$location','$firebaseArray', '$timeout', '$mdMedia', '$mdDialog', function($scope, $rootScope, $location, $firebaseArray, $timeout, $mdMedia, $mdDialog) {

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

            $scope.loadProductList();

            if (auth) {

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
    $scope.setProductType = function () {

        $scope.mapPath2Type = {};
        angular.forEach($scope.menus, function (value, key) {
            $scope.mapPath2Type[value.path] = value.code;
        });

    };

    $scope.viewProduct = function(ev, images) {
        $rootScope.productViewImages = images;
        $mdDialog.show({
            controller: function($scope, $rootScope) {
                $scope.productViewImages = $rootScope.productViewImages;
                $scope.imageHeight = window.innerHeight;
            },
            templateUrl: 'modules/product/templates/dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    $scope.init = function () {
        $scope.getAuth();
        $scope.setProductType();
        $scope.videoHeight = window.innerHeight;

    };


}]);
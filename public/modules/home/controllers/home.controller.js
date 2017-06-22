'use strict';

angular.module('home').controller('HomeController',['$scope', '$location','$firebaseArray', '$svgDraw', function($scope, $location, $firebaseArray, $svgDraw) {

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

    $scope.scrollAble = function () {
        $('a[href*="#"]:not([href="#"])').click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

                if (target.length){
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000);
                }
            }
        });

    };

    $scope.init = function () {
        $scope.getAuth();
        $scope.videoHeight = window.innerHeight;
        window.scrollTo(0, 0);
        $scope.scrollAble();
        $svgDraw.draw('.step1Icon','#09a223','#09a223');
        $svgDraw.draw('.step2Icon','#09a223','#09a223');
        $svgDraw.draw('.step3Icon','#09a223','#09a223');
        $svgDraw.draw('.step4Icon','#09a223','#09a223');
        $svgDraw.draw('.step5Icon','#09a223','#09a223');
        $svgDraw.draw('.step6Icon','#09a223','#09a223');

    };




}]);
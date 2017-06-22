'use strict';

angular.module('menu').directive('menuDirective',[function () {
    return {
        restrict: 'E',
        controller: ['$scope', '$rootScope', '$location', '$mdSidenav', '$mdMedia', function($scope, $rootScope, $location, $mdSidenav, $mdMedia) {

            $rootScope.largeScreen = $mdMedia('gt-md');
            $rootScope.menus = [
                {code: 0, name: 'Trang chủ', path: '/', icon: '', color: '#4caf50'},
                {code: 1, name: 'Cổng nhôm đúc', path: '/cong-nhom-duc', icon: '', color: '#4caf50'},
                {code: 2, name: 'Hàng rào', path: '/hang-rao', icon: '', color: '#ef5350'},
                {code: 3, name: 'Ban công', path: '/ban-cong', icon: '', color: '#a289ff'},
                {code: 4, name: 'Bông gió', path: '/bong-gio', icon: '', color: '#20c4cb'},
                {code: 5, name: 'Cầu thang', path: '/cau-thang', icon: '', color: '#FFA800'}
            ];

            $rootScope.mapPath2Name = {};
            angular.forEach($scope.menus, function (value, key) {
                $scope.mapPath2Name[value.path] = value.name;
            });
            $rootScope.mapPath2Color = {};
            angular.forEach($scope.menus, function (value, key) {
                $scope.mapPath2Color[value.path] = value.color;
            });

            $rootScope.setNavItem = function (path) {
                setTimeout(function () {
                    $scope.$apply(function () {
                        $location.path(path);
                        $scope.currentNavItem = path;
                    })
                })
            };

            $scope.currentNavItem = $location.path();
            $scope.toggleLeft = buildToggler('left');
            function buildToggler(navID) {
                return function () {
                    // Component lookup should always be available since we are not using `ng-if`
                    $mdSidenav(navID)
                        .toggle()
                        .then(function () {
                            // console.log("toggle " + navID + " is done");
                        });
                };
            }
            $scope.close = function () {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav('left').close()
                    .then(function () {
                        // console.log("close LEFT is done");
                    });
            };

            $rootScope.location = $location;

        }],
        templateUrl: 'modules/menu/templates/menu.template.html'

    };

}]);
'use strict';

angular.module('footer').directive('footerDirective',[function () {
    return {
        restrict: 'E',
        controller: ['$scope', '$timeout', '$svgDraw', function($scope, $timeout, $svgDraw) {

            $timeout(function () {

                $svgDraw.draw('.facebookIcon','#3b5998','#446db5');
                $svgDraw.draw('.youtubeIcon','#ee4959','#d83758');
                $svgDraw.draw('.googlePlusIcon','#ee4959','#d83758');
                $svgDraw.draw('.twitterIcon','#3b5998','#326ada');

            },1000);

        }],
        templateUrl: 'modules/footer/templates/footer.template.html'

    };

}]);
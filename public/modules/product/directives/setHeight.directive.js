'use strict';

/**
 * Directive that places focus on the element it is applied to when the expression it binds to evaluates to true
 */

angular.module('product').directive('setHeight', [function() {
    return function(scope, elem, attrs) {
        var width = elem[0].clientWidth;
        elem[0].height = width*9/16;
    }
}]);
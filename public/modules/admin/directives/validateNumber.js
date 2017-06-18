'use strict';

angular.module('admin').directive('validateNumber', [ function () {
    return function (scope, elem, attrs) {
        elem.bind('keyup', function (event) {
            if (event.which >= 37 && event.which <= 40) {
                event.preventDefault();
            }
            var num = elem[0].value.replace(/\D/g,'').replace(/,/gi, "").split("").reverse().join("");
            var num2 = RemoveRougeChar(num.replace(/(.{3})/g, "$1,").split("").reverse().join(""));
            elem[0].value = num2;

            if(num2 == ''){
                scope.$apply(attrs.validateNumber);
            }
        });
        scope.$on('$destroy', function () {
            elem.unbind('keyup');
        });
    };
}]);

function RemoveRougeChar(convertString) {
    if (convertString.substring(0, 1) == ",") {
        return convertString.substring(1, convertString.length)
    }
    return convertString;
}
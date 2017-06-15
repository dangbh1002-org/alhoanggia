'use strict';


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDI6cOSMSlIeML7q6UpLy9JBIRp-cU3QuA",
    authDomain: "alhoanggia-4d183.firebaseapp.com",
    databaseURL: "https://alhoanggia-4d183.firebaseio.com",
    projectId: "alhoanggia-4d183",
    storageBucket: "alhoanggia-4d183.appspot.com",
    messagingSenderId: "478462623230"
};
firebase.initializeApp(config);

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
    // Init module configuration options
    var applicationModuleName = 'mean';

    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(applicationModuleName, []).requires.push(moduleName);
    };

    return {
        applicationModuleName: applicationModuleName,
        registerModule: registerModule
    };
})();


//Then define the init function for starting up the application
angular.element(document).ready(function () {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {
        window.location.hash = '#!';
    }

    //Then init the app
    angular.bootstrap(document, ['main', 'admin', 'product']); //add module here
});

ApplicationConfiguration.registerModule('main', ['firebase', 'ngRoute', 'ngMaterial']); //add dependencies here


angular.module('main').config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/admin', {
            templateUrl: "modules/admin/views/admin.view.html"
        })
        .when('/product2', {
            templateUrl: "modules/product/views/product.view.html"
        })
        .otherwise({
            redirectTo: '/admin'
        });
    $locationProvider.html5Mode(true);
}]);
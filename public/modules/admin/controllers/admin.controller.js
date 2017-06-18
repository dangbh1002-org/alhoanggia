'use strict';

// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyDI6cOSMSlIeML7q6UpLy9JBIRp-cU3QuA",
//     authDomain: "alhoanggia-4d183.firebaseapp.com",
//     databaseURL: "https://alhoanggia-4d183.firebaseio.com",
//     projectId: "alhoanggia-4d183",
//     storageBucket: "alhoanggia-4d183.appspot.com",
//     messagingSenderId: "478462623230"
// };
// firebase.initializeApp(config);


angular.module('admin').controller('AdminController', [
    '$scope', '$location', '$firebaseArray', '$mdToast', '$timeout', 'Upload',

    function ($scope, $location, $firebaseArray, $mdToast, $timeout, Upload) {

        $scope.createUser = function () {

            if (!$scope.user.isAdmin) {
                return;
            }

            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).then(function (user) {

                firebase.database().ref().child('users/' + user.uid).update({
                    email: $scope.email
                });

                user.updateProfile({
                    displayName: $scope.displayName,
                    photoURL: ""
                }).then(function () {
                    // Update successful.
                }, function (error) {
                    // An error happened.
                });

                user.sendEmailVerification().then(function () {
                    console.log('Verification email sent.');

                    firebase.auth().sendPasswordResetEmail(user.email).then(function () {
                        console.log('PasswordReset email sent.');
                    }, function (error) {
                        // An error happened.
                    });

                }, function (error) {
                    // An error happened.
                });

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode, errorMessage);
                // ...
            });
        };

        $scope.loadAccList = function () {
            $scope.accListRef = firebase.database().ref().child("users/");
            $scope.accList = $firebaseArray($scope.accListRef);

        };

        $scope.resetPassword = function () {
            firebase.auth().sendPasswordResetEmail($scope.email).then(function () {
                $scope.$apply(function () {
                    $scope.loginError = false;
                    $scope.loginMessage = 'Reset password email sent.';
                });
            }, function (error) {
                $scope.$apply(function () {
                    $scope.loginError = true;
                    $scope.loginMessage = error.message;
                });
                // An error happened.
            });
        };

        $scope.signIn = function () {

            $scope.loading = true;

            firebase.auth().signInWithEmailAndPassword($scope.email, $scope.password).then(function (auth) {

            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;

                $scope.$apply(function () {
                    $scope.loginError = true;
                    $scope.loginMessage = error.message;
                });

                // ...
            });
        };

        $scope.signOut = function () {

            firebase.auth().signOut().then(function () {
                // Sign-out successful.
            }, function (error) {
                // An error happened.
            });
        };


        $scope.uploadPic = function (file) {

            var now = new Date();
            var timeStamp = now.getTime() + (Math.floor(Math.random() * 8999) + 1000).toString();

            // Create a root reference
            var storageRef = firebase.storage().ref();

            var metadata = {
                contentType: 'image/jpeg'
            };

            var uploadTask = storageRef.child('/productImages/' + timeStamp + '/' + file.name).put(file, metadata);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                    $scope.$apply(function () {
                        file.progress = progress;
                    });

                    console.log('Upload is ' + file.progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function(error) {

                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function() {
                    // Upload completed successfully, now we can get the download URL

                    firebase.database().ref().child('/products/'+timeStamp).set({
                        name: $scope.productName,
                        price: $scope.productPrice,
                        type: $scope.productType,
                        position: 999,
                        views: 0,
                        startedAt: firebase.database.ServerValue.TIMESTAMP,
                        images: [
                            {
                                fullPath: uploadTask.snapshot.metadata.fullPath,
                                url: uploadTask.snapshot.downloadURL
                            }
                        ]
                    }).then(function(){

                        $scope.picFile = null;
                        $scope.productName = null;
                        $scope.productType = null;
                        $scope.productPrice = null;

                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Upload success!!!')
                                .hideDelay(2000)
                        );

                    }).catch(function(error) {
                        alert("Data could not be saved." + error);
                    });


                });

        };


        $scope.reloadDataTable = function () {
            setTimeout(function () {

                $('#productList').DataTable({
                    pagingType: "full_numbers",
                    buttons: [
                        { extend: 'csv', className: 'btn purple btn-outline', filename: 'ProductList'},
                        { extend: 'excel', className: 'btn yellow btn-outline', filename: 'ProductList'},
                        { extend: 'pdf', className: 'btn red btn-outline', filename: 'ProductList'}
                    ],
                    "dom": "<'row' <'col-md-12'B>><'row'<'col-md-6 col-sm-12'l><'col-md-6 col-sm-12'f>r><'table-scrollable't><'row'<'col-md-5 col-sm-12'i><'col-md-7 col-sm-12'p>>"
                });
            }, 100);

        };

        $scope.loadProductList = function () {
            $scope.productListRef = firebase.database().ref().child("products/");
            $scope.productList = $firebaseArray($scope.productListRef);

            $scope.productList.$loaded()
                .then(function(list) {

                    $scope.productList.$watch(function (res) {
                        if(res.event === 'child_added' || res.event === 'child_removed'){
                            $("#productList").DataTable().clear().destroy();
                        }
                        if(res.event === 'child_changed'){
                            $("#productList").DataTable().destroy();
                        }
                        $scope.reloadDataTable();
                        $scope.reDrawChart();
                    });

                    $("#productList").DataTable().clear().destroy();
                    $scope.reloadDataTable();
                    $scope.reDrawChart();
                })
                .catch(function(error) {
                    console.log("Error:", error);
                });
        };

        $scope.delete = function (item) {

            var r = confirm("Are you sure to delete ?");
            if (r == true) {

                var storageRef = firebase.storage().ref();

                angular.forEach(item.images,function (image) {
                    var desertRef = storageRef.child(image.fullPath);

                    desertRef.delete().then(function() {

                    }).catch(function(error) {
                        // Uh-oh, an error occurred!
                    });
                });


                $scope.productList.$remove(item).then(function(ref) {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Delete success!!!')
                            .hideDelay(2000)
                    );
                });
            }

        };

        $scope.edit = function (item) {
            item.editing = true;
            $scope.originalItem = angular.copy(item);
        };

        $scope.doneEditing = function (item) {
            item.editing = false;
            $scope.productList.$save(item);
            $mdToast.show(
                $mdToast.simple()
                    .textContent('Edit success!!!')
                    .hideDelay(2000)
            );
        };

        $scope.revertEditing = function (item) {

            item.position = $scope.originalItem.position;
            item.name = $scope.originalItem.name;
            item.price = $scope.originalItem.price;
            item.type = $scope.originalItem.type;

            $scope.doneEditing(item);
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


        $scope.initChart = function () {
            $scope.data = [];
            $scope.chartConfig = {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: ''
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Brands',
                    colorByPoint: true,
                    data: $scope.data
                }]
            };

        };

        $scope.reDrawChart = function () {

            $scope.initChart();

            $scope.dataObject = {};

            //init object
            angular.forEach($scope.productTypeList, function (item, key) {
                $scope.dataObject[item.code] = 0;
            });

            //count
            angular.forEach($scope.productList, function (item, key) {
                $scope.dataObject[item.type]++;
            });

            //mapping
            angular.forEach($scope.dataObject, function (value, key) {
                $scope.data.push({name:$scope.productTypeObject[key], y: value});
            });

        };

        $scope.init = function () {
            $scope.getAuth();
            $scope.productName = 'Cổng nhôm đúc';
            $scope.productPrice = '250,000';

            $scope.productTypeList = [
                {code: 1, name: 'Cổng nhôm đúc'},
                {code: 2, name: 'Hàng rào'},
                {code: 3, name: 'Ban công'},
                {code: 4, name: 'Bông gió'},
                {code: 5, name: 'Cầu thang'}
            ];

            $scope.productTypeObject = {};
            angular.forEach($scope.productTypeList, function (value, key) {
                $scope.productTypeObject[value.code] = value.name;
            });
            $scope.initChart();
        };

        if ($location.path() === '') {
            $location.path('/');
        }
        $scope.location = $location;

}]);


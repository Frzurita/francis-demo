var _ = require('underscore');
module.exports = function (app) {
    app.controller('mainPage', function ($scope) {
        $scope.background_color= '';
        $scope.showAlert = function () {
            alert('hola');
        }
        $scope.changeBackground = function () {
            $scope.background_color = "dark";
        }
    });
    app.controller('mainCtrl', function ($scope,$http) {

    })
};

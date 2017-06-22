(function () {
    'use strict';

    angular
        .module('ngServerValidation')
        .directive('serverErrors', serverErrors);

    /* @ngInject */
    function serverErrors() {
        var directive = {
            link: link,
            require: '^form',
            restrict: 'E',
            templateUrl: 'server-errors.html'
        };

        return directive;

        function link(scope, element, attrs, controller) {
            scope.errors = function() {
                return controller.$serverErrors;
            }
        };
    }
})();
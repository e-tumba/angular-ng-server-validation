(function () {
    'use strict';

    angular
        .module('ngServerValidation')
        .directive('serverValidation', serverValidation);

    /* @ngInject */
    function serverValidation() {
        var directive = {
            link: link,
            require: 'form',
            restrict: 'A',
            scope: {
                errors: "=serverValidation"
            }
        };

        return directive;

        function link(scope, element, attrs, form) {
            scope.$watch(function () { return scope.errors; }, function () {
                if (scope.errors) {
                    var field;

                    // context.SetError("", "");
                    if (scope.errors.error && scope.errors.error_description) {
                        field = getField(scope.errors.error);
                        if (field) {
                            field.$setTouched();
                            field.$setValidity(scope.errors.error_description, false);
                        } else {
                            if (!form.$serverErrors) {
                                form.$serverErrors = {};
                            }

                            if (!form.$serverErrors[scope.errors.error]) {
                                form.$serverErrors[scope.errors.error] = {};
                            }

                            form.$serverErrors[scope.errors.error][scope.errors.error_description] = true;
                        }
                    }

                    // ModelState.AddModelError("", "")
                    else {
                        for (var property in scope.errors) {
                            field = getField(property);
                            if (field) {
                                field.$setTouched();
                                angular.forEach(scope.errors[property], function (error) {
                                    field.$setValidity(error, false);
                                });
                            } else {
                                if (!form.$serverErrors) {
                                    form.$serverErrors = {};
                                }

                                if (!form.$serverErrors[property]) {
                                    form.$serverErrors[property] = {};
                                }

                                angular.forEach(scope.errors[property], function (error) {
                                    form.$serverErrors[property][error] = true;
                                });
                            }
                        }
                    }
                }
            });

            function getField(propertyName) {
                for (var p1 in form) {
                    if (form.hasOwnProperty(p1)) {
                        if (p1.startsWith('formly_')) {
                            for (var p2 in form[p1]) {
                                if (form[p1].hasOwnProperty(p2)) {
                                    var regex = new RegExp("formly_[0-9]+_input_" + propertyName.substr(0, 1).toUpperCase() + propertyName.substr(1) + "_[0-9]+", "g");
                                    if (p2.match(regex)) {
                                        return form[p1][p2];
                                    }
                                }
                            }
                        }
                    }
                }

                return null;
            }
        }
    }
})();
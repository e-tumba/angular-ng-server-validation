﻿(function () {
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
                response: "=serverValidation"
            }
        };

        return directive;

        function link(scope, element, attrs, form) {
            scope.$watch(function () { return scope.response; }, function () {
                form.$serverErrors = [];
                if(scope.response && scope.response.errors && scope.response.type === 'Validation'){
                    for (var key in scope.response.errors){
                        var field = getField(key);
                        if(field != null){
                            field.$setTouched();
                            angular.forEach(scope.response.errors[key], function(error) {
                                field.$setValidity(error.code, false);
                                if(!field.$$scope.options.validation.messages[error.code]){
									field.$$scope.options.validation.messages[error.code] = function(){
										return error.message;
									}
                                }
                            });
                        }
                    };
                } else if(scope.response && scope.response.errors && scope.response.type === 'Business'){
                    for (var key in scope.response.errors){
                        form.$serverErrors.push(scope.response.errors[key].message);
                    }
                }
            });

            function getField(propertyName) {
                for (var p1 in form) {
                    if (form.hasOwnProperty(p1)) {
                        if (p1.startsWith('formly_')) {
                            for (var p2 in form[p1]) {
                                if (form[p1].hasOwnProperty(p2)) {
                                    var regex = new RegExp("formly_[0-9]+_input_" + propertyName + "_[0-9]+", "g");
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
'use strict';

/**
 * Directive to compare the value to a model value.
 * Used for the password confirmation inputs.
 */
const compareTo = function() {
  return {
    require: 'ngModel',
    scope: {
      otherModelValue: '=compareTo'
    },
    link: function(scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };
      scope.$watch('otherModelValue', function() {
        ngModel.$validate();
      });
    }
  };
};

module.exports = {
  attach: app => app.directive('compareTo', compareTo)
};
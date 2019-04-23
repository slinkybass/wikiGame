'use strict';
angular.module('app')
    .config(['$ocLazyLoadProvider', 'MODULES', function ($ocLazyLoadProvider, MODULES) {
        $ocLazyLoadProvider.config({
            debug: false,
            modules: MODULES
        });
    }]);
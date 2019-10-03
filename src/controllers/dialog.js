'use strict';
angular.module('app')
    .controller('DialogController', ['breadcrumb',
        function (breadcrumb) {
            var vm = this;
			
            vm.breadcrumb = breadcrumb;
        }
    ]);
'use strict';
angular.module('app')
    .controller('HomeController', ['$scope', '$sce', 'wikiAPI', 'getErrorAPI', 'SweetAlert', 'toaster', 'ngDialog',
        function ($scope, $sce, wikiAPI, getErrorAPI, SweetAlert, toaster, ngDialog) {
            var vm = this;

            document.loadSection = function (page) {
                wikiAPI.get({
                    format: 'json',
                    action: 'parse',
                    prop: 'text',
                    redirects: 1,
                    page: page
                }).then(function (data) {
                    window.scrollTo(0, 0);

                    var text = data.parse.text;
                    text = text[Object.keys(text)[0]];

                    vm.text = $sce.trustAsHtml(text);
                    vm.actualPage = data.parse.title;
                    vm.breadcrumb.push(vm.actualPage);

                    setTimeout(function () {
                        //Replace /wiki/ links
                        var links = document.getElementsByTagName("a");
                        for (var i = 0; i < links.length; i++) {
                            var article = decodeURI(links[i].getAttribute('href')).replace('/wiki/', '');
                            links[i].setAttribute('href', '#');
                            links[i].setAttribute('onclick', 'loadSection("' + article + '")');
                        }
                    }, 2000);
                });
            }

            vm.breadcrumb = [];
            document.loadSection('Pizza');
        }
    ]);
'use strict';
angular.module('app')
    .controller('HomeController', ['$scope', '$sce', 'wikiAPI', 'getErrorAPI', 'SweetAlert', 'toaster', 'ngDialog',
        function ($scope, $sce, wikiAPI, getErrorAPI, SweetAlert, toaster, ngDialog) {
            var vm = this;

            vm.begin = function () {
				vm.article_begin = vm.input_begin;
				vm.article_target = vm.input_target;
				document.loadSection(vm.article_begin);
			}
			vm.reset = function () {
				vm.article_begin = null;
				vm.article_target = null;
				vm.breadcrumb = [];
			}
			
            document.loadSection = function (page) {
				page = decodeURIComponent(page);
					
				console.log(page + ' - ' + vm.article_target);
				if (page == vm.article_target) {
					ngDialog.open({
						template: 'success',
						className: 'ngdialog-theme-default',
						controller: 'DialogController',
						controllerAs: 'dialogCtrl',
						resolve: {
							breadcrumb: function () {
								return vm.breadcrumb;
							}
						},
						preCloseCallback: function(){
							vm.reset();
						}
					});
				}
					
                wikiAPI.get({
                    format: 'json',
                    action: 'parse',
                    prop: 'text',
                    page: page
                }).then(function (data) {
                    window.scrollTo(0, 0);

                    var text = data.parse.text;
                    text = text[Object.keys(text)[0]];

                    vm.text = $sce.trustAsHtml(text);
                    vm.actualPage = data.parse.title;
                    vm.breadcrumb.push(vm.actualPage);

                    setTimeout(function () {
                        //Remove sups
						$('sup').remove();
                        //Remove index
						$('#toc').remove();
                        //Remove edit tags
						$('.mw-editsection').remove();
                        //Remove footer references
						$('#Referencias').parent('h2').remove();
						$('.listaref').remove();
                        //Remove footer external links
						$('#Enlaces_externos').parent('h2').next('ul').remove();
						$('#Enlaces_externos').parent('h2').remove();
                        //Remove footer authority
						$('.mw-authority-control').remove();
						
                        //Replace links
                        $("a").each(function(index) {
							var link = $(this).attr('href');
							//Is External URL?
							if(link.search('http:') > -1 || link.search('https:') > -1) {
								$(this).replaceWith($(this).html());
							} else {
								//Is Not Article?
								if(link.search('/wiki/') == -1) {
									$(this).replaceWith($(this).html());
								} else {
									var article = link.replace('/wiki/', '');
									//Is Not Regular Article?
									if(article.search('Archivo:') > -1 || article.search('Anexo:') > -1 || article.search('Especial:') > -1) {
										$(this).replaceWith($(this).html());
									} else {
										//Is Anchor?
										if(article.search('#') > -1) {
											article = article.split("#")[0];
										}
										$(this).attr('href', '#');
										$(this).attr('onclick', 'loadSection("' + article + '")');
									}
								}
							}
						});
						
                    }, 1);
                });
            }
			
			vm.reset();
        }
    ]);
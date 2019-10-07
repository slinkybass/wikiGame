'use strict';
angular.module('app')
    .controller('HomeController', ['$scope', '$sce', 'wikiAPI', 'getErrorAPI', 'SweetAlert', 'toaster', 'ngDialog',
        function ($scope, $sce, wikiAPI, getErrorAPI, SweetAlert, toaster, ngDialog) {
            var vm = this;

			vm.reset = function () {
				vm.input_begin = null;
				vm.input_target = null;
				
				vm.searcharticles_begin = [];
				vm.searcharticles_target = [];
				
				vm.article_begin = null;
				vm.article_target = null;
				
				vm.breadcrumb = [];
				vm.steps = 0;
				
				vm.actualPage = null;
				vm.actualPageTitle = null;
				vm.actualPageContent = null;
			}
			vm.random = function (id) {
				wikiAPI.get({
                    format: 'json',
                    action: 'query',
                    generator: 'random',
                    grnnamespace: 0
                }).then(function (data) {
                    var title = data.query.pages;
                    title = title[Object.keys(title)[0]].title;
					if (id == 'input_begin') {
						vm.input_begin = title;
					} else if (id == 'input_target') {
						vm.input_target = title;
					}
				});
			}
			
            vm.search = function (str, id) {
                if (str.length >= 1) {
					return wikiAPI.get({
						format: 'json',
						action: 'query',
						list: 'search',
						srsearch: str
					}).then(function (data) {
						var searcharticles = data.query.search.map(function(item) {
							return item['title'];
						});
						if (id == 'input_begin') {
							vm.searcharticles_begin = searcharticles;
						} else if (id == 'input_target') {
							vm.searcharticles_target = searcharticles;
						}
					});
                }
            }
			
			vm.begin = function () {
				if (vm.input_begin != vm.input_target) {
					vm.article_begin = vm.input_begin;
					vm.article_target = vm.input_target;
					document.loadSection(vm.article_begin);
				} else {
					toaster.pop('error', "The fields must be different!", "You cannot play if both fields are the same article");
				}
			}
			
            document.loadSection = function (page) {
				vm.actualPage = decodeURIComponent(page);
                wikiAPI.get({
                    format: 'json',
                    action: 'parse',
                    prop: 'text',
                    page: vm.actualPage
                }).then(function (data) {
                    window.scrollTo(0, 0);

                    var text = data.parse.text;
                    text = text[Object.keys(text)[0]];

                    vm.actualPageContent = $sce.trustAsHtml(text);
                    vm.actualPageTitle = data.parse.title;
					vm.breadcrumb.push(vm.actualPageTitle);
					if (vm.actualPageTitle.indexOf("(desambiguación)") == -1) {
						vm.steps++;
					}
					
					if (vm.actualPageTitle == vm.article_target) {
						ngDialog.open({
							template: 'success',
							className: 'ngdialog-theme-default',
							controller: 'DialogController',
							controllerAs: 'dialogCtrl',
							resolve: {
								breadcrumb: function () {
									return vm.breadcrumb;
								}
							}
						}).closePromise.then(function (data) {
							vm.reset();
						});
					}

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
                        $("#content .container.game a").each(function(index) {
							//Is Link?
							if (!$(this).attr('href')) {
								$(this).replaceWith($(this).html());
							} else {
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
										if(article.search('Archivo:') > -1 || article.search('Especial:') > -1) {
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
							}
						});
						
                    }, 1);
                });
            }
			
			vm.reset();
        }
    ]);
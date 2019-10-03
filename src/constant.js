'use strict';
angular.module('app')
    .constant('wikiAPI_URL',
        "https://es.wikipedia.org/w/api.php"
    )
    .constant('MODULES', [
    {
        name: 'home',
        files: [
            'src/controllers/home.js',
            'src/controllers/dialog.js'
        ]
    }]);
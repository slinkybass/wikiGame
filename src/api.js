angular.module('app')
    .factory('wikiAPI', ['$q', '$http', '$sce', 'wikiAPI_URL',
        function ($q, $http, $sce, wikiAPI_URL) {

            wikiAPI = {};

            /** ====================== API CALLING ===================== **/
            wikiAPI.api = function (endpoint, postdata, getdata, method) {
                getdata = getdata ? getdata : {};
                var defered = $q.defer();
                console.log(wikiAPI_URL + endpoint + '?' + wikiAPI.serialize(getdata));
                $http.jsonp($sce.trustAsResourceUrl(wikiAPI_URL + endpoint), {
                    data: postdata,
                    params: getdata,
                    method: method ? method : 'GET',
                    withCredentials: true
                }).then(function successCallback(response) {
                    if (response.status === 200) {
                        defered.resolve(response.data);
                    } else {
                        defered.reject(response);
                    }
                }, function errorCallback(response) {
                    defered.reject(response);
                });
                return defered.promise;
            };

            wikiAPI.serialize = function (obj) {
                var str = [];
                for (var p in obj)
                    if (obj.hasOwnProperty(p)) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                return str.join("&");
            };

            wikiAPI.get = function (getdata) {
                return wikiAPI.api('', null, getdata);
            };

            return wikiAPI;
        }
    ]);
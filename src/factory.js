'use strict';
angular.module('app')
    .factory('getErrorAPI', function () {
        return function (e) {
            e.msg = e.data ? (e.data.msg ? e.data.msg : e.msg) : e;
            e.msg_extra = e.data ? (e.data.msg_extra ? e.data.msg_extra : e.msg_extra) : e;
            e.msg = e.msg_extra ? e.msg + ' - ' + e.msg_extra : e.msg;
            return e.msg;
        }
    });
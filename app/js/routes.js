'use strict';

/**
 * @ngInject
 */
function Routes($stateProvider, $locationProvider, $urlRouterProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
  .state('Home', {
    url: '/',
    controller: 'HomeCtrl as home',
    templateUrl: 'home.html',
    title: '고려대학교 연구포털 공동기기 네트워크 맵'
  });

  $urlRouterProvider.otherwise('/');

}

module.exports = Routes;
'use strict';

var controllersModule = require('./_index');

/**
 * @ngInject
 */
function HomeCtrl(KrfService) {

  // ViewModel
  var vm = this;

  vm.title = 'visualization';
  vm.number = 1234;

  KrfService.get().then(function(data) {
    console.log(data);
  });

}

controllersModule.controller('HomeCtrl', HomeCtrl);
'use strict';

var controllersModule = require('./_index');
var _ = require('underscore');

/**
 * @ngInject
 */
function HomeCtrl($q, KrfService, AppSettings) {

  // ViewModel
  var vm = this;

  vm.title = 'visualization';
  vm.number = 1234;

  KrfService.get(AppSettings.apiUrlOrg)
    .then(getOrg)
    .then(getCat)
    .then(getEqu);

  function getOrg(data) {
    var d = $q.defer(),
      orgs = [];

    _.each(data.root.cbbSuppOrgCd, function(obj) {
      orgs.push(obj);
    });

    d.resolve(orgs);

    return d.promise;
  }

  function getCat(orgs) {
    var ret = [],
      req = [],
      d = $q.defer();

    _.each(orgs, function(org) {
      ret.push({
        cd: org.cd,
        cd_nm: org.cd_nm,
        categories: []
      });

      req.push(KrfService.get(AppSettings.apiUrlCat, {nequ050_supp_org_cd: org.cd}));
    });

    KrfService.getAll(req).then(function(data) {
      _.each(ret, function(obj, i) {
        _.each(data[i].root.cbbEquCateCd, function(obj2) {
          ret[i].categories.push(obj2.cd);
        });
      });
    });

    d.resolve(ret);

    return d.promise;
  }

  function getEqu(orgs) {
    var ret = [];

    setTimeout(function() {

      _.each(orgs, function(org, i) {
        var req = [];

        ret.push({
          name: org.cd_nm,
          categories: []
        });

        _.each(org.categories, function(category) {
          ret[i].categories.push({
            name: category,
            equipments: []
          });

          req.push(KrfService.get(AppSettings.apiUrlEqu, {
            nequ050_supp_org_cd: org.cd,
            nequ050_equ_cate_cd: category,
            yn: 1,
            page_cnt:50,
            start_page:1,
            end_page:500
          }));
        });

        KrfService.getAll(req).then(function(data) {
          if (data.length) {
            _.each(data, function(obj, j) {
              _.each(obj.root.mainList, function(obj2) {
                ret[i].categories[j].equipments.push(obj2);
              });
            });
          }
        });
      });

      setTimeout(function() {
        // 연구기관 > 기기분류 > 기기
        var graphData = {};
        graphData.orgs = ret;

        console.log(graphData);
      }, 3000);

    }, 3000);
  }

}

controllersModule.controller('HomeCtrl', HomeCtrl);
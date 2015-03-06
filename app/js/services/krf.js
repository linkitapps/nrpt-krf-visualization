'use strict';

var servicesModule = require('./_index.js');

/*
 지원기관
 res-protocol: json
 https://krf.korea.ac.kr/nequ/nEQU4010E/selectSuppOrgCdList.do
 {"root":{"cbbSuppOrgCd":[{"cd":"10015","cd_nm":"공과대학공동실험실"},{"cd":"10024","cd_nm":"반도체 디스플레이 녹색생산기술 연구센터"},{"cd":"10020","cd_nm":"보건의료과학기기센터"},{"cd":"10017","cd_nm":"생명과학대학  기기센터 "},{"cd":"10021","cd_nm":"연구진흥팀"},{"cd":"10016","cd_nm":"이과대학 공동기기실"},{"cd":"10018","cd_nm":"전략광물자원연구소 "},{"cd":"10019","cd_nm":"정보통신대학공동실험실"}]}}
 기기분류
 res-protocol: json
 nequ050_supp_org_cd: 10017
 https://krf.korea.ac.kr/nequ/nEQU3010E/selectEquList.do
 {"root":{"cbbEquCateCd":[{"cd":"원심분리기기","cd_nm":"원심분리기기"},{"cd":"유체분석기기","cd_nm":"유체분석기기"},{"cd":"생명과학기기","cd_nm":"생명과학기기"},{"cd":"무기분석기기","cd_nm":"무기분석기기"},{"cd":"유기분석기기","cd_nm":"유기분석기기"},{"cd":"생명일반기기","cd_nm":"일반기기"},{"cd":"생명기초기기","cd_nm":"기초기기"},{"cd":"구조분석기기","cd_nm":"구조분석기기"}]}}
 기기목록
 res-protocol: json
 nequ050_supp_org_cd:10017
 nequ050_equ_cate_cd:원심분리기기
 yn: 1
 page_cnt:50
 start_page:1
 end_page:500
 https://krf.korea.ac.kr/nequ/nEQU4010E/mainList.do

*/

/**
 * @ngInject
 */
function KrfService($q, $http) {

  var service = {};

  service.get = function() {
    var deferred = $q.defer(),
      headers = {
        'res-protocol': 'json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      formData = {
        'nequ050_supp_org_cd': 10017
      };

    $http({
      method: 'POST',
      url: 'https://krf.korea.ac.kr/nequ/nEQU3010E/selectEquList.do',
      headers: headers,
      transformRequest: function(obj) {
        var str = [];
        for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
      },
      data: formData
    }).success(function(data) {
      deferred.resolve(data);
    }).error(function(err, status) {
      deferred.reject(err, status);
    });

    return deferred.promise;
  };

  return service;

}

servicesModule.service('KrfService', KrfService);
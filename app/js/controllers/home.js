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

        // ajaxSpinner 지우기
        var spinner = document.getElementById('ajaxSpinner');
        spinner.parentNode.removeChild(spinner);

        // 차트 생성
        drawChart(graphData);
      }, 3000);

    }, 3000);
  }

  // 차트 생성 함수
  function drawChart(data) {
    var netChartData = {
      nodes: [],
      links: []
    };

    // 데이터 생성 시작
    netChartData.nodes.push({
      id: 'root',
      loaded: true,
      style: {
        label: '고려대학교 공동기기'
      }
    });

    _.each(data.orgs, function(org, i) {
      netChartData.nodes.push({
        id: 'org' + i,
        loaded: true,
        style: {
          label: org.name
        }
      });

      _.each(org.categories, function(cat, j) {
        netChartData.nodes.push({
          id: 'org' + i + '_cat' + j,
          loaded: true,
          style: {
            label: cat.name
          }
        });

        _.each(cat.equipments, function(equ, k) {
          netChartData.nodes.push({
            id: 'org' + i + '_cat' + j + '_equ' + k,
            loaded: true,
            style: {
              label: equ.nequ050_artl_nm
            }
          })
        });
      });
    });

    _.each(netChartData.nodes, function(obj, i) {
      var temp = obj.id.split('_');

      if (temp.length == 1) {
        netChartData.links.push({
          id: 'link' + i,
          from: 'root',
          to: obj.id,
          style: {
            fillColor: 'red',
            toDecoration: 'arrow'
          }
        });
      } else if (temp.length == 2) {
        netChartData.links.push({
          id: 'link' + i,
          from: temp[0],
          to: obj.id,
          style: {
            fillColor: 'blue',
            toDecoration: 'arrow'
          }
        });
      } else if (temp.length == 3) {
        netChartData.links.push({
          id: 'link' + i,
          from: temp[0] + '_' + temp[1],
          to: obj.id,
          style: {
            fillColor: 'green',
            toDecoration: 'arrow'
          }
        });
      }
    });
    // 데이터 생성 끝

    var startNodeId = "root";
    var endNodeId = null;
    var endpointColor = "#09c";
    var pathColor = "#09c";
    var pathIds = {};
    var chart = 0;

    // 차트 생성
    chart = new NetChart({
      container: document.getElementById('chartContainer'),
      data: {
        preloaded: netChartData
      },
      navigation:{
        mode: 'focusnodes',
        initialNodes: ['root']
      },
      style:{
        makeImagesCircular: true,
        nodeRules: {
          '1-basic': nodeStyle,
          '2-highlight': nodeHighlight
        },
        linkRules:{
          '2-highlight':linkHighlight
        }
      },
      toolbar: {
        items: []
      },
      events:{
        onHoverChange: function(event){
          if (event.hoverNode)changeTargetNode(event.hoverNode)
        },
        onClick: function(event){
          if (event.clickNode)changeTargetNode(event.clickNode)
        }
      }
    });

    function changeTargetNode(node){
      var nodeId = node.id;
      if (nodeId != endNodeId)
      {
        endNodeId = nodeId;
        if (endNodeId) {
          pathIds = computePath();
        } else {
          pathIds = {};
        }

        chart.updateStyle();
      }
    }

    function nodeStyle(node){
      node.labelStyle.textStyle.font = '14px dotum';
    }

    function nodeHighlight(node){
      var endNode = (node.id == startNodeId || node.id == endNodeId);

      if (endNode || pathIds[node.id]){
        node.fillColor = pathColor;
        node.label = node.data.style.label;
      }

      if (endNode){
        node.lineColor = endpointColor;
        node.lineWidth = 7;
        node.radius = 50;
      }
    }

    function linkHighlight(link){
      if (pathIds[link.id]){
        link.fillColor = pathColor;
        link.radius = 4;
      }
    }

    function computePath(){
      //compute shortest path, quick and dirty
      var from = chart.getNode(startNodeId);
      var to = chart.getNode(endNodeId);
      var back = {};
      var queue = [from];
      var link, next, cur;

      while (queue.length > 0){
        cur = queue.shift();
        if (cur == to) break;
        for (var i in cur.links){
          link = cur.links[i];
          next = link.otherEnd(cur);
          if (back[next.id]) continue;
          back[next.id] = link;
          queue.push(next);
        }
      }

      var result = {};
      while (cur != from){
        link = back[cur.id];
        cur = link.otherEnd(cur);
        result[link.id] = true;
        result[cur.id] = true;
      }
      return result;
    }
  }

}

controllersModule.controller('HomeCtrl', HomeCtrl);
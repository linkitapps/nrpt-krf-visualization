'use strict';

var AppSettings = {
  appTitle: 'NRPT KRF Application',
  apiUrlOrg: 'https://krf.korea.ac.kr/nequ/nEQU4010E/selectSuppOrgCdList.do',
  apiUrlCat: 'https://krf.korea.ac.kr/nequ/nEQU3010E/selectEquList.do',
  apiUrlEqu: 'https://krf.korea.ac.kr/nequ/nEQU4010E/mainList.do',
  requestHeaders: {
    'res-protocol': 'json',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
};

module.exports = AppSettings;
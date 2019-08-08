/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var dest = document.body, cbFuncName = 'rfc_jsonp_recv',
    fileName = (window.location.search || '').slice(1).replace(/\W/g, '-'),
    jsonpUrl = '../jsonp.php/text-only/' + fileName + '.txt?cb=' + cbFuncName,
    jsonpTag = document.createElement('script');
  window[cbFuncName] = function recv(status, origText) {
    dest.innerHTML = (status === 200
      ? window.renderRfcAsHtml(origText)
      : (status + ' ' + origText));
  };
  jsonpTag.src = jsonpUrl;
  jsonpTag.onerror = function (link) {
    dest.innerHTML = '<b>Error:</b> Failed to load <a target="_blank"></a>';
    link = dest.lastChild;
    link.href = jsonpUrl; // Browser instantly transforms it to an absolute URL.
    link.innerHTML = link.href;
  };
  dest.appendChild(jsonpTag);
}());

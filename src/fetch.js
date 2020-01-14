/*jslint indent: 2, maxlen: 80, continue: false, unparam: false, browser: true */
/* -*- tab-width: 2 -*- */
(function () {
  'use strict';
  var navForm = document.forms.rfcnav, dest = document.getElementById('out'),
    origDocTitle = document.title;

  function getBodyAsText(body) { return body.text(); }
  function displayHtml(html) { dest.innerHTML = html; }

  function errorToHtml(err) {
    var frag = document.createElement('div');
    frag.innerHTML = '<b>Error:</b> ';
    frag.appendChild(document.createTextNode(String(err.message || err)));
    return frag.innerHTML;
  }

  function fetchAndRender() {
    var rfcNum = +navForm.elements.rfcnum.value,
      url = '../text-only/rfc' + rfcNum + '.txt';
    location.hash = '#' + rfcNum;
    document.title = 'RFC ' + rfcNum + ' — ' + origDocTitle;
    window.fetch(url).then(getBodyAsText
      ).then(window.renderRfcAsHtml, errorToHtml).then(displayHtml);
  }

  function fetchSoon() {
    setTimeout(fetchAndRender, 1);
    return false;
  }
  navForm.onsubmit = fetchSoon;
  (function maybeRestoreRfcNum() {
    var rfcNum = (+location.hash.slice(1) || 0);
    if (!rfcNum) { return; }
    navForm.elements.rfcnum.value = rfcNum;
    fetchSoon();
  }());
}());

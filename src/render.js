/* -*- coding: UTF-8, tab-width: 2 -*- */
/*jslint indent: 2, maxlen: 80, browser: true */
/*globals define:true*/
(function unifiedExport(moduleName, factory, exports, backup) {
  'use strict';
  if (('function' === typeof define) && define.amd) { return define(factory); }
  if (('object' === typeof module) && module && module.exports) {
    module.exports = factory();
    return;
  }
  if (('object' === typeof window) && window.navigator) {
    exports = factory();
    backup = window[moduleName];
    exports.noConflict = function (key) {
      window[moduleName] = backup;
      if (key) { window[key] = exports; }
      return exports;
    };
    window[moduleName] = exports;
  }
}('renderRfcAsHtml', function () {
  'use strict';
  var EX;

  function dashify(x) {
    return String(x).toLowerCase().match(/[A-Za-z0-9]+/g).join('-');
  }

  function xmlenc(txt) {
    return txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
      '&gt;').replace(/'/g, '&#39;').replace(/"/g, '&quot;');
  }


  EX = function renderRfcAsHtml(origText) {
    var html = String(origText).replace(/\r/g, '');
    html = xmlenc(html);
    html = html.split(/\f/).map(EX.stripPageHeaderAndFooter).join('\n');
    function hhr(r, w) { html = html.replace(r, w); }

    hhr(/\nTable of [Cc]ontents?([\r\n]+ [ -~]+)+\n+/, EX.tableOfContents);
    hhr(/\n{2,}/g, '</p>\n\n<p>');
    hhr(/\r/g, '\n');

    hhr(/<p>(\w[ -~]+)<\/p>/g, EX.headline);
    hhr(/<p>\s*<\/p>/g, '');
    hhr(/<chapter>\s*<\/chapter>/g, '');

    hhr(/<p> {3}([!-~])/g, '<p class="tx">$1');
    hhr(/<p> {6}([\w\- ]{1,30}): ([!-~][\S\s]*?)<\/p>/g,
      '<dl><dt>$1:</dt><dd>$2</dd></dl>');
    hhr(/<\/dl>(\s*)<dl>/g, '$1');
    hhr(/<p> {6}([!-~][\S\s]*?)<\/p>/g, '<blockquote>$1</blockquote>');
    hhr(/<p>( *)/g, function unknownIndent(m, ind) {
      return ('<p class="unknown" indent="' + ind.length + '">') || m;
    });
    return html;
  };


  EX.maxAnkleLines = 7; /*
    When there are more than maxAnkleLines blank lines above the page footer,
    we attribute the remainder to an intentional paragraph rather than mere
    accidential text placement, based on the example date at the bottom
    of page 4 of https://www.rfc-editor.org/rfc/rfc8594.txt (2023-03-02).
    If we were to remove one more blank line here, the example code
    would be merged with the next paragraph.
  */


  EX.stripPageHeaderAndFooter = function addOnePage(pgText, pgIdx) {
    var tx = pgText.trim();
    if (pgIdx === 0) {
      tx = tx.replace(/^Network Working Group {10,}[ -~]{0,120}\n+/, '');
    } else {
      tx = tx.replace(/^RFC \d+ {10,}[ -~]{0,120}\n+/, '');
    }
    tx = tx.replace(/(\n+)(\S[ -~]+\[Page \d+\])$/, function footer(m, b, d) {
      return m && ('\n<span class="page-footer"'
        + ' data-blank-lines-above-page-footer="' + b.length + '"'
        + '>' + d + '</span>') + b.slice(EX.maxAnkleLines);
    });
    return tx;
  };


  EX.headline = function headline(m, hl) {
    var nums = (/^([0-9\.]+)\. /.exec(hl) || ''), lvl = 0, tag, attr, id;
    if (nums) {
      hl = hl.slice(nums[0].length).trim();
      nums = nums[1];
      lvl = nums.split(/\./).length;
    }
    id = dashify(nums || hl);
    tag = 'h' + Math.min(Math.max(1, lvl), 6);
    attr = (id + '" class="heading chlv-' + lvl
      + '" ch-level="'  + lvl
      + '" ch-num="' + nums
      + '"');
    m = ('</chapter>\n\n<chapter id="ch-' + attr
      + '\n  ><' + tag + ' id="hl-' + attr
      + (nums && ('><span class="ch-num">' + nums
        + '</span><span class="ch-num-sep">. </span'))
      + '\n  ><a href="#hl-' + id
      + '"\n  >' + hl + '</a></' + tag + '>');
    return m;
  };


  EX.tableOfContents = function tableOfContents(toc) {
    toc = toc.trim().replace(/\n{2,}/g, '\n');
    toc = ('</p>\r\r</chapter>\r\r<chapter id="toc">' + toc
      + '\n  <a id="toc-end"></a>\n</chapter><chapter><p>');
    return toc;
  };






















  return EX;
}));

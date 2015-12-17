/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

(function(document) {
  'use strict';

  var webComponentsSupported = ('registerElement' in document
    && 'import' in document.createElement('link')
    && 'content' in document.createElement('template'));

  if (!webComponentsSupported) {
    loadWebComponentPolyfill().then(loadSequence);
  } else {
    loadSequence();
  }

  function loadWebComponentPolyfill(cb) {
    return new Promise(function(resolve, reject) {
      var polyfill = document.createElement('script');
      polyfill.src = 'bower_components/webcomponentsjs/webcomponents-lite.min.js';
      polyfill.onload = resolve;
      polyfill.onerror = reject;
      document.head.appendChild(polyfill);
    });
  }

  function loadElements() {
    return new Promise(function(resolve, reject) {
      var bundle = document.createElement('link');
      bundle.rel = 'import';
      bundle.href = '../elements/elements.html';
      bundle.onload = resolve;
      bundle.onerror = reject;
      document.head.appendChild(bundle);
    });
  }

  function loadBody() {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', 'body.html');
      req.addEventListener('load', function () {
        // Add Polymer specific classes to the body
        document.body.classList.add('fullbleed', 'layout', 'vertical');
        document.body.setAttribute('unresolved', true);
        document.body.innerHTML = this.responseText;
        resolve();
      });
      req.addEventListener('error', function () {
        throw new Error('Body Request Error');
        reject();
      });
      req.send();
    });
  };

  function loadScripts() {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = 'scripts/body-app.js';
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function loadSequence() {
    return new Promise(function(resolve, reject) {
      // loadElements().then(loadBody).then(loadScripts);
      loadBody().then(loadScripts);
    })
    .catch(function() {
      throw new Error('Page Load Error');
    });
  };

})(document);

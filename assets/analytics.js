/* Cookieless page counting. Nothing loads until you set a code below.
   GoatCounter: sign up at goatcounter.com, pick a code, paste it here.
   It sets no cookies, stores no personal data, and needs no consent banner. */
(function () {
  var GOATCOUNTER_CODE = "";   // e.g. "acrostia"  -> https://acrostia.goatcounter.com

  if (!GOATCOUNTER_CODE) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.setAttribute('data-goatcounter', 'https://' + GOATCOUNTER_CODE + '.goatcounter.com/count');
  document.head.appendChild(s);
})();

(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["VoxApp"]=t():e["VoxApp"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function n(i){if(t[i])return t[i].exports;var o=t[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(i,o,function(t){return e[t]}.bind(null,o));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s="fae3")}({"1eb2":function(e,t,n){"use strict";if("undefined"!==typeof window){var i=window.document.currentScript,o=n("8875");i=o(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:o});var r=i&&i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);r&&(n.p=r[1])}},"5ff4":function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const i=n("a7f1");document.title="Rendering & Art";let o=new i.AppLoader;o.initialize()},8875:function(e,t,n){var i,o,r;(function(n,s){o=[],i=s,r="function"===typeof i?i.apply(t,o):i,void 0===r||(e.exports=r)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(p){var n,i,o,r=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,s=/@([^@]*):(\d+):(\d+)\s*$/gi,c=r.exec(p.stack)||s.exec(p.stack),l=c&&c[1]||!1,u=c&&c[2]||!1,d=document.location.href.replace(document.location.hash,""),a=document.getElementsByTagName("script");l===d&&(n=document.documentElement.outerHTML,i=new RegExp("(?:[^\\n]+?\\n){0,"+(u-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),o=n.replace(i,"$1").trim());for(var f=0;f<a.length;f++){if("interactive"===a[f].readyState)return a[f];if(a[f].src===l)return a[f];if(l===d&&a[f].innerHTML&&a[f].innerHTML.trim()===o)return a[f]}return null}}return e}))},a7f1:function(e,t,n){"use strict";var i;function o(e){function t(n){e.run(),window.requestAnimationFrame(t)}e.initialize(),window.requestAnimationFrame(t)}Object.defineProperty(t,"__esModule",{value:!0});class r{constructor(){}initialize(){var e=window;i=e["VoxApp"];let t=new i.VoxAppInstance;o(t),this.initScene(t)}initScene(e){let t=new i.Axis3DEntity;t.initialize(30),t.setXYZ(300,0,0),e.addEntity(t);let n=new i.Box3DEntity;n.initializeCube(100,[e.getImageTexByUrl("./assets/default.jpg")]),e.addEntity(n)}}class s{constructor(){this.A=null,this.B=null}initialize(){let e=location.href+"";e=this.parseUrl(e),e="../build/VoxAppEngine.package.js",this.initUI(),this.load(e)}load(e){let t=new XMLHttpRequest;t.open("GET",e,!0),t.onerror=function(e){},t.onprogress=e=>{this.showLoadInfo(e)},t.onload=()=>{let e=document.createElement("script");e.onerror=e=>{},e.innerHTML=t.response,document.head.appendChild(e),this.loadFinish(),this.initApp()},t.send(null)}initApp(){let e=new r;e.initialize()}showLoadInfo(e){this.showLoadProgressInfo(e)}parseUrl(e){let t=e.split("?");if(t.length<2||t[0].indexOf("renderCase")<1)return"";let n=t[1];return t=n.split("&"),t.length<2||t[0].indexOf("sample")<0?"":(n=t[1],t=n.split("="),t.length<2||"demo"!=t[0]?"":"static/voxweb3d/demos/"+t[1]+".js")}initUI(){document.body.style.background="#000000",this.A=document.createElement("div"),this.A.style.width="100vw",this.A.style.height="100vh",this.elementCenter(this.A),document.body.appendChild(this.A),document.body.style.margin="0",this.showInfo("init...")}showInfo(e){null==this.B&&(this.B=document.createElement("div"),this.B.style.backgroundColor="rgba(255,255,255,0.1)",this.B.style.color="#00ee00",this.elementCenter(this.B),this.A.appendChild(this.B)),this.B.innerHTML=e}showLoadProgressInfo(e){let t="loading "+Math.round(100*e.loaded/e.total)+"% ";this.showInfo(t)}showLoadStart(){this.showInfo("loading 0%")}showLoaded(){this.showInfo("100%")}loadFinish(){null!=this.A&&(this.A.parentElement.removeChild(this.A),this.A=null)}elementCenter(e,t="50%",n="50%",i="absolute"){e.style.textAlign="center",e.style.display="flex",e.style.flexDirection="column",e.style.justifyContent="center",e.style.alignItems="center"}}t.AppLoader=s,t.default=s},fae3:function(e,t,n){"use strict";n.r(t);n("1eb2");var i=n("5ff4");for(var o in i)["default"].indexOf(o)<0&&function(e){n.d(t,e,(function(){return i[e]}))}(o)}})}));
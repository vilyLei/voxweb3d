(function(e,t){"object"===typeof exports&&"object"===typeof module?module.exports=t():"function"===typeof define&&define.amd?define([],t):"object"===typeof exports?exports["ModuleOBJGeomParser"]=t():e["ModuleOBJGeomParser"]=t()})("undefined"!==typeof self?self:this,(function(){return function(e){var t={};function r(s){if(t[s])return t[s].exports;var n=t[s]={i:s,l:!1,exports:{}};return e[s].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=t,r.d=function(e,t,s){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},r.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)r.d(s,n,function(t){return e[t]}.bind(null,n));return s},r.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s="fae3")}({"1eb2":function(e,t,r){"use strict";if("undefined"!==typeof window){var s=window.document.currentScript,n=r("8875");s=n(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:n});var i=s&&s.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);i&&(r.p=i[1])}},"3a68":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});class s{constructor(e=!0){e&&ThreadCore.initializeExternModule(this)}receiveData(e){}postMessageToThread(e,t=null){null!=t?ThreadCore.postMessageToThread(e):ThreadCore.postMessageToThread(e,t)}getTaskClass(){throw Error("the taskClass value is illegal !!!")}dependencyFinish(){}getUniqueName(){throw Error("the uniqueName value is illegal !!!")}}t.BaseTaskInThread=s},6155:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=r("3a68"),n=r("eec2");class i extends s.BaseTaskInThread{constructor(){super(),this.m_srcuid=-1,this.m_dataIndex=-1}parseFromStr(e,t){let r=[],s=new n.ObjDataParser,i=null,o=[];try{i=s.Parse(t)}catch(u){}if(null!=i){let e=i.length;for(let t=0;t<e;++t){const e=i[t].geometry,s=this.createModel(e);if(null!=s.vertices){o.push(s.indices),o.push(s.vertices),o.push(s.normals);for(let e=0,t=s.uvsList.length;e<t;++e)o.push(s.uvsList[e])}r.push(s)}}let a={models:r};e.data=a,o.length>0?this.postMessageToThread(e,o):this.postMessageToThread(e)}createModel(e){let t=e.vertices.length,r=t/3;if(r>=3){let t=null;if(null==t){t=r<=65535?new Uint16Array(r):new Uint32Array(r);for(let e=0;e<r;++e)t[e]=e}let s={uvsList:[new Float32Array(e.uvs)],vertices:new Float32Array(e.vertices),normals:new Float32Array(e.normals),indices:t};return s}{let e={uvsList:null,vertices:null,normals:null,indices:null};return e}}receiveData(e){this.m_srcuid=e.srcuid,this.m_dataIndex=e.dataIndex;let t=e.streams[0];const r=new FileReader;r.onload=t=>{this.parseFromStr(e,r.result)},r.readAsText(new Blob([t]))}async loadMeshDataByUrl(e,t,r,s=""){const n=new FileReader;n.onload=r=>{t(n.result,e)};const i=new XMLHttpRequest;i.open("GET",e,!0),""!=s&&i.setRequestHeader("Range",s),i.responseType="blob",i.onload=t=>{i.status<=206?n.readAsArrayBuffer(i.response):r(i.status,e)},i.onerror=t=>{r(i.status,e)},i.send(null)}getTaskClass(){return 103}}t.ModuleCTMGeomParser=i;new i},8875:function(e,t,r){var s,n,i;(function(r,o){n=[],s=o,i="function"===typeof s?s.apply(t,n):s,void 0===i||(e.exports=i)})("undefined"!==typeof self&&self,(function(){function e(){var t=Object.getOwnPropertyDescriptor(document,"currentScript");if(!t&&"currentScript"in document&&document.currentScript)return document.currentScript;if(t&&t.get!==e&&document.currentScript)return document.currentScript;try{throw new Error}catch(f){var r,s,n,i=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,o=/@([^@]*):(\d+):(\d+)\s*$/gi,a=i.exec(f.stack)||o.exec(f.stack),u=a&&a[1]||!1,l=a&&a[2]||!1,c=document.location.href.replace(document.location.hash,""),h=document.getElementsByTagName("script");u===c&&(r=document.documentElement.outerHTML,s=new RegExp("(?:[^\\n]+?\\n){0,"+(l-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),n=r.replace(s,"$1").trim());for(var d=0;d<h.length;d++){if("interactive"===h[d].readyState)return h[d];if(h[d].src===u)return h[d];if(u===c&&h[d].innerHTML&&h[d].innerHTML.trim()===n)return h[d]}return null}}return e}))},eec2:function(e,t,r){"use strict";function s(){var e=/^[og]\s*(.+)?/,t=/^mtllib /,r=/^usemtl /,s=/^usemap /;function n(){var e={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(e,t){if(this.object&&!1===this.object.fromDeclaration)return this.object.name=e,void(this.object.fromDeclaration=!1!==t);var r=this.object&&"function"===typeof this.object.currentMaterial?this.object.currentMaterial():void 0;if(this.object&&"function"===typeof this.object._finalize&&this.object._finalize(!0),this.object={name:e||"",fromDeclaration:!1!==t,geometry:{vertices:[],normals:[],colors:[],uvs:[]},materials:[],smooth:!0,startMaterial:function(e,t){var r=this._finalize(!1);r&&(r.inherited||r.groupCount<=0)&&this.materials.splice(r.index,1);var s={index:this.materials.length,name:e||"",mtllib:Array.isArray(t)&&t.length>0?t[t.length-1]:"",smooth:void 0!==r?r.smooth:this.smooth,groupStart:void 0!==r?r.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(e){var t={index:"number"===typeof e?e:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return t.clone=this.clone.bind(t),t}};return this.materials.push(s),s},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(e){var t=this.currentMaterial();if(t&&-1===t.groupEnd&&(t.groupEnd=this.geometry.vertices.length/3,t.groupCount=t.groupEnd-t.groupStart,t.inherited=!1),e&&this.materials.length>1)for(var r=this.materials.length-1;r>=0;r--)this.materials[r].groupCount<=0&&this.materials.splice(r,1);return e&&0===this.materials.length&&this.materials.push({name:"",smooth:this.smooth}),t}},r&&r.name&&"function"===typeof r.clone){var s=r.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&"function"===typeof this.object._finalize&&this.object._finalize(!0)},parseVertexIndex:function(e,t){var r=parseInt(e,10);return 3*(r>=0?r-1:r+t/3)},parseNormalIndex:function(e,t){var r=parseInt(e,10);return 3*(r>=0?r-1:r+t/3)},parseUVIndex:function(e,t){var r=parseInt(e,10);return 2*(r>=0?r-1:r+t/2)},addVertex:function(e,t,r){var s=this.vertices,n=this.object.geometry.vertices;n.push(s[e+0],s[e+1],s[e+2]),n.push(s[t+0],s[t+1],s[t+2]),n.push(s[r+0],s[r+1],s[r+2])},addVertexPoint:function(e){var t=this.vertices,r=this.object.geometry.vertices;r.push(t[e+0],t[e+1],t[e+2])},addVertexLine:function(e){var t=this.vertices,r=this.object.geometry.vertices;r.push(t[e+0],t[e+1],t[e+2])},addNormal:function(e,t,r){var s=this.normals,n=this.object.geometry.normals;n.push(s[e+0],s[e+1],s[e+2]),n.push(s[t+0],s[t+1],s[t+2]),n.push(s[r+0],s[r+1],s[r+2])},addColor:function(e,t,r){var s=this.colors,n=this.object.geometry.colors;n.push(s[e+0],s[e+1],s[e+2]),n.push(s[t+0],s[t+1],s[t+2]),n.push(s[r+0],s[r+1],s[r+2])},addUV:function(e,t,r){var s=this.uvs,n=this.object.geometry.uvs;n.push(s[e+0],s[e+1]),n.push(s[t+0],s[t+1]),n.push(s[r+0],s[r+1])},addUVLine:function(e){var t=this.uvs,r=this.object.geometry.uvs;r.push(t[e+0],t[e+1])},addFace:function(e,t,r,s,n,i,o,a,u){var l=this.vertices.length,c=this.parseVertexIndex(e,l),h=this.parseVertexIndex(t,l),d=this.parseVertexIndex(r,l);if(this.addVertex(c,h,d),this.colors.length>0&&this.addColor(c,h,d),void 0!==s&&""!==s){var f=this.uvs.length;c=this.parseUVIndex(s,f),h=this.parseUVIndex(n,f),d=this.parseUVIndex(i,f),this.addUV(c,h,d)}if(void 0!==o&&""!==o){var p=this.normals.length;c=this.parseNormalIndex(o,p),h=o===a?c:this.parseNormalIndex(a,p),d=o===u?c:this.parseNormalIndex(u,p),this.addNormal(c,h,d)}},addPointGeometry:function(e){this.object.geometry.type="Points";for(var t=this.vertices.length,r=0,s=e.length;r<s;r++)this.addVertexPoint(this.parseVertexIndex(e[r],t))},addLineGeometry:function(e,t){this.object.geometry.type="Line";for(var r=this.vertices.length,s=this.uvs.length,n=0,i=e.length;n<i;n++)this.addVertexLine(this.parseVertexIndex(e[n],r));var o=0;for(i=t.length;o<i;o++)this.addUVLine(this.parseUVIndex(t[o],s))}};return e.startObject("",!1),e}this.Parse=function(i){var o=new n;-1!==i.indexOf("\r\n")&&(i=i.replace(/\r\n/g,"\n")),-1!==i.indexOf("\\\n")&&(i=i.replace(/\\\n/g,""));for(var a=i.split("\n"),u="",l="",c=0,h=[],d="function"===typeof"".trimLeft,f=0,p=a.length;f<p;f++)if(u=a[f],u=d?u.trimLeft():u.trim(),c=u.length,0!==c&&(l=u.charAt(0),"#"!==l))if("v"===l){var m=u.split(/\s+/);switch(m[0]){case"v":o.vertices.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3])),m.length>=7&&o.colors.push(parseFloat(m[4]),parseFloat(m[5]),parseFloat(m[6]));break;case"vn":o.normals.push(parseFloat(m[1]),parseFloat(m[2]),parseFloat(m[3]));break;case"vt":o.uvs.push(parseFloat(m[1]),parseFloat(m[2]));break}}else if("f"===l){for(var v=u.substr(1).trim(),g=v.split(/\s+/),b=[],y=0,x=g.length;y<x;y++){var j=g[y];if(j.length>0){var M=j.split("/");b.push(M)}}var T=b[0];for(y=1,x=b.length-1;y<x;y++){var w=b[y],I=b[y+1];o.addFace(T[0],w[0],I[0],T[1],w[1],I[1],T[2],w[2],I[2])}}else if("l"===l){var O=u.substring(1).trim().split(" "),F=[],L=[];if(-1===u.indexOf("/"))F=O;else for(var P=0,V=O.length;P<V;P++){var S=O[P].split("/");""!==S[0]&&F.push(S[0]),""!==S[1]&&L.push(S[1])}o.addLineGeometry(F,L)}else if("p"===l){v=u.substr(1).trim();var _=v.split(" ");o.addPointGeometry(_)}else if(null!==(h=e.exec(u))){var C=(" "+h[0].substr(1).trim()).substr(1);o.startObject(C)}else if(r.test(u))o.object.startMaterial(u.substring(7).trim(),o.materialLibraries);else if(t.test(u))o.materialLibraries.push(u.substring(7).trim());else if(s.test(u));else if("s"===l){if(h=u.split(" "),h.length>1){var E=h[1].trim().toLowerCase();o.object.smooth="0"!==E&&"off"!==E}else o.object.smooth=!0;var U=o.object.currentMaterial();U&&(U.smooth=o.object.smooth)}else if("\0"===u)continue;return o.finalize(),o.objects}}r.r(t),r.d(t,"ObjDataParser",(function(){return s}))},fae3:function(e,t,r){"use strict";r.r(t);r("1eb2");var s=r("6155");for(var n in s)["default"].indexOf(n)<0&&function(e){r.d(t,e,(function(){return s[e]}))}(n)}})}));
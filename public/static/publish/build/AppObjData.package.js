(function(t,e){"object"===typeof exports&&"object"===typeof module?module.exports=e():"function"===typeof define&&define.amd?define([],e):"object"===typeof exports?exports["AppObjData"]=e():t["AppObjData"]=e()})("undefined"!==typeof self?self:this,(function(){return function(t){var e={};function r(s){if(e[s])return e[s].exports;var i=e[s]={i:s,l:!1,exports:{}};return t[s].call(i.exports,i,i.exports,r),i.l=!0,i.exports}return r.m=t,r.c=e,r.d=function(t,e,s){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:s})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var s=Object.create(null);if(r.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(s,i,function(e){return t[e]}.bind(null,i));return s},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s="fae3")}({"098c":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});const s=r("4b10"),i=r("eec2");class n{constructor(){this.A=null,this.B=null,this.C=null,this.D=null,this.E=null,this.moduleScale=1,this.baseParsering=!1}getVS(){return this.B}getUVS(){return this.C}getNVS(){return this.D}getIVS(){return this.A}parse(t,e=!1){if(this.baseParsering){this.E=new s.ObjStrDataParser,this.E.parseStrData(t,this.moduleScale,e),this.B=new Float32Array(this.E.getVS()),this.C=new Float32Array(this.E.getUVS()),this.D=new Float32Array(this.E.getNVS());let r=this.E.getIVS();this.A=r.length<=65535?new Uint16Array(r):new Uint32Array(r)}else{let r=new i.ObjDataParser,s=r.Parse(t),n=s.length,a=0;for(let t=0;t<n;++t)a+=s[t].geometry.vertices.length;let o=a/3,h=2*o;this.B=new Float32Array(a);let l=0;for(let t=0;t<n;++t)this.B.set(s[t].geometry.vertices,l),l+=s[t].geometry.vertices.length;if(1!=this.moduleScale)for(let t=0;t<n;++t)this.B[t]*=this.moduleScale;this.C=new Float32Array(h),l=0;for(let t=0;t<n;++t)this.C.set(s[t].geometry.uvs,l),l+=s[t].geometry.uvs.length;this.D=new Float32Array(a),l=0;for(let t=0;t<n;++t)this.D.set(s[t].geometry.normals,l),l+=s[t].geometry.normals.length;this.A=o<=65535?new Uint16Array(o):new Uint32Array(o);for(let t=0;t<o;++t)this.A[t]=t;if(e){let t,e,r,s=this.B;for(let i=0;i<o;++i)t=s[l],e=s[l+1],r=s[l+2],s[l]=e,s[l+1]=r,s[l+2]=t,l+=3}}}}e.default=n},"1eb2":function(t,e,r){"use strict";if("undefined"!==typeof window){var s=window.document.currentScript,i=r("8875");s=i(),"currentScript"in document||Object.defineProperty(document,"currentScript",{get:i});var n=s&&s.src.match(/(.+\/)[^/]+\.js(\?.*)?$/);n&&(r.p=n[1])}},"4b10":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});class s{constructor(){this.F=!1,this.G=!1,this.H=!0,this.I=1,this.J=0,this.K=null,this.L=0,this.M=null,this.N=0,this.C=null,this.O=0,this.P=null,this.Q=0,this.R=null,this.S=null,this.T=null,this.U=null,this.V=null,this.baseVertexIndex=0,this.baseNormalIndex=0,this.baseUvIndex=0,this.idns="obj",this.W=!0,this.X=null}parseStrData(t,e,r=!1,i=!1){void 0==e&&(e=1),void 0==r&&(r=!1),void 0==i&&(i=!1),this.F=r,this.G=i,this.V=[],this.R=[],this.S=[],this.T=[],this.U=[],this.I=e,this.K=[],this.M=[],this.C=[];let n=t.split(s.LINE_FEED),a=n.length;for(let s=0;s<a;++s)this.parseLine(n[s]);this.Q=this.S.length/3}getVtxTotal(){return this.Q}parseLine(t){let e=t.split(s.SPACE),r=null;if(!(e.length>0))return;r=e.slice(1);let i=e[0];switch(i){case s.VERTEX:this.parseVertex(r);break;case s.NORMAL:this.parseNormal(r);break;case s.UV:this.parseUV(r);break;case s.INDEX_DATA:this.parseIndex(r);break}}parseVertex(t){if(""!=t[0]&&" "!=t[0]||(t=t.slice(1)),this.F)this.K.push(Number(t[1])*this.I),this.K.push(Number(t[2])*this.I),this.K.push(Number(t[0])*this.I);else{let e=t.length;e>3&&(e=3);for(let r=0;r<e;++r)this.K.push(Number(t[r])*this.I)}this.L=this.K.length}getVS(){return this.S}getCVS(){if(null!=this.X)return this.X;this.X=[];let t=0,e=this.S.length/3;for(;t<e;t++)this.X.push(1,1,1,1);return this.X}parseNormal(t){""!=t[0]&&" "!=t[0]||(t=t.slice(1));let e=t.length;e>3&&(e=3);for(let r=0;r<e;++r){let e=t[r];null!=e&&this.M.push(Number(e))}this.N=this.M.length}getNVS(){return this.U}parseUV(t){""!=t[0]&&" "!=t[0]||(t=t.slice(1));let e=t.length;e>2&&(e=2);for(let r=0;r<e;++r){let e=t[r];this.C.push(Number(e))}this.O=this.C.length}getUVS(){return this.T}parseIndex(t){let e="",r=null,i=0,n=0,a=0,o=0,h=0,l=t.length,u=0;while(""==t[u]||" "==t[u])u++;for(l=u+3,h=u;h<l;++h)e=t[h],""!=e&&(r=e.split(s.SLASH),i=parseInt(r[0])-1-this.baseVertexIndex,n=parseInt(r[1])-1-this.baseUvIndex,a=parseInt(r[2])-1-this.baseNormalIndex,i<0&&(i=0),n<0&&(n=0),a<0&&(a=0),o=3*i,this.S.push(this.K[o],this.K[o+1],this.K[o+2]),this.H?this.V.push(Math.random(),Math.random(),Math.random(),1):this.V.push(1,1,1,1),this.M.length&&(o=3*a,this.U.push(this.M[o],this.M[o+1],this.M[o+2])),o=2*n,this.G?this.T.push(1-this.C[o],1-this.C[o+1]):this.T.push(this.C[o],this.C[o+1]));this.R.push(this.J,this.J+1,this.J+2),this.J+=3}getIVS(){return this.R}getTriTotal(){return this.R.length/3}restoreNormals(){this.U=this.P.concat()}}s.LINE_FEED=String.fromCharCode(10),s.SPACE=String.fromCharCode(32),s.SLASH="/",s.VERTEX="v",s.NORMAL="vn",s.UV="vt",s.INDEX_DATA="f",e.ObjStrDataParser=s;class i{constructor(){this.Y=[]}parseStrData(t,e=1,r=!1,i=!1){let n=t.split("# object"),a=1,o=null;for(;a<n.length;++a)o=new s,o.parseStrData("# object"+n[a],e,r,i),this.Y.push(o)}getParserTotal(){return this.Y.length}getParserAt(t){return this.Y[t]}}e.ObjsStrDataParser=i},6120:function(t,e,r){"use strict";var s=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(e,"__esModule",{value:!0});const i=s(r("098c"));class n{constructor(){this.moduleScale=1,this.baseParsering=!1}load(t,e,r=!1){let s=new XMLHttpRequest;s.open("GET",t,!0),s.onload=()=>{if(s.status<=206&&s.responseText.indexOf(" OBJ ")>0){let t=new i.default;t.moduleScale=this.moduleScale,t.baseParsering=this.baseParsering,t.parse(s.responseText,r),e(t)}},s.onerror=t=>{},s.send(null)}createParser(){return new i.default}}e.Instance=n},8875:function(t,e,r){var s,i,n;(function(r,a){i=[],s=a,n="function"===typeof s?s.apply(e,i):s,void 0===n||(t.exports=n)})("undefined"!==typeof self&&self,(function(){function t(){var e=Object.getOwnPropertyDescriptor(document,"currentScript");if(!e&&"currentScript"in document&&document.currentScript)return document.currentScript;if(e&&e.get!==t&&document.currentScript)return document.currentScript;try{throw new Error}catch(p){var r,s,i,n=/.*at [^(]*\((.*):(.+):(.+)\)$/gi,a=/@([^@]*):(\d+):(\d+)\s*$/gi,o=n.exec(p.stack)||a.exec(p.stack),h=o&&o[1]||!1,l=o&&o[2]||!1,u=document.location.href.replace(document.location.hash,""),c=document.getElementsByTagName("script");h===u&&(r=document.documentElement.outerHTML,s=new RegExp("(?:[^\\n]+?\\n){0,"+(l-2)+"}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*","i"),i=r.replace(s,"$1").trim());for(var m=0;m<c.length;m++){if("interactive"===c[m].readyState)return c[m];if(c[m].src===h)return c[m];if(h===u&&c[m].innerHTML&&c[m].innerHTML.trim()===i)return c[m]}return null}}return t}))},eec2:function(t,e,r){"use strict";function s(){var t=/^[og]\s*(.+)?/,e=/^mtllib /,r=/^usemtl /,s=/^usemap /;function i(){var t={objects:[],object:{},vertices:[],normals:[],colors:[],uvs:[],materials:{},materialLibraries:[],startObject:function(t,e){if(this.object&&!1===this.object.fromDeclaration)return this.object.name=t,void(this.object.fromDeclaration=!1!==e);var r=this.object&&"function"===typeof this.object.currentMaterial?this.object.currentMaterial():void 0;if(this.object&&"function"===typeof this.object._finalize&&this.object._finalize(!0),this.object={name:t||"",fromDeclaration:!1!==e,geometry:{vertices:[],normals:[],colors:[],uvs:[]},materials:[],smooth:!0,startMaterial:function(t,e){var r=this._finalize(!1);r&&(r.inherited||r.groupCount<=0)&&this.materials.splice(r.index,1);var s={index:this.materials.length,name:t||"",mtllib:Array.isArray(e)&&e.length>0?e[e.length-1]:"",smooth:void 0!==r?r.smooth:this.smooth,groupStart:void 0!==r?r.groupEnd:0,groupEnd:-1,groupCount:-1,inherited:!1,clone:function(t){var e={index:"number"===typeof t?t:this.index,name:this.name,mtllib:this.mtllib,smooth:this.smooth,groupStart:0,groupEnd:-1,groupCount:-1,inherited:!1};return e.clone=this.clone.bind(e),e}};return this.materials.push(s),s},currentMaterial:function(){if(this.materials.length>0)return this.materials[this.materials.length-1]},_finalize:function(t){var e=this.currentMaterial();if(e&&-1===e.groupEnd&&(e.groupEnd=this.geometry.vertices.length/3,e.groupCount=e.groupEnd-e.groupStart,e.inherited=!1),t&&this.materials.length>1)for(var r=this.materials.length-1;r>=0;r--)this.materials[r].groupCount<=0&&this.materials.splice(r,1);return t&&0===this.materials.length&&this.materials.push({name:"",smooth:this.smooth}),e}},r&&r.name&&"function"===typeof r.clone){var s=r.clone(0);s.inherited=!0,this.object.materials.push(s)}this.objects.push(this.object)},finalize:function(){this.object&&"function"===typeof this.object._finalize&&this.object._finalize(!0)},parseVertexIndex:function(t,e){var r=parseInt(t,10);return 3*(r>=0?r-1:r+e/3)},parseNormalIndex:function(t,e){var r=parseInt(t,10);return 3*(r>=0?r-1:r+e/3)},parseUVIndex:function(t,e){var r=parseInt(t,10);return 2*(r>=0?r-1:r+e/2)},addVertex:function(t,e,r){var s=this.vertices,i=this.object.geometry.vertices;i.push(s[t+0],s[t+1],s[t+2]),i.push(s[e+0],s[e+1],s[e+2]),i.push(s[r+0],s[r+1],s[r+2])},addVertexPoint:function(t){var e=this.vertices,r=this.object.geometry.vertices;r.push(e[t+0],e[t+1],e[t+2])},addVertexLine:function(t){var e=this.vertices,r=this.object.geometry.vertices;r.push(e[t+0],e[t+1],e[t+2])},addNormal:function(t,e,r){var s=this.normals,i=this.object.geometry.normals;i.push(s[t+0],s[t+1],s[t+2]),i.push(s[e+0],s[e+1],s[e+2]),i.push(s[r+0],s[r+1],s[r+2])},addColor:function(t,e,r){var s=this.colors,i=this.object.geometry.colors;i.push(s[t+0],s[t+1],s[t+2]),i.push(s[e+0],s[e+1],s[e+2]),i.push(s[r+0],s[r+1],s[r+2])},addUV:function(t,e,r){var s=this.uvs,i=this.object.geometry.uvs;i.push(s[t+0],s[t+1]),i.push(s[e+0],s[e+1]),i.push(s[r+0],s[r+1])},addUVLine:function(t){var e=this.uvs,r=this.object.geometry.uvs;r.push(e[t+0],e[t+1])},addFace:function(t,e,r,s,i,n,a,o,h){var l=this.vertices.length,u=this.parseVertexIndex(t,l),c=this.parseVertexIndex(e,l),m=this.parseVertexIndex(r,l);if(this.addVertex(u,c,m),this.colors.length>0&&this.addColor(u,c,m),void 0!==s&&""!==s){var p=this.uvs.length;u=this.parseUVIndex(s,p),c=this.parseUVIndex(i,p),m=this.parseUVIndex(n,p),this.addUV(u,c,m)}if(void 0!==a&&""!==a){var f=this.normals.length;u=this.parseNormalIndex(a,f),c=a===o?u:this.parseNormalIndex(o,f),m=a===h?u:this.parseNormalIndex(h,f),this.addNormal(u,c,m)}},addPointGeometry:function(t){this.object.geometry.type="Points";for(var e=this.vertices.length,r=0,s=t.length;r<s;r++)this.addVertexPoint(this.parseVertexIndex(t[r],e))},addLineGeometry:function(t,e){this.object.geometry.type="Line";for(var r=this.vertices.length,s=this.uvs.length,i=0,n=t.length;i<n;i++)this.addVertexLine(this.parseVertexIndex(t[i],r));var a=0;for(n=e.length;a<n;a++)this.addUVLine(this.parseUVIndex(e[a],s))}};return t.startObject("",!1),t}this.Parse=function(n){var a=new i;-1!==n.indexOf("\r\n")&&(n=n.replace(/\r\n/g,"\n")),-1!==n.indexOf("\\\n")&&(n=n.replace(/\\\n/g,""));for(var o=n.split("\n"),h="",l="",u=0,c=[],m="function"===typeof"".trimLeft,p=0,f=o.length;p<f;p++)if(h=o[p],h=m?h.trimLeft():h.trim(),u=h.length,0!==u&&(l=h.charAt(0),"#"!==l))if("v"===l){var d=h.split(/\s+/);switch(d[0]){case"v":a.vertices.push(parseFloat(d[1]),parseFloat(d[2]),parseFloat(d[3])),d.length>=7&&a.colors.push(parseFloat(d[4]),parseFloat(d[5]),parseFloat(d[6]));break;case"vn":a.normals.push(parseFloat(d[1]),parseFloat(d[2]),parseFloat(d[3]));break;case"vt":a.uvs.push(parseFloat(d[1]),parseFloat(d[2]));break}}else if("f"===l){for(var v=h.substr(1).trim(),_=v.split(/\s+/),g=[],b=0,x=_.length;b<x;b++){var S=_[b];if(S.length>0){var y=S.split("/");g.push(y)}}var V=g[0];for(b=1,x=g.length-1;b<x;b++){var j=g[b],w=g[b+1];a.addFace(V[0],j[0],w[0],V[1],j[1],w[1],V[2],j[2],w[2])}}else if("l"===l){var I=h.substring(1).trim().split(" "),P=[],D=[];if(-1===h.indexOf("/"))P=I;else for(var N=0,L=I.length;N<L;N++){var O=I[N].split("/");""!==O[0]&&P.push(O[0]),""!==O[1]&&D.push(O[1])}a.addLineGeometry(P,D)}else if("p"===l){v=h.substr(1).trim();var A=v.split(" ");a.addPointGeometry(A)}else if(null!==(c=t.exec(h))){var U=(" "+c[0].substr(1).trim()).substr(1);a.startObject(U)}else if(r.test(h))a.object.startMaterial(h.substring(7).trim(),a.materialLibraries);else if(e.test(h))a.materialLibraries.push(h.substring(7).trim());else if(s.test(h));else if("s"===l){if(c=h.split(" "),c.length>1){var E=c[1].trim().toLowerCase();a.object.smooth="0"!==E&&"off"!==E}else a.object.smooth=!0;var M=a.object.currentMaterial();M&&(M.smooth=a.object.smooth)}else if("\0"===h)continue;return a.finalize(),a.objects}}r.r(e),r.d(e,"ObjDataParser",(function(){return s}))},fae3:function(t,e,r){"use strict";r.r(e);r("1eb2");var s=r("6120");for(var i in s)["default"].indexOf(i)<0&&function(t){r.d(e,t,(function(){return s[t]}))}(i)}})}));
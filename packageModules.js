// npm install node-cmd -g
// npm install node-cmd
// https://www.npmjs.com/package/node-cmd

// 用法: node packageModules.js all
// 或
// 用法: node packageModules.js

const cmd = require("node-cmd");

console.log("\n");
console.log("####### package all tasks operating begin !!!!");

var arguments = process.argv;
var params = [];
arguments.forEach((val, index) => {
	console.log(`${index}: ${val}`);
	params.push(val + "");
});
// console.log("params: ", params);


function packageAModule(moduleName) {

	console.log("\n*** " + moduleName + " package begin ...");
	const task = cmd.runSync("yarn build:" + moduleName,
		(err, data, stderr) => {
			console.log(moduleName + ' err:', err);
			console.log(moduleName + ' data:', data);
			console.log(moduleName + ' stderr:', stderr);
		});
	console.log("*** " + moduleName + " package info:");
	let infoStr = task.data + "";
	let list = infoStr.split("+");
	for (let i = 0; i < list.length; ++i) {
		console.log(list[i]);
	}
	console.log("*** " + moduleName + " package end ...");
}

let isAll = false;
if(params && params.length > 2) {
	let keyStr = params[2] + "";
	isAll = keyStr === "all";
}

console.log("package all modules: ", isAll);

let engineModules = ["coRenderer", "coRScene", "coSimpleRScene", "coUIInteraction"];
if(!isAll) {
	engineModules = ["coRenderer", "coRScene"];
}
function packageEngineCore() {
	for (let i = 0; i < engineModules.length; ++i) {
		packageAModule(engineModules[i]);
	}
}

let cospaceAppModules = ["ctmParser", "objParser", "fbxFastParser", "dracoParser","dracoEncoder","pNGParser","threadCore","coSpaceApp"];
if(!isAll) {
	cospaceAppModules = ["coSpaceApp"];
}

function packageCoSpaceApp() {
	for (let i = 0; i < cospaceAppModules.length; ++i) {
		packageAModule(cospaceAppModules[i]);
	}
}

let cospaceModules = ["coMath", "coAGeom", "coMaterial", "coText","coMesh","coTexture","coEntity","coEdit","coParticle"];
if(!isAll) {
	cospaceModules = ["coMesh","coMaterial","coEntity"];
}
function packageCoSpace() {
	for (let i = 0; i < cospaceModules.length; ++i) {
		packageAModule(cospaceModules[i]);
	}
}

let effectModules = ["pbrEffect", "coLightModule", "coEnvLightModule", "vsmShadowModule","occPostOutlineModule"];
if(!isAll) {
	effectModules = ["occPostOutlineModule"];
}
function packageEffect() {
	for (let i = 0; i < effectModules.length; ++i) {
		packageAModule(effectModules[i]);
	}
}

packageEngineCore();
packageCoSpaceApp();
packageCoSpace();
packageEffect();

console.log("\n");
console.log("######## ####### ####### ####### ####### ########");
console.log("####### package all tasks operating finished !!!!");
console.log("######## ####### ####### ####### ####### ########");
console.log("\n");

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

declare var importScripts: (js_file_url: string) => void;

import { SubThreadModule } from "./SubThreadModule";


let scriptDir: string = "";
let ENV_IS_WORKER = typeof importScripts === "function";
if (ENV_IS_WORKER) {
  scriptDir = self.location.href;
  var importJSScripts = importScripts;
}else if(typeof document !== 'undefined'){
    scriptDir = document.location.href;
    var importJSScripts = (js_file_url: string): void => {
        console.log("importJSScripts(), js_file_url: ",js_file_url);
    }
}
function importJSModuleCode(codeUrl: string, srcUrl: string): void {
	try {
		importJSScripts(codeUrl);
	}catch(e) {
		console.error("importJSScripts() error, url: ", srcUrl);
	}
}
let baseUrl = scriptDir.slice(0, scriptDir.lastIndexOf("/") + 1);
let k = baseUrl.indexOf("http://");
if (k < 0) k = baseUrl.indexOf("https://");
if (k < 0) k = 0;
baseUrl = baseUrl.slice(k);

function getJSFileUrl(url: string) {
    if(url == "") {
        throw Error("js file url is empty !!!");
    }
    let k = url.indexOf("://");
    if (k > 0)
		return url;
    return baseUrl + url;
}



class DependencyNode {
    uniqueName: string;
    index: number;
    path: string;
    /**
     * 包含当前代码块所有依赖的序号
     */
    includes: number[] = null;
    constructor(uniqueName: string, index: number, path: string){
        this.uniqueName = uniqueName;
        this.index = index;
        this.path = path;
    }
}
class GraphData {

    // 此数据由外部传入的json数据生成
    private m_nodes: DependencyNode[] = [];
    private m_map: Map<string, DependencyNode> = new Map();

    constructor() {
    }

    initFromJsonString(jsonString: string): void {

        if(jsonString != undefined && jsonString != "") {

            let obj = JSON.parse(jsonString);
            console.log("GraphData(::initFromJsonString(), obj: ",obj);

            this.m_nodes = [];
            let node: DependencyNode;

            for(let i: number = 0; i < obj.nodes.length; ++i) {

                const dp = obj.nodes[i];
                node = new DependencyNode(dp.uniqueName, i, dp.path);
                this.m_nodes.push( node );
                this.m_map.set(dp.uniqueName, node);
            }

            let maps = obj.maps;
            for(let i: number = 0; i < maps.length; ++i) {
                const item = maps[i];
                node = this.m_map.get(item.uniqueName);
                node.includes = item.includes.slice(0);
            }
        }
    }
    getNodeUniqueName(dns: string): DependencyNode{
        return this.m_map.get(dns);
    }
    getNodeAt(i: number): DependencyNode{
        if(i >= 0 && i < this.m_nodes.length) return this.m_nodes[i];
    }
    /**
     * 通过依赖的唯一名称获取相对 path
     * @param dns 依赖的唯一名称
     * @returns 对应唯一依赖名称的相对 path
     */
    getPathByUniqueName(dns: string): string{
        if(this.m_map.has(dns)) {
            let dp = this.m_map.get(dns);
            return dp.path;
        }
        return "";
    }
}

let graphData: GraphData = new GraphData();
let registerMap: Map<number, number> = new Map();
let dpstMap: Map<string, number> = new Map();
let dpnsWaitList: SubThreadModule[] = [];

function testDependencyByIns( tm: SubThreadModule ): boolean {

    let node = graphData.getNodeUniqueName( tm.getUniqueName());
    if(node != null && node.includes != null) {
        let list = node.includes;
        let len = list.length;
        let i = 0;
        for(; i < len; ++i) {
            const t = graphData.getNodeAt(list[i]);
            if(!registerMap.has(t.index)) {
                break;
            }
        }
        return i >= len;
    }
    return true;
}

let timeoutId: any = -1;
function ddcUpdate(): void {

    if (timeoutId > -1) {
        clearTimeout(timeoutId);
    }
    // console.log("ddcUpdate(), A dpnsWaitList.length: ",dpnsWaitList.length);
    if(dpnsWaitList.length > 0) {
        let list = dpnsWaitList;
        let i = 0;
        let len = list.length;
        let tm = null;
        for(; i < len; ++i) {
            tm = list[i];
            if(testDependencyByIns( tm )) {
                list.splice(i, 1);
                i--;
                len--;
                dpstMap.delete(tm.getUniqueName());
                tm.dependencyFinish();
            }
        }
        // console.log("ddcUpdate(), B dpnsWaitList.length: ",dpnsWaitList.length);
        if(list.length > 0) {
            timeoutId = setTimeout(ddcUpdate, 105); // 10 fps
        }
    }
}

class DependenceGraph {

    private m_programMap: Map<string, number> = new Map();
    readonly graphData: GraphData = graphData;
    constructor() {
    }

    useDependency( tm: SubThreadModule ): void {

        if(testDependencyByIns(tm)) {
            if( dpstMap.has( tm.getUniqueName() ) ) {
                for(let i = 0; i < dpnsWaitList.length; ++i) {
                    if(tm == dpnsWaitList[i]) {
                        dpnsWaitList.splice(i, 1);
                        break;
                    }
                }
                dpstMap.delete(tm.getUniqueName());
                console.log("useDependency(), remove tm in dpstMap.");
            }
            console.log("useDependency(), get it.");
            tm.dependencyFinish();
        }else if( !dpstMap.has( tm.getUniqueName() ) ) {
            // 用 uniqueName 而不用taskClass是因为有些模块并不一定有有效的taskClass 但是它依旧会去获取自身的依赖
            // 而且有些模块代码并不是由我们自身构建的，而是源自于其他第三方

            console.log("useDependency(), can not find it, ready load it.");
            // 尝试加载，不过这里有可能正在加载中
            let node = graphData.getNodeUniqueName( tm.getUniqueName());
            if(node != null && node.includes != null) {
                dpstMap.set(tm.getUniqueName(), 1);
                let list = node.includes;
                let len = list.length;
                let i = 0;
                let flag: boolean = false;
                for(; i < len; ++i) {
                    const t = graphData.getNodeAt(list[i]);
                    // 判断是否已经存在
                    if(!registerMap.has(t.index)) {
                        // 如果不存在则加载
                        flag = true;
                        this.loadProgramByDependency( t.uniqueName );
                    }
                }
                if(flag) {
                    // 不要更改这里的代码顺序
                    let total: number = dpnsWaitList.length;
                    dpnsWaitList.push(tm);
                    // 防止额外的重复调用
                    if(total < 1) {
                        ddcUpdate();
                    }
                }
            }
        }
    }
    /**
     * 直接通过唯一标识名来注册
     * @param uniqueName 模块的唯一标识名
     */
    registerDependency(uniqueNames: string[]): void {

        if(uniqueNames != null) {
            console.log("registerDependency(), uniqueNames: ", uniqueNames);
            for(let i: number = 0; i < uniqueNames.length; ++i) {
                const node = graphData.getNodeUniqueName(uniqueNames[i]);
                registerMap.set(node.index, 1);
            }
        }
    }
    loadProgramByDependency( denpendency: string ): void {
        if(denpendency != "") {
            this.loadProgramByModuleUrl( graphData.getPathByUniqueName(denpendency) );
        }
    }
    private loadProgram(programUrl: string): void {
        if (programUrl != "") {
            if(!this.m_programMap.has(programUrl)) {
                this.m_programMap.set(programUrl, 1);
                // importJSScripts(programUrl);
                // let bolb: Blob = baseCodeStr == "" ? new Blob([request.responseText]) : new Blob([baseCodeStr + request.responseText]);
                // URL.createObjectURL(blob)
                let request: XMLHttpRequest = new XMLHttpRequest();
                request.open('GET', programUrl, true);
                console.log("programUrl: ",programUrl);
                request.onload = () => {
                    if (request.status <= 206) {
                        console.log("load js model file");
                        // eval(request.responseText);
                        let blob = new Blob([request.responseText]);
                        importJSModuleCode(URL.createObjectURL(blob), programUrl);
                    }
                    else {
                        console.error("load thread js module error, url: ", programUrl);
                    }
                };
                request.onerror = e => {
                    console.error("load thread js module error, url: ", programUrl);
                };
                request.send(null);
            }
        }
    }
    loadProgramByModuleUrl(moduleUrl: string): void {
        moduleUrl = getJSFileUrl(moduleUrl);
        this.loadProgram(moduleUrl);
    }
    destroy(): void {
    }
}

export { DependenceGraph };

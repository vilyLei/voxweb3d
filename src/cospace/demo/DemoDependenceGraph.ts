import { SubThreadModule } from "../modules/thread/control/SubThreadModule";
import { DependenceGraph } from "../modules/thread/control/DependenceGraph";


class DracoWasmModule implements SubThreadModule {
	dependencyFinish(): void {
		console.log("DracoWasmModule::dependencyFinish().");
	}
	// getDependencies(): string[] {
	//   return null;
	// }
	getTaskClass(): number {
		return 102;
	}
	getUniqueName(): string {
		return "dracoWasmWrapper";
	}
}
class DracoParserModule implements SubThreadModule {
	dependencyFinish(): void {
		console.log("DracoParserModule::dependencyFinish().");
	}
	// getDependencies(): string[] {
	//   return ["dracoWasmWrapper"];
	// }
	getTaskClass(): number {
		return 102;
	}
	getUniqueName(): string {
		return "dracoGeomParser";
	}
}
/**
 * dependence graph
 */
export class DemoDependenceGraph {
	private m_dpGraph: DependenceGraph;
	constructor() { }

	initialize(): void {
		console.log("DemoDependenceGraph::initialize()...");

		let obj: object = {
			nodes:
				[
					{ uniqueName: "dracoGeomParser", path: "cospace/modules/draco/ModuleDracoGeomParser.umd.min.js" },
					{ uniqueName: "dracoWasmWrapper", path: "cospace/modules/dracoLib/w2.js" },
					{ uniqueName: "ctmGeomParser", path: "cospace/modules/ctm/ModuleCTMGeomParser.umd.min.js" }
				],
			maps:
				[
					{ uniqueName: "dracoGeomParser", includes: [1] }
				]
		};

		let jsonStr: string = JSON.stringify(obj);

		this.m_dpGraph = new DependenceGraph();
		this.m_dpGraph.graphData.initFromJsonString(jsonStr);

		let tm = new DracoParserModule();
		let wasmTM = new DracoWasmModule();
		console.log("---------------------------------------- begin");
		this.m_dpGraph.useDependency(tm);
		this.m_dpGraph.registerDependency([wasmTM.getUniqueName()]);
		this.m_dpGraph.useDependency(tm);
		console.log("---------------------------------------- end");

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};
		this.update();
	}

	private mouseDown(evt: any): void { }

	private m_timeoutId: any = -1;
	/**
	 * 定时调度
	 */
	private update(): void {
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 50); // 20 fps
	}
	run(): void { }
}
export { DependenceGraph }
export default DemoDependenceGraph;

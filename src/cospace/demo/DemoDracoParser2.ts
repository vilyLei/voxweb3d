import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoGeomBuilder } from "../modules/draco/DracoGeomBuilder";
import { GeometryModelDataType } from "../modules/draco/DracoDataType";

/**
 * draco 加载解析多线程示例展示创建多个draco加载解析器实例
 */
export class DemoDracoParser2 {
  constructor() {}
  
  private m_threadSchedule: ThreadSchedule = new ThreadSchedule();

  initialize(): void {
    console.log("DemoDracoParser2::initialize()...");

    let dependencyGraphObj: object = {
      nodes:
          [
              {uniqueName: "dracoGeomParser",  path: "cospace/modules/draco/ModuleDracoGeomParser.umd.min.js"},
              {uniqueName: "dracoWasmWrapper", path: "cospace/modules/dracoLib/w2.js"},
              {uniqueName: "ctmGeomParser", path: "cospace/modules/ctm/ModuleCTMGeomParser.umd.min.js"}
          ],
      maps:
          [
              {uniqueName: "dracoGeomParser", includes:[1]} // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
          ]
    };
    let jsonStr: string = JSON.stringify(dependencyGraphObj);
    this.m_threadSchedule.setDependencyGraphJsonString( jsonStr );
    // 初始化多线程调度器
    this.m_threadSchedule.initialize(3, "cospace/core/code/ThreadCore.umd.min.js");

    document.onmousedown = (evt: any): void => {
      this.mouseDown(evt);
    };
    this.update();
    //console.log("getBaseUrl(): ", this.getBaseUrl());
    this.test01();
    this.test02();
  }
  
  private test01(): void {    
    // draco 模型数据url
    let url = "static/assets/draco/clothRoll.rawmd";
    // draco模型数据字节分段信息
    let segRangeList: number[] = [950486,1900738,0,950486,1900738,1907181,1907181,1912537,1912537,1920151,1920151,1924126];

    this.build(url, segRangeList);
  }
  private test02(): void {
    
    // draco 模型数据url
    let url = "static/assets/draco/curtain.rawmd";
    // draco模型数据字节分段信息
    let segRangeList: number[] = [0,112515,112515,236485,236485,238437,238437,248046,248046,259869,259869,270012];

    this.build(url, segRangeList);
  }
  private build(url: string, segRangeList: number[]): void {

    // 建立 draco 模型数据builder(包含加载和解析)
    let dracoGeomBuilder = new DracoGeomBuilder("cospace/modules/draco/ModuleDracoGeomParser.umd.min.js");

    // draco 模型数据url
    //let url = "static/assets/draco/clothRoll.rawmd";
    dracoGeomBuilder.initialize( this.m_threadSchedule );
    dracoGeomBuilder.setListener( this );
    
    // draco模型数据字节分段信息
    //let segRangeList: number[] = [950486, 1900738, 0, 950486, 1900738, 1907181, 1907181, 1912537, 1912537, 1920151, 1920151, 1924126];
    dracoGeomBuilder.load(url, segRangeList);
  }

  // 单个draco segment 几何数据解析结束之后的回调
  dracoParse(model: GeometryModelDataType, index: number, total: number): void {
  }
  // 所有 draco segment 几何数据解析结束之后的回调，表示本次加载解析任务结束
  dracoParseFinish(models: GeometryModelDataType[], total: number): void {
    console.log("dracoParseFinish models: ", models);
  }
  private mouseDown(evt: any): void {    
    
  }

  
  private m_timeoutId: any = -1;
  /**
   * 定时调度
   */
  private update(): void {

    this.m_threadSchedule.run();
    if (this.m_timeoutId > -1) {
      clearTimeout(this.m_timeoutId);
    }
    this.m_timeoutId = setTimeout(this.update.bind(this), 50); // 20 fps
  }
  run(): void {}
}

export default DemoDracoParser2;

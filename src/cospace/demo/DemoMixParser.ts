import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { DracoGeomBuilder } from "../modules/draco/DracoGeomBuilder";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
/**
 * draco 与 CTM 加载 解析多线程示例
 */
export class DemoMixParser {

  private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
  private m_ctmParseTask: CTMParseTask;
  private m_dracoGeomBuilder: DracoGeomBuilder;

  constructor() {}

  initialize(): void {
    console.log("DemoMixParser::initialize()...");

    let dependencyGraphObj: object = {
      nodes:
          [
              {uniqueName: "dracoGeomParser",  path: "static/cospace/modules/draco/ModuleDracoGeomParser.umd.min.js"},
              {uniqueName: "dracoWasmWrapper", path: "static/cospace/modules/dracoLib/w2.js"},
              {uniqueName: "ctmGeomParser", path: "static/cospace/modules/ctm/ModuleCTMGeomParser.umd.min.js"}
          ],
      maps:
          [
              {uniqueName: "dracoGeomParser", includes:[1]} // 这里[1]表示 dracoGeomParser 依赖数组中的第一个元素也就是 dracoWasmWrapper 这个代码模块
          ]
    }

    let jsonStr: string = JSON.stringify( dependencyGraphObj );
    this.m_threadSchedule.setDependencyGraphJsonString( jsonStr );
    this.m_threadSchedule.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js");

    this.update();
    document.onmousedown = (evt: any): void => {
      this.mouseDown(evt);
    };
    //console.log("getBaseUrl(): ", this.getBaseUrl());

    this.initCtm();
    this.initDraco();
  }

  private initCtm(): void {
    this.m_ctmParseTask = new CTMParseTask("static/cospace/modules/ctm/ModuleCTMGeomParser.umd.js");
    this.m_threadSchedule.bindTask(this.m_ctmParseTask);
    this.m_ctmParseTask.setListener(this);
  }
  private initDraco(): void {
    this.m_dracoGeomBuilder = new DracoGeomBuilder("static/cospace/modules/draco/ModuleDracoGeomParser.umd.js");
    // draco 模型数据url
    let url = "static/assets/modules/clothRoll.rawmd";
    this.m_dracoGeomBuilder.initialize(this.m_threadSchedule);
    this.m_dracoGeomBuilder.setListener(this);
    // draco模型数据字节分段信息
    let segRangeList: number[] = [
      950486,
      1900738,
      0,
      950486,
      1900738,
      1907181,
      1907181,
      1912537,
      1912537,
      1920151,
      1920151,
      1924126,
    ];
    this.m_dracoGeomBuilder.load(url, segRangeList);
  }
  // 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
  ctmParseFinish(model: GeometryModelDataType, url: string): void {
    console.log( "DemoMixParser::ctmParseFinish(), model: ",model,", url: ", url );
  }
  dracoParse(model: GeometryModelDataType, index: number, total: number): void {}
  dracoParseFinish(models: GeometryModelDataType[], total: number): void {
    console.log("dracoParseFinish models: ", models);
  }
  private mouseDown(evt: any): void {
    let ctmUrl: string = "static/assets/ctm/hand.ctm";
    // 通过url,发送一份加载和解析资源的任务数据给多线程数据处理系统，一份数据一个子线程处理一次
    this.m_ctmParseTask.addURL(window.location.href + ctmUrl);
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

export default DemoMixParser;
import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import BinaryLoader from "../../vox/assets/BinaryLoader";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
/**
 * 通过加载到的CTM模型二进制数据，发送CTM资源解析任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoCTMParser {
  private m_threadSchedule: ThreadSchedule;
  private m_ctmParseTask: CTMParseTask;

  constructor() {}

  initialize(): void {

    console.log("DemoCTMParser::initialize()...");

    // 创建多线程调度器(多线程系统)
    let schedule = new ThreadSchedule();
    // 初始化多线程调度器
    schedule.initialize( 2, "cospace/core/code/ThreadCore.umd.min.js" );

    // 创建 ctm 加载解析任务
    let ctmParseTask = new CTMParseTask( "cospace/modules/ctm/ModuleCTMGeomParser.umd.min.js" );
    // 绑定当前任务到多线程调度器
    schedule.bindTask( ctmParseTask );

    // 设置一个任务完成的侦听器
    ctmParseTask.setListener(this);

    this.m_threadSchedule = schedule;
    this.m_ctmParseTask = ctmParseTask;
    
    // 启动循环调度
    this.update();
    document.onmousedown = (evt: any): void => {
      this.mouseDown(evt);
    };
    //console.log("getBaseUrl(): ", this.getBaseUrl());
  }

  // 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
  ctmParseFinish(model: GeometryModelDataType, url: string): void {

    console.log( "DemoCTMParser::ctmParseFinish(), model: ",model,", url: ",url );
  }

  private setBinaryDataToTask(ctmDataBuffer: ArrayBuffer, url: string): void {
    let data = new Uint8Array(ctmDataBuffer);
    // 发送一份任务处理数据，一份数据一个子线程处理一次
    this.m_ctmParseTask.addBinaryData(data, url);
  }
  private mouseDown(evt: any): void {
    let ctmUrl: string = "static/assets/ctm/hand.ctm";
    this.initCTMFromBin(ctmUrl);
  }

  private initCTMFromBin(ctmUrl: string): void {
    let ctmLoader: BinaryLoader = new BinaryLoader();
    ctmLoader.uuid = ctmUrl;
    ctmLoader.load(ctmUrl, this);
  }

  loaded(buffer: ArrayBuffer, uuid: string): void {
    this.setBinaryDataToTask(buffer, uuid);
  }
  loadError(status: number, uuid: string): void {}

  private m_timeoutId: any = -1;
  /**
   * 定时调度
   */
  private update(): void {
    this.m_threadSchedule.run();
    if (this.m_timeoutId > -1) {
      clearTimeout(this.m_timeoutId);
    }
    this.m_timeoutId = setTimeout(this.update.bind(this), 40); // 25 fps
  }
  run(): void {}
}

export default DemoCTMParser;

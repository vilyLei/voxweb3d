import { ThreadSchedule } from "../modules/thread/ThreadSchedule";
import { CTMParseTask } from "../modules/ctm/CTMParseTask";
import { GeometryModelDataType } from "../modules/base/GeometryModelDataType";
/**
 * 通过url,发送加载和解析CTM资源的任务给多线程数据处理系统，获取解析之后的CTM模型数据
 */
export class DemoCTMLoadAndParser {
  
  private m_threadSchedule: ThreadSchedule = new ThreadSchedule();
  private m_ctmParseTask: CTMParseTask;
  constructor() {}

  initialize(): void {
    console.log("DemoCTMLoadAndParser::initialize()...");

    // 初始化多线程调度器
    this.m_threadSchedule.initialize(3, "cospace/core/code/ThreadCore.umd.min.js");
    // 创建ctm 加载解析任务
    this.m_ctmParseTask = new CTMParseTask(
      "cospace/modules/ctm/ModuleCTMGeomParser.umd.js"
    );
    // 绑定当前任务到多线程调度器
    this.m_threadSchedule.bindTask(this.m_ctmParseTask);
    // 设置一个任务完成的侦听器
    this.m_ctmParseTask.setListener(this);

    // 启动循环调度
    this.update();
    // 启用鼠标点击事件
    document.onmousedown = (evt: any): void => {
      this.mouseDown(evt);
    };
  }
  // 一份任务数据处理完成后由此侦听器回调函数接收到处理结果
  ctmParseFinish(model: GeometryModelDataType, url: string): void {

    console.log("DemoCTMLoadAndParser::ctmParseFinish(), model: ",model,", url: ",url);

  }
  private mouseDown(evt: any): void {

    let ctmParseTask = this.m_ctmParseTask;


    let ctmUrl: string = "static/assets/ctm/hand.ctm";
    // 通过url,发送一份加载和解析资源的任务数据给多线程数据处理系统，一份数据一个子线程处理一次
    ctmParseTask.addURL(window.location.href + ctmUrl);

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

export default DemoCTMLoadAndParser;

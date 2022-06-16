import { CoSpace } from "../CoSpace";
import { DataFormat } from "../schedule/base/DataUnit";
import { GeometryDataUnit } from "../schedule/base/GeometryDataUnit";
import { TestRenderableEntity } from "./scene/TestRenderableEntity";
import DivLog from "../../vox/utils/DivLog";

/**
 * 引擎数据/资源协同空间
 */
export class DemoCospace {
    /**
     * (引擎)数据协同中心实例
     */
    private m_cospace: CoSpace = new CoSpace();
    private m_beginTime: number = 0;
    constructor() { }

    initialize(): void {
        console.log("DemoCospace::initialize()...");
        DivLog.SetDebugEnabled(true);

        // 初始化数据协同中心
        //this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.min.js");
        this.m_cospace.initialize(3, "static/cospace/core/code/ThreadCore.umd.js", true);

        // 启用鼠标点击事件
        document.onmousedown = (evt: any): void => {
            this.mouseDown(evt);
        }
    }
    private m_files: string[] = ["hand.ctm", "f2.ctm", "h1.ctm", "s3.ctm"];

    private mouseDown(evt: any): void {

        this.m_beginTime = Date.now();
        //this.createRequest();
        // this.createRequestByCallback();
        
        // for (let i: number = 0; i < 8; ++i) {
        //     this.createRequestByCallback();
        // }
        //for (let i: number = 1; i <= 39; ++i) {
        for (let i: number = 0; i <= 26; ++i) {
            this.createRequestAt(i);
        }
    }
    private m_receivedTotal: number = 0;
    private createRequestAt(index: number): void {

        let baseUrl: string = window.location.href + "static/assets/private/";

        // let url: string = baseUrl + "sh0/1 (" + index +").ctm";
        let url: string = baseUrl + "sh202/sh202_" + index +".ctm";
        this.m_cospace.geometry.getCPUDataByUrlAndCallback(
            url,
            DataFormat.CTM,
            (unit: GeometryDataUnit, status: number): void => {
                this.m_receivedTotal ++;
                let totLossTime: number = Date.now() - this.m_beginTime;
                // console.log("DemoCospace::createRequestByCallback(), geometry model", unit.data.model);
                // console.log("model: ", unit.data.model);
                // console.log("one res lossTime: ", unit.lossTime + " ms");
                console.log("### total lossTime: ", totLossTime + " ms");
                
                let info: string = "one lossTime: " + unit.lossTime + " ms";
                info += "</br>";
                info += "ALL lossTime: " + totLossTime + " ms, tot: " + this.m_receivedTotal;
                DivLog.ShowLogOnce(info);
            },
            true
        );
    }

    private createRequest(): void {

        let baseUrl: string = window.location.href + "static/assets/ctm/";

        // 随机获取ctm url
        let index: number = Math.round(Math.random() * 1000) % this.m_files.length;
        console.log("index: ", index);
        let url: string = baseUrl + this.m_files[index];

        let entity = new TestRenderableEntity();
        let geometry = entity.geometryEntity;
        this.m_cospace.geometry.getCPUDataByUrl(url, DataFormat.CTM, geometry, true);
    }

    private createRequestByCallback(): void {

        let baseUrl: string = window.location.href + "static/assets/ctm/";

        // 随机获取ctm url
        let index: number = Math.round(Math.random() * 1000) % this.m_files.length;
        console.log("index: ", index);

        let url: string = baseUrl + this.m_files[index];
        let geometry = this.m_cospace.geometry;

        geometry.getCPUDataByUrlAndCallback(
            url,
            DataFormat.CTM,
            (unit: GeometryDataUnit, status: number): void => {
                console.log("DemoCospace::createRequestByCallback(), geometry model", unit.data.model);
                console.log("model: ", unit.data.model);
                console.log("lossTime: ", unit.lossTime + " ms");
            },
            true
        );
        
    }
    run(): void { }
}

export default DemoCospace;

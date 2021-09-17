
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import {DemoMultiRendererScene2 as SceneInstance} from "./DemoMultiRendererScene2";

export class DemoMultiGpuContext
{
    constructor(){}

    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_inited:boolean = true;

    private m_scIns0:SceneInstance = new SceneInstance();
    private m_scIns1:SceneInstance = new SceneInstance();
    private m_scIns2:SceneInstance = new SceneInstance();
    private m_scIns3:SceneInstance = new SceneInstance();
    
    private createDiv(px:number,py:number,pw:number,ph:number):HTMLDivElement
    {
        let div:HTMLDivElement = document.createElement('div');
        div.style.width = pw + 'px';
        div.style.height = ph + 'px';
        document.body.appendChild(div);            
        div.style.display = 'bolck';
        div.style.left = px + 'px';
        div.style.top = py + 'px';
        div.style.position = 'absolute';
        div.style.display = 'bolck';
        div.style.position = 'absolute';
        return div;
    }
    initialize():void
    {
        console.log("DemoMultiGpuContext::initialize()......");
        // multi renderer instances
        if(this.m_inited)
        {
            this.m_inited = true;

            let div:HTMLDivElement;

            div = this.createDiv(660,60,600,300);
            this.m_scIns0.initialize(div);
            div = this.createDiv(50,60,600,300);
            this.m_scIns1.initialize(div);
            div = this.createDiv(50,370,600,300);
            this.m_scIns2.initialize(div);
            div = this.createDiv(660,370,600,300);
            this.m_scIns3.initialize(div);

            this.m_statusDisp.initialize();
        }
    }
    run():void
    {
        this.m_statusDisp.update();
        
        this.m_scIns0.run();
        this.m_scIns1.run();
        this.m_scIns2.run();
        this.m_scIns3.run();
    }
}

export default DemoMultiGpuContext;
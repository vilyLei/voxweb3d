
import MouseEvent from "../../vox/event/MouseEvent";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import DullButton from "../button/DullButton";
import Color4 from "../../vox/material/Color4";
import Line3DEntity from "../../vox/entity/Line3DEntity";
import Vector3D from "../../vox/math/Vector3D";

import EventBase from "../../vox/event/EventBase";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
export class RGBColoSelectEvent extends EventBase
{
    static COLOR_SELECT:number = 33001;
    colorId: number = 0;
    color: Color4;
    constructor()
    {
        super();
        this.type = RGBColoSelectEvent.COLOR_SELECT;
    }
    toString():string
    {
        return "[SelectionEvent]";
    }
}
export default class RGBColorPanel extends DisplayEntityContainer
{
    constructor()
    {
        super();
    }
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: RGBColoSelectEvent = new RGBColoSelectEvent();
    private m_width:number = 100.0;
    private m_height:number = 100.0;
    private m_posZ:number = 0.0;
    private m_rn:number = 0.0;
    private m_colors: Color4[] = null;
    private m_grids: DullButton[] = null;
    private m_selectColorGrid: DullButton = null;
    private m_selectFrame: Line3DEntity = null;
    uuid: string = "RGBColorPanel";
    open(): void {
        this.setVisible(true);
    }
    close(): void {
        this.setVisible(false);
    }
    isOpen(): boolean {
        return this.getVisible();
    }
    isClosed(): boolean {
        return !this.getVisible();
    }
    getWidth():number
    {
        return this.m_width;
    }
    getHeight():number
    {
        return this.m_height;
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    initialize(gridSize: number, total: number): void {
        total = 4;

        let srcGrid: DullButton = new DullButton();
        srcGrid.initialize(0,0, gridSize, gridSize);
        let dis: number = 1;
        let size: number = dis + gridSize;
        let grid: DullButton = null;
        let px: number;
        let py: number;
        let rn: number = 8;
        let cn: number = 8;
        let index: number = 0;
        let pr: number;
        let pg: number;
        let pb: number;
        this.m_rn = rn;

        let startX: number = 0.0;
        let startY: number = 0.0;
        this.m_width = cn * size - dis;
        this.m_height = rn * size - dis;

        this.m_selectColorGrid = new DullButton();
        this.m_selectColorGrid.initialize(0,0, gridSize, gridSize);
        this.m_selectColorGrid.copyMeshFrom(srcGrid);
        this.m_selectColorGrid.setScaleXYZ(2.0,2.0,1.0);
        this.m_selectColorGrid.setXY(startX, startY + rn * size);
        //pgrid.setRGB3f(1.0,0.0,0.333);
        this.addEntity(this.m_selectColorGrid);

        this.m_colors = new Array(total * total * total);
        for(let i: number = 0; i < total; ++i) {
            pr = i/(total - 1.0);
            for(let j: number = 0; j < total; ++j) {
                pg = j/(total - 1.0);
                for(let k: number = 0; k < total; ++k) {
                    pb = k/(total - 1.0);
                    this.m_colors[index] = new Color4(pr,pg,pb,1.0);
                    index ++;
                }
            }
        }
        
        this.m_grids = new Array(rn * cn);

        index = 0;
        for(let i: number = 0; i < rn; ++i) {
            py = i * size;
            for(let j: number = 0; j < cn; ++j) {
                
                px = j * size;
                grid = new DullButton();
                grid.copyMeshFrom(srcGrid);
                grid.initialize(0,0, gridSize, gridSize);
                grid.setRGBColor(this.m_colors[index]);
                grid.setXY(startX + px, startY + py);
                this.addEntity(grid);

                this.m_grids[index] = grid;

                grid.index = index ++;
                grid.addEventListener(MouseEvent.MOUSE_DOWN, this, this.gridMouseDown);
                //grid.addEventListener(MouseEvent.MOUSE_OVER, this, this.gridMouseOver);
            }
        }

        this.m_selectFrame = new Line3DEntity();
        this.m_selectFrame.dynColorEnabled = true;
        this.m_selectFrame.initializeRectXOY(1,1, gridSize - 2, gridSize - 2);
        this.m_selectFrame.setXYZ(0.0,0.0,0.1);
        this.addEntity(this.m_selectFrame);
        this.m_selectFrame.setVisible(false);
    }
    private m_outColor: Color4 = new Color4();
    getColorById(id: number): Color4 {
        this.m_outColor.copyFrom(this.m_colors[id]);
        return this.m_outColor;
    }
    getRandomColorId(): number {
        
        return Math.round(Math.random() * (this.m_colors.length - 1));
    }
    private gridMouseOver(evt: any): void {

    }
    
    private sendEvt(color: Color4, id: number): void {

        this.m_currEvent.target = this;
        this.m_currEvent.colorId = id;
        this.m_currEvent.type = RGBColoSelectEvent.COLOR_SELECT;
        this.m_currEvent.color = color;
        this.m_currEvent.phase = 1;
        this.m_currEvent.uuid = this.uuid;
        this.m_dispatcher.dispatchEvt( this.m_currEvent );
    }
    private m_pv: Vector3D = new Vector3D();
    private gridMouseDown(evt: any): void {

        let id: number = evt.target.index;
        let color: Color4 = this.m_colors[id];
        this.selectColorById( id );
        this.sendEvt(color, id);
    }
    selectColorById(id: number): void {

        this.m_selectFrame.setVisible(true);
        
        let grid:DullButton = this.m_grids[id];
        grid.getPosition(this.m_pv);
        this.m_pv.z = 0.1;
        this.m_selectFrame.setPosition(this.m_pv);
        this.m_selectFrame.update();
        let color: Color4 = this.m_colors[id];
        
        let pr: number = 1.5 * (1.0 - color.r);//, Math.abs(0.0 - color.r));
        let pg: number = 1.5 * (1.0 - color.g);//, Math.abs(0.0 - color.g));
        let pb: number = 1.5 * (1.0 - color.b);//, Math.abs(0.0 - color.b));

        (this.m_selectFrame.getMaterial() as any).setRGB3f(pr,pg,pb);
        this.m_selectColorGrid.setRGBColor(color);
    }
    setXY(px:number,py:number):void
    {
        super.setXYZ(px,py,this.m_posZ);
        this.update();
    }
    setXYZ(px:number,py:number,pz:number):void
    {
        this.m_posZ = pz;
        super.setXYZ(px,py,pz);
        this.update();
    }
    destory():void
    {
        super.destroy();
    }
    toString():string
    {
        return "[RGBColorPanel]";
    }
}
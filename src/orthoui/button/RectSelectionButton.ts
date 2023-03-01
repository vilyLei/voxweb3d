
import MouseEvent from "../../vox/event/MouseEvent";
import Color4 from "../../vox/material/Color4";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import TextureProxy from "../../vox/texture/TextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import RectTextureBtnMaterial from "../material/RectTextureBtnMaterial";
import AABB2D from "../../vox/geom/AABB2D";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";

export default class RectSelectionButton extends Plane3DEntity {

    private m_initFlag: boolean = true;
    private m_selected: boolean = false;
    private m_isOver: boolean = false;
    private m_dispatcher: MouseEvt3DDispatcher = null;
    
    private m_selectDispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: SelectionEvent = new SelectionEvent();

    private m_width: number = 100.0;
    private m_height: number = 100.0;
    private m_posZ: number = 0.0;
    
    readonly selectOverColor: Color4 = new Color4(1.1, 1.1, 1.1, 1.0);
    readonly selectOutColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly bgSelectOverColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly bgSelectOutColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly bgOverColor: Color4 = new Color4(1.1, 1.1, 1.1, 1.0);
    readonly bgOutColor: Color4 = new Color4(0.85, 0.85, 0.85, 1.0);

    readonly selectedColor: Color4 = new Color4(1.0, 0.0, 0.0, 1.0);
    readonly deselectedColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);

    readonly bgUVClampRect: AABB2D = new AABB2D(0.0, 0.0, 1.0, 1.0);
    readonly selectUVClampRect: AABB2D = new AABB2D(0.0, 0.0, 1.0, 1.0);
    readonly deselectUVClampRect: AABB2D = new AABB2D(0.0, 0.0, 1.0, 1.0);

    uuid: string = "RectSelectionButton";
    constructor() {
        super();
    }
    
    private sendSelectionEvt(): void {

        this.m_selectDispatcher.uuid = this.uuid;
        this.m_currEvent.target = this;
        this.m_currEvent.type = SelectionEvent.SELECT;
        this.m_currEvent.flag = this.m_selected;
        this.m_currEvent.phase = 1;
        this.m_selectDispatcher.dispatchEvt(this.m_currEvent);
    }
    /**
     * 选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    select(sendEvtEnabled: boolean = false): void {
        this.m_selected = true;
        this.setFgColor( this.selectedColor );
        let material: RectTextureBtnMaterial = this.getMaterial() as RectTextureBtnMaterial;
        material.setFgUVClampRect(this.selectUVClampRect);
        if(this.m_isOver) {
            this.setBgColor(this.bgSelectOverColor);
        }
        else {
            this.setBgColor(this.bgSelectOutColor);
        }
        if(sendEvtEnabled) {
            this.sendSelectionEvt();
        }
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselect(sendEvtEnabled: boolean = false): void {
        this.m_selected = false;
        this.setFgColor( this.deselectedColor );
        let material: RectTextureBtnMaterial = this.getMaterial() as RectTextureBtnMaterial;
        material.setFgUVClampRect(this.deselectUVClampRect);

        if(this.m_isOver) {
            this.setBgColor(this.bgOverColor);
        }
        else {
            this.setBgColor(this.bgOutColor);
        }
        if(sendEvtEnabled) {
            this.sendSelectionEvt();
        }
    }
    isSelected(): boolean {
        return this.m_selected;
    }
    // setAlpha(pa: number): void {
    //     this.bgOverColor.a = pa;
    //     this.bgOutColor.a = pa;
    // }
    getWidth(): number {
        return this.m_width;
    }
    getHeight(): number {
        return this.m_height;
    }
    setSize(pwidth: number, pheight: number): void {

        this.m_width = pwidth;
        this.m_height = pheight;
    }
    private initEvtBase(): void {
        if(this.m_dispatcher == null) {
            this.m_dispatcher = new MouseEvt3DDispatcher();
            this.m_dispatcher.uuid = this.uuid;
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            //this.m_dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
            this.setEvtDispatcher(this.m_dispatcher);
        }
    }
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: TextureProxy[] = null): void {

        if (this.m_initFlag) {
            this.m_initFlag = false;

            this.m_width = pwidth;
            this.m_height = pheight;

            let material:RectTextureBtnMaterial = this.getMaterial() as RectTextureBtnMaterial;
            if(material == null) {
                material = new RectTextureBtnMaterial();
                this.setMaterial( material );
            }
            this.initEvtBase();
            super.initializeXOY(startX, startY, pwidth, pheight, texList);
            this.mouseEnabled = true;
            
            material.setBgUVClampRect(this.bgUVClampRect);
            material.setFgUVClampRect(this.deselectUVClampRect);
            this.setBgColor( this.bgOutColor );
        }
    }
    setXY(px: number, py: number): void {
        super.setXYZ(px, py, this.m_posZ);
        this.update();
    }
    setXYZ(px: number, py: number, pz: number): RectSelectionButton {
        this.m_posZ = pz;
        super.setXYZ(px, py, pz);
        this.update();
        return this;
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if(type != SelectionEvent.SELECT) {
            if (this.m_dispatcher != null) {
                this.m_dispatcher.addEventListener(type, listener, func);
            }
        }
        else {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.addEventListener(type, listener, func);
            }
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if(type != SelectionEvent.SELECT) {
            if (this.m_dispatcher != null) {
                this.m_dispatcher.removeEventListener(type, listener, func);
            }
        }
        else {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.removeEventListener(type, listener, func);
            }
        }
    }
    protected mouseOverListener(evt: any): void {
        this.m_isOver = true;
        if(this.m_selected) {
            this.setBgColor(this.bgSelectOverColor);
        }
        else {
            this.setBgColor(this.bgOverColor);
        }
        this.setFgColor(this.selectOverColor);
    }
    protected mouseOutListener(evt: any): void {
        this.m_isOver = false;
        if(this.m_selected) {
            this.setBgColor(this.bgSelectOutColor);
        }
        else {
            this.setBgColor(this.bgOutColor);
        }
        //this.setBgColor(this.bgOutColor);
        this.setFgColor(this.selectOutColor);
    }
    protected mouseDownListener(evt: any): void {
        this.m_selected = !this.m_selected;
        if(this.m_selected) {
            this.select( true );
        }
        else {
            this.deselect( true );
        }
    }
    // protected mouseUpListener(evt: any): void {
    //     //this.setColor(this.bgOverColor);
    // }
    setFgColor(color: Color4): void {
        let material: RectTextureBtnMaterial = this.getMaterial() as RectTextureBtnMaterial;
        material.setFgColor(color);
    }
    setBgColor(color: Color4): void {
        let material: RectTextureBtnMaterial = this.getMaterial() as RectTextureBtnMaterial;
        material.setBgColor(color);
    }
}
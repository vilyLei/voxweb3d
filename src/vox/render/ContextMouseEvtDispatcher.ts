/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../../vox/utils/DivLog";
import RendererDeviece from "../../vox/render/RendererDeviece";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

class ContextMouseEvtDispatcher
{
    private m_singleDown:boolean = false;
    dpr:number = 1.0;
    constructor()
    {
    }
    initMobile(canvas:any, div:any, stage:IRenderStage3D):void
    {
        var pdocument:any = null;
        var pwindow:any = null;
        try
        {
            if(document != undefined)
            {
                pdocument = document;
                pwindow = window;
            }
        }
        catch(err)
        {
            console.log("ContextMouseEvtDispatcher::initMobile(), document is undefined.");
        }
        if(pdocument != null)
        {
            let selfT:ContextMouseEvtDispatcher = this;
            div.addEventListener('touchstart',function(evt:any){
                /*
                e.touches：当前位于屏幕上的所有手指的列表
                e.targetTouches：位于当前DOM元素上手指的列表
                e.changedTouches：涉及当前事件手指的列表
                */
                //获取手指的位置
                //let rect:any = div.getBoundingClientRect();
                let list:any[] = evt.targetTouches;
                let px:number = 0;
                let py:number = 0;
                if(list.length < 2)
                {
                    px = 0 | (selfT.dpr * evt.targetTouches[0].pageX);
                    py = 0 | (selfT.dpr * evt.targetTouches[0].pageY);
                    
                    stage.mouseX = px;
                    stage.mouseY = stage.stageHeight - py;
                    stage.mouseViewX = px;
                    stage.mouseViewY = py;
                    selfT.m_singleDown = true;
                    stage.mouseDown(1);
                }
                else
                {
                    let posArray:any[] = [];
                    for(let i:number = 0; i < list.length; ++i)
                    {
                        px = 0 | (selfT.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (selfT.dpr * evt.targetTouches[i].pageY);
                        posArray.push( {x:px, y:py} );
                    }
                    stage.mouseMultiDown(posArray);
                    selfT.m_singleDown = false;
                }
                //DivLog.showLogOnce("touchstart "+list.length+", px,py: "+(px|0)+","+(0|py)+",rect:"+rect.width+","+rect.height);
                evt.preventDefault();
            },false)
            div.addEventListener('touchend',function(evt:any){
                //获取手指的位置
                selfT.m_singleDown = false;
                let list:any[] = evt.targetTouches;
                let px = 0;
                let py = 0;
                if(list.length < 1)
                {
                    stage.mouseUp(1);
                }
                else
                {
                    let posArray:any[] = [];
                    for(let i:number = 0; i < list.length; ++i)
                    {
                        px = 0 | (selfT.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (selfT.dpr * evt.targetTouches[i].pageY);
                        posArray.push( {x:px, y:py} );
                    }
                    stage.mouseMultiUp(posArray);
                }
                //DivLog.showLogOnce("touchend (list != null): "+(list != null)+",list.length: "+list.length);
                evt.preventDefault();
            },false);
            div.addEventListener('touchcancel',function(e:any){
                //获取手指的位置
                selfT.m_singleDown = false;
                let list:any[] = e.targetTouches;
                stage.mouseCancel();
                e.preventDefault();
                //DivLog.showLogOnce("touchcancel (list != null): "+(list != null));
            },false);
            ///*
            div.addEventListener('touchmove',function(evt:any){
                evt.preventDefault(); //阻止屏幕滚动的默认行为
                let list:any[] = evt.targetTouches;
                let px:number = 0;
                let py:number = 0;
                if(selfT.m_singleDown)
                {
                    px = 0 | (selfT.dpr * list[0].pageX);
                    py = 0 | (selfT.dpr * list[0].pageY);
                    stage.mouseViewX = px;
                    stage.mouseViewY = py;                            
                    stage.mouseX = px;
                    stage.mouseY = stage.stageHeight - py;
                    stage.mouseMove();
                }
                if(list.length > 1)
                {                            
                    let posArray:any[] = [];
                    for(let i:number = 0; i < list.length; ++i)
                    {
                        px = 0 | (selfT.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (selfT.dpr * evt.targetTouches[i].pageY);
                        posArray.push( {x:px, y:py} );
                    }
                    stage.mouseMultiMove(posArray);
                }
                //DivLog.ShowLog("touchmove "+list.length+", px,py: "+(px|0)+","+(0|py));
            },{passive: false},false);
            //},false);
            //*/
            if(RendererDeviece.IsIpadOS()) {
                let meta = document.createElement('meta');
                meta.name = "viewport";
                meta.content = "width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no";
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
        }
    }
    initialize(canvas:any, div:any, stage:IRenderStage3D):void
    {
        if(RendererDeviece.IsMobileWeb() || RendererDeviece.IsIpadOS())
        {
            this.initMobile(canvas,div,stage);
        }
        else
        {
            this.initPC(canvas,div,stage);
        }
    }
    private initPC(canvas:any, div:any, stage:IRenderStage3D):void
    {
        var pdocument:any = null;
        var pwindow:any = null;
        try
        {
            if(document != undefined)
            {
                pdocument = document;
                pwindow = window;
            }
        }
        catch(err)
        {
            console.log("ContextMouseEvtDispatcher::initPC(), document is undefined.");
        }
        if(pdocument != null)
        {
            let selfT:ContextMouseEvtDispatcher = this;
            if(canvas.onmousewheel == undefined && canvas.addEventListener != undefined)
            {
                //use firefox browser mousewheel evt
                let func:any = function(evt:any):void
                {
                    evt.wheelDeltaY = -evt.detail;
                    stage.mouseWheel(evt);
                }
                canvas.addEventListener('DOMMouseScroll', func, false);  
            }
            canvas.onmousewheel = function(evt:any):void
            {
                stage.mouseWheel(evt);
            }
            canvas.onmousedown = function(evt:any):void
            {
                let rect:any = div.getBoundingClientRect();
                let px = 0 | (selfT.dpr * (evt.clientX - rect.left));
                let py = 0 | (selfT.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                //  console.log("ContextMouseEvtDispatcher::onmousedown(),mouseY: "+stage.mouseY+",mouseViewY:"+stage.mouseViewY);
                //  console.log("ContextMouseEvtDispatcher::onmousedown(), rect: "+rect.width+","+rect.height);
                //  console.log("ContextMouseEvtDispatcher::onmousedown(), pos: "+stage.mouseX+","+stage.mouseY);
                if(evt.button == 0)
                {
                    stage.mouseDown(1);
                }else if(evt.button == 2)
                {
                    stage.mouseRightDown(1);
                }
            }
            ///*
            canvas.onmouseup = function(evt:any):void
            {
                let rect = div.getBoundingClientRect();
                let px = 0 | (selfT.dpr * (evt.clientX - rect.left));
                let py = 0 | (selfT.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                //console.log("ContextMouseEvtDispatcher::onmouseup(),"+stage.mouseViewX+","+stage.mouseViewY);
                //
                if(evt.button == 0)
                {
                    stage.mouseUp(1);
                }
                else if(evt.button == 2)
                {
                    stage.mouseRightUp(1);
                }
            }
            //*/
            ///*
            document.onmouseup = function(evt:any):void
            {
                if(evt.button == 0)
                {
                    stage.mouseWindowUp(1);
                }
                else if(evt.button == 2)
                {
                    stage.mouseWindowRightUp(1);
                }
            }
            //*/
            canvas.onmousemove = function(evt:any):void
            {
                //console.log("ContextMouseEvtDispatcher::onmouseMove"+evt.pageX+","+evt.pageY);
                let rect:any = div.getBoundingClientRect();
                let px = 0 | (selfT.dpr * (evt.clientX - rect.left));
                let py = 0 | (selfT.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseMove();
            }
            
            canvas.onclick = function(evt:any):void
            {
                let rect:any = div.getBoundingClientRect();
                let px = 0 | (selfT.dpr * (evt.clientX - rect.left));
                let py = 0 | (selfT.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                //  console.log("ContextMouseEvtDispatcher::onclick(),"+stage.mouseViewX+","+stage.mouseViewY+",evt.button: "+evt.button);
                if(evt.button == 0)
                {
                    stage.mouseClick();
                }else if(evt.button == 2)
                {
                    stage.mouseRightClick();
                }
            }
            canvas.ondblclick = function(evt:any):void
            {
                let rect:any = div.getBoundingClientRect();
                let px = 0 | (selfT.dpr * (evt.clientX - rect.left));
                let py = 0 | (selfT.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                //console.log("ContextMouseEvtDispatcher::ondoubleclick(),"+stage.mouseViewX+","+stage.mouseViewY+",evt.button: "+evt.button);
                if(evt.button == 0)
                {
                    stage.mouseDoubleClick();
                }else if(evt.button == 2)
                {
                    //stage.mouseRightDoubleClick();
                }
            }
        }
    }
}

export default ContextMouseEvtDispatcher;
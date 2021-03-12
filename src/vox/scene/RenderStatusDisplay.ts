/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace scene
    {
        export class RenderStatusDisplay
        {
            constructor()
            {
            }
            private m_lastTime:number = 0;
            private m_fps:number = 60;
            private m_canvas2D:any = null;
            private m_ctx2D:any = null;
            private m_delayTime:number = 10;
            delayTime:number = 40;
            statusInfo:string = "";
            statusEnbled:boolean = true;
        
            initialize(canvas_id_name:string,width:number = 0):void
            {
                var pdocument:any = null;
                try
                {
                    if(document != undefined)
                    {
                        pdocument = document;
                    }
                }
                catch(err)
                {
                    console.log("RenderStatusDisplay::initialize(), document is undefined.");
                }
                if(pdocument != null)
                {
                    this.m_canvas2D = pdocument.getElementById(canvas_id_name);
                    if(this.m_canvas2D == null)
                    {

                        this.m_canvas2D = document.createElement('canvas');
                        //this.m_div.appendChild(this.m_canvas2D);
                        document.body.appendChild(this.m_canvas2D);
                        this.m_canvas2D.width = width < 10?300:width;
                        this.m_canvas2D.height = 70;
                        //this.m_canvas2D.style.width="100%";
                        this.m_canvas2D.style.display = 'bolck';
                        this.m_canvas2D.style.left = '0px';
                        this.m_canvas2D.style.top = '0px';
                        this.m_canvas2D.style.position = 'absolute';
                        this.m_canvas2D.style.backgroundColor = 'transparent';
                        this.m_canvas2D.style.pointerEvents = 'none';
                    }
                    this.m_ctx2D = this.m_canvas2D.getContext("2d");
                    this.m_ctx2D.font="50px Verdana";
                    this.m_ctx2D.fillStyle = "red";
                    this.m_ctx2D.textAlign = "left";
                }
            }
            getFPS():number{return this.m_fps;};
            getFPSStr():string
            {
                //return this.m_fps;
                if(this.m_fps > 60)
                {
                    return "FPS: 60";
                }
                else if(this.m_fps < 10)
                {
                    return "FPS: 0"+this.m_fps;
                }
                return "FPS: "+this.m_fps;
            }
            //private m_date:any = new Date();
            render():void
            {
                if(this.statusEnbled)
                {
                    this.m_ctx2D.clearRect(0, 0, 600, 70);
                    this.m_ctx2D.fillText("FPS:"+this.m_fps+this.statusInfo, 5,50);
                }

            }
            update(immediaterender:boolean = true):void
            {
                if(this.m_delayTime > 0)
                {
                    --this.m_delayTime;
                    this.m_lastTime = Date.now();
                }
                else
                {
                    if(this.m_ctx2D != null)
                    {
                        let t:number = Date.now();
                        //let t:number = this.m_date.getTime();
                        if(this.m_lastTime > 0)
                        {
                            this.m_lastTime = t - this.m_lastTime;
                            this.m_fps = Math.round(1000.0/this.m_lastTime);
                            if(immediaterender)
                            {
                                this.render();
                            }
                        }
                        this.m_lastTime = t;
                    }
                    this.m_delayTime = this.delayTime;
                }
            }
        }
    }
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import * as TextBillboard3DEntityT from "../../vox/text/TextBillboard3DEntity";

import TextBillboard3DEntity = TextBillboard3DEntityT.vox.text.TextBillboard3DEntity;

export namespace orthoui
{
    export namespace label
    {
        export class TextInfoLabel extends TextBillboard3DEntity
        {
            private m_status:number = -1;
            private m_alphaValue:number = 0;
            private m_spd:number = 0.05;
            private m_alphaTime:number = 0.0;
            //private m_delayTime:number = 0;
            constructor(dynamicEnbaled:boolean = true)
            {
                super(dynamicEnbaled);
            }
            
            flashToFadein(spd:number = 0.05,flashTime:number):void
            {

            }
            flashToFadeout(spd:number = 0.05,flashTime:number):void
            {

            }
            flash(spd:number = 0.05):void
            {
                this.m_alphaTime = 0.0;
                this.m_status = 0;
                this.m_alphaValue = 0.0;
                this.m_spd = spd;
            }
            fadein():void
            {
                this.m_status = 2;
                this.m_alphaValue = Math.abs(Math.sin(this.m_alphaValue)) - 0.01;
            }
            fadeout():void
            {
                this.m_status = 1;
                this.m_alphaValue = Math.abs(Math.sin(this.m_alphaValue)) + 0.01;
            }
            run():void
            {
                switch(this.m_status)
                {
                    case 0:
                        this.m_alphaValue = Math.abs(Math.sin(this.m_alphaTime));
                        this.setAlpha(this.m_alphaValue);
                        this.m_alphaTime += this.m_spd;
                    break;
                    case 1:
                        if(this.m_alphaValue > 0.0)
                        {
                            this.m_alphaValue -= 0.02;
                            if(this.m_alphaValue < 0)
                            {
                                this.m_alphaValue = 0.0;
                                this.m_status = -1;
                            }
                            this.setAlpha(this.m_alphaValue);
                        }
                    break;
                    case 2:
                        if(this.m_alphaValue < 1.0)
                        {
                            this.m_alphaValue += 0.02;
                            if(this.m_alphaValue > 1.0)
                            {
                                this.m_alphaValue = 1.0;
                                this.m_status = -1;
                            }
                            this.setAlpha(this.m_alphaValue);
                        }
                    break;
                    default:
                        break;
                }
            }
            toString():string
            {
                return "[TextInfoLabel]";
            }
        }
    }        
}
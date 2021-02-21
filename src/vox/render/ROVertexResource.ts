/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        
        // tgpu exture buffer renderer resource
        export class ROVertexResource
        {
            
			// renderer context unique id
			private m_rcuid:number = 0;
            private m_gl:any = null;

            // render vertex object unique id
            rvoUid:number = -2;
            // indices buffer object unique id
            rioUid:number = -3;
            unlocked:boolean = true;
            constructor(rcuid:number, gl:any)
            {
                this.m_rcuid = rcuid;
                this.m_gl = gl;
            }
            getRCUid():number
            {
                return this.m_rcuid;
            }
            getRC():any
            {
                return this.m_gl;
            }
            renderBegin():void
            {
                this.rvoUid = -2;
                this.rioUid = -3;
            }
            update():void
            {
            }

        }
        
    }
}
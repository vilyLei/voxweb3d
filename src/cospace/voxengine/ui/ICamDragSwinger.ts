/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";


interface ICamDragSwinger {
    
    initialize(stage3D: IRenderStage3D, camera: IRenderCamera): void;
    
    /**
     * the defualt value is false
     */
    autoRotationEnabled: boolean;
    /**
     * the defualt value is 0.2
     */
    autoRotationSpeed: number;
    
    /**
     * the defualt value is false
     */
    rotationAttenuationEnabled: boolean;
    
    /**
     * the defualt value is 0.2
     */
    rotationSpeed: number;
    attach(): void;
    detach(): void;
    runWithYAxis(): void;
    runWithZAxis(): void;

    runWithAxis(axis: IVector3D): void;

    runWithCameraAxis(): void;
}
export { ICamDragSwinger };

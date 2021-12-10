/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../../vox/math/Vector3D";
import Matrix4 from "../../../../vox/math/Matrix4";
import PureEntity from "../../../../vox/entity/PureEntity";

import TextureProxy from "../../../../vox/texture/TextureProxy";
import Box3DEntity from "../../../../vox/entity/Box3DEntity";

class AssetPackage {
    textures:TextureProxy[] = null;
    constructor() {
    }
}
export { AssetPackage };
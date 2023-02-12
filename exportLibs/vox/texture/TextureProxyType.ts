/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
interface ITextureProxyType {
    
}
enum TextureProxyType {
    Default,
    /**
     * for DepthTextureProxy class
     */
    Depth,
    /**
     * for WrapperTextureProxy class
     */
    Wrapper,
    /**
     * for RTTTextureProxy class
     */
    RTT,
    /**
     * for ImageTextureProxy class
     */
    Image,
    /**
     * for FloatTextureProxy class
     */
    Float,
    /**
     * for Uint16TextureProxy class
     */
    Uint16,
    /**
     * for FloatCubeTextureProxy class
     */
    FloatCube,
    /**
     * for BytesTextureProxy class
     */
    Bytes,
    /**
     * for BytesCubeTextureProxy class
     */
    BytesCube,
    /**
     * for ImageCubeTextureProxy class
     */
    ImageCube,
    /**
     * for Texture3DProxy class
     */
    Texture3D
}
export { TextureProxyType }
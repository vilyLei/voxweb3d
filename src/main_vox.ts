(document as any).demoState = 1;
class VVF {
    isEnabled(): boolean {
        return true;
    }
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

//  import * as VatParallaxMap2 from "./voxvat/demo/VatParallaxMap2";
//  import Demo = VatParallaxMap2.voxvat.demo.VatParallaxMap2;

//  import * as DemoBase from "./demo2d/DemoBase";
//  import Demo = DemoBase.demo2d.DemoBase;

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  import * as DemoPathWalk from "./voxnav/DemoPathWalk";
//  import Demo = DemoPathWalk.voxnav.DemoPathWalk;

//  import * as DemoTriNav from "./voxnav/DemoTriNav";
//  import Demo = DemoTriNav.voxnav.DemoTriNav;


////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// pov demos ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  import {DemoQuadLine as Demo} from "./demo/DemoQuadLine";

//  import {DemoTexture as Demo} from "./demo/DemoTexture";

//  import {DemoCamVisibleTest as Demo} from "./demo/DemoCamVisibleTest";

// import {DemoSphereOcclusion as Demo} from "./voxocc/demo/DemoSphereOcclusion";

// import {DemoSphOccContainer as Demo} from "./voxocc/demo/DemoSphOccContainer";

// import {DemoSphereGapOcclusion as Demo} from "./voxocc/demo/DemoSphereGapOcclusion";

// import {DemoTwoSphereOcclusion as Demo} from "./voxocc/demo/DemoTwoSphereOcclusion";

//  import {DemoQuadOcclusion as Demo} from "./voxocc/demo/DemoQuadOcclusion";

//  import {DemoQuad2Occlusion as Demo} from "./voxocc/demo/DemoQuad2Occlusion";

//  import {DemoQuadHoleOcc as Demo} from "./voxocc/demo/DemoQuadHoleOcc";

//  import {DemoBoxOcclusion as Demo} from "./voxocc/demo/DemoBoxOcclusion";

//  import {DemoOccBoxWall as Demo} from "./voxocc/demo/DemoOccBoxWall";

//  import {DemoOccBoxWall2 as Demo} from "./voxocc/demo/DemoOccBoxWall2";

//  import {DemoOccPOVBuilding as Demo} from "./voxocc/demo/DemoOccPOVBuilding";

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  import * as DemoRayTest from "./demo/DemoRayTest";
//  import Demo = DemoRayTest.demo.DemoRayTest;

// import {DemoSphScreenRect as Demo} from "./demo/DemoSphScreenRect";

//  import * as DemoGeom from "./demo/DemoGeom";
//  import Demo = DemoGeom.demo.DemoGeom;

//  import { DemoPreDepth as Demo } from "./demo/DemoPreDepth";

//  import * as DemoRTTHalfSize from "./demo/DemoRTTHalfSize";
//  import Demo = DemoRTTHalfSize.demo.DemoRTTHalfSize;

//  import {DemoOnlyColorRTT as Demo} from "./demo/DemoOnlyColorRTT";

//  import {DemoRTT as Demo} from "./demo/DemoRTT";

//  import {DemoFloatRTT as Demo} from "./demo/DemoFloatRTT";

//  import { DemoFBOInstance as Demo } from "./demo/DemoFBOInstance";

//  import { DemoFBOInsRTT as Demo } from "./demo/DemoFBOInsRTT";

//  import { DemoFBOInsFloatRTT as Demo } from "./demo/DemoFBOInsFloatRTT";

//  import { DemoFBOInsMultiFloatMRT as Demo } from "./demo/DemoFBOInsMultiFloatMRT";

//  import { DemoAlphaFormatFloatRTT as Demo } from "./demo/DemoAlphaFormatFloatRTT";

//  import { DemoFBOInsMRT as Demo } from "./demo/DemoFBOInsMRT";

//  import {DemoCubeMapMRT as Demo} from "./demo/DemoCubeMapMRT";

//  import {DemoFBOInsCubeMapMRT as Demo} from "./demo/DemoFBOInsCubeMapMRT";

//  import * as DemoScreenPingpongBlur from "./demo/DemoScreenPingpongBlur";
//  import Demo = DemoScreenPingpongBlur.demo.DemoScreenPingpongBlur;

//  import {DemoDepthBlur as Demo} from "./demo/DemoDepthBlur";

//  import {DemoDepthBlur2 as Demo} from "./demo/DemoDepthBlur2";

//  import {DemoDepthTex as Demo} from "./demo/DemoDepthTex";

//  import {DemoFBOInsDepthRTT as Demo} from "./demo/DemoFBOInsDepthRTT";

//  import * as DemoPNG from "./example/DemoPNG";
//  import Demo = DemoPNG.example.DemoPNG;

//  import {DemoRTTCircle as Demo} from "./demo/DemoRTTCircle";

//  import {DemoLargeVtx as Demo} from "./large/DemoLargeVtx";

//  import * as VatParallaxMap2 from "./voxvat/demo/VatParallaxMap2";
//  import Demo = VatParallaxMap2.voxvat.demo.VatParallaxMap2;

//  import * as DemoFBOBlit from "./demo/DemoFBOBlit";
//  import Demo = DemoFBOBlit.demo.DemoFBOBlit;

//  import * as DemoPartRender from "./demo/DemoPartRender";
//  import Demo = DemoPartRender.demo.DemoPartRender;

//  import * as DemoLargeVtx from "./large/DemoLargeVtx";
//  import Demo = DemoLargeVtx.large.DemoLargeVtx;

//  import * as TwoTexture from "./example/TwoTexture";
//  import Demo = TwoTexture.example.TwoTexture;

//  import * as MipmapTexture from "./example/MipmapTexture";
//  import Demo = MipmapTexture.example.MipmapTexture;

//  import {DemoMatContainer as Demo} from "./demo/DemoMatContainer";

//  import * as DemoDrawGroup from "./demo/DemoDrawGroup";
//  import Demo = DemoDrawGroup.demo.DemoDrawGroup;

//  import {DemoDeepTransparent as Demo} from "./demo/DemoDeepTransparent";

//  import {DemoGpuVtxMana as Demo} from "./demo/DemoGpuVtxMana";

//  import {DemoGpuTexMana as Demo} from "./demo/DemoGpuTexMana";

//  import {DemoVtx as Demo} from "./demo/DemoVtx";

//  import {DemoSwapProcess as Demo} from "./demo/DemoSwapProcess";

//  import {DemoDelEntity as Demo} from "./demo/DemoDelEntity";

//  import {DemoText2D as Demo} from "./demo/DemoText2D";

//  import {DemoTexUpdate as Demo} from "./demo/DemoTexUpdate";

//  import {DemoKeyboardEvt as Demo} from "./demo/DemoKeyboardEvt";

//  import {DemoParticle as Demo} from "./demo/DemoParticle";
//  import {DemoParticleRefraction as Demo} from "./demo/DemoParticleRefraction";

//  import {DemoParticleMixTex as Demo} from "./demo/DemoParticleMixTex";

//  import {DemoParticleFlareGroup as Demo} from "./demo/DemoParticleFlareGroup";

//  import {DemoParticleFlowGroup as Demo} from "./demo/DemoParticleFlowGroup";

//  import {DemoParticleFollowGroup as Demo} from "./demo/DemoParticleFollowGroup";

//  import {DemoParticleFollowGroup2 as Demo} from "./demo/DemoParticleFollowGroup2";

//  import {DemoParticleFollowGroup3 as Demo} from "./demo/DemoParticleFollowGroup3";

//  import {DemoParticleFollowMultiGroups as Demo} from "./demo/DemoParticleFollowMultiGroups";

//  import {DemoParticleGroup as Demo} from "./demo/DemoParticleGroup";

//  import {DemoParticleEruption as Demo} from "./demo/DemoParticleEruption";

//  import {DemoParticleClips as Demo} from "./demo/DemoParticleClips";

//  import {DemoLockDrawEntity as Demo} from "./demo/DemoLockDrawEntity";

//  import {DemoPrimitive as Demo} from "./demo/DemoPrimitive";

//  import {DemoBaseRenderer as Demo} from "./demo/DemoBaseRenderer";

//  import {DemoVSTexture as Demo} from "./demo/DemoVSTexture";

//  import {DemoVSTexturePos as Demo} from "./demo/DemoVSTexturePos";

//  import {DemoFloatTex as Demo} from "./demo/DemoFloatTex";

//  import {DemoCubeFloatTex as Demo} from "./demo/DemoCubeFloatTex";

//  import {DemoFloatTex2 as Demo} from "./example/DemoFloatTex2";

//  import {DemoMixProgress as Demo} from "./demo/DemoMixProgress";

//  import {DemoRenderSort as Demo} from "./demo/DemoRenderSort";

//  import {DemoRenderSortA as Demo} from "./demo/DemoRenderSortA";

//  import {DemoRenderSortContainerRender as Demo} from "./demo/DemoRenderSortContainerRender";


//  import {DemoThread as Demo} from "./thread/example/DemoThread";

//  import {DemoOrtho as Demo} from "./demo/DemoOrtho";

//  import {DemoMouseEvent as Demo} from "./demo/DemoMouseEvent";

//  import {DemoOrthoSubScene as Demo} from "./demo/DemoOrthoSubScene";

//  import {DemoOrthoBtn as Demo} from "./demo/DemoOrthoBtn";

//  import {DemoCameraSwing as Demo} from "./demo/DemoCameraSwing";

//  import {DemoCamVisibleTest as Demo} from "./demo/DemoCamVisibleTest";

//  import {DemoHdrCylindricalMap as Demo} from "./demo/DemoHdrCylindricalMap";

//  import {DemoRGBETex as Demo} from "./demo/DemoRGBETex";

//  import {DemoBlendMode as Demo} from "./demo/DemoBlendMode";

//  import {DemoFileSystem as Demo} from "./demo/DemoFileSystem";

//  import {DemoPreDepthTransparent as Demo} from "./demo/DemoPreDepthTransparent";

//  import {DemoObj3DModule as Demo} from "./demo/DemoObj3DModule";

//  import {DemoCubeMap as Demo} from "./demo/DemoCubeMap";

//  import {DemoRTTCamera as Demo} from "./demo/DemoRTTCamera";

//  import {DemoDeepTransparent2 as Demo} from "./demo/DemoDeepTransparent2";

//  import {DemoPingpongBlur as Demo} from "./demo/DemoPingpongBlur";

//  import {DemoRTTLod as Demo} from "./demo/DemoRTTLod";

//  import {DemoRTTCube as Demo} from "./demo/DemoRTTCube";

//  import {DemoProjectPlane as Demo} from "./demo/DemoProjectPlane";

//  import {DemoMRT as Demo} from "./demo/DemoMRT";

//  import {DemoDepthTex as Demo} from "./demo/DemoDepthTex";

//  import {DemoFrustrum as Demo} from "./demo/DemoFrustrum";

//  import {DemoCamera as Demo} from "./demo/DemoCamera";

//  import {DemoPureEntity as Demo} from "./demo/DemoPureEntity";

//  import {DemoObjModel as Demo} from "./demo/DemoObjModel";

//  import {RModelSCViewer as Demo} from "./demo/RModelSCViewer";

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////   thread    /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  import {DemoThread as Demo} from "./demo/DemoThread";

//  import {DemoThreadSchedule as Demo} from "./demo/DemoThreadSchedule";

//  import {DemoMatComputer as Demo} from "./demo/DemoMatComputer";

//  import {DemoMatTransThread as Demo} from "./demo/DemoMatTransThread";

//  import {DemoThreadConcurrent as Demo} from "./demo/DemoThreadConcurrent";

//  import {DemoToyCarThread as Demo} from "./demo/DemoToyCarThread";

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////   motion    /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

//  import {FixProjMotion as Demo} from "./motionDemo/FixProjMotion";

//  import {DemoMotion as Demo} from "./demo/DemoMotion";

//  physic force simulation
//  import {DemoBase as Demo} from "./voxmotion/DemoBase";

//  import {DemoCameraRoaming as Demo} from "./demo/DemoCameraRoaming";

//  import {DemoCameraMotion as Demo} from "./demo/DemoCameraMotion";

//  import {DemoCameraWalkRoad as Demo} from "./demo/DemoCameraWalkRoad";

// import {DemoCameraPath as Demo} from "./demo/DemoCameraPath";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   morph    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoLineMeshUpdate as Demo} from "./demo/DemoLineMeshUpdate";

//  import {DemoLinePosUpdate as Demo} from "./demo/DemoLinePosUpdate";

//  import {DemoVtxUpdate as Demo} from "./demo/DemoVtxUpdate";

//  import {DemoVtxUpdateFree as Demo} from "./demo/DemoVtxUpdateFree";

//  import {DemoFlexMesh as Demo} from "./demo/DemoFlexMesh";
// free-shaped morph animation
//  import {DemoFlexPipe as Demo} from "./demo/DemoFlexPipe";

//  import {DemoFaceDirec as Demo} from "./demo/DemoFaceDirec";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   transform    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoContainer as Demo} from "./demo/DemoContainer";

//  import {DemoEntityContainer as Demo} from "./demo/DemoEntityContainer";

//  import {DemoEntityContainerRender as Demo} from "./demo/DemoEntityContainerRender";

//  import {DemoEntityContainerRender2 as Demo} from "./demo/DemoEntityContainerRender2";

//  import {DemoContainerToRSpace as Demo} from "./demo/DemoContainerToRSpace";

//  import {DemoContainerToRender as Demo} from "./demo/DemoContainerToRender";

//  import {DemoContainerTransform as Demo}  from "./demo/DemoContainerTransform";

// import {DemoEntityBounds as Demo} from "./demo/DemoEntityBounds";

//  import {DemoTransFromTex as Demo} from "./demo/DemoTransFromTex";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   cgeom    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoOBB as Demo} from "./demo/DemoOBB";

//  import {DemoOBBUICtrl as Demo} from "./demo/DemoOBBUICtrl";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   renderer    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoEmptyRenderer as Demo} from "./demo/DemoEmptyRenderer";

//  import {DemoEmptyRendererScene as Demo} from "./demo/DemoEmptyRendererScene";

//  import {DemoAPlane as Demo} from "./demo/DemoAPlane";

//  import {DemoScene as Demo} from "./demo/DemoScene";

//  import {DemoMouseInteraction as Demo} from "./demo/DemoMouseInteraction";

//  import {DemoReplaceRenderingCanvas as Demo} from "./demo/DemoReplaceRenderingCanvas";

//  import {DemoOffscreenScene as Demo} from "./demo/DemoOffscreenScene";

//  import {DemoSubScene as Demo} from "./demo/DemoSubScene";

//  import {DemoDivControl as Demo} from "./demo/DemoDivControl";

//  import {DemoMultiRendererScene as Demo} from "./demo/DemoMultiRendererScene";

//  import {DemoSimpleSubScene as Demo} from "./demo/DemoSimpleSubScene";

//  import {DemoRendererSceneGraph as Demo} from "./demo/DemoRendererSceneGraph";

//  import {DemoMultiRendererScene2 as Demo} from "./demo/DemoMultiRendererScene2";

//  import {DemoMultiGpuContext as Demo} from "./demo/DemoMultiGpuContext";

//  import {DemoMultiRenderer as Demo} from "./demo/DemoMultiRenderer";

//  import {DemoEngine as Demo} from "./demo/DemoEngine";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   maps    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoNormalMap as Demo} from "./demo/DemoNormalMap";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     mesh    /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoSharedVBuf as Demo} from "./demo/DemoSharedVBuf";

//  import {DemoSharedMesh as Demo} from "./demo/DemoSharedMesh";

//  import {DemoIVtxBuf as Demo} from "./demo/DemoIVtxBuf";

//  import {DemoMeshWrapper as Demo} from "./demo/DemoMeshWrapper";

//  import {DemoMultipleIVS as Demo} from "./demo/DemoMultipleIVS";

//  import {DemoDataMesh as Demo} from "./demo/DemoDataMesh";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     material    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoMaterial as Demo} from "./demo/DemoMaterial";

//  import {DemoShaderCodeMaterial as Demo} from "./demo/DemoShaderCodeMaterial";

//  import {DemoMaterialGraph as Demo} from "./demo/DemoMaterialGraph";

//  import {DemoVtxDrawingInfo as Demo} from "./demo/DemoVtxDrawingInfo";

//  import {DemoVtxMultiRDP as Demo} from "./demo/DemoVtxMultiRDP";

//  import {DemoMaterialGraphTest as Demo} from "./demo/DemoMaterialGraphTest";

//  import {DemoGraphTransparent as Demo} from "./demo/DemoGraphTransparent";

//  import {DemoGraphTwoMaterial as Demo} from "./demo/DemoGraphTwoMaterial";

//  import {DemoGraphStencil as Demo} from "./demo/DemoGraphStencil";

//  import {DemoStencil as Demo} from "./demo/DemoStencil";

//  import {DemoGLState as Demo} from "./demo/DemoGLState";

// import {DemoFaceTest as Demo} from "./demo/DemoFaceTest";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     event    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoMobileEvt as Demo} from "./demo/DemoMobileEvt";

//  import {DemoMouseDrag as Demo} from "./demo/DemoMouseDrag";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     effect    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoChangeColor as Demo} from "./demo/DemoChangeColor";

//  The reflection in water
//  import {DemoMirrorPlane as Demo} from "./demo/DemoMirrorPlane";

//  import {DemoOutline as Demo} from "./demo/DemoOutline";

//  import {DemoOutline2 as Demo} from "./demo/DemoOutline2";

//  import {DemoFix3DSize as Demo} from "./demo/DemoFix3DSize";

//  import {EffectExample as Demo} from "./renderingtoy/effectTest/example/EffectExample";

//  import {EffectExample as Demo} from "./renderingtoy/effectTest/modelLoad/EffectExample";

//  import {EffectExample as Demo} from "./renderingtoy/effectTest/applyui/EffectExample";

//  import {ModelsLoading as Demo} from "./renderingtoy/effectTest/ModelsLoading";

//  import {ModelDataDownload as Demo} from "./renderingtoy/effectTest/ModelDataDownload";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     shadow    ///////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoBase as Demo} from "./shadow/vsm/DemoBase";

//  import {DemoVSMModule as Demo} from "./shadow/vsm/DemoVSMModule";

//  import {DemoSSAO as Demo} from "./shadow/ssao/DemoSSAO";

//  import {DemoSSAO2 as Demo} from "./shadow/ssao/DemoSSAO2";

//  import {DemoSSAO3 as Demo} from "./shadow/ssao/DemoSSAO3";

//  import {DemoSSAO4 as Demo} from "./shadow/ssao/DemoSSAO4";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     light    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoLambertLight as Demo} from "./demo/DemoLambertLight";

// import {DemoMaterialCtx as Demo} from "./demo/DemoMaterialCtx";

//  import {DemoMultiLambertLights as Demo} from "./demo/DemoMultiLambertLights";

//  import {DemoCookTorrance as Demo} from "./demo/DemoCookTorrance";

//  import {DemoTextureCubeUV as Demo} from "./pbr/DemoTextureCubeUV";

//  import {DemoLighting as Demo} from "./pbr/DemoLighting";

//  import {DemoEnvLighting as Demo} from "./pbr/DemoEnvLighting";

//  import {DemoPBREnvLighting as Demo} from "./pbr/DemoPBREnvLighting";

//  import {DemoPBRAnimation as Demo} from "./pbr/DemoPBRAnimation";

//  import {DemoPBRTextureShader as Demo} from "./demo/DemoPBRTextureShader";

//  import {DemoPBR as Demo} from "./pbr/DemoPBR";

//  import {DemoPBRViewer as Demo} from "./pbr/DemoPBRViewer";

//  import {DemoPBRViewer2 as Demo} from "./pbr/DemoPBRViewer2";

//  import {DemoPBRViewer3 as Demo} from "./pbr/DemoPBRViewer3";

//  import {DemoPBRTexViewer as Demo} from "./pbr/DemoPBRTexViewer";

//  import {DemoPBRDisplacement as Demo} from "./pbr/DemoPBRDisplacement";

//  import {DemoRawDracoViewer as Demo} from "./pbr/DemoRawDracoViewer";

//  import {DemoCTMLoad as Demo} from "./pbr/DemoCTMLoad";

///////////////////////////////////////////////////////////////////////////////
////////////////////////////   terrain    /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {HeightMapTerrain as Demo} from "./terrain/HeightMapTerrain";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////     APP    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import * as LegRole from "./app/LegRole";
//  import Demo = LegRole.app.LegRole;

//  import * as BoFrame from "./app/BoFrame";
//  import Demo = BoFrame.app.BoFrame;

//  import {DemoBoxGroupTrack as Demo} from "./demo/DemoBoxGroupTrack";

//  import {RbtDrama as Demo} from "./app/RbtDrama";

// import {SlickRoad as Demo} from "./app/SlickRoad";

//  import {SlickRoadViewer as Demo} from "./app/SlickRoadViewer";

//  import {DemoDraco as Demo} from "./demo/DemoDraco";

//  import {DensityStatistics as Demo} from "./app/density/DensityStatistics";

///////////////////////////////////////////////////////////////////////////////
/////////////////////////////     gltf    /////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoGLTF as Demo} from "./gltf/DemoGLTF";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////     UI     ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoFontText as Demo} from "./demo/DemoFontText";

//  import {DemoOrthoBtn as Demo} from "./orthoui/demos/DemoOrthoBtn";

//  import {DemoOrthoPanel as Demo} from "./orthoui/demos/DemoOrthoPanel";

// import {DemoCanvasTexAtlas as Demo} from "./orthoui/demos/DemoCanvasTexAtlas";

// import {DemoUITexAtlas as Demo} from "./orthoui/demos/DemoUITexAtlas";

//  import {DemoParamCtrlUI as Demo} from "./orthoui/demos/DemoParamCtrlUI";

///////////////////////////////////////////////////////////////////////////////
//////////////////////////////     rapp    ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

//  import {BakeExample as Demo} from "./bake/demo/bakeDiffuse/BakeExample";
//  import {BakeExample as Demo} from "./bake/demo/bakeDiffuse2/BakeExample";
//  import {BakeExample as Demo} from "./bake/demo/bakePbr/BakeExample";
//  import {BakePBR as Demo} from "./bake/demo/bakePbr/BakePBR";
//  import {BakeFlow as Demo} from "./bake/demo/bakePbr/BakeFlow";
 import {BakeFlow2 as Demo} from "./bake/demo/bakePbr/BakeFlow2";
//  import {BakedModel as Demo} from "./bake/demo/bakePbr/BakedModel";
//  import {BakedModelViewerTest as Demo} from "./bake/demo/bakePbr/BakedModelViewerTest";
//  import {BakedModelViewerTest2 as Demo} from "./bake/demo/bakePbr/BakedModelViewerTest2";
//  import {BakedNormal as Demo} from "./bake/demo/bakePbr/BakedNormal";

///////////////////////////////////////////////////////////////////////////////
///////////////////////     distributed runtime     ////////////s//////////////
///////////////////////////////////////////////////////////////////////////////

//  import {DemoBase as Demo} from "./distribution/DemoBase";
//  import {DemoUIManager as Demo} from "./distribution/DemoUIManager";
//  import {BaseRenderer as Demo} from "./distribution/rendererIsolate/BaseRenderer";

//  import {DemoRendererIsolate as Demo} from "./distribution/DemoRendererIsolate";
//  import {ROFunctions as Demo} from "./distribution/rendererIsolate/ROFunctions";
//  import {PlayerOne as Demo} from "./distribution/rendererIsolate/PlayerOne";

///////////////////////////////////////////////////////////////////////////////
///*
document.title = "Vox APP";
//document.title = "Rendering & Art";
let ins = new Demo() as any;
if (ins.runBegin != undefined) {
    function main1(): void {
        console.log("------ demo --- init ------");
        ins.initialize();
        function mainLoop(now: any): void {
            ins.runBegin();
            ins.run();
            ins.runEnd();
            window.requestAnimationFrame(mainLoop);
        }
        window.requestAnimationFrame(mainLoop);
        console.log("------ demo --- running ------");
    }
    //
    main1();
}
else {
    function main2(): void {
        console.log("------ demo --- init ------");
        ins.initialize();
        if(ins.run != undefined) {
            let runFunc = ins.run.bind(ins);
            function mainLoop(now: any): void {
                runFunc();
                window.requestAnimationFrame(mainLoop);
            }
            window.requestAnimationFrame(mainLoop);
        }
        console.log("------ demo --- running ------");
    }
    //
    main2();
}
//*/

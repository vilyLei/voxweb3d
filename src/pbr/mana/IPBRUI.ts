import ProgressBar from "../../orthoui/demos/base/ProgressBar";
import SelectionBar from "../../orthoui/demos/base/SelectionBar";
import RGBColorPanel from "../../orthoui/panel/RGBColorPanel";
import IPBRParamEntity from "./IPBRParamEntity";


export default interface IPBRUI
{
    rgbPanel: RGBColorPanel;
    metalBtn: ProgressBar;
    roughBtn: ProgressBar;
    noiseBtn: ProgressBar;
    reflectionBtn: ProgressBar;
    sideBtn: ProgressBar;
    surfaceBtn: ProgressBar;
    scatterBtn: ProgressBar;
    toneBtn: ProgressBar;
    f0ColorBtn: ProgressBar;
    albedoBtn: ProgressBar;
    ambientBtn: ProgressBar;
    specularBtn: ProgressBar;
    
    absorbBtn: SelectionBar;
    vtxNoiseBtn: SelectionBar;

    setParamEntity(param: IPBRParamEntity): void
}
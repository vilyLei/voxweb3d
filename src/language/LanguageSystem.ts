

class LanguageSystem {
    static readonly zh_CN = "zh-CN";
    static readonly en_US = "en-US";
    private static s_current = "zh-CN";
    constructor() { }

    static IsChinese(): boolean {
        return LanguageSystem.s_current == LanguageSystem.zh_CN;
    }
    static IsEnglish(): boolean {
        return LanguageSystem.s_current == LanguageSystem.en_US;
    }
    static ApplyChinese(): void {
        LanguageSystem.s_current = LanguageSystem.zh_CN;
    }
    static ApplyEnglish(): void {
        LanguageSystem.s_current = LanguageSystem.en_US;        
    }
}
export {LanguageSystem}
enum ThreadCodeSrcType {
  /**
   * 线程中的js代码模块通过代码字符串构建
   */
  STRING_CODE = 0,
  /**
   * 线程中的js代码模块通过代码blob构建
   */
  BLOB_CODE = 1,
  /**
   * 线程中的js代码模块通过外部js文件构建
   */
  JS_FILE_CODE = 2,
  /**
   * 线程中的js代码模块通过代码模块唯一依赖名构建
   */
  DEPENDENCY = 3
}

export { ThreadCodeSrcType };

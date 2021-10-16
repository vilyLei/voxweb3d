### 2021-10-16
```
应该是设定好一个 材质pipeline 之后，系统就会在当时去准备好一份对应的基础 main body 代码字符串。而后续的材质都是基于这个字符串基本代码块来再次构建实际的material shader
那也就是说，每个pipeline都有他自己的主体基础函数。

蓝图决定了 主体 结构， 而一个构建好的pipeline， 变为属性调节机制。

material 实例，会带私有的 uniform 数据，但是共享的 uniform 数据将由material pipeline 系统自动提供

每个 material pipe 里面有自己的若干 key ，这些key 就可以用于整个构建出来的 material shader 的唯一 key
```

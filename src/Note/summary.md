# 1.HTML

## 1.1 html嵌套另一个html

```html
<iframe frameborder="0" scrolling="no" src="index2.html" width="100%" height="500px"></iframe>
```

# 2.CSS

## 2.1 div旋转

- div旋转，想要自定义旋转中心，bottom，left什么的太死板、不灵活
- 用百分比`tranform-origin：% %；`第一个值为左右偏移量，第二个值为上下偏移量，值越大就越往右、下，不能用分数
- 也可以用px，是相对于div左上角的

## 2.2 [display: grid](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html) 栅格布局

<img src="/assert/note/image/grid.png" alt="示例图" style="zoom:56%;" />

- **主要属性**

	- `grid-template-columns`，竖向排列
	- `grid-template-rows`，横向排列

- 有时候，重复写同样的值非常麻烦，尤其网格很多时。这时，可以使用`repeat()`函数 

	`grid-template-columns: repeat(3, 33.33%);`

- **fr** **关键字**

	为了方便表示比例关系，网格布局提供了**fr**关键字（fraction 的缩写，意为"片段"）。如果两列的宽度分别为`1fr`和`2fr`，就表示后者是前者的两倍。

> 上图的两种不同的布局的代码：
>
> - grid 布局
>
> 	```html
> 	<div class="content">
> 	    <div class="b">1</div>
> 	    <div class="b">2</div>
> 	    <div class="b">3</div>
> 	    <div class="b">4</div>
> 	    <div class="b">5</div>
> 	    <div class="b">6</div>
> 	    <div class="b">7</div>
> 	    <div class="b">8</div>
> 	    <div class="b">9</div>
> 	</div>
> 	```
>
> 	```css
> 	.content {
> 	    padding: 10;
> 	    display: grid;
> 	    grid-template-columns: auto auto auto;
> 	    grid-template-rows: auto auto auto;
> 	    height: 780px; /*padding有个20的宽度*/
> 	    background-color: #000;
> 	    grid-gap: 10px;
> 	}
> 	.b {
> 	    background-color: yellow;
> 	}
> 	```
>
> - flex 布局
>
> 	```html
> 	<div class="box">
> 	    <div class="content">
> 	        <div class="b">1</div>
> 	        <div class="b">2</div>
> 	        <div class="b">3</div>
> 	    </div>
> 	    <div class="content">
> 	        <div class="b">4</div>
> 	        <div class="b">5</div>
> 	        <div class="b">6</div>
> 	    </div>
> 	    <div class="content">
> 	        <div class="b">7</div>
> 	        <div class="b">8</div>
> 	        <div class="b">9</div>
> 	    </div>
> 	</div>
> 	```
>
> 	```css
> 	.box {
> 	    padding: 10px 0 0 10px;
> 	    display: flex;
> 	    flex-direction: column;
> 	    height: 800px;
> 	    width: calc(100vw - 20px);
> 	    background-color: #000;
> 	}
> 	.content {
> 	    display: flex;
> 	    margin-bottom: 10px;
> 	    flex: 1;
> 	}
> 	.b {
> 	    flex: 1;
> 	    margin-right: 10px;
> 	    background-color: yellow;
> 	}
> 	```
>
> 	

## 2.3 footer实现

<img src="/assert/note/image/footer.png" alt="img" style="zoom: 100%">

- 内容不足时，footer位于页面最底部

- 内容充足时，footer位于内容最底部

```css
body {
    display: flex;
    flex-direction: column;
 	/* margin: 0; */
    /* height: 100%; */
    /* height: 100vh; */
}
content {
    flex: 1 0 auto;
}
footer {
    flex: 0 0 auto;
}
```

## 2.4 [clip-path](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clip-path)

`clip-path` CSS属性使用裁剪方式创建元素的可显示区域。区域内的部分显示，区域外的隐藏。

语法 ：

```css
/* Keyword values */
clip-path: none;

/* <clip-source> values */ 
clip-path: url(resources.svg#c1);

/* <geometry-box> values */
clip-path: margin-box;
clip-path: border-box;
clip-path: padding-box;
clip-path: content-box;
clip-path: fill-box;
clip-path: stroke-box;
clip-path: view-box;

/* <basic-shape> values */
clip-path: inset(100px 50px);
clip-path: circle(50px at 0 100px);
clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 
    50%);
clip-path: path('M0.5,1 C0.5,1,0,0.7,0,0.3 A0.25,0.25,1,1,1,
    0.5,0.3 A0.25,0.25,1,1,1,1,0.3 C1,0.7,0.5,1,0.5,1 Z');

/* Box and shape values combined */
clip-path: padding-box circle(50px at 0 100px);

/* Global values */
clip-path: inherit;
clip-path: initial; 
clip-path: unset;  
```





# 3.Js

## 3.1 定义二维数组

```js
var k = []
for(var i = 0; i < 10; i++){
        k[i] = [] //这里也要再定义一下，不需要再用var
        for(var j = 0; j < 10; j++){

        }
}

```

## 3.2 解构赋值

`const {res: data} = Obj`，直接获取`Obj`中的`res`属性，并赋值命名为`data`，以后使用变量时直接用`data`

## 3.3 对象的拷贝

<img src="/assert/note/image/copy_obj.png" alt="img" style="zoom: 55%">

- 向一个变量传入一个state值，然后改变这个变量，state的值居然也会改变

	原因：**浅拷贝**

- 解决方法：`JSON.parse(JSON.stringify(……))`

## 3.4 构建2维数组

```js
Array.from(Array(row), () => Array)Array.from(Array(row), () => 
	Array.form(Array(column), () => value/obj))
```

但这样执行效率会有些降低，最好还是for初始化



-   
    ```js
    Array.fill(value, start, end)
    ```
    
- `Array.fill()`方法可以替换或填充数组里的值。
	参数value为替换值，不可缺省。
	start表示开始替换的位置。
	end表示替换结束的位置。
	如果只有value，则默认替换全部值。

- 如果value值为一个引用数据类型，则fill之后，数组里面的值指向的是同一个地址。如果改变了其中一个，则其它的都会改变：

	```js
	var arr = new Array(3).fill(new Array(3).fill(0))
	arr[1][2] = 2
	// 输出结果为 [[0, 2, 0], [0, 2, 0], [0, 2, 0]]
	```


## 3.5 一次插入多个style样式

- cssText

```js
var m=document.getElementsById(); 
m.style.cssText='color:green; background:cyan; width:300px; text-align:center;' 
```

- 控制多个过渡效果

```js
m.style.transition='opacity 1s ease-in,background 1s ease-in' 
```

- className实现效果

```js
m.className = "set"
```

```css
.set{
  color:green;
  text-align:center;
  background: cyan;
  width:300px;
}
```

## 3.6 Array [some()](https://www.runoob.com/jsref/jsref-some.html ) 方法 

some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。

some() 方法会依次执行数组的每个元素：

- 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。
- 如果没有满足条件的元素，则返回false。

注意： some() 不会对空数组进行检测。

注意： some() 不会改变原始数组。

## 3.7 [includes](https://www.runoob.com/jsref/jsref-string-includes.html)方法

includes() 方法用于判断字符串是否包含指定的子字符串。

如果找到匹配的字符串则返回 true，否则返回 false。

注意： includes() 方法区分大小写。

字符串数组也可以用，如：

```js
var a = ['a', 'b', 'count']
a.includes('count') // true
```

语法

```js
string.includes(searchvalue, start)
```

参数值参数描述

- searchvalue 必需，要查找的字符串。

- start 可选，设置从那个位置开始查找，默认为0。 

## 3.8 [ClipboardEvent.clipboardData](https://developer.mozilla.org/zh-CN/docs/Web/API/ClipboardEvent/clipboardData)

`ClipboardEvent.clipboardData` 属性保存了一个 `DataTransfer`对象，这个对象可用于：

- 描述哪些数据可以由 `cut` 和 `copy` 事件处理器放入剪切板，通常通过调用 `setData(format, data)` 方法；
- 获取由 `paste` 事件处理器拷贝进剪切板的数据，通常通过调用 `getData(format)`方法

## 3.9 [event.preventDefault](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault  )

`Event` 接口的 `preventDefault()`方法，告诉user agent：如果此事件没有被显式处理，它默认的动作也不应该照常执行。此事件还是继续传播，除非碰到事件侦听器调用`stopPropagation()` 或`stopImmediatePropagation()`，才停止传播 

阻止默认的点击事件执行 

在编辑域中阻止按键 

- `preventDefault` 阻止事件的默认行为
- `stopPropagation` 阻止冒泡

## 3.10 js中获取子节点集合中第一个节点是`text`

- 在DOM中实际上有一个叫做 textNode 的元素，相应的还有 document.createTextNode 的 JS 方法，而在 IE 和 Chrome 浏览器中会将源代码中的换行符渲染成一个 textNode，只是视觉上不可见。
- 然而，通过 childNodes 来获取子元素的时候，结果会包含这些 textNode 。
- 解决方法很简单，主要有两种：
	- 第一，使用 children 代替 childNodes
	- 第二，遍历 childNodes，根据 nodeType 过滤掉 textNode

## 3.11 Promise异步请求

有的代码得等到另外某些代码或过程弄完才开始执行（提前执行会报错或无效之类的），这时就可以用到`promise`

比如图片的加载事件，js 中 `image = new Image()` 后并不能马上就能用到这个image，得加载完后才能用到。

一般是 

```js
image.onload = function() {
    // 要执行的代码
}
image.addEventListener('load', function(){
    // 要执行的代码
})
```

也可以用 `promise`，`promise` 被创建的时候就会调用一次，后面执行到时会调用 resolve / reject

```js
let promise = new Promise((resolve, reject) => {
	image.onload = function(){
		resolve(arg1)
	}
    if(true) reject(arg2) // 这行随便写的，只是为了说明能用reject
})
promise.then((arg1) => {
	// 要执行的代码，resolve
}).catch((arg2) => {
    // 出问题后执行的代码，reject
})
```

但看这个的话好像有点鸡肋，但 `promise` 一般常见于发送网络请求的，而且可以管理多个请求

```js
let imageArr = [image1, image2, image3], promiseArr = []
imageArr.forEach(item => {
    promiseArr.push(
    	new Promise((resolve, reject) => {
            item.onload = function(){
                resolve()
            }
        })
    )
})
Promise.all(promiseArr).then(() => {
    // 所有promise都resolve了，就执行的代码
})
```

- `Promise.all(Array)` ，Array 中的所有请求都成功了，就执行，只执行一遍，比如页面加载时，所有图片都加载出来了才执行的代码 （Creates a Promise that is resolved with an array of results when all of the provided Promises resolve, or rejected when any Promise is rejected.）
- `Promise.race(Array)`， Array中只要有一个请求成功或失败了，就执行，一遍 (Creates a Promise that is resolved or rejected when any of the provided Promises are resolved or rejected.)

# 4.Nodejs

## 4.1 axios错误处理

- 一般服务器响应请求时，会发送一个状态码（code1），同时返回的数据里也会有一个状态码（code2）
- 当 code1 不是 `200` 时，只能通过 catch 或者 axios 的响应拦截器处理
- 当用 `async,await` 组合时，就不能 catch 了，但响应拦截器又不灵活，可以 code 一直全都返回 `200` ，然后根据返回的数据中的 code2 来进行错误处理

## 4.2 富文本编辑器

- [wangEditor](https://www.wangeditor.com/index.html)

	- 1. 国内的
		2. 简洁美观
		3. 及时更新（其他搜了几个都只支持 16 版本的 react，17 版本的用不了）

- ```shell
	npm install wangeditor-for-react
	```

	啊，大意了，居然还有这玩意

# 5.Webpack

## 5.1 styled-components

> **什么是** **styled-components**
>
> - styled-components 是react的一个第三方库，一种css私有化的方式。用来实现**CSS in JS** 的方式之一。
>
> - 在多人协作中，css必定会出现命名冲突，与vue的scoped解决方案不同，react用styled-components的给类名加了随机字符的方式实现了css的私有化。
>
> **为什么要用** **styled-components**
>
> 1. 性能好
> 2. 彻底解耦components与css文件，**All in** **js**！
> 3. 更好的实现了React的组件化思想
> 4. 样式可以使用变量、继承，使用起来更自由，更灵活
> - 缺点：麻烦，增加学习成本（个人觉得成本其实也不大），没有css代码提示（vscode可以安装 `vscode-styled-components` 插件）

```js
import styled from 'styled-components'

export const StyleButteryHatch t = styled.div`
    width: ${props => props.width};
`
```

```html
<StyleButteryHatch width={} height={}>
        
</StyleButteryHatch>

```

## 5.2 配置Babel

- npm i @babel/core babel-loader @babel/plugin-transform-runtime –D

- npm I @babel/preset-env @babel/preset-stage-0 –D

- npm i @babel/preset-react –D

**webpack.config.js：**

```js
module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        }
    ]
},

```

**.babelrc：**

```json
{
    "presets": [
        "@babel/preset-env", "@babel/preset-react"
    ],
    "plugins": [
        "@babel/plugin-transform-runtimea"
    ]
}

```




# 6.React

## 6.1 引用本地图片

- React 引用本地图片

- `<img src='../image/1.jpg'/>`在react中用不了

- 要用 **import** 或 **require** 

- 但图片路径在 json 中时，也没用，这样写：

	```js
	const img = require(‘../image/’ + this.props.……);
	<img src={img}/>
	```

- 或者直接导入public里面的图片

	```js
    const img = ‘image/’ + this.props.……;
    <img src={img}/>
	```

## 6.2 监听，修改state而不一直循环

```js
newnum = () => {
    if (this.props.Block)
        this.setState({
            num: Math.floor(Math.random() * 7)
        })
}

```

- 要使这样的函数一直处于监听状态，放在didmount只会刚开始时执行一次，放在receiveprops，willupdate，didupdate，render，则会一直循环下去，所以要加一个条件，一旦执行完函数，马上把条件即this.props.Block改为false

## 6.3 使用less

> `create-react-app`使用`less`
>
> - `npm install less less-loader -D`，下载时记得对应版本（4.4.2 版本的 webpack 建议用 7.0.0 版本的 less-loader ）
>
> - ```
> 	npm run eject
> 	或 
> 	git add .
> 	git commit -m '暴露'
> 	npm run eject
> 	```



```js
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
```

- 下面2个记得看 webpack.config.js 的注释，要放在 file-loader 之前

```js
{
    test: lessRegex,
    exclude: lessModuleRegex,
    use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction
        	? shouleUseSourceMap
        	: isEnvDevelopment,
    },
    'less-loader'
    ),
    sideEffects: true,
},  
{
    test: lessModuleRegex,
    use: getStyleLoaders({
        importLoaders: 1,
        sourceMap: isEnvProduction
        	? shouleUseSourceMap
        	: isEnvDevelopment,
        modules: {
            getLocalIdent: getCSSModuleLocalIdent,
        }
    },
    'less-loader'
    ),
}
```



<img src="/assert/note/image/Appless.png" alt="img" style="zoom: 56%">

- 引用 App.less 失败

- 找到`getStyleLoaders`函数，做以下修改

	```js
	const getStyleLoaders = (cssOptions, preProcessor) => {
	    const loaders = ...
	    const lessOptions = {
	        javascriptEnabled: true
	    }
	    if (preProcessor) {
	        ...
	        {
	          loader: require.resolve(preProcessor),
	          options: {
	            sourceMap: true,
	            lessOptions
	          },
	        }
	    ...
	}
	```

## 6.4 Hooks的capture特性

> [精读《Function VS Class 组件》](https://segmentfault.com/a/1190000018549675)
>
> 原文：[How Are Function Components Different from Classes?](https://overreacted.io/how-are-function-components-different-from-classes/)

> [精读《useEffect 完全指南》](https://segmentfault.com/a/1190000018639033)
>
> 原文：[A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)

- 函数组件每次 Render 都有自己的 Props 与 State，都有自己的事件处理和 Effects

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>      
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

```jsx
// During first render
function Counter() {
  const count = 0; // Returned by useState()  // ...
  <p>You clicked {count} times</p>
  // ...
}

// After a click, our function is called again
function Counter() {
  const count = 1; // Returned by useState()  // ...
  <p>You clicked {count} times</p>
  // ...
}

// After another click, our function is called again
function Counter() {
  const count = 2; // Returned by useState()  // ...
  <p>You clicked {count} times</p>
  // ...
}
```

# 7.Vue

# 8.Go

## 8.1 切片append时容量的增长

- **Go**语言对切片的操作
- `a := []int{0,1,2,3,4,5, 6}` ，这样内容为多少容量就为多少
- `s =append(s, i)` ，这样容量会成指数级增长1 2 4 4 8 8 8 8 16……
- `s = append(s,2,3,4,5,6,7,8)` ，不过这种一次加很多个的话，容量应该是2个2个的增，不过至少为原来s容量的两倍，两倍之后才是两个两个的增

## 8.2 gin框架的日志输出乱码，无颜色

- windows下使用gin框架，默认日志输出的时候，总是会有乱码，是颜色代码

```go
import (
	"github.com/gin-gonic/gin"
	"github.com/mattn/go-colorable" // 改包可完美解决问题
)

func main() {
	// 启用gin的日志输出带颜色
	gin.ForceConsoleColor()
	// 替换默认Writer（关键步骤）
	gin.DefaultWriter = colorable.NewColorableStdout()

	r := gin.Default()
	r.GET("/ping", func(c *gin.Context) {
		c.String(200, "Hello World")
	})

	router.Run(":8080")
}
```

## 8.3 omitempty tag

- omitempty作用是在`json`数据结构转换时，当该字段的值为该字段类型的零值时，忽略该字段。

## 8.4 air实现热重启

- 执行命令`go get -u https://github.com/cosmtrek/air`
- `air init`初始化一个`.air.toml`文件（注意路径格式，不然可能不能正确关闭重启前的服务）

- 或者项目根目录下创建文件`.air.conf`（注意路径格式，不然可能不能正确关闭重启前的服务）

	```
	# [Air](https://github.com/cosmtrek/air) TOML 格式的配置文件
	
	# 工作目录
	# 使用 . 或绝对路径，请注意 `tmp_dir` 目录必须在 `root` 目录下
	root = "."
	tmp_dir = "tmp"
	
	[build]
	# 只需要写你平常编译使用的shell命令。你也可以使用 `make`
	# Windows平台示例: cmd = "go build -o tmp\main.exe ."
	cmd = "go build -o tmp\main.exe"
	
	# 由`cmd`命令得到的二进制文件名
	# Windows平台示例：bin = "tmp\main.exe"
	bin = "tmp\main.exe"
	
	# 自定义执行程序的命令，可以添加额外的编译标识例如添加 GIN_MODE=release
	# Windows平台示例：full_bin = "tmp\main.exe"
	full_bin = "\tmp\main.exe"
	
	# 监听以下文件扩展名的文件.
	include_ext = ["go", "tpl", "tmpl", "html", "yaml"]
	
	# 忽略这些文件扩展名或目录
	exclude_dir = ["assets", "tmp", "vendor", "frontend/node_modules"]
	
	# 监听以下指定目录的文件
	include_dir = []
	
	# 排除以下文件
	exclude_file = []
	
	# 如果文件更改过于频繁，则没有必要在每次更改时都触发构建。可以设置触发构建的延迟时间
	delay = 2000 # ms
	
	# 发生构建错误时，停止运行旧的二进制文件。
	stop_on_error = true
	
	# air的日志文件名，该日志文件放置在你的`tmp_dir`中
	log = "air_errors.log"
	
	[log]
	# 显示日志时间
	time = true
	
	[color]
	# 自定义每个部分显示的颜色。如果找不到颜色，使用原始的应用程序日志。
	main = "magenta"
	watcher = "cyan"
	build = "yellow"
	runner = "green"
	
	[misc]
	# 退出时删除tmp目录
	clean_on_exit = true
	```


## 8.5 int64传值问题

- int64范围为`-1<<63-1 ~ 1<<63-1`，但前端number类型支持的范围为`-1<<53-1 ~ 1<<53-1`，这会造成数据传输时数据失真
- 后端改进一下，把int64转为string类型再发送
	1. 修改json.Marshal和json.Unmarshal
	2. 或者在结构体的int64成员后加个`` `json:"string"` ``的tag

## 8.6 截取中文字符串

- 在 Golang 中，每个中文字，占3个byte。英文字符仍是占一个byte。所以直接通过切片可能会把一个中文字的编码截成两半，结果导致最后一个字符是乱码。
- 解决办法：先将其转为[]rune，再截取后，转回string

```go
name := "我是胡八一"
fmt.Println("name[:4] = ",name[:4])
// name[:4] =  我?
```

```go
nameRune := []rune(name)
fmt.Println("string(nameRune[:4]) = ",string(nameRune[:4]))
// string(nameRune[:4]) =  我是胡八
```

# 9.Mysql

## 9.1 反转义

- Mysql复制粘贴时，中文双引号会变成英文的
- `\\`反转义

## 9.2 数据导入和导出

> **sql**文件
>
> - [cmd] `mysqldump -u dbuser -p dbname > D:\dbname.sql`，导出数据库，dbuser：用户，dbname：数据库名称，dbname.sql导出的文件的名称
> - [cmd] `mysqldump -u dbuser -p dbname tablename> D:\dbname_tablename.sql`，导出表
> - [cmd] `mysqldump -u dbuser -p -d --add-drop-table dbname >d:/dbname_db.sql`，导出一个数据结构，-d 没有数据
> - [mysql] `source d:/dbname.sql; `，导入数据库

> **ibd**文件
>
> 1. `create table tablename(...); 	`，创建表，表的结构和要导入的表的一样
>
> 2. `alter table tablename discard tablespace;`，删除新建的表空间
> 3. 把要恢复的ibd文件copy到目标数据库文件夹下
> 4. `alter table tablename import tablespace;`，导入表空间

# 10.Python



# 11.命令

```powershell
git clone ...								# 下拉项目代码
git remote add origin https/ssh 			# 与远程仓库建立联系
git remote -v 								# 查看远程仓库地址
git checkout ...							# 切换到……分支
git checkout -b ...							# 新建...分支并切换到该分支
git status									# 查看状态
git add .									# 将本地修改的代码添加到暂存区
git commit -m "message"						# 将暂存区内容保存到本地仓库
git log 									# 查看提交记录，q退出
git push -u origin ...						# 新建...仓库，将……分支提交到仓库
git push									# 提交到仓库
git restore [path]  						# 恢复原来的状态
git merge	 ...							# 从...分支拷贝代码过来
```



```powershell
npm view webpack versions
npx create-react-app my-app

serve -s build
```



```js
/** @type {HTMLCanvasElement} */ 
```



```sql
# sql
[cmd] mysqldump -u dbuser -p dbname > dbname.sql
[cmd] mysqldump -u dbuser -p dbname tablename> dbname_tablename.sql
[cmd] mysqldump -u dbuser -p -d --add-drop-table dbname >d:/dbname_db.sql # 导出一个数据结构，-d 没有数据
source d:/dbname.sql; 	#导入数据库

#ibd
create table tablename(...); 		#表的结构要一样
alter table tablename discard tablespace;
alter table tablename import tablespace;
```



```powershell
ffmpeg -allowed_extensions ALL -i "C:\streamingtest.m3u8" -c copy "test.ts"
```



```powershell
netstat -ano | findstr "8080"	# 找8080端口对应的进程
tasklist					# 查询当前的进程
taskkill -f /pid ...			# 根据pid杀掉进程
```



# 12.算法

## 12.1 RMQ问题，ST算法

-  RMQ(Range Minimum/Maximum Query)问题是求区间最值问题。
- 当然可以写个O(n)的，但是万一要询问最值1000000遍，估计你就要挂了。
- ST算法，可以做到O(nlogn)的预处理，O(1)地回答每个询问。
	- 首先是预处理，用一个DP解决。设 a[] 是要求区间最值的数列，**f[i,j] 表示从第i个数起连续 2^j 个数中的最大值**。例如数列 3 2 4 5 6 8 1 2 9 7 ，f[1, 0] 表示第 1 个数起，长度为 2^0=1 的最大值，其实就是 3 这个数。f[1, 2]=5，f[1, 3]=8，f[2 ,0]=2，f[2, 1]=4……从这里可以看出 f[i, 0] 其实就等于 a[i]。这样，DP的状态、初值都已经有了，剩下的就是状态转移方程。我们把 f[i, j] 平均分成两段（因为 f[i, j] 一定是偶数个数字），从 i 到 i+2^(j-1)-1 为一段，i+2^(j-1) 到 i+2^j-1 为一段，长度都为 2^(j-1) 。用上例说明，当 i=1，j=3 时就是 3,2,4,5  和 6,8,1,2 这两段。f[i, j] 就是这两段的最大值中的最大值。于是我们得到了动规方程 **F[i, j]=max(F[i, j-1], F[i+2^(j-1), j-1])** .
	- 查询：如在上例中我们要求区间 [2, 8] 的最大值，就要把它分成 [2, 5] 和 [5, 8] 两个区间，因为这两个区间的最大值我们可以直接由 f[2, 2] 和 f[5, 2] 得到。扩展到一般情况，就是把区间 [l, r] 分成两个长度为 2^k 的区间（保证有 f[i, j] 对应）。

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#define MAX 500001 // 待求值数组的长度


int max(int a, int b){
    return a > b ? a : b;
}
int lg2(int n){ // 不能命名为log2，只能命名为lg2了
    return (int)(log((double)n) / log(2.0));
}

int arr[MAX]; // 待求值的数组
int mx[MAX][16]; // f[i, j]，求最大的，取16是保证2^16>MAX，此处不能用变量
int n, q; // n：数组里放多少个值，q：询问最值多少次

void rmq_init(){ // 初始化的函数
    int i, j, temp;
    int m = lg2(n);
    for(i = 1; i <= n; i++)
        mx[i][0] = arr[i-1]; // 第一列初始化为arr的，从1开始保证与公式匹配
    for(i = 1; i <= m; i++){
        for(j = 1; j <= n; j++){ // 一列一列的赋值
            temp = j + (1<<(i-1)); // 必须得加括号
            if(temp <= n) { // 如果temp<=n
                mx[j][i] = max(mx[j][i-1], mx[temp][i-1]); // 套公式
            } // 大于时不做处理，因为查找时不会查找的到
        }
    }
    // 至此 mx[i][j] 就是第从i个数起，连续2^j个数中的最大值了
}

int rmq(int left, int right){ // 查找的函数
    int m = lg2(right - left + 1);
    // 从left开始的2^m元素，和以right结尾的2^m个元素
    int a = max(mx[left][m], mx[right - (1<<m) + 1][m]); // (1<<m)，必须得加括号
    return a;
}


int main()
{
    int i, result;
    scanf("%d %d", &n, &q);
    int scout[q][2];
    for(i = 0; i < n; i++){
        scanf("%d", &arr[i]);
    }
    rmq_init(); // 待求值数组初始化完毕就开始rmq_init
    for(i = 0; i < q; i++){ // 开始录入区间的端点
        scanf("%d %d", &scout[i][0], &scout[i][1]);
    }

    for(i = 0; i < q; i++){
        result = rmq(scout[i][0], scout[i][1]);
        printf("%d\n", result);
    }
    return 0;
}
```

要求最小值的话，自己照着模仿就行。





# O_O.Others

## O.1 禁止访问图片

- 直接访问图片网址可以访问到，但用react时，导入json数据中的网址再访问，出现403

- 豆瓣加了防盗链；解决：

	```html
	<meta name="referrer" content="never">
	```

- 从当前页面中发起的请求将不会携带 referrer

- 有时候为了禁止自己的网页发送refer信息，经常会用到这个属性，该属性禁止了header发送页面相关信息，虽然可以阻止一些攻击以及绕过图片防盗链的效果

- 也会造成一定的问题，比如在后台中使用了该标签，会导致js和php的一些跳转出现问题

## O.2 运算符（&、|）

- **按位与运算符（&）**

	参加运算的两个数据，按二进制位进行“与”运算。

	运算规则：`0&0=0; 0&1=0; 1&0=0; 1&1=1;`

- **按位或运算符（|）**

	参加运算的两个对象，按二进制位进行“或”运算。

	运算规则：`0|0=0; 0|1=1; 1|0=1; 1|1=1;`

- 位运算符前后都会运算，逻辑运算符会有短路现象

	对于**true**和**false**，`&`和`&&`，`|`和`||`（判断一样，运算不一定）

	优先级：`~`(按位求反) > `+ -` > `& |` > `&& ||`

- 例子

  ```
  5 | 3  =>  101 | 011 = 111
  5 & 3  =>  101 & 011 = 001
  5 || 3  =  5
  5 && 3  =  3
  ```


## O.3 图片位深度

- chrome扩展图标位深度要是32

## O.4 [内存对齐（转）](https://zhuanlan.zhihu.com/p/30007037)

###  1、什么是内存对齐

​		还是用一个例子带出这个问题，看下面的小程序，理论上，32位系统下，int占4byte，char占一个byte，那么将它们放到一个结构体中应该占4+1=5byte；但是实际上，通过运行程序得到的结果是8 byte，这就是内存对齐所导致的。

```c
//32位系统
#include<stdio.h>
struct{
    int x;
    char y;
}s;

int main()
{
    printf("%d\n",sizeof(s);  // 输出8
    return 0;
}
```

​		现代计算机中内存空间都是按照 byte 划分的，从理论上讲似乎对任何类型的变量的访问可以从任何地址开始，但是实际的计算机系统对基本类型数据在内存中存放的位置有限制，它们会要求这些数据的首地址的值是某个数k（通常它为4或8）的倍数，这就是所谓的内存对齐。

### 2、为什么要进行内存对齐

​		尽管内存是以字节为单位，但是大部分处理器并不是按字节块来存取内存的.它一般会以双字节,四字节,8字节,16字节甚至32字节为单位来存取内存，我们将上述这些存取单位称为内存存取粒度.

​		现在考虑4字节存取粒度的处理器取int类型变量（32位系统），该处理器只能从地址为4的倍数的内存开始读取数据。

​		假如没有内存对齐机制，数据可以任意存放，现在一个int变量存放在从地址1开始的联系四个字节地址中，该处理器去取数据时，要先从0地址开始读取第一个4字节块,剔除不想要的字节（0地址）,然后从地址4开始读取下一个4字节块,同样剔除不要的数据（5，6，7地址）,最后留下的两块数据合并放入寄存器.这需要做很多工作.

<img src="/assert/note/image/ma1.jpg" alt="img" style="zoom: 100%">

​		现在有了内存对齐的，int类型数据只能存放在按照对齐规则的内存中，比如说0地址开始的内存。那么现在该处理器在取数据时一次性就能将数据读出来了，而且不需要做额外的操作，提高了效率。

<img src="/assert/note/image/ma2.jpg" alt="img" style="zoom: 120%">

### 3、内存对齐规则

​		每个特定平台上的编译器都有自己的默认“对齐系数”（也叫对齐模数）。gcc中默认#pragma pack(4)，可以通过预编译命令#pragma pack(n)，n = 1,2,4,8,16来改变这一系数。

有效对其值：是给定值#pragma pack(n)和结构体中最长数据类型长度中较小的那个。有效对齐值也叫**对齐单位**。

了解了上面的概念后，我们现在可以来看看内存对齐需要遵循的规则：

(1) 结构体第一个成员的**偏移量（offset）**为0，以后每个成员相对于结构体首地址的 offset 都是**该成员大小与有效对齐值中较小那个**的整数倍，如有需要编译器会在成员之间加上填充字节。

(3) **结构体的总大小**为 有效对齐值 的**整数倍**，如有需要编译器会在最末一个成员之后加上填充字节。

下面给出几个例子以便于理解：

```c
//32位系统
#include<stdio.h>
struct
{
    int i;    
    char c1;  
    char c2;  
}x1;

struct{
    char c1;  
    int i;    
    char c2;  
}x2;

struct{
    char c1;  
    char c2; 
    int i;    
}x3;

int main()
{
    printf("%d\n",sizeof(x1));  // 输出8
    printf("%d\n",sizeof(x2));  // 输出12
    printf("%d\n",sizeof(x3));  // 输出8
    return 0;
}
```

以上测试都是在Linux环境下进行的，linux下默认`#pragma pack(4)`，且结构体中最长的数据类型为4个字节，所以有效对齐单位为4字节，下面根据上面所说的规则以s2来分析其内存布局：

首先使用规则1，对成员变量进行对齐：

`sizeof(c1) = 1 <= 4`(有效对齐位)，按照1字节对齐，占用第0单元；

`sizeof(i) = 4 <= 4`(有效对齐位)，相对于结构体首地址的偏移要为4的倍数，占用第4，5，6，7单元；

`sizeof(c2) = 1 <= 4`(有效对齐位)，相对于结构体首地址的偏移要为1的倍数，占用第8单元；

然后使用规则2，对结构体整体进行对齐：

s2中变量i占用内存最大占4字节，而有效对齐单位也为4字节，两者较小值就是4字节。因此整体也是按照4字节对齐。由规则1得到s2占9个字节，此处再按照规则2进行整体的4字节对齐，所以整个结构体占用12个字节。

根据上面的分析，不难得出上面例子三个结构体的内存布局如下：

<img src="/assert/note/image/ma3.jpg" alt="img" style="zoom: 95%">

### *#pragma pack(n)*

不同平台上编译器的 pragma pack 默认值不同。而我们可以通过预编译命令#pragma pack(n), n= 1,2,4,8,16来改变对齐系数。

例如，对于上个例子的三个结构体，如果前面加上#pragma pack(1)，那么此时有效对齐值为1字节，此时根据对齐规则，不难看出成员是连续存放的，三个结构体的大小都是6字节。

<img src="/assert/note/image/ma4.jpg" alt="img" style="zoom: 95%">

如果前面加上#pragma pack(2)，有效对齐值为2字节，此时根据对齐规则，三个结构体的大小应为6,8,6。内存分布图如下：

<img src="/assert/note/image/ma5.jpg" alt="img" style="zoom: 95%">

经过上面的实例分析，大家应该对内存对齐有了全面的认识和了解，在以后的编码中定义结构体时需要考虑成员变量定义的先后顺序了。

## O.5 终端显示字体背景和字体颜色

- 先上示例：`console.log(``'\033[42;30m DONE \033[40;32m Compiled successfully in 19987ms\033[0m'``)`

	<img alt="" src="/assert/note/image/consoleColor.png" width="400px">

	

- 关键的代码是类似 `\033[42;30m` 这种格式的


> `printf("\033[1;40;32m color!!! \033[0m hello\n”);`
>
> - `\033` 声明了转义序列的开始，然后是 `[` 开始定义颜色。后面的 `1` 定义了高亮显示字符。然后是背景颜色，这里面是 `40`，表示黑色背景。接着是前景颜色，这里面是 `32`，表示绿色。我们用 `\033[0m` 关闭转义序列， `\033[0m` 是终端默认颜色。
>
> - ```
> 	字色              背景              颜色     
> 	---------------------------------------    
> 	30                40              黑色	  
> 	31                41              紅色
> 	32                42              綠色
> 	33                43              黃色
> 	34                44              藍色
> 	35                45              紫紅色
> 	36                46              青藍色
> 	37                47              白色
> 	```
>
> 	```
> 	0 终端默认设置（黑底白字）
> 	1 高亮显示
> 	4 使用下划线
> 	5 闪烁
> 	7 反白显示
> 	8 不可见
> 	```

- 测试

	```c
	#include<stdio.h>
	#include<unistd.h>
	
	int main (int argc ,char *argv[])
	{
	
	        while(1)
	        {
	        printf("************************* \n");
	        printf("\033[0;30;41m color!!! \033[0m Hello \n");
	        printf("\033[1;30;41m color!!! \033[0m Hello \n");
	        printf("\033[4;30;41m color!!! \033[0m Hello \n");
	        printf("\033[5;30;41m color!!! \033[0m Hello \n");
	        printf("\033[7;30;41m color!!! \033[0m Hello \n");
	        printf("\033[8;30;41m color!!! \033[0m Hello \n");
	
	
	        printf("************************* \n");
	        printf("\033[0;30;41m color!!! \033[0m Hello \n");
	        printf("\033[0;31;41m color!!! \033[0m Hello \n");
	        printf("\033[0;32;41m color!!! \033[0m Hello \n");
	        printf("\033[0;33;41m color!!! \033[0m Hello \n");
	        printf("\033[0;34;41m color!!! \033[0m Hello \n");
	        printf("\033[0;35;41m color!!! \033[0m Hello \n");
	        printf("\033[0;36;41m color!!! \033[0m Hello \n");
	        printf("\033[0;37;41m color!!! \033[0m Hello \n");
	
	        printf("************************* \n");
	        printf("\033[0;30;40m color!!! \033[0m Hello \n");
	        printf("\033[0;30;41m color!!! \033[0m Hello \n");
	        printf("\033[0;30;42m color!!! \033[0m Hello \n");
	        printf("\033[0;30;43m color!!! \033[0m Hello \n");
	        printf("\033[0;30;44m color!!! \033[0m Hello \n");
	        printf("\033[0;30;45m color!!! \033[0m Hello \n");
	        printf("\033[0;30;46m color!!! \033[0m Hello \n");
	        printf("\033[0;30;47m color!!! \033[0m Hello \n");
	
	        sleep(100);
	        }
	        return 0;
	}
	```

	结果：

	<img alt="" src="/assert/note/image/consoleColor2.png" width="450px">

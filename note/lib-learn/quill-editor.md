# Quill编辑器

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuillEditor</title>
    <link href="https://cdn.bootcdn.net/ajax/libs/quill/2.0.0-dev.4/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.bootcdn.net/ajax/libs/quill/2.0.0-dev.4/quill.js"></script>
</head>

<body>
    <div id="toolbar">
        <button class="ql-bold">Bold</button>
        <button class="ql-italic">Italic</button>
    </div>
    <div id="editor">
        <p>Hello World!</p>
    </div>
    <script>
        let editor = new Quill('#editor', {
            modules: {
                toolbar: '#toolbar'
            },
            theme: 'snow'
        })
    </script>
</body>

</html>
```

## 配置

1、container，编辑器的容器，可以传递CSS选择器或DOM对象。

```js
let editor = new Quill('#editor');
//or
let editor2 = new Quill(document.getElementById('#editor'));
```

2、options，为了配置Quill，传递的一个option对象。

```js
let options = {
    debug: 'info',
    modules: {
        toolbar: '#toolbar'
    },
    placeholder: 'input something...',
    readOnly: true,
    theme: 'snow'
}
let editor = new Quill('#editor', options);
```

### options可配置项

1、bounds(默认：document.body)，目前只检测左右边界。

2、debug(默认：warn)，debug是一个静态配置，会影响到其它的Quill实例。

3、formats(默认：All formats)，formats的白名单。

4、modules，模块列表。

5、placeholder，编辑器没有内容时展示的信息。

6、readOnly，是否以只读的模式初始化编辑器。

7、scrollingContainer，DOM对象或CSS选择器。

8、theme，主题名称，自带的主题有bubble和snow。注意，主题的css文件需要额外加载。

## Formats

Quill支持一系列的formats，既包括UI控件，又可以API调用。

### Inline Formats

background，bold，color，font，code，italic，link，size，strike，script，underline。

### Block Formats

blockquote，header，indent，list，align，direction，code-block。

### Embeds

formula(require KaTex)，image，video。

## API

### Content

#### deleteText

从编辑器中删除文本，返回一个Delta代表这个变更。

```js
let delta = editor.deleteText(1, 2)
// delta is {ops:[{retain:1},{delete:2}]}
```

#### getContents

返回编辑器的内容，带有格式化信息，返回delta对象。

```js
let delta = editor.getContents()
// deleta is { ops: [ {insert: `Hello \n`}, { attributes: {bold: true}, insert: `world!\n`} ] }
```

#### getLength

返回编辑器内容的长度。注意：即使编辑器是空的，也有\n换行符。

```js
editor.getLength();
```

#### getText

返回编辑器的文本内容，非字符内容会省略。

```js
//getText(index: Number=0,length:Number):String
let text = editor.getText(0, 10);
```

#### insertEmbed

在编辑器中插入嵌入的内容，返回一个delta。

```js
// insertEmbed(index:Number,type:String, value:any, source:String='api'):Delta
let delta = editor.insertEmbed(10, 'image', 'https://ftp.bmp.ovh/imgs/2021/10/331197ebc7c14fbb_thumb.jpg')
//deleta is {ops: [{retain:10},{insert:{image: 'https://ftp.bmp.ovh/imgs/2021/10/331197ebc7c14fbb_thumb.jpg'}}]}
```

#### insertText

在编辑器中插入文本，可以以多种格式插入，返回一个delta。

```js
// insertText(index:Number,text:String,source:String='api'):Delta
// insertText(index:Number,text:String,format:String, value:any, source:String ='api'):Delta
// insertText(index:Number,text:String,format:{[String]:any},source:String='api'):Delta
let delta = editor.insertText(26, `Hello`, {
    color: 'red',
    italic: true
})
// delta is {ops:[{retain:26},{attributes: {color: 'red', italic: true},insert:`Hello`}]}
```

#### setContents

设置编辑器当前的内容，内容应该以换行符\n结尾。返回一个delta对象。

```js
//setContents(delta:Delta, source:String = 'api'):Delta
let delta = editor.setContents([{
    insert: 'Hello '
}, {
    insert: 'world!',
    attributes: {
        bold: true
    }
}, {
    insert: '\n'
}])
//delta is  {ops: [{insert: 'Hello '}, {attributes: {bold: true}, insert:'world!'}, {insert: '\n'}, {delete: 1} ]}
```

#### setText

设置编辑器的文本内容，返回一个delta。

```js
//setText(text : String,source : String = 'api'): Delta
let delta = editor.setText(`Hello\n`)
// delta is {ops:[ {insert: 'Hello\n'}, {delete: 13}]}
```

#### updateContents

用delta去更新编辑器内容，返回一个反映变化的Delta。

```js
//updateContents(delta:Delta, source:String ='api'): Delta

editor.updateContents({
    ops: [{
            retain: 6
        },
        {
            delete: 5
        },
        {
            insert: 'Quill'
        },
        {
            retain: 3,
            attributes: {
                bold: true
            }
        }
    ]
});
// ops:
// 0: {retain: 6}
// 1: {insert: 'Qui'}
// 2: {delete: 3}
// 3: {retain: 1}
// 4: {insert: 'l'}
// 5: {delete: 1}
// 6: {retain: 1, attributes: { bold: true }}}
```

### Formatting

#### format

格式化用户当前选择的内容，返回一个代表变更的Delta。如果用户选择的内容为空，格式化被激活，用户下一个输入的字符会被格式化。

```js
// format(name:String, value: any, source:String = 'api'): Delta
editor.format('color', 'red');
//ops: 
// 0: {retain: 6}
// 1: {retain: 5, attributes: { color: red}}
```

#### formatLine

格式化所有的选定行，返回一个代表变更的Delta。如果传递inline formats，没有任何效果。移除格式化信息，Value传递false参数即可。用户选择信息可能不会保留。

```js
//formatLine(index:Number, length: Number, source:String = 'api'):Delta
//formatLine(index:Number, length: Number, format:String , value:any, source:String = 'api'):Delta
//formatLine(index:Number, length: Number, formats: {[String]: any}, source: String = 'api'):Delta
editor.formatLine(0, 1, 'align', 'right');
//0: {retain: 12}
// 1: {retain: 1, attributes: {align: `right`} }
```

#### formatText

格式化编辑器里的文本，返回代表变更的Delta。移除样式，value传递为false即可，用户的选择可能不会保留。

```js
//formatText(index:Number, length:Number, source:String = 'api'):Delta
//formatText(index:Number, length:Number, format:String, value:any, source:String = 'api'): Delta
//formatText(index:Number, length:Number, formats:{String]: any}, source:String = 'api'): Delta
editor.formatText(0, 5, 'bold', true);
//ops: [{ attributes: {bold: true}, retain: 5}]
editor.formatText(0, 5, {
    'bold': false,
    'color': 'rgb(0, 0, 255)'
});
//ops:[ {attributes: {bold: null, color: 'red'}, retain: 5}]
```

#### getFormat

得到所选择文本的格式化信息，所有区域内的所有文本必须有该format值。返回一个name为format，key为true的对象。如果没有传递范围，则用户当前选择的文本范围会被使用。

```js
//getFormat(range:Range = current): {[String]: any}
//getFormat(index:Number, length:Number=0): {[String]: any}
editor.getFormat(0, 4)
// { bold: true, italic: true }
```

#### removeFormat

移除所有的的格式和嵌入的内容，返回一个代表变更的Delta对象。如果选区内的所有文字都有该format，则line format会被移除。

```js
// removeFormat(index: Number, length: Number, source:String = 'api'):Delta
editor.removeFormat(3, 7)
// {ops: [{retain: 6, attributes: { bold: null}},...{ retain:1, attributes: {italic:null} }]}
```

### Selection

#### getBounds

获取相对于编辑器的绝对位置和大小信息。在用于计算展示悬浮框的位置时很有效。

```js
//getBounds(index:Number, length: Number =0): {left: Number, top: Number, height: Number, width: Number}
editor.getBound(0, 11);
//{ bottom: 28,
// height: 15,
// left: 16,
// right: 82.96875,
// top: 13,
// width: 66.96875 }
```

#### getSelection

获取用户的选中区域。

```js
//getSelection(focus = false): {index:Number, length:Number}
editor.getSelection()
// { index: 1, length: 20}
```

#### setSelection

选中给定的区域，这个会focus编辑器。

```js
//setSelection(index:Number, length:Number =0 , source:String = 'api')
//setSelection(range: {index: Number, length:Number},source:String = 'api')
editor.setSelection(0, 5)
```

### Editor

#### blur

使编辑器失去焦点。

```js
editor.blur()
```

#### disable

等同于enable(false)

#### enable

设置用户是否可以通过键盘或鼠标编辑。不影响通过API调用的编辑。

```js
enable(enabled: boolean = true)
```

#### focus

focus编辑器，恢复最后的选区。

```js
editor.focus()
```

#### hasFocus

编辑器是否focus，焦点在toolbar，tooltips不算focus在编辑器。

#### update

同步检查是否有用户更新，如果有变动，则生成相关的事件。

```js
editor.update(source: String = 'user')
```

### Events

#### text-change

当内容变更时触发，变化的具体内容，变化前的编辑器，变化源会被提供。

如果变化的source为slient，则text-change事件不会被触发。这种方式不被推荐，因为它会破坏undo堆栈和其它依赖于变化记录的功能。

```js
// handler(delta:Delta, oldContents:Delta, source:string)，事件处理器参数
editor.on('text-change', (delta, oldDelta, source) => {
    console.log(delta, oldDelta, source);
})
```

#### selection-change

当选中的区域变化时，该事件会被触发，事件中包含选中的区域。返回null代表选区丢失，一般是编辑器失去焦点导致的。

如果source为slient，该事件也不会触发。

```js
//handler(range:{index:Number,length:Number},oldRange: {index:Number,length:Number}, source:String)
// 事件处理方法参数类型
editor.on('selection-change', (range, oldRange, source) => {
    console.log(range, oldRange, source);
})
```

#### editor-change

text-change或selection-change事件都会被触发。source为slient，也会触发。

```js
//handler(name:String, ...args)
editor.on('editor-change', (eventName, ...args) => {
    console.log(eventName, args)
})
```

#### on && off && once

添加事件处理器。

```js
// on(name:String, handler:Function): Quill
// once(name:String,handler:Function): Quill
// off(name:String, handler:Function): Quill
```

### Model

#### find

静态方法，返回给定的DOM节点管理的Quill或Blot实例。第二个参数buddle代表是否需要搜寻给定DOM节点的祖先节点。

```js
//Quill.find(domNode:Node, buddle: boolean = false): Blot| Quill
```

#### getIndex

返回给定的Blot距文档开始的距离。

```js
//getIndex(blot:Blot):Number
let codeBlot = Quill.find($0)
editor.getIndex(codeBlot)
//
```

#### getLeaf

返回在特定Index位置的子Blot。

```js
//getLeaf(index:Number):Blot
editor.getLeaf(12)
```

#### getLine

返回在指定Index的line Blot。

```js
//getLine(index:Number):[Blot,Number]
let [lineBlot, offset] = editor.getLine(7);
```

#### getLines

返回在特定区间的Line Blot数组。

```js
// getLines(index: Number =0, length:Number=remaining): Blot[]
// getLines(range: Range): Blot[]
editor.getLines(0,100)
```

### Extension

#### debug

静态方法来启用特定的打印消息级别。error，warn，log，info。true为log，false为取消所有log。

```js
// Quill.debug(level: String| Boolean)
```

#### import

静态方法，主要用来获取Quill内部的lib，format，module和theme。参数path需要和Quill源码的目录结构一致。

修改返回的内容非常不推荐，因为可能会导致Quill的正常功能受损。

```js
//Quill.import(path):any
let Delta = Quill.import('delta');
let Toolbar = Quill.import('modules/toolbar');
```

#### register

注册一个module，theme，format，使得他们可以添加到编辑器中。

```js
//Quill.register(format:Attributor | BlotDefinintion, supressWarning: Boolean = false )
//Quill.register(path: String, def: any, supressWarning:Boolean = false)
//Quill.register(defs:{[String]:any}, supressWarning: Boolean = false)
let Module = Quill.import('core/module')
class CustomModule extends Module {}
Quill.register(`modules/custom-module`, CustomModule)
Quill.register({
    `formats/custom-format`: CustomFormat,
    `formats/custom-module-a`: CustomModuleA
});
Quill.register(CustomFormat)
```

#### addContainer

添加一个容器元素在Quill编辑器内。习惯上，Quill模块需要有一个ql-前缀的class名。第二个参数为refNode，container会在它之前插入。

```js
// editor.addContainer(className:String, refNode?: Node) : Element
// editor.addContainer(domNode:Node, refNode?: Node): Element
let container = editor.addContainer('ql-custom');
```

#### getModule

返回添加到编辑器的module。

```js
//getModule(name:String):any
let toolbar = quill.getModule('toolbar')
```

## Delta

Delta是一种简单和富于表现力的，用来描述Quill编辑器的内容和变更的一种格式。

Delta是JSON的严格子集，是人类易读取的，机器容易解析的格式。Delta可表示任何Quill文档，包括所有文本和format信息。

Delta在英文中表示增量，在Quill中用于表示从一个文档变换到另外一个文档需要经过的指令集合。

Delta实现为一个独立的类库，使其可以独立于Quill使用。它可以用于OT，也可以被应用于类似Google Docs之列的应用。

提示：不推荐直接手写Delta，可以使用import来得到Delta，然后使用Delta.insert，Delta.delte，Delta.retain等方法。

## Document

```js
{
  ops: [
    { insert: 'Gandalf', attributes: { bold: true } },
    { insert: ' the ' },
    { insert: 'Grey', attributes: { color: '#cccccc' } }
  ]
}
```

当Delta用于描述内容时，它可以被认为是需要应用于空白文档的增量。因为Delta是一种数据格式，attributes没有特定的意义，名字和值完全取决于使用者和生成者。

eg：color不一定非是16进制的值，这个只是Quill做出的一种选择。

## Embeds

对于一些非文办内容，比如说图片或公式，insert的值可以是一个对象。

这个对象需要有一个来决定它类型的key，这个是BlotName（如果你使用Parchment来构建自定义内容）。

```js
{
  ops: [{
    insert: {
      image: 'https://quilljs.com/assets/images/icon.png'
    },
    attributes: {
      link: 'https://quilljs.com'
    }
  }]
}
```

## Line Formatting

与\n字符相关的attributes表示行的format。

```js
{
  ops: [
    { insert: 'The Two Towers' },
    { insert: '\n', attributes: { header: 1 } },
    { insert: 'Aragorn sped on up the hill.\n' }
  ]
}
```

所有的Quill文档需要以\n结尾，因为这样你永远会有一个位置来应用行格式。

很多行格式是不可同时设置的。eg：同一行既是header，又是list。





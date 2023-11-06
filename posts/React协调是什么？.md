---
title: "React协调是什么？"
date: "2022-03-23 11:10:38"

---
最近在一个国外博客中看到一篇关于介绍什么是React reconciliation的文章，通篇阅读后觉得这是一篇比较易懂、会适当举例说明之的文章，比较适合想初步了解React的朋友，这里经过个人翻译并且加入些个人理解后整合出来的文章。

## 背景

想象一下平时在React组件中进行条件渲染，`if(xxx)`时渲染什么组件，`else`时渲染其他组件。比如我在开发一个注册的表单，其中有一部分功能是注册的是个人还是公司，如果是公司，页面上展示一个输入框让用户输入公司税号，否则展示一行文字：

```javascript
const Form = () => {
  const [isCompany, setIsCompany] = useState(false)
  
  return (
  	<>
    	<Checkbox onChange={()=>setIsCompany(!isCompany)}></Checkbox>
    	{
    		isCompany ? 
    			<Input id='company-tax-id' placeholder='enter your tax id'/>
    			:
    			<TextPlaceholder/>
			}
    </>
  )
}
```

假如一开始我勾选了是“公司”，并且在输入框中输入了内容，此时我切换Checkbox来表明我是个人，显然页面上的输入框就会消失，取而代之的是渲染文本，并且我再切换回公司，之前我输入的内容就会消失掉。对应React开发者来说，这是很符合直觉的事情。



但是如果此时的需求变了，即使用户选择了“个人”，也需要展示输入框来让用户输入个人税号：

```javascript
const Form = () => {
  const [isCompany, setIsCompany] = useState(false)
  
  return (
  	<>
    	<Checkbox onChange={()=>setIsCompany(!isCompany)}></Checkbox>
    	{
    		isCompany ? 
    			<Input id='company-tax-id' placeholder='enter your tax id'/>
    			:
    			<Input id='person-tax-id' placeholder='enter your tax id'/>
			}
    </>
  )
}
```

当用户勾选“公司”并输入税号后，他切换到“个人”，这时候Bug就出现了，刚刚输入的公司税号竟然还在输入框中！这个现象对于React开发者来说应该不陌生（虽然上面的需求我们在真实开发中并不会这么渲染两个Input），这在React中是个正常现象，但是它并不符合我们的业务需求啊！React认为这两个输入框都是同一个东西，React只会拿着新的数据重新渲染Input，而不会移除第一个Input，然后插入第二个Input。



要解释这个现象，这就涉及到React的reconciliation，也就是React协调。



## React reconciliation基本工作原理

现在我们有这么一个`Input`组件：

```javascript
const Input = ({placeholder}) => {
  return <input id='input' placeholder={placeholder}></input>
}

// 使用Input组件
<Input placeholder={placeholder}></Input>
```

当我们在写React的时候，最终的目标就是希望React帮我们将React代码转换成能在屏幕上展示，带有数据的DOM节点。比如上述`Input`组件，我们希望React能将一个带有placeholder属性的input输入框渲染到页面上，当placeholder发生变化时，React能正确渲染带有新的数据的input到页面上，这个是使用React的最终目的。



想象一下如果我们用原生DOM操作来实现上面的效果，我们并不会先把旧的input删掉，再添加一个带有placeholder数据的input到页面，如果页面上都是这么操作，将会十分消耗性能；相反，我们应该：

1. 通过`getElementById`来查找input DOM
2. 修改DOM的placeholder属性

```javascript
const input = document.getElementById('input');
input.placeholder = 'new placeholder';
```



当我们使用React时，大部分情况并不需要手动进行DOM操作，React内部会通过"Virtual DOM"来实现上述替换placeholder的效果。这个所谓的"Virtual DOM"（下文简称vDOM）本质上就是一个JavaScript对象，对象中有一些“指针”属性，用于指向当前vDOM的父节点、子节点和兄弟节点，通过“指针”属性，React最终会将页面上所有要渲染的组件组织成一棵树。这棵树能完全反映当前页面上所有的内容。



比如上述的`Input`组件，其对应的vDOM应该长这样的：

```javascript
{
  type: "input", // 元素的类型
  props: {...}, // Input组件的props，比如placeholder
  ...
}
```

如果React组件中return的JSX包含了其他React组件，比如：

```javascript
const WrapInput = () => {
  return <Input/>
}
```

那么其vDOM就是这样：

```javascript
{
  type: Input,
  props: {...},
  ...
}
```

当React收到“指令”要首次渲染整个应用，它会遍历整棵树：

1. 如果`type`是字符串，那么就会渲染对应的HTML元素；
2. 如果`type`是个函数，React会调用该函数，并且递归地去遍历函数return的树；

当遍历完整棵树后，React才会停止遍历，根据生成的整棵vDOM，最终生成对应的真实DOM结构，并且通过DOM api`appendChild`渲染页面。



### 状态更新

想象一下，当vDOM树中某个组件拥有自己的state，且被触发了re-render，React因此需要以最新的state来更新页面上所有的元素，或者是删除、新增一些新的元素。



假设我们有一个十分简单的组件：

```javascript
const Component = () => {
  return <Input/>
}
```

那这个React组件对应的vDOM就是：

```js
{
  type: Input,
	...
}
```

在更新时，React会比较更新前后的`type`，如果`type`相等，那么`Input`会被标记为“需要更新”，随后就会被re-render；如果type改变了，React会把旧的组件移除，并插入新的组件。

> 需要注意的是：如果`type`是函数，React在比较时是比较更新前后函数的“引用”是否发生了变化，来判断是否保留组件。



当然，在实际开发中更多的是在React组件中做条件渲染，也就是说：

```javascript
const Component = () => {
  const [showInput, setShowInput] = useState(true);
  
  if(showInput) return <Input></Input>
  
  return <TextPlaceholder></TextPlaceholder>
}
```

当`showInput`从默认的true变成false，React会比较以下两个对象：

```js
// 更新前，showInput为true
{
  type: Input,
  ...
}
  
// 更新后，showInput为false
{
  type: TextPlaceholder,
  ...
}
```

很明显，`type`从`Input`变成了`TextPlaceholder`，React会卸载`Input`并且从DOM树上移除所有`Input`相关的东西，然后就会挂载`TextPlaceholder`组件到页面，所有`Input`的状态、输入的内容都会被销毁。



现在再回看一开始的例子：

```javascript
const Form = () => {
  const [isCompany, setIsCompany] = useState(false)
  
  return (
  	<>
    	...other elements
    	{
    		isCompany ? 
    			<Input id='company-tax-id-number' placeholder='type company tax id'></Input>
    			:
    			<Input id='person-tax-id-number' placeholder='type person tax id'></Input>
    	}
    </>
  )
}
```

当`isCompany`从true变成false，React会对比以下两个对象：

```javascript
isCompany ==> false
{
  type: Input,
  ... // 包括id='person-tax-id-number'、placeholder等
}
  
isCompany ==> true
{
  type: Input,
  ... // 包括id='company-tax-id-number'、placeholder等
}
```

对于React来说，`isCompany`更新前后`type`并没有变化，也就是函数的引用没有变化；变化的只是组件一些props，比如id、placeholder等等。所以在这种情况下，React会直接原地复用`Input`组件，并且以最新的state重新渲染`Input`组件，`Input`组件没有像上一个例子中一样被销毁再重新挂载，所以`Input`相关的所有state都会被保留，因此，即使我们不断勾选/反选Checkbox，输入的内容依然会在页面中。



**但是**，单纯从代码的角度来看，React应用中这样的行为确实是一定程度上减少性能消耗，但是这并不符合业务要求啊，在切换个人和公司选项后，我们希望能清空掉输入框的内容，这里解决这个问题的方法有两个：数组和key。



### 数组更新

实际上`Form`组件的完整代码是这样的：

```javascript
 const Form = () => {
   const [isCompany, setIsCompany] = useState(false)
   
   return (
   		<>
     		<Checkbox onChange={()=>setIsCompany(!isCompany)}></Checkbox>
     		{
     			isCompany ? 
     				<Input id="company-tax-id-number"></Input>
     				:
     				<Input id="person-tax-id-number"></Input>
     		}
	    </>
   )
 }
```

在`isCompany`更新时，对于React来说它看到的是一个数组：

```javascript
[
  {
    type: Checkbox,
  },
  {
    type: Input
  }
]
```

React会遍历这个数组，并且一个个比较更新前后的`type`，第一个组件的type更新前为`Checkbox`，更新后也是`Checkbox`，对于第二个组件的type也是如此，因此整个更新过程中，React都会复用`Checkbox`和`Input`，并且re-render它们。



如果我改写一下`Form`：

```javascript
const Form = () => {
  const [isCompany, setIsCompany] = useState(false)
  
  return (
  	<>
    	<Checkbox onChange={()=>setIsCompany(!isCompany)})></Checkbox>
    	{isCompany ? <Input id="company-tax-id-number"></Input> : null}
			{!isCompany ? <Input id="person-tax-id-number"></Input> : null}
    </>
  )
}
```

当`isCompany`变化时，React会对比以下的数组：

```javascript
更新前，isCompany为false
[
  {type: Checkbox},
  null,
  {type: Input}
]

更新后，isCompany为true
[
  {type: Checkbox},
  {type: Input},
  null
]
```

当React开始将数组中的数组项一个个对比时，会是这样的：

- 第一个item，更新前后都是`Checkbox`，所以会复用并且re-render`Checkbox`；
- 第二个item，更新前为null，更新后为`Input`，挂载`Input`组件；
- 第三个item，更新前为`Input`，更新后为null，卸载`Input`组件；

此时，两个`Input`是两个完全不同的组件，因此我们会在页面上看到当切换`Checkbox`时，`Input`在相同的位置，但是输入框输入的内容会随着`Checkbox`变化而清空，这样我们就把bug修复了～



### 添加key

解决一开始代码的问题，还有两个办法，就是给数组项添加key。对于React开发者来说，key并不陌生，React会强制开发者一定要在遍历列表时给每项元素添加key。



有以下代码：

```javascript
const data = [1,2]
const Component = () => {
  return data.map(value => <Input key={value}></Input>)
}
```

那么`Component`的返回值就是：

```javascript
[
  {type: Input},
  {type: Input}
]
```

这时候对于React来说就有个问题，数组中所有的组件的type都是相同的，如何区别哪个对象对应哪个组件呢？如何确保正确地复用组件呢？如果只是根据数组项索引来复用组件，React会将第二个组件的数据复用到第一个组件中，就会导致一个bug：在第一个输入框中输入内容然后打乱顺序，输入的内容仍然在第一个输入框中。



这时候就需要key属性了，key在React中是一个元素的唯一标识，在re-render过程中，如果在一个数组中组件有唯一key，那么React就会复用这个组件，包括它对应的DOM元素、状态等。

```javascript
更新前
[
  {type: Input, key: '1'},
  {type: Input, key: '2'}
]

更新后
[
  {type: Input, key: '2'},
  {type: Input, key: '1'}
]
```

有了key，React就会知道在更新后，它需要在索引为1的地方，复用更新前的第一个组件。因此我们可以看到我们在第一个输入框输入的内容，在打乱顺序后，输入的内容会出现在第二个输入框中，符合我们的预期。



回到一开始的代码，为了解决那个业务上的bug，我们只需要让React知道更新前后的`Input`是两个完全不同的`Input`，也就是给`Input`添加唯一标识——key：

```javascript
{
  isCompany ? 
    <Input ... key="company-tax-id-number"}></Input>
  	:
  	<Input ... key="person-tax-id-number"></Input>
}
```

这时候在更新过程中，React在渲染第一个数组项时，就会先卸载第一个`Input`（key为company），然后挂载第二个`Input`（key为person），这样，在切换Checkbox时，组件的状态就会并重制为空，bug解决！



#### 为什么除了遍历数组外，其他情况不需要key？

有以下两份代码：

```javascript
const data = [1,2]

const Component = () => {
  return {data.map(value => <Input key={value}></Input>)}
}
```

```javascript
const Component = () => {
	return (
  	<>
    	<Input></Input>
    	<Input></Input>
    </>
  )
}
```

两个组件的输出都是相同的，就是一个`Fragment`包裹着两个`Input`的数组：

```javascript
[
  {type: Input},
  {type: Input}
]
```

那为什么在第一种情况需要key，而第二种情况不需要key呢？



两者的区别在于第一种情况是一个动态的数组，React不知道在下一个re-render时，你会对数组做什么做操，所以React会强制开发者给元素添加key属性作为唯一标识，以防在代码运行时，打乱了数组项的顺序。对于React来说，第一种情况是“**动态**”的，第二种情况是“**静态**”的，React明确知道更新前后哪个vDOM对应哪个组件，因此，对于静态情况，不需要提供一个唯一标识给React来复用组件。



#### 如果数组与普通元素放在一起呢？

```javascript
const data = [1,2]

const Component = () => {
  return (
  	<>
    	{data.map(value => <Input key={i} id={i}></Input>)}
			<Input id="3"></Input>
    </>
  )
}
```

`Component`对应的返回值是：

```javascript
[
  {type: Input, key: 1},
  {type: Input, key: 2},
  {type: Input}
]
```

此时如果我在`data`后面插入一条新数据，那么在更新后，在第三个的位置上会渲染`key=3`的`Input`，而`id=3`的`Input`将会被移动到第四的位置。那是不是意味着：在本次更新中`id=3`的`Input`是一个新插入的元素，需要重新挂载呢？非也！



对于上面的代码，React会为遍历数组产生的元素，单独包裹在一个数组中：

```javascript
[
  [{type: Input, key: 1}, {type: Input, key: 2}],
  {type: Input}
]
```

这个`id=3`的`Input`组件在更新后仍然处于数组的相同位置中，所以React并不会重新挂载该组件。



#### 为什么我们不能在组件中定义一个新的组件呢？

```javascript
const Component = () => {
  const Input = () => <input></input>
  
  return <Input></Input>
}
```

对于以上这种方式来定义组件，React是十分不推荐的❌。每次`Component`re-render时，`Input`都会重新生成，并挂载，而不是复用。`Component`组件的返回值为：

```
{
	type: Input
}
```

每次`Component`更新，都会对比type，但是由于`Input`在每次更新中都会重新生成，意味着它是一个新的引用的函数，所以React会认为更新前后的`Input`不是同一个组件。就好比你在JavaScript中对比这两个函数，它们都是不想等的：

```
const fn1 = () => {}
const fn2 = () => {}

console.log(fn1 === fn2) // false
```



## 总结

以上篇幅较长，因此这里总结几小点来概括下：

1. 在React中，会为页面上所有的元素生成对应的"Virtual DOM"，它本质上是一个JS的对象。每次更新时，都会对比对象中的type，如果type相同，则复用并re-render，否则卸载旧组件，并挂载新组件；
2. 在React应用中渲染“动态”列表，我们需要为每个数组项添加key，作为更新时组件的唯一标识，便于让React找到可复用的节点，而非卸载—挂载组件；
3. 在一次更新中，当节点更新前后的`type`相等，`key`也相等，那么React只会重新执行组件，并以最新的state渲染组件。
4. “Virtual DOM”是一种编程理念，UI信息被特定语言描述并保存在内存中，再通过特定的库，例如react-dom使其与真实的DOM同步，这个过程，就是`reconciliation（协调）`。

---
title: "React key的工作原理：key的使用原则"
date: "2022-04-02 15:33:07"

---
在前面《React 协调是什么？》的文章中，我们知道React在更新页面的过程中，会比较组件的`type`和`key`，如果两者在更新前后都相同，React会认为这个组件在更新后还是之前那个组件，就会复用并re-render该组件。这次，我们将详细看一下`key`这个属性到底是怎么工作的，不同的`key`值对组件更新有什么影响？列表Item没有`key`属性可以吗？以及React新手常犯的错误，使用了数组的索引index作为`key`的值会发生什么？



### React key工作基本原理

在re-render过程中，当列表项存在`key`属性并且同级中有其他元素时，React会通过`key`来识别相同的元素。一个简化了的key工作过程如下：

1. 首先，React会对更新前和更新后的元素生成一个快照；
2. React会识别已经存在于页面上的元素，并且判断元素是否可以复用：
   1. 如果`key`属性存在，React会认为更新前后拥有相同`key`的是同一个元素；
   2. 如果`key`属性不存在，React会使用数组的索引作为`key`；
3. 最后，React会做一个判断：
   1. 将那些更新后不存在，而更新前存在的元素删除；
   2. 将会挂载（mount）那些更新前不存在的元素；
   3. 更新（re-render）那些更新前后都存在的元素；



### 为什么不要用随机值作为key

假设我们有这么一个`Item`组件，用于渲染某个国家的信息：

```javascript
const Item = ({country}) => {
  return (
  	<button className="country-item">
    	<img src={country.flagUrl}/>
			{country.name}
    </button>
  )
}
```

还有一个`CountriesList`组件来使用`Item`组件：

```javascript
const CountriesList = ({countries}) => {
  return (
	  <div>
    	{
        countries.map(country => (
        	<Item country={country}/>
        ))
      }
    </div>
  )
}
```



现在，`<Item>`组件上没有使用`key`属性，当`<CountriesList>`re-render时，会发生什么呢？

1. 因为没有`key`，所以React会默认使用countries数组的索引来作为`<Item>`的key；
2. 数组没有变化，因此第一个`<Item>`的`key`还是0，第二个`<Item>`的`key`还是1...，所以React认为更新前后都是相同的组件，所以只会re-render这些`<Item>`组件；

本质上，当列表中没有使用`key`属性时，代码相当于这样：

```javascript
countries.map((country, index) => <Item country={country} key={index}/>)
```

![img](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/ReactKey/reactKey1.png)

简而言之，当`<CountriesList>`re-render时，其所有的子组件`<Item>`也会re-render。如果将`<Item>`包裹在React.memo中，可以减少子组件不必要的re-render。



回到我们的话题，如果我们将一个随机字符串作为`key`的值，会发生什么呢？

```javascript
countries.map(country => <Item country={country} key={Math.random()}/>)
```

1. 每次`<CountriesList>`re-render，都会重新生成`key`；
2. React会使用`key`来识别已存在于页面上的元素；
3. 因为所有的`key`在更新后都是新的，React会认为更新后所有的`<Item>`都是新的，所以React会把它们都销毁，然后重新创建并挂载；

![img](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/ReactKey/reactKey2.png)

简单来说，当`<CountriesList>`re-render，所有的`<Item>`都会被销毁，然后重新创建并挂载。



对于应用的性能来说，重新创建组件挂载组件，相比于复用组件re-render组件的开销肯定是更加大的；另外，当组件在re-render过程中是被重新创建的时候，React.memo是不会对该组件进行缓存的，memo只会对复用了的组件起作用，所以这种情况下，即使使用了memo，对性能也没有半点帮助。



### 为什么不要用数组的索引作为key？

在React的官方文档中是不推荐使用数组的索引作为key的，那究竟使用数组索引作为key会导致什么样的问题呢？



使用索引作为key从而导致bug或者性能损耗的情况，只会发生在“动态”列表中，也就是说在每次re-render中，数组的顺序或者数组中item的个数是会变化的，比如有以下代码：

```javascript
import _ from 'lodash';

const ItemMemo = React.useMemo(Item)

const CountriesList = ({countries}) => {
  const [sort, setSort] = useState('asc')
  const sortedCountries = _.orderBy(countries, 'name', sort)
  const button = <button onClick={()=>setSort(sort === 'asc' ? 'desc' : 'asc')}>toggle sort: {sort}</button>

	return (
  	<div>
    	{button}
    	{sortedCountries.map(country => (
  			<ItemMemo country={country}/>
  		))}
    </div>
  )
}
```

每次点击`button`都会反转数组。假设key的值有两种，第一种是`country.id`作为`key`：

```javascript
sortedCountries.map(country => <ItemMemo country={country} key={country.id}/>)
```

第二种是使用`sortedCountries`的索引作为`key`：

```javascript
sortedCountries.map((country, index) => <ItemMemo country={country} key={index}/>)
```



对于`index`作为`key`的情况，每次点击按钮每个`<Item>`都会re-render（即使包裹了React.memo）；而对于`id`作为`key`的情况就不会有这个问题：即使点击按钮，`<Item>`也不会re-render。这两者的区别当然就是在于`key`了：

1. React为更新前后的元素生成快照，并且通过`key`来识别相同元素；
2. 从React角度看来，拥有相同`key`的那些元素就是相同的；
3. 如果使用`index`作为`key`，那么数组的第一个item永远是`key=0`，第二个item永远是`key=1`，以此类推；

所以，当React在对比更新前后的元素时，它会在更新前后都找到`key=0`的item，并且认为它们是同一个item，只不过props变化了，因为在反转数组后，`country`这个props变化了。所以React就会re-render当前item，而又因为props变化了，所以React.memo缓存组件失效，`<Item>`组件re-render。

![img](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/ReactKey/reactKey3.png)

而使用`id`作为`key`时，React每次re-render都会通过`key` 找到对应的正确的元素，而且props并没有变化，所以`<Item>`都会走memo缓存，这是符合预期行为的。

![img](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/ReactKey/reactKey4.png)



通过下面示例代码展示使用`id`和使用`index`作为`key`的区别，会更加明显：

```javascript
const Item = ({country}) => {
  const [isActive, setIsActive] = useState(false)
  
  return (
  	<button
    	className={`country-item ${isActive ? 'active' : ''}`}
    	onClick={()=>setIsActive(!isActive)}
    >
    	<img src={country.flagUrl} />
    	{country.name}
    </button>
  )
}
```

首先我们点击几个`<Item>`，使其背景色变化，然后点击sort按钮打乱countries的顺序。



`id`作为`key` 的列表表现如我们所预想的。我们看看`index`作为`key`的列表：

如果我点击了第一个`<Item>`，当我们点击sort按钮打乱数组顺序后，还是第一个`<Item>`高亮。如我们上面所说，React认为`key=0`的item在state更新前后都是同一个item，所以React会复用这个item组件的实例，并且保持组件内的state（比如`isActive`设置为true），然后仅仅只会以新的props更新组件。



另一种常见的情况是：在数组的开头添加一个新的item。情况如上述一样，React认为`key=0`的item（第一个item）仍然是那个item，而数组最后的item才是新增的item。所以当第一个item被选择，在`index`作为`key`的列表中被选择项还是第一个，除了最后一个item被认为是新的，所以被挂载了，其他的item都仅仅只是re-render；而在`id`作为`key`的列表中，仅仅第一个新插进数组的item会被挂载渲染，其他的item仅仅只是re-render。这个就是两者的区别：

![image-20231119155038253](https://cdn.jsdelivr.net/gh/hinhinlaw/blog-resources@main/images/post/ReactKey/reactKey5.png)



### 为什么用数组的索引作为key是个好主意？

到现在，相信很多人会说：无论什么情况，我们直接使用唯一id作为`key`就可以啦。对于大多数情况来说是的，但是在某些情况下，使用索引作为`id`可以让应用的性能更加好。



一个典型的场景就是：分页列表。页面上有一个item数量有限的列表，此时你想展示下一页的数据，你点击“下一页”按钮，如果你使用`id`作为`key`，每次你改变“page”都会因为item的id不同，而重新挂载新的item，这意味着React找不到已存在于页面上的item，然后就只能卸载全部item，挂载新的item。



但是，如果你使用`index`作为`key`，React会认为所有的item都已存在于页面上，React就会拿着新的数据来re-render这些组件。对于item是复杂组件的情况，这种做法的效果尤其突出。



当然，使用`index`作为`key`来优化项目，只限于某些特殊场景，它们都有一个前提：**组件是无状态的(stateless)或者state的值仅取决于props**的情况，比如像Google搜索列表页这种，列表item的数据的源头只来自于props的。



### 总结

- **永远**不要使用随机值来作为`key`，这会导致在每次re-render时，都会“卸载-挂载”item，造成不必要的性能损耗；
- 你可以在一些“静态”列表中使用数组`index`作为`key`，前提是这些item的顺序不会变化；
- 当列表中任何一个item的顺序会被打乱，或者列表需要添加或删除item的，都要使用唯一id作为`key`；
- 你可以在列表中所有item都是无状态的情况下，使用数组`index`作为`key`，以此提高列表的渲染性能；

---
title: "React 리렌더링 최적화"
description: "React의 리렌더링 최적화 작업을 진행하면서 공부한 내용을 정리하였습니다."
pubDate: "Oct 6 2024"
heroImage: "../../assets/blog/blog-placeholder-2.webp"
---

React의 리렌더링 최적화 작업을 진행하면서 공부한 내용을 정리하였습니다.

## React 리렌더링의 기본 이해

React에서 리렌더링은 컴포넌트가 화면에 처음 나타나는 **초기 렌더링**과 이미 화면에 있는 컴포넌트의 두 번째 또는 그 이상의 **리렌더링**으로 구분됩니다. 리렌더링은 주로 사용자가 앱과 상호작용하거나 비동기 데이터가 업데이트될 때 발생합니다. 따라서, 리렌더링은 새로운 정보를 필요로 하는 경우에 필수적이며, 이러한 경우를 **필요한 리렌더링**이라고 합니다. 예를 들어, 사용자가 입력 필드에 타이핑할 때마다 해당 컴포넌트는 상태를 관리해야 하므로 매번 리렌더링이 필요합니다.

**그러나 모든 리렌더링이 필요한 것은 아닙니다.** 불필요한 리렌더링은 잘못된 설계나 비효율적인 앱 아키텍처로 인해 전체 페이지가 매번 업데이트되는 경우처럼 발생할 수 있습니다. React의 성능이 매우 뛰어나기 때문에 보통은 이런 리렌더링이 문제를 일으키지 않지만, 너무 빈번하거나 복잡한 컴포넌트에서 발생하면 사용자 경험에 영향을 줄 수 있습니다. 이러한 시나리오에서는 앱이 느려지거나 응답하지 않을 수 있습니다.

이와 같은 맥락에서, 리렌더링 최적화는 React 성능을 유지하는 데 중요한 요소로 작용합니다. 초기 렌더링과 리렌더링을 최적화하는 것은 앱의 성능을 향상시키고, 더 원활한 사용자 경험을 제공하는 데 기여할 수 있습니다.

그렇다면 React에서 리렌더링이 일어나는 경우는 무엇이 있을까요?

## React 리렌더링이 일어나는 상황
component가 자체적으로 리렌더링되는 데에는 대게 네 가지 이유가 있습니다. `상태 변경`, `부모(또는 자식)의 리렌더링`, `Context 변경` 및 `hooks의 변경`입니다.

### 상태 변경으로 인한 리렌더링
상태 변화는 주로 콜백 함수나 `useEffect` 훅 내에서 이루어지며, 모든 리렌더링의 원천으로 볼 수 있습니다. 

```js
// 2. re-render
const Component = () => {
	const [state, setState] = useState('initial-state');
  	
  	useEffect(() => {
      	// 1. value change
    	setState('state-change')
    }, [])
  	return ...
}
```
위 컴포넌트에서 state가 변경이 되면 Component는 리렌더링 됩니다.

### 부모요소로 인한 리렌더링
부모 컴포넌트가 리렌더링될 때 자식 컴포넌트도 함께 리렌더링이 발생하며 이는 항상 트리 구조에서 아래로만 영향을 미칩니다. 자식 컴포넌트의 리렌더링은 부모 컴포넌트를 리렌더링 시키지 않습니다([여기에는 몇가지 예외사항이 있습니다.](https://www.developerway.com/posts/react-elements-children-parents))

```js
// 1. re-render
const Parent = () => {
  	// 2. re-render
  	return <Child />
}
```
만약 Parent컴포넌트가 리렌더링 된다면 Child컴포넌트도 리렌더링 됩니다.

### Context의 변경으로 인한 리렌더링
컨텍스트의 값을 제공하는 Context Provider가 변경되면, 해당 컨텍스트를 사용하는 모든 컴포넌트가 리렌더링됩니다.

```js
// 1. value changes
const useValue = useContext(Context)

// 2. re-render
const Component1 = () => {
  	const value = useValue()
  	return ...
}
// 2. re-render
const Component2 = () => {
  	const value = useValue()
  	return ...
}
```

### hooks의 변경으로 인한 리렌더링
hooks 내부의 상태 변경이나, Context 사용 시 변경이 있으면 이를 사용하는 컴포넌트는 **피할 수 없는 리렌더링**을 겪게 됩니다.
```js
// 1. value changes
const useValue = {return ...}

// 2. re-render
const Component = () => {
  	const value = useValue()
  	return ...
}
```

### props로 인해 리렌더링 되지 않음
컴포넌트는 props가 변경되기 때문에 다시 렌더링되는 것이 아닙니다.

```js
// 2. re-render
const Parent = () => {
  	// 1. value changes
  	const [state, setState] = useState();

  	return (
    	<>
      		// 3. re-render
      		<Child1 state={state}/>
			// 3. re-render
      		<Child2 />
      	</>
    )
}
```

위 컴포넌트를 볼때 Child2는 state를 의존하지 않으므로 state가 변경될 때 리렌더링 되지 않을 것이라고 생각할 수 있지만 그렇지 않습니다.

컴포넌트가 리렌더링되면 **props를 통해 특정 상태 변수가 전달되는지 여부와 관계없이** **모든 자식 컴포넌트를 리렌더링**하려고 시도합니다. 


## 리렌더링 방지 전략
리렌더링을 방지하기 위한 효과적인 전략에는 `React.memo`와 `상태 관리 조정`이 있습니다. 

### React.memo를 이용한 방지
`React.memo`는 하위 렌더 트리에서 발생한 리렌더링 체인을 차단하는 데 유용하며, 컴포넌트의 props가 변경되지 않는 한 작동합니다.

```js
const ChildMemo = React.memo(Child)

// 1. re-render
const Parent = () => {
  	// doesn't re-render
  	return <ChildMemo />
}
```

만약 컴포넌트에 props가 있다면 props를 모두 메모이제이션 시켜야 React.memo가 작동합니다.
```js
const ChildMemo = React.memo(Child)

// 1. re-render
const Parent = () => {
  	const value = useMemo(() => ({ value }), [])
  	// doesn't re-render
  	return <ChildMemo value={value}/>
}
```
위 컴포넌트에서 Parent가 리렌더링 되어도 value props가 변경되지 않는한 ChildMemo는 리렌더링 되지 않을 것입니다.

또한, Props 또는 children으로 전달되는 컴포넌트에 React.memo를 적용해야합니다. 부모 컴포넌트를 memo하는 것은 작동하지 않습니다.

```js
const PropsMemo = React.memo(Props)
const ChildrenMemo = React.memo(Children)

// 1. re-render
const Parent = () => {
  	
  	return (
        // doesn't re-render
    	<Child props={<PropsMemo />}>
      		// doesn't re-render
      		<ChildrenMemo />
      	</Child>
    )
}
```

### 상태관리를 이용한 방지
상태를 더 작고 독립적인 컴포넌트로 옮기는 전략은 상위 컴포넌트의 리렌더링을 줄이는 데 효과적입니다.  예를 들어, 대화 상자의 열림/닫힘 상태를 작은 컴포넌트로 캡슐화하면, 주요 컴포넌트는 그 상태 변경에 영향을 받지 않습니다.

```js
const ButtonWithDialog = () => {
  	const [open, setOpen] = useState(false)
 	
    return (
    	<>
      		<button onClick={() => setOpen(true)}>click</button>
      		{open && <ModalDialog />}
      	</>
    )
}

const Component = () => {
  	return (
        <>
      		// 1. re-render
      		<ButtonWithDialog />
      		// doesn't re-render
      		<VerySlowComponent />
      	</>
    )
}
```

### useMemo/useCallback을 이용한 방지
앞서 React.memo에서 봤듯이 props 자체를 메모화하는 것은 자식 컴포넌트의 리렌더링을 방지하지 못합니다. 부모 컴포넌트가 리렌더링되면 자식 컴포넌트의 props와 관계없이 해당 컴포넌트도 리렌더링 됩니다. 자식 컴포넌트가 `React.memo`로 감싸져 있다면, 원시 값이 아닌 모든 props는 메모화되어야 한다.
```js
const ChildMemo = React.memo(Child)

// 1. re-render
const Parent = () => {
  	const value = useMemo(() => ({ value }), [])
  	// doesn't re-render
  	return <ChildMemo value={value}/>
}
```
또한, 비원시 값을 hook의 의존성으로 사용하는 경우, 반드시 메모화해야 합니다.
일반적으로 `useMemo`의 주용도는 고비용 계산을 매 리렌더링마다 피하는 것입니다.
```js
// 1. re-render
const Component = () => {
  	// doesn't re-render
  	const verySlowComponent = useMemo(() => { 
      return <VerySlowComponent/>
    }, [])
  
  	return (
    	<>
      		<Something />
      		// doesn't re-render
      		{verySlowComponent}
      		<Something />
      	</>
    )
}
```

### Context에서의 방지
Context Provider가 앱의 최상위에 위치하지 않고, 조상 요소의 변화로 인해 자체적으로 리렌더링될 가능성이 있는 경우, 그 값은 메모화 해야 합니다.

```js
// 1. re-render
const Component = ({ children }) => {
  	const value = useMemo(() => ({ value }), [])
  	
    return (
  		// 2. if state the same, no-one re-render
    	<Context.Provider value={value}>
      		{children}
      	</Context.Provider>
    )
}
```

Context에 데이터와 API(getter, setter)의 조합이 있을 경우, 이를 같은 Context 하에 서로 다른 Provider로 분할할 수 있습니다. 이를 통해 API만 사용하는 컴포넌트는 데이터 변경 시 리렌더링되지 않습니다.

```js

const Component = ({ children }) => {
  	// 1. value change
  	const [state, setState] = useState()
  	
  	return (
    	<DataContext.Provider value={state}>
      		// doesn't re-render
      		<ApiContext.Provider value={setState}>
      			{children}
			</ApiContext.Provider>
      	</DataContext.Provider>
    )
}
```

Context가 몇 개의 독립적인 데이터 청크를 관리한다면, 이를 더 작은 프로바이더로 분할할 수 있으며, 이렇게 하면 변경된 청크의 소비자만 리렌더링됩니다.

```js

const Component = ({ children }) => {
  	// 1. first value change
  	const [first, setFirst] = useState()
    const [second, setSecond] = useState()
  	
  	return (
    	<Data1Context.Provider value={first}>
      		// doesn't re-render
      		<Data2Context.Provider value={second}>
      			{children}
			</Data2Context.Provider>
      	</Data1Context.Provider>
    )
}
```

메모이제이션을 잘못사용한다면 불필요한 메모리사용이 될 수 있지만, 이것을 잘만 사용한다면 React앱의 성능을 **극대화** 시킬 수 있을 것입니다.

참고자료
- https://www.developerway.com/posts/react-re-renders-guide
- https://www.joshwcomeau.com/react/why-react-re-renders/
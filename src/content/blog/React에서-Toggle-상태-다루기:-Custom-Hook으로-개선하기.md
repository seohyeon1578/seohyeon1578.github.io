---
title: "React에서 Toggle 상태 다루기: Custom Hook으로 개선하기"
description: "React에서 자주 사용되는 toggle 상태를 효율적으로 관리하는 방법에 대해 알아봅니다."
pubDate: "Nov 23 2024"
heroImage: "../../assets/blog/react-toggle-state-hero.webp"
---

## 들어가며

React로 개발을 하다 보면 `isOnline`, `darkMode`, `isOpen` 같은 toggle 상태를 자주 다루게 됩니다. 이러한 상태들은 보통 boolean 값을 가지며, 버튼 클릭이나 특정 이벤트에 의해 true/false로 전환됩니다.

이런 기능을 구현하는 가장 보편적인 방법으로는 `useState`를 사용하여 다음과 같이 구현할 수 있습니다.

```typescript
function Component() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <button onClick={toggleOpen}>
      {isOpen ? '닫기' : '열기'}
    </button>
  );
}
```

예전에는 이렇게 구현해도 기능적으로 잘 동작하니까 문제가 없다고 생각했습니다. 하지만 프로젝트가 커지면서 점점 불편함을 느끼기 시작했습니다.

모달, 드롭다운, 다크모드 등 토글이 필요한 컴포넌트를 만들 때마다 같은 코드를 반복해서 작성해야 했고, 매번 상태와 토글 함수를 따로 선언하는 것도 번거로웠습니다. 특히 다른 팀원의 코드를 리뷰할 때, 토글 로직이 조금씩 다르게 구현되어 있는 것을 발견했습니다.

이러한 불편함을 해소하기 위해 저는 custom hook을 만들어 사용하기로 했습니다.

## Custom Hook으로 개선하기

toggle 상태를 관리하는 custom hook을 만들어 보겠습니다.

```typescript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle] as const;
}
```

이제 이 hook을 사용하면 다음과 같이 간단하게 toggle 상태를 관리할 수 있습니다.

```typescript
function Component() {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <button onClick={toggleOpen}>
      {isOpen ? '닫기' : '열기'}
    </button>
  );
}
```

이렇게 custom hook을 사용하면 다음과 같은 장점이 있습니다:

1. 코드가 더 간결해짐
2. 재사용성이 높아짐
3. 관심사의 분리가 명확해짐
4. 테스트하기 쉬워짐

## useToggle의 활용 예시

이렇게 만든 useToggle hook은 다양한 상황에서 유용하게 사용할 수 있습니다:

```typescript
function App() {
  // 다크모드 토글
  const [isDarkMode, toggleDarkMode] = useToggle();

  // 모달 상태 관리
  const [isModalOpen, toggleModal] = useToggle();

  // 메뉴 열림/닫힘 상태
  const [isMenuOpen, toggleMenu] = useToggle();

  return (
    <div className={isDarkMode ? 'dark' : 'light'}>
      <button onClick={toggleDarkMode}>
        테마 변경
      </button>

      <button onClick={toggleModal}>
        모달 {isModalOpen ? '닫기' : '열기'}
      </button>

      <button onClick={toggleMenu}>
        메뉴 {isMenuOpen ? '닫기' : '열기'}
      </button>

      {/* ... */}
    </div>
  );
}
```

## 더 나아가기

useToggle hook은 필요에 따라 더 발전시킬 수 있습니다. 예를 들어

1. 강제로 특정 값으로 설정하는 기능 추가
2. toggle 이벤트에 대한 콜백 함수 지원
3. 토글 상태 변경 이력 추적
4. localStorage와 연동하여 상태 유지

```typescript
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse] as const;
}
```

## 마치며

작은 개선이라도 개발 경험을 크게 향상시킬 수 있습니다.
앞으로도 자주 사용되는 패턴들을 발견하면, 이처럼 custom hook으로 추상화하여 사용하는 것을 고려해보면 좋을 것 같습니다.
이러한 작은 개선들이 모여 더 나은 코드베이스를 만들어갈 수 있으면 좋을 것 같습니다.

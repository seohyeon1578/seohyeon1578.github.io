---
title: "CSS width: stretch - 더 이상 계산기가 필요 없습니다"
description: "마진과 패딩 계산에 지친 개발자들을 위한 새로운 CSS 속성 width: stretch에 대해 알아봅시다."
pubDate: "Nov 24 2024"
heroImage: "../../assets/blog/css-width-stretch-hero.webp"
---

## 들어가며

"아... 또 계산기를 켜야 하나?"

프론트엔드 개발을 하다 보면 이런 한숨을 쉬는 순간이 찾아옵니다. 특히 `width: 100%`와 `margin` 또는 `padding`을 함께 사용할 때마다 말이죠. 저는 최근까지도 이런 상황에서 머리를 싸매고 있었습니다.

## 익숙한 고통의 순간들

아마 여러분들도 비슷한 경험이 있으실 텐데요. 제가 최근에 겪었던 몇 가지 상황을 공유해드리고 싶습니다.

### 1. 이미지 갤러리의 악몽

지난 달, 반응형 이미지 갤러리를 만들고 있었습니다. 각 이미지 주변에 여백을 주고 싶었는데요.

```css
.gallery-item {
  width: 100%;
  padding: 16px;
  // 여기서 이미지가 컨테이너를 벗어나는 문제 발생!
}
```

결과는? 가로 스크롤바가 생기면서 레이아웃이 깨져버렸죠.

### 2. 모바일 메뉴의 함정

또 다른 프로젝트에서 햄버거 메뉴를 클릭하면 나타나는 모바일 네비게이션을 만들던 중이었습니다.

```css
.mobile-nav-item {
  width: 100%;
  padding-inline: 20px;
  // 스크롤바가 생기는 불상사가...
}
```

양쪽에 여백을 주고 싶었을 뿐인데, 메뉴 아이템이 화면을 벗어나버리는 상황이 발생했습니다.

### 3. 폼 디자인의 수학 문제

로그인 폼을 만들면서 입력 필드에 여백을 주려고 했습니다.

```css
.form-input {
  width: calc(100% - 32px);  // 매번 이런 계산이 필요했죠
  margin-inline: 16px;
}
```

`calc()` 함수로 해결은 했지만, 마진 값을 변경할 때마다 계산식도 수정해야 했죠.

## 구원자의 등장: width: stretch

이런 고민을 하던 중 `width: stretch`라는 속성을 알게 되었습니다. 처음에는 반신반의했지만, 사용해보니 정말 놀라웠습니다.

```css
.gallery-item,
.mobile-nav-item,
.form-input {
  width: stretch;
  padding-inline: 16px;  // 패딩을 얼마를 주든 문제없습니다!
}
```

마치 마법처럼 모든 문제가 해결되었습니다:

- 갤러리 이미지들이 깔끔하게 정렬되었고
- 모바일 메뉴가 의도한 대로 딱 맞게 표시되었으며
- 폼 입력 필드도 계산 없이 완벽한 여백을 가지게 되었죠

## 실제 적용 사례

최근 제가 작업한 프로젝트에서는 이런 식으로 활용했습니다:

```css
/* 카드 컴포넌트 */
.card {
  width: stretch;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 모달 내부 컨텐츠 */
.modal-content {
  width: stretch;
  margin: 16px;
  max-width: 500px;
}
```

더 이상 복잡한 계산이나 미디어 쿼리로 인한 골치 아픈 상황이 발생하지 않았습니다.

## 브라우저 지원 상황

물론 아직은 벤더 프리픽스가 필요합니다:

```css
.element {
  width: -webkit-fill-available;
  width: -moz-available;
  width: stretch;
  margin-inline: 24px;
}
```

하지만 이정도의 추가 코드는 감수할 만한 가치가 있죠. 현재 대부분의 [모던 브라우저에서 지원하고 있습니다](https://caniuse.com/mdn-css_properties_width_stretch).

## 마치며

CSS는 계속 발전하고 있습니다. `width: stretch`의 등장으로 우리는 또 하나의 편리한 도구를 얻게 되었네요. 특히 반응형 웹 디자인을 구현할 때, 이 속성은 정말 큰 도움이 될 것 같습니다.

여러분도 다음 프로젝트에서 `width: 100%` 대신 `width: stretch`를 사용해보시는 건 어떨까요? 아마 계산기를 덜 사용하게 될 거예요. 😊

---

참고: [The stretch keyword: a better alternative to width: 100% in CSS?](https://fullystacked.net/stretch/)

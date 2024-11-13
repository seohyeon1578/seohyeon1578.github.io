---
title: "Dynamic Routes의 대안: Next.js에서의 해결책"
description: "Next.js의 App router와 Static Exports 조합에서 Dynamic params와 함께 Dynamic routes를 사용할 수 없는 문제를 다룹니다."
pubDate: "Oct 9 2024"
heroImage: "../../assets/blog/blog-placeholder-5.webp"
---

## 들어가면서

회사에서 어떤 물건의 id를 식별하고 그에 대한 정보를 화면에 보여주는 기능을 작업하였다. 이때 id를 식별하는 방법으로 Dynamic routes를 사용하고자 하였으나, 현재 프로그램 환경 때문에 다른 방안을 선택하게 된 이야기를 하겠다.

현재 프로젝트는 `Next.js`의 `App router`를 사용하고 있으며, `output: export`를 통해 정적(static) 사이트를 배포하고 있다. 여기서 문제가 되는 것은 `App router`와 `output: export` 조합으로 배포할 경우 `Dynamic params`와 함께 `Dynamic routes`를 사용할 수 없다는 점이다.

## Dynamic routes이란?

`Dynamic routes`란 무엇일까? 간단히 말해 웹 페이지의 경로를 동적으로 생성하는 기능이다. 예를 들어, 블로그 포스트의 경우 각각의 포스트를 동일한 페이지 구조로 표시할 수 있으며 이때 내용을 포스트의 id를 식별하여 id에 해당하는 내용을 보여주는 것이다.

여기서 문제가 되는 점은 무엇일까? 바로 사전에 생성한 특정페이지가 아니라면 404 에러가 발생한다는 점이다. 이는 정적 배포와 동적 데이터를 결합하려고 하는 현재 내 시나리오에서 문제가 된다.

## Dynamic routes을 대체하는 방법

Next.js에서 Static Exports(output: export)를 사용할 때 Dynamic params와 함께 Dynamic routes를 사용하는 방법은 2가지가 있다.

1. App router를 포기하는 것이다.
2. Dynamic routes를 포기하고 URL parameters를 대안으로 사용하는 것이다.

이때 각각의 방식에는 장단점이 있기 때문에 상황에 맞추어 잘 선택해야한다.

### App router에서 Pages router로 전환

먼저 소개할 것은 App router를 포기하고 `Pages router`로 전환하는 것이다. 이를 통해 Next.js + Static Exports에서도 Dynamic params와 함께 Dynamic routes를 사용할 수 있다. 이는 [공식 사이트](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports#supported-features-1)에서도 확인할 수 있다.

```javascript
// pages/blog/[id].jsx
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();

  return <p>Post: {router.query.id}</p>;
}
```

위 코드처럼 사용하면 Static Exports에서도 Dynamic params와 함께 Dynamic routes를 활용할 수 있다. 하지만 이 방법은 개발 비용이 꽤 많이 든다는 문제점이 있다.

만약 프로젝트를 시작한 지 얼마 되지 않았다면 App router에서 Page router로 마이그레이션하는 게 큰 부담이 되지 않을 수 있지만, 대규모 프로젝트에서는 감당하기 힘든 작업이 될 수 있다. 게다가 Page router로 변경했을 때 사용할 수 없게 되는 기능들도 생길 수 있다. 예를 들어, server component 같은 기능이 있다. 그래서 나는 현재 상황에서 App router를 Pages router로 전환하는 게 적절하지 않다고 생각했다.

### URL parameters

두 번째 방법은 URL parameters를 사용하는 것이다. 예를 들어, `http://localhost:3000/blog/1234`를 `http://localhost:3000/blog?id=1234`로 사용하는 것이다.

```javascript
// app/blog/page.jsx
// http://localhost:3000/blog?id=1234
"use client";

import { useSearchParams } from "next/navigation";

export default function Post() {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");

  return <p>Post: {id}</p>;
}
```

이런 방식으로 Dynamic routes를 대체할 수 있지만, 이 방법은 <strong>일반적인 관행을 벗어나는 것</strong>이라고 생각한다.

REST에서는 리소스를 식별하는 id를 경로(path)에 포함시키는 게 일반적이고, URL parameters에는 필터링이나 페이징 같은 추가적인 정보를 넣는 게 보통이다.

또한 <strong>SEO 최적화에서도 문제가 생기게 된다.</strong>
예를 들어서 어떤 물건의 url로 소셜 미디어상에 공유를 했을때 노출되는 타이틀, 설명, 이미지 등이 모두 동적으로 생성되지 못하는 문제점이 있다.

그래서 REST의 일반적인 관행과 SEO 최적화를 고려했을 때, URL parameters를 사용하는 것은 적절하지 않을 수 있다.

그러나, 현재로서는 시간적 측면에서 문제가 되는 것이 크기 때문에 어쩔 수 없이 URL parameters를 사용하게 되었다. 현재 페이지는 SEO 최적화를 고려할 필요가 없기때문에 상관이 없지만, 추후에 SEO 최적화하는 방법을 찾아야 할 것 같다.

## 마치며

Dynamic routes를 URL parameters로 대체해서 문제를 해결했지만, Next.js가 App router와 Static Exports 조합에서 Dynamic params와 함께 Dynamic routes를 지원하지 않는 이유는 뭘까? Dynamic routes는 중요한 기능이라고 생각하는데, 비즈니스적으로 필요하지 않다고 판단하는 걸까? Next.js는 정적 사이트보다 SSR에 더 중점을 두고 있기 때문일까? Dynamic routes를 지원하지 않는 정확한 이유는 모르겠지만, 이 기능이 빨리 지원되었으면 좋겠다. 앞으로는 이런 제약을 고려해서 프로젝트를 설계해야 할 것 같다.

참고자료

- https://github.com/vercel/next.js/discussions/55393
- https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- https://nextjs.org/docs/pages/building-your-application/deploying/static-exports

---
title: "Naver Map 타입 안전하게 사용하기"
description: "naver map api와 typescript를 함께 사용하면서 겪은 불편한 내용들을 수정한 것입니다."
pubDate: "Oct 6 2024"
heroImage: "../../assets/blog/blog-placeholder-3.jpg"
---

[naver map api](https://navermaps.github.io/maps.js.ncp/docs/tutorial-2-Getting-Started.html)와 typescript를 함께 사용하면서 겪은 불편한 내용들을 수정한 것입니다.

[@types/navermap](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/navermaps)
## **Literal Type**
기존 mapTypeId는 string타입으로 어떤 문자열이든 들어올 수 있었습니다.
하지만 mapTypeId는 normal, terrain, staellite, hybrid의 문자열만 인식하여 맵을 변환시켜 주고 있었습니다. 개발자 입장에서는 이것을 확인하려면 공식 [Docs](https://navermaps.github.io/maps.js.ncp/docs/tutorial-3-map-types.example.html)로 가서 직접 확인을 해야하는 불편함이 있었습니다.([~~Map객체에는 적혀있지도 않고요...~~](https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Map.html#toc37__anchor))
```typescript
enum MapTypeId {
  NORMAL = "normal",
  TERRAIN = "terrain",
  SATELLITE = "satellite",
  HYBRID = "hybrid",
}
```
저는 이런 번거로움을 해결하기위해 MapTypeId enum타입을 Literal Type으로 분리하기로 하였습니다.

``` typescript
type MapTypeIdLiteral = `${MapTypeId}`;
```
enum타입을 mapTypeId옵션에 지정할 수도 있습니다. 하지만 그렇게 된다면 타입추론이 되지 않아서 공식문서를 한번 확인해야한다는 점은 똑같을 것이라고 생각했습니다. 그래서 위의 코드처럼 LiteralType을 생성하게 되었고, mapTypeId에 해당 타입을 지정함으로써 타입추론이 가능해졌습니다.

```typescript
interface MapOptions {
	...
  	mapTypeId?: MapTypeIdLiteral;
	...
}
```

![](https://velog.velcdn.com/images/seohyeon1578/post/097bfe84-b096-4e59-8477-811fdccda1c1/image.png)
또한 Literal Type을 생성할 때 enum을 이용함으로써 enum타입으로도 작성이 가능하도록 하였으며, 이를 통해 기존에 enum타입을 mapTypeId에 넣어두신 분들도 타입에러가 발생하지 않도록 하였습니다.
```typescript
mapTypeId?: 'normal';

or

mapTypeId?: naver.maps.MapTypeId.NORMAL;
```
## **JSDoc**
이번에는 MapOptions interface에 jsdoc을 추가한 부분인데요.
이 작업을 한 이유는 Literal Type과 비슷합니다.
매번 공식 Docs로 가서 해당 옵션이 어떠한 기능을 하는지 확인하기가 귀찮았기 때문입니다.
그래서 우선적으로 MapOptions interface에 jsdoc을 작성하게되었습니다.
```typescript
interface MapOptions {
        // See https://navermaps.github.io/maps.js.ncp/docs/naver.maps.html#.MapOptions
        /**
         * The image URL or CSS color value to be used as the background for the map element.
         *
         * 지도 요소의 배경으로 사용할 이미지 URL 또는 CSS 색상값입니다.
         */
        background?: string;
        /**
         * Sets the opacity of the map's base tile. The value range is 0 to 1.
         *
         * 지도 기본 타일의 불투명도를 설정합니다. 값의 범위는 0~1입니다.
         */
        baseTileOpacity?: number;
        /**
         * The initial coordinate bounds of the map.
         *
         * 지도의 초기 좌표 경계입니다.
         */
        bounds?: Bounds | BoundsLiteral;
        /**
         * The initial center coordinates of the map.
         *
         * 지도의 초기 중심 좌표입니다.
         */
        center?: Coord | CoordLiteral; // default naver.maps.LatLng(37.5666103, 126.9783882)
        /**
         * The initial zoom level of the map.
         *
         * 지도의 초기 줌 레벨입니다.
         */
        zoom?: number; // default 16
		...
    }
```
![](https://velog.velcdn.com/images/seohyeon1578/post/50ec8026-e7d1-4bc5-a940-fbcef7fc216d/image.png)
이 작업을 통해 어떤 옵션을 지정할 때 공식문서를 뒤져봐야하는 번거로움이 없어질 것입니다.

현재는 MapOptions타입에만 jsDoc을 작성해두었는데요. 지금 작업하고있는 naver map sdk라이브러리작업을 하면서 추가적으로 더 많은 수정을 진행할 예정입니다.


PR
- [JSDoc](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/70565)
- [Literal type](https://github.com/DefinitelyTyped/DefinitelyTyped/pull/70445)
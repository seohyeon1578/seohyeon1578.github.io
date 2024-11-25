---
title: "Next.js 배포 전략 개선기: Static Export에서 Docker로"
description: "Next.js App Router 프로젝트의 배포 전략을 개선하면서 겪은 고민과 의사결정 과정을 공유합니다"
pubDate: "Nov 25 2024"
heroImage: "../../assets/blog/nextjs-deployment.webp"
---

우리 팀은 Next.js App Router와 Static Export를 사용해 서비스를 운영하고 있었습니다. 처음에는 단순히 정적 페이지를 AWS S3에 배포하는 것으로 충분해 보였습니다. 하지만 시간이 지날수록 이 선택이 가져온 부채가 하나둘씩 드러나기 시작했습니다.

SEO를 위한 동적 메타태그가 필요할 때마다 AWS Lambda 함수를 새로 만들어야 했고, Next.js의 이미지 최적화 기능을 사용할 수 없어서 CloudFront Function으로 커스텀 이미지 로더를 구현해야 했습니다. 기능은 동작했지만, 그 과정에서 프로젝트의 복잡도는 계속해서 높아져만 갔습니다.

특히 주니어 개발자 위주로 팀이 구성되어 있는 상황에서, 이러한 AWS 인프라에 대한 이해가 필요한 부분들은 새로운 팀원들에게 큰 부담이 되었습니다. 코드 리뷰 때마다 "이 Lambda 함수는 왜 필요한거죠?", "CloudFront Function은 어떻게 동작하는거에요?"라는 질문이 반복되었고, 인수인계에 많은 시간이 소요되었습니다.

결국 이런 상황은 개발 생산성 저하로 이어졌고, 유지보수는 점점 더 어려워졌습니다. 우리는 이 문제를 근본적으로 해결할 필요가 있었습니다.

## 기존 배포 방식의 한계

### Static Export의 제약사항

Next.js의 Static Export는 빌드 시점에 모든 페이지를 HTML로 생성하는 방식입니다. 처음에는 단순해 보이는 이 방식이 실제 프로덕션 환경에서는 여러 제약사항을 가져왔습니다.

가장 큰 문제는 동적 라우팅 처리였습니다. 예를 들어, 사용자가 지도에서 특정 위치를 선택하면 `/location/[id]`와 같은 동적 라우트로 이동하게 되는데, Static Export에서는 이러한 동적 라우트의 메타데이터를 적절히 처리할 수 없었습니다. Next.js 문서에도 명시되어 있듯이, `dynamicParams: true`를 사용하는 동적 라우트나 `generateStaticParams()`가 없는 동적 라우트는 지원되지 않았죠.

```typescript
// 이런 동적 메타데이터 생성이 불가능했습니다
export async function generateMetadata({ params }: Props) {
const location = await getLocationData(params.id);
return {
title: ${location.name} 상세 정보,
description: location.description
};
}
```

이 문제를 해결하기 위해 우리는 AWS Lambda 함수를 만들어 동적으로 메타태그를 주입하는 방식을 선택했습니다. 하지만 이는 또 다른 복잡성을 가져왔죠.

이미지 최적화도 큰 걸림돌이었습니다. Next.js의 Image 컴포넌트가 제공하는 자동 최적화, lazy loading, blur placeholder 등의 기능을 사용할 수 없었습니다. 결국 CloudFront Function을 이용해 커스텀 이미지 로더를 구현해야 했습니다.

그 외에도 Static Export는 다음과 같은 Next.js의 핵심 기능들을 사용할 수 없었습니다:

- 쿠키 기반의 사용자 설정 저장
- 동적 리다이렉트 처리
- 미들웨어를 통한 요청 제어
- ISR(Incremental Static Regeneration)
- Draft Mode

이러한 제약사항들은 단순히 기능의 부재를 넘어서, 우리가 원하는 사용자 경험을 제공하는 데 큰 걸림돌이 되었습니다.

### 프로젝트 현황

우리 프로젝트는 지도 기반의 서비스로, Next.js App Router와 TypeScript를 주요 기술 스택으로 사용하고 있었습니다. 인프라는 다음과 같은 구조로 구성되어 있었습니다:

```
Route 53 → CloudFront → S3
```

이 구조는 정적 웹사이트 호스팅에 일반적으로 사용되는 방식이었습니다. Route 53에서 도메인을 관리하고, CloudFront를 통해 CDN과 SSL을 처리하며, S3에서 정적 파일을 호스팅하는 구조였죠.

하지만 이 단순해 보이는 구조는 실제로는 꽤 복잡했습니다:

1. **SEO 대응을 위한 추가 인프라**

   - 동적 메타태그 생성을 위한 Lambda@Edge 함수
   - 각 함수별 IAM 역할과 권한 관리

2. **이미지 최적화를 위한 구성**

   - CloudFront Function을 통한 이미지 처리
   - 이미지 캐싱 전략 관리
   - WebP 지원을 위한 추가 설정

3. **배포 파이프라인**
   - GitHub Actions를 통한 CI/CD
   - S3 동기화 및 캐시 무효화 자동화
   - 스테이징/프로덕션 환경 분리

특히 렌더링 전략에서 큰 문제가 있었습니다. 지도 기능이 필요한 페이지와 그렇지 않은 페이지(예: 블로그, 고객센터 등)가 혼재되어 있었지만, Static Export 환경에서는 이를 효율적으로 구분하여 처리할 수 없었습니다. 모든 페이지가 동일한 방식으로 빌드되다 보니, 불필요한 자바스크립트 번들이 모든 페이지에 포함되는 문제가 있었죠.

팀 구성 측면에서도 어려움이 있었습니다. 2-3명의 주니어 개발자로 이루어진 팀에서 이러한 복잡한 인프라를 관리하는 것은 큰 부담이었습니다. DevOps 전문가 없이 프론트엔드 개발자들이 AWS 서비스들을 직접 다루다 보니, 간단한 기능 추가에도 많은 시간이 소요되었습니다.

## 개선 방향 탐색

이러한 문제들을 해결하기 위해, 우리는 먼저 Next.js의 기본 철학으로 돌아가보기로 했습니다. Next.js는 React 애플리케이션을 위한 "하이브리드 프레임워크"입니다. 정적 생성(Static Generation)과 서버 사이드 렌더링(Server-side Rendering)을 페이지 단위로 선택할 수 있다는 것이 Next.js의 핵심 강점인데, 우리는 Static Export를 선택함으로써 이 강점을 완전히 포기하고 있었던 것이죠.

### 빌드 방식 변경 검토

App Router를 사용하고 있었기 때문에, 우리 코드는 이미 Server Component와 Client Component로 잘 구분되어 있었습니다. 문제는 이 구분이 빌드 결과물에 제대로 반영되지 않는다는 것이었죠.

```typescript
// 이미 우리 코드는 이런 식으로 구성되어 있었습니다
// app/location/[id]/page.tsx
export default async function LocationPage({ params }: Props) {
  // 서버에서 실행되는 데이터 페칭
  const location = await getLocationData(params.id);

  return (
    <div>
      <ServerComponent location={location} />
      <ClientComponent />
    </div>
  );
}
```

Next.js의 기본 빌드 방식으로 전환하면, 이러한 구분이 실제 배포 환경에서도 의미를 가질 수 있었습니다. 특히 `next/image`의 자동 최적화나 동적 라우팅에서의 메타데이터 생성 같은 기능들을 추가 개발 없이 바로 사용할 수 있었죠.

### 새로운 배포 전략 검토

배포 전략을 검토하면서 우리가 가장 중점적으로 고려한 것은 다음 세 가지였습니다:

1. **팀의 현실적인 역량**

   - 2-3명의 주니어 개발자로 구성된 팀
   - DevOps 전문가 부재
   - AWS 인프라에 대한 깊은 이해가 필요한 작업 최소화

2. **비용적인 측면**

   - 현재 인프라 유지 비용
   - 새로운 배포 방식 도입 시의 예상 비용
   - 개발자 시간 비용

3. **기술적 자유도**
   - Next.js의 모든 기능 활용 가능성
   - 페이지별 최적화 전략 수립 가능성
   - 향후 기능 확장성

이러한 기준을 가지고 우리는 크게 두 가지 옵션을 검토했습니다:

| 비교 항목       | Vercel                                                                                        | Docker with AWS                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **초기 설정**   | - 빠른 설정 (몇 분 내) <br> - Git 연동으로 즉시 배포 가능 <br> - 추가 설정 불필요             | - 초기 설정에 시간 소요 <br> - Docker, EC2 설정 필요 <br> - CI/CD 파이프라인 직접 구성              |
| **비용**        | - 팀원당 월 $20 고정 비용 <br> - QA 인원 포함 시 월 $100+ <br> - 트래픽 증가에 따른 추가 비용 | - EC2 인스턴스 비용만 발생 <br> - t3.small 기준 월 $15-20 <br> - Reserved Instance로 추가 절감 가능 |
| **유지보수**    | - 자동화된 유지보수 <br> - 플랫폼 차원의 보안 업데이트 <br> - 모니터링 도구 기본 제공         | - 직접 서버 관리 필요 <br> - 보안 업데이트 수동 적용 <br> - 모니터링 도구 직접 설정                 |
| **확장성**      | - 자동 스케일링 <br> - Edge Network 기본 제공 <br> - 글로벌 배포 용이                         | - 수동 스케일링 설정 필요 <br> - 리전 확장 시 추가 작업 필요 <br> - 클라우드 벤더 이전 용이         |
| **개발자 경험** | - 최고 수준의 DX <br> - 자동화된 프리뷰 배포 <br> - 통합된 분석 도구                          | - 기본적인 설정 필요 <br> - 프리뷰 환경 직접 구성 <br> - 분석 도구 직접 연동                        |
| **제어/자유도** | - 플랫폼 제약 존재 <br> - 특정 기능 Enterprise 플랜 필요 <br> - Vercel 종속성                 | - 완전한 제어 가능 <br> - 원하는 대로 커스터마이즈 <br> - 벤더 종속성 없음                          |

이러한 비교 분석을 통해 우리는 Docker with AWS 방식을 선택하게 되었습니다. 특히 비용 효율성과 기술적 자유도 측면에서 우리 팀 상황에 더 적합하다고 판단했습니다.

## 최종 선택: Docker & EC2

긴 고민 끝에 우리는 Docker와 EC2를 선택했습니다. 이 결정에는 몇 가지 중요한 이유가 있었습니다.

### 선택 이유

첫째로, **비용 효율성**입니다. Vercel의 월 $100 고정 비용과 비교했을 때, EC2 인스턴스는 훨씬 저렴했습니다. t3.small 인스턴스를 사용할 경우 월 $15-20 정도의 비용이면 충분했죠. 더구나 Reserved Instance를 활용하면 이 비용을 더 줄일 수 있었습니다.

둘째로, **기술적 자유도**입니다. Docker를 사용함으로써:

- Next.js의 모든 기능을 제약 없이 사용할 수 있게 되었습니다
- 페이지별로 최적의 렌더링 전략을 선택할 수 있게 되었습니다
- 필요한 경우 다른 클라우드 제공자로의 이전도 용이해졌습니다

셋째로, **관리 복잡도의 감소**입니다. 기존에는 여러 AWS 서비스(Lambda@Edge, CloudFront Function 등)를 관리해야 했지만, 이제는 EC2 인스턴스와 Docker 컨테이너만 관리하면 됩니다. 특히 `output: 'standalone'` 옵션을 적용한 Docker 이미지는 크기가 작고 관리가 용이했습니다.

### 실제 구현

배포 파이프라인은 다음과 같이 구성했습니다:

```bash
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

CMD ["node", "server.js"]
```

이 Docker 이미지는 multi-stage build를 사용하여 최종 이미지 크기를 최소화했습니다. 그리고 GitHub Actions를 통해 자동 배포 파이프라인을 구성했습니다:

```yaml
name: Deploy to EC2
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build and push Docker image
        run: |
          docker build -t my-nextjs-app .
          docker push my-registry/my-nextjs-app

      - name: Deploy to EC2
        run: |
          # EC2 인스턴스에 SSH 접속
          # 새 Docker 이미지 pull 및 실행
```

### 개선된 점

이러한 변경 후 우리가 얻은 가장 큰 이점들은 다음과 같습니다:

1. **렌더링 최적화**

   - 지도가 필요한 페이지와 그렇지 않은 페이지를 효율적으로 구분
   - 동적 라우트에서의 메타데이터 자동 생성
   - 이미지 최적화 기능 활용

2. **개발 생산성 향상**

   - AWS 리소스 관리 부담 감소
   - 배포 프로세스 단순화
   - 코드 복잡도 감소

3. **성능 개선**
   - 번들 크기 최적화
   - 서버 사이드 렌더링을 통한 초기 로딩 성능 개선
   - 효율적인 캐싱 전략 구현

특히 주목할 만한 점은 새로운 기능 개발 시간이 크게 단축되었다는 것입니다. 이전에는 AWS 리소스 설정에 많은 시간을 할애해야 했지만, 이제는 Next.js의 기본 기능만으로도 대부분의 요구사항을 충족할 수 있게 되었습니다.

## 마치며

이번 배포 전략 개선 과정을 통해 몇 가지 중요한 교훈을 얻을 수 있었습니다.

첫째, **프레임워크의 기본 철학을 존중하는 것의 중요성**입니다. Next.js는 하이브리드 렌더링을 지원하는 프레임워크임에도 불구하고, 우리는 Static Export만을 고집하면서 많은 이점을 포기하고 있었습니다. 때로는 한 발 뒤로 물러서서 우리의 선택을 다시 돌아보는 것이 필요합니다.

둘째, **현실적인 제약 조건 내에서의 최적화**입니다. Vercel은 분명 최고의 개발자 경험을 제공하지만, 우리 팀의 상황에서는 비용이 큰 부담이었습니다. Docker와 EC2의 조합은 초기 설정에 시간이 좀 더 필요했지만, 장기적으로 봤을 때 더 지속 가능한 선택이었습니다.

셋째, **복잡성은 때로 단순함으로 해결된다**는 점입니다. 우리는 Static Export의 한계를 극복하기 위해 여러 AWS 서비스를 조합했고, 이는 결과적으로 더 큰 복잡성을 낳았습니다. 하지만 Next.js의 기본 기능을 활용하는 방향으로 전환하면서, 오히려 전체적인 시스템이 단순해졌습니다.

### 앞으로의 과제

물론 아직도 개선의 여지는 남아있습니다:

1. **모니터링 강화**

   - 서버 사이드 렌더링으로 인한 성능 지표 모니터링
   - 에러 추적 및 로깅 시스템 구축

2. **확장성 준비**

   - 트래픽 증가에 따른 스케일링 전략 수립
   - 다중 리전 배포 고려

3. **개발자 경험 개선**
   - 로컬 개발 환경과 프로덕션 환경의 일관성 확보
   - 배포 프로세스 자동화 강화

이러한 과제들이 남아있지만, 현재의 개선된 구조는 이러한 과제들을 해결해 나가는 데 훨씬 더 좋은 기반이 될 것이라 확신합니다.

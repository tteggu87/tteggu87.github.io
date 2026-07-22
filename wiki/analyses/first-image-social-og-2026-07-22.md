---
title: 공개 글 첫 이미지의 소셜 OG 자동 선택
type: analysis
status: implemented
source_of_truth: false
runtime_sources:
  - quartz/plugins/transformers/firstImageSocialImage.ts
  - quartz/plugins/transformers/firstImageSocialImage.test.ts
  - quartz.ts
  - .quartz/plugins/og-image/src/emitter.tsx
as_of: 2026-07-22
---

# 공개 글 첫 이미지의 소셜 OG 자동 선택

## 무엇을 바꿨나

`content/notes/`와 `content/projects/`의 공개 글은 별도의 `socialImage`를 명시하지 않아도 첫 번째 적합한 로컬 본문 이미지를 소셜 미리보기 이미지로 사용한다. 적합한 이미지가 없으면 기존 `og-image` 플러그인이 글 제목·설명으로 1200×630 WebP를 생성한다.

최종 우선순위는 다음과 같다.

```text
명시적 socialImage 또는 image·cover
  → 첫 번째로 발견되는 로컬 PNG·JPEG·WebP
  → 기존 글별 생성형 OG WebP
  → 가상 페이지의 사이트 기본 OG
```

이미지를 OG 전용 위치에 복사하거나 새 파일로 저장하지 않는다. Quartz의 Assets emitter가 이미 `content/attachments/` 파일을 같은 공개 경로로 내보내므로, transformer는 그 절대 공개 URL만 frontmatter의 빌드 시점 데이터에 주입한다. 원본 Markdown frontmatter는 수정하지 않는다.

## 어떻게 동작하나

`quartz.ts`는 YAML 플러그인을 불러온 다음 로컬 `FirstImageSocialImage` transformer를 마지막에 등록한다. 단일 스레드 빌드와 worker 빌드는 모두 루트 `quartz.ts`를 불러오므로 같은 규칙을 사용한다.

Transformer는 Markdown AST의 이미지 노드를 문서 순서대로 검사한다.

1. 글 경로가 `notes/` 또는 `projects/`인지 확인한다.
2. `socialImage`, `image`, `cover` 중 하나가 이미 있으면 아무것도 하지 않는다.
3. 외부 URL, 루트 URL, data URI, SVG, GIF와 존재하지 않는 파일을 건너뛴다.
4. 콘텐츠 루트 안에 실제로 존재하는 첫 PNG·JPEG·WebP를 찾는다.
5. Assets emitter와 같은 `slugifyFilePath` 규칙으로 공개 경로를 계산한다.
6. `https://<baseUrl>/<asset-path>`를 빌드 메모리의 `frontmatter.socialImage`에 넣는다.
7. 이후 기존 OG emitter는 `socialImage`가 있으면 별도 WebP 생성을 건너뛰고 그 URL을 `og:image`와 `twitter:image`로 출력한다.

이 선택은 emitter보다 앞선 parse/transform 단계에서 끝난다. 따라서 페이지 emitter와 OG emitter가 병렬 실행되는 단계에서 데이터를 뒤늦게 바꾸는 경쟁 조건이 없다.

## 왜 이 방식을 선택했나

이 블로그의 공개 글은 첫 콘텐츠로 가로형 대표 인포그래픽을 두는 발행 계약을 이미 사용한다. 그래서 일반 블로그보다 “첫 번째 적합한 로컬 이미지 = 대표 이미지”라는 가정의 신뢰도가 높다. 글마다 직접 `socialImage`를 반복 입력하지 않아도 기존 글과 새 글에 같은 정책을 적용할 수 있다.

설치된 `.quartz/plugins/og-image`를 직접 수정하지 않은 이유는 플러그인 복원이나 업데이트 때 변경이 사라질 수 있기 때문이다. 별도 emitter를 추가하지 않은 이유는 Quartz가 일반 emitter들을 병렬로 실행해 OG 데이터 주입과 페이지 렌더링 사이에 순서 경쟁이 생길 수 있기 때문이다.

로컬 transformer는 다음 특성을 유지한다.

- 기존 OG 플러그인과 설정을 그대로 사용한다.
- 이미지가 없는 글의 생성형 OG를 보존한다.
- 명시적 `socialImage`로 예외를 언제든 덮어쓸 수 있다.
- 태그, 폴더, 홈페이지 같은 비글 페이지에는 영향을 주지 않는다.
- 첨부 이미지를 중복 저장하지 않는다.

## 검증 계약

`firstImageSocialImage.test.ts`는 다음을 회귀 조건으로 고정한다.

- 존재하는 로컬 이미지를 올바른 절대 공개 URL로 변환한다.
- 외부·미지원·누락 이미지와 비공개 글 범위를 제외한다.
- 첫 번째 적합한 이미지를 선택한다.
- 명시적 `socialImage`를 보존한다.

최종 빌드 검증에서는 이미지가 있는 기존 공개 글의 HTML이 `/attachments/...` PNG를 `og:image`로 가리키는지, 이미지가 없는 페이지가 기존 생성형 WebP 또는 기본 OG를 유지하는지 함께 확인한다.

## 갱신 조건

다음 조건이 바뀌면 이 결정을 다시 검토한다.

- 공개 글의 첫 이미지가 대표 이미지라는 발행 계약이 바뀜
- 지원할 소셜 플랫폼 때문에 AVIF·SVG·GIF가 필요해짐
- `baseUrl` 또는 Assets emitter의 공개 경로 규칙이 바뀜
- Quartz transformer나 emitter 실행 순서가 바뀜
- 첫 이미지 대신 별도 대표 이미지 선택 UI가 필요해짐

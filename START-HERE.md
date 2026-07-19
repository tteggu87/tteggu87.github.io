# tteggu의 지식창고 시작 안내

이 프로젝트는 Quartz v4.5.2로 만든 한국어 디지털 가든입니다.

## 글 쓰기

`content/` 폴더에 Markdown 파일을 추가합니다.

```md
---
title: 새 글 제목
date: 2026-07-19
tags:
  - 공부
description: 글을 한 문장으로 설명합니다.
---

# 새 글 제목

본문을 작성하고 [[다른 글 제목]]처럼 연결합니다.
```

## 내 정보로 바꾸기

1. `quartz.config.ts`의 `pageTitle`을 원하는 사이트 이름으로 변경합니다.
2. 사이트 주소는 현재 연결된 계정의 `tteggu87.github.io`로 설정되어 있습니다.
3. GitHub 링크도 `https://github.com/tteggu87`로 연결되어 있습니다.
4. `content/about.md`를 자신의 소개로 수정합니다.

## 로컬에서 보기

```bash
npm install
npx quartz build --serve
```

브라우저에서 `http://localhost:8080`을 엽니다. Markdown 파일을 저장하면 화면이 자동으로 갱신됩니다.

## GitHub Pages에 공개하기

1. GitHub에서 `내아이디.github.io`라는 공개 저장소를 만듭니다.
2. 이 프로젝트를 해당 저장소에 push합니다.
3. 저장소의 Settings → Pages에서 Source를 **GitHub Actions**로 선택합니다.
4. `.github/workflows/deploy.yml`이 사이트를 자동으로 빌드하고 공개합니다.

기존 예시 글은 자유롭게 지우거나 자신의 글로 교체할 수 있습니다.

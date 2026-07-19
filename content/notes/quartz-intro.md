---
title: Quartz로 만드는 디지털 가든
date: 2026-07-19
tags:
  - Quartz
  - Markdown
  - 디지털가든
description: Markdown 노트를 검색과 그래프가 있는 웹사이트로 바꾸는 구조를 소개합니다.
---

# Quartz로 만드는 디지털 가든

Quartz는 Markdown 노트를 정적 웹사이트로 변환하는 무료 오픈소스 도구입니다.

## 핵심 구조

```text
Markdown 작성 → Quartz 빌드 → HTML/CSS/JS 생성 → 웹에 배포
```

글에서 `[[다른 노트]]`를 연결하면 Quartz가 링크와 백링크를 계산하고 그래프에도 반영합니다. 이 특징 때문에 [[notes/connected-thinking|연결해서 생각하는 방식]]과 잘 맞습니다.

## 장점

- 별도 데이터베이스가 필요 없습니다.
- 검색, 태그, 백링크, 그래프를 기본 제공합니다.
- 모든 글을 평범한 Markdown 파일로 보관합니다.
- Git으로 변경 이력을 남길 수 있습니다.

실제 구성 과정은 [[projects/my-digital-garden|프로젝트 노트]]에 기록합니다.

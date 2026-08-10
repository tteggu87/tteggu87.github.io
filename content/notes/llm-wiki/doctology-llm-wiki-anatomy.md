---
title: "2. DocTology LLM Wiki 해부학: 폴더 구조와 실행 경계를 함께 읽는 법"
description: "DocTology를 처음 쓰는 사람을 위한 안내입니다. 원본 저장소와 운영 Wiki를 분리하는 이유, wiki-only 프로필의 최소 구조, 첫 문서가 Source가 되는 순간을 순서대로 따라갑니다."
date: 2026-08-06
tags:
  - LLMWiki
  - DocTology
  - AI에이전트
  - 지식관리
  - Markdown
  - Ontology
---

![DocTology 저장소 내려받기, wiki-only 작업 공간 생성, 첫 문서 등록, 에이전트 유지보수까지 초보자가 따라갈 네 단계를 보여 주는 Quick Start 인포그래픽](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-infographic.png)

문서와 메모가 쌓일수록 “어디에 적었더라?”보다 더 큰 문제가 생깁니다. 새 대화를 열 때마다 AI에게 배경을 다시 설명해야 하고, 지난번에 정리한 결론이 다음 작업에 이어지지 않습니다. DocTology는 이 문제를 **Markdown Wiki와 저장소 안의 운영 규칙**으로 풀어보려는 도구입니다.

> [!summary] 핵심 결론
> DocTology는 원본 저장소와 운영 Wiki를 두 개의 폴더로 분리합니다. 처음에는 가장 단순한 `wiki-only` 프로필로 시작해서 원문 등록(`ingest`)과 구조 검사(`lint`)의 루프에 익숙해진 뒤, 지식 충돌과 승인 상태를 추적해야 할 때 `llm-first-ontology` 프로필로 확장합니다. 첫날의 목표는 지식 그래프가 아니라, 원문 하나가 Source 페이지가 되는 흐름을 눈으로 확인하는 것입니다.

## 1. 왜 실행 위치가 첫 번째 장벽인가

DocTology를 처음 만지는 사람이 가장 자주 겪는 오류는 도구와 운영 공간을 섞는 것입니다. DocTology 저장소는 Wiki를 **만드는** 도구이고, 생성된 작업 공간은 Wiki를 **운영하는** 곳입니다. 두 위치는 홈 디렉터리 아래에 나란히 두는 것이 기본 흐름입니다.

```text
~/doctology      DocTology 원본 저장소 — bootstrap 스크립트가 있는 곳
~/my-llm-wiki    내가 실제로 운영할 Wiki — ingest·reindex·lint·status·log 실행
```

이 둘을 섞으면 "스크립트를 찾을 수 없다"는 오류부터 시작해 원본 저장소를 오염시키는 실수까지 이어집니다. 이후 모든 명령은 `~/my-llm-wiki` 안에서 실행합니다.

## 2. 왜 wiki-only 프로필로 시작하는가

DocTology bootstrap의 기본 프로필은 `llm-first-ontology`입니다. 옵션을 생략하면 `warehouse/jsonl/`의 구조화된 근거, `intelligence/`의 정책과 계약, proposal과 review 상태, helper LLM 설정이 함께 생성됩니다. 이 구성이 나쁜 것은 아니지만, 첫날부터 확인해야 할 지점이 너무 많습니다.

`--profile wiki-only`로 시작하면 남는 것은 다섯 군데뿐입니다.

```text
my-llm-wiki/
├── AGENTS.md          # 앞으로 에이전트가 따라야 할 운영 규칙
├── raw/inbox/         # 원문을 넣는 곳
├── wiki/              # 사람이 읽는 연결된 지식 문서
├── wiki/_meta/        # 인덱스, 대시보드, 작업 로그
└── scripts/llm_wiki.py
```

원문, Source 페이지, Wiki 링크, 인덱스, 로그와 Git 검토 — 이 여섯 가지 흐름을 먼저 익히는 편이 안전합니다. 같은 주장에 서로 다른 출처가 붙어 충돌을 추적해야 하거나, 제안된 지식과 승인된 지식을 명확히 나눠야 하는 요구가 반복해서 생기면 그때 `llm-first-ontology`를 검토합니다. 더 많은 폴더가 더 좋은 Wiki를 뜻하지는 않습니다.

## 3. 두 줄로 Wiki가 생기는 순간

준비물은 `git`과 `python3`뿐입니다. 별도 데이터베이스나 그래프 서버는 필요하지 않습니다.

![DocTology 원본 저장소에서 bootstrap 스크립트를 실행해 독립된 my-llm-wiki 작업 공간을 만들고, 이후 명령은 새 작업 공간 안에서 실행하는 위치 구분을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-01.png)

```bash
cd ~
git clone https://github.com/tteggu87/DocTology.git doctology
cd doctology
python3 .agents/skills/llm-wiki-bootstrap/scripts/bootstrap_llm_wiki.py \
  ../my-llm-wiki \
  --profile wiki-only
```

bootstrap은 DocTology 원본 저장소 루트에서 실행합니다. 생성된 작업 공간으로 이동한 뒤 `status`와 `lint`가 정상 실행되면 준비가 끝납니다.

```bash
cd ../my-llm-wiki
python3 scripts/llm_wiki.py status
python3 scripts/llm_wiki.py lint
```

이 시점의 Wiki는 아직 비어 있습니다. 여기서부터가 본격적인 사용입니다.

## 4. 첫 문서가 Source 페이지가 되는 순간

`raw/inbox/first-note.md`를 만들고 간단한 메모를 저장합니다.

```text
첫 번째 자료

LLM Wiki는 원문을 보존하고, 에이전트가 여러 자료를 연결한 결과를 Wiki에 남긴다.

처음에는 자동화 범위를 작게 유지하고 Git diff로 변경을 확인한다.
```

이 문서를 등록하면 원문은 그대로 남고, `wiki/sources/` 아래에 Source 페이지가 생기며, `wiki/_meta/index.md`와 `log.md`가 갱신됩니다.

![raw/inbox의 첫 Markdown 문서가 ingest를 거쳐 wiki/sources의 Source 페이지가 되고, reindex로 index와 log가 갱신되며 lint와 status로 구조를 확인하는 흐름을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-02.png)

```bash
python3 scripts/llm_wiki.py ingest raw/inbox/first-note.md
python3 scripts/llm_wiki.py reindex
python3 scripts/llm_wiki.py lint
python3 scripts/llm_wiki.py status
```

여기서 `ingest`는 **원문 등록**입니다. 여러 문서를 이해해서 개념 문서를 자동 완성하거나, 사실을 승인된 지식으로 확정하는 단계는 아닙니다. 원문 등록 성공은 의미 통합 완료와 답변 정확도 검증과 다른 일입니다. 이 구분만 기억해도 자동화 결과를 과신하는 실수를 크게 줄일 수 있습니다.

## 5. 에이전트에게 맡기는 법: AGENTS.md

생성된 폴더를 Codex처럼 로컬 저장소를 읽고 수정할 수 있는 에이전트에서 열고, 짧은 요청 하나를 보냅니다.

```text
AGENTS.md를 먼저 읽고 지침을 따라줘.
wiki/_meta/index.md와 최근 wiki/_meta/log.md를 확인해줘.
raw/inbox/first-note.md와 생성된 Source 페이지를 읽고,
기존 페이지와 겹치지 않는 범위에서 필요한 Wiki 연결을 정리해줘.
작업 후 reindex와 lint를 실행하고 변경 파일을 알려줘.
```

이 요청의 핵심은 "내 문서를 요약해줘"가 아니라 **저장소 안의 운영 규칙을 먼저 읽고, 기존 Wiki와 연결하고, 변경을 검증하라**고 명시하는 것입니다. `AGENTS.md`는 새 대화를 시작한 에이전트가 가장 먼저 읽어야 할 운영 규칙입니다.

에이전트 작업이 끝나면 `git diff`로 원하지 않는 변경이 없는지 확인하고 `lint`를 다시 실행합니다. 원치 않는 변경은 되돌릴 수 있습니다. LLM Wiki를 오래 쓰려면 자동 생성 능력보다 이 검토 습관이 더 중요합니다.

## 6. 매번 반복할 기본 루프

새 자료가 들어올 때마다 반복하는 순서는 짧습니다.

```text
1. raw/inbox/에 원문 저장
2. ingest로 Source 등록
3. 에이전트에게 관련 Wiki 연결 요청
4. reindex와 lint 실행
5. git diff 검토
6. 괜찮으면 commit
```

명령은 다섯 개만 기억하면 됩니다.

- `ingest` — 원문을 Source 페이지로 등록. 원문이 삭제되거나 이동하지 않았는지 확인합니다.
- `reindex` — Wiki 인덱스와 메타 페이지 갱신. 새 Source 페이지가 인덱스에 보이는지 확인합니다.
- `lint` — 링크·frontmatter·고아 페이지 검사. 오류 수가 0이거나 이유를 이해했는지 확인합니다.
- `status` — 현재 Wiki 상태 요약. Raw와 Wiki 페이지 수가 예상대로 늘었는지 확인합니다.
- `log` — 최근 유지보수 기록 확인. 어떤 작업이 언제 기록됐는지 확인합니다.

## 7. 폴더 역할을 읽는 법

Quick Start를 마친 뒤에는 폴더 역할을 이렇게 기억하면 됩니다.

- `raw/` — 원문 보관. 요약본으로 대체하지 않습니다.
- `wiki/sources/` — 원문을 추적할 Source 페이지.
- `wiki/concepts/`, `wiki/analyses/` 등 — 여러 Source를 연결해 사람이 읽는 지식으로 정리하는 곳.
- `wiki/_meta/` — 전체 읽기 경로, 최근 작업, 상태를 확인하는 곳.
- `AGENTS.md` — 새 대화를 시작한 에이전트가 가장 먼저 읽어야 할 운영 규칙.

`llm-first-ontology`에서는 여기에 `warehouse/jsonl/`과 `intelligence/`가 추가됩니다. 그래도 사람이 읽고 수정하는 중심 화면은 `wiki/`입니다.

## 8. 자주 막히는 지점

![초보자가 겪는 네 가지 대표 오류를 실행 위치, 등록과 의미 통합의 차이, helper LLM 상태, 프로필 선택으로 나누고 해결 순서를 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-03.png)

### bootstrap 스크립트를 찾지 못합니다

DocTology 저장소 루트가 아닌 곳에서 실행했을 가능성이 큽니다. `cd ~/doctology`로 이동한 뒤 전체 경로로 실행합니다.

### 생성된 Wiki에 `llm_full_ingest.py`가 없습니다

정상일 수 있습니다. `llm_full_ingest.py`는 DocTology 원본 저장소의 reference runtime 기능이며, bootstrap으로 만든 작업 공간에 자동 복사되지 않습니다. 초보자 Quick Start에서는 `python3 scripts/llm_wiki.py ingest raw/inbox/문서.md`를 사용합니다.

### ingest는 성공했는데 Wiki 내용이 풍부해지지 않습니다

`ingest`는 Source 등록입니다. 의미를 연결하는 작업은 에이전트에게 별도로 요청해야 합니다. "AGENTS.md를 읽고, 새 Source와 관련된 기존 Wiki 페이지를 찾아 중복 없이 연결하고 reindex와 lint까지 실행해줘"라고 보냅니다.

### `agent_handoff`가 나옵니다

`llm-first-ontology`에서 helper LLM이 꺼져 있을 때 볼 수 있는 정상적인 중단 상태입니다. 의미 작업을 하지 않았는데 성공한 것처럼 꾸미지 않고, 현재 대화의 에이전트에게 넘길 자료를 만들었다는 뜻입니다.

### lint 오류가 생깁니다

오류를 숨기지 말고 메시지에 나온 파일을 먼저 확인합니다. 초보자가 자주 만드는 문제는 세 가지입니다. 존재하지 않는 Wiki 페이지를 가리키는 링크, frontmatter가 없는 새 Wiki 페이지, 인덱스 어디에서도 연결되지 않은 고아 페이지. 에이전트에게 오류 메시지를 그대로 보여 주고 수정한 뒤 다시 `lint`를 실행하면 됩니다.

## 9. 첫날의 성공 기준

첫날의 성공은 "AI가 모든 문서를 이해했다"가 아닙니다. 아래 여섯 가지가 되면 LLM Wiki의 가장 중요한 수명주기를 이미 경험한 것입니다.

- 새 Wiki 작업 공간을 만들었다.
- 원문 하나를 `raw/inbox/`에 저장했다.
- Source 페이지가 생겼다.
- index와 log가 갱신됐다.
- 에이전트가 `AGENTS.md`를 읽고 변경했다.
- `git diff`와 `lint`로 결과를 검토했다.

다음 단계로는 문서를 3~5개 넣고, 에이전트가 같은 개념을 중복 페이지로 만들지 않는지 확인해 보는 것을 권합니다. 반복 작업에서 충돌·근거 추적·승인 상태가 필요해질 때 `llm-first-ontology`와 `llm-wiki-ontology-ingest`를 검토하면 됩니다.

## 검증 범위와 한계

- 공식 DocTology `main` 커밋 `a4ba7ebb78577287f454724252dfc84f438253dc`에서 bootstrap 동작을 확인했습니다.
- `wiki-only`와 `llm-first-ontology` 작업 공간 생성, 초기 `status`·`lint`, `wiki-only`의 Source 등록·reindex·lint·status를 실행했습니다.
- `wiki-only` 등록 실습에서는 Raw 파일, Source 페이지, index와 log 갱신을 확인했습니다.
- helper LLM을 이용한 실제 의미 통합, 장기 운영, 비용·지연, 보안·권한과 대규모 문서 처리는 이 글에서 검증하지 않았습니다.

## 관련 글

- [1. LLM Wiki가 뭔가? 안드레이 카파시가 건넨 지식 성장 루프](../../notes/llm-wiki/llm-wiki-origin-and-implementations)
- [3. LLM Wiki는 네 종류의 파일로 시작한다: source · candidate · canonical · receipt MVP](../../notes/llm-wiki/llm-wiki-authority-lifecycle-mvp)
- [25. LLM Wiki는 RAG를 대체하는가: 저장과 검색 사이의 이중 컴파일](../../notes/온톨로지/llm-wiki-double-compilation)

## 출처

- [tteggu87/DocTology](https://github.com/tteggu87/DocTology)
- [검증한 DocTology 커밋](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc)
- [DocTology llm-wiki-bootstrap skill](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc/.agents/skills/llm-wiki-bootstrap)
- [Andrej Karpathy, LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

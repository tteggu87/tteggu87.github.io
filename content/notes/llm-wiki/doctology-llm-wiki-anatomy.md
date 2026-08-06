---
title: "2. DocTology LLM Wiki 해부학: 폴더 구조와 실행 경계를 함께 읽는 법"
description: "DocTology를 처음 쓰는 사람을 위한 Quick Start입니다. 저장소를 내려받고, 가장 단순한 LLM Wiki를 만들고, 첫 문서를 등록한 뒤 Codex 같은 에이전트에게 유지보수를 맡기는 순서를 따라갑니다."
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

문서와 메모가 쌓일수록 “어디에 적었더라?”보다 더 큰 문제가 생깁니다. 새 대화를 열 때마다 AI에게 배경을 다시 설명해야 하고, 지난번에 정리한 결론이 다음 작업에 이어지지 않습니다.

DocTology는 이 문제를 **Markdown Wiki와 저장소 안의 운영 규칙**으로 풀어보려는 도구입니다. 오늘 목표는 거창한 지식 그래프를 만드는 것이 아닙니다. 새 폴더에 LLM Wiki를 만들고, 문서 하나를 넣고, Source 페이지와 인덱스가 생기는 것까지 확인하면 됩니다.

> [!summary] 10분 목표
> `DocTology` 저장소를 내려받고 `wiki-only` 프로필로 새 작업 공간을 만듭니다. `raw/inbox/`에 첫 문서를 넣은 뒤 `ingest → reindex → lint → status`를 실행합니다. 마지막으로 생성된 폴더를 Codex 같은 에이전트에서 열고 `AGENTS.md`를 따르도록 요청하면 기본 LLM Wiki 사용 준비가 끝납니다.

## 0. 먼저 준비할 것

터미널에서 아래 두 명령이 실행되면 충분합니다.

```bash
git --version
python3 --version
```

별도 데이터베이스나 그래프 서버는 필요하지 않습니다. 이 Quick Start는 가장 단순한 `wiki-only` 프로필을 사용합니다.

작업 폴더 이름은 자유롭게 바꿔도 됩니다. 아래 예시는 홈 디렉터리 아래에 `doctology`와 `my-llm-wiki`를 나란히 만드는 흐름입니다.

```text
~/doctology
~/my-llm-wiki
```

## 1. DocTology를 내려받습니다

```bash
cd ~
git clone https://github.com/tteggu87/DocTology.git doctology
cd doctology
```

여기까지 오면 현재 위치는 **DocTology 원본 저장소의 루트**입니다. 다음 단계의 bootstrap 스크립트는 이 위치에서 실행합니다.

## 2. 가장 단순한 LLM Wiki를 만듭니다

![DocTology 원본 저장소에서 bootstrap 스크립트를 실행해 독립된 my-llm-wiki 작업 공간을 만들고, 이후 명령은 새 작업 공간 안에서 실행하는 위치 구분을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-01.png)

처음에는 `wiki-only`로 시작하는 편이 쉽습니다. 파일이 적고, 실패 원인을 찾기 쉽고, Markdown Wiki의 기본 흐름을 먼저 익힐 수 있습니다.

```bash
python3 .agents/skills/llm-wiki-bootstrap/scripts/bootstrap_llm_wiki.py \
  ../my-llm-wiki \
  --profile wiki-only
```

이제 새 작업 공간으로 이동합니다.

```bash
cd ../my-llm-wiki
python3 scripts/llm_wiki.py status
python3 scripts/llm_wiki.py lint
```

`status`와 `lint`가 실행되면 bootstrap은 정상적으로 끝난 것입니다.

생성된 폴더에서 처음 눈여겨볼 곳은 다섯 군데뿐입니다.

```text
my-llm-wiki/
├── AGENTS.md          # 앞으로 에이전트가 따라야 할 운영 규칙
├── raw/inbox/         # 원문을 넣는 곳
├── wiki/              # 사람이 읽는 연결된 지식 문서
├── wiki/_meta/        # 인덱스, 대시보드, 작업 로그
└── scripts/llm_wiki.py
```

> [!important] 실행 위치를 바꿔야 합니다
> Wiki를 만든 뒤부터는 `~/doctology`가 아니라 `~/my-llm-wiki` 안에서 명령을 실행합니다. 초보자가 가장 자주 겪는 오류가 원본 저장소와 생성된 Wiki 작업 공간을 섞는 것입니다.

## 3. 첫 문서를 넣습니다

`raw/inbox/first-note.md` 파일을 만들고 다음처럼 간단한 메모를 저장합니다.

```markdown
첫 번째 자료

LLM Wiki는 원문을 보존하고, 에이전트가 여러 자료를 연결한 결과를 Wiki에 남긴다.

처음에는 자동화 범위를 작게 유지하고 Git diff로 변경을 확인한다.
```

이제 이 문서를 Source 페이지로 등록합니다.

```bash
python3 scripts/llm_wiki.py ingest raw/inbox/first-note.md
python3 scripts/llm_wiki.py reindex
python3 scripts/llm_wiki.py lint
python3 scripts/llm_wiki.py status
```

![raw/inbox의 첫 Markdown 문서가 ingest를 거쳐 wiki/sources의 Source 페이지가 되고, reindex로 index와 log가 갱신되며 lint와 status로 구조를 확인하는 흐름을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-02.png)

정상적으로 끝나면 다음 변화가 보입니다.

- `raw/inbox/first-note.md` 원문은 그대로 남습니다.
- `wiki/sources/` 아래에 Source 페이지가 생깁니다.
- `wiki/_meta/index.md`에 새 페이지가 연결됩니다.
- `wiki/_meta/log.md`에 등록 기록이 추가됩니다.
- `lint`가 깨진 링크와 기본 문서 구조를 검사합니다.

여기서 `ingest`는 **원문 등록**입니다. 여러 문서를 이해해서 개념 문서를 자동 완성하거나, 사실을 승인된 지식으로 확정하는 단계는 아닙니다.

```text
원문 등록 성공
≠ 의미 통합 완료
≠ 답변 정확도 검증
```

이 구분만 기억해도 자동화 결과를 과신하는 실수를 크게 줄일 수 있습니다.

## 4. Codex 같은 에이전트에서 폴더를 엽니다

이제 `my-llm-wiki` 폴더를 Codex처럼 로컬 저장소를 읽고 수정할 수 있는 에이전트에서 엽니다.

첫 요청은 길게 쓸 필요가 없습니다. 아래 문장을 그대로 사용해도 됩니다.

```text
AGENTS.md를 먼저 읽고 지침을 따라줘.
wiki/_meta/index.md와 최근 wiki/_meta/log.md를 확인해줘.
raw/inbox/first-note.md와 생성된 Source 페이지를 읽고,
기존 페이지와 겹치지 않는 범위에서 필요한 Wiki 연결을 정리해줘.
작업 후 reindex와 lint를 실행하고 변경 파일을 알려줘.
```

이 요청의 핵심은 “내 문서를 요약해줘”가 아닙니다. **저장소 안의 운영 규칙을 먼저 읽고, 기존 Wiki와 연결하고, 변경을 검증하라**고 명시하는 것입니다.

에이전트 작업이 끝나면 아래 두 가지를 확인합니다.

```bash
git diff
python3 scripts/llm_wiki.py lint
```

`git diff`에서 원하지 않는 변경이 보이면 되돌릴 수 있습니다. LLM Wiki를 오래 쓰려면 자동 생성 능력보다 이 검토 습관이 더 중요합니다.

## 5. 매번 반복할 기본 루프

새 자료를 추가할 때는 다음 순서만 반복하면 됩니다.

```text
1. raw/inbox/에 원문 저장
2. ingest로 Source 등록
3. 에이전트에게 관련 Wiki 연결 요청
4. reindex와 lint 실행
5. git diff 검토
6. 괜찮으면 commit
```

터미널 명령만 모으면 다음과 같습니다.

```bash
python3 scripts/llm_wiki.py ingest raw/inbox/새문서.md
python3 scripts/llm_wiki.py reindex
python3 scripts/llm_wiki.py lint
python3 scripts/llm_wiki.py status
git diff
```

### 자주 쓰는 명령 다섯 개

| 명령      | 하는 일                           | 초보자가 확인할 것                       |
| --------- | --------------------------------- | ---------------------------------------- |
| `ingest`  | 원문을 Source 페이지로 등록       | 원문이 삭제되거나 이동하지 않았는가      |
| `reindex` | Wiki 인덱스와 메타 페이지 갱신    | 새 Source 페이지가 인덱스에 보이는가     |
| `lint`    | 링크·frontmatter·고아 페이지 검사 | 오류 수가 0이거나 이유를 이해했는가      |
| `status`  | 현재 Wiki 상태 요약               | Raw와 Wiki 페이지 수가 예상대로 늘었는가 |
| `log`     | 최근 유지보수 기록 확인           | 어떤 작업이 언제 기록됐는가              |

로그를 직접 보고 싶으면 다음 명령을 사용합니다.

```bash
python3 scripts/llm_wiki.py log
```

## 6. 초보자는 왜 `wiki-only`로 시작하는가

DocTology bootstrap의 기본 프로필은 `llm-first-ontology`입니다. 옵션을 생략하면 더 많은 JSONL, 정책 파일, 검증 스크립트와 제안 수명주기가 함께 생성됩니다.

```bash
python3 .agents/skills/llm-wiki-bootstrap/scripts/bootstrap_llm_wiki.py \
  ../my-ontology-wiki
```

이 구성이 나쁜 것은 아닙니다. 다만 첫날부터 다음 개념을 함께 이해해야 합니다.

- `warehouse/jsonl/`의 구조화된 근거
- `intelligence/`의 정책과 계약
- proposal과 review 상태
- helper LLM 설정
- `agent_handoff`와 의미 처리 성공의 차이

처음 사용하는 사람에게는 확인할 지점이 너무 많습니다. 먼저 `wiki-only`에서 원문, Source 페이지, Wiki 링크, 인덱스, 로그와 Git 검토를 익히는 편이 좋습니다.

### `llm-first-ontology`로 넘어갈 때

다음 요구가 반복해서 생기면 확장을 검토합니다.

- 같은 주장에 서로 다른 출처가 붙어 충돌을 추적해야 한다.
- Source·claim·evidence를 기계적으로 검사해야 한다.
- 제안된 지식과 승인된 지식을 명확히 나눠야 한다.
- 많은 문서를 반복 처리하면서 누락과 회귀를 검사해야 한다.

그 전까지는 더 많은 폴더가 더 좋은 Wiki를 뜻하지 않습니다.

## 7. 폴더는 이렇게 이해하면 충분합니다

Quick Start를 마친 뒤에는 폴더 역할을 아래처럼 기억하면 됩니다.

```text
raw/
원문 보관. 요약본으로 대체하지 않는다.

wiki/sources/
원문을 추적할 Source 페이지.

wiki/concepts/, wiki/analyses/ 등
여러 Source를 연결해 사람이 읽는 지식으로 정리하는 곳.

wiki/_meta/
전체 읽기 경로, 최근 작업, 상태를 확인하는 곳.

AGENTS.md
새 대화를 시작한 에이전트가 가장 먼저 읽어야 할 운영 규칙.
```

`llm-first-ontology`에서는 여기에 `warehouse/jsonl/`과 `intelligence/`가 추가됩니다. 그래도 사람이 읽고 수정하는 중심 화면은 `wiki/`입니다.

## 8. 가장 많이 막히는 오류

![초보자가 겪는 네 가지 대표 오류를 실행 위치, 등록과 의미 통합의 차이, helper LLM 상태, 프로필 선택으로 나누고 해결 순서를 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-03.png)

### `bootstrap_llm_wiki.py`를 찾지 못합니다

DocTology 저장소 루트가 아닌 곳에서 짧은 파일명만 실행했을 가능성이 큽니다.

```bash
cd ~/doctology
python3 .agents/skills/llm-wiki-bootstrap/scripts/bootstrap_llm_wiki.py \
  ../my-llm-wiki \
  --profile wiki-only
```

### 생성된 Wiki에 `llm_full_ingest.py`가 없습니다

정상일 수 있습니다. `llm_full_ingest.py`는 DocTology 원본 저장소의 reference runtime에 있는 기능이며, 현재 bootstrap으로 만든 작업 공간에 자동 복사되지 않습니다.

초보자 Quick Start에서는 아래 명령을 사용합니다.

```bash
python3 scripts/llm_wiki.py ingest raw/inbox/문서.md
```

### `ingest`는 성공했는데 Wiki 내용이 풍부해지지 않습니다

`ingest`는 Source 등록입니다. 의미를 연결하는 작업은 Codex 같은 에이전트에게 별도로 요청해야 합니다.

```text
AGENTS.md를 읽고, 새 Source와 관련된 기존 Wiki 페이지를 찾아
중복 없이 연결하고 reindex와 lint까지 실행해줘.
```

### `agent_handoff`가 나옵니다

`llm-first-ontology`에서 helper LLM이 꺼져 있을 때 볼 수 있는 정상적인 중단 상태입니다. 의미 작업을 하지 않았는데 성공한 것처럼 꾸미지 않고, 현재 대화의 에이전트에게 넘길 자료를 만들었다는 뜻입니다.

### `lint` 오류가 생깁니다

오류를 숨기지 말고 메시지에 나온 파일을 먼저 확인합니다. 초보자가 자주 만드는 문제는 세 가지입니다.

- 존재하지 않는 Wiki 페이지를 가리키는 링크
- frontmatter가 없는 새 Wiki 페이지
- 인덱스 어디에서도 연결되지 않은 고아 페이지

에이전트에게 오류 메시지를 그대로 보여 주고 수정한 뒤 다시 `lint`를 실행하면 됩니다.

## 9. 첫날에는 여기까지만 해도 충분합니다

첫날의 성공 기준은 “AI가 모든 문서를 이해했다”가 아닙니다.

- 새 Wiki 작업 공간을 만들었다.
- 원문 하나를 `raw/inbox/`에 저장했다.
- Source 페이지가 생겼다.
- index와 log가 갱신됐다.
- 에이전트가 `AGENTS.md`를 읽고 변경했다.
- `git diff`와 `lint`로 결과를 검토했다.

이 여섯 가지가 되면 LLM Wiki의 가장 중요한 수명주기를 이미 경험한 것입니다.

다음에는 문서를 3~5개 넣고, 에이전트가 같은 개념을 중복 페이지로 만들지 않는지 확인해 보세요. 반복 작업에서 충돌·근거 추적·승인 상태가 필요해질 때 `llm-first-ontology`와 `llm-wiki-ontology-ingest`를 검토하면 됩니다.

## 실행 위치를 한 번 더 정리하면

```text
~/doctology
- bootstrap 스크립트가 있는 원본 저장소
- 새 Wiki를 만들 때 사용

~/my-llm-wiki
- 내가 실제로 운영할 Wiki
- ingest, reindex, lint, status, log 실행
- Codex 같은 에이전트에서 열 폴더
```

이 둘을 섞지 않으면 처음 사용하는 과정에서 만나는 오류의 상당수를 피할 수 있습니다.

## 검증 범위와 한계

- 공식 DocTology `main` 커밋 `a4ba7ebb78577287f454724252dfc84f438253dc`에서 bootstrap 동작을 확인했습니다.
- `wiki-only`와 `llm-first-ontology` 작업 공간 생성, 초기 `status`·`lint`, `wiki-only`의 Source 등록·reindex·lint·status를 실행했습니다.
- `wiki-only` 등록 실습에서는 Raw 파일, Source 페이지, index와 log 갱신을 확인했습니다.
- `ingest`는 Source 등록이며 의미 통합이나 답변 정확도를 검증하지 않습니다.
- helper LLM을 이용한 실제 의미 통합, 장기 운영, 비용·지연, 보안·권한과 대규모 문서 처리는 이 Quick Start에서 검증하지 않았습니다.

## 관련 글

- [[notes/llm-wiki/llm-wiki-origin-and-implementations|1. LLM Wiki가 뭔가? 안드레이 카파시가 건넨 지식 성장 루프]]
- [[notes/온톨로지/llm-wiki-double-compilation|25. LLM Wiki는 RAG를 대체하는가: 저장과 검색 사이의 이중 컴파일]]

## 출처

- [tteggu87/DocTology](https://github.com/tteggu87/DocTology)
- [검증한 DocTology 커밋](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc)
- [DocTology llm-wiki-bootstrap skill](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc/.agents/skills/llm-wiki-bootstrap)
- [Andrej Karpathy, LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

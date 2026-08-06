---
title: "2. DocTology LLM Wiki 해부학: 폴더 구조와 실행 경계를 함께 읽는 법"
description: "DocTology의 wiki-only와 llm-first-ontology 프로필을 실제로 생성해 보고, raw·wiki·warehouse·AGENTS.md의 권위 계층과 reference runtime·bootstrap workspace의 명령 경계를 분리해 설명합니다."
date: 2026-08-06
tags:
  - LLMWiki
  - DocTology
  - AI에이전트
  - 지식관리
  - Markdown
  - Ontology
---

![DocTology LLM Wiki를 데이터 권위 계층과 실행 표면이라는 두 축으로 나누어, 어떤 파일이 무엇을 저장하고 어떤 명령이 어느 환경에서만 동작하는지 보여 주는 인포그래픽](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-infographic.png)

튜토리얼을 따라 새 LLM Wiki 폴더를 만들었는데, 문서에 나온 명령이 바로 실패하는 경우가 있습니다. 폴더는 비슷해 보이고 프로젝트 이름도 같은데 `llm_full_ingest.py`가 없거나 `answer-receipt` 명령을 찾지 못합니다. 이때 흔히 “설치가 덜 됐다”거나 “내가 경로를 잘못 잡았다”고 생각하지만, 실제 원인은 다른 데 있을 수 있습니다. **저장소 전체가 제공하는 reference runtime과 bootstrap으로 생성한 독립 workspace가 서로 다른 실행 표면이기 때문**입니다.

DocTology를 실제로 재현할 때 핵심 질문은 “어떤 폴더가 있는가”가 아니라 **무엇이 어느 권위를 갖고, 어느 실행 환경이 그 상태를 바꾸는가**입니다.

> [!summary] 핵심 결론
> DocTology를 재현하려면 **데이터 권위 계층**과 **명령이 실제로 존재하는 실행 표면**을 함께 고정해야 합니다. `raw/`, `wiki/`, `warehouse/jsonl/`, `AGENTS.md`가 무엇을 책임지는지 구분하는 것만으로는 부족합니다. 저장소 루트의 reference runtime에서만 제공되는 명령과 bootstrap workspace에 복사되는 명령을 섞지 않아야, 구조 설명이 실행 가능한 안내가 됩니다.

검증 기준은 2026년 8월 6일 DocTology 공식 `main` 커밋 `a4ba7ebb78577287f454724252dfc84f438253dc`입니다. 해당 커밋을 얕게 복제하고 `wiki-only`와 기본 `llm-first-ontology` 프로필을 각각 새 디렉터리에 생성했습니다. 두 프로필의 구조 검사는 통과했고, 최소 Source 등록 흐름은 `wiki-only`에서 통과했습니다. 반면 helper LLM이 꺼진 상태의 의미 통합 명령은 `agent_handoff`를 반환했습니다. 따라서 아래 결과는 **scaffold와 registration runtime의 재현성**을 확인한 것이지, 의미 통합 품질·답변 정확도·성능·운영 준비도를 증명한 것이 아닙니다.

## 1. 폴더 해부만으로는 실행 실패를 설명할 수 없습니다

LLM Wiki를 설명할 때 흔히 아래처럼 데이터 흐름부터 그립니다.

```text
raw source
→ source page
→ linked wiki
→ structured evidence / graph
→ answer and revision
```

이 그림은 무엇이 어디에 저장되는지 이해하는 데 유용합니다. 그러나 사용자가 실제 명령을 복사하는 순간 다른 질문이 생깁니다.

```text
이 명령은 DocTology 저장소 루트에서 실행하는가?
아니면 bootstrap이 만든 새 workspace 안에서 실행하는가?
```

두 환경은 같은 프로젝트 철학을 공유하지만 같은 파일 집합을 갖지 않습니다. 공식 저장소 루트에는 `scripts/llm_full_ingest.py`와 `scripts/llm_wiki.py answer-receipt`가 있습니다. 하지만 현재 bootstrap으로 생성한 `wiki-only`와 `llm-first-ontology` workspace의 `scripts/llm_wiki.py`는 공통적으로 다음 다섯 작업만 노출합니다.

```text
ingest · reindex · lint · status · log
```

`llm-first-ontology` 프로필에는 `llm_compile_source.py`, `llm_query.py`, `query_analysis.py`와 여러 validator가 추가됩니다. 그래도 저장소 루트의 `llm_full_ingest.py`나 `answer-receipt` 하위 명령이 그대로 복사되지는 않습니다.

따라서 “DocTology에는 이 기능이 있다”와 “방금 만든 workspace에서 이 명령을 실행할 수 있다”는 서로 다른 문장입니다. 첫 문장은 프로젝트 전체의 기능을 설명하고, 둘째 문장은 특정 생성물의 인터페이스 계약을 설명합니다.

## 2. 첫 번째 축: 데이터 권위 계층을 나눕니다

DocTology README는 저장 구조를 단순한 폴더 목록이 아니라 서로 다른 권위로 설명합니다.

```text
raw/
= 이동하거나 요약해 대체하지 않는 원자료

warehouse/jsonl/
= ontology-backed ingest가 있을 때의 구조화된 정본

wiki/
= 사람이 읽고 agent가 유지하는 출처 기반 종합

AGENTS.md
= 앞으로의 agent가 따라야 하는 저장소 로컬 운영 계약

intelligence/
= 용어·정책·workflow를 보조하는 얇은 YAML 계약 계층
```

여기서 중요한 반전은 “Wiki가 사람이 읽는 중심 화면”과 “Wiki가 모든 사실의 유일한 정본”이 같지 않다는 점입니다. 원문 사실은 `raw/`로 돌아가야 하고, 구조화된 claim·evidence가 실제로 운영되는 프로필에서는 `warehouse/jsonl/`이 기계 판독 가능한 정본을 맡습니다. `wiki/`는 이 자료를 사람이 이해하고 수정할 수 있게 연결한 종합 표면입니다.

이 구분은 LLM Wiki 연구에서 반복해서 등장한 `source`, `candidate`, `canonical`, `receipt`의 권위 차이와도 이어집니다. 이름을 꼭 네 폴더로 구현할 필요는 없지만 다음 등식을 피해야 합니다.

```text
원문 등록됨
≠ 의미가 통합됨
≠ 사람이 검토함
≠ 승인된 현재 지식
≠ 특정 답변이 옳음
```

DocTology의 단순 `ingest`는 이 중 첫 단계에 가깝습니다. Source 파일을 등록하고 Source page와 메타 인덱스를 갱신합니다. 기존 개념 페이지의 의미를 자동으로 고쳤거나 구조화된 claim을 승인한 것은 아닙니다.

## 3. 두 번째 축: 실행 표면을 나눕니다

![DocTology reference repository, wiki-only workspace, llm-first-ontology workspace가 각각 제공하는 파일과 명령을 비교하고, 루트 전용 명령이 bootstrap 생성물에 자동으로 나타나지 않는다는 점을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-01.png)

같은 DocTology라도 실행 표면은 최소 세 가지로 나눠 읽는 편이 안전합니다.

| 실행 표면                                | 공통 목적                                                 | 이 글에서 확인한 핵심 인터페이스                                              |
| ---------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 공식 저장소의 reference runtime          | 프로젝트 전체 기능을 개발·검증하는 기준 구현              | `llm_full_ingest.py`, `llm_wiki.py answer-receipt`, bootstrap skill           |
| `wiki-only` bootstrap workspace          | Markdown 중심의 가장 얇은 Wiki 수명주기                   | `ingest`, `reindex`, `lint`, `status`, `log`                                  |
| `llm-first-ontology` bootstrap workspace | 기본 프로필. 구조화된 근거·제안 수명주기와 검증 표면 추가 | 공통 5개 명령 + compile/query handoff 스크립트 + JSONL·intelligence·validator |

여기서 `wiki-only`는 “기본 프로필”이 아닙니다. 현재 bootstrap의 기본값은 `llm-first-ontology`이고, plain Wiki만 원할 때 `--profile wiki-only`를 명시합니다. 이름만 보고 가장 작은 프로필을 기본값으로 가정하면 생성 결과와 설명이 어긋납니다.

또 하나의 경계는 helper LLM입니다. `llm-first-ontology`가 생성하는 `llm_query.py`와 `llm_compile_source.py`는 local helper가 꺼져 있을 때 임의의 규칙 기반 문장으로 의미 결과를 만들어 성공처럼 처리하지 않습니다. 이번 스모크에서 두 스크립트는 모두 다음 상태를 반환했습니다.

```text
status: agent_handoff
message: helper LLM이 활성화되지 않았으며 이는 semantic success가 아님
```

이 동작은 실패가 아니라 계약입니다. 의미 작업이 수행되지 않았으면 “완료”라고 가장하지 않고 현재 chat agent에게 넘길 prompt·bundle 단계에서 멈춥니다.

## 4. 프로필은 기능 등급이 아니라 시작 계약입니다

두 프로필을 기능 수로만 보면 `llm-first-ontology`가 항상 더 좋은 선택처럼 보일 수 있습니다. 그러나 프로필은 성능 순위가 아니라 어떤 책임을 첫날부터 떠안을지 정하는 시작 계약입니다.

### `wiki-only`: 등록·링크·검토 흐름부터 확인할 때

`wiki-only`는 `raw/`, `wiki/`, `AGENTS.md`, 최소 CLI와 template을 만듭니다. 외부 DB나 graph 없이 Source 등록, 인덱스 갱신, 구조 lint와 Git diff를 먼저 익히고 싶을 때 적합합니다.

장점은 실패 원인을 좁히기 쉽다는 점입니다. 생성된 파일이 적고, 자동화가 하는 일이 Source 등록과 구조 유지로 제한됩니다. 반면 구조화된 claim·evidence registry, proposal lifecycle, ontology validator가 필요해지면 직접 확장하거나 다른 프로필로 새 시작점을 잡아야 합니다.

### `llm-first-ontology`: 근거와 제안 수명주기를 처음부터 드러낼 때

기본 프로필인 `llm-first-ontology`는 `warehouse/jsonl/`, `intelligence/`, proposal/review registry, compile·query handoff와 여러 validator를 함께 만듭니다.

여기서 JSONL과 YAML이 자동으로 “더 똑똑한 Wiki”를 만드는 것은 아닙니다. JSONL은 출처·claim·evidence를 추적할 기계 판독 표면이고, YAML은 workflow와 정책을 얇게 고정하는 계약입니다. 사람이 읽는 종합은 여전히 Wiki에 있으며, helper가 비활성화되면 의미 작업은 agent handoff로 남습니다.

두 프로필의 선택 기준은 “어느 쪽이 더 고급인가”가 아니라 다음 질문입니다.

```text
지금 필요한 것이 Markdown Wiki의 수명주기 학습인가?
아니면 첫날부터 구조화된 provenance와 proposal gate까지 운영할 것인가?
```

## 5. 실제로 Source 하나를 등록해 봤습니다

![빈 wiki-only workspace에 원문 하나를 넣고 ingest·reindex·lint·status를 실행해 Source page와 메타 인덱스가 늘어나는 과정, 그리고 이 결과가 의미 통합이 아님을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-02.png)

공식 bootstrap script로 `wiki-only` workspace를 만들고, 다음 내용을 `raw/inbox/example-runtime-boundary.md`에 넣었습니다.

```markdown
Runtime Boundary Example

A generated LLM Wiki workspace should expose only the commands actually
scaffolded into that workspace. Repository-level helper commands must not be
documented as if they were generated locally.
```

그다음 생성된 workspace 안에서 아래 명령만 실행했습니다.

```bash
python3 scripts/llm_wiki.py ingest raw/inbox/example-runtime-boundary.md
python3 scripts/llm_wiki.py reindex
python3 scripts/llm_wiki.py lint
python3 scripts/llm_wiki.py status
```

확인된 변화는 다음과 같습니다.

| 항목                | 등록 전 | 등록 후 |
| ------------------- | ------: | ------: |
| Raw files           |       0 |       1 |
| Wiki pages          |       3 |       4 |
| Log entries         |       1 |       2 |
| Index entries       |       2 |       3 |
| Broken wikilinks    |       0 |       0 |
| Orphan pages        |       0 |       0 |
| Missing frontmatter |       0 |       0 |

생성된 Source page는 `wiki/sources/source-2026-08-06-example-runtime-boundary.md`였습니다. 이 실행으로 확인한 것은 세 가지뿐입니다.

1. bootstrap 결과가 독립 workspace에서 실행됩니다.
2. 원문 하나가 Source page로 등록되고 인덱스·로그가 갱신됩니다.
3. 최소 구조 lint가 통과합니다.

확인하지 않은 것은 더 많습니다. 문서가 기존 개념과 올바르게 합쳐졌는지, 중요한 caveat가 보존됐는지, 답변 정확도가 높아졌는지, 운영 규모에서 안전한지는 측정하지 않았습니다. **등록 성공을 의미 통합 성공으로 승격하지 않는 것**이 이 실습의 가장 중요한 결과입니다.

## 6. `llm_full_ingest`는 왜 별도 실행 표면인가

공식 저장소의 `scripts/llm_full_ingest.py`는 `llm_wiki.py ingest` 위에 놓인 configured-LLM workflow입니다. README와 코드 주석은 두 작업을 명시적으로 분리합니다.

```text
llm_wiki.py ingest
= source registration only

llm_full_ingest.py --apply
= raw 등록 → source page → 영향받는 wiki page 제안
  → proposed JSONL → meta refresh → ingest report
```

`--apply`라는 이름도 승인된 진실을 자동으로 만든다는 뜻이 아닙니다. 코드 계약상 raw source를 수정하거나, accepted truth를 만들거나, 콘텐츠를 삭제·이름 변경·병합하거나, 자동 commit하면 안 됩니다. 생성되는 구조화 결과는 proposed 상태로 남고 이후 검토가 필요합니다.

중요한 점은 이 runner가 현재 bootstrap 생성물에 포함되지 않는다는 사실입니다. 새 workspace에서 해당 파일이 없으면 root runtime의 명령을 그대로 복사하지 말아야 합니다. 선택지는 두 가지입니다.

- 생성된 workspace의 계약대로 최소 CLI와 agent-maintained workflow를 사용합니다.
- reference runtime의 configured helper workflow가 필요하다면, 어떤 파일·설정·의존성을 이식하거나 상위 runtime에서 호출할지 별도로 설계합니다.

“같은 저장소에서 봤던 명령”이라는 이유만으로 생성물에도 존재한다고 가정하면 문서가 실행 계약을 깨뜨립니다.

## 7. `answer-receipt`도 답변 엔진이 아닙니다

Reference runtime의 `answer-receipt`는 질문, 짧은 답변 요약, 실제로 읽은 Wiki·Source·Raw·JSONL, 불확실성, 후속 조치와 Wiki 변경을 `wiki/analyses/`에 남기는 구조 기록 도구입니다.

도움이 되는 이유는 잘못된 답을 발견했을 때 “무엇을 읽었는가”를 복원할 수 있기 때문입니다. 그러나 코드 도움말도 분명히 선을 긋습니다.

```text
context와 follow-up을 기록하지만
semantic routing이나 answer generation을 수행하지 않는다
```

즉 receipt가 존재한다고 답의 근거 충실도가 검증된 것은 아닙니다. LLM Wiki 연구가 제안하는 `receipt`의 역할도 비슷합니다. 실행 경로를 관찰하고 rollback의 실마리를 제공하지만, 검토된 canonical 지식과 동일한 권위를 갖지 않습니다.

Bootstrap의 `llm-first-ontology`에는 같은 이름의 `answer-receipt` 하위 명령 대신 `query_analysis.py`가 들어 있습니다. 목적은 겹치지만 인터페이스가 다릅니다. 이 차이를 숨기지 않고 문서에서 어느 표면의 명령인지 적어야 합니다.

## 8. 실행 가능한 문서는 두 축을 함께 표기해야 합니다

![DocTology 명령을 실행하기 전에 데이터 책임과 실행 표면을 확인하고, registration·semantic handoff·reference runtime 중 맞는 경로를 고르는 결정 흐름과 중단 조건을 보여 주는 도판](../../attachments/doctology-llm-wiki-anatomy/doctology-llm-wiki-anatomy-figure-03.png)

DocTology뿐 아니라 bootstrap형 개발 도구를 설명할 때 아래 형식을 사용하면 경계가 분명해집니다.

### 1. 먼저 데이터 책임을 적습니다

```text
입력: raw source
출력: source page
권위 변화: 없음 — registration only
파생 상태: index와 log 갱신
```

### 2. 이어서 실행 표면을 적습니다

```text
실행 위치: bootstrap-generated wiki-only workspace
필요 파일: scripts/llm_wiki.py
지원 명령: ingest, reindex, lint, status, log
```

### 3. 실행하지 않은 의미 작업을 분리합니다

```text
미검증: semantic merge, claim extraction quality,
answer correctness, latency, cost, multi-tenant authorization
```

이 세 줄이 있으면 독자는 성공 로그의 의미를 과장하지 않고, 없는 명령을 자신의 실수로 오해하지 않습니다.

## 9. 어디서 시작하고 언제 확장할 것인가

처음 DocTology를 시험한다면 하나의 실행 표면만 선택하는 편이 좋습니다.

### 가장 작은 시작

```bash
python3 bootstrap_llm_wiki.py my-wiki --profile wiki-only
cd my-wiki
python3 scripts/llm_wiki.py status
python3 scripts/llm_wiki.py lint
```

원문 하나를 넣은 뒤 `ingest → reindex → lint → status → git diff`를 반복합니다. 이 단계에서 확인할 질문은 “답변이 더 똑똑해졌는가”가 아니라 다음입니다.

- 원문 위치와 Source page가 안정적으로 연결되는가?
- index와 log가 예상대로 바뀌는가?
- agent가 원문과 파생 종합을 구분하는가?
- 잘못된 변경을 diff로 되돌릴 수 있는가?

### 구조화된 provenance가 처음부터 필요할 때

기본 `llm-first-ontology` 프로필을 사용하되, helper가 꺼져 있을 때 `agent_handoff`가 정상 결과라는 점을 받아들여야 합니다. JSONL registry와 validator가 있다고 의미 판정이 자동으로 끝나지 않습니다. Source·claim·evidence·proposal 상태를 검토할 운영 책임이 함께 생깁니다.

### Reference runtime 기능이 필요할 때

`llm_full_ingest.py`나 `answer-receipt`를 사용하려면 저장소 루트의 실제 runtime과 설정을 기준으로 작업합니다. 생성 workspace에 없는 파일을 문서만 보고 호출하지 않습니다. 어느 기능을 이식할지, root에서 workspace를 대상으로 실행할지, helper LLM과 의존성을 어떻게 구성할지 별도 설계가 필요합니다.

## 10. 이 해부학이 바꾸는 판단 기준

폴더 구조만 보면 구현 선택은 “Wiki만 쓸까, Ontology까지 넣을까”로 보입니다. 실행 표면까지 함께 보면 질문이 달라집니다.

```text
무엇을 저장할 것인가?
+
어느 runtime이 그 상태 전이를 실제로 수행하는가?
```

이 두 질문을 함께 답해야 재현 가능한 LLM Wiki가 됩니다. 구조화된 정본이 있어도 이를 갱신할 command·review gate가 생성물에 없으면 운영할 수 없습니다. 반대로 풍부한 reference runtime이 있어도 현재 workspace에 복사되지 않았다면 독자의 로컬 명령은 실패합니다.

DocTology의 장점은 Wiki, 구조화 근거, agent 계약과 파생 탐색 표면을 분리하려는 데 있습니다. 비용도 같은 곳에서 생깁니다. 프로필과 실행 위치를 명시해야 하고, helper가 없는 상태를 의미 성공으로 위장하지 않아야 하며, registration과 promotion 사이의 검토 책임을 사람이 떠안습니다.

따라서 다음 행동은 더 많은 기능을 켜는 일이 아닙니다. **하나의 프로필과 하나의 실행 표면을 고른 뒤, 원문 한 개가 Source page와 index·log로 이동하는 가장 얇은 수명주기를 재현하는 것**입니다. 그 경계가 안정적으로 보일 때만 configured LLM ingest, proposal review, 구조화 registry, graph와 Workbench를 추가하는 편이 안전합니다.

## 검증 범위와 한계

- 공식 DocTology `main` 커밋 `a4ba7ebb78577287f454724252dfc84f438253dc`를 기준으로 확인했습니다.
- `wiki-only`와 `llm-first-ontology` bootstrap 생성, 초기 `status`·`lint`, `wiki-only` Source 등록·reindex·lint·status를 실행했습니다.
- `llm-first-ontology`의 intelligence·profile·registry validator는 통과했습니다.
- helper LLM이 꺼진 `llm_query.py`와 `llm_compile_source.py`는 `agent_handoff`를 반환했고, 의미 성공으로 계산하지 않았습니다.
- `llm_full_ingest.py --apply`, 실제 helper LLM 의미 통합, graph ingest, answer quality, 비용·지연, 보안·권한과 장기 유지보수는 검증하지 않았습니다.
- LLM Wiki의 `source·candidate·canonical·receipt` 구조와 DocTology의 매핑은 운영을 설명하기 위한 프로젝트 해석이며 산업 표준이 아닙니다.

## 관련 글

- [[notes/llm-wiki/llm-wiki-origin-and-implementations|1. LLM Wiki가 뭔가? 안드레이 카파시가 건넨 지식 성장 루프]]
- [[notes/온톨로지/llm-wiki-double-compilation|25. LLM Wiki는 RAG를 대체하는가: 저장과 검색 사이의 이중 컴파일]]

## 출처

- [tteggu87/DocTology](https://github.com/tteggu87/DocTology)
- [검증한 DocTology 커밋](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc)
- [DocTology llm-wiki-bootstrap skill](https://github.com/tteggu87/DocTology/tree/a4ba7ebb78577287f454724252dfc84f438253dc/.agents/skills/llm-wiki-bootstrap)
- [Andrej Karpathy, LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [W3C PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/)

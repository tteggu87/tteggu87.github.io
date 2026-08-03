---
title: "14. Expertise Pack은 어떻게 에이전트가 되는가: DuckCrab·Pi·DAG로 구현하는 전문가 작업공간"
description: "10번 글의 Expertise Pack을 실제 조사 에이전트로 구현하기 위해 DuckCrab에 무엇이 준비돼 있고, 왜 질문별 DAG와 Pi Agent가 필요한지 살펴봅니다."
date: 2026-07-25
aliases:
  - /notes/pi-agent-duckcrab-dag-harness
tags:
  - AI에이전트
  - 온톨로지
  - 지식그래프
  - ExpertisePack
  - DuckCrab
  - PiAgent
  - DAG
  - MCP
---

![조직 지식을 Expertise Pack으로 만들고 DuckCrab·Pi·DAG가 질문별 전문가 작업공간으로 실행하는 전체 구조](../../attachments/pi-agent-duckcrab-dag-harness/pi-agent-duckcrab-dag-harness-infographic.png)

> [!summary] 핵심 결론
> **DuckCrab은 조직의 사실·근거·결정·실패를 Expertise Pack에 보존합니다. Pi Agent는 질문마다 필요한 근거·반례·유사·대조 사례를 DAG 순서에 따라 조사합니다.** 이 둘을 연결하면 조직 자료를 실제 판단에 쓰는 질문별 전문가 작업공간을 만들 수 있습니다.

[[notes/온톨로지/ontology-expertise-pack|10번 글]]에서는 이런 질문을 던졌습니다.

> 온톨로지로 시니어 엔지니어가 사용하는 판단 재료를 모델 밖에 보존할 수 있을까?

여기서 `Expertise Pack`은 전문가가 판단할 때 참고하는 자료를 한데 묶은 작업 꾸러미입니다. 조직에서 확인한 사실과 근거, 과거의 실패, 선택한 결정과 버린 대안, 정책과 제약을 서로 연결해 둡니다. 전문가의 머릿속을 복제하기보다 **판단에 필요한 재료와 그 관계를 보존하는 방식**에 가깝습니다.

택배 배송이 늦어졌다고 해보겠습니다. 일반적인 AI는 비슷한 문의를 찾고 이렇게 답할 수 있습니다.

> 재고가 부족해서 배송이 늦어진 것 같습니다.

하지만 숙련된 담당자는 바로 결론을 내리지 않습니다.

```text
결제는 실제로 완료됐는가
재고는 예약됐는가
창고 작업 기록은 남았는가
상태 갱신만 누락된 것은 아닌가
비슷한 증상이지만 원인이 달랐던 사례는 없는가
확인 전에 재발송하면 중복 배송 위험은 없는가
```

좋은 에이전트는 첫 설명을 곧바로 정답으로 받아들이지 않습니다. 조직의 실제 자료를 읽고, 처음 세운 가설을 의심하며, 그 가설과 맞지 않는 반례도 찾습니다. 근거가 부족할 때는 억지로 결론을 내리지 않고 무엇을 더 확인해야 하는지 말해야 합니다.

이번 글은 10번의 다음 질문을 다룹니다.

> **Expertise Pack에 담긴 지도와 증거를 실제 에이전트는 어떻게 사용할 것인가?**

## 먼저 DAG가 무엇인지부터 짚겠습니다

DAG는 `Directed Acyclic Graph`, 한국어로는 **방향성 비순환 그래프**입니다. 이름은 어렵지만 이 글에서 필요한 뜻은 단순합니다.

- 하나의 일을 여러 작업으로 나눕니다.
- 어떤 작업이 끝나야 다음 작업을 시작할 수 있는지 표시합니다.
- 서로 의존하지 않는 작업은 동시에 실행합니다.
- 작업이 다시 자기 자신으로 돌아오는 순환은 허용하지 않습니다.

택배 지연 원인을 조사한다면 다음과 같이 표현할 수 있습니다.

```text
현재 주문 상태 확인
        ↓
가능한 원인 후보 정리
        ↓
┌──────────────────────┐
│ 결제 기록 확인       │
│ 재고 예약 확인       │
│ 창고 작업 확인       │
│ 상태 갱신 확인       │
│ 과거 대조 사례 확인  │
└──────────────────────┘
        ↓
원인 비교와 다음 조치 판단
```

가운데 작업들은 서로 독립적이므로 동시에 실행할 수 있습니다. 반면 원인 비교는 앞의 확인이 끝난 뒤에만 시작할 수 있습니다. 이 글에서 DAG는 바로 이런 **작업의 순서와 의존 관계를 나타내는 실행 지도**를 뜻합니다.

## DAG로 질문별 전문가 작업공간을 만듭니다

DAG의 역할을 알았으니 이제 전체 구조를 볼 수 있습니다. 사용자의 질문이 들어오면 조직의 실제 자료를 모으고, 근거와 반례를 비교하며, 정보가 부족하면 조사를 멈추는 **질문별 전문가 작업공간**이 필요합니다. 여러 에이전트를 많이 붙이거나 복잡한 DAG 엔진을 만드는 일보다, 한 질문에 필요한 판단 재료를 빠짐없이 준비하는 일이 먼저입니다.

```text
조직 문서·로그·결정 기록
        ↓
Expertise Pack
        ↓
사용자 질문
        ↓
질문별 전문가 작업공간
        ↓
근거·반례·사례·정책 조사
        ↓
조건부 판단과 다음 조사
```

DAG와 Pi Agent는 이 흐름을 실제로 실행하는 도구입니다. 각자의 역할은 다음과 같습니다.

```text
Expertise Pack
= 전문가가 판단할 때 참고하는 재료

DuckCrab
= Pack을 만들고 검색하며 근거와 정본을 관리하는 시스템

DAG
= 답변 전에 필요한 판단 재료가 준비됐는지 관리하는 실행 지도

Pi Agent
= DAG를 실행하고 조사 단계·세션·도구를 관리하는 호스트
```

DAG는 전문가 작업공간 안에서 조사 절차를 빠뜨리지 않도록 돕습니다. 이 글은 특정 도구의 우열보다 다음 문제에 집중합니다.

> **10번 글의 Expertise Pack을 실제 질문별 전문가 작업공간으로 바꾸려면 무엇이 더 필요한가?**

## Expertise Pack에는 무엇이 들어가야 하는가

Expertise Pack을 단순한 문서 모음으로 만들면 일반 RAG(검색 증강 생성)와 크게 다르지 않습니다. RAG는 질문과 관련된 문서를 찾아 답변에 참고시키는 방식입니다. Expertise Pack은 한 걸음 더 나아가, 문서 속 사실과 해석, 사건과 결정, 정책과 권한을 서로 다른 종류의 정보로 나눠 보존합니다.

| Pack에 보존할 것      | 필요한 이유                                            |
| --------------------- | ------------------------------------------------------ |
| 도메인 객체와 관계    | 조직의 실제 세계와 업무 용어를 표현하기 위해           |
| Evidence와 Claim      | 직접 관찰한 사실과 그 사실에 대한 해석을 구분하기 위해 |
| 사건과 실패           | 과거 경험을 현재 문제와 비교하기 위해                  |
| 결정과 버린 대안      | 왜 지금 구조가 만들어졌는지 복원하기 위해              |
| 유사 사례와 대조 사례 | 가장 비슷한 첫 사례에 고착되지 않기 위해               |
| 정책과 권한           | 가능한 행동과 금지된 행동을 구분하기 위해              |
| 인과·영향 가설        | 다음에 무엇을 관찰해야 하는지 정하기 위해              |
| 미지와 전문가 질문    | 아직 확인되지 않은 사실을 드러내기 위해                |
| 출처·시간·버전        | 지식의 유효 범위를 다시 검사하기 위해                  |

예를 들어 캐시 장애 Pack에는 다음 정보가 들어갈 수 있습니다. 캐시는 자주 쓰는 데이터를 잠시 저장하는 장치입니다. TTL은 캐시 데이터를 얼마나 오래 보관할지 정하는 시간이고, 캐시 무효화는 낡은 값을 지우거나 새 값으로 바꾸는 처리입니다.

```text
사건 A
- TTL을 늘린 뒤 오래된 데이터가 노출됨
- 무효화 로그가 같은 시점에 감소함

사건 B
- 증상은 비슷했지만 실제 원인은 읽기 복제본(조회 전용 데이터베이스 사본) 지연이었음
- 캐시를 거치지 않은 요청에서도 같은 문제가 나타남

결정 기록
- 특정 고객과 약속한 서비스 수준(SLA) 때문에 TTL을 더 낮출 수 없었음
- 전체 캐시 제거안은 비용 때문에 기각됨

현재 정책
- 전체 TTL 변경은 운영 책임자 승인이 필요함
- 제한된 고객군 실험은 허용됨
```

이 정보를 문서 조각으로만 저장하면 모델은 가장 비슷한 사건 하나를 먼저 찾아 답하기 쉽습니다. 관계와 조건이 살아 있는 Pack이라면 질문이 달라집니다.

```text
현재 사건은 사건 A와 시간 조건이 같은가
사건 B를 배제할 수 있는 관찰이 있는가
과거 결정의 SLA 제약이 지금도 유효한가
전체 변경 전에 가능한 가역적 실험은 무엇인가
```

Expertise Pack은 정답집보다 조사 지도에 가깝습니다.

> **현재 상황을 더 잘 이해하고, 다음에 확인할 질문을 만들 수 있는 판단 재료를 보존합니다.**

## Pack을 만드는 일과 사용하는 일은 다릅니다

Expertise Pack 구현은 두 단계로 나눠야 합니다.

```text
A. 조직 자료를 Expertise Pack으로 만드는 단계
B. 만들어진 Pack을 질문별 전문가 작업공간으로 사용하는 단계
```

![Expertise Pack 구축 흐름과 질문별 전문가 작업공간 실행 흐름을 구분한 두 단계 설계](../../attachments/pi-agent-duckcrab-dag-harness/pi-agent-duckcrab-dag-harness-figure-01.png)

### 첫 번째: 좋은 Pack을 만듭니다

```text
어떤 판단을 잘해야 하는지 정의
→ 도메인 타입과 관계 설계
→ 필요한 원문 수집
→ Evidence와 Claim 분리
→ 사건·결정·대안 연결
→ 중복·시간·권한 검사
→ 후보 지식 검증
→ Pack으로 승격
→ 검색 가능 상태 확인
```

이 단계에서는 스키마보다 먼저 **역량 질문**을 정해야 합니다.

```text
왜 이 현상이 지금 이 범위에서 발생했는가
과거의 어떤 사건과 비슷하며 무엇이 다른가
현재 가설을 반박할 수 있는 관찰은 무엇인가
이 조치가 어떤 서비스와 고객에게 영향을 주는가
지금 가능한 가장 안전하고 가역적인 행동은 무엇인가
```

이 질문에 답하는 데 필요한 개념과 관계를 거꾸로 설계합니다.

### 두 번째: Pack을 질문별 작업공간으로 바꿉니다

좋은 Pack이 있어도 전체 Pack을 그대로 모델에 넘기면 안 됩니다. 현재 질문에 필요한 자료만 골라 작은 작업공간을 만들어야 합니다.

```text
사용자 질문
→ 질문 유형과 위험도 판단
→ 필요한 근거·관계·정책 결정
→ Pack에서 관련 자료 검색
→ 유사·대조 사례와 반례 보강
→ 질문별 작업공간 조립
→ 가설 비교와 다음 조사
```

Pack은 도서관이고, 전문가 작업공간은 이번 과제를 위해 책상 위에 펼쳐 놓은 자료입니다.

## OpenCrab과 DuckCrab이 맡는 역할

이 구조를 처음부터 새로 설계할 필요는 없습니다. 이 글에서는 **OpenCrab을 의미 설계와 Pack 구조의 출발점**, **DuckCrab을 그 설계를 로컬 정본·검색·검증 흐름으로 옮긴 현재 구현**으로 구분합니다. 여기서 정본은 여러 사본 가운데 공식 기준으로 삼는 데이터를 뜻합니다.

이 관계를 먼저 잡아 두면, 아래에서 무엇이 설계 아이디어이고 무엇이 실제로 구현된 기능인지 덜 헷갈립니다.

### OpenCrab이 제공한 의미 설계

OpenCrab은 자료를 여러 관점에서 읽는 9-Space, Evidence와 Claim의 분리, Grammar와 Validator, Vector·BM25·Graph 검색, MCP 도구와 Pack 구조를 제안했습니다. MCP는 AI가 외부 도구와 자료를 일정한 방식으로 호출하도록 연결하는 규격입니다. Evidence는 원문에서 직접 확인한 근거이고, Claim은 그 근거를 해석해 만든 주장입니다. Grammar와 Validator는 데이터의 형태와 관계가 정해진 규칙을 지키는지 검사합니다. 9-Space는 모든 노드를 아홉 칸에 억지로 넣는 분류표가 아니라, 자료를 볼 때 어떤 질문을 던질지 알려 주는 관점입니다.

```text
누가 행동하는가
무엇을 대상으로 하는가
어떤 근거가 있는가
어떤 주장을 만들었는가
어떤 결과가 생겼는가
무엇을 바꿀 수 있는가
어떤 정책이 행동을 제한하는가
```

다만 분석 당시 OpenCrab은 전체 지식 수명주기를 강제한 완성형 엔진보다, **문법 검사가 붙은 동적 지식그래프 빌더와 Pack 공장**에 가까웠습니다. Evidence·Identity·Approval·Promotion이 느슨하게 연결된 경로도 있었습니다. 이 부분은 [[notes/온톨로지/opencrab-ontology-build-architecture|8번 글]]에서 자세히 살펴봤습니다.

### DuckCrab이 실제로 구현한 기반

2026년 7월 25일 로컬 저장소 감사 기준으로 DuckCrab에는 Expertise Pack을 만들고 읽기 위한 기반이 상당히 준비돼 있습니다.[src_007](#src-007)

**첫째, 로컬 정본이 있습니다.**

DuckDB는 온톨로지 노드와 관계, 도메인 그래프, 원문, Evidence, provenance, Pack, 정책과 감사 기록을 보존합니다. provenance는 정보가 어떤 원문과 처리 과정을 거쳐 만들어졌는지 보여 주는 계보입니다. Chroma는 의미가 비슷한 자료를 빨리 찾기 위한 벡터 검색용 색인이며, 공식 기준 데이터는 DuckDB에 남습니다.

**둘째, 하나로 통합된 검색기가 있습니다.**

`ontology_query`, 명령줄(CLI) query와 상세 검색은 하나의 `RetrievalPlanner`를 공유합니다. RetrievalPlanner는 질문에 맞춰 어떤 검색 방식을 어떤 순서로 사용할지 정하는 구성 요소입니다.

```text
Vector: 표현이 달라도 의미가 비슷한 자료 검색
+ Source/Evidence BM25: 같은 핵심어가 들어간 원문·근거 검색
+ 근거에서 시작하는 제한된 Graph 확장: 연결된 관계 탐색
+ RRF: 여러 검색 결과의 순위를 하나로 합침
```

검색 결과뿐 아니라 사용한 Pack, 바꿔 쓴 검색어, 검색 방식별 후보 수, 그래프 탐색을 시작한 지점과 경고도 receipt에 남습니다. receipt는 검색이 어떤 과정을 거쳤는지 다시 확인할 수 있는 실행 기록입니다.

**셋째, 명시적인 Retrieval Plan이 있습니다.**

호출자는 Pack 범위, 검색 이유, 검색어 변형, 그래프·스키마 용어와 검색 깊이를 지정할 수 있습니다.

```text
Retrieval Plan
= 어디를 어떻게 검색할 것인가

Investigation Plan
= 어떤 판단 재료가 있어야 조사를 끝낼 수 있는가
```

둘은 연결되지만 같은 계약은 아닙니다.

**넷째, 질문에 필요한 정보를 묶어 주는 AgentContextBundle이 있습니다.**

DuckCrab은 검색 결과를 다음과 같은 읽기 전용 문맥으로 조립합니다.

```text
facts
supporting_evidence
provenance_paths
inferred_links
missing_links
policies
scope
uncertainty
raw_refs
```

에이전트는 관련 문서 목록만 받지 않습니다. 무엇이 확인된 사실인지, 어떤 내용이 추론인지, 어떤 연결과 정보가 부족한지도 함께 봅니다.

**다섯째, Pack 구축 하네스가 있습니다.** 하네스는 여러 작업을 정해진 순서로 실행하고 결과를 검사하는 틀입니다.

```text
Mission
→ Plan
→ Run
→ Artifact Bundle
→ Validation Report
→ Promotion Package
→ Promote
→ Eval
```

외부 검색은 에이전트나 별도 검색 도구가 수행합니다. DuckCrab은 수집된 자료를 로컬 artifact, 즉 실행 결과 파일로 받아 Evidence와 후보 지식으로 만들고, 검증과 승격 경계를 적용합니다.

## Pack을 실제 조사로 바꾸는 실행 계층이 더 필요합니다

DuckCrab에는 Pack을 만들고 검색하기 위한 기반이 상당히 준비돼 있습니다. 다만 검색한 자료를 어떤 순서로 검토하고, 언제 조사를 마치거나 보류할지 관리하는 실행 규칙은 아직 완성되지 않았습니다.

```text
이번 질문에서 반드시 확인할 것은 무엇인가
주 가설과 경쟁 가설은 무엇인가
각 가설의 지지 근거와 반대 근거는 무엇인가
유사 사례뿐 아니라 대조 사례도 확인했는가
과거 결정과 버린 대안을 복원했는가
어떤 관찰이 두 가설을 가장 잘 구분하는가
이제 답해도 되는가
근거가 부족해 보류해야 하는가
사람의 승인이 필요한가
```

![DuckCrab에 이미 구현된 Pack·검색·근거 기반과 아직 필요한 조사 상태·반례·검증 실행 계층의 경계](../../attachments/pi-agent-duckcrab-dag-harness/pi-agent-duckcrab-dag-harness-figure-02.png)

| 기능                           | 현재 상태 |
| ------------------------------ | --------- |
| Pack·Schema·Grammar            | 구현됨    |
| 원문·Evidence·provenance 저장  | 구현됨    |
| Vector·Lexical·Graph 통합 검색 | 구현됨    |
| 명시적 Retrieval Plan          | 구현됨    |
| 근거·정책·누락 문맥 조립       | 구현됨    |
| 검색 Receipt                   | 구현됨    |
| Search/Collection Harness      | 구현됨    |
| 질문별 경쟁 가설 상태          | 목표 구조 |
| 반례 재검색 의무               | 목표 구조 |
| 유사·대조 사례 비교 의무       | 목표 구조 |
| 조사 단계 자동 전환            | 목표 구조 |
| 격리된 Reviewer                | 목표 구조 |
| 조건부 Judgment Packet         | 목표 구조 |
| 실패한 조사만 재실행           | 목표 구조 |

검색 기반은 이미 갖춰져 있습니다. 다음 단계는 자료를 실제 조사 순서와 완료 조건으로 연결하는 일입니다.

> **Expertise Pack의 자료를 실제 조사 과정으로 바꾸는 실행 계층**이 필요합니다.

## 기존 에이전트에 MCP만 붙이면 충분하지 않을까

MCP(Model Context Protocol)는 에이전트가 외부 시스템의 도구와 자료를 호출할 수 있게 연결하는 규격입니다. Claude Code나 Codex 같은 기존 에이전트에 DuckCrab MCP를 연결하면 Pack 안의 사실과 근거 조회, 원문 확인, 간단한 비교, 사람이 감독하는 Pack 구축까지 상당 부분 수행할 수 있습니다.

```text
질문
→ ontology_query
→ 관련 근거와 관계
→ 모델 답변
```

이 조합은 이후 구조와 비교할 기준선으로 남겨야 합니다. DuckCrab MCP는 단순한 저장·조회·수정·삭제(CRUD) API보다 많은 정보를 제공합니다. Pack Schema, Planning Card, Retrieval Plan, AgentContextBundle, provenance, missing link, policy와 receipt를 함께 전달해 에이전트가 근거의 범위와 빈틈을 확인하도록 돕습니다.

하지만 MCP는 연결 규격입니다. 다음 행동을 자동으로 강제하지는 않습니다.

```text
경쟁 가설을 둘 이상 만들 것
반드시 반대 근거를 검색할 것
유사 사례와 대조 사례를 함께 볼 것
과거 결정의 전제를 복원할 것
근거가 부족하면 답을 보류할 것
작성자와 다른 문맥의 Reviewer를 사용할 것
실패한 조사만 다시 실행할 것
```

이 내용을 프롬프트에 넣을 수는 있습니다. 그러나 긴 조사에서는 일부 의무가 빠질 수 있고, 나중에 어느 단계에서 잘못됐는지 구분하기도 어렵습니다.

```text
MCP
= 무엇을 읽고 실행할 수 있는가

전문가 작업공간
= 답하기 전에 무엇을 반드시 조사해야 하는가
```

## 비어 있는 조사 과정을 DAG로 표현합니다

앞에서 본 것처럼 DAG는 작업의 순서와 의존 관계를 나타내는 실행 지도입니다. 이제 이 지도를 Expertise Pack의 소비 런타임에 적용해 보겠습니다.

```text
현재 관찰 고정
        ↓
주 가설·경쟁 가설 구성
        ↓
┌──────────────────────────┐
│ 지지 근거 검색           │
│ 반대 근거 검색           │
│ 유사 사례 검색           │
│ 대조 사례 검색           │
│ 과거 결정·대안 검색      │
│ 정책·권한 확인           │
└──────────────────────────┘
        ↓
가설 비교
        ↓
가설을 구분할 다음 관찰
        ↓
근거·정책 검증
        ↓
조건부 판단 또는 보류
```

DAG는 모델이 어떤 문장으로 생각해야 하는지 정하지 않습니다.

> **대신 답변 전에 반드시 준비해야 할 판단 재료와 확인 절차를 정합니다.**

예를 들어 반례 검색 노드는 다음 산출물을 요구할 수 있습니다.

```yaml
outputs:
  counterevidence_refs: []
  weakened_hypotheses: []
  unresolved_questions: []

completion:
  - source_ref_exists
  - evidence_scope_valid
  - hypothesis_effect_recorded
```

대조 사례 노드는 다른 조건을 갖습니다.

```yaml
outputs:
  contrasting_case_refs: []
  decisive_differences: []
  applicability_limits: []

completion:
  - source_ref_exists
  - at_least_one_contrasting_case
  - decisive_difference_explained
```

모델은 검색어를 바꾸고, 관계를 탐색하고, 새로운 가설을 만들 자유가 있습니다. 다만 필요한 판단 재료를 빠뜨린 채 완료를 선언할 수는 없습니다.

### 에이전트 전체를 하나의 DAG로 만들지는 않습니다

조사는 새 반례가 나오면 이전 단계로 돌아갈 수 있습니다.

```text
CONTRACT
→ OBSERVE
→ FRAME
→ CHALLENGE
→ JUDGE
```

`CHALLENGE`에서 중요한 반례가 나오면 다시 `OBSERVE`나 `FRAME`으로 돌아갑니다. 전체 조사는 순환 가능한 상태 머신에 가깝고, 한 번의 조사 회차 안에서 수행하는 작업만 DAG로 구성합니다.

```text
바깥쪽
= 반복 가능한 조사 상태 머신

안쪽
= 한 회차의 근거·반례·사례·정책 조사 DAG
```

상태 머신은 다시 조사할지, 보류할지, 끝낼지를 결정합니다. DAG는 이번 회차에서 무엇을 먼저 하고 무엇을 동시에 할지를 관리합니다.

## 왜 실행 호스트로 Pi Agent를 선택하는가

Pi를 선택한 이유는 단순히 가볍고 확장하기 쉬워서가 아닙니다. 다른 MCP Host도 도구를 연결하고 사용자 승인을 받을 수 있습니다.

Pi의 실제 장점은 **에이전트의 실행 과정에 프로젝트 로컬 TypeScript로 개입하기 쉽다는 것**입니다. Pi extension은 사용자 도구 등록, 도구 호출 차단·수정, 문맥 주입, 사용자 확인 UI와 세션 상태 저장을 지원합니다.[src_001](#src-001) SDK에서는 별도의 `AgentSession`을 만들고 모델·도구·세션 수명주기를 프로그램으로 제어할 수 있습니다.[src_002](#src-002)

Expertise Pack 에이전트에서 Pi가 맡을 수 있는 일은 다음과 같습니다.

```text
현재 조사의 단계 기억
열린 조사 의무 기억
결과에 따라 다음 단계 선택
단계별 도구와 모델 변경
Builder와 격리된 Reviewer 실행
실패 유형별 재시도와 복귀
완료·보류·사람 검토 판정
중단된 조사 재개
```

Pi는 에이전트가 일하는 환경을 관리하는 실행 호스트입니다.

> **DuckCrab의 기능을 언제, 어떤 순서로 사용할지 모델 밖에서 관리합니다.**

Pi는 모델·도구·세션·UI라는 공통 기반을 제공합니다. 프로젝트는 그 위에 도메인에 맞는 조사 방법을 직접 정의할 수 있습니다.

## 조사 계약을 먼저 정의합니다

이제 10번 글의 개념을 프로그램이 검사할 수 있는 규칙으로 바꿔야 합니다. 여기서 계약은 질문을 처리할 때 반드시 지켜야 할 입력, 산출물, 완료 조건을 뜻합니다.

### Question Contract

```yaml
task_type: incident_diagnosis
pack_scope:
  - cache_operations_v1

obligations:
  - separate_observation_and_interpretation
  - create_competing_hypotheses
  - find_supporting_evidence
  - find_counterevidence
  - compare_similar_and_contrasting_cases
  - restore_decision_context
  - check_policies
  - propose_discriminating_observation

terminal_conditions:
  proceed: required_obligations_satisfied
  abstain: critical_evidence_missing
  escalate: high_risk_or_approval_required
```

### Investigation State

```yaml
observations: []
hypotheses: []
supporting_evidence: []
counterevidence: []
similar_cases: []
contrasting_cases: []
decision_context: []
constraints: []
unknowns: []
next_observations: []
revisions: []
stop_reason: null
```

이 상태는 Expertise Pack의 정본과 분리합니다. 이번 질문에서 만든 가설이 다음 질문에서 공식 사실처럼 재사용되면 안 됩니다.

### Node Completion Contract

```yaml
node: search_counterevidence

required_outputs:
  - counterevidence_refs
  - affected_hypotheses
  - unresolved_questions

verifier:
  - source_ref_exists
  - pack_revision_matches
  - evidence_scope_valid
  - hypothesis_effect_recorded
```

### Judgment Packet

```yaml
judgment: "현재는 캐시 무효화 실패 가설이 더 강함"
strongest_hypothesis: cache_invalidation_failure
remaining_alternatives:
  - replica_lag
supporting_evidence: []
counterevidence: []
similar_cases: []
contrasting_cases: []
unknowns: []
next_observation: "캐시 우회 읽기와 일반 읽기의 오류율 비교"
safe_actions: []
forbidden_actions: []
status: ABSTAIN
citations: []
pack_revision: cache_operations_v1@17
```

이 네 계약을 먼저 정하면 공개 Pi 패키지도 같은 기준으로 비교할 수 있습니다. **우리에게 필요한 조사 규칙을 얼마나 대신 구현해 주는가**를 살피면 됩니다.

## Pi 패키지로 어디까지 해결할 수 있는가

범용 병렬 실행과 작업 그래프를 모두 처음부터 만들 필요는 없습니다. 다만 Pi 패키지는 사용자 권한으로 코드를 실행하고 에이전트 행동에 영향을 줄 수 있으므로 설치 전에 소스와 권한을 검토해야 합니다.[src_001](#src-001)

![Pi 기본 기능과 워크플로 패키지가 담당할 범위, Expertise Pack 전용으로 직접 구현할 계약을 나눈 구성 지도](../../attachments/pi-agent-duckcrab-dag-harness/pi-agent-duckcrab-dag-harness-figure-03.png)

### 가장 빠른 조사 MVP: `pi-subagent-workflows`

MVP는 핵심 기능부터 작게 시험하는 첫 버전을 뜻합니다. 이 패키지는 각 작업 담당 에이전트(worker)가 깨끗한 문맥에서 시작하는 fresh-context 방식, 여러 작업을 동시에 돌리는 병렬 실행, 앞 작업의 결과를 다음 작업에 넘기는 파이프라인을 지원합니다. 결과 형식을 JSON Schema로 고정하고, 오류가 나면 수정해 다시 시도하며, 사용량 한도와 실행 기록(journal)도 남깁니다.[src_003](#src-003)

```text
주 Pi 세션
  ├─ 지지 근거 worker
  ├─ 반대 근거 worker
  ├─ 유사 사례 worker
  ├─ 대조 사례 worker
  ├─ 결정·대안 worker
  └─ 정책 worker
         ↓
      가설 비교
         ↓
   격리된 Reviewer
```

DuckCrab MCP를 각 worker에 연결하면 읽기 전용 Expertise Pack 조사 MVP를 빠르게 시험할 수 있습니다. 다만 이 단계는 임의 DAG보다 병렬 작업과 합성 단계가 있는 workflow에 가깝습니다.

### 명시적 데이터 흐름 후보: `pi-agents`

`pi-agents`는 `agent`, `sequence`, `parallel`, `map`, `loop` 같은 노드를 조합하고, 데이터가 명시적인 참조를 따라 흐르게 합니다. 작업 흐름(workflow)과 이전 실행 기록을 저장하며, 존재하지 않는 결과를 가리키거나 작업이 끝없이 되도는 순환(cycle)이 있는지 실행 전에 검사합니다. 다만 Pi가 재시작되면 실행 중이던 작업은 멈추고 기록만 남습니다.[src_004](#src-004)

### 검증·재개·부분 재계산 후보: `pi-taskflow`

`pi-taskflow`는 선언된 작업 그래프를 실행 전에 검사하고, 서로 분리된 하위 에이전트에서 실행합니다. 중단된 지점부터 이어서 실행하는 resume, 이전 과정을 다시 재현하는 replay, 변경의 영향을 받은 최소 구간만 다시 계산하는 기능을 목표로 합니다.[src_005](#src-005)

이 기능이 실제 Expertise Pack 흐름과 잘 맞는다면 DAG 실행기와 상태 관리, 작업 재개, 앞선 변경 때문에 낡아진 구간(stale 영역)의 재계산을 모두 새로 만들 필요가 줄어듭니다.

다만 어느 패키지도 다음 의미 계약까지 대신 만들어 주지는 않습니다.

```text
Expertise Pack 전용 노드 타입
DuckCrab source·evidence ref 완료 조건
가설과 반례 상태
유사·대조 사례 구분
정책·권한 gate
조건부 Judgment Packet
정본 승격 권한
```

이 패키지들은 실행기를 새로 만드는 수고를 줄여 줍니다. 하지만 전문가가 어떤 자료를 확인해야 조사를 마쳐도 되는지는 프로젝트가 직접 정해야 합니다.

## 실제 질문은 이렇게 처리됩니다

사용자가 묻습니다.

> 배포 이후 오래된 데이터 노출이 반복되는 이유는 무엇이며, 가장 안전한 다음 조치는 무엇입니까?

### 1. CONTRACT

```text
대상 Pack: cache_operations_v1
업무 유형: 장애 진단
변경 권한: 읽기 전용
필수 의무:
- 경쟁 가설
- 반례
- 유사·대조 사례
- 정책 확인
- 다음 관찰
종료:
- 근거가 부족하면 ABSTAIN
- 전체 TTL 변경이 필요하면 ESCALATE
```

### 2. OBSERVE

DuckCrab에서 현재 관찰을 가져옵니다.

```text
배포 직후 오류 증가
특정 고객군에서만 오래된 데이터 노출
캐시 무효화 로그 감소
캐시 우회 경로 자료는 없음
```

### 3. FRAME

```text
H1: 캐시 무효화 실패
H2: 읽기 복제본 지연 또는 라우팅 변화
```

### 4. 조사 DAG

```text
H1 지지 근거 ─────┐
H1 반대 근거 ─────┤
H2 지지 근거 ─────┤
H2 반대 근거 ─────┼→ 가설 비교
유사 사례 ────────┤
대조 사례 ────────┤
결정·대안 ────────┤
정책·SLA ──────────┘
```

각 worker는 DuckCrab MCP에서 Pack과 원문을 검색하고 source ref와 receipt를 반환합니다.

### 5. CHALLENGE

격리된 Reviewer가 다음을 확인합니다.

```text
한 가설에 유리한 자료만 선택하지 않았는가
대조 사례를 빠뜨리지 않았는가
과거 SLA를 현재에도 유효하다고 성급히 가정하지 않았는가
그래프 경로를 인과 증명처럼 해석하지 않았는가
```

### 6. JUDGE

현재 결과가 다음과 같다고 해보겠습니다.

```text
캐시 무효화 실패를 지지하는 자료는 있음
복제본 지연을 배제할 자료는 없음
TTL 전면 변경은 고객 SLA 확인 필요
캐시 우회 읽기 지표가 누락됨
```

최종 답은 다음과 같은 형태가 됩니다.

> 현재 근거는 캐시 무효화 실패 가설을 더 지지합니다. 그러나 캐시를 거치지 않는 읽기 경로의 같은 시간대 자료가 없어 복제본 지연을 배제할 수 없습니다. 먼저 두 읽기 경로의 오류율과 지연을 비교해야 합니다. TTL 전면 변경은 고객 SLA와 읽기 부하에 영향을 줄 수 있으므로 지금은 실행하지 않습니다. 제한된 고객군에서 가역적인 무효화 실험을 검토할 수 있지만 운영 책임자의 승인이 필요합니다.

좋은 에이전트는 근거가 부족한 부분까지 정답처럼 채우지 않습니다.

> **현재 자료로 확인할 수 있는 것과 아직 말할 수 없는 것을 구분합니다.**

## 실제 구현 책임은 두 흐름으로 나뉩니다

앞에서는 만들어진 Pack을 질문에 사용하는 과정을 살펴봤습니다. 구현 책임을 정리하려면, 이 조사 흐름을 Pack 자체를 만드는 흐름과 다시 분리해서 봐야 합니다.

```text
Pack Build
역량 질문 → 자료 수집 → Evidence·Claim → 검증 → Promotion → Pack Health

Investigation Workspace
질문 → 조사 계약 → Context Bundle → 가설·반례·사례 → 검증 → 조건부 판단
```

Pack Build는 DuckCrab Search/Collection Harness와 기존 Pack 구축 MCP가 상당 부분 담당할 수 있습니다. Pi는 외부 자료 수집과 전체 실행을 조율할 수 있지만, Grammar 검사와 정본 승격은 DuckCrab에 남겨야 합니다.

현재 가장 크게 비어 있는 부분은 두 번째 흐름입니다.

> **Pi와 DAG가 필요한 핵심 영역은 Pack을 만드는 공장보다, 만들어진 Pack을 사용하는 질문별 전문가 작업공간입니다.**

## Pi와 DuckCrab의 권한은 끝까지 분리합니다

```text
Pi
= 어떤 작업을 언제 실행할 것인가

DuckCrab
= 어떤 지식과 관계가 유효하며 무엇이 정본이 되는가

MCP
= Pi와 DuckCrab을 연결하는 표준 경계

사람
= 고위험 행동과 공식 지식 변경을 승인
```

Pi 상태에는 공식 사실의 복사본을 넣지 않습니다. `evidenceRef`, `candidateRef`, `validationReceiptRef`, `packRevision`처럼 DuckCrab artifact를 가리키는 참조만 보존합니다.

DuckCrab도 Pi가 만든 후보를 그대로 믿지 않습니다. 정본을 바꾸기 전에는 Grammar, Evidence, 권한과 승격 조건을 다시 검사해야 합니다.

## 온톨로지 자동 변경은 뒤로 미룹니다

읽기 전용 Expertise Pack 에이전트와 온톨로지를 자동 변경하는 에이전트는 위험도가 다릅니다.

현재 DuckCrab Search Harness는 검증된 Promotion Package를 Source → Node → Edge 순서로 적용합니다. 앞 단계가 실패하면 뒤 단계는 차단하지만, 전체 변경을 하나의 원자적 트랜잭션으로 묶지는 못합니다. 일부 자료가 반영된 뒤 `partial_failure`가 발생할 수 있습니다.[src_007](#src-007)

현재 완성된 필수 계약에는 다음이 없습니다.

```text
expected base revision
candidate hash 재검사
reviewer disposition
approval envelope
전체 write set 원자성
실제로 실행되는 rollback
```

Pi는 승격 전 독립 검토와 사용자 승인, 승격 전후 평가, rollback 권고까지 조율할 수 있습니다. 실제 원자적 승격과 복구는 DuckCrab Core의 권위 계약이어야 합니다.

DAG는 작업 순서를 관리하지만 데이터베이스 트랜잭션을 대신하지 않습니다.

## 가장 현실적인 구현 순서

### P0. 기존 에이전트와 DuckCrab MCP를 기준선으로 측정합니다

```text
핵심 근거를 찾았는가
반례를 자발적으로 찾았는가
유사·대조 사례를 모두 봤는가
사람이 무엇을 수정했는가
비용과 시간은 얼마였는가
근거 부족에서 적절히 보류했는가
```

Pi와 DAG의 효과를 주장하려면 비교할 기준선이 필요합니다.

### P1. 좋은 Expertise Pack을 먼저 만듭니다

작은 도메인 하나를 고르고 Evidence·Claim, 결정과 버린 대안, 유사·대조 사례, 정책, 시간과 버전, 전문가 질문을 보강합니다.

Pack 품질이 낮으면 어떤 실행 하네스도 좋은 판단 재료를 만들 수 없습니다.

### P2. `pi-subagent-workflows`로 읽기 전용 작업공간을 시험합니다

근거, 반례, 유사 사례, 대조 사례, 결정·대안, 정책과 Reviewer를 별도 worker로 실행합니다. 모든 출력에 DuckCrab source ref와 receipt를 남깁니다.

### P3. Question Contract와 Investigation State를 만듭니다

Pi extension에 protocol, phase, status, 열린 의무, 가설, 미지, evidence ref, 예산과 stop reason을 저장합니다. 이 상태는 대화 compaction과 분리합니다.

### P4. 기존 Workflow 패키지를 같은 과제로 비교합니다

`pi-subagent-workflows`, `pi-agents`, `pi-taskflow`를 비교합니다.

```text
조사 의무를 표현하기 쉬운가
DuckCrab receipt로 완료를 검사할 수 있는가
실패 위치를 식별할 수 있는가
중단 후 재개할 수 있는가
성공 결과를 재사용할 수 있는가
전체 재실행보다 비용이 줄어드는가
```

범용 실행기가 충분하다면 새 DAG 엔진을 만들지 않습니다.

### P5. DuckCrab 의미 가드를 연결합니다

관계·정책·권한·근거가 중요한 노드에만 `requiredEvidence`, `requiredRelations`, `requiredPolicies`, `requiredPermissions`를 붙입니다. 단순 파일 읽기와 형식 변환까지 온톨로지로 통제하지 않습니다.

### P6. Ontology Change Protocol은 마지막에 추가합니다

```text
PROPOSE
→ VALIDATE
→ ATTACK
→ REPAIR
→ APPROVE
→ PROMOTE
→ VERIFY
```

자동 승격과 rollback은 DuckCrab의 revision·atomicity 계약이 준비된 뒤에 검토합니다.

> [!important] 구현 원칙
> 처음부터 Pi와 DuckCrab 안에 각각 별도의 에이전트 루프를 만들지 않습니다. **Pi는 실행의 주인, DuckCrab은 의미와 정본 권위의 주인**으로 둡니다.

## 질문의 난이도에 맞춰 구조를 고릅니다

모든 질문에 가장 복잡한 구조를 적용할 필요는 없습니다. 다음과 같은 기능을 한꺼번에 만들면 구현과 검증 범위가 지나치게 커집니다.

```text
모든 질문을 DAG로 처리하는 범용 에이전트
시니어의 머릿속을 그대로 복제한 온톨로지
그래프 경로만으로 인과를 확정하는 추론기
LLM의 제안을 바로 정본으로 저장하는 자동 메모리
DuckCrab 안에 또 하나의 모델 루프를 만드는 구조
Pi에 공식 지식 변경 권한까지 주는 구조
```

단순하고 위험이 낮은 질문은 기존 에이전트와 DuckCrab MCP로 바로 처리하면 됩니다.

```text
한 번의 검색으로 끝나는 질문
→ Direct

몇 개의 독립 확인이 필요한 질문
→ Mini Workflow

경쟁 가설·반례·정책 검사가 필요한 질문
→ Investigation DAG

정본 변경과 사람 승인이 필요한 질문
→ Ontology Change Protocol
```

질문이 단순하면 직접 검색으로 끝내고, 위험과 불확실성이 커질 때만 더 강한 조사 계약을 적용하는 편이 안전하고 이해하기 쉽습니다.

## 결론: Expertise Pack을 살아 움직이게 만드는 일

10번 글에서 Expertise Pack은 강한 모델에게 조직의 세계와 증거를 제공하는 작업환경으로 제안됐습니다.

OpenCrab은 그 작업환경을 만들기 위한 의미 문법과 Pack 구조를 보여 줬습니다. DuckCrab은 이를 로컬 정본, Pack, 통합 검색, Retrieval Plan, AgentContextBundle, Evidence와 Search Harness로 상당 부분 구현했습니다.

다음 단계는 검색기나 그래프의 크기를 키우는 일이 아닙니다.

> **좋은 Expertise Pack을 질문에 맞는 작은 전문가 작업공간으로 바꾸고, 필요한 판단 재료가 준비될 때까지 조사하는 실행 계층을 만드는 일**입니다.

기존 에이전트에 DuckCrab MCP만 연결해도 간단한 질문과 사람이 감독하는 Pack 작업은 수행할 수 있습니다. 하지만 장기 조사에서 경쟁 가설·반례·대조 사례·과거 결정·정책·보류 조건을 실제로 수행했는지 확인하려면 모델 밖의 조사 상태와 완료 계약이 필요합니다.

DAG는 그 조사 의무를 작업과 완료 조건으로 바꿉니다. Pi Agent는 그 DAG와 조사 상태를 프로젝트 로컬에서 빠르게 실험할 수 있는 실행 호스트입니다. 공식 지식의 최종 권위는 DuckCrab에 남습니다.

```text
DuckCrab
= 시니어가 참고할 판단 재료와 정본을 관리한다

Pi
= 그 재료를 어떤 순서로 조사할지 관리한다

DAG
= 답변 전에 필요한 판단 재료가 준비됐는지 확인한다

LLM
= 준비된 재료로 가설·비교·설명과 다음 조사를 만든다

사람
= 고위험 행동과 공식 지식 변경을 승인한다
```

이 구조가 지향하는 에이전트는 시니어의 말투만 흉내 내지 않습니다.

> 조직의 실제 근거를 읽고, 첫 설명을 의심하고, 반례를 찾으며, 모르는 부분에서는 멈출 줄 압니다.

Expertise Pack은 그 AI가 참고할 지도입니다. Pi와 DAG는 그 지도를 들고 실제로 조사하게 만드는 방법입니다.

## 출처

- <a id="src-001"></a> Pi. [Extensions documentation](https://pi.dev/docs/latest/extensions). 프로젝트 로컬 TypeScript extension, 사용자 도구, 이벤트 가로채기, 문맥 주입, UI와 세션 상태 저장.
- <a id="src-002"></a> Pi. [SDK documentation](https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/sdk.md). 별도 `AgentSession`과 프로그램 방식의 agent 통합.
- <a id="src-003"></a> Pi Packages. [pi-subagent-workflows](https://pi.dev/packages/pi-subagent-workflows). fresh-context worker, 병렬·pipeline, 구조화 출력, 예산과 journal.
- <a id="src-004"></a> Pi Packages. [pi-agents](https://pi.dev/packages/pi-agents). 명시적 workflow 표현식, 참조 기반 데이터 흐름, cycle 검사와 run history.
- <a id="src-005"></a> Pi Packages. [pi-taskflow](https://pi.dev/packages/pi-taskflow). 실행 전 그래프 검증, 격리 실행, resume·replay와 stale frontier 재계산.
- <a id="src-006"></a> Zhang, Y. et al. (2026). [Atomic Task Graph: A Unified Framework for Agentic Planning and Execution](https://arxiv.org/abs/2607.01942). 명시적 작업 의존성과 실패 영역 수리를 제안한 arXiv preprint.
- <a id="src-007"></a> DuckCrab local repository audit. `docs/ARCHITECTURE.md`, `docs/CURRENT_STATE.md`, `docs/SEARCH_COLLECTION_HARNESS_PLAN.md`와 관련 MCP·검색 하네스 코드를 2026-07-25에 대조한 내부 구현 감사. 공개 재현 출처가 아니라 현재 로컬 경계를 기록한 근거입니다.

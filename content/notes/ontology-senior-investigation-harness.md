---
title: "13. 온톨로지 에이전트 시리즈 총정리: 12편의 결론을 시니어 조사 하네스로 잇기"
description: "온톨로지 에이전트 시리즈 1~12번을 의미와 검증, 도입 경계, 지식 Pack, 계획과 반증의 네 부로 정리하고, 이 결론들이 왜 하나의 시니어 조사·판단 하네스로 이어지는지 초보자도 따라갈 수 있게 설명합니다."
date: 2026-07-24
tags:
  - 온톨로지
  - AI에이전트
  - 지식그래프
  - DuckCrab
  - 에이전트평가
---

![온톨로지 에이전트 시리즈의 네 발전 단계가 지속 지식, 질문별 조사 상태, 검증과 조건부 판단을 갖춘 하나의 조사 하네스로 이어지는 전체 지도](../attachments/ontology-senior-investigation-harness/ontology-senior-investigation-harness-infographic.png)

> [!summary] 핵심 결론
> 앞선 열두 편이 도달한 결론은 “온톨로지를 붙이면 AI가 똑똑해진다”가 아닙니다. **조직의 말과 규칙을 같은 뜻으로 이해하게 하고, 근거와 제약을 보존하며, 질문마다 가설·반례·미지를 갱신하고, 검증되지 않은 판단과 지식 변경을 막는 작업환경이 필요하다**는 것입니다. 13번 글은 이 부품들을 하나의 조사 하네스로 연결합니다.

온톨로지, 지식그래프, RAG, 에이전트, Judge, Pack, 계획, 반증까지. 열두 편을 차례대로 읽으면 각각의 주장은 이해할 수 있지만, 처음 온 독자에게는 한 가지 질문이 남습니다.

> 그래서 이 모든 것이 어떻게 하나의 에이전트로 연결되는가?

이번 글은 새로운 개념을 하나 더 얹기보다, 먼저 1~12번에서 무엇을 확인했는지 정리합니다. 그런 다음 각 결론이 왜 **지속 지식, 질문별 조사 계획, 조사 상태, 검증 기록과 조건부 판단**이라는 전체 구조로 이어지는지 살펴보겠습니다.

가상의 장애 사례 하나를 끝까지 사용하겠습니다. 서비스를 배포한 직후 일부 고객에게 오래된 데이터가 보이기 시작했다고 가정해 보겠습니다. 단순한 에이전트는 관련 문서를 검색한 뒤 “캐시 무효화 실패가 원인입니다”라고 답할 수 있습니다. 하지만 실제로 필요한 것은 첫 설명을 빨리 확정하는 일이 아닙니다. 다른 원인을 함께 비교하고, 어떤 자료가 빠졌는지 확인하며, 지금 해도 되는 조치와 사람의 승인이 필요한 조치를 구분하는 일입니다.

> [!important] 이 글의 범위
> 아래 구조는 이미 성능이 입증된 완제품이 아닙니다. 블로그 1~12번의 결론, 관련 연구, OpenCrab의 설계 원형과 DuckCrab의 현재 구현을 연결한 **참조 구조**입니다. 그래프, 반복 조사와 Validator가 각각 얼마나 기여하는지는 별도의 통제 실험으로 확인해야 합니다.

## 먼저 열두 편의 전체 지도를 봅시다

열두 편은 크게 네 부로 묶을 수 있습니다.

| 구분                  | 글      | 초보자의 질문                                                    | 이 부가 내린 결론                                                                      |
| --------------------- | ------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1부. 의미와 검증      | 1~4번   | 온톨로지를 붙인 에이전트는 무엇이 달라야 합니까?                 | 같은 말을 같은 뜻으로 이해하고, 근거·제약·판정·승인 권한을 분리해야 합니다.            |
| 2부. 도입 경계와 구현 | 5~7번   | 모든 문제에 온톨로지가 필요합니까?                               | 아닙니다. 관계 재사용, 변경 영향과 감사 비용이 커질 때만 복잡성이 값을 합니다.         |
| 3부. Pack과 문맥 조립 | 8~10번  | 조직의 지식을 어떤 형태로 에이전트에게 줍니까?                   | 그래프만 넘기지 말고 근거, 결정, 실패, 반례와 출처를 버전 있는 Pack으로 묶어야 합니다. |
| 4부. 계획과 반증      | 11~12번 | 검색한 지식으로 어떻게 행동하고, 틀린 첫 판단을 어떻게 고칩니까? | 계획의 조건을 명시하고, 새 외부 근거로 가설을 갱신하며, 필요하면 보류해야 합니다.      |

![온톨로지 에이전트 시리즈 1~12번이 의미·검증, 도입 경계, Pack·전문성, 계획·반증의 네 단계로 발전한 뒤 13번의 조사 하네스로 통합되는 지도](../attachments/ontology-senior-investigation-harness/ontology-senior-investigation-harness-figure-01.png)

이 네 부는 서로 독립된 주제가 아닙니다. 앞부분에서 발견한 문제가 다음 부의 질문이 됐습니다.

```text
뜻을 맞춘다
  → 근거와 행동을 검증한다
  → 언제 온톨로지가 필요한지 경계를 정한다
  → 조직 지식을 Pack으로 묶는다
  → 질문에 필요한 문맥만 조립한다
  → 계획을 만들고 반례로 수정한다
  → 근거가 부족하면 멈춘다
```

이제 각 부가 어떤 주장을 했는지 차례대로 정리해 보겠습니다.

## 1부. 온톨로지 에이전트는 의미와 행동의 계약에서 시작합니다

### 1번: 온톨로지는 AI에게 같은 뜻을 쓰게 하는 약속입니다

[[notes/ontology-agent-guide|1번 글]]은 가장 기본적인 질문에서 시작했습니다. 온톨로지는 단순한 용어 사전이나 그래프 데이터베이스가 아닙니다. 사람과 시스템이 `고객`, `장애`, `근거`, `승인` 같은 말을 어떤 뜻으로 쓰고, 서로 어떻게 연결하며, 어떤 제약을 적용할지 명시하는 **공유 의미 계약**입니다.

LLM은 자연어를 유연하게 다루지만, 그 유연함 때문에 같은 단어를 문맥마다 다르게 해석할 수 있습니다. 온톨로지는 모델의 추론을 대신하지 않습니다. 대신 모델이 조직 안에서 어떤 개념과 관계를 기준으로 답해야 하는지 경계를 제공합니다.

캐시 장애 사례에서는 `배포`, `캐시`, `읽기 경로`, `고객 SLA`, `관찰`, `원인 가설`이 서로 어떤 관계인지 같은 언어로 표현하는 일이 첫 단계입니다.

### 2번: 에이전트 시대의 온톨로지는 실행의 의미 계층입니다

[[notes/ontology-in-the-agentic-era|2번 글]]은 의미 계약을 행동으로 확장했습니다. 질문에 답하는 시스템이라면 개념을 잘 찾는 것만으로도 쓸모가 있습니다. 그러나 도구를 호출하고 설정을 바꾸는 에이전트라면 `무엇을 할 수 있는가`, `어떤 조건에서 가능한가`, `누가 승인해야 하는가`까지 알아야 합니다.

그래서 에이전트 시대의 온톨로지는 지식을 설명하는 층을 넘어 다음 항목을 연결해야 합니다.

- 현재 상태와 목표 상태
- 가능한 행동과 선행조건
- 정책과 접근 권한
- 예상 효과와 부작용
- 관찰할 신호와 롤백 조건

캐시 TTL을 낮추는 조치가 기술적으로 가능하더라도, 고객 SLA와 부하 정책을 위반한다면 에이전트는 실행해서는 안 됩니다. 의미를 안다는 것은 행동의 허용 범위도 안다는 뜻입니다.

### 3번: 그럴듯한 답과 통과한 판단은 다릅니다

[[notes/ontology-judge-loop-agent-validation|3번 글]]은 LLM이 스스로 낸 답을 그대로 믿지 않는 검증 구조를 다뤘습니다. 검증은 하나의 거대한 Judge에게 맡기기보다 역할을 나눠야 합니다.

- 기계가 확실히 확인할 수 있는 형식, 인용, 수치, 권한과 상태 전환
- 문맥을 읽어야 하는 품질, 충실성, 반례와 설명
- 위험한 예외와 최종 승인에 대한 사람의 판단

여기서 중요한 것은 Judge의 점수 자체가 아닙니다. 어떤 기준을 검사했고, 어떤 근거로 통과하거나 보류했는지 남기는 일입니다. 캐시 장애 답변이라면 인용한 로그가 실제로 존재하는지, 시간대가 맞는지, 다른 고객의 사건을 잘못 섞지 않았는지부터 확인해야 합니다.

### 4번: 창발은 멋진 답이 아니라 검증 가능한 행동 변화입니다

[[notes/ontology-emergent-agent|4번 글]]은 “온톨로지를 주면 새로운 행동이 창발한다”는 표현을 엄격하게 다뤘습니다. 온톨로지를 바꾼 뒤 에이전트의 행동이 달라졌다고 해서 곧바로 온톨로지의 효과라고 말할 수는 없습니다. 프롬프트, 검색 결과와 모델의 우연한 변동 때문일 수도 있습니다.

행동 변화는 다음처럼 추적해야 합니다.

```text
지식 또는 정책 변경
  → 에이전트가 읽은 문맥 변경
  → 제안한 행동 변경
  → Validator 결과
  → 사람 승인 또는 거절
  → 실제 관찰
  → 필요하면 롤백
```

### 1부의 결론

1~4번의 공통 결론은 분명합니다.

> **온톨로지 에이전트의 첫 번째 가치는 더 많은 지식을 저장하는 데 있지 않습니다. 의미, 근거, 제약, 판정과 승인 권한을 모델 바깥의 계약으로 만드는 데 있습니다.**

하지만 여기서 다음 질문이 생깁니다. 이런 계약이 모든 문제에 필요할까요? 간단한 규칙 하나를 확인하는 데도 온톨로지를 구축해야 할까요?

## 2부. 온톨로지는 항상 정답이 아니라 조건부 선택입니다

### 5번: 먼저 더 작은 기준선과 비교해야 합니다

[[notes/ontology-agent-behavior-experiment|5번 글]]은 “온톨로지가 정말 필요한가?”를 실험 문제로 바꿨습니다. 비교 대상은 일반 LLM 하나가 아닙니다.

- 프롬프트에 직접 적은 규칙
- JSON 정책
- 검색 카드
- SHACL 같은 구조 검증
- 실제 관계를 가진 온톨로지
- 모양만 비슷하고 의미가 없는 가짜 온톨로지

단순한 정책 판정에서는 JSON 규칙이나 검색 카드가 더 싸고 명확할 수 있습니다. 온톨로지를 도입했다는 사실만으로 나은 결과를 기대해서는 안 됩니다.

### 6번: 관계가 재사용되고 변경이 퍼질 때 온톨로지가 값을 합니다

[[notes/ontology-vs-json-rules|6번 글]]은 JSON 규칙과 온톨로지의 경계를 더 구체적으로 정리했습니다.

JSON은 한 장소에서 읽고 바로 판정할 수 있는 작은 규칙에 강합니다. 반면 다음 조건이 커지면 관계 모델이 유리해질 수 있습니다.

- 한 관계를 여러 질문과 기능에서 반복해 사용합니다.
- 두세 단계 이상 떨어진 관계를 따라가야 합니다.
- 개념 하나의 변경이 여러 정책과 결과에 영향을 줍니다.
- 판단의 근거 경로를 나중에 감사해야 합니다.
- 서로 다른 팀의 데이터와 용어를 연결해야 합니다.

즉, 온톨로지의 가치는 노드 수가 아니라 **관계 재사용, 변경 영향과 감사 비용**에서 나타납니다.

### 7번: 구현은 저장, 검색, 검증, 추론과 쓰기를 분리해야 합니다

[[notes/local-ontology-agent-implementation|7번 글]]은 현실적인 로컬 구현 경계를 다뤘습니다. 한 시스템이 모든 일을 맡으면 빠르게 복잡해집니다. 최소한 다음 층을 분리해야 합니다.

```text
정본 저장
검색과 문맥 조립
형식·정책 검증
빠른 규칙 추론
필요할 때의 깊은 LLM 추론
후보 지식 제안
사람 검토와 정본 승격
```

처음부터 거대한 추론기를 만드는 대신, 읽기 전용 질의와 제한된 템플릿부터 시작하는 편이 안전합니다. 쓰기는 별도의 후보·검증·승인 경로로 보내야 합니다.

### 2부의 결론

5~7번은 온톨로지에 대한 기대를 낮추는 대신 도입 기준을 선명하게 만들었습니다.

> **단순한 문제에는 단순한 규칙을 씁니다. 관계가 여러 질문에서 재사용되고, 변경 영향과 감사 경로가 커질 때 온톨로지를 비교합니다. 도입하더라도 읽기, 검증과 승인 쓰기를 한 덩어리로 만들지 않습니다.**

이 결론은 “온톨로지를 만들 것인가”보다 더 중요한 질문으로 이어집니다. 만들기로 했다면 무엇을 담고, 어떤 단위로 에이전트에게 전달해야 할까요?

## 3부. 그래프를 넘기는 대신 조직의 판단 문맥을 Pack으로 묶습니다

### 8번: OpenCrab이 만든 것은 온톨로지 파일 하나가 아니라 배포 단위입니다

[[notes/opencrab-ontology-build-architecture|8번 글]]은 OpenCrab의 구조를 살펴보며 온톨로지 빌드가 무엇을 만들어야 하는지 분석했습니다.

OpenCrab의 중요한 아이디어는 다음을 한 흐름으로 묶는 데 있습니다.

- 질문을 여러 관점으로 보는 9-Space
- 원문 근거인 Evidence와 해석인 Claim
- 개념과 관계를 담는 Graph
- 특정 도메인의 지식을 묶는 Pack
- 에이전트가 접근하는 MCP 표면
- 후보, 검증과 승격을 나누는 거버넌스

여기서 Pack은 단순한 파일 묶음이 아닙니다. 어떤 지식이 어디서 왔고, 어떤 버전이며, 누구에게 공개되고, 어떻게 검증됐는지를 함께 전달하는 배포 단위입니다.

### 9번: 온톨로지는 추론기보다 문맥 컴파일러에 가깝습니다

[[notes/ontology-context-compiler-opencrab|9번 글]]은 OpenCrab의 실제 공개 구현과 목표 구조 사이의 간극을 짚었습니다. 공개 구현은 완성된 판단 엔진이라기보다 Pack을 만들고 여러 방식으로 검색하는 기반에 더 가깝습니다.

질문에 답할 수 있는 문맥을 만들려면 검색 결과 목록만으로는 부족합니다.

```text
자연어 질문
  → 질문의 역할과 필요한 근거를 정하는 계획
  → 벡터·키워드·그래프 검색
  → 원문 근거와 출처 보강
  → 사실·주장·정책·누락을 구분한 문맥 묶음
  → LLM의 해석과 계획
  → 결정론적 검사
```

이 관점에서 온톨로지는 답을 직접 계산하는 기계라기보다, 질문에 맞는 사실과 관계, 근거, 정책과 빠진 정보를 골라 LLM에 전달하는 **문맥 컴파일러**입니다.

### 10번: 전문가의 지식은 사실 목록보다 넓습니다

[[notes/ontology-expertise-pack|10번 글]]은 “시니어 엔지니어의 사고를 외부화할 수 있는가?”를 물었습니다. 시니어의 전문성은 용어와 정답 목록만으로 설명되지 않습니다.

실제 판단에는 다음 내용이 함께 들어갑니다.

- 과거 사건과 당시 관찰
- 선택한 결정과 버린 대안
- 결정 당시의 전제와 제약
- 성공 사례뿐 아니라 실패 사례
- 인과 가설과 반례
- 아직 모르는 부분
- 가설을 구분할 다음 관찰과 실험

Expertise Pack은 “무엇이 사실인가”뿐 아니라 “왜 그렇게 판단했으며, 언제 그 판단이 더는 유효하지 않은가”까지 보존해야 합니다.

캐시 장애 질문에서 필요한 것은 `캐시`라는 개념의 정의만이 아닙니다. 과거 유사 장애, 원인이 달랐던 대조 사례, TTL을 정한 이유, 고객 SLA, 배포와 롤백 기록이 함께 필요합니다.

### 3부의 결론

8~10번은 지식그래프의 역할을 다시 정의했습니다.

> **에이전트에게 필요한 것은 큰 그래프 자체가 아닙니다. 사실과 해석, 결정과 실패, 반례와 미지, 출처와 버전을 함께 가진 조직 지식 Pack이며, 질문마다 그중 필요한 부분만 문맥으로 조립해야 합니다.**

그러나 좋은 문맥을 가져왔다고 좋은 답이 자동으로 나오지는 않습니다. 에이전트가 첫 가설에 고착되거나, 그럴듯하지만 실행 불가능한 계획을 만들 수 있기 때문입니다.

## 4부. 지식을 계획으로 바꾸고, 첫 판단을 반례로 고칩니다

### 11번: 지식그래프는 계획을 계산하기보다 계획의 재료와 제약을 제공합니다

[[notes/kg-guided-llm-planning|11번 글]]은 지식그래프가 LLM의 계획을 어떻게 도울 수 있는지 다뤘습니다.

계획에는 목표만 있으면 안 됩니다. 적어도 다음 요소가 필요합니다.

```text
목표와 현재 상태
가능한 행동
행동의 선행조건
정책과 권한
예상 효과와 부작용
관찰할 신호
실패 조건과 롤백
```

Think-on-Graph와 KG-Agent는 LLM이 그래프의 개체와 관계를 단계적으로 탐색해 복합 질의를 다루는 구조를 보여줬습니다.[src_003](#src-003)[src_004](#src-004) 그래프는 이 관계를 명시해 LLM이 행동 공간과 제약을 보도록 돕습니다. 그러나 그래프 경로가 존재한다고 그 행동이 현실에서 옳거나 안전하다는 뜻은 아닙니다. LLM은 후보 계획을 만들고, 실행 가능성과 정책은 별도 플래너나 Validator가 확인해야 합니다.[src_007](#src-007)[src_008](#src-008)[src_009](#src-009)

### 12번: 좋은 조사 에이전트는 한 번 검색하고 답하지 않습니다

[[notes/iterative-investigation-refutation-loop|12번 글]]은 계획과 가설을 어떻게 수정할지 다뤘습니다. 중요한 것은 같은 모델에게 “다시 생각해”라고 여러 번 말하는 것이 아닙니다. 새로운 외부 신호를 요구하고, 그 신호 때문에 무엇이 바뀌었는지 기록해야 합니다.

조사 상태에는 다음 내용이 필요합니다.

```text
현재 관찰
주 가설과 경쟁 가설
지지 근거와 반례
유사 사례와 대조 사례
정책과 제약
미지
다음 검색 또는 도구 호출
가설을 수정한 이유
종료 또는 보류 이유
```

ReAct와 CRITIC은 외부 환경과 도구의 관찰을 추론에 다시 넣는 가능성을 보여줬습니다.[src_010](#src-010)[src_011](#src-011) 반면 외부 피드백 없는 자기교정은 실패하거나 성능을 떨어뜨릴 수 있고, 여러 차례 보고서를 고치는 과정에서 기존의 맞는 주장과 인용이 손상될 수도 있습니다.[src_012](#src-012)[src_013](#src-013)[src_014](#src-014)

반복에는 종료 조건도 필요합니다. 근거가 충분하면 진행하고, 가설을 구분할 자료가 없으면 보류하며, 위험이 크면 사람에게 넘깁니다.

### 4부의 결론

11~12번은 지식을 행동으로 바꾸는 마지막 연결 고리를 만들었습니다.

> **그래프는 계획의 재료와 제약을 제공하고, LLM은 경쟁 가설과 후보 계획을 만듭니다. 조사 루프는 새 외부 근거로 가설을 갱신합니다. 근거가 부족하거나 위험이 크면 `ABSTAIN` 또는 `ESCALATE`가 정상적인 답입니다.**

## 열두 편을 모두 합치면 무엇이 남습니까

열두 편의 결론을 한 문장으로 압축하면 다음과 같습니다.

> **온톨로지 에이전트는 그래프에서 정답을 꺼내는 시스템이 아니라, 조직의 의미·근거·결정·실패·정책을 지속 가능한 지식으로 보존하고, 질문마다 필요한 조사 문맥을 조립해 LLM이 가설과 계획을 만들도록 하며, 기계와 사람이 그 결과와 지식 변경을 검증하는 작업환경입니다.**

여기에는 여섯 가지 원칙이 들어 있습니다.

1. **의미를 명시합니다.** 같은 말이 시스템마다 다른 뜻이 되지 않게 합니다.
2. **근거와 해석을 나눕니다.** 원문 Evidence와 그 위에 세운 Claim을 구분합니다.
3. **온톨로지는 필요한 곳에만 씁니다.** 작은 규칙은 JSON과 구조 검증으로 해결합니다.
4. **오래 남을 지식과 임시 가설을 분리합니다.** 조사 중 생긴 추측을 곧바로 조직의 사실로 만들지 않습니다.
5. **LLM, Validator와 사람의 권한을 나눕니다.** 생성한 모델이 스스로 정본 변경까지 승인하지 않습니다.
6. **답보다 조사 상태를 남깁니다.** 무엇을 알고, 무엇을 모르며, 무엇을 다음에 확인해야 하는지 기록합니다.

이 원칙들을 실행 구조로 바꾸면 13번의 시니어 조사·판단 하네스가 나옵니다.

## 종합 구조: 오래 남는 지식과 질문마다 바뀌는 조사를 분리합니다

가장 중요한 구분은 **지속 지식**과 **질문별 조사 상태**입니다.

```text
지속 계층
Expertise Pack + revision + provenance

질문 계층
Semantic Investigation Plan + Investigation State + retrieval receipt

출력 계층
Validation Receipt + Judgment Packet

쓰기 계층
Proposal
  → candidate
  → validation
  → human review
  → promotion
```

Expertise Pack과 Investigation State를 합치면 첫 조사에서 나온 미확정 가설이 다음 질문에서 사실처럼 재사용될 수 있습니다. 반대로 모든 내용을 세션 메모에만 두면 과거 결정의 이유와 출처가 사라집니다.

LLM은 후보 가설과 Proposal을 만들 수 있습니다. 그러나 조직의 공식 지식으로 확정하는 권한까지 가져서는 안 됩니다. 최종 판단을 내린 사건과 장기 지식을 바꾼 사건은 별도로 기록해야 합니다.

## 다섯 계약을 쉬운 질문으로 이해해 봅시다

![지속되는 Expertise Pack, 요청 단위의 조사 계획과 조사 상태, 출력 단계의 검증 영수증과 판단 패킷을 서로 다른 수명주기로 분리한 다섯 계약](../attachments/ontology-senior-investigation-harness/ontology-senior-investigation-harness-figure-02.png)

| 쉬운 질문                                     | 계약                        | 역할                                                                    |
| --------------------------------------------- | --------------------------- | ----------------------------------------------------------------------- |
| 다음 질문에도 무엇을 기억해야 합니까?         | Expertise Pack              | 조직의 사실, 근거, 사건, 결정, 실패, 정책과 버전을 보존합니다.          |
| 이번 질문에서 무엇을 반드시 확인해야 합니까?  | Semantic Investigation Plan | 필요한 자료, 경쟁 가설, 반례, 정책 검사와 종료 조건을 정합니다.         |
| 조사하면서 무엇이 바뀌었습니까?               | Investigation State         | 관찰, 가설, 근거, 반례, 미지, 다음 검사와 수정 이유를 누적합니다.       |
| 무엇까지 실제로 검사했습니까?                 | Validation Receipt          | 인용, 수치, 시간, 권한, Pack 버전과 종료 조건의 검사 범위를 남깁니다.   |
| 지금 무엇을 해도 되며 무엇을 보류해야 합니까? | Judgment Packet             | 조건부 판단, 대안, 다음 검사와 `PROCEED·ABSTAIN·ESCALATE`를 전달합니다. |

### 1. Expertise Pack: 다음 질문에도 남는 조직 지식

Pack에는 도메인 객체와 관계만 들어가면 부족합니다.

```text
도메인 객체와 관계
+ Evidence와 Claim
+ 사건·실패·결정·버린 대안
+ 적용 조건·유효 기간·권한
+ 인과·영향 가설
+ Pack revision과 provenance
```

고전 온톨로지는 공유할 개념과 관계를 명시적인 의미 계약으로 표현합니다.[src_001](#src-001)[src_002](#src-002) OpenCrab은 9-Space, Evidence·Claim, Pack과 MCP를 통해 이 개념을 에이전트가 읽을 수 있는 조직 지식 단위로 확장하려 했습니다.[src_018](#src-018)

### 2. Semantic Investigation Plan: 이번 질문의 조사 의무

이 계획은 “벡터 검색을 할까, 그래프 검색을 할까?”보다 위에 있습니다. 이번 질문에서 어떤 자료와 검토 결과가 반드시 있어야 하는지를 정합니다.

```yaml
question_type: incident_diagnosis
required:
  - current_observations
  - competing_hypotheses
  - supporting_evidence
  - counterevidence
  - applicable_policy
  - unknowns
obligations:
  - 유사 사례와 대조 사례를 함께 조사한다
  - 가설을 구분할 다음 관찰을 제안한다
  - 근거가 부족하면 판단을 보류한다
stop_conditions:
  - 필수 근거 충족
  - 추가 정보가치 소진
  - 조사 예산 소진
  - 사람 승인이 필요한 위험 도달
```

이 이름은 DuckCrab의 현재 `retrieval_plan`과 구분해야 합니다. 현재 `retrieval_plan`은 검색어 변형, 그래프·스키마 용어, 검색 경로와 확장 범위를 정하는 **검색 실행 계획**입니다. Semantic Investigation Plan은 그 위에서 조사 의무를 정하는 제안 층이며, 2026년 7월 24일 현재 공개 DuckCrab 런타임 기능이 아닙니다.[src_015](#src-015)[src_017](#src-017)

실행할 때는 Plan의 필수 자료와 경쟁 가설을 `retrieval_plan`으로 컴파일합니다. 검색 결과와 retrieval receipt, `AgentContextBundle`에서 확인된 관찰과 빠진 관계가 Investigation State의 초기 상태가 됩니다. 이렇게 해야 계획, 검색과 상태 갱신이 이름만 다른 문서로 흩어지지 않습니다.

### 3. Investigation State: 한 질문 안에서 바뀌는 조사 상태

조사 상태는 Pack과 수명이 다릅니다.

```text
관찰
+ 주 가설과 경쟁 가설
+ 지지 근거와 반례
+ 유사·대조 사례
+ 정책과 제약
+ 미지
+ 다음 검색·도구 호출
+ 수정 이유와 종료 이유
```

반복할 때마다 전체 답안을 처음부터 다시 쓰지 않습니다. 어떤 외부 신호 때문에 어떤 가설이 강해지거나 약해졌는지 변경분을 남깁니다. 조사 중 생긴 가설은 검증과 승격 없이 Expertise Pack의 정본이 되지 않습니다.

요청이 끝나면 Investigation State의 처리 결과도 명시합니다. 감사에 필요한 상태는 보존하고, 재사용 가치가 없는 임시 상태는 폐기합니다. 다음 질문에도 남길 관찰이나 결정은 출처 확인, 검증과 사람 승인을 거쳐 Expertise Pack의 Proposal로 전환합니다.

### 4. Validation Receipt: 자신감이 아니라 검사 범위

Validator는 LLM의 자신감과 별개로 기계가 확인할 수 있는 항목을 맡습니다.

- 인용한 Evidence가 실제로 존재합니까?
- Claim이 원문의 범위를 넘어섰습니까?
- 서로 다른 Pack revision을 섞었습니까?
- 접근 권한과 정책을 위반했습니까?
- 수치, 단위와 시간 범위가 맞습니까?
- 수정 중 기존의 올바른 주장과 인용이 손상됐습니까?
- 정해진 종료 조건을 만족했습니까?

Validator를 통과했다고 세계의 사실이 자동으로 참이 되는 것은 아닙니다. 입력 지식이 오래됐거나 잘못됐다면 형식적으로 정상인 오류가 남을 수 있습니다.

### 5. Judgment Packet: 정답 한 줄보다 조건부 판단

최종 산출물은 다음 묶음에 가깝습니다.

```text
조건부 판단
+ 현재 가장 강한 가설
+ 배제하지 못한 대안
+ 핵심 근거와 반례
+ 현재 미지
+ 다음 검사
+ 가역적인 안전 행동
+ 금지 행동
+ PROCEED | ABSTAIN | ESCALATE
+ citations와 Pack revision
```

이 Judgment Packet 역시 현재 DuckCrab의 공개 응답 계약이 아니라 목표 구조입니다.[src_015](#src-015)[src_016](#src-016)[src_017](#src-017)

## 캐시 장애 하나로 전체 구조를 따라가 봅시다

![배포 뒤 오래된 데이터 노출이라는 관찰을 캐시 무효화 실패와 복제 지연·라우팅 변화라는 두 경쟁 가설로 나누고, 반례·제약·미지와 다음 검사를 거쳐 진행·보류·사람 검토 중 하나로 끝내는 가상 조사](../attachments/ontology-senior-investigation-harness/ontology-senior-investigation-harness-figure-03.png)

질문은 다음과 같습니다.

> 배포 이후 일부 고객에게 오래된 데이터가 보이는 이유는 무엇이며, 지금 가장 안전한 다음 행동은 무엇입니까?

### 1단계. Pack에서 관련 조직 지식을 가져옵니다

과거 캐시 장애, 원인이 달랐던 대조 사례, TTL 결정의 이유, 고객 SLA, 배포와 롤백 기록을 찾습니다. 이때 출처와 적용 기간도 함께 가져옵니다.

### 2단계. 조사 의무를 정합니다

첫 가설인 `캐시 무효화 실패`만 지지하는 자료를 모으지 않습니다. `읽기 복제본 지연 또는 라우팅 변화`를 경쟁 가설로 두고, 두 설명을 구분할 관찰을 반드시 찾도록 계획합니다.

### 3단계. 조사 상태를 갱신합니다

```yaml
observations:
  - 배포 직후 일부 고객 범위에서 오래된 데이터 노출 증가
hypotheses:
  - id: H1
    statement: 캐시 무효화 실패
  - id: H2
    statement: 읽기 복제본 지연 또는 라우팅 변화
constraints:
  - 고객 SLA 때문에 TTL 즉시 하향 불가
unknowns:
  - 캐시를 우회한 읽기에서도 같은 현상이 있는가
next_test:
  - 같은 시간대의 캐시 경로와 직접 읽기 경로 비교
```

직접 읽기에서도 같은 현상이 보이면 H1은 약해집니다. 직접 읽기는 정상이고 무효화 이벤트가 빠졌다면 H1은 강해집니다. 중요한 것은 어느 가설이 처음 그럴듯했는지가 아니라 **새 관찰 때문에 가설이 어떻게 바뀌었는가**입니다.

### 4단계. 검사 가능한 항목을 검증합니다

로그의 시간대, 고객 범위, Pack revision, SLA 정책과 인용을 확인합니다. 다른 사건의 로그를 섞었거나 필요한 읽기 경로 자료가 없다면 검증 기록에 그대로 남깁니다.

### 5단계. 조건부 판단을 전달합니다

현재 근거로는 H1과 H2를 구분할 수 없습니다. 이때 답은 “원인은 H1입니다”가 아닙니다.

> 배포 직후 오래된 데이터가 늘었다는 관찰만으로는 캐시 무효화 실패와 복제본 지연 또는 라우팅 변화를 구분할 수 없습니다. 먼저 같은 시간대의 캐시 경로와 직접 읽기 경로를 비교해야 합니다. 직접 읽기는 정상이고 무효화 이벤트가 빠졌다는 관찰이 확인될 때 H1이 강해집니다. TTL 변경은 고객 SLA와 부하에 영향을 줄 수 있으므로, 원인을 구분하기 전에는 전면 변경을 피하고 제한된 범위의 가역 실험만 검토해야 합니다.

이 답에는 현재 판단뿐 아니라 남은 대안, 빠진 자료, 다음 검사와 안전한 행동이 함께 들어 있습니다.

## LLM, 결정론적 계층과 사람이 맡을 일을 나눕니다

| 주체               | 맡기기 좋은 일                                                | 맡기면 안 되는 권한                       |
| ------------------ | ------------------------------------------------------------- | ----------------------------------------- |
| LLM                | 자연어 질문 해석, 경쟁 가설, 사례 비교, 다음 조사 후보와 설명 | 정본 변경 승인, 권한 우회, 근거 없는 확정 |
| 검색·그래프 계층   | Pack 범위 검색, 관계 경로, 출처와 빠진 지식 영역 표시         | 그래프의 빈칸을 사실로 추정               |
| 결정론적 Validator | 인용, revision, 권한, 수치, 상태 전환과 종료 조건 검사        | 입력 사실이 현실에서 참인지 자동 보증     |
| 사람               | 고위험 판단, 예외 승인, 지식 승격과 책임                      | 모든 저위험 검색을 수작업으로 대체        |

한 계층이 모든 권한을 가져서는 안 됩니다. 검색 결과를 만든 모델이 자기 가설을 조직의 공식 지식으로 확정하거나, 같은 Judge가 평가와 배포까지 맡으면 오류의 원인과 책임을 분리하기 어렵습니다.

## OpenCrab과 DuckCrab은 이 구조에서 어디까지 와 있습니까

OpenCrab은 9-Space, Evidence·Claim, Pack, MCP와 후보·검증·승격이라는 설계 원형을 제공합니다. 다만 공개 구현은 질문별 Semantic Investigation Plan과 검증된 Judgment Packet보다 Pack 생성과 검색 기반에 더 가깝습니다.[src_018](#src-018)

2026년 7월 23일 커밋 `8ae4960` 기준 DuckCrab에서 확인된 현재 기반은 다음과 같습니다.[src_015](#src-015)[src_016](#src-016)[src_017](#src-017)

| 현재 구현된 기반                                  | 아직 제안 단계인 층                                            |
| ------------------------------------------------- | -------------------------------------------------------------- |
| DuckDB 정본 저장과 Chroma 파생 벡터 인덱스        | 질문의 조사 의무를 정하는 Semantic Investigation Plan          |
| query·retrieve 경로가 공유하는 `RetrievalPlanner` | 경쟁 가설과 반례를 누적하는 request-scoped Investigation State |
| 명시적 `retrieval_plan`과 제한된 확장             | 새 외부 신호를 요구하는 counterevidence 재검색 루프            |
| schema planning card와 retrieval receipt          | claim·evidence·revision·종료 조건 Validator                    |
| 읽기 전용 `AgentContextBundle`                    | 조건부 Judgment Packet                                         |
| 후보·검증·사람 검토·승격을 나누는 거버넌스 표면   | 전체 하네스의 통합 실행과 비교 평가                            |

2026년 7월 24일 로컬 집중 실행에서는 DuckCrab 커밋 `8ae4960`을 기준으로 `tests/test_retrieval_planner.py`와 `tests/test_mcp.py` 178개가 통과했습니다. 이 수치는 공개 벤치마크 결과가 아니라 당시 실행 기록입니다. 현재 검색과 MCP 계약의 회귀만 확인하며, 오른쪽의 제안 층은 구현돼 있지 않으므로 시험 대상도 아니었습니다.

DuckCrab은 전체 시니어 조사 하네스가 아니라 **검색과 문맥 조립의 기반**을 갖춘 상태로 보는 편이 정확합니다.

### 현재 기반과 제안 층을 직접 비교해 보기

아래 탐색기에서 전체 구조, 현재 DuckCrab, 제안 층과 가상 캐시 조사를 바꿔 볼 수 있습니다. 표시된 구조는 성능 점수나 구현 완료율이 아닙니다.

<iframe
  class="interactive-visualization-frame"
  src="/attachments/ontology-senior-investigation-harness/senior-investigation-harness-explorer.htm"
  title="현재 DuckCrab 기반과 제안된 시니어 조사 하네스 층을 비교하는 인터랙티브 탐색기"
  loading="lazy"
  scrolling="no"
  sandbox="allow-scripts allow-same-origin"
  style="height:760px"
></iframe>

[탐색기를 새 화면에서 크게 열기](/attachments/ontology-senior-investigation-harness/senior-investigation-harness-explorer.htm)

## 이 구조가 실패하는 방식도 함께 봐야 합니다

Pack은 조직의 지식을 보존하지만, 오래된 임시 결정과 편견까지 더 권위 있게 재사용하게 만들 수 있습니다. 그래서 유효 기간, 출처, 폐기와 재검증 절차가 필요합니다.

반복 조사도 자동 개선 장치가 아닙니다. 같은 모델이 최초 오류를 공유할 수 있고, 검색 결과가 쌓이면 문맥 간섭이 생깁니다. 수정 과정에서 이전의 맞는 내용과 인용이 손상될 수도 있습니다.[src_006](#src-006)[src_012](#src-012)[src_013](#src-013)[src_014](#src-014)

다음 세 상태는 모두 정상 종료입니다.

- `PROCEED`: 필수 근거와 정책 검사가 충족됐고 가역적인 행동이 가능합니다.
- `ABSTAIN`: 필수 근거가 없거나 경쟁 가설을 구분할 자료가 없습니다.
- `ESCALATE`: 위험이 높거나 예외 승인과 책임 있는 사람 판단이 필요합니다.

계속 검색하는 것보다 멈추는 편이 더 정확하고 안전한 경우가 있습니다.

## 효과를 주장하려면 다섯 조건을 분리해 비교해야 합니다

전체 하네스가 실제로 더 나은 판단을 만드는지는 아직 확인되지 않았습니다. 같은 모델, 도구, 자료, 질문과 예산에서 최소한 다음 조건을 비교해야 합니다.

```text
C_single
= 일회 검색 + 일회 답변

C_graph
= Pack·graph context + 일회 답변

C_loop
= 반복 검색 + 가설·반례·종료 계약

C_state
= Expertise Pack + Semantic Plan
  + Investigation State

T_harness
= C_state + Validator
```

측정값도 정답률 하나로 끝나지 않습니다.

- 근거가 있는 핵심 주장 비율
- 중요한 반례 회수율
- 첫 가설 고착률
- 적절한 `ABSTAIN`과 `ESCALATE`
- 인용과 Pack revision 완전성
- 수정 회귀와 기존 주장 손상
- 사람이 수정해야 한 핵심 전제 수
- 지연시간, 토큰, 검색 호출과 검토 비용

Harness-Bench는 같은 모델도 프롬프트, 도구, 상태 관리와 실행 하네스에 따라 다른 결과를 낼 수 있다는 문제를 측정하려는 프리프린트입니다. PlanBench와 다중 턴 수정 연구도 계획 능력과 수정 회귀를 분리해 평가할 필요성을 보여줍니다. 다만 이 연구들은 여기서 제안한 통합 구조가 우월하다는 직접 증거는 아닙니다.[src_005](#src-005)[src_007](#src-007)[src_014](#src-014)

`C_state`와 `T_harness`를 비교하면 Validator를 추가하기 전후의 차이를 볼 수 있습니다. 그래프가 만든 이익, 반복 검색이 만든 이익과 Validator가 막은 오류를 나누지 않으면 어떤 복잡성이 실제로 필요한지 알 수 없습니다.

## 결론: 시니어의 정답이 아니라 조사 방법을 외부화합니다

열두 편은 서로 다른 기술을 소개한 글처럼 보이지만, 한 방향으로 이어집니다.

- 1~4번은 에이전트가 따라야 할 의미와 검증 원칙을 만들었습니다.
- 5~7번은 온톨로지가 필요한 조건과 현실적인 구현 경계를 정했습니다.
- 8~10번은 조직 지식을 Pack으로 묶고 질문별 문맥으로 조립하는 방법을 제안했습니다.
- 11~12번은 그 문맥으로 계획을 만들고, 반례와 새 관찰로 첫 판단을 수정하는 과정을 정의했습니다.

이 네 흐름을 합치면 결론은 다음과 같습니다.

> **온톨로지 에이전트가 검색기에서 조사 하네스로 발전하려면, 조직의 사실과 판단 근거를 지속 지식으로 보존하고, 질문마다 가설·반례·미지와 다음 검사를 별도 상태로 관리하며, LLM의 제안과 기계의 검사, 사람의 승인 권한을 분리해야 합니다.**

온톨로지로 시니어 엔지니어의 머릿속을 복제할 수는 없습니다. 다만 시니어가 결론을 내리기 전에 확인하는 관찰, 경쟁 가설, 반례, 과거 결정, 제약, 미지와 다음 실험을 밖으로 꺼내 여러 사람이 검토하고 다시 사용할 수는 있습니다.

이것이 앞선 열두 편을 종합했을 때 남는 13번 글의 결론입니다.

## 조사·검증 상태

- 기준일: 2026-07-24
- 연구 모드: direct research
- 출처: 표준·동료심사 논문·프리프린트·프로젝트 코드와 정본 문서 18건
- 핵심 주장: 8개 주장에 대한 출처 삼각측량과 evidence audit 수행
- DuckCrab 실행 확인: 커밋 `8ae4960`, 2026년 7월 24일 로컬 집중 테스트 178개 통과
- 반증 검토: 통합 우월성 주장과 현재 구현·제안 구조 혼합을 수정했으나 독립 리뷰어는 확보하지 못함

## 함께 읽기

- [[notes/ontology-agent-guide|1. 온톨로지 에이전트: 의미를 아는 AI를 만드는 방법]]
- [[notes/ontology-agent-behavior-experiment|5. 온톨로지 에이전트는 정말 필요한가]]
- [[notes/opencrab-ontology-build-architecture|8. OpenCrab 온톨로지 빌드는 무엇을 만드는가]]
- [[notes/ontology-expertise-pack|10. 온톨로지로 시니어 엔지니어의 사고를 외부화할 수 있을까]]
- [[notes/kg-guided-llm-planning|11. 지식그래프는 LLM의 계획을 어떻게 돕는가]]
- [[notes/iterative-investigation-refutation-loop|12. 한 번 검색하고 답하지 않는 에이전트]]

## 출처

- <a id="src-001"></a> **src_001** — Thomas R. Gruber. (1993). _A Translation Approach to Portable Ontology Specifications_. [원문](https://doi.org/10.1006/knac.1993.1008)
- <a id="src-002"></a> **src_002** — W3C OWL Working Group. (2012). _OWL 2 Web Ontology Language Document Overview (Second Edition)_. [원문](https://www.w3.org/TR/owl2-overview/)
- <a id="src-003"></a> **src_003** — Jin Sun et al. (2024). _Think-on-Graph: Deep and Responsible Reasoning of Large Language Model on Knowledge Graph_. ICLR 2024. [원문](https://openreview.net/forum?id=nnVO1PvbTv)
- <a id="src-004"></a> **src_004** — Jinhao Jiang et al. (2025). _KG-Agent: An Efficient Autonomous Agent Framework for Complex Reasoning over Knowledge Graph_. ACL 2025. [원문](https://aclanthology.org/2025.acl-long.468/)
- <a id="src-005"></a> **src_005** — Yao Yao et al. (2026). _Harness-Bench: Measuring Harness Effects across Models in Realistic Agent Workflows_. arXiv preprint. [원문](https://arxiv.org/abs/2605.27922)
- <a id="src-006"></a> **src_006** — Dingyi Zhou et al. (2026). _What Breaks Knowledge Graph based RAG? Benchmarking and Empirical Insights into Reasoning under Incomplete Knowledge_. EACL 2026. [원문](https://aclanthology.org/2026.eacl-long.114/)
- <a id="src-007"></a> **src_007** — Karthik Valmeekam et al. (2023). _PlanBench: An Extensible Benchmark for Evaluating Large Language Models on Planning and Reasoning about Change_. NeurIPS 2023. [원문](https://arxiv.org/abs/2206.10498)
- <a id="src-008"></a> **src_008** — Bo Liu et al. (2023). _LLM+P: Empowering Large Language Models with Optimal Planning Proficiency_. [원문](https://arxiv.org/abs/2304.11477)
- <a id="src-009"></a> **src_009** — Yilun Hao et al. (2025). _Large Language Models Can Solve Real-World Planning Rigorously with Formal Verification Tools_. NAACL 2025. [원문](https://aclanthology.org/2025.naacl-long.176/)
- <a id="src-010"></a> **src_010** — Shunyu Yao et al. (2023). _ReAct: Synergizing Reasoning and Acting in Language Models_. ICLR 2023. [원문](https://arxiv.org/abs/2210.03629)
- <a id="src-011"></a> **src_011** — Zhibin Gou et al. (2024). _CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing_. ICLR 2024. [원문](https://proceedings.iclr.cc/paper_files/paper/2024/hash/fef126561bbf9d4467dbb8d27334b8fe-Abstract-Conference.html)
- <a id="src-012"></a> **src_012** — Jie Huang et al. (2024). _Large Language Models Cannot Self-Correct Reasoning Yet_. ICLR 2024. [원문](https://proceedings.iclr.cc/paper_files/paper/2024/hash/8b4add8b0aa8749d80a34ca5d941c355-Abstract-Conference.html)
- <a id="src-013"></a> **src_013** — Ryo Kamoi et al. (2024). _When Can LLMs Actually Correct Their Own Mistakes? A Critical Survey of Self-Correction of LLMs_. TACL 2024. [원문](https://aclanthology.org/2024.tacl-1.78/)
- <a id="src-014"></a> **src_014** — Boya Chen et al. (2026). _Beyond Single-shot Writing: Deep Research Agents are Unreliable at Multi-turn Report Revision_. ACL 2026. [원문](https://aclanthology.org/2026.acl-long.609/)
- <a id="src-015"></a> **src_015** — DuckCrab project. (2026). _DuckCrab Current State at 8ae4960_. [원문](https://github.com/tteggu87/duckcrab/blob/8ae49609813b915a239e352e374ebc5fd3544628/docs/CURRENT_STATE.md)
- <a id="src-016"></a> **src_016** — DuckCrab project. (2026). _DuckCrab Agent Context Pipeline at 8ae4960_. [원문](https://github.com/tteggu87/duckcrab/blob/8ae49609813b915a239e352e374ebc5fd3544628/duckcrab/ontology/context_pipeline.py)
- <a id="src-017"></a> **src_017** — DuckCrab project. (2026). _DuckCrab Retrieval Planner at 8ae4960_. [원문](https://github.com/tteggu87/duckcrab/blob/8ae49609813b915a239e352e374ebc5fd3544628/duckcrab/ontology/retrieval_planner.py)
- <a id="src-018"></a> **src_018** — OpenCrab project. (2026). _OpenCrab public integration repository at analyzed commit_. [원문](https://github.com/AlexAI-MCP/OpenCrab/tree/d34352cec9d99c755c1e891f811911461a460280)

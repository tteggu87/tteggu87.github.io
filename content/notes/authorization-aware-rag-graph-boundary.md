---
title: "17. 관련도는 권한이 아니다: 멀티테넌트 RAG와 GraphRAG의 문맥 누출을 막는 법"
description: "검색 결과가 질문에 잘 맞는다는 사실은 공개 권한을 뜻하지 않습니다. 인증·위임·문서·그래프 경로·파생 지식·MCP 도구까지 권한을 다시 증명하는 방법을 설명합니다."
date: 2026-07-29
tags:
  - RAG
  - GraphRAG
  - 권한관리
  - 멀티테넌트
  - MCP
  - AI보안
---

![인증된 사용자부터 검색·그래프 확장·파생 지식·도구 실행까지 권한을 단계별로 다시 증명하는 전체 수명주기](../attachments/authorization-aware-rag-graph-boundary/authorization-aware-rag-graph-boundary-infographic.png)

> [!summary] 핵심 결론
> 검색 결과가 질문에 잘 맞아도 그 자료를 보여 줘도 된다는 뜻은 아닙니다. 여러 고객이 같은 시스템을 사용하는 멀티테넌트 RAG와 GraphRAG에서는 **연결 자격증명, 작업 위임, 문서와 그래프 경로, 새로 만든 요약과 답변, 출처 열기, 도구 행동의 현재 권한**을 단계마다 확인해야 합니다. 이 글의 A~J와 파생 산출물 비교는 설계에서 빠진 검사를 찾기 위한 작은 모의실험입니다. 실제 시스템의 누출률이나 특정 방어 방식의 우월성을 입증한 벤치마크는 아닙니다.

먼저 용어부터 간단히 정리하겠습니다. **RAG**는 질문과 관련된 문서를 검색해 그 내용을 바탕으로 답하는 방식입니다. **GraphRAG**는 문서 검색에 더해 사람·제품·사건처럼 서로 연결된 항목을 그래프로 따라가며 근거를 넓힙니다. **멀티테넌트**는 여러 고객이나 조직이 하나의 시스템을 함께 쓰되, 각자의 데이터는 서로 볼 수 없도록 분리하는 구조입니다.

한 회사가 여러 고객사의 규정 문서를 하나의 검색 시스템에 연결했다고 가정해 보겠습니다. 고객사 A의 사용자가 질문했고, 벡터 검색은 A가 볼 수 있는 문서를 정확히 찾았습니다. 그 문서에는 여러 회사가 함께 쓰는 제품명이 들어 있었습니다.

GraphRAG가 그 제품 항목을 따라 두 단계 더 찾아가자 고객사 B의 내부 사고 보고서가 연결됐습니다. 최종 답변은 두 문서를 섞어 그럴듯한 요약을 만들었습니다. 첫 검색은 올바른 문서에서 시작했고 답도 질문과 관련이 높았습니다. 그러나 **그래프를 따라간 경로와 두 문서를 합쳐 만든 결과의 권한을 다시 확인하지 않아 데이터 유출**이 됐습니다.

[[notes/context-compilation-regression|16번 글]]은 정본 지식에서 질문별 Context Bundle을 만들 때 조건·반례·버전이 사라지는 문제를 다뤘습니다. 이번 글은 그보다 먼저 확인해야 할 질문을 붙입니다.

> **정확하게 골라낸 이 근거를, 지금 이 사용자와 이 작업을 수행하는 에이전트가 볼 권한이 있는가?**

## 관련도·권한·신뢰·생성은 서로 다른 축입니다

검색 시스템은 보통 후보 자료가 질문과 얼마나 가까운지 계산합니다. 권한 시스템은 누가 어떤 자료에 어떤 행동을 할 수 있는지 판단합니다. 지식 검증은 자료의 출처와 신뢰 수준을 확인합니다. 생성 검증은 모델이 허용되고 믿을 수 있는 근거를 실제 답에 충실하게 사용했는지 확인합니다.

```text
관련도가 높음 ≠ 공개 권한이 있음
공개 권한이 있음 ≠ 내용이 신뢰할 만함
신뢰할 만함 ≠ 현재 사용자에게 공개 가능함
허용된 문맥이 있음 ≠ 답변이 그 문맥에 충실함
```

이 구분은 두 개의 최근 연구 번들을 함께 볼 때 더 선명해집니다. 권한 인식 RAG 연구는 `relevant ≠ authorized`, 즉 “관련 있음과 공개 허용은 다르다”는 문제를 다룹니다. 지속 메모리 오염 연구는 `stored ≠ trusted`, 즉 “저장됐다고 믿을 수 있는 것은 아니다”라는 문제를 다룹니다. 허용된 문서라도 공격자에게 오염됐을 수 있고, 검증된 문서라도 다른 조직의 사용자에게는 공개할 수 없습니다.[src_009](#src-009) [src_013](#src-013) [src_014](#src-014)

따라서 모든 문제를 하나의 점수로 뭉치기보다, 어느 단계에서 실패했는지 나눠서 봐야 합니다.

| 게이트                     | 묻는 질문                                                | 실패 예시                                             |
| -------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| 신원 확인(Identity)        | 요청자는 누구입니까                                      | client가 보낸 email·tenant 문자열을 그대로 신뢰       |
| 작업 위임(Delegation)      | 이 에이전트가 이 작업에서 사용자를 대신할 수 있습니까    | 다른 작업에 준 권한을 재사용                          |
| 권한 확인(Authorization)   | 이 자원·경로·행동을 지금 허용합니까                      | 허용된 시작점에서 금지된 graph 이웃으로 확장          |
| 신뢰 확인(Trust)           | 자료의 출처·권위·revision을 믿을 수 있습니까             | 허용된 문서가 오염된 지시를 포함                      |
| 관련도 확인(Relevance)     | 허용되고 신뢰할 수 있는 후보 중 무엇이 질문에 유용합니까 | 상위 검색 결과를 모두 공개 가능한 목록으로 오인       |
| 답변 생성 확인(Generation) | 모델이 허용된 근거를 충실하게 사용했습니까               | 금지된 이전 상태나 모델이 외운 내용을 답에 섞음       |

## 권한을 계산하기 전에 자원을 먼저 식별하고 분류합니다

권한 엔진은 정책에서 이름을 붙여 관리할 수 있는 대상만 판정할 수 있습니다. 원문 문서에 보안 등급이 붙어 있어도, 그 문서에서 잘라 만든 조각이나 검색용 기록, 그래프 연결, 요약, 출처 묶음, 도구 설명에는 같은 등급이 전달되지 않을 수 있습니다. NIST의 2026년 데이터 분류 초안은 비정형 데이터를 발견하고 식별하며 지속 가능한 레이블을 부여하는 일을 Zero Trust 데이터 보호의 준비 단계로 둡니다.[src_029](#src-029)

여기서 자주 쓰는 기술 용어는 다음처럼 이해할 수 있습니다.

- **chunk**: 긴 문서를 검색하기 좋게 나눈 작은 조각
- **embedding record**: 문장의 의미를 숫자 좌표로 바꿔 저장한 검색 기록
- **node·edge·evidence**: 그래프의 항목, 항목 사이의 연결선, 그 연결을 뒷받침하는 근거
- **context item**: 모델에게 이번 질문의 참고자료로 전달한 한 단위
- **derived artifact**: 여러 근거를 합쳐 새로 만든 요약·주장·답변 같은 산출물
- **schema**: 도구가 어떤 입력을 받고 어떤 결과를 내는지 적은 사용 설명서

이 원칙을 RAG에 적용하면 최소한 다음 대상을 별도 자원으로 식별해야 합니다.

- 원문 문서와 첨부파일
- chunk·embedding record와 graph node·edge·evidence
- Context item, tool output과 conversation state
- derived edge·summary·Claim·citation bundle·최종 답변
- tool catalog entry·schema·resource와 action

```text
unclassified ≠ public
분류 레이블 없음 → 격리(quarantine) 또는 거부(deny)
```

이 기본값은 NIST가 직접 제시한 RAG 표준이 아니라 데이터 분류 원칙을 프로젝트 권한 계약에 적용한 제안입니다. 핵심은 수집(ingest)이나 검색 구조로 변환하는 과정(projection)에서 레이블이 빠진 자료를 자동으로 공개하지 않는 것입니다. 레이블이 있더라도 원본·색인(index)·문서 조각(chunk)·임시 저장소(cache)의 버전이 맞는지, 실제 API가 그 레이블을 권한 판정에 쓰는지도 따로 확인해야 합니다.[src_033](#src-033)

## 유효한 OAuth 연결 하나로는 부족합니다

MCP Authorization 명세는 HTTP MCP 서버를 OAuth로 보호하는 자원으로 다루며, 자격증명이 어느 서버를 대상으로 발급됐는지 묶는 방법을 설명합니다. 또한 MCP client에서 받은 자격증명을 downstream API에 그대로 전달하는 token passthrough를 금지합니다.[src_017](#src-017) RFC 9728은 보호 자원 정보와 authorization server를 찾는 방법을 표준화합니다.[src_021](#src-021)

하지만 연결이 성공했다는 사실만으로 문서를 읽거나 도구를 실행할 권한까지 증명되지는 않습니다. 하나의 에이전트 요청에는 최소한 세 종류의 증명이 필요합니다.

1. **연결 증명(Transport proof):** 이 자격증명은 현재 MCP 서버를 대상으로 발급됐습니까?
2. **작업 위임 증명(Delegation proof):** 이 에이전트가 이 작업과 대화에서 사용자를 대신하도록 명시적으로 연결됐습니까?
3. **자원·행동 증명(Resource/action proof):** 이 작업과 에이전트가 이 문서, 그래프 이동, 도구 자원과 행동을 지금 사용할 수 있습니까?

```text
OAuth 연결 성공
→ 자격증명의 대상 서버 확인
→ 작업과 에이전트의 연결 확인
→ 문서·경로·도구 행동별 현재 권한 확인
```

OpenFGA의 task 기반 패턴은 사용자의 권한과 현재 task에 준 제한된 권한을 별도로 검사합니다. task에는 필요한 tool과 특정 resource만 연결하고 만료 시간, session, 호출 범위와 agent binding을 둘 수 있습니다.[src_019](#src-019) 이 경계가 없으면 사용자가 문서를 읽을 수 있다는 이유만으로 에이전트가 그 문서를 외부에 공유하거나 삭제할 권한까지 얻을 수 있습니다.

![OAuth 연결, task 위임, resource와 action 권한을 서로 대체할 수 없는 세 가지 증명으로 분리한 도해](../attachments/authorization-aware-rag-graph-boundary/authorization-aware-rag-graph-boundary-figure-01.png)

### 도구 검색도 권한이 필요한 retrieval입니다

MCP의 최신 client guidance는 많은 도구를 한꺼번에 모델에 넣는 대신 `catalog → inspect → execute` 순서로 필요한 도구만 점진적으로 찾는 패턴을 설명합니다. **catalog**는 도구 이름과 짧은 설명을 찾는 단계, **inspect**는 선택한 도구의 자세한 사용법과 입력 형식을 읽는 단계, **execute**는 실제로 실행하는 단계입니다. access-control filtering도 custom discovery가 필요한 사례로 명시합니다.[src_030](#src-030)

따라서 관련도 높은 도구를 찾았다는 사실과 현재 작업에서 사용할 수 있다는 사실을 분리해야 합니다.

```text
catalog 노출 허가
≠ schema 열람 허가
≠ execute 허가
≠ tool 내부 resource·action 허가
```

생성된 script나 workflow를 승인했다고 내부의 모든 runtime tool call이 한꺼번에 승인되는 것도 아닙니다. host broker, 즉 도구 호출을 중간에서 받아 실제 서버로 전달하는 관리자는 각 호출과 대상 자원, 서버 사이 데이터 이동을 현재 권한에 대조해야 합니다. 처음부터 넓은 권한을 주기보다 검색·읽기 같은 기본 권한에서 시작하고, 쓰기·공유·삭제·외부 전송이 필요한 순간에만 정확한 자원과 행동에 대해 짧게 권한을 높이는 편이 감사와 회수에 유리합니다.[src_030](#src-030) [src_031](#src-031)

## 권한은 검색 입구에서 한 번만 검사하는 속성이 아닙니다

권한 검사는 RAG 수명주기의 여러 지점에서 반복됩니다.

### 문서와 ACL revision을 함께 추적합니다

**ACL**은 누가 어떤 자료를 읽거나 수정할 수 있는지 적은 접근 권한 목록입니다. 문서는 최신인데 ACL이 오래됐거나, ACL은 최신인데 chunk·embedding·graph projection이 이전 문서를 가리킬 수 있습니다. `content_revision`과 `permission_revision`을 따로 기록하면 권한을 회수한 뒤에도 오래된 문서 조각이 남아 있는지 찾기 쉬워집니다.

Azure AI Search와 Amazon Bedrock의 공식 문서는 사용자나 서비스 같은 권한 주체(principal)를 기준으로 결과를 거르는 방식과, 검색 시점(query-time)에 권한을 확인하는 방식을 설명합니다.[src_004](#src-004) [src_005](#src-005) [src_006](#src-006) [src_007](#src-007) 다만 제품 문서는 구현 방법을 보여 주는 1차 자료입니다. 특정 배포가 실제로 안전하다는 독립 보안 평가까지 대신하지는 않습니다.

### pre-filter와 post-filter는 조건에 따라 선택합니다

OpenFGA는 검색 전에 허용 문서 ID를 구해 후보를 제한하는 **pre-filter(사전 필터)**와, 더 넓게 검색한 뒤 권한이 없는 결과를 제거하는 **post-filter(사후 필터)**를 설명합니다.[src_002](#src-002)

- **pre-filter**는 허용된 자료 안에서 상위 `k`개 결과를 고르기 쉽습니다. 다만 허용 목록이 매우 크거나 정책이 복잡하면 계산 비용이 커질 수 있습니다.
- **post-filter**는 구현이 단순할 수 있지만, 검색 뒤 많은 결과가 제거되어 답할 근거가 부족해질 수 있습니다. 권한 검사 전에 후보 ID와 점수가 로그나 cache에 남지 않도록 해야 합니다.

어느 쪽이 언제나 더 안전하거나 빠른 것은 아닙니다. 허용하면 안 되는 자료를 통과시킨 비율(false allow), 허용해야 할 자료를 막은 비율(false deny), 허용 자료를 얼마나 잘 찾아냈는지(authorized recall), 요청의 95%가 끝나는 시간(p95 지연), 정책 계산 비용을 따로 측정해야 합니다.

### 권한 판정이 불가능하면 부분 결과를 반환하지 않습니다

권한 인식 검색에서는 다음 세 상태를 구분해야 합니다.

```text
authorized_empty          → 권한 판정은 성공했지만 허용 결과가 없음
insufficient_evidence     → 허용 결과는 있으나 답변 근거가 부족함
authorization_unavailable → 정책·그룹·권한 버전을 확인하지 못함
```

마지막 상태에서 남아 있는 후보를 반환하면 **fail-open**, 즉 권한 확인에 실패했는데도 자료를 보여 주는 동작이 됩니다. Azure AI Search의 query-time ACL preview는 권한 평가에 필요한 서비스가 실패할 때 부분 결과 대신 오류를 반환하는 **fail-closed**, 즉 안전한 쪽으로 닫는 동작을 문서화합니다.[src_032](#src-032) 이는 모든 제품의 표준이 아니라, 권한 장애와 “검색 결과 없음”을 같은 빈 결과로 숨기지 말아야 한다는 운영 사례입니다.

전체 index를 조사해야 하는 비상 운영 경로도 평상시 계정의 권한을 넓히는 방식으로 만들지 않습니다. 별도 역할, 사용 목적, 짧은 만료 시간, 좁은 범위와 감사 기록을 가진 **break-glass 경로**, 즉 긴급 상황에서만 여는 비상 통로로 분리합니다. 이 권한으로 읽은 자료를 답변·내보내기·다른 도구로 전달할 때는 다시 승인해야 합니다.[src_032](#src-032) [src_033](#src-033)

### graph expansion은 hop마다 다시 검사합니다

그래프에서 **node**는 사람·제품·문서 같은 항목, **edge**는 두 항목의 관계, **hop**은 연결선 하나를 따라 한 단계 이동하는 것을 뜻합니다. 허용된 chunk가 공유 entity와 연결됐다고 해서 그 entity의 모든 이웃을 볼 수 있는 것은 아닙니다. vector-to-graph 전환을 공격 표면으로 다룬 연구와 공개 재현 저장소는 확장 경계에 별도 권한 검사가 필요하다는 설계 근거를 제공합니다.[src_008](#src-008) [src_009](#src-009)

이 결과는 한 연구의 합성 데이터와 Enron 이메일 설정에 제한됩니다. 모든 GraphRAG에 그대로 일반화할 수 있는 독립 재현 결과는 아닙니다. 그래도 문서 조각과 그래프 이웃을 함께 쓰는 시스템에서는 다음 질문을 피할 수 없습니다.

```text
허용된 시작점(seed)인가?
→ 이 항목(node)을 볼 수 있는가?
→ 이 연결(edge)을 따라갈 수 있는가?
→ 이 경로(path)의 모든 근거(evidence)를 사용할 수 있는가?
→ 이 경로에서 만든 주장(Claim)을 공개할 수 있는가?
```

## 허용된 문서들의 조합도 새 보호 자원입니다

문서 ACL을 모두 검사해도 문제가 끝나지 않습니다. GraphRAG와 에이전트는 여러 근거를 합쳐 새로운 자료를 만듭니다.

- 원문에는 없던 새 연결(derived edge)
- 여러 문서를 짧게 줄인 요약(summary)
- 그래프 경로에서 만든 주장(Claim)
- 답변과 출처를 한데 묶은 citation bundle
- 최종 답변과 후속 파일

W3C PROV-O는 산출물이 어떤 원자료에서 파생됐는지 표현할 수 있지만, 부모 자료의 권한을 파생물에 어떻게 이어 붙일지는 정하지 않습니다.[src_022](#src-022) OpenFGA Conditions·Contextual Tuples와 SpiceDB Caveats는 시간·활성 조직·요청 정보처럼 상황에 따라 달라지는 조건과, 정보가 부족해 판단을 끝내지 못한 상태를 표현할 수 있습니다.[src_023](#src-023) [src_024](#src-024) [src_025](#src-025)

이 프로젝트에서는 이를 **파생 산출물 권한 폐쇄(Derived Artifact Authorization Closure)**라는 조건부 설계 제안으로 정리했습니다. 쉽게 말해, 새로 만든 결과가 원자료의 권한 경계를 빠져나가지 못하도록 출처와 현재 권한을 끝까지 따라가는 규칙입니다.

```text
파생 산출물 허용
= 모든 근거 원자료에 대한 현재 권한
  또는
  검토·비식별화·공개 대상·만료가 명시된 별도 공개 승인
```

기본 원칙은 다음과 같습니다.

1. 산출물에 사용한 모든 근거·node·edge·tool output과 변환 과정을 provenance, 즉 출처 이력으로 연결합니다.
2. 명시적 공개 절차가 없다면 현재 권한 주체(principal)가 모든 근거 원자료를 같은 정책 버전에서 사용할 수 있어야 합니다.
3. 출처 이력이 빠졌거나 필요한 조건 정보가 없거나 권한 버전이 오래됐다면 허용으로 처리하지 않습니다.
4. 원자료보다 넓게 공개하려면 검토된 비식별화·집계와 만료를 포함한 별도 공개 승인(declassification)이 필요합니다.
5. 원자료의 권한이 회수되면 derived edge·summary·cache·answer artifact도 무효화하거나 다시 검사합니다.
6. 답변 표시, 출처 노출, 원문 열기와 외부 공유는 서로 다른 행동으로 판단합니다.

> [!important] 교집합은 안전한 기본값이지 보편적 정답은 아닙니다
> 모든 원자료의 권한을 단순히 겹치는 방식은 공개가 승인된 통계나 개인을 알아볼 수 없게 만든 집계 결과까지 지나치게 막을 수 있습니다. 더 넓은 공개가 필요하다면 ACL을 느슨하게 바꾸기보다, 검토된 별도 공개 절차를 계약으로 두는 편이 안전합니다.

![문서와 그래프 경로에서 만들어진 Claim·요약·답변을 별도 자원으로 등록하고 provenance·freshness·declassification을 검사하는 흐름](../attachments/authorization-aware-rag-graph-boundary/authorization-aware-rag-graph-boundary-figure-02.png)

## 같은 제품도 호출 표면마다 안전 기본값이 다를 수 있습니다

같은 제품이라도 어떤 API와 기능을 사용하느냐에 따라 권한 동작이 달라질 수 있습니다. 따라서 권한 기능을 제품 단위의 `지원/미지원` 체크박스로만 관리하면 실제 호출 경로의 차이를 놓칩니다. 공식 문서를 비교하면 같은 Azure AI Search 안에서도 일반 Search POST와 knowledge-base retrieve의 사용자 신원 누락 기본값이 다를 수 있습니다. 최근 Search POST preview는 보호 문서를 제외하는 경로를 설명하지만, knowledge-base retrieve는 identity token이나 permission metadata가 빠지면 결과가 필터링되지 않을 수 있다고 명시합니다.[src_032](#src-032) [src_037](#src-037)

| 호출 표면                     | 확인할 현재 권한                                                             | 놓치기 쉬운 기본값·추가 행동                                                                |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Azure Search POST             | 최종 사용자 신원, index 권한 정보, API 버전                                  | 신원 누락 시 공개 문서만 반환하는지 오류인지 버전별 확인; 비상 읽기는 별도 역할·header       |
| Azure knowledge-base retrieve | 서비스 자격증명과 최종 사용자 신원을 분리, source별 권한 정보 수집            | 신원·권한 정보 누락 시 필터링되지 않을 수 있음; 여러 source의 부분 성공 정책 필요            |
| MCP endpoint                  | server 인증, 최종 사용자 신원 전달, catalog·inspect·execute 권한             | 서비스 인증 성공을 문서 권한 성공으로 간주하지 않음                                         |
| Bedrock retrieve              | upstream에서 검증한 사용자 정보, connector ACL                               | ACL 평가 오류 시 영향을 받은 문서 제외 여부 확인                                             |
| Bedrock source open           | 검색 권한과 원문 열기 권한을 별도 검사                                       | citation 허용이 다운로드 허용은 아님; 짧은 수명의 URL을 행동 직전에 발급                     |

Azure knowledge-base retrieve가 여러 source를 함께 조회할 때 일부 source만 성공할 수도 있습니다. 권한 판단이나 반례 확인에 꼭 필요한 source가 실패했는데 나머지 결과만으로 답하면, 불완전한 답이 안전한 답처럼 보일 수 있습니다. source별로 `required_for_answer`(답변에 필수), `required_for_authorization`(권한 판단에 필수), `required_for_counterevidence`(반례 확인에 필수)를 구분하고 필수 source가 빠지면 답변을 보류합니다.[src_037](#src-037)

Amazon Bedrock의 원문 열기 API는 검색과 별도의 권한을 요구하고 ACL을 다시 검사한 뒤 짧은 수명의 URL을 발급합니다.[src_038](#src-038) [src_039](#src-039) 이 제품 동작을 모든 시스템의 표준으로 볼 수는 없지만, citation을 답변에 표시하는 권한과 원문 파일 전체를 여는 권한을 분리해야 한다는 경계를 구체적으로 보여 줍니다.

## 다중 턴 상태와 도구도 권한을 다시 증명합니다

첫 질문에서 허용된 문맥이 다음 질문에도 자동으로 허용되는 것은 아닙니다. 다음 상태는 조직(tenant), 사용자나 서비스 같은 권한 주체(principal), 현재 작업(task), 위임 정보(delegation), 만료 시각(expiry)과 함께 묶어야 합니다.

- 대화 요약과 검색된 문서 ID
- context cache와 tool output
- 생성된 파일과 임시 credential
- agent memory와 다른 에이전트로 넘기는 handoff

새 사용자나 새 task에 이전 상태를 재사용할 때는 권한을 다시 확인합니다. 권한 문제와 메모리 신뢰 문제도 구분합니다. 같은 조직이 만든 허용된 summary라도 외부의 악성 지시가 지속 메모리로 올라갔다면 권한 검사는 통과해도 신뢰 검사에서 격리해야 합니다.[src_013](#src-013) [src_014](#src-014)

MCP 도구는 목록을 보여 주는 시점과 실제 실행 시점이 서로 다른 권한 검사 지점입니다. 연결할 때 호출 가능한 tool만 노출하고, 실제 `tool/call`에서는 현재 grant와 tool 내부 resource·action을 다시 검사합니다.[src_018](#src-018) [src_020](#src-020)

```text
tools/list 노출 검사
→ tool/call 현재 권한 검사
→ tool 내부 read·write·share·delete 검사
→ downstream credential 분리
```

목록 필터만 적용하면 권한을 회수한 뒤에도 이미 보인 tool을 호출할 수 있습니다. 실행 검사만 적용하면 호출할 수 없는 민감한 tool 이름과 schema를 불필요하게 노출할 수 있습니다.

## 본문을 숨겨도 존재·개수·분류가 샐 수 있습니다

내부 시스템은 “허용 결과 없음”, “권한 거부”, “권한 시스템 장애”, “오래된 권한 버전”을 정확히 구분해야 합니다. 그러나 그 이유와 거부된 문서 ID, 개수(count), 분류별 집계(facet), 자동 제안(suggestion)을 호출자에게 그대로 반환하면 보호 자료가 존재한다는 사실을 추측할 수 있습니다. RFC 9110은 금지된 resource의 존재를 숨기려는 서버가 403 대신 404를 사용할 수 있음을 설명하고, OWASP BOLA 지침은 object를 사용하는 모든 endpoint에서 object-level authorization을 검사하도록 요구합니다.[src_034](#src-034) [src_036](#src-036)

호출자에게 보여 줄 내용은 권한 필터를 통과한 결과에서만 계산합니다.

```text
허용된 결과 표면(Authorized Result Surface)
= 허용된 문서·문서 조각·식별자
+ 허용된 개수·분류별 집계·자동 제안
+ 허용된 출처 표시·원문 링크
+ 호출자에게 공개해도 안전한 오류 설명
```

Azure의 facet 문서는 count와 bucket이 query result set에서 만들어진다고 설명합니다.[src_035](#src-035) 문서 본문만 제거하고 전체 자료의 count·facet·suggestion을 남기면, 내용 없이도 기밀 프로젝트의 존재와 분류를 드러낼 수 있습니다. 자세한 내부 실패 이유는 권한이 있는 운영자만 보는 기록에 보존하고, 외부에 보내는 상태 코드·본문·메타데이터·cache 분류는 사용자와 공개 정책에 맞게 단순화합니다.

## AuthorizationReceipt는 허가를 재현하는 작업 일지입니다

최종 답변만 저장하면 어떤 사용자나 서비스, 정책 버전, 그래프 경로와 도구 행동이 허용됐는지 나중에 재현하기 어렵습니다. `AuthorizationReceipt`는 권한 판정 과정을 다시 확인하기 위해 다음과 같은 최소 정보를 남기는 프로젝트 제안입니다.

```yaml
authorization_receipt:
  query_hash: sha256:...
  principal_id_hash: sha256:...
  agent_principal: agent_support_7
  task_id: task_20260729_17
  delegation_id: delegation_42
  policy_revision: policy_108
  provider_api_version: 2026-05-01-preview
  sdk_version: pinned-version
  resource_audience: mcp://knowledge-service
  candidate_resource_ids: [res_1, res_2]
  graph_hop_decisions: [allow, deny]
  derived_artifact_decisions: [conditional]
  state_ids: [state_8]
  source_open_checks: [allow]
  tool_list_checks: [allow]
  tool_call_checks: [deny]
  internal_decision: authorization_unavailable
  external_disclosure_class: service_unavailable
  metadata_suppressed: [count, facet, source_id]
  response_shape_hash: sha256:...
  denial_reasons: [stale_permission_revision]
  expires_at: 2026-07-29T08:00:00+09:00
```

Receipt가 있다고 권한 판단이 자동으로 옳아지는 것은 아닙니다. 잘못된 policy를 꼼꼼히 기록할 수도 있습니다. 또한 거부된 자원과 그래프 경로를 그대로 남기면 receipt 자체가 민감정보가 됩니다. 실제 이름을 드러내지 않는 ID, hash, 짧은 보존기간과 receipt 전용 접근통제가 필요합니다.

## A~J 계약 스모크는 무엇을 확인했습니까

여기서 **계약 스모크 검사**는 실제 공격을 재현하는 대규모 보안 시험이 아니라, 설계에 적어 둔 필수 검사가 빠짐없이 작동하는지 빠르게 확인하는 작은 모의실험입니다. 실제 tenant 데이터와 credential을 사용하지 않고, 열 가지 실패 종류를 점진적인 방어 조건에 배치한 결정론적 스크립트를 실행했습니다.

| 조건 | 추가한 경계                                                | 스크립트가 정의한 미보호 실패 클래스 |
| ---- | ---------------------------------------------------------- | -----------------------------------: |
| A    | namespace만 분리                                           |                                   10 |
| B    | document metadata filter                                   |                                    9 |
| C    | post-filter authorization                                  |                                    8 |
| D    | pre-filter authorization                                   |                                    8 |
| E    | graph-hop authorization                                    |                                    7 |
| F    | multi-turn state isolation                                 |                                    6 |
| G    | source·tool 재권한 검사                                    |                                    5 |
| H    | revocation replay·receipt                                  |                                    4 |
| I    | model·permission revision freshness                        |                                    3 |
| J    | MCP audience·task binding·catalog/inspect·per-call step-up |                                    0 |

J에서 0이 된 이유는 J가 이 스크립트에 정의한 필드를 모두 구현했기 때문입니다. 최신 통합 계약에서 J는 자격증명의 대상 서버, 작업과 에이전트의 연결, 권한에 따라 거른 catalog·inspect, 호출마다 수행하는 broker 검사, 필요한 순간에만 권한을 높이는 방식, 권한이 바뀌었을 때 cache를 무효화하는 절차까지 포함합니다. 이 결과는 **하나의 ACL filter만으로는 서로 다른 실패 종류를 모두 막을 수 없음을 계약 수준에서 확인했다**는 뜻입니다. 실제 공격을 막았다는 성능 증명은 아닙니다.

파생 산출물을 다룬 작은 검사도 네 정책을 비교했습니다.

| 정책                                             | 무단 노출 | 잘못된 거부 |
| ------------------------------------------------ | --------: | ----------: |
| 시작점(seed)의 권한만 상속                       |         5 |           1 |
| 원자료 하나라도 허용되면 공개                    |         8 |           0 |
| 모든 원자료 권한의 교집합                        |         1 |           2 |
| provenance + freshness + 검토된 declassification |         0 |           0 |

마지막 정책의 0/0도 벤치마크 성과는 아닙니다. 여섯 개의 합성 산출물에 대해 스크립트가 미리 정의한 기대 결과와 일치했을 뿐입니다. 실제 효과를 주장하려면 DuckCrab·OpenFGA 또는 SpiceDB·MCP server를 연결하고, 허용하면 안 되는 자료를 통과시킨 비율, 허용해야 할 자료를 막은 비율, 허용 자료 검색률, 권한 회수 반영 시간, 생성 답변의 정보 노출을 측정해야 합니다.

![namespace부터 MCP task-bound authorization까지 A~J 경계를 추가했을 때 계약상 남는 실패 클래스와 실제 검증 과제를 구분한 비교 도판](../attachments/authorization-aware-rag-graph-boundary/authorization-aware-rag-graph-boundary-figure-03.png)

## 실제 시스템에서 먼저 측정할 지표

권한 회귀는 검색 정확도나 답변 품질과 별도로 봅니다. 아래 영어 이름은 로그와 대시보드에서 자주 쓰이는 지표명을 유지하되, 뜻을 함께 적었습니다.

- unauthorized candidate rate: 검색 후보에 무단 자료가 섞인 비율
- unauthorized context rate: 모델에 전달된 문맥에 무단 자료가 들어간 비율
- unauthorized answer disclosure rate: 최종 답변이 무단 정보를 드러낸 비율
- graph pivot depth와 cross-tenant path count: 다른 조직 자료로 넘어간 그래프 깊이와 경로 수
- derived artifact leakage rate: 요약·주장 같은 파생 산출물이 무단 정보를 드러낸 비율
- stale derivation rate: 오래된 원자료나 권한을 바탕으로 만든 산출물 비율
- false allow / false deny: 잘못 허용한 비율 / 잘못 거부한 비율
- authorized recall@k: 상위 k개 결과에서 허용 자료를 찾아낸 비율
- revocation propagation latency: 권한 회수가 전체 시스템에 반영되는 데 걸린 시간
- state isolation failure rate: 사용자·작업 사이 상태가 잘못 섞인 비율
- unauthorized source-open·tool-call rate: 무단 원문 열기·도구 호출 비율
- missing-identity fail-open rate: 사용자 신원 누락 때 자료가 열려 버린 비율
- permission-metadata-absent disclosure rate: 권한 정보가 없을 때 자료가 노출된 비율
- unauthorized count·facet·identifier disclosure rate: 무단 개수·분류·식별자 노출 비율
- forbidden-vs-absent response distinguishability: 금지된 자료와 없는 자료를 응답만으로 구별할 수 있는 정도
- required-source omission rate: 필수 출처가 빠진 채 답한 비율
- receipt replay reproducibility: 기록을 다시 실행해 같은 권한 결정을 재현한 비율
- p50·p95 authorization latency: 권한 판정의 중앙값과 상위 95% 응답 시간

권한 실패와 검색 근거 부족도 다른 이유 코드로 기록해야 합니다. 안전하게 닫혀 답이 부족한 경우와 관련 문서 자체가 없는 경우를 같은 “답변 불가”로 숨기면 운영자가 잘못된 계층을 고치게 됩니다.

## 기본 경로로 승격하기 전에 통과할 조건

권한 인식 Context Compiler를 기본값으로 바꾸려면 다음을 확인해야 합니다.

- 검증된 사용자 신원과 현재 작업에 한정된 위임이 없으면 거부합니다.
- 문서·chunk·node·edge·path와 파생 산출물의 현재 권한을 재현할 수 있습니다.
- ACL의 권한 부여·회수와 권한 버전 변경이 index·graph·cache에 반영됩니다.
- `tools/list`, `tool/call`과 tool 내부 행동을 각각 검사합니다.
- 분류되지 않은 자원을 자동 공개하지 않고 격리하거나 거부합니다.
- catalog·inspect·execute와 프로그램이 실행 중 호출하는 도구를 별도 권한 지점으로 검사합니다.
- 권한 판정 장애와 오래된 권한 버전에서는 부분 결과를 반환하지 않습니다.
- 개수·분류별 집계·자동 제안·출처·원문 링크를 허용 결과 집합에서만 계산합니다.
- endpoint·operation·API 버전별로 사용자 신원 누락과 원문 열기의 기본 동작을 회귀 검사합니다.
- 권한을 엄격히 적용해도 허용 자료 검색률과 지연 시간이 수용 가능한 범위에 있습니다.
- 사람의 검토와 자동 누출 검사가 크게 어긋나면 기본값 변경을 보류합니다.
- 실제 멀티테넌트 통합 실험을 통과하기 전에는 작은 모의실험 결과를 방어 성능으로 표현하지 않습니다.

모든 RAG에 복잡한 그래프·작업 권한 모델이 필요한 것은 아닙니다. 한 사용자와 한 데이터 원본만 다루고 외부 도구 행동이 없는 시스템은 더 단순한 서버 측 문서 필터로 충분할 수 있습니다. 경계 수는 기능과 위험에 맞춰 늘려야 합니다.

## 결론: 권한은 문서의 태그가 아니라 수명주기입니다

RAG 보안을 `tenant_id` metadata 하나로 끝내면 다음 경계를 놓칩니다.

```text
사용자 신원 확인
→ 현재 작업에 대한 위임
→ 검색 후보의 권한 확인
→ 관련도 순위 계산
→ 그래프 이동별 권한 확인
→ 파생 산출물의 권한 유지
→ 문맥 조립
→ 답변 생성
→ 출처·도구 권한 확인
→ 권한 회수·판정 기록
```

[[notes/knowledge-centric-self-improvement|15번 글]]은 경험을 공유 지식으로 승격하는 과정을 설명했습니다. 16번 글은 그 지식을 작업 문맥으로 손실 없이 옮기는 문제를 다뤘습니다. 이번 글은 **그 지식과 문맥을 지금 이 사용자나 서비스에 공개해도 되는지**를 검증합니다.

세 글을 함께 보면 에이전트 지식 수명주기의 서로 다른 조건이 드러납니다.

```text
15번: 후보 지식을 검증해 승격했는가
16번: 승격된 지식을 문맥으로 정확히 컴파일했는가
17번: 그 문맥과 파생 결과를 현재 사용자나 서비스에 허용할 수 있는가
```

다음 단계는 합성 데이터로 만든 계약 검사를 실제 DuckCrab graph, 권한 엔진과 MCP server에 연결하는 것입니다. 그전까지 이 글의 구조는 완성된 보안 제품이 아니라, **관련도·권한·신뢰·생성의 실패가 어디에서 생기는지 나눠 찾기 위한 검증 설계**로 읽어야 합니다.

## 출처

- <a id="src-002"></a> OpenFGA. [RAG Authorization](https://openfga.dev/docs/use-cases/rag-authorization). Updated 2026-07-22.
- <a id="src-004"></a> Microsoft. [Security filters for trimming results in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-security-trimming-for-azure-search). Updated 2026-07-02.
- <a id="src-005"></a> Microsoft. [Query-Time ACL and RBAC Enforcement in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement). Accessed 2026-07-29.
- <a id="src-006"></a> Amazon Web Services. [Access Control Lists awareness enablement](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-managed-acl.html). Accessed 2026-07-29.
- <a id="src-007"></a> Amazon Web Services. [Document-level access controls for SharePoint data sources](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-managed-ds-sharepoint-acl.html). Accessed 2026-07-29.
- <a id="src-008"></a> Arceo, F. J., & Narsing, V. P. [Securing the Agent: Vendor-Neutral, Multitenant Enterprise Retrieval and Tool Use](https://arxiv.org/abs/2605.05287). arXiv:2605.05287, 2026.
- <a id="src-009"></a> Thornton, S. [Retrieval Pivot Attacks in Hybrid RAG](https://github.com/scthornton/hybrid-rag-pivot-attacks). Research repository, 2026.
- <a id="src-013"></a> Gadgil, S. et al. [Bad Memory: Evaluating Prompt Injection Risks from Memory in Agentic Systems](https://arxiv.org/abs/2607.14611). arXiv:2607.14611, 2026.
- <a id="src-014"></a> Gao, J. et al. [MemPoison: Uncovering Persistent Memory Threats and Structural Blind Spots in LLM Agents](https://arxiv.org/abs/2607.14651). arXiv:2607.14651, 2026.
- <a id="src-017"></a> Model Context Protocol. [Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization). Specification 2025-11-25.
- <a id="src-018"></a> Model Context Protocol. [Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices). Accessed 2026-07-29.
- <a id="src-019"></a> OpenFGA. [Modeling Task-Based Authorization for Agents](https://openfga.dev/docs/modeling/agents/task-based-authorization). Updated 2026-07-22.
- <a id="src-020"></a> OpenFGA. [Authorization for MCP Servers](https://openfga.dev/docs/modeling/agents/mcp-authorization). Updated 2026-07-24.
- <a id="src-021"></a> IETF. [OAuth 2.0 Protected Resource Metadata](https://datatracker.ietf.org/doc/rfc9728/). RFC 9728, 2026-05.
- <a id="src-022"></a> W3C. [PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/). W3C Recommendation, 2013-04-30.
- <a id="src-023"></a> OpenFGA. [Conditions](https://openfga.dev/docs/modeling/conditions). Updated 2026-07-22.
- <a id="src-024"></a> OpenFGA. [Contextual Tuples](https://openfga.dev/docs/interacting/contextual-tuples). Updated 2026-07-22.
- <a id="src-025"></a> Authzed. [Caveats](https://authzed.com/docs/spicedb/concepts/caveats). Accessed 2026-07-29.
- <a id="src-028"></a> NIST NCCoE. [Accelerating the Adoption of Software and Artificial Intelligence Agent Identity and Authorization](https://csrc.nist.gov/pubs/other/2026/02/05/accelerating-the-adoption-of-software-and-ai-agent/ipd). Initial Public Draft, 2026-02-05.
- <a id="src-029"></a> NIST NCCoE. [Data Classification Practices](https://csrc.nist.gov/pubs/sp/1800/39/ipd). NIST SP 1800-39 Initial Public Draft, 2026-02-12.
- <a id="src-030"></a> Model Context Protocol. [Client Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices). Dated documentation, 2026-07-28.
- <a id="src-031"></a> Model Context Protocol. [Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices). Dated documentation, 2026-07-28.
- <a id="src-032"></a> Microsoft. [Query-time ACL and RBAC enforcement in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-query-access-control-rbac-enforcement). Updated 2026-07-01.
- <a id="src-033"></a> Microsoft. [Use an Azure AI Search indexer to ingest Microsoft Purview sensitivity labels and enforce document-level security](https://learn.microsoft.com/en-us/azure/search/search-indexer-sensitivity-labels). Updated 2026-07-08.
- <a id="src-034"></a> IETF. [HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#name-403-forbidden). RFC 9110, Sections 15.5.4–15.5.5, 2022-06.
- <a id="src-035"></a> Microsoft. [Add facets to a query in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/search-faceted-navigation). Accessed 2026-07-29.
- <a id="src-036"></a> OWASP Foundation. [API1:2023 Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/). 2023.
- <a id="src-037"></a> Microsoft. [Query a knowledge base using the retrieve action or MCP endpoint](https://learn.microsoft.com/en-us/azure/search/agentic-retrieval-how-to-retrieve). Updated 2026-07-22.
- <a id="src-038"></a> Amazon Web Services. [Access Control Lists awareness enablement](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-managed-acl.html). Accessed 2026-07-29.
- <a id="src-039"></a> Amazon Web Services. [Retrieve the content of documents from knowledge base](https://docs.aws.amazon.com/bedrock/latest/userguide/kb-test-get-document-content.html). Accessed 2026-07-29.

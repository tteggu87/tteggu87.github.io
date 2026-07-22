---
title: BangCrab 기반 온톨로지 에이전트 설계 결정
type: analysis
status: decided
source_of_truth: false
as_of: 2026-07-22
decision: bangcrab-kernel-clean-room-agent-shell
external_repositories:
  - path: Documents/my_project/bangcrab
    commit: d4079e1aa39bf1bdfbd86896d1d1faef7b8c5d88
  - path: Documents/my_project/duckcrab
    commit: 0029a65c6dcc6dd81f29d9ca8334c1940741a4e6
---

# BangCrab 기반 온톨로지 에이전트 설계 결정

## 결론

온톨로지 에이전트의 기반은 **BangCrab**으로 선택한다. 다만 BangCrab 내부에 자율 에이전트 로직을 계속 덧붙이는 방식은 택하지 않는다. BangCrab은 증거·정규 지식·Pack revision·질의 결과를 책임지는 **governed knowledge kernel**로 한정하고, 조사·추론·도구 선택·답변·변경 제안을 수행하는 **agent shell은 별도의 클린룸 계약**으로 설계한다.

DuckCrab은 버리는 후보가 아니다. `RetrievalPlanner`, `AgentContextBundle`, 권한 모델과 그래프 UI처럼 잘 분리된 패턴을 참고하되, MCP를 통한 직접 노드·엣지 추가와 부분 반영이 가능한 쓰기 경로는 가져오지 않는다.

```text
사용자 목표
  → Clean-room Agent Shell
      → InvestigationPlan
      → BangCrab MCP query
      → ExpertWorkspace
      → 추론·답변·반증 탐색
      → AnswerVerdict 또는 PatchProposal
  → BangCrab Knowledge Kernel
      → exact evidence
      → candidate validation
      → atomic Pack publish
      → immutable revision / receipt
```

이 Wiki는 의사결정의 파생 메모리다. 실제 런타임 계약은 각 프로젝트의 코드, ADR, PRD와 테스트를 우선한다.

## 판단 범위

블로그 1~10번 글의 논지를 하나의 구현 판단으로 압축했다.

1. [온톨로지 에이전트: 의미를 아는 AI를 만드는 방법](../../content/notes/ontology-agent-guide.md)
2. [LLM 에이전트 시대, 온톨로지는 실행의 의미 계층으로 확장될 수 있다](../../content/notes/ontology-in-the-agentic-era.md)
3. [온톨로지 기반 Judge Loop와 에이전트 검증 설계](../../content/notes/ontology-judge-loop-agent-validation.md)
4. [온톨로지가 행동을 바꾸는 에이전트](../../content/notes/ontology-emergent-agent.md)
5. [온톨로지 에이전트는 정말 필요한가](../../content/notes/ontology-agent-behavior-experiment.md)
6. [온톨로지는 언제 JSON 규칙보다 나아지는가](../../content/notes/ontology-vs-json-rules.md)
7. [로컬 온톨로지 에이전트 구현 설계](../../content/notes/local-ontology-agent-implementation.md)
8. [OpenCrab 온톨로지 빌드 아키텍처](../../content/notes/opencrab-ontology-build-architecture.md)
9. [온톨로지는 추론기에서 문맥 컴파일러로 이동하는가](../../content/notes/ontology-context-compiler-opencrab.md)
10. [온톨로지로 시니어 엔지니어의 사고를 외부화할 수 있을까](../../content/notes/ontology-expertise-pack.md)

핵심 전제는 다음과 같다.

- 온톨로지는 LLM을 대체하는 추론기가 아니라, 실행 가능한 의미와 증거를 제공하는 문맥 컴파일러다.
- 강한 LLM은 후보·계획·답변을 제안할 수 있지만 canonical truth를 직접 쓰면 안 된다.
- 에이전트의 가치는 답변 생성 자체보다 근거 범위, 반증, 불확실성, 변경 영향과 재현 가능한 판정에 있다.
- 의미 있는 그래프는 다중 홉·변경 영향·감사 요구가 있을 때 정당화된다. 단순 조회는 JSON 규칙이나 검색 카드로 충분할 수 있다.

## 후보 비교

| 판단 기준      | BangCrab                                                       | DuckCrab                                                      | 설계에 미치는 영향                                                |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| canonical 기준 | SQLite가 source·evidence·node·edge·Pack revision의 단일 권위   | DuckDB graph/document와 Chroma를 중심으로 한 로컬 런타임      | 에이전트의 쓰기 권한을 좁히기에는 BangCrab이 유리하다.            |
| 발행 원자성    | Pack 단위 트랜잭션과 CAS, active pointer를 마지막에 전환       | staged publish가 있으나 직접 추가와 bulk 경로도 공존          | 검증 실패 시 이전 Pack을 보존하는 BangCrab 경계를 채택한다.       |
| 증거 계약      | canonical node·edge마다 exact quote/span 기반 Evidence Capsule | provenance·context 기능은 풍부하지만 직접 변경 경로가 더 넓다 | 답변과 변경 제안을 같은 증거 단위로 감사할 수 있다.               |
| 공개 도구 표면 | 10개 MCP 도구, canonical 변경은 publish 하나                   | 41개 ontology MCP handler와 직접 add/extract 경로             | 에이전트가 선택할 수 있는 위험한 행동 수를 줄인다.                |
| 질의 결과      | `AnswerBundle v3`와 query receipt                              | hybrid retrieval, RRF, context bundle이 강점                  | BangCrab의 감사 가능한 결과에 DuckCrab의 검색 패턴을 참고한다.    |
| UI·탐색 경험   | 핵심 루프 중심                                                 | Web·Polaris·Ontology Forge 등 풍부                            | UI는 DuckCrab에서 학습하되 truth boundary와 분리한다.             |
| 테스트 관찰    | 선택한 핵심 98개 테스트 통과                                   | 선택한 핵심 245개 테스트 통과                                 | DuckCrab이 고장 나서 제외된 것은 아니다. 선택 이유는 권위 경계다. |

2026-07-22에 두 저장소에서 `codegraph sync`를 각각 실행했고 모두 `Already up to date` 상태에서 분석했다. 파일 수나 기능 수만으로 결론을 내리지 않았으며, write path와 실패 원자성을 우선 판단 기준으로 삼았다.

## 왜 BangCrab인가

### 1. 에이전트와 정규 지식 사이의 경계가 이미 닫혀 있다

BangCrab의 공개 루프는 `build → candidate-check → publish → query`다. semantic build는 중간 입력과 사용자 결정을 받아 candidate artifact를 만들지만 canonical graph를 직접 바꾸지 않는다. 발행 시에만 Pack-scoped SQLite 트랜잭션이 실행되고, revision 비교와 검증을 통과한 뒤 active pointer가 전환된다.

이 경계는 에이전트가 잘못된 추론을 하더라도 그 오류가 즉시 정규 지식으로 승격되지 않게 한다. 온톨로지 에이전트에서 가장 비싼 실패는 틀린 답변 한 건이 아니라, 틀린 판단이 다음 판단의 전제가 되는 오염이다.

### 2. 증거가 부가 메타데이터가 아니라 canonical 계약이다

BangCrab은 canonical node와 edge에 bounded `EvidenceCapsuleV1`을 붙이고, exact quote/span과 support stance를 요구한다. 질의·health·Pack이 같은 증거 캡슐을 사용하므로 에이전트 답변과 변경 제안의 근거 단위를 통일할 수 있다.

이 구조에서는 “모델이 그렇게 말했다”를 출처로 취급하지 않는다. 모델은 후보를 만들고, 증거와 deterministic validator가 승격 가능성을 판단한다.

### 3. 에이전트가 소비할 질의 계약이 이미 있다

`query_workspace`는 고정된 workspace snapshot에서 `AnswerBundle v3`와 receipt를 만든다. 따라서 별도의 두 번째 query stack을 만들 필요가 없다. agent shell은 AnswerBundle을 입력으로 받아 설명·반증·판정을 수행하고, 출처 없는 문장을 다시 evidence graph에 밀어 넣지 않는다.

### 4. 기능 수보다 실패 격리가 중요하다

DuckCrab은 검색, context assembly, 그래프 UI와 실험 속도에서 좋은 참고 구현이다. 그러나 MCP의 `ontology_add_node`, `ontology_add_edge`, `ontology_extract`, bulk add 경로가 canonical 저장소에 직접 쓰는 구조는 자율 에이전트의 권한 경계로는 넓다. staged publish가 존재해도 우회 가능한 쓰기 경로가 함께 있으면 운영 정책이 코드로 강제되지 않는다.

## 왜 완전한 클린룸 코어는 선택하지 않는가

완전한 클린룸 설계는 초기 도메인 제약 없이 아름다운 인터페이스를 만들 수 있다. 하지만 다음 항목을 다시 구현하고 다시 실패해야 한다.

- source/evidence registry와 exact span 보존
- canonical graph와 derived index의 분리
- candidate 격리와 deterministic validation
- Pack revision, CAS와 원자적 active 전환
- query receipt와 재현 가능한 AnswerBundle
- 잘못된 발행의 rollback·감사·회귀 테스트

이들은 에이전트의 차별 기능이 아니라 안전하게 지식을 운영하기 위한 기반 비용이다. 이미 BangCrab에 구현된 기반을 재작성할 실익이 작다. 대신 **agent shell의 사고 과정과 데이터 계약만 클린룸으로 설계**하면 코어 재구현 없이 결합도를 낮출 수 있다.

## 제안하는 클린룸 Agent Shell 계약

Agent shell은 BangCrab의 Python 내부 모듈이나 SQLite에 직접 접근하지 않고 MCP 공개 계약만 사용한다.

### `InvestigationPlan`

사용자의 질문을 조사 가능한 단위로 분해한다.

- 목표와 성공 조건
- 필요한 entity·relation·time scope
- 사용할 retrieval 전략
- 반증해야 할 가설
- 중단 조건과 필요한 최소 증거

### `ExpertWorkspace`

한 번의 판단에 필요한 읽기 전용 문맥이다.

- 사용한 Pack revision과 query receipt
- facts와 supporting evidence
- provenance paths와 inferred links
- missing links와 conflicting evidence
- 적용 정책과 scope
- uncertainty와 raw references

이 구조는 DuckCrab의 `AgentContextBundle`에서 아이디어를 얻을 수 있지만, 데이터는 BangCrab의 AnswerBundle과 Pack revision으로부터 조립한다.

### `AnswerVerdict`

자유 형식 답변 앞에 기계 판독 가능한 판정을 둔다.

- `PASS`: 요구 증거와 제약을 충족
- `FAIL`: 명시적 반증 또는 정책 위반
- `UNCERTAIN`: 증거가 충돌하거나 판정 임계값 미달
- `ABSTAIN`: 답변 범위를 지탱할 증거가 없음

판정에는 사용한 claim, evidence capsule, 반증 결과와 Pack revision을 함께 기록한다. LLM의 자연어 설명은 이 구조화 판정 이후에 생성한다.

### `PatchProposal`

에이전트가 발견한 새 사실이나 수정 필요를 canonical write가 아닌 typed proposal로 반환한다.

- 추가·수정·폐기하려는 node/edge
- 각 변경의 exact evidence
- 예상 영향 범위
- 현재 revision에 대한 precondition
- validator가 확인할 invariants
- 사람의 승인 또는 거부 사유

PatchProposal은 quarantine candidate로 들어가며, `validate → canary → approve → publish`를 거쳐야만 새 Pack revision이 된다.

## 실행 흐름

1. 사용자의 질문과 권한으로 `InvestigationPlan`을 만든다.
2. BangCrab MCP query로 Pack revision에 고정된 AnswerBundle을 받는다.
3. 부족한 관계가 있으면 같은 공개 query 계약으로 추가 탐색한다.
4. `ExpertWorkspace`에 사실, 반증, 누락과 불확실성을 정규화한다.
5. LLM은 답변 후보와 필요하면 `PatchProposal`을 만든다.
6. deterministic judge가 evidence coverage, relation validity, scope와 정책을 검사한다.
7. `PASS | FAIL | UNCERTAIN | ABSTAIN` 중 하나와 근거를 사용자에게 반환한다.
8. PatchProposal은 canonical과 분리된 채 검토되고, 승인된 경우에만 BangCrab publish 경로를 사용한다.

## DuckCrab에서 참고할 것과 가져오지 않을 것

참고할 것:

- vector·BM25·graph expansion·RRF를 조합하는 `RetrievalPlanner`
- facts, provenance, missing links, policies, uncertainty를 분리한 `AgentContextBundle`
- 그래프 탐색과 검토를 돕는 Web·Polaris·Ontology Forge UI 패턴
- 도구와 데이터 접근에 적용할 ReBAC 아이디어

가져오지 않을 것:

- MCP에서 canonical graph로 직접 연결되는 add-node/add-edge
- heuristic extraction 결과의 즉시 canonical 승격
- 검증 중간에 일부 node만 남을 수 있는 bulk mutation
- 목적이 겹치는 대규모 도구 표면
- 그래프 저장소와 벡터 저장소를 동등한 truth source로 취급하는 구조

## 구현 순서

### 1단계 — 읽기 전용 전문가 에이전트

`InvestigationPlan → AnswerBundle → ExpertWorkspace → AnswerVerdict`만 구현한다. canonical 변경 기능은 열지 않는다. 품질 지표는 답변 유창성이 아니라 evidence coverage, citation correctness, abstention precision과 Pack revision 재현성으로 잡는다.

### 2단계 — 반증과 변경 영향

부정 증거 탐색, 다중 홉 경로 설명, 바뀐 node·edge가 기존 판정에 미치는 영향을 추가한다. 이 단계에서 단순 RAG나 JSON 규칙 대비 이득을 측정한다.

### 3단계 — 제안 기반 학습

`PatchProposal`과 quarantine review를 도입한다. 사람 승인 없는 direct-to-canonical 경로는 만들지 않는다.

### 4단계 — 도메인 Pack 확장

같은 agent shell을 유지한 채 Pack과 semantic compiler만 도메인별로 교체한다. 9-Space는 quota가 아니라 해석 lens로 사용하며 빈 공간도 허용한다.

## 검증 근거와 한계

분석 당시 확인한 핵심 경로:

- BangCrab: `ontology/materialization.py`, `ledger/sqlite.py`, `ontology/retrieve.py`, `ledger/protocol.py`, `docs/MCP_TOOLS.md`, ADR 0004·0005·0006·0008, Core Reset PRD
- DuckCrab: `mcp/tools.py`, `ontology/builder.py`, `ontology/context_pipeline.py`, `ontology/retrieval_planner.py`, `cli.py`

선택 테스트 결과:

- BangCrab: semantic public loop, Pack materialization, workspace query 관련 98개 테스트 통과
- DuckCrab: MCP, retrieval planner, stores 관련 245개 테스트 통과

기존 `bang-vs-duck-dogfood-20260717` 결과는 failure atomicity 방향을 확인하는 보조 근거로만 사용했다. 해당 비교는 현재보다 오래된 두 커밋을 대상으로 했고 DuckCrab의 이후 retrieval hardening을 반영하지 않으므로, 당시 `auto` retrieval 수치나 지연 시간을 현재 성능으로 일반화하지 않는다.

## 재검토 조건

다음 중 하나가 발생하면 이 결정을 다시 평가한다.

- DuckCrab이 direct canonical mutation을 제거하고 하나의 원자적 Pack publish 경계로 수렴함
- BangCrab의 AnswerBundle 또는 MCP가 agent shell에 필요한 증거·불확실성 계약을 제공하지 못함
- 대규모 corpus에서 SQLite 단일 writer가 측정 가능한 병목이 되고, 동일한 권위·감사 계약을 유지하는 대안이 검증됨
- 사람 승인 기반 PatchProposal이 운영 처리량을 감당하지 못하고 안전한 자동 승격 조건이 실험으로 입증됨
- JSON 규칙·검색 카드 대비 ontology agent의 다중 홉·변경 영향·감사 비용 개선이 재현되지 않음

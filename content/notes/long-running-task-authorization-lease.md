---
title: "20. 작업이 끝나기 전에 권한이 바뀌면: 장기 실행 AI 작업의 권한 만료·취소·결과 공개를 검증하는 법"
description: "백그라운드 AI 작업이 실행되는 동안 사용자·조직·문서 권한이 바뀔 때, 작업 TTL과 권한 유효시간을 분리하고 읽기·부작용·결과 공개를 다시 검증하는 방법을 설명합니다."
date: 2026-07-29
tags:
  - AI에이전트
  - 권한관리
  - MCP
  - 장기실행작업
  - 에이전트보안
---

![장기 실행 AI 작업에서 생성·실행·취소·결과 공개를 권한 수명주기로 분리한 인포그래픽](../attachments/long-running-task-authorization-lease/long-running-task-authorization-lease-infographic.png)

> [!summary] 핵심 결론
> 장기 실행 작업은 시작할 때 한 번 허가받았다고 끝까지 허가된 작업이 아닙니다. **작업 상태의 보존 기간, 자격증명의 유효기간, 권한 판정을 재사용할 수 있는 시간창, 문서·조직 권한의 revision을 분리하고, 새 보호 자료 읽기·외부 부작용·완료 결과 공개 직전에 현재 권한을 다시 확인해야 합니다.**

몇 시간 걸리는 조사 작업을 AI 에이전트에게 맡겼다고 가정해 보겠습니다. 작업을 시작할 때 사용자는 해당 프로젝트 문서에 접근할 수 있었고, 에이전트도 필요한 도구를 호출할 권한이 있었습니다. 그런데 실행 중 사용자가 프로젝트에서 빠졌고, 문서 ACL이 바뀌었으며, 운영자는 작업을 취소했습니다.

대시보드에는 `cancelled`가 표시됐지만 이미 실행 중이던 worker는 마지막 보고서를 저장하려고 했습니다. 나중에 같은 task ID를 아는 다른 연결이 완료 결과를 조회하려고 했습니다. 이때 “작업을 시작할 때 권한이 있었다”는 사실만으로 저장과 공개를 허용해도 될까요?

아닙니다. 작업 생성 허가는 과거의 결정입니다. 장기 실행 작업에서는 실행 중간의 보호 자료 읽기, 쓰기·전송 같은 부작용, 완료 결과를 현재 호출자에게 보여 주는 행동이 서로 다른 시점에 발생합니다. 각 시점의 권한이 달라질 수 있으므로 **task lifecycle과 authorization lifecycle을 별도 상태로 관리해야 합니다.**

[[notes/authorization-aware-rag-graph-boundary|17번 글]]은 관련도와 권한을 분리하고 문서·그래프 경로·파생 답변·도구 행동을 각각 다시 허가해야 한다고 설명했습니다.[src_001](#src-001) [[notes/agent-memory-poisoning-promotion-gate|18번 글]]은 저장된 상태가 다음 세션까지 살아남아도 곧바로 신뢰할 수 있는 지식이 되는 것은 아니라고 정리했습니다.[src_002](#src-002) 이번 글은 두 경계 사이에 남은 시간 문제를 다룹니다.

> **권한이 있었던 작업이 오래 실행되는 동안 권한이 바뀌면, 어디에서 멈추고 무엇을 다시 검사해야 하는가?**

이 글에서 사용하는 `Task Authorization Lease`는 MCP Tasks, OpenID CAEP와 OAuth Token Introspection의 공식 계약을 프로젝트의 장기 작업 구조에 연결한 설계 제안입니다. 확립된 표준 명칭이나 현재 DuckCrab에 구현 완료된 기능은 아닙니다. 합성 상태 전이 검사는 수행했지만 실제 MCP server·권한 엔진·분산 queue·callback 환경의 방어 성능은 아직 측정하지 않았습니다.

## task ID와 완료 상태는 권한 증명이 아닙니다

MCP Tasks는 오래 걸리는 요청의 상태와 지연된 결과 조회를 다루는 durable state machine입니다. 작업 생성 응답에서 최종 결과를 바로 받지 않고, 이후 `tasks/get`, `tasks/result`, `tasks/cancel` 같은 작업으로 상태·결과·취소를 다룰 수 있습니다.[src_003](#src-003)

여기서 가장 중요한 보안 경계는 **task ID를 알고 있다는 사실과 task를 사용할 권한이 있다는 사실을 분리하는 것**입니다. MCP Tasks 명세는 authorization context가 제공되면 task를 그 context에 묶고, 다른 context의 상태 조회·결과 조회·취소를 거부하도록 요구합니다. `tasks/list`도 같은 context에 속한 작업으로 제한해야 합니다.[src_003](#src-003)

```text
task ID를 알고 있음
≠ task 상태를 볼 수 있음
≠ task를 재개할 수 있음
≠ 결과를 받을 수 있음
≠ task를 취소할 수 있음
```

작업 ID를 비밀 토큰처럼 사용하는 설계는 취약합니다. ID가 로그, callback URL, 브라우저 기록이나 다른 에이전트의 작업 메모에 남더라도, 현재 principal·tenant·acting agent·session binding이 맞지 않으면 작업 상태와 결과에 접근할 수 없어야 합니다.

## 장기 작업에는 네 개의 시계가 함께 흐릅니다

장기 실행 작업에서 자주 섞이는 시간값은 최소 네 가지입니다.

| 시계               | 의미                                                            | 잘못된 해석                                     |
| ------------------ | --------------------------------------------------------------- | ----------------------------------------------- |
| 작업 TTL           | task 상태와 결과를 보존하는 기간                                | 이 기간 동안 권한도 유지된다                    |
| 자격증명 만료      | token이나 연결 자격증명을 사용할 수 있는 기간                   | token이 active면 모든 자료 접근이 허용된다      |
| 권한 lease         | 이전 권한 결정을 재사용할 수 있는 최대 시간창                   | 한 번 통과하면 작업 종료까지 재검사가 필요 없다 |
| 정책·자료 revision | tenant membership, 문서 ACL, tool permission과 원문의 현재 버전 | 작업 시작 시점의 snapshot이 항상 공개 가능하다  |

MCP의 task `ttl`은 receiver가 작업과 결과를 얼마나 오래 보존할 수 있는지를 나타냅니다. principal의 권한 유효기간이 아닙니다.[src_003](#src-003) OAuth Token Introspection은 token이 발급됐고 만료·회수되지 않았는지, 어떤 scope·audience를 갖는지 확인하는 표준 경로를 제공합니다.[src_005](#src-005) 그러나 token이 `active`여도 문서 ACL, 조직 소속, task 위임 또는 특정 도구 행동 권한은 이미 바뀌었을 수 있습니다.

따라서 transport credential의 상태와 애플리케이션 자원의 현재 권한을 분리합니다.

```text
active token
≠ 현재 tenant membership
≠ 현재 document·graph permission
≠ 현재 tool action permission
≠ 완료 결과 공개 권한
```

![작업 TTL·토큰 만료·권한 lease·정책 revision이 서로 다른 시계임을 비교한 도해](../attachments/long-running-task-authorization-lease/long-running-task-authorization-lease-figure-01.png)

`authorization lease`는 이전 권한 판정을 무한히 재사용하지 않도록 제한하는 프로젝트 계약입니다. 예를 들어 짧은 시간 안의 순수 계산에는 기존 결정을 재사용할 수 있지만, lease가 끝났거나 권한 변경 신호를 받으면 다음 보호 행동 전에 현재 정책 revision으로 다시 계산합니다. 적정 시간은 자료 민감도, 행동 위험, 권한 엔진 지연과 회수 신호의 전달 시간을 실제로 측정해 정해야 합니다. 이 글은 보편적인 초 단위 임계값을 제안하지 않습니다.

## 회수 이벤트는 빠른 신호지만 완전한 증명은 아닙니다

OpenID CAEP 1.0은 `session-revoked`처럼 지속적으로 접근을 약화시키는 보안 이벤트를 정의합니다. 사용자·장치·session·application·robotic user와 tenant를 포함한 subject의 상태가 바뀌었음을 downstream 시스템에 전달할 수 있습니다.[src_004](#src-004)

이벤트를 받으면 관련 task의 lease를 즉시 무효화하고 다음 보호 행동에서 재검사를 요구할 수 있습니다. 하지만 event-driven 방식만 믿으면 다음 문제가 남습니다.

- 구독 연결이 끊길 수 있습니다.
- 이벤트 전달이나 처리가 늦을 수 있습니다.
- session 회수와 문서·그래프·도구의 세부 권한 변경은 범위가 다릅니다.
- callback이나 worker가 오래된 권한 snapshot을 들고 있을 수 있습니다.

그래서 다음 세 가지를 함께 사용합니다.

```text
event-driven invalidation
+ bounded authorization lease
+ 영향 큰 행동 직전 domain permission recheck
```

CAEP 이벤트는 “다시 확인하라”는 빠른 신호입니다. 특정 문서를 읽거나 외부 시스템에 쓰는 행동을 최종 허가하는 판정 자체는 아닙니다. 반대로 이벤트를 놓치더라도 짧은 lease가 끝나면 재검사가 일어나야 합니다.

## snapshot-safe 작업과 live-sensitive 작업을 나눕니다

권한이 바뀌었다고 모든 장기 계산을 즉시 폐기하면 가용성이 지나치게 낮아질 수 있습니다. 작업이 실행 중 무엇을 읽고 무엇을 바꾸는지에 따라 두 유형을 나누는 편이 낫습니다.

### Snapshot-safe 작업

작업 시작 시 허용된 입력을 content hash와 permission revision으로 봉인한 뒤, 새로운 보호 자료를 읽지 않고 외부 부작용도 만들지 않는 순수 계산입니다.

- 내부 계산은 계속할 수 있습니다.
- 계산 중 새 문서·그래프·도구를 사용하지 않습니다.
- 결과를 저장하거나 공개할 때는 현재 권한을 다시 검사합니다.
- 공개가 금지되면 결과를 privileged quarantine에 보존하거나 폐기합니다.

### Live-sensitive 작업

실행 중 새 문서를 읽고, 그래프를 확장하거나, 도구를 호출하고, 외부 시스템에 쓰는 작업입니다.

- lease가 만료되거나 회수 신호를 받으면 다음 보호 단계 전에 재검사합니다.
- stale lease로 새로운 evidence를 읽지 않습니다.
- write·share·delete·외부 전송은 현재 권한 없이는 커밋하지 않습니다.
- 권한을 복구할 수 없으면 caller-safe 오류로 종료하거나 취소합니다.

![봉인된 입력만 계산하는 snapshot-safe 작업과 실행 중 새 자료·도구를 사용하는 live-sensitive 작업의 차이](../attachments/long-running-task-authorization-lease/long-running-task-authorization-lease-figure-02.png)

이 구분은 작업을 계속 실행할 수 있는지와 결과를 공개할 수 있는지를 분리합니다. 이미 허용된 입력으로 내부 계산을 끝낼 수 있어도, 권한이 회수된 사용자에게 그 결과를 돌려주는 것은 별도 행동입니다.

## 취소 상태와 실제 부작용 중단은 다릅니다

MCP Tasks는 취소 요청 뒤 task 상태를 `cancelled`로 전환하지만, 실제 실행이 계속되더라도 상태는 cancelled로 유지될 수 있다고 명시합니다.[src_003](#src-003) 따라서 대시보드에 취소 표시가 보인다는 사실만으로 worker의 외부 전송과 쓰기가 멈췄다고 판단해서는 안 됩니다.

```text
취소 상태 기록
→ 이미 실행 중인 worker가 늦게 commit 시도
→ 상태 화면은 cancelled
→ 실제 외부 전송·write는 발생할 수 있음
```

안전한 구현은 worker 중단 신호와 함께 `cancellation epoch`를 증가시키고, commit·egress·durable result 저장 직전에 현재 epoch와 lease를 다시 확인합니다. 취소 전에 준비한 결과라도 epoch가 달라졌다면 late commit을 차단합니다.

> [!warning] 취소는 감사 이벤트이지 단독 차단 장치가 아닙니다
> `tasks/cancel` 응답 성공, UI의 `cancelled` 표시와 실제 worker 중단을 같은 상태로 취급하지 않습니다. 외부 전송·쓰기·결과 저장 경계가 취소 epoch를 확인해야 늦게 도착한 부작용을 막을 수 있습니다.

## 결과 조회는 과거 작업의 부록이 아니라 새로운 권한 행동입니다

완료 결과는 과거 권한으로 만든 파생 artifact입니다. `completed`라는 상태는 현재 호출자에게 보여 줘도 된다는 의미가 아닙니다. 작업을 만든 사용자가 조직에서 빠졌거나, 결과가 참조한 부모 문서의 공개 범위가 바뀌었거나, 다른 agent가 task ID를 넘겨받았을 수 있습니다.

`tasks/result`나 callback에서 최소한 다음을 다시 확인합니다.

1. 현재 요청자가 task와 같은 authorization context에 속하는가
2. tenant·acting agent·task purpose binding이 여전히 유효한가
3. 결과가 참조한 부모 자료의 현재 공개 권한이 유지되는가
4. reviewed declassification이나 snapshot disclosure 정책이 있는가
5. 결과 retention, task TTL과 권한 lease가 각각 유효한가

[[notes/authorization-aware-rag-graph-boundary|17번 글]]에서 파생 Claim·summary·answer도 별도 보호 자원으로 다뤄야 한다고 설명한 이유가 여기서 더 분명해집니다.[src_001](#src-001) 결과는 원문을 복사하지 않았더라도 여러 보호 자료의 결론과 존재를 드러낼 수 있습니다. 과거에 허용된 문맥으로 만들었다는 이유만으로 현재 공개 권한을 자동 상속시키지 않습니다.

![작업 생성부터 보호 자료 읽기·부작용 커밋·취소·완료 결과 공개까지 권한을 다시 검사하는 게이트](../attachments/long-running-task-authorization-lease/long-running-task-authorization-lease-figure-03.png)

## Task Authorization Lease에는 무엇을 기록합니까

다음 구조는 표준 스키마가 아니라 회귀와 감사를 위한 최소 프로젝트 제안입니다.

```yaml
task_authorization_lease:
  task_id: opaque-task-id
  principal_id: opaque-principal-id
  tenant_id: opaque-tenant-id
  acting_agent_id: opaque-agent-id
  purpose: research-report
  authorization_model_id: auth-model-v4
  authorization_data_revision: rev-882
  allowed_resource_classes:
    - project_document
    - derived_report
  allowed_actions:
    - read
    - result_persist
  allowed_egress_destinations: []
  lease_issued_at: 2026-07-29T09:00:00Z
  lease_valid_until: 2026-07-29T09:05:00Z
  last_invalidation_event_id: evt-1042
  cancellation_epoch: 3
  next_recheck:
    - protected_read
    - side_effect
    - result_disclosure
```

원문 경로, 사용자 정보와 권한 그래프 전체를 receipt에 복제하면 감사 자료가 새로운 민감정보 저장소가 됩니다. opaque ID, hash, 접근통제와 보존기간을 사용하고, 재현에 필요하지 않은 세부 정보는 기록하지 않습니다.

## 발행 전에 어떤 실패를 재현해야 합니까

프로젝트의 합성 스모크는 다음 열 가지 구조 조건을 검사했고 모두 통과했습니다. 이는 실제 방어율을 측정한 benchmark가 아니라 작성한 guard가 기대한 상태 전이를 닫는지 확인한 결과입니다.

- 같은 authorization context만 task 상태를 조회합니다.
- 다른 tenant는 task ID를 알아도 결과를 받을 수 없습니다.
- 다른 acting agent는 task를 이어받지 못합니다.
- session 회수 뒤 외부 부작용이 차단됩니다.
- token이 active여도 domain permission이 회수되면 차단됩니다.
- invalidation event를 놓쳐도 lease 만료가 재검사를 강제합니다.
- cancelled worker가 계속 실행해도 late commit이 차단됩니다.
- 완료 뒤 권한이 회수되면 result disclosure가 차단됩니다.
- task TTL이 길어도 authorization lease가 자동 연장되지 않습니다.
- 물리적으로 격리된 public-only task에는 더 얇은 명시적 정책을 적용할 수 있습니다.

실제 통합에서는 평균 성공률 하나보다 다음을 분리해 측정해야 합니다.

| 지표                        | 묻는 질문                                               |
| --------------------------- | ------------------------------------------------------- |
| revocation closure latency  | 권한 회수 뒤 모든 보호 경계가 닫히는 데 얼마나 걸리는가 |
| late side-effect block rate | 취소 뒤 늦은 write·egress를 얼마나 차단하는가           |
| result disclosure recheck   | 완료 결과 조회에서 현재 권한을 다시 확인했는가          |
| false deny                  | 정당한 snapshot-safe 결과까지 불필요하게 막았는가       |
| authorization p95 latency   | 재검사가 장기 작업 처리량에 어떤 비용을 더하는가        |
| receipt replay              | 같은 revision과 이벤트로 판정을 재현할 수 있는가        |

## 모든 장기 작업에 같은 계약이 필요한 것은 아닙니다

이 전체 계약은 보호된 tenant 자료를 읽거나 영향 있는 행동을 수행하는 장기 작업을 위한 프로젝트 기준입니다. 물리적으로 분리된 공개 자료만 처리하는 작업, 외부 부작용이 없는 짧은 계산, 매 단계 사람이 다시 승인하는 고위험 작업에는 더 단순한 구조가 나을 수 있습니다.

반대로 비가역적인 행동이나 강한 규제를 받는 자료라면 background execution 자체를 허용하지 않는 선택이 더 안전할 수 있습니다. 동기식 짧은 요청, 사람 재승인 또는 작업을 작은 단계로 나누는 방식이 긴 lease를 정교하게 관리하는 것보다 단순하고 강할 수 있습니다.

아직 남은 검증도 분명합니다.

- MCP Tasks는 2025-11-25 명세에서 experimental이며 계약이 바뀔 수 있습니다.[src_003](#src-003)
- CAEP는 지속 보안 신호 표준이지 문서·그래프·도구 권한 표준이 아닙니다.[src_004](#src-004)
- RFC 7662 introspection을 지원하지 않는 provider가 있을 수 있습니다.[src_005](#src-005)
- 적정 lease 길이와 회수 지연은 실제 권한 엔진·queue·callback 환경에서 측정해야 합니다.
- 취소와 side-effect commit 사이의 race를 실제 분산 시스템에서 재현하지 않았습니다.
- snapshot 결과를 부모 권한 회수 뒤에도 공개할 수 있는지는 조직의 법적·제품 정책에 따라 달라집니다.

## 결론: 작업의 수명과 권한의 수명을 분리합니다

장기 실행 task는 요청을 오래 보관하는 편의 기능만이 아닙니다. 실행 중 identity·조직 소속·문서 권한·도구 permission이 바뀌고, 취소 뒤에도 worker가 늦게 commit하며, 완료 결과가 다른 연결에서 조회되는 새로운 권한 수명주기입니다.

```text
장기 작업 보안
= 생성 시 authorization context binding
+ 제한된 권한 lease
+ 회수 이벤트와 revision 추적
+ 새 보호 자료 읽기 재검사
+ 부작용 commit 직전 재검사
+ 취소 뒤 late commit 차단
+ 현재 권한 기반 결과 공개
```

핵심은 작업을 시작할 수 있었는지가 아니라 **지금 이 자료를 읽고, 지금 이 행동을 커밋하고, 지금 이 결과를 이 호출자에게 공개해도 되는가**를 각각 증명하는 것입니다.

---

## 출처

<a id="src-001"></a>**src_001.** tteggu의 지식창고. “17. 관련도는 권한이 아니다: 멀티테넌트 RAG와 GraphRAG의 문맥 누출을 막는 법.” 2026-07-29. https://tteggu87.github.io/notes/authorization-aware-rag-graph-boundary

<a id="src-002"></a>**src_002.** tteggu의 지식창고. “18. 에이전트가 스스로 배운 지식은 안전한가: 지속 메모리 오염과 승격 게이트를 검증하는 법.” 2026-07-29. https://tteggu87.github.io/notes/agent-memory-poisoning-promotion-gate

<a id="src-003"></a>**src_003.** Model Context Protocol. “Tasks.” Specification 2025-11-25. https://modelcontextprotocol.io/specification/2025-11-25/basic/utilities/tasks

<a id="src-004"></a>**src_004.** OpenID Foundation Shared Signals Working Group. “OpenID Continuous Access Evaluation Profile 1.0.” 2025-08-29. https://openid.net/specs/openid-caep-1_0.html

<a id="src-005"></a>**src_005.** IETF. “OAuth 2.0 Token Introspection.” RFC 7662. 2015-10. https://datatracker.ietf.org/doc/rfc7662/

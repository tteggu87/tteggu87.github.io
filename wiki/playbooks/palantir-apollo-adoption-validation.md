---
title: "Apollo 도입·실패·복구 검증 플레이북"
type: playbook
status: active
source_of_truth: false
as_of: 2026-09-11
last_reviewed: 2026-09-11
evidence_confidence: "공식 기능과 원문 제안을 종합한 시험 절차; 실제 Apollo 실행 미수행"
canonical_sources:
  - research/palantir-apollo-operations-20260911/source-original.md
  - research/palantir-apollo-operations-20260911/README.md
  - wiki/sources/palantir-apollo-operations-report-2026-09-11.md
---

# Apollo 도입·실패·복구 검증 플레이북

## 목적과 시작 조건

작은 소프트웨어의 전달·관측·실패·복구를 **격리된 시험 환경**에서 검증한 뒤 대상 환경을 넓히는 제안이다. Palantir 공식 도입 표준, 실제 설치 명령, 자동 변경 승인 또는 실험 결과가 아니다. 출처와 미확인 사항은 [보고서 메모](../sources/palantir-apollo-operations-report-2026-09-11.md), 판단 구조는 [운영 책임 지도](../analyses/palantir-apollo-operations-2026-09-11.md)를 참조한다.

시작 전에 서비스 owner, 시험 권한, 시험 데이터, 실패 허용 범위, 중단 권한, 복구 담당자가 지정돼 있어야 한다. 실제 운영 환경에 의도적인 결함을 넣지 않는다. 계약·보안·인프라가 확인되지 않으면 읽기 전용 설계 검토로 제한한다.

## 1. 환경·책임 인벤토리

| 항목 | 기록할 값 |
| --- | --- |
| 대상 | 서비스·버전·site·cloud·온프레미스·장비 식별자 |
| 연결 | 항상 연결 / 간헐 연결 / 단방향 / 완전 단절 |
| 설치 범위 | 정확한 Spoke 유형, Kubernetes·OS·아키텍처·자원 지원 확인 |
| 아티팩트 | authoritative repository, Release·image digest, dependency |
| 변경 조건 | Product·Channel·설정·의존성·maintenance window·suppression |
| 신뢰 | 사람·CI·agent·서비스 identity, keypair·certificate 소유자 |
| 권한 | 작성·승격·환경 변경·중단·복구 권한과 승인 기록 |
| 관측 | 보고 시점·liveness·Health·업무 검증·로그 경계 |
| 반입 | Bundle 내용·별도 이미지·검사·승인·전달 담당 |
| 복구 | 관리·아티팩트·구성·데이터별 owner와 RPO/RTO |
| 구매·지원 | 라이선스 단위, severity별 응답, 인프라 책임, 종료·이관 |

공개된 Kubernetes Spoke 권장 자원을 workload 전체의 sizing으로 대체하지 않는다. wildcard RBAC와 초기 root 접근은 보안 검토 대상으로 남긴다. 모든 agent·OS·네트워크 지원을 표에서 임의로 채우지 않는다. 모르는 값은 `unknown`으로 남긴다.

## 2. 작은 서비스로 변경 한 바퀴를 관찰한다

먼저 상태가 단순하고 외부 부수 효과가 없는 stateless 시험 서비스를 정한다. `v1 → 정상 v2 → 시험용 결함 v3 → 안전한 버전`을 준비하고, 각 버전의 아티팩트와 설정을 식별한다. 이전 버전이 항상 안전하다고 가정하지 않는다.

| 단계 | 시험 질문 | 통과 증거 | 중단·보류 조건 |
| --- | --- | --- | --- |
| 정상 배포 | 조건을 만족한 Plan이 실행되는가? | Release·Plan·Entity·환경·시각·실제 보고 상태 | 대상·권한 불명확, 상태 관측 불가 |
| 시험 승격 | 정한 canary·시간·Health 조건이 적용되는가? | 평가 입력·기준·결과·승격 범위 | Health 미제공을 성공 증거로 해석 |
| 결함 감지 | 의도한 시험 실패가 감지되는가? | 예상 실패와 실제 Plan·Health 반응 | 다른 환경으로 확산되거나 원인 불명 |
| 확산 차단 | 추가 적용을 중단할 수 있는가? | Recall·suppression과 대상 범위 | 중단 권한 부재·감사 기록 부재 |
| 복구 | 안전한 상태로 이동하고 확인되는가? | rollback 또는 forward fix 선택 이유·결과 | 단순 버전 표시만 복구 증거로 사용 |
| 감사 | 누가 무엇을 승인·실행했는가? | 변경·승인·실행·실패·복구 연결 기록 | 동일 작업을 추적할 식별자 부재 |

공식 승격 평가에서 Health 부재의 제한과 모든 Plan 실패 감지의 부재는 다르다. Recall과 rollback을 같은 버튼 이름으로 기록하지 않는다. DB migration이나 외부 업무 효과가 있는 서비스는 다음 단계에서 별도의 복구 시험을 설계한다.

## 3. 연결·반입 예외를 추가한다

간헐 연결 시험에서는 마지막 Reported State의 시각, 단절 중 관리·관측 가능 범위, 재접속 뒤 실제 변경 순서와 상태를 기록한다. 다른 site의 변경이 계속되는지 역시 시험으로 확인할 질문이지 이미 보장된 결과가 아니다.

에어갭 시험에서는 Source Hub의 artifact store 접근 여부를 먼저 기록한다. 메타데이터 Bundle과 이미지가 함께 반입되는 경우, 이미지를 별도 전달해야 하는 경우를 구분한다. 이미지가 빠진 시험을 통해 오류 위치가 반입·저장소·Plan·runtime 중 어디인지 설명할 수 있어야 한다. 승인 경계를 우회하는 전달을 시험 편의로 허용하지 않는다.

## 4. 네 복구를 각각 시험한다

관리 계층 장애·복구, 승인 아티팩트의 재확보, 설정·채널·권한 이력의 복원, workload 데이터 복원을 별도로 검토한다. 실제 장애 주입은 승인된 격리 시험에서만 수행한다. DB와 외부 업무에는 backup restore, forward migration 또는 보정 작업이 필요할 수 있다.

시험에 포함하지 못한 층은 `not_tested`로 기록한다. 설치가 됐다는 이유로 관리 계층 HA·backup·RPO/RTO·업무 복구까지 통과 처리하지 않는다.

## 5. 범위 확대와 비용 판단

작은 stateless 서비스 → stateful workload → connected on-prem → intermittent edge → air-gap 순서를 기본 제안으로 삼되 조직의 실제 위험에 따라 조정한다. 각 단계의 통과 증거가 없으면 이전 단계로 되돌아가 원인을 분리한다. 고정 일정 안에 production 또는 ROI가 보장된다는 뜻이 아니다.

TCO 비교에는 동일 기간·site 수·Release 빈도·인건비·연결·장애 비용과 지원 범위를 고정한다. 없어지는 수동 설치·고객별 분기·현장 작업과 새로 생기는 정책·권한 심사·관측·저장소·반입 비용을 함께 기록한다. 원문의 높음·중간 정성표를 실측 수치로 사용하지 않는다.

## 최소 검증 영수증

```yaml
status: not_executed
service: unknown
environments: []
release_identifiers: []
plan_identifiers: []
channel_and_constraints: unknown
health_inputs_and_thresholds: unknown
approval_and_execution_identity: unknown
observations_with_timestamps: []
recall_or_recovery_decision: unknown
airgap_bundle_and_separate_images: unknown
recovery_layers_tested: []
workload_data_or_business_compensation: unknown
baseline_and_operating_cost: unknown
remaining_unknowns: []
next_decision: hold
```

빈 예시는 기록 형식이지 실행 결과가 아니다. `pass`, `fail`, `unknown`, `not_tested`를 구분하고 증거 없는 `pass`를 허용하지 않는다.

## 3줄 요약

승인된 격리 환경의 작은 서비스로 배포·관찰·실패·회수·복구를 한 바퀴 확인한다.  
Health 부재, 오래된 관측, Bundle의 이미지 누락, 데이터 복구는 별도의 검증 질문이다.  
실제 증거와 비용 기준을 남긴 단계만 확대하고 미확인·미시험을 성공으로 바꾸지 않는다.

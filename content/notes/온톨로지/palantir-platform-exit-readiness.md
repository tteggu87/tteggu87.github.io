---
title: "30. 인공지능 플랫폼에서 실제로 빠져나올 수 있는가"
description: "Homes for Ukraine의 Palantir Foundry 도입과 Share 전환 사례를 따라 긴급 도입 가치, 전환 마찰(switching friction), 실제 데이터·업무 이전, 공급자 계약 종료와 전환 후 증거를 분리해 인공지능 플랫폼의 exit readiness(전환 준비도)를 판단하는 방법을 설명합니다."
date: 2026-08-30
tags:
  - AI플랫폼
  - 팔란티어
  - Foundry
  - 조달
  - 데이터거버넌스
---

![긴급 도입 가치에서 switching friction, 실제 migration, 공급자 exit와 post-exit evidence까지 이어지는 AI 플랫폼 exit readiness 수명주기](../../attachments/palantir-platform-exit-readiness/palantir-platform-exit-readiness-infographic.png)

계약을 끝내도, 다음 날 아침 업무는 계속될까요?

한 운영팀이 인공지능 플랫폼을 교체한다고 가정해 보겠습니다. 데이터 파일은 내려받았고 계약 종료 절차도 확인했습니다. 이제 떠나면 될 것 같습니다. 그런데 새 시스템에서 어제의 승인 상태를 복원할 수 없다면 어떨까요? 누가 어떤 일을 처리할 권한이 있는지도 확인되지 않았다면요.

데이터는 밖으로 나왔는데, 업무는 아직 안에 남아 있습니다.

영국의 Homes for Ukraine 서비스에서는 도입의 가치와 교체의 위험이 실제로 엇갈렸습니다. 2022년 긴급 상황에서는 Palantir 기반 시스템이 빠른 가동에 기여했습니다. 이후에는 데이터·업무 이전(migration)의 비용과 일정·품질·보호·안전(safeguarding) 위험 때문에 교체를 미뤘습니다. 여기서 기록을 덮으면 영원히 떠나지 못한 사례처럼 보입니다. 하지만 몇 년 뒤, 같은 서비스는 Foundry에서 자체 Share 시스템으로 옮겨 공급자 계약을 끝냈습니다. ([National Audit Office](https://www.nao.org.uk/reports/investigation-into-the-homes-for-ukraine-scheme/), [MHCLG system change survey](https://consult.communities.gov.uk/digital-delivery/homes-for-ukraine-new-platform-survey/), [MHCLG Digital retrospective](https://mhclgdigital.blog.gov.uk/2026/04/09/from-emergency-to-sustainability-creating-share-homes-for-ukraine-data/))

> [!summary] 떠나는 능력까지 확인해야 합니다
> **Exit readiness(전환 준비도)는 현재 공급자 없이도 데이터와 업무 의미를 넘겨받아 서비스를 이어갈 준비 상태입니다.** 공급자 교체가 어려운 **벤더 락인(vendor lock-in)**을 판단할 때는 교체에 드는 비용·위험인 **switching friction(전환 마찰)**과 실제 전환을 수행하는 **exit capability(전환 실행 능력)**를 나눠 봐야 합니다. 지금의 도입 효과와 전환 뒤 비용·품질을 확인하는 **post-exit evidence(전환 후 증거)**도 서로 대신할 수 없습니다.

이 용어들을 서로 다른 판단 축으로 나눈 것은 공개 근거를 비교하기 위한 프로젝트 분석 프레임입니다. Palantir의 공식 제품 모델이나 업계 표준 분류는 아닙니다.

## 처음에는 시스템을 빨리 여는 일이 급했습니다

2022년 3월 영국 정부는 Homes for Ukraine 제도를 매우 짧은 시간 안에 가동해야 했습니다. 영국 감사원(NAO, National Audit Office)은 Palantir이 6개월 동안 무상 지원을 제공했고, 이 선택이 제도를 빠르게 시작하는 데 도움이 됐다고 기록합니다. 동시에 통상적인 사전 사용자 조사와 충분한 시험을 거치기 어려웠고 일부 지방정부 사용자는 시스템을 혼란스럽게 느꼈다고 지적했습니다. ([NAO, Investigation into the Homes for Ukraine scheme](https://www.nao.org.uk/reports/investigation-into-the-homes-for-ukraine-scheme/))

빠르게 시작한 덕분에 얻은 가치와 충분히 준비하지 못해 생긴 부담이 같은 도입 안에 있었습니다. 어느 한쪽만 남기면 이후의 선택을 설명하기 어려워집니다.

```text
긴급 상황에서 빠른 도입이 가치 있었음
≠ 같은 플랫폼을 장기적으로 유지해야 함

나중에 교체를 검토함
≠ 초기 도입이 잘못이었음
```

급할 때는 오늘 서비스를 시작하는 일이 가장 중요한 성과일 수 있습니다. 요구사항이 안정되고 나면 질문이 달라집니다. 앞으로도 이 비용을 감당할 것인가. 코드와 데이터를 누가 소유할 것인가. 다른 시스템으로 옮길 여지는 남아 있는가.

처음의 선택이 가치 있었다고 해서 이후의 선택까지 정해지는 것은 아닙니다.

고객 사례의 사용 상태와 효과 증거를 분리하는 기준([[notes/온톨로지/palantir-case-evidence-receipt|29번 글]])에 시간축을 더해 볼 필요가 있습니다. `도입됨 → 사용됨 → 효과가 남 → 제품이 원인임`을 한 줄로 이어 읽지 않듯, 도입 성공에서 장기 유지의 정당성으로 곧장 건너뛸 수도 없습니다. 그 사이에 유지보수 방식과 대체 가능성, 전환 준비라는 질문이 남습니다.

## 떠나고 싶어도 업무를 멈출 수는 없었습니다

NAO 기록에 따르면 영국 레벨링업·주택·커뮤니티부(DLUHC, Department for Levelling Up, Housing and Communities)는 Palantir 무료 지원 기간 이후 유상 계약을 맺었습니다. 이후 대안을 검토했지만 새로운 공급자로 옮길 때 필요한 초기 비용, 일정과 품질 위험, 보호·안전 서비스 중단 가능성 때문에 2023년에는 데이터·업무 이전을 바로 실행하지 않았습니다. ([NAO](https://www.nao.org.uk/reports/investigation-into-the-homes-for-ukraine-scheme/))

교체를 미룬 장면만 떼어 놓으면 `vendor lock-in`이라는 말로 설명을 끝내기 쉽습니다. 그러나 그 말만으로는 무엇이 전환을 가로막았는지 알 수 없습니다.

일반적인 전환 작업으로 풀어 보면 부담은 여러 곳에 걸쳐 있습니다. 데이터를 새 구조로 옮기려면 비용이 들고, 기존 업무 규칙과 화면도 다시 만들어야 할 수 있습니다. 새 시스템의 결과가 기존 시스템과 맞는지 대조하는 동안에도 서비스는 계속 돌아가야 합니다. 권한과 보안을 다시 검증하고 사용자가 익숙한 작업 방식까지 바꾸는 일도 남습니다.

이 부담을 **switching friction**이라고 부르겠습니다. 마찰이 높으면 교체가 비싸고 위험할 수 있습니다. 그렇다고 출구가 사라진 것은 아닙니다.

![2022년 긴급 도입에서 2023년 전환 보류, 2024년 자체 시스템 구축, 2025년 Foundry에서 Share로 전환하고 공급자 계약을 종료하기까지의 Homes for Ukraine 수명주기](../../attachments/palantir-platform-exit-readiness/palantir-platform-exit-readiness-figure-01.png)

실제 기록은 여기서 방향을 바꿉니다. 2025년 영국 주택·커뮤니티·지방정부부(MHCLG, Ministry of Housing, Communities and Local Government)의 사용자 조사 페이지에는 **Foundry에서 새로운 Share Homes for Ukraine Data 시스템으로 전환하는 과정**이 조사 목적으로 적혀 있습니다. 2026년 MHCLG Digital 회고는 정부팀이 2024년 여름부터 자체 시스템을 만들기 시작했고 약 3년치 운영 데이터를 이관한 뒤 2025년 9월 Share를 가동해 공급자 계약을 종료했다고 설명합니다. ([MHCLG system change survey](https://consult.communities.gov.uk/digital-delivery/homes-for-ukraine-new-platform-survey/), [MHCLG Digital retrospective](https://mhclgdigital.blog.gov.uk/2026/04/09/from-emergency-to-sustainability-creating-share-homes-for-ukraine-data/))

한때 교체를 미뤘던 서비스가 결국 실제 전환을 마쳤습니다. 두 사실을 함께 놓아야 구분할 수 있습니다.

```text
switching friction이 높음
≠ exit 불가능
```

다만 이 결말을 다른 조직에 그대로 붙일 수는 없습니다. 공공 서비스의 safeguarding 요구와 데이터 구조, 조직 역량은 제조·보험·민간 의료와 다를 수 있습니다. 확인된 것은 이 서비스가 전환을 수행했다는 사실이지, 누구나 쉽게 떠날 수 있다는 보장이 아닙니다.

## 계약서의 출구를 실제 업무 경로로 바꿔야 합니다

가상의 운영팀은 계약서에서 중도 종료 조항(break clause)을 찾았습니다. 코드도 조직이 소유합니다. 그런데 내보낸 데이터의 의미와 권한 규칙을 설명하는 문서가 없다면, 새 시스템을 만드는 사람은 어디서부터 업무를 복원해야 할까요?

계약을 끝낼 권리, 데이터를 내보내는 기능, 코드를 소유하는 조건은 각각 중요합니다. 그래도 새 시스템이 같은 업무를 수행하지 못하면 서비스는 멈춥니다. 여기서 `전환할 수 있는가`와 `그 전환을 지금 실행할 준비가 됐는가`가 갈라집니다.

> **Exit capability는 실제 전환을 수행할 능력이고, exit readiness는 그 능력을 필요한 시점에 실행할 수 있도록 데이터·업무 의미·권한·사람·계약 준비를 미리 확인해 둔 상태입니다.**

준비됐다는 말을 확인 가능한 답으로 바꾸면 다음과 같은 영수증이 됩니다. 상태 대조(reconciliation)는 기존 시스템과 새 시스템의 상태가 일치하는지 확인하는 일입니다. 품질보증(QA, Quality Assurance)은 전환 과정에서 권한·데이터 무결성·감사 조건을 다시 점검하는 절차입니다.

```yaml
exit_readiness_receipt:
  data_portability: 어떤 데이터와 이력을 어떤 형식으로 내보낼 수 있는가
  code_schema_ownership: 업무 로직·schema·config를 누가 소유하는가
  replacement_lead_time: 대체 시스템을 마련하는 데 어느 정도 작업이 필요한가
  reconciliation: 기존 시스템과 새 시스템의 상태를 어떻게 대조할 것인가
  service_continuity: 전환 중 절대로 멈추면 안 되는 업무는 무엇인가
  security_qa: 권한·데이터 무결성·감사 요구를 어떻게 재검증할 것인가
  user_transition: 사용자 교육·지원·업무 변경을 누가 책임지는가
  contract_handoff: 종료 시 지원·자료·지식 이전 계약은 무엇인가
  migration_cost: 일회성 전환 비용을 어떻게 기록할 것인가
  post_exit_evidence: 전환 뒤 비용·품질·사고·업무 부담을 어떻게 비교할 것인가
```

![데이터 이동성, 코드·스키마 소유권, 대체 리드타임, reconciliation, 서비스 연속성, 보안 QA, 사용자 전환과 post-exit evidence로 구성한 Exit Readiness Receipt](../../attachments/palantir-platform-exit-readiness/palantir-platform-exit-readiness-figure-02.png)

이 영수증에서 눈여겨볼 곳은 점수보다 빈칸입니다. `data_portability`에는 답이 있는데 `user_transition`과 `reconciliation`은 비어 있다고 해보겠습니다. 파일을 내보내는 방법은 알아도, 사용자를 어떻게 옮길지와 새 시스템의 상태를 어떻게 믿을지는 아직 모릅니다.

내보내기(export) 성공 화면으로 실제 운영 전환(cutover)의 준비까지 증명할 수 없는 이유입니다.

## 복구 버튼은 플랫폼 밖의 출구까지 보장하지 않습니다

백업이 있고 이전 상태로 되돌릴 방법도 있다면 안심하기 쉽습니다. 다만 먼저 확인할 것이 있습니다. 그 복구는 어느 플랫폼 안에서 가능한가요?

Palantir Global Branching의 변경 검토와 병합(merge), 복구(recovery), 보존(retention)은 서로 다른 책임입니다([[notes/온톨로지/palantir-foundry-aip-operational-loop|28번 글]]). Palantir 공식 문서상 branch는 변경을 격리하고 검토하는 데 쓸 수 있지만 부분 병합 실패(partial merge failure)에서는 일부 resource만 반영될 수 있고 자동 되돌리기(revert)가 보장되지 않습니다. 비활성·보관 상태(inactive·archived)의 branch 전용 데이터도 보존 설정의 영향을 받습니다. ([Global Branching core concepts](https://www.palantir.com/docs/foundry/global-branching/core-concepts), [June 2026 lifecycle announcement](https://www.palantir.com/docs/foundry/announcements/2026-06))

플랫폼 내부의 복구 기능을 충분히 갖췄더라도, 독립적인 운영까지 확인한 것은 아닙니다.

```text
공급자 플랫폼 안에서 restore 가능
≠ 공급자 없이 독립적으로 운영 가능

vendor-native retention
≠ portable replacement capability
```

운영 중에는 공급자 내부의 백업·branch·복구 기능이 중요합니다. 전환 준비는 그 기능과 경쟁하지 않습니다. 현재 플랫폼을 사용할 때의 복구와, 그 플랫폼이 없어도 서비스를 이어가는 준비를 각각 확인하는 일입니다.

가상의 운영팀이 가져온 파일을 다시 보겠습니다. 업무 객체(object)와 관계(relation)의 의미, 업무 상태(workflow state), 권한 정책과 업무 규칙(business rule)은 어디에 담겨 있을까요? 실행 이력과 사람이 처리하던 예외까지 새 환경에서 표현할 수 있을까요?

확인할 대상은 파일의 존재를 넘어 **업무의 의미와 상태, 권한, 데이터 품질, 사용자 절차**까지 이어집니다.

## 데이터를 옮겼다면, 이제 서비스가 움직이는지 볼 차례입니다

Homes for Ukraine의 전환은 이 간격을 실제 작업으로 메웠습니다. MHCLG Digital 팀은 기존 운영 데이터를 옮기면서 단계적 이관(phased migration), 품질 대조, 보안 검증(security assurance), 사용자 조사와 교육(training)을 진행했다고 설명합니다. ([MHCLG Digital](https://mhclgdigital.blog.gov.uk/2026/04/09/from-emergency-to-sustainability-creating-share-homes-for-ukraine-data/))

이 사례에서 확인한 전환 과제를 운영팀의 실행 순서로 풀면 다음과 같습니다. 정부가 발표한 표준 절차를 그대로 옮긴 것이 아니라, 전환 준비를 점검하기 위한 분석용 흐름입니다.

```text
데이터 export
→ 새 schema와 업무 규칙에 적재
→ old/new 상태 reconciliation
→ 권한·보안 검증
→ 제한 사용자 전환
→ 서비스 cutover
→ 운영 결과 재측정
```

내보내기는 이 경로의 출발점입니다. 상태 대조나 권한 검증이 빠진 채 새 시스템을 켜면, 데이터를 옮겨 놓고도 같은 서비스를 운영하지 못하는 틈이 생깁니다. 특히 운영 AI나 Ontology 기반 시스템에서는 **업무 객체, 상태, 관계, action과 permission**이 함께 움직이므로 이 틈이 더 중요해질 수 있습니다.

서비스를 옮기고 계약까지 끝냈다면 이제 모든 검증이 끝난 걸까요? 아직 비용과 품질이라는 질문이 남아 있습니다.

> [!important] Exit 성공은 비용 우위를 자동으로 증명하지 않습니다
> MHCLG Digital 팀은 Share 전환 뒤 연간 수백만 파운드 규모의 running cost 절감을 보고했습니다. 하지만 공개 자료에는 동일 scope로 정규화한 상세 총소유비용(TCO, Total Cost of Ownership), 내부 인력 비용, 일회성 migration 비용과 독립 감사가 없습니다. 따라서 이 숫자를 `Palantir은 일반적으로 더 비싸다`거나 `in-house가 항상 싸다`는 결론으로 확대하면 안 됩니다. ([MHCLG Digital](https://mhclgdigital.blog.gov.uk/2026/04/09/from-emergency-to-sustainability-creating-share-homes-for-ukraine-data/))

새 시스템을 만들 무렵에는 요구사항이 안정되고 사용자 연구와 운영 경험도 쌓여 있었습니다. 공급자 가격이 달라진 효과와 범위(scope)를 바꾼 효과, 내부 역량과 기술 선택의 효과를 공개 자료만으로 따로 계산하기는 어렵습니다.

전환 완료와 비용 우위의 입증은 같은 결승선이 아닙니다.

## 성공과 실패를 한 칸에 적으면 놓치는 것들

어떤 플랫폼은 큰 운영 가치를 주면서 교체 비용도 높을 수 있습니다. 이를 성공이나 실패 중 하나로만 표시하면 다음 결정에 필요한 정보가 사라집니다. 네 질문에 각각 답을 남기는 편이 낫습니다.

| 질문               | 확인하려는 것                          | 혼동하면 생기는 오류                         |
| ------------------ | -------------------------------------- | -------------------------------------------- |
| Workflow value     | 지금 실제 업무에 어떤 가치를 주는가    | 가치가 있으면 장기 계약도 자동으로 맞다고 봄 |
| Switching friction | 바꿀 때 어떤 비용·위험이 생기는가      | 마찰이 크면 exit가 불가능하다고 봄           |
| Exit capability    | 조직이 실제 전환을 실행할 수 있는가    | export 기능만 있으면 준비됐다고 봄           |
| Post-exit evidence | 전환 뒤 비용·품질·업무 결과가 어땠는가 | 운영비 한 항목만으로 전체 TCO를 결론 냄      |

![Workflow value, switching friction, exit capability와 post-exit evidence가 서로 다른 판단 축이며 어느 하나도 나머지를 대신하지 않는다는 비교 지도](../../attachments/palantir-platform-exit-readiness/palantir-platform-exit-readiness-figure-03.png)

현재 플랫폼을 계속 쓰면서도 데이터·업무 규칙·사람·계약 인수 계획을 마련해 전환 실행 능력을 유지할 수 있습니다. 당장 떠나지 않는다는 사실만으로 전환 능력이 없다고 판단할 수는 없습니다.

반대로 해지 절차가 간단하고 데이터를 다운로드할 수 있어도, 대체 시스템을 마련하는 시간(replacement lead time)이 길고 서비스 연속성(continuity)을 검증하지 못했다면 전환 준비도는 낮을 수 있습니다. 문이 쉽게 열린다고 업무까지 곧바로 옮겨지는 것은 아닙니다.

## 거대한 이전 계획 전에 업무 하나를 밖에서 돌려 보십시오

전사 migration을 미리 수행할 필요는 없습니다. 도입 초기에 작은 **exit drill**, 즉 전환 예행연습을 해보는 방법을 제안합니다. 이는 연구에서 도출한 설계 제안이며, 실제 Palantir tenant에서 검증한 표준 절차는 아닙니다.

가상의 운영팀이 여러 공장의 품질 데이터를 플랫폼에 묶으려 한다고 해보겠습니다. 처음에는 다운로드 기능만 확인했습니다. 이번에는 첫 실제 운영(production)에 들어가기 전, 그 파일로 플랫폼 밖에서 업무 하나를 재현해 봅니다.

1. 대표적인 업무 객체와 이력 일부를 실제 export합니다.
2. 외부의 작은 중립 schema에서 원래 의미를 복원할 수 있는지 확인합니다.
3. 플랫폼 밖에서 최소 read-only workflow 하나를 다시 실행해 봅니다.
4. 원본과 대체 경로의 레코드 수, 핵심 상태와 권한을 대조합니다.
5. 어느 자산이 공급자 전용이고 어느 자산이 조직 소유인지 기록합니다.
6. 전환에 필요한 사람, 승인, 교육과 service-continuity 작업을 추정합니다.

여기서 실패한 항목은 나중의 전환 작업이 숨어 있는 자리입니다. 파일은 나왔는데 상태를 맞출 수 없다면 상태 대조를, 권한을 복원할 수 없다면 정책 이전을 준비해야 합니다. 사용자가 다음 작업을 찾지 못한다면 교육과 업무 절차도 인수 대상입니다.

곧 떠나겠다고 선언하려는 실험은 아닙니다. 아직 손볼 여지가 있을 때, 나중에 무엇이 발목을 잡을지 찾는 연습입니다.

## 출구를 준비하는 비용까지 감당할 가치가 있을까요

통합이 깊어질수록 전환 준비에 드는 비용도 커질 수 있습니다. 이제 판단은 다시 도입의 가치로 돌아옵니다. 그 준비 비용까지 감수할 만큼 통합이 필요한가요?

여러 workflow가 같은 데이터와 권한, 업무 객체를 재사용한다면 통합 플랫폼이 운영 복잡도를 줄일 수도 있습니다. 항상 얇은 stack이 낫다고 결론 낼 수는 없습니다. 현재 연구에는 이 총비용을 동일 조건으로 비교한 실험이 없습니다.

다음 조건에서는 더 얇은 기준 구성(baseline)을 먼저 검토할 만합니다.

- 읽기 전용 dashboard나 문서 검색이 중심입니다.
- 실제 write action과 복잡한 승인 흐름이 없습니다.
- 업무 객체와 관계를 여러 use case가 재사용하지 않습니다.
- 데이터 이동성과 공급자 교체 가능성이 핵심 요구입니다.
- 팀이 Ontology·permission·workflow를 장기 유지할 운영 역량이 없습니다.

반대로 여러 부서가 같은 operational model을 쓰고 action·approval·evaluation·observability를 일관되게 연결해야 한다면 통합의 가치가 커질 수 있습니다. 이때도 전환 준비를 포기할 이유는 없습니다. 지금 얻는 통합의 이득과 나중에 치를 전환 비용을 같은 수명주기(lifecycle)의 서로 다른 항목으로 기록하면 됩니다.

## 마지막에 확인할 것은 다음 날 아침의 업무입니다

Homes for Ukraine의 기록에는 긴급 도입의 가치, 교체를 미룰 만큼 컸던 위험, 실제 데이터·업무 이전과 계약 종료가 함께 남아 있습니다. `Palantir 성공`이나 `Palantir 실패` 한 단어로는 그 시간에 따라 달라진 선택을 담을 수 없습니다.

운영 가치, switching friction, exit capability와 post-exit evidence에 각각 답을 남겨야 합니다. 전환을 한 번 마쳤다고 해서 모든 조직의 락인 문제가 사라지는 것도, 전환 뒤 총비용과 품질이 모두 증명되는 것도 아닙니다.

플랫폼을 검토할 때 `이 플랫폼으로 무엇을 더 잘할 수 있는가` 옆에 `다른 실행 환경으로 옮기려면 무엇이 필요한가`를 적어 보십시오. 데이터·업무 의미·권한·사용자를 넘겨받을 방법에 빈칸이 많다면, 전환 준비도는 아직 증명되지 않았습니다.

시작은 작아도 됩니다. 대표 데이터와 읽기 전용 workflow 하나를 꺼내, 외부 환경에서 의미와 상태를 복원하고 원본과 대조해 보십시오. 계약서에서 출구를 찾은 다음에는 실제 업무가 그 문밖에서도 돌아가는지 확인할 차례입니다.

**계약을 끝내도 다음 날 업무는 계속될까요? 그 질문에 답할 근거를, 잘 쓰고 있을 때부터 남겨 두십시오.**

## 함께 읽기

- [[notes/온톨로지/palantir-case-evidence-receipt|29. 팔란티어 실사용 사례를 읽는 법]]
- [[notes/온톨로지/palantir-foundry-aip-operational-loop|28. 팔란티어 AIP는 왜 기업용 챗봇이 아닌가]]
- [[notes/온톨로지/agent-evaluation-evidence-ladder|24. 합성 검사를 통과한 에이전트는 왜 아직 검증되지 않았는가]]

## 참고 자료

- National Audit Office, [Investigation into the Homes for Ukraine scheme](https://www.nao.org.uk/reports/investigation-into-the-homes-for-ukraine-scheme/)
- Ministry of Housing, Communities and Local Government, [Homes for Ukraine system change survey](https://consult.communities.gov.uk/digital-delivery/homes-for-ukraine-new-platform-survey/)
- MHCLG Digital, [From emergency to sustainability: creating Share Homes for Ukraine data](https://mhclgdigital.blog.gov.uk/2026/04/09/from-emergency-to-sustainability-creating-share-homes-for-ukraine-data/)
- Palantir, [Global Branching core concepts](https://www.palantir.com/docs/foundry/global-branching/core-concepts)
- Palantir, [June 2026 announcements — Global Branch lifecycle features](https://www.palantir.com/docs/foundry/announcements/2026-06)

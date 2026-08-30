---
title: "29. 팔란티어 실사용 사례를 읽는 법: 도입과 효과를 분리하는 증거 영수증"
description: "83% 감소, 연간 10,000~15,000시간 절감 전망, NHS의 관찰 지표는 같은 종류의 성과가 아닙니다. Panasonic, Tampa General, SOMPO, Ursa Major, NHS, Airbus 사례를 production 사용과 효과 증거로 분리해 읽는 증거 영수증을 제안합니다."
date: 2026-08-30
tags:
  - 팔란티어
  - Foundry
  - AIP
  - 온톨로지
  - AI에이전트
---

![팔란티어 실사용 사례를 운영 결정, 사용 상태, 효과 증거, 귀속 한계와 비교 기준으로 읽는 증거 영수증](../../attachments/palantir-case-evidence-receipt/palantir-case-evidence-receipt-infographic.png)

83% 감소. 연간 10,000~15,000시간 절감. 그리고 “전후 변화만으로 인과를 말할 수 없다”는 방법론. 셋 다 Palantir 실사용 사례를 읽다가 만나는 문장인데, **증거의 종류는 전혀 다릅니다.** Tampa General Hospital은 환자 배치 관리 시간 83% 감소를 보고했고, Ursa Major는 엔지니어링 시간 절감을 **전망**했으며, NHS는 실제 운영 지표를 공개하면서도 자체 방법론에서 다른 변수를 통제하지 못했다고 선을 긋습니다. ([Tampa General Hospital](https://www.tgh.org/news/tgh-press-releases/2024/june/tgh-selects-palantir-ai-software-connected-care-coordination), [Ursa Major](https://ursamajor.com/media/blog/how-ursa-major-and-palantir-are-solving-manufacturing-challenges-at-hypersonic-speeds/), [NHS England methodology](https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/impact/fdp-uptake-and-benefits/methodology-uptake-and-benefits-information/))

숫자만 떼어 놓으면 모두 “성과”처럼 보입니다. 출처의 동사를 따라가면 정체가 갈립니다. 하나는 고객이 보고한 운영 지표이고, 하나는 미래 projection이며, 다른 하나는 외부 요인을 통제하지 않은 관찰 비교입니다. 그렇다면 고객 사례에서 무엇을 믿어야 할까요? 답은 더 큰 숫자를 찾는 데 있지 않습니다. **그 숫자가 어떤 업무에서, 누구의 보고로, 어떤 비교 조건 아래 나왔는지 복원하는 것**에 있습니다.

> [!summary] 먼저 결론
> Palantir 사례를 `도입됨 → 사용됨 → 효과가 남 → Palantir이 원인임`이라는 한 줄로 읽으면 중요한 단서가 사라집니다. 한 사례를 **운영 결정, 실제 사용 상태, 효과 증거 수준, 동시 개입, 비교 기준**으로 나눠 적으면, 고객 사례는 홍보 숫자가 아니라 다음 검증을 설계할 수 있는 의사결정 재료가 됩니다.

## 숫자보다 먼저 “무슨 결정을 바꿨는가”를 봅니다

Palantir의 공식 use-case 문서는 기술이나 데이터 소스보다 먼저 특정 사용자의 **운영 결정과 결과(outcome)**를 정하라고 설명합니다. 이후 필요한 데이터를 연결하고, 조직의 객체와 업무 과정을 모델링하고, 사용자가 결정을 내릴 인터페이스와 결과 기록을 붙입니다. ([Delivering a use case](https://www.palantir.com/docs/foundry/getting-started/delivering-a-use-case), [Use case lifecycle](https://www.palantir.com/docs/foundry/use-case-life-cycle/overview))

이 관점으로 공개 사례를 다시 쓰면 산업 이름보다 업무 장면이 먼저 보입니다.

| 조직                   | 공개 자료에서 보이는 운영 결정                                        | 공개된 사용 방식                                                                                     |
| ---------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Panasonic Energy       | 공장 waste·scrap·line uptime을 어떻게 줄일 것인가                     | 공장 edge sensor와 분산 데이터를 Foundry에 연결하고 수작업·ticket 중심 업무를 운영 소프트웨어로 전환 |
| Tampa General Hospital | 환자 배치·PACU·패혈증·병상 흐름을 어떻게 조정할 것인가                | Foundry에서 시작해 12개 이상의 use case로 확장하고 AIP를 care-coordination workflow에 추가           |
| SOMPO Japan            | 고손해율 기업 화재보험 계약을 어떻게 찾고 조건을 조정할 것인가        | 내부·외부 데이터를 통합하고 Foundry를 underwriting의 주요 시스템으로 사용                            |
| Ursa Major             | 설계 변경·작업 지시·품질 정보를 생산 현장에 어떻게 연결할 것인가      | Ontology 기반 MES로 engineering·supply chain·production·testing을 연결                               |
| NHS FDP                | 대기 목록·수술실·퇴원·암 진료 정보를 현장 조치로 어떻게 연결할 것인가 | Trust·ICB별 instance와 여러 운영 solution, analytics, data warehouse를 결합                          |
| Airbus Skywise         | 정비·부품·센서·운항 데이터를 어떻게 묶어 fleet 판단을 도울 것인가     | 항공기 운영 데이터를 공통 플랫폼에 연결해 predictive maintenance와 reliability 업무에 사용           |

여기서는 “AI”라는 단어가 오히려 뒤로 물러납니다. 반복되는 것은 **정해진 운영 문제, 필요한 데이터, 업무 객체, 현장 사용자와 실제 조치**입니다. 28번 글에서 [[notes/온톨로지/palantir-foundry-aip-operational-loop|Foundry·Ontology·AIP의 운영 루프]]가 기능의 책임 지도를 보여 줬다면, 이번에는 그 지도가 실제 사례에서 어디까지 도달했고 어디서부터 증거가 얇아지는지를 추적합니다.

## 첫 번째 단서: 실제로 어디까지 쓰였나

“도입했다”는 말도 네 가지로 갈립니다. 발표만 된 계획과, 제한된 pilot과, production workflow와, 여러 업무로 확장된 운영은 같은 상태가 아닙니다. 그래서 프로젝트 연구에서는 사용 상태를 U0~U3으로 분리했습니다. 이 분류는 Palantir의 공식 등급이나 업계 표준이 아니라, 공개 사례를 같은 기준으로 읽기 위한 내부 도구입니다.

| 단계 | 뜻                   | 최대한 안전한 표현                       |
| ---- | -------------------- | ---------------------------------------- |
| U0   | 발표·계획            | 도입 또는 사용 계획이 발표됐습니다       |
| U1   | prototype·pilot      | 제한된 시험이 진행됐습니다               |
| U2   | production use       | 실제 workflow에서 운영되고 있습니다      |
| U3   | multi-workflow scale | 여러 workflow나 조직 단위로 확장됐습니다 |

이 축이 답하는 질문은 단순합니다. **“이 시스템이 진짜 업무 안으로 들어갔는가?”** 여기까지는 고객 자료도 꽤 강한 증거가 될 수 있습니다. 실제 workflow, 사용자, 데이터 연결, 확장 범위가 구체적으로 드러나기 때문입니다.

하지만 다음 질문은 완전히 다릅니다.

## 두 번째 단서: 좋아진 결과를 누구에게 얼마나 귀속할 수 있나

제품이 실제 업무에 쓰인다는 사실과 **제품 때문에 결과가 좋아졌다는 사실**은 다른 주장입니다. 효과 증거는 E0~E4로 따로 읽었습니다.

| 단계 | 뜻                                  | 최대한 안전한 표현                               |
| ---- | ----------------------------------- | ------------------------------------------------ |
| E0   | 기대·launch statement               | 기대 효과가 제시됐습니다                         |
| E1   | projection·제한된 초기 결과         | 전망 또는 초기 신호가 제시됐습니다               |
| E2   | 고객·공급자 운영 지표               | 해당 조직이 운영 결과를 보고했습니다             |
| E3   | 방법이 공개된 관찰 비교·독립 검토   | 관찰 범위와 반대 결과를 함께 비교할 수 있습니다  |
| E4   | 통제군·준실험·무작위화 등 인과 식별 | 정의한 조건에서 제품 기여도를 논의할 수 있습니다 |

![사용 상태 U0~U3과 효과 증거 E0~E4를 분리하고 여섯 사례가 서로 다른 위치에 놓인다는 점을 보여주는 2축 지도](../../attachments/palantir-case-evidence-receipt/palantir-case-evidence-receipt-figure-01.png)

검토한 여섯 핵심 사례에서는 **E4에 해당하는 공개 인과 평가를 확인하지 못했습니다.** 그렇다고 사례가 쓸모없다는 뜻은 아닙니다. U3/E2는 “여러 workflow에서 실제 사용되며 고객이 운영 지표를 보고했다”는 강한 운영 근거가 될 수 있습니다. 다만 그 문장을 “제품이 그 개선을 일으켰다”로 바꾸는 순간 증거의 문턱이 달라집니다.

이 구분은 [[notes/온톨로지/agent-evaluation-evidence-ladder|에이전트 평가의 주장 상한]]과도 같습니다. 합성 테스트가 production 신뢰성을 대신하지 않듯, production 사용도 독립적인 인과 효과를 자동으로 증명하지 않습니다.

## 이제 여섯 사례를 같은 영수증 위에 올려봅니다

기능 수나 산업의 화려함을 잠시 지우고 같은 질문만 반복하면, 사례의 강점과 빈칸이 동시에 보입니다.

| 사례             | 사용 상태 | 효과 증거 | 무엇을 확인할 수 있나                                                                          | 무엇을 아직 말할 수 없나                                    |
| ---------------- | --------- | --------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Panasonic Energy | U3        | E2        | 공장 데이터 통합과 여러 운영 use case, 고객이 보고한 waste·scrap 감소와 uptime 증가            | 구체 baseline·산정식·대조군이 없어 Foundry의 독립 효과 크기 |
| Tampa General    | U3        | E2        | Foundry에서 12개 이상 use case로 확장, AIP care-coordination workflow, 고객이 보고한 정량 변화 | C3의 GE Healthcare·내부 process 변화와 Palantir 순기여 분리 |
| SOMPO Japan      | U3        | E2        | Foundry 기반 underwriting과 여러 해의 고객 연차보고서                                          | pricing·상품·process reform과 Palantir의 순기여             |
| Ursa Major       | U2        | E1        | Ontology 기반 MES가 실제 운영되고 있음을 고객이 설명                                           | 10,000~15,000시간 절감 전망의 실제 연간 달성치와 독립 검증  |
| NHS FDP          | U3        | E3        | 대규모 운영, 공개 방법론, 독립 분석과 규제기관 검토를 함께 비교 가능                           | 관찰된 전후 변화가 FDP의 인과 효과라는 결론                 |
| Airbus Skywise   | U3        | E2        | 2017년부터 이어진 항공 데이터 플랫폼과 정비·reliability workflow                               | testimonial 수치를 일반 고객 효과나 현재 AIP 효과로 일반화  |

이 표의 목적은 여섯 조직을 줄 세우는 데 있지 않습니다. 핵심은 **사용 증거가 강한 사례와 효과 귀속이 강한 사례가 같은 축에 있지 않다**는 데 있습니다. 이제 숫자의 정체가 가장 극적으로 달라지는 세 사례부터 보겠습니다.

## 83%라는 숫자는 강합니다. 그래서 출처를 더 봐야 합니다

Tampa General Hospital은 2024년 Palantir과의 확대 협력을 발표하며 2021년 한 Foundry use case에서 시작해 12개 이상의 use case로 확장했다고 설명했습니다. 발표에는 환자 배치 관리 시간 83% 감소, PACU hold 28% 감소, sepsis 평균 재원일 30% 감소 같은 수치가 들어 있습니다. ([Tampa General Hospital, 2024](https://www.tgh.org/news/tgh-press-releases/2024/june/tgh-selects-palantir-ai-software-connected-care-coordination))

여기까지만 읽으면 이야기는 거의 끝난 것처럼 보입니다. 하지만 83% 옆에 출처와 동시 개입을 붙이면 결론이 달라집니다. 병원 전체의 Care Coordination Center는 Palantir만으로 구성되지 않았습니다. Tampa General의 프로그램 페이지와 후속 자료에는 GE Healthcare를 포함한 여러 운영 체계와 개입이 함께 나타납니다. ([TGH Care Coordination Center](https://www.tgh.org/about-tgh/care-coordination-center))

그래서 증거 영수증에는 숫자 옆에 반드시 두 줄이 붙어야 합니다.

```text
source_owner: Tampa General Hospital
attribution_boundary: 다중 운영 개입, 공개 통제군·산정식 없음
```

이 두 줄이 없으면 83%는 “Palantir이 만든 효과”처럼 읽히기 쉽습니다. 붙여 놓으면 더 정확한 문장이 됩니다. **Tampa General이 Palantir partnership을 포함한 운영 변화에서 해당 지표 개선을 보고했다.** 숫자가 작아진 것이 아니라, 주장의 경계가 선명해진 것입니다.

## 단어 하나가 15,000시간의 정체를 바꿉니다: projected

Ursa Major는 Ontology와 AIP를 사용한 manufacturing execution system을 실제 propulsion program에 운영하고 있다고 설명합니다. Engineering drawing과 PDF에서 digital workflow를 만들고, production·quality·supply-chain 정보를 연결하는 구체적인 장면도 공개했습니다. ([Ursa Major, 2025](https://ursamajor.com/media/blog/how-ursa-major-and-palantir-are-solving-manufacturing-challenges-at-hypersonic-speeds/))

같은 글에는 연간 10,000~15,000시간이라는 인상적인 숫자가 나옵니다. 그런데 그 숫자 앞의 동사가 중요합니다. 몇 달간 배포한 도구가 그만큼의 engineering time을 절약할 것으로 **projected**한다고 적혀 있습니다. 실제 1년의 누적 절감 시간을 사후 측정했다는 문장이 아닙니다.

![Tampa General의 고객 보고 운영 지표, Ursa Major의 미래 projection, NHS의 관찰 비교·독립 검토를 서로 다른 증거 유형으로 나눈 비교 도판](../../attachments/palantir-case-evidence-receipt/palantir-case-evidence-receipt-figure-02.png)

따라서 Ursa Major는 `U2 / E1`로 읽는 편이 안전합니다. Production 사용의 구체성은 높지만 절감 시간은 아직 전망입니다. **“production에서 쓰인다”와 “예상한 절감이 실현됐다”는 서로 다른 문장**입니다. 둘을 분리하면 사례의 강점은 그대로 남고, 과장만 빠집니다.

## 가장 흥미로운 사례는 가장 예쁜 숫자를 가진 사례가 아닐 수 있습니다

NHS Federated Data Platform은 Trust와 Integrated Care Board가 각자의 instance와 data-controller 책임을 갖고 waiting list, discharge, theatre, cancer 같은 workflow를 운영하도록 설계됐습니다. NHS Digital은 2024년부터 서비스가 live라고 설명하며, 사용은 의무가 아니라고 명시합니다. ([NHS Federated Data Platform](https://digital.nhs.uk/services/federated-data-platform))

이 사례가 특별한 이유는 긍정적인 숫자가 커서가 아닙니다. 오히려 **방법론의 한계와 반대 근거까지 공개돼 있기 때문**입니다. NHS의 benefit methodology는 주요 지표가 전후 비교이며 다른 변수를 통제하지 못했으므로 cause-and-effect를 결론 낼 수 없다고 밝힙니다. 2026년 Health Foundation 분석은 OPTICA를 사용하는 Trust에서 비교 대상보다 측정 가능한 퇴원 성과 개선을 찾지 못했다고 보고했고, Office for Statistics Regulation은 이 분석과 NHS의 benefit metric 제시·인과 caveat를 함께 검토했습니다. ([NHS methodology](https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/impact/fdp-uptake-and-benefits/methodology-uptake-and-benefits-information/), [Health Foundation analysis via OSR](https://osr.statisticsauthority.gov.uk/correspondence/jennifer-dixon-to-ed-humpherson-health-foundation-analysis-of-the-impact-of-the-optimised-patient-tracking-and-intelligent-choices-application/), [OSR statement](https://osr.statisticsauthority.gov.uk/news/nhs-england-federated-data-platform-fdp-presentation-and-communication-of-information-and-performance-metrics/))

여기서도 반전은 과장해서 읽으면 안 됩니다. 이 자료는 “FDP가 효과가 없다”는 보편 결론을 주지 않습니다. 특정 discharge tool과 공개된 관찰 범위에서 긍정적인 인과 해석에 제동을 겁니다. 그래서 NHS는 `U3 / E3`의 좋은 예입니다. 실제 사용과 독립 검토가 모두 존재하지만, 인과 효과는 여전히 별도 질문입니다.

## 오래 썼다는 사실도 인과의 마지막 빈칸을 채우지는 못합니다

Tampa, Ursa, NHS가 숫자의 종류를 보여 줬다면 SOMPO, Panasonic, Airbus는 **시간축과 동시 개입**이라는 다른 함정을 보여 줍니다.

### SOMPO: 기록이 여러 해 쌓여도 counterfactual은 남습니다

SOMPO의 2022 연차보고서는 Foundry를 기업 화재보험 underwriting의 주요 시스템으로 사용하고, 내부·외부 데이터를 통합해 이전에 놓치던 고손해율 계약을 찾아 가격과 인수 조건을 재검토했다고 설명합니다. 이어지는 연차보고서도 데이터 기반 underwriting과 수익성·생산성 개선을 연결합니다. ([SOMPO 2022](https://www2.sompo-hd.com/en/ir/data/annual/online2022/cycle-new/), [SOMPO 2023](https://www2.sompo-hd.com/en/ir/data/annual/online2023/resilience/))

이 사례는 일회성 발표보다 강합니다. 여러 해의 고객 연차보고서에 실제 운영 방식이 반복해서 등장하기 때문입니다. 동시에 SOMPO는 pricing 조정, 상품·underwriting reform, 생산성 개선을 함께 추진했습니다. 장기간 관찰했다는 이유만으로 소프트웨어 한 요소의 순기여가 자동 분리되지는 않습니다. 영수증의 `duration`은 강해졌지만 `counterfactual`은 여전히 비어 있습니다.

### Panasonic: 운영 변화는 구체적이지만 baseline은 제한적입니다

Panasonic Energy는 Foundry로 공장 edge sensor와 분산 데이터를 연결하고 수작업·ticket 중심의 업무를 여러 운영 use case로 전환했다고 발표했습니다. 고객 발표는 제조 waste와 material scrap 감소, line uptime 증가를 보고하지만 공개된 baseline과 측정 방법은 제한적입니다. ([Panasonic Energy, 2023](https://na.panasonic.com/news/palantir-and-panasonic-energy-of-north-america-sign-multi-year-agreement))

이 사례는 “어떤 운영 문제가 바뀌었는가”를 이해하는 데 강합니다. 반면 정확한 독립 효과 크기를 말하려면 산정식과 비교 조건이 더 필요합니다.

### Airbus: 오래된 Foundry 성과를 현재 AIP 성과로 옮기면 시간축이 사라집니다

Airbus의 Skywise는 2017년 Palantir과 함께 시작됐습니다. Airbus는 work order, spare consumption, aircraft configuration, sensor와 flight schedule 같은 데이터를 연결해 predictive maintenance와 fleet reliability에 쓰겠다고 발표했습니다. 현재 Skywise 자료에는 고객 testimonial 형태의 시간·정비 절감 수치도 있습니다. ([Airbus, 2017](https://www.airbus.com/en/newsroom/press-releases/2017-06-airbus-launches-skywise-aviations-open-data-platform), [Skywise Core](https://www.skywise.com/en/digital-platform/skywise-core))

중요한 경계는 이것입니다. **AIP가 일반 제공되기 전부터 축적된 Foundry-era 결과를 현재 AIP의 고유 효과로 옮겨 적으면 안 됩니다.** AIP가 무엇을 추가했는지 보려면 같은 workflow에서 Foundry-only 상태와 AIP-added 상태를 따로 비교해야 합니다.

## 사건을 끝내기 전에 한 장의 증거 영수증을 남깁니다

U와 E는 빠른 분류에 유용하지만 두 숫자만으로는 부족합니다. 28번 글의 운영 control surface와 이번 사례 연구의 증거 등급을 합치면, 다음 여섯 칸이 더 실용적입니다.

```yaml
case_evidence_receipt:
  operational_decision: 어떤 반복 업무 결정을 바꾸는가
  workflow_surface: 데이터 조회부터 실제 action·outcome까지 어디까지 연결됐는가
  usage_state: U0 | U1 | U2 | U3
  effect_evidence: E0 | E1 | E2 | E3 | E4
  attribution_boundary: 동시에 바뀐 process·사람·다른 공급자는 무엇인가
  counterfactual: baseline·비교군·통제 조건이 있는가
```

![실제 제품 도입 전에 운영 결정, workflow 범위, 사용 상태, 효과 증거, 귀속 한계와 counterfactual을 한 장에 기록하는 Case Evidence Receipt](../../attachments/palantir-case-evidence-receipt/palantir-case-evidence-receipt-figure-03.png)

여기에 필요하면 `delivery`, `cost`, `exit readiness` 같은 필드를 더할 수 있습니다. 다만 공개 자료가 없으면 빈칸을 그대로 남겨야 합니다. **빈칸은 실패가 아니라 아직 증명되지 않은 부분**입니다.

이 영수증을 채우면 사례를 좋다·나쁘다로 성급하게 분류할 필요가 없습니다. Tampa General은 production 규모와 고객 보고가 강하지만 attribution이 약합니다. Ursa Major는 workflow가 구체적이지만 효과 숫자는 projection입니다. NHS는 운영 규모와 독립 검토가 함께 있지만 긍정적 인과 결론은 닫히지 않았습니다. 같은 표에서 강점과 한계를 동시에 볼 수 있습니다.

## “우리도 저렇게 될까?”는 가장 작은 실험으로 바꿔야 합니다

고객 사례를 본 뒤 곧바로 “우리도 30% 줄일 수 있을까?”라고 묻는 대신, 한 업무 결정으로 범위를 좁히는 편이 낫습니다.

가정해 보겠습니다. 제조 조직이 불량 원인을 찾는 시간을 줄이고 싶다고 하겠습니다. 첫 실험은 전체 공장 digital twin을 만드는 일이 아닙니다.

```text
운영 결정
어떤 품질 이슈를 누가 언제 escalation할 것인가

baseline
현재 탐지 시간·재작업·false positive·review time

필요한 context
설비·lot·작업 지시·검사·변경 이력·권한

제안 workflow
관련 상태 조회 → 근거 제시 → action 후보 → 사람 검토

측정
같은 기간·난이도의 기존 workflow와 결과 비교

중단 조건
오탐·review burden·data quality·permission 문제가 기준을 넘으면 확장 중단
```

이 정도면 처음부터 Foundry·Ontology·AIP 전체를 도입하지 않아도 됩니다. 기존 BI·workflow tool·RAG 같은 더 얇은 baseline으로 먼저 측정한 뒤, 데이터와 업무 객체를 재사용해야 할 use case가 늘 때 통합 구조의 비용을 비교할 수 있습니다.

Palantir의 공식 방법론도 하나의 use case와 measurable outcome에서 시작합니다. 다만 “작게 시작한다”는 말 자체가 ROI를 보장하지는 않습니다. 다음 단계로 갈 기준을 미리 정해야 실험이 영구적인 pilot이 되지 않습니다.

## 다 읽고도 헷갈린다면, 이 다섯 등식부터 끊습니다

```text
도입 발표 = 실제 사용
실제 사용 = 정량 효과
전후 변화 = 제품 단독 인과
고객 보고 = 독립 검증
AIP 이전 Foundry 성과 = AIP의 추가 효과
```

이 등식만 끊어도 사례 해석의 상당 부분이 정리됩니다. 제품 기능을 설명하는 문서, 고객이 보고한 운영 결과, 독립 분석과 실제 인과 평가는 각각 다른 질문에 답하기 때문입니다.

그렇다고 고객 사례를 모두 “마케팅”이라고 버리는 것도 정보 손실입니다. 고객 자료는 어떤 데이터를 연결했고 어떤 사용자가 어떤 workflow에서 제품을 썼는지 파악하는 데 매우 유용합니다. 다만 **그 자료가 답할 수 없는 질문까지 대신 답하게 하지 않으면 됩니다.**

## 최종 판단: 큰 숫자보다 빈칸을 먼저 보십시오

여섯 사례를 함께 보면 Palantir Foundry·AIP의 반복 패턴은 “큰 LLM을 붙여서 성과를 낸다”보다 구체적입니다. 조직은 환자 배치, 보험 인수, 공장 품질, 정비 판단처럼 반복되는 운영 결정을 정하고, 필요한 데이터를 연결하고, 업무 객체와 상태를 맞추고, 현장 사용자가 실제 task나 action으로 이어가게 합니다. 그 뒤에야 결과를 측정할 수 있습니다.

하지만 **운영 구조가 구체적이라는 사실과 제품 효과가 인과적으로 검증됐다는 사실은 다릅니다.** 검토한 공개 핵심 사례에는 E4 수준의 인과 평가가 없었습니다. 고객이 보고한 큰 숫자, 장기간 production 사용, 독립 기관의 반론은 모두 가치 있는 증거지만 역할이 다릅니다.

그래서 새 공급자나 Agent 플랫폼의 성공 사례를 볼 때는 “얼마나 큰 숫자인가?”보다 먼저 한 장의 증거 영수증을 채워 보는 편이 낫습니다. `무슨 결정을 바꿨는가`, `실제로 어디까지 production에 들어갔는가`, `효과 수치는 누가 보고했는가`, `동시에 무엇이 바뀌었는가`, `비교 기준은 있는가`.

이 칸들이 비어 있다면 숫자가 커도 아직 구매 근거는 약합니다. 반대로 칸들이 선명하다면 작은 사례라도 다음 검증을 설계할 수 있습니다. **좋은 사례는 가장 화려한 성공담이 아니라, 어디까지 믿어도 되는지 경계가 보이는 사례입니다.**

## 함께 읽기

- [[notes/온톨로지/palantir-foundry-aip-operational-loop|28. 팔란티어 AIP는 왜 기업용 챗봇이 아닌가]]
- [[notes/온톨로지/opencrab-foundry-ontology-reinterpretation|27. OpenCrab은 팔란티어 Foundry의 온톨로지를 어떻게 다시 풀었나]]
- [[notes/온톨로지/agent-evaluation-evidence-ladder|24. 합성 검사를 통과한 에이전트는 왜 아직 검증되지 않았는가]]

## 참고 자료

- Palantir, [Delivering a use case](https://www.palantir.com/docs/foundry/getting-started/delivering-a-use-case)
- Palantir, [Use case lifecycle overview](https://www.palantir.com/docs/foundry/use-case-life-cycle/overview)
- Panasonic North America, [Palantir and Panasonic Energy of North America sign multi-year agreement](https://na.panasonic.com/news/palantir-and-panasonic-energy-of-north-america-sign-multi-year-agreement)
- Tampa General Hospital, [TGH Selects Palantir AI Software for Connected Care Coordination](https://www.tgh.org/news/tgh-press-releases/2024/june/tgh-selects-palantir-ai-software-connected-care-coordination)
- Tampa General Hospital, [TGH Care Coordination Center](https://www.tgh.org/about-tgh/care-coordination-center)
- SOMPO Holdings, [Value Creation Cycle — Advancement and automation of underwriting operations](https://www2.sompo-hd.com/en/ir/data/annual/online2022/cycle-new/)
- SOMPO Holdings, [Further Strengthening Resilience](https://www2.sompo-hd.com/en/ir/data/annual/online2023/resilience/)
- Ursa Major, [How Ursa Major and Palantir are Solving Manufacturing Challenges at Hypersonic Speeds](https://ursamajor.com/media/blog/how-ursa-major-and-palantir-are-solving-manufacturing-challenges-at-hypersonic-speeds/)
- NHS England Digital, [Federated Data Platform](https://digital.nhs.uk/services/federated-data-platform)
- NHS England, [Methods for the published uptake and benefits information](https://www.england.nhs.uk/digitaltechnology/nhs-federated-data-platform/impact/fdp-uptake-and-benefits/methodology-uptake-and-benefits-information/)
- The Health Foundation / Office for Statistics Regulation, [Health Foundation analysis of the impact of OPTICA](https://osr.statisticsauthority.gov.uk/correspondence/jennifer-dixon-to-ed-humpherson-health-foundation-analysis-of-the-impact-of-the-optimised-patient-tracking-and-intelligent-choices-application/)
- Office for Statistics Regulation, [FDP presentation and communication of information and performance metrics](https://osr.statisticsauthority.gov.uk/news/nhs-england-federated-data-platform-fdp-presentation-and-communication-of-information-and-performance-metrics/)
- Airbus, [Airbus launches Skywise — aviation’s open data platform](https://www.airbus.com/en/newsroom/press-releases/2017-06-airbus-launches-skywise-aviations-open-data-platform)
- Airbus, [Skywise Core](https://www.skywise.com/en/digital-platform/skywise-core)

---
title: "31. 온톨로지 표준은 왜 이렇게 많은가"
description: "ISO 704·SKOS·IEC 61360·ISO 23726 IDO·ISO 15926·ISO/IEC 21838을 성숙도 사다리가 아니라 의미 실패별 책임 지도로 읽고, 필요한 최소 표준만 선택하는 방법을 설명합니다."
date: 2026-08-30
tags:
  - 온톨로지
  - 산업데이터
  - 표준
  - 상호운용성
  - 지식그래프
---

![산업 온톨로지 표준을 용어, 지식조직, 속성 사전, 산업 의미 모델, 생애주기 통합, 상위 정렬의 서로 다른 책임으로 나눈 전체 지도](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-infographic.png)

펌프 하나를 옮겼을 뿐인데, 두 시스템이 정말 같은 펌프를 말하는지 확신할 수 없다면 어디서부터 고쳐야 할까요? 한쪽은 `Pump`, 다른 쪽은 `Pumping Equipment`라고 부릅니다. 정격 유량의 단위와 값 영역도 다르고, 정비 시스템의 `Inspection`은 작업을 뜻하지만 다른 시스템에서는 검사 기록 문서를 뜻할 수도 있습니다.

답을 찾으려고 표준 목록을 펼치면 오히려 이름이 더 늘어납니다. ISO 704, SKOS, IEC 61360, ISO 13584, ISO 23726, ISO 15926, ISO/IEC 21838이 한꺼번에 등장합니다. 모두 온톨로지와 가까워 보이지만, 같은 문제를 두고 경쟁하는 대안은 아닙니다.

> [!summary] 표준 이름보다 먼저 실패한 의미 계약을 찾습니다
> **산업 온톨로지 표준은 초급에서 고급으로 올라가는 한 줄짜리 기술 스택이 아니라 서로 다른 상호운용 실패를 맡는 책임 지도에 가깝습니다.** 용어가 깨졌다면 용어를, 속성과 단위가 깨졌다면 사전을, 여러 도메인의 상위 범주가 반복 충돌할 때만 top-level ontology 정렬을 검토하는 식으로 필요한 최소 책임부터 고르는 편이 안전합니다.

## 가장 위험한 오해는 표준을 사다리로 보는 것입니다

처음 보면 다음 순서가 그럴듯합니다.

```text
ISO 704
→ SKOS
→ IEC 61360
→ IDO
→ ISO 15926
→ BFO
```

마치 용어집에서 시작해 더 강한 온톨로지로 올라가는 성숙도 사다리처럼 보입니다. 하지만 공식 범위를 펼치면 이 그림은 바로 깨집니다. [ISO/IEC 21838-1](https://www.iso.org/standard/71954.html)은 domain-neutral top-level ontology의 요구조건을 다루고, [ISO 15926-1](https://www.iso.org/standard/29556.html)은 process plant의 생애주기 정보 통합을 다룹니다. 둘 다 `ontology`라는 단어 근처에 있지만 맡은 일이 다릅니다.

그래서 표준의 높이를 묻기 전에 실패의 종류부터 나눠야 합니다.

| 실제로 깨진 것                        | 먼저 볼 책임             | 대표 표준·규격           |
| ------------------------------------- | ------------------------ | ------------------------ |
| 개념·용어·정의                        | terminology              | ISO 704                  |
| 시소러스·concept scheme·mapping       | knowledge organization   | ISO 25964 + W3C SKOS     |
| property·단위·값 영역·parts family    | property dictionary      | IEC 61360 + ISO 13584-42 |
| 여러 산업 시스템의 공통 의미 기반     | industrial-data ontology | ISO 23726 IDO 평가       |
| 프로세스 플랜트의 장기 생애주기 통합  | lifecycle integration    | ISO 15926 family         |
| 여러 domain ontology의 상위 범주 충돌 | top-level alignment      | ISO/IEC 21838 + 후보 TLO |

처음의 펌프를 이 지도 위에 놓아 보겠습니다. 공급사 카탈로그, 설비 관리 시스템, 정비 시스템, 공정 데이터 플랫폼에 흩어진 같은 장비를 연결한다고 해도 실패는 하나가 아닙니다. 어떤 시스템은 `pump`, 어떤 곳은 `펌프`를 쓰고, `rated flow`의 단위와 값 영역도 다릅니다. 설치·운전·정비 이력을 길게 이어야 하는 시스템도 있습니다.

겉으로는 모두 `펌프 데이터 통합`처럼 보이지만 하나의 OWL 파일로 곧장 해결하려 하면 책임이 섞입니다.

![같은 펌프를 둘러싼 용어 불일치, 속성·단위 충돌, 산업 공통 의미, 생애주기 통합, 상위 범주 정렬 문제를 서로 다른 책임으로 분리한 지도](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-01.png)

```text
이름이 다름
≠ property 정의가 다름
≠ lifecycle 모델이 다름
≠ upper category가 충돌함
```

여기서 글의 중심 질문이 선명해집니다. **어느 표준이 더 강한가가 아니라, 지금 무엇이 깨졌는가?** 이름만 맞추면 되는 프로젝트에 top-level ontology는 과할 수 있습니다. 반대로 여러 팀이 `Process`, `Role`, `Quality`, `Information`을 서로 다르게 모델링해 mapping을 매번 다시 만든다면 단순 용어집만으로는 부족합니다. [[notes/온톨로지/ontology-vs-json-rules|6번 글]]에서 다룬 것처럼 다음 층은 관계 재사용·변경 영향·감사 비용이 추가 복잡성을 정당화할 때 올라가면 됩니다.

## 이름을 맞추면 끝날 것 같았습니다

첫 번째 충돌은 가장 눈에 잘 보입니다. `pump`, `펌프`, `양수기`, `Pumping Equipment`가 섞여 있습니다.

[ISO 704:2022](https://www.iso.org/standard/79077.html)는 terminology work의 원칙과 방법을 다룹니다. object, concept, definition, designation을 구분하고 term과 definition을 어떻게 관리할지 정리합니다. ISO 704를 쓴다고 RDF나 OWL ontology가 만들어지는 것은 아닙니다. 여기서 얻는 것은 **같은 개념을 같은 개념으로 부르기 위한 책임**입니다.

그래서 문자열부터 합치면 위험합니다. 실제 의미 범위가 다른 `Pump`와 `Pumping Equipment`를 같은 label로 정규화하면 검색은 편해져도 충돌은 감춰집니다.

개념이 정리된 뒤에는 vocabulary 사이의 관계가 남습니다. [ISO 25964-2](https://www.iso.org/standard/53658.html)는 서로 다른 thesaurus와 vocabulary 사이의 interoperability와 mapping을 다룹니다. [W3C SKOS](https://www.w3.org/TR/skos-reference/)는 `Concept`, `ConceptScheme`, `prefLabel`, `altLabel`, `broader`, `narrower`, `related`와 mapping property를 RDF/Web에서 표현합니다.

```turtle
@prefix ex: <https://example.org/concept/> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .

ex:pump
  a skos:Concept ;
  skos:prefLabel "펌프"@ko ;
  skos:prefLabel "pump"@en ;
  skos:altLabel "양수기"@ko .
```

이 정도로 문제가 닫힌다면 SKOS vocabulary만으로도 충분할 수 있습니다. 물리적 객체와 정비 과정의 관계까지 강한 공리로 정의할 필요가 없다면 full domain ontology는 아직 필요하지 않습니다.

2026년 8월 30일 현재 [ISO 25964-1 Edition 2](https://www.iso.org/standard/86713.html)는 FDIS 단계입니다. 이 조사에서는 새 edition의 유료 전문 전체를 확보하지 않았으므로 새 규범 조항을 추정하지 않고 **revision이 진행 중이라는 사실**까지만 사용합니다.

그런데 이름을 모두 `펌프`로 맞춘 뒤에도 데이터는 다시 어긋납니다.

## 같은 이름인데 숫자의 뜻이 다릅니다

```text
rated flow = <value>
unit = ?
```

quantity, 단위, 허용 value domain, 적용 class가 다르면 같은 property 이름을 써도 두 값은 그대로 비교할 수 없습니다.

[IEC 61360-1](https://webstore.iec.ch/en/publication/28560)은 property와 associated attribute, technical concept class, data representation 원칙을 다룹니다. [ISO 13584-42](https://www.iso.org/standard/43423.html)는 supplier-independent parts family와 characterization property 구조에 무게를 둡니다.

```text
Pump
├─ rated flow
│  ├─ definition
│  ├─ quantity / unit
│  └─ value domain
└─ nominal pressure
   ├─ definition
   ├─ quantity / unit
   └─ value domain
```

[IEC 61360-7:2024](https://webstore.iec.ch/en/publication/72956)는 cross-domain generic classes와 properties를 제공합니다. 하지만 `cross-domain`이라는 표현만 보고 top-level ontology와 같은 역할로 읽으면 안 됩니다.

```text
cross-domain property dictionary
≠ domain-neutral top-level ontology
```

여기서 패턴이 드러납니다. 이름 문제를 해결했다고 property 문제가 해결되지는 않습니다. property를 정리했다고 여러 산업 시스템의 상위 의미 모델까지 자동으로 생기지도 않습니다.

## 같은 `upper ontology`라는 말이 다른 층을 가리킵니다

ISO/TC 184/SC 4의 ISO 23726 Ontology-based interoperability 계열은 Industrial Data Ontology(IDO)를 foundation으로 둡니다. [ISO/FDIS 23726-3](https://www.iso.org/standard/87560.html)은 IDO를 산업 데이터와 정보, vocabulary, asset model, reference data library에 사용할 OWL ontology로 설명합니다.

2026년 8월 30일 현재 Part 3 IDO는 **FDIS**이고 Parts 1·2·100은 개발 중입니다. 완성된 published stack처럼 다뤄서는 안 됩니다.

반면 ISO/IEC 21838은 domain-neutral top-level ontology를 다룹니다. Part 1은 요구조건이고 구체적인 표준 TLO로 [BFO](https://www.iso.org/standard/74572.html), [DOLCE](https://www.iso.org/standard/78927.html), [TUpper](https://www.iso.org/standard/78928.html)이 있습니다.

![ISO 23726 IDO의 industrial-data foundation과 ISO/IEC 21838의 domain-neutral TLO가 서로 다른 범위에서 domain ontology를 지원하며 같은 층의 단순 대체재가 아님을 보여주는 구조](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-02.png)

```text
IDO의 industrial-data-domain foundation
≠ ISO/IEC 21838의 domain-neutral TLO

ISO/IEC 21838-1
≠ BFO 자체

표준 TLO
≠ BFO 하나뿐
```

이 조사에서는 IDO와 BFO·DOLCE·TUpper 사이의 formal mapping을 구현하거나 reasoner로 검증하지 않았습니다. 어느 쪽이 더 낫다거나 완전히 호환된다고 말하지 않습니다.

TLO의 가치는 `가장 높은 단계`라서 생기지 않습니다. 설비 ontology, 정비 ontology, 조직 ontology가 `Object`, `Process`, `Role`, `Quality`, `Information`을 서로 다르게 해석해 point-to-point mapping을 계속 다시 만들 때 상위 정렬의 재사용 가치가 커집니다. 반대로 한 팀이 관리하는 단일 domain이고 cross-domain query가 거의 없다면 아직 필요하지 않을 수 있습니다.

```text
단일 domain ontology
+ 같은 팀이 관리
+ cross-domain query가 거의 없음
+ 상위 category 충돌이 반복되지 않음

→ JSON / DB schema / SKOS / domain model 기준선을 먼저 유지
```

이 판단은 ISO/IEC 21838의 공식 도입 절차가 아니라 프로젝트의 조건부 권고입니다. BFO·DOLCE·TUpper 생태계를 처음부터 핵심 commitment로 쓰는 프로젝트라면 초기 alignment가 합리적일 수도 있습니다.

## 오래된 표준이라는 인상도 판단을 흐립니다

[ISO 15926-1](https://www.iso.org/standard/29556.html)의 중심 범위는 process plant lifecycle information integration입니다. 일반 기업 ontology의 보편 baseline이라기보다 프로세스 산업에서 engineering·construction·operation·maintenance 정보를 장기간 공유하는 문제에 맞춰 읽어야 합니다.

그리고 이 표준군은 끝난 legacy도 아닙니다. [ISO 15926-100:2026 Vocabulary](https://www.iso.org/standard/89678.html)는 2026년 6월 출판됐고, [ISO/AWI 15926-2 Edition 2](https://www.iso.org/standard/93280.html)는 새 data-model 작업으로 진행 중입니다. [ISO/TS 15926-4:2024](https://www.iso.org/standard/81270.html)는 current core reference data이며 revision 흐름이 있고, [ISO/AWI 15926-200](https://www.iso.org/standard/93512.html)은 RDFS implementation을 다루는 개발 중 작업입니다.

질문은 `오래됐는가`가 아닙니다. **내 문제가 process-plant lifecycle integration인가**입니다.

이제 표준 이름을 외우는 대신 실제 선택 절차로 바꿔 보겠습니다.

## 펌프 하나로 표준을 고르는 네 번의 질문

```text
"대표 펌프의 정격 유량과 현재 설치 위치를
공급사 카탈로그와 정비 시스템에서 같은 의미로 읽을 수 있는가?"
```

**어디서 실패하는가?** 이름 때문인지, property·unit 때문인지, object/process 구분 때문인지 먼저 재현합니다.

**가장 얇은 기준선으로 고칠 수 있는가?** 용어 문제면 ISO 704와 SKOS부터, property 문제면 IEC 61360식 registry부터 검토할 수 있습니다. 기존 relational schema로 충분히 검증되는 문제에 native graph와 TLO까지 한꺼번에 더할 이유는 없습니다.

**다음 층이 정말 새 의무를 해결하는가?** IDO나 TLO를 추가했다면 중복 mapping이 실제로 재사용되는지, 상위 category 충돌을 더 일관되게 판정하는지, cross-domain competency query가 통과하는지, 변경 영향을 더 잘 찾는지 확인해야 합니다. 이번 연구에서는 동일 industrial corpus로 비용·정확도 비교 실험을 실행하지 않았으므로 개선 수치를 주장하지 않습니다.

**그 층을 떼어도 domain이 살아 있는가?** optional alignment를 제거했을 때 domain ontology가 독립적으로 동작하는지, term·property·mapping을 외부 환경으로 옮길 수 있는지 봅니다.

네 질문을 거치면 `어느 표준이 더 권위 있는가` 대신 **이 표준이 지금 실패한 책임을 실제로 고치며 그 효과를 검증할 수 있는가**를 묻게 됩니다.

그런데 여기서 마지막 함정이 하나 더 남습니다. 표준으로 정리한 의미가 조직 밖으로도 따라갈까요?

## 표준을 썼는데도 의미는 남겨질 수 있습니다

[[notes/온톨로지/palantir-platform-exit-readiness|30번 글]]에서는 파일 export와 실제 업무 이전을 분리했습니다. 산업 온톨로지 표준도 같은 경계를 갖습니다.

```text
standard identifier 사용
≠ 의미가 자동으로 portable

RDF / OWL 사용
≠ 다른 runtime에서 같은 업무 재현

standard ontology 사용
≠ local extension과 mapping debt가 사라짐
```

표준을 사용해도 조직에는 profile, extension, mapping, version, provenance, validation, ownership이 남습니다. [ISO/IEC 21838-1](https://www.iso.org/standard/71954.html)의 공개 범위만으로 local profile·mapping·version·promotion 운영이 자동으로 정해지지는 않습니다.

![표준 선택 뒤에도 provenance, version, mapping, validation, ownership과 외부 재생이 남으며 export 성공과 semantic portability가 같은 것이 아님을 보여주는 exit drill](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-03.png)

```text
1. concept URI·label·definition을 export
2. property ID·unit·value domain을 export
3. domain class·relation과 local extension을 export
4. upper alignment module을 별도로 export
5. 외부 환경에서 competency query를 replay
6. SHACL·reasoner 결과와 mapping 이력을 대조
```

이 절차는 ISO가 요구하는 단일 공식 conformance test가 아니라 연구 자료와 기존 exit-readiness 문제를 연결해 만든 **프로젝트 설계 제안**입니다. source나 mapping revision이 바뀌면 [[notes/llm-wiki/llm-wiki-stale-propagation|stale propagation]]처럼 downstream dependency도 추적해야 합니다.

표준이 더 필요한지 판단하는 기준도 결국 같은 곳으로 돌아옵니다. 한 팀이 관리하고 이름·동의어·간단한 property table이면 충분하며 cross-domain query와 반복 mapping이 거의 없다면 JSON Schema, relational model, SKOS vocabulary가 더 얇은 기준선일 수 있습니다. 반대로 공급사마다 property 식별자·단위·값 영역이 다르고, 여러 산업 애플리케이션이 asset·process semantics를 공유해야 하거나, process plant lifecycle integration이나 반복되는 상위 category mapping이 문제라면 더 강한 책임을 검토할 이유가 생깁니다.

## 결국 표준의 수가 아니라 실패의 수를 셉니다

처음의 펌프로 돌아가겠습니다.

이름이 깨졌다면 용어와 vocabulary를 고칩니다. 숫자의 의미가 깨졌다면 property·unit·value domain 계약을 고칩니다. 여러 산업 시스템이 같은 의미 기반을 공유해야 한다면 IDO 같은 industrial-data ontology를 평가합니다. process plant lifecycle integration이 문제라면 ISO 15926의 범위를 봅니다. 여러 domain ontology가 상위 category를 반복해서 다르게 해석할 때 TLO 정렬을 검토합니다.

표준을 덜 쓰는 것이 목표도, 많이 쓰는 것이 목표도 아닙니다. **실패한 책임만 형식화하고, 다음 층은 이전 층에서 풀리지 않은 문제가 실제로 남았을 때만 추가합니다.**

마지막에는 같은 질문을 외부 환경에서 다시 던져 봅니다. 이 표준과 mapping을 옮겨도 대표 펌프의 정격 유량과 설치 위치를 같은 의미로 읽을 수 있는가? 그 질문까지 통과해야 표준 목록이 실제 상호운용 설계가 됩니다.

## 함께 읽기

- [[notes/온톨로지/palantir-platform-exit-readiness|30. 인공지능 플랫폼에서 실제로 빠져나올 수 있는가]]
- [[notes/온톨로지/ontology-vs-json-rules|6. 온톨로지는 언제 JSON 규칙보다 나아지는가]]
- [[notes/온톨로지/path-predictability-semantic-authority|26. 경로 예측 가능성과 의미 권위]]
- [[notes/온톨로지/opencrab-foundry-ontology-reinterpretation|27. 같은 온톨로지, 다른 책임]]

## 참고 자료

- ISO, [ISO 704:2022 — Terminology work — Principles and methods](https://www.iso.org/standard/79077.html)
- ISO, [ISO/FDIS 25964-1 — Thesauri for information retrieval, management and use](https://www.iso.org/standard/86713.html)
- ISO, [ISO 25964-2:2013 — Interoperability with other vocabularies](https://www.iso.org/standard/53658.html)
- W3C, [SKOS Simple Knowledge Organization System Reference](https://www.w3.org/TR/skos-reference/)
- IEC, [IEC 61360-1:2017 — Definitions, principles and methods](https://webstore.iec.ch/en/publication/28560)
- IEC, [IEC 61360-7:2024 — Data dictionary of cross-domain concepts](https://webstore.iec.ch/en/publication/72956)
- ISO, [ISO 13584-42:2010 — Methodology for structuring parts families](https://www.iso.org/standard/43423.html)
- ISO/IEC, [ISO/IEC 21838-1:2021 — Top-level ontologies — Requirements](https://www.iso.org/standard/71954.html)
- ISO/IEC, [ISO/IEC 21838-2:2021 — BFO](https://www.iso.org/standard/74572.html)
- ISO/IEC, [ISO/IEC 21838-3:2023 — DOLCE](https://www.iso.org/standard/78927.html)
- ISO/IEC, [ISO/IEC 21838-4:2023 — TUpper](https://www.iso.org/standard/78928.html)
- ISO, [ISO/FDIS 23726-3 — Industrial Data Ontology](https://www.iso.org/standard/87560.html)
- ISO, [ISO/CD 23726-100 — Schedule data ontology](https://www.iso.org/standard/90856.html)
- ISO, [ISO 15926-1:2004 — Overview and fundamental principles](https://www.iso.org/standard/29556.html)
- ISO, [ISO 15926-100:2026 — Vocabulary](https://www.iso.org/standard/89678.html)
- ISO, [ISO/AWI 15926-2 — Data model, Edition 2](https://www.iso.org/standard/93280.html)
- ISO, [ISO/TS 15926-4:2024 — Core reference data](https://www.iso.org/standard/81270.html)
- ISO, [ISO/AWI 15926-200 — RDF(S) implementation of the data model](https://www.iso.org/standard/93512.html)

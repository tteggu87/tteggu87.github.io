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

펌프 하나를 두 시스템에서 옮겼는데도 같은 펌프라고 확신하기 어려운 순간이 있습니다. 한쪽은 `Pump`, 다른 쪽은 `Pumping Equipment`라고 부르고, 정격 유량의 단위와 값 영역도 다릅니다. 정비 시스템의 `Inspection`은 작업을 뜻하지만 다른 시스템에서는 검사 기록 문서를 뜻할 수도 있습니다.

이때 표준 목록을 검색하면 ISO 704, SKOS, IEC 61360, ISO 13584, ISO 23726, ISO 15926, ISO/IEC 21838 같은 이름이 한꺼번에 나옵니다. 모두 온톨로지와 가까워 보이지만 같은 문제의 대안은 아닙니다.

> [!summary] 표준 이름보다 먼저 실패한 의미 계약을 찾습니다
> **산업 온톨로지 표준은 초급에서 고급으로 올라가는 한 줄짜리 기술 스택이 아니라 서로 다른 상호운용 실패를 맡는 책임 지도에 가깝습니다.** 용어가 깨졌다면 용어를, 속성과 단위가 깨졌다면 사전을, 여러 도메인의 상위 범주가 반복 충돌할 때만 top-level ontology 정렬을 검토하는 식으로 필요한 최소 책임부터 고르는 편이 안전합니다.

## 표준을 한 줄로 쌓으면 첫 번째 문제가 생깁니다

다음과 같은 그림은 기억하기는 쉽습니다.

```text
ISO 704
→ SKOS
→ IEC 61360
→ IDO
→ ISO 15926
→ BFO
```

하지만 이것은 공식 표준이 정한 성숙도 사다리도, 필수 import 순서도 아닙니다. 각 표준군의 공식 범위를 나란히 놓으면 서로 다른 질문에 답한다는 점이 먼저 보입니다.

| 지금 깨진 것                          | 먼저 볼 책임             | 대표 표준·규격           |
| ------------------------------------- | ------------------------ | ------------------------ |
| 개념·용어·정의                        | terminology              | ISO 704                  |
| 시소러스·concept scheme·mapping       | knowledge organization   | ISO 25964 + W3C SKOS     |
| property·단위·값 영역·parts family    | property dictionary      | IEC 61360 + ISO 13584-42 |
| 여러 산업 시스템이 공유할 의미 기반   | industrial-data ontology | ISO 23726 IDO 평가       |
| 프로세스 플랜트의 장기 생애주기 통합  | lifecycle integration    | ISO 15926 family         |
| 여러 domain ontology의 상위 범주 충돌 | top-level alignment      | ISO/IEC 21838 + 후보 TLO |

[ISO/IEC 21838-1](https://www.iso.org/standard/71954.html)은 domain-neutral top-level ontology가 갖춰야 할 요구조건을 다룹니다. 반면 [ISO 15926-1](https://www.iso.org/standard/29556.html)은 process plant의 생애주기 정보 통합을 대상으로 합니다. 같은 `ontology`라는 단어 주변에 있어도 질문의 크기와 책임이 다릅니다.

따라서 선택 순서는 `어느 표준이 더 상위인가`보다 **어느 의미 계약이 실제로 깨졌는가**에서 시작해야 합니다.

## 같은 펌프를 두고도 여섯 종류의 실패가 생깁니다

가정해 보겠습니다. 한 제조 조직이 공급사 카탈로그, 설비 관리 시스템, 정비 시스템과 공정 데이터 플랫폼에 흩어진 펌프 정보를 하나로 연결하려 합니다.

첫 번째 시스템은 장비 이름을 `pump`라고 저장합니다. 두 번째는 한국어 `펌프`와 약어를 씁니다. 세 번째는 `rated flow`를 값만 저장하고 단위를 별도 필드에 둡니다. 네 번째는 펌프의 설치·운전·정비 이력을 장기간 연결해야 합니다.

이 문제들을 하나의 OWL 파일로 곧장 해결하려 하면 서로 다른 책임이 섞입니다.

![같은 펌프를 둘러싼 용어 불일치, 속성·단위 충돌, 산업 공통 의미, 생애주기 통합, 상위 범주 정렬 문제를 서로 다른 책임으로 분리한 지도](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-01.png)

```text
이름이 다름
≠ property 정의가 다름
≠ lifecycle 모델이 다름
≠ upper category가 충돌함
```

각 실패를 분리하면 필요한 형식성도 달라집니다. 이름과 동의어만 맞추면 되는 조직에 top-level ontology까지 도입하는 것은 과할 수 있습니다. 반대로 여러 도메인 팀이 `Process`, `Role`, `Quality`, `Information`을 서로 다르게 모델링해 mapping을 매번 다시 쓰고 있다면 단순 용어집만으로는 충분하지 않을 수 있습니다.

이 경계는 기존의 온톨로지 도입 판단과도 같습니다. [[notes/온톨로지/ontology-vs-json-rules|6번 글]]에서 다룬 것처럼, 형식성이 많아 보인다는 이유가 아니라 관계 재사용·변경 영향·감사 비용이 추가 복잡성을 정당화할 때만 다음 층으로 올라가는 편이 낫습니다.

## ISO 704는 OWL보다 먼저 용어가 깨졌는지 묻습니다

[ISO 704:2022](https://www.iso.org/standard/79077.html)는 terminology work의 원칙과 방법을 다룹니다. object, concept, definition, designation 사이의 관계와 term·definition 작성 원칙이 중심입니다.

다음 문제가 반복된다면 ontology language보다 용어 작업이 먼저일 수 있습니다.

- `설비`, `장비`, `asset`의 범위를 팀마다 다르게 씁니다.
- 같은 단어가 서로 다른 concept를 가리킵니다.
- preferred term, 약어와 동의어가 관리되지 않습니다.
- 정의가 무엇을 포함하고 제외하는지 드러내지 않습니다.

ISO 704를 쓴다고 RDF나 OWL ontology가 만들어지는 것은 아닙니다. 여기서 얻는 것은 **개념을 구분하고 이름과 정의를 관리하는 책임**입니다.

펌프 사례에서는 `pump`, `펌프`, `양수기`를 한 문자열로 정규화하기 전에 무엇이 같은 concept인지부터 합의해야 합니다. 단어를 합쳤는데 실제 의미 범위가 다르면 검색은 편해져도 의미 충돌은 남습니다.

## ISO 25964와 SKOS는 시소러스 운영과 웹 표현을 연결합니다

용어가 정리됐다고 여러 vocabulary 사이의 관계가 자동으로 생기지는 않습니다. [ISO 25964-2](https://www.iso.org/standard/53658.html)는 서로 다른 thesaurus와 vocabulary 사이의 interoperability와 mapping을 다룹니다.

[W3C SKOS](https://www.w3.org/TR/skos-reference/)는 `Concept`, `ConceptScheme`, `prefLabel`, `altLabel`, `broader`, `narrower`, `related`와 mapping property를 RDF/Web에서 표현하는 Recommendation입니다.

```turtle
@prefix ex: <https://example.org/concept/> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .

ex:pump
  a skos:Concept ;
  skos:prefLabel "펌프"@ko ;
  skos:prefLabel "pump"@en ;
  skos:altLabel "양수기"@ko .
```

이 정도의 문제라면 SKOS vocabulary만으로도 충분할 수 있습니다. `Pump`가 물리적 객체인지, 정비 과정과 어떤 relation을 갖는지까지 강한 공리로 정의할 필요가 없다면 full domain ontology를 바로 만들 이유가 줄어듭니다.

2026년 8월 30일 현재 [ISO 25964-1 Edition 2](https://www.iso.org/standard/86713.html)는 FDIS 단계입니다. 공개 페이지는 현재 상태를 보여 주지만 새 edition의 유료 전문 전체를 이 조사에서 확보하지 않았습니다. 따라서 새 규범 조항을 추정하지 않고 **현재 revision이 진행 중이라는 사실**까지만 사용합니다.

## IEC 61360과 PLIB는 이름보다 property 계약을 다룹니다

두 시스템이 모두 `펌프`라고 부른다고 해도 다음 단계에서 다시 충돌할 수 있습니다.

```text
rated flow = <value>
unit = ?
```

이 값만으로는 충분하지 않습니다. quantity가 무엇인지, 단위는 무엇인지, 허용 value domain은 무엇인지, 어떤 class에 적용되는 property인지가 필요합니다.

[IEC 61360-1](https://webstore.iec.ch/en/publication/28560)은 property와 associated attribute, technical concept class와 data representation 원칙을 다룹니다. [ISO 13584-42](https://www.iso.org/standard/43423.html)는 supplier-independent parts family와 characterization property 구조에 무게를 둡니다.

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

[IEC 61360-7:2024](https://webstore.iec.ch/en/publication/72956)는 cross-domain generic classes와 properties를 제공합니다. 여기서 `cross-domain`이라는 표현 때문에 top-level ontology와 같은 역할로 보기는 어렵습니다.

```text
cross-domain property dictionary
≠ domain-neutral top-level ontology
```

Property dictionary는 산업 전반에서 재사용할 수 있어도 여전히 property·class·value representation이라는 책임에 초점을 둡니다.

## IDO의 upper ontology와 ISO/IEC 21838의 TLO는 같은 말이 아닙니다

`upper ontology`라는 단어는 특히 혼동하기 쉽습니다.

ISO/TC 184/SC 4의 ISO 23726 Ontology-based interoperability 계열은 Industrial Data Ontology(IDO)를 foundation으로 둡니다. [ISO/FDIS 23726-3](https://www.iso.org/standard/87560.html)은 IDO를 산업 데이터와 정보, vocabulary, asset model과 reference data library에 사용할 OWL ontology로 설명합니다.

2026년 8월 30일 현재 Part 3 IDO는 **FDIS**이고, Parts 1·2·100은 개발 중입니다. 따라서 완성된 published stack처럼 표현해서는 안 됩니다.

반면 ISO/IEC 21838은 domain-neutral top-level ontology를 다룹니다. Part 1은 요구조건이고 구체적인 표준 TLO는 다음과 같습니다.

- [Part 2 — BFO](https://www.iso.org/standard/74572.html)
- [Part 3 — DOLCE](https://www.iso.org/standard/78927.html)
- [Part 4 — TUpper](https://www.iso.org/standard/78928.html)

![ISO 23726 IDO의 industrial-data foundation과 ISO/IEC 21838의 domain-neutral TLO가 서로 다른 범위에서 domain ontology를 지원하며 같은 층의 단순 대체재가 아님을 보여주는 구조](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-02.png)

```text
IDO의 industrial-data-domain foundation
≠ ISO/IEC 21838의 domain-neutral TLO

ISO/IEC 21838-1
≠ BFO 자체

표준 TLO
≠ BFO 하나뿐
```

이 조사에서는 IDO와 BFO·DOLCE·TUpper 사이의 formal mapping을 구현하거나 reasoner로 검증하지 않았습니다. 따라서 `IDO가 BFO보다 낫다`거나 서로 완전히 호환된다고 말하지 않습니다.

## ISO 15926은 모든 산업의 기본값이 아니라 특정 생애주기 문제를 맡습니다

[ISO 15926-1](https://www.iso.org/standard/29556.html)의 중심 범위는 process plant lifecycle information integration입니다. 일반 기업 ontology의 보편 baseline으로 읽기보다 프로세스 산업에서 장기간 engineering·construction·operation·maintenance 정보를 공유하는 문제에 맞춰 보는 편이 정확합니다.

동시에 이 표준군을 끝난 legacy로 보는 것도 현재 상태와 맞지 않습니다.

- [ISO 15926-100:2026 Vocabulary](https://www.iso.org/standard/89678.html)는 2026년 6월 출판됐습니다.
- [ISO/AWI 15926-2 Edition 2](https://www.iso.org/standard/93280.html)는 새 data-model 작업으로 진행 중입니다.
- [ISO/TS 15926-4:2024](https://www.iso.org/standard/81270.html)는 current core reference data이며 revision 흐름이 있습니다.
- [ISO/AWI 15926-200](https://www.iso.org/standard/93512.html)은 RDFS implementation을 다루는 개발 중 작업입니다.

```text
ISO 15926 = 끝난 legacy
(X)

ISO 15926 = 모든 산업 ontology의 기본값
(X)
```

표준이 오래됐는지보다 **내가 풀려는 문제가 process-plant lifecycle integration인가**를 묻는 것이 먼저입니다.

## Top-level ontology는 마지막 단계가 아니라 조건부 정렬 도구입니다

[ISO/IEC 21838-1](https://www.iso.org/standard/71954.html)이 다루는 TLO는 여러 domain ontology 사이에 공통 상위 category를 제공하는 정렬 허브입니다.

예를 들어 설비 ontology와 정비 ontology, 조직 ontology가 독립적으로 성장했다고 해보겠습니다. 세 팀이 `Object`, `Process`, `Role`, `Quality`, `Information`의 의미를 다르게 써서 point-to-point mapping을 반복한다면 상위 정렬의 재사용 가치가 생길 수 있습니다.

그렇지 않다면 TLO가 아직 필요 없을 수 있습니다.

```text
단일 domain ontology
+ 같은 팀이 관리
+ cross-domain query가 거의 없음
+ 상위 category 충돌이 반복되지 않음

→ JSON / DB schema / SKOS / domain model 기준선을 먼저 유지
```

이 판단은 ISO/IEC 21838의 공식 도입 절차가 아니라 프로젝트의 조건부 권고입니다. BFO·DOLCE·TUpper 생태계를 처음부터 핵심 commitment로 쓰는 프로젝트라면 초기 alignment가 합리적일 수도 있습니다.

여기서 오래된 온톨로지 선택 문제와 이번 표준 지도가 만납니다. 별도의 근거 검토에서는 **graph-shaped data, native graph storage, OWL semantics와 validation을 한 번에 채택하지 말아야 한다**는 결론이 독립 검토를 통과했습니다. 표준 역시 같은 원칙으로 볼 수 있습니다. 한 층이 필요하다는 사실이 다음 층의 필요성을 자동으로 증명하지 않습니다.

## 최소 충분 표준을 고르는 네 단계

여러 자료를 함께 놓으면 표준 선택을 다음 네 단계로 줄일 수 있습니다.

### 1. 실패를 재현합니다

실제 데이터와 질문 하나를 고릅니다.

```text
"대표 펌프의 정격 유량과 현재 설치 위치를
공급사 카탈로그와 정비 시스템에서 같은 의미로 읽을 수 있는가?"
```

이름 때문에 실패하는지, property·unit 때문에 실패하는지, object/process 구분 때문에 실패하는지 먼저 찾습니다.

### 2. 가장 얇은 기준선으로 고칩니다

용어 문제라면 ISO 704와 SKOS부터 시작할 수 있습니다. Property 문제라면 IEC 61360식 registry를 붙입니다. 이미 한 시스템의 관계형 schema로 충분히 검증 가능한 문제에 native graph와 TLO까지 더할 필요는 없습니다.

### 3. 다음 층이 새로 해결하는 의무를 확인합니다

IDO나 TLO를 추가하려면 `표준을 더 많이 썼다`가 아니라 다음과 같은 변화를 확인해야 합니다.

- 중복 mapping을 실제로 재사용할 수 있게 됐습니까?
- 이전에 충돌하던 상위 category를 더 일관되게 판정합니까?
- cross-domain competency query가 통과합니까?
- 변경 시 영향을 받는 mapping과 query를 더 잘 찾습니까?

이것들은 도입 전 측정 항목에 가깝습니다. 이번 연구에서는 동일 industrial corpus로 이 비교 실험을 실행하지 않았으므로 비용·정확도 개선을 주장하지 않습니다.

### 4. 제거해도 domain이 살아 있는지 봅니다

표준을 도입한 뒤에는 의존성을 제거하는 시험도 필요합니다. Optional alignment를 떼었을 때 domain ontology가 독립적으로 동작하는지, 외부 환경으로 term·property·mapping을 옮길 수 있는지 확인합니다.

이 네 단계를 합치면 선택 기준이 `표준의 권위`에서 **실패를 고치는 최소 책임과 그 책임의 검증 가능성**으로 바뀝니다.

## 표준을 썼다고 이식성이 생기는 것은 아닙니다

[[notes/온톨로지/palantir-platform-exit-readiness|30번 글]]에서는 파일 export와 실제 업무 이전을 분리했습니다. 산업 온톨로지 표준도 같은 경계를 갖습니다.

```text
standard identifier 사용
≠ 의미가 자동으로 portable

RDF / OWL 사용
≠ 다른 runtime에서 같은 업무 재현

standard ontology 사용
≠ local extension과 mapping debt가 사라짐
```

표준을 사용하더라도 조직에는 profile, extension, mapping, version, provenance, validation과 ownership이 남습니다. 이번에 확인한 [ISO/IEC 21838-1](https://www.iso.org/standard/71954.html)의 공개 범위만으로는 조직의 local profile·mapping·version·promotion 운영이 자동으로 정해지지 않습니다.

따라서 semantic asset의 exit drill은 파일을 저장하는 데서 멈추면 부족합니다.

![표준 선택 뒤에도 provenance, version, mapping, validation, ownership과 외부 재생이 남으며 export 성공과 semantic portability가 같은 것이 아님을 보여주는 exit drill](../../attachments/industrial-ontology-standards-responsibility-map/industrial-ontology-standards-responsibility-map-figure-03.png)

```text
1. concept URI·label·definition을 export
2. property ID·unit·value domain을 export
3. domain class·relation과 local extension을 export
4. upper alignment module을 별도로 export
5. 외부 환경에서 competency query를 replay
6. SHACL·reasoner 결과와 mapping 이력을 대조
```

이 절차는 ISO가 요구하는 단일 공식 conformance test가 아니라 연구 자료와 기존 exit-readiness 문제를 연결해 만든 **프로젝트 설계 제안**입니다.

## 표준 밖에 남는 운영 계약도 따로 적어야 합니다

표준 선택이 끝나도 실제 ontology registry에는 수명주기가 필요합니다.

```yaml
ontology_registry:
  identity: stable IRI
  labels: preferred / alternative + language
  definition_source: standard + edition + locator
  property_source: dictionary + edition
  domain_module: versioned ontology module
  upper_mapping: optional, independently versioned
  lifecycle: candidate | reviewed | approved | deprecated
  validation: schema + SHACL/reasoner + competency queries
  impact: affected mappings / queries / downstream artifacts
  portability: export + external replay + mapping ownership
```

이 구조 역시 표준 자체의 공식 schema가 아닙니다. 표준이 정의한 의미 자산과 조직이 운영해야 할 revision·promotion·validation 책임을 섞지 않기 위한 설계안입니다.

여기서 최근 LLM Wiki 연재의 교훈도 연결됩니다. source나 mapping revision이 바뀌었을 때 downstream artifact가 영향을 받는다면 [[notes/llm-wiki/llm-wiki-stale-propagation|stale propagation]]처럼 dependency와 변경 영향을 추적해야 합니다. 표준 edition을 고정하는 일도 결국 `어느 의미 revision을 현재로 믿는가`라는 운영 문제로 이어집니다.

## 표준이 필요하지 않은 경우도 명확합니다

다음 조건이라면 더 얇은 구조가 합리적일 수 있습니다.

- 한 팀이 관리하는 작은 application입니다.
- 이름·동의어 정리와 간단한 property table이면 충분합니다.
- cross-domain query가 거의 없습니다.
- 여러 ontology 사이의 mapping을 반복하지 않습니다.
- 규제·계약상 특정 표준 conformance가 요구되지 않습니다.
- 온톨로지 유지·검토 비용이 해결하려는 의미 오류보다 큽니다.

이 경우 JSON Schema, relational model, SKOS vocabulary와 명확한 provenance가 충분한 기준선이 될 수 있습니다.

반대로 다음 문제가 반복되면 더 강한 표준 책임을 검토할 이유가 생깁니다.

- 공급사마다 같은 property의 식별자·단위·값 영역이 다릅니다.
- 여러 산업 애플리케이션이 같은 asset·process semantics를 공유해야 합니다.
- 프로세스 플랜트의 장기 lifecycle data를 통합해야 합니다.
- 여러 domain ontology가 상위 category mapping을 반복합니다.
- 조직 밖 교환에서 표준 conformance 자체가 계약 요건입니다.

표준을 덜 쓰는 것이 목표도, 많이 쓰는 것이 목표도 아닙니다. **실패한 책임만 형식화하고 그 이득을 검증하는 것**이 목표입니다.

## 마지막에 남길 질문은 하나입니다

산업 온톨로지 표준을 보면 표준 번호와 이름이 먼저 눈에 들어옵니다. 하지만 실제 설계에서 필요한 순서는 반대입니다.

먼저 펌프 하나와 질문 하나를 고르십시오. 이름이 깨졌는지, property가 깨졌는지, lifecycle 정보가 끊겼는지, 여러 domain의 상위 category가 충돌했는지 확인합니다. 그 실패를 해결하는 가장 얇은 책임부터 붙이고, 다음 표준은 이전 층에서 해결하지 못한 의무가 있을 때만 추가합니다.

그다음에는 한 번 더 묻습니다. **이 표준과 mapping을 다른 환경으로 가져가도 같은 질문에 같은 의미로 답할 수 있을까요?**

그 질문까지 통과해야 표준 목록이 실제 상호운용 설계로 바뀝니다.

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

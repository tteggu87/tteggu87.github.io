---
title: "Apollo 운영 보고서 수집·보존 영수증"
type: ingest_report
status: applied
source_of_truth: false
as_of: 2026-09-11
last_reviewed: 2026-09-11
canonical_sources:
  - research/palantir-apollo-operations-20260911/source-original.md
  - research/palantir-apollo-operations-20260911/README.md
---

# Apollo 운영 보고서 수집·보존 영수증

## 입력·권한·검증 범위

사용자는 첨부 Markdown의 보존·위키화·블로그 배포를 요청했다. 입력은 `file_000000000c3082308cb6ef295999ea87` 한 파일이며, 원래 리서치 세션의 URL 원장·별도 첨부 이미지는 제공되지 않았다.

불변 [원본](../../../research/palantir-apollo-operations-20260911/source-original.md): **52,532 bytes / 364 lines / SHA-256 `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`**. 마지막 개행을 포함해 업로드와 동일한 바이트를 보존했다. 아래의 줄 번호는 이 원본에 대한 것이다.

파생 문서의 약어: **S**=[출처 메모](../../sources/palantir-apollo-operations-report-2026-09-11.md), **A**=[운영 분석](../../analyses/palantir-apollo-operations-2026-09-11.md), **P**=[도입 검증](../../playbooks/palantir-apollo-adoption-validation.md), **B**=[블로그 원고](../../../content/notes/온톨로지/palantir-apollo-operations-guide.md), **R**=[근거·교정 원장](../../../research/palantir-apollo-operations-20260911/README.md).

이 영수증의 `applied`는 파일 보존·위키 반영을 뜻한다. 새 PNG 픽셀 검수·사이트 빌드·PR·공개 배포 성공은 별도 [발행 기록](../../../artifacts/publication/palantir-apollo-operations-guide/image-prompts.md)과 후속 검증 기록으로 판정한다. 제품 설치·Apollo 테넌트 PoC를 수행했다는 뜻도 아니다.

## 읽은 기존 경로와 저장소 계약

원래 로컬 위키의 `wiki/_meta/index.md`와 `_meta/log.md`를 읽고, Apollo 운영환경 출처 메모(2026-09-09), Foundry·AIP use-case validation 플레이북, 기존 공개 34번 Apollo 글을 따라갔다. 원래 로컬 위키에 있던 파일은 최신 원격 트리에는 없었으므로 다른 자료 전체를 복제하지 않았다. 새 설치·운영·DR·TCO 범위는 별도 세 페이지로 만들고 기존 공개 글은 유지했다.

이 저장소의 계약은 `research/` 불변 입력과 `wiki/`의 `source_of_truth:false` 파생 지식이다. 일반 스킬의 `raw/` canonical 구조를 강제로 이식하거나 generic readiness 인증을 주장하지 않았다. 원래 dirty 작업 트리의 기존 수정과 이 번들의 원격 발행 범위를 분리했다.

## 7개 절의 대응

| 원문 절·범위 | 파생 위치 | 처리 |
| --- | --- | --- |
| 경영진 요약 L3–23 | S 중심 주장·교정, A1·결론, B 도입·역할표 | 역할 유지, 현대 구조·설치 공개 범위 교정 |
| 제품 정체성·아키텍처 L24–97 | S 역사적 세부, A1·4, B Hub·Spoke | Skylab·SLS 역사 구분, 현대 Plan 구조 추가 |
| 운영환경·배포모델 L98–141 | A2·5, B 환경·에어갭, P1·3 | 모든 환경 종류·연결·반입 제약 보존 |
| 설치·업그레이드·CI/CD L142–224 | A3–5, B 설치·업데이트·반입, P2·3 | 공개 설치 조건·Health·Bundle 예외 보강 |
| 보안·관측·장애 L225–266 | S 미해결 사항, A6, B 보안·장애, P1–4 | SAML·RBAC 교정, 인증·로그 범위 제한 |
| 확장성·복원력·비용·지원 L267–299 | A6·7, B 복구·TCO, P4·5 | 네 DR와 지원 질문 유지, 정성 비용≠실측 |
| 사례·체크리스트·한계 L300–364 | S 역사·효과 경계, A7, B 사례·PoC·한계, P 전체 | 발표·실측 분리, 격리 시험·미확인 표 유지 |

## 표 9개와 도식 4개의 대응

| ID | 원문 범위·내용 | 보존·재구성 위치 |
| --- | --- | --- |
| T01 | L15–22 핵심 질문 | 원본 그대로; B 역할 질문표와 한계표 |
| T02 | L32–40 구성요소 | 원본 그대로; A1 및 B 현대 구성요소 표, 역사 명칭은 S |
| T03 | L102–109 환경 | 원본 그대로; A2와 B 환경·책임 비교표 |
| T04 | L181–190 CI/CD 단계 | 원본 그대로; A4와 B 업데이트 역할표 |
| T05 | L229–236 보안 | 원본 그대로; A6와 B 보안 책임표, 공개 SAML·RBAC 추가 |
| T06 | L254–263 장애 확인 | 원본 그대로; A6와 B Reported State·Plan 기반 확인표 |
| T07 | L287–294 TCO 높음·중간 | 정성표 원본 그대로; A7에 해석 한계, B 비용 질문표로 재구성 |
| T08 | L316–330 도입 체크리스트 | 원본 그대로; P 인벤토리·시험·복구·비용, B 검증표 |
| T09 | L338–355 정보 확실성 | 원본 그대로; R C01–C15 교정, S·B의 확인/미확인 구분 |
| D01 | L44–88 2020 기반 전체 구성 | 원본 Mermaid 그대로; A1·B 현대 Hub/Spoke 설명용 도식 |
| D02 | L119–138 환경·격리 경계 | 원본 Mermaid 그대로; A2·5, B Bundle·이미지 예외 도식 |
| D03 | L148–173 CI·canary·soak·rollout | 원본 Mermaid 그대로; A4, B 현행 Plan·승격 도식 |
| D04 | L198–221 에어갭 upgrade | 원본 Mermaid 그대로; A5, B 반입·내부 검증 도식 |

새 블로그의 네 PNG는 원문 Mermaid의 대체 보존본이 아니다. 원문 코드는 그대로 남고 PNG는 전체 논제·설치 범위·반입 예외·복구 책임을 각각 설명한다. PNG가 실제 생성됐다는 것과 픽셀 검수에 통과했다는 것도 별도로 기록한다.

## 산문 62개 블록의 주장·한계 대응

단위는 빈 줄로 구분된 비표·비코드·비헤더 블록이다. 문장을 원자적 사실로 모두 검증했다는 뜻은 아니며, 표 소개나 요약도 분모에 포함한다. 62개 모두 원본에 바이트 그대로 보존하고 아래 경로로 의미·불확실성을 재사용한다. `역사/보류`는 삭제가 아니라 출처 재검증을 남긴 상태다.

| 단위 | 원문 줄 | 핵심 내용 | 파생 위치·상태 |
| --- | --- | --- | --- |
| U01 | 5 | 제품 역할·기원 | S·A1·B 도입; 역사 기원은 원문 주장 |
| U02 | 7 | CI와 전달 비유 | A1·B 역할; 비유는 설명 |
| U03 | 9 | desired state·pull·Skylab | R C01–02·A1; 현대 구조로 교정 |
| U04 | 11 | 공개 정보 한계 | R C03–05·S; 공개 설치·인증으로 일부 교정 |
| U05 | 13 | 핵심 질문표 소개 | T01로 연결 |
| U06 | 26 | Gotham·Foundry 기원 | S 역사·A1; 원문 전체 유지 |
| U07 | 28 | 앱과 인프라 사이 역할 | A1·B 도입; S01–03 범위 |
| U08 | 30 | 구성표 소개 | T02로 연결 |
| U09 | 42 | 역사적 종합 도식의 한계 | A1·D01; 공식 현대 topology 아님 |
| U10 | 90 | 환경 manager의 pull | A1·B; 역사와 현재 agent 조회 구분 |
| U11 | 92 | SLS lifecycle·hardware·config | S 역사·A1; 현대 SDK로 단정 안 함 |
| U12 | 94 | 의존성·migration·recall | A4·B 업데이트; 가역성 제한 유지 |
| U13 | 96 | Product Operations 해석 | A 결론·B; 분석으로 분류 |
| U14 | 100 | 이종 fleet 가치 | A2·B 환경; 도입 판단 |
| U15 | 111 | AWS/Azure와 GCP 지원 한계 | A2·B; 전체 지원표 미확인 |
| U16 | 113 | 온프레미스와 동일 release | A2·B; 현장 인프라 책임 유지 |
| U17 | 115 | Edge·Live Edge·VCE | R C09·S·B 사례; VCE 명칭 교정 |
| U18 | 117 | local Apollo 역사 | A5·S; 현행 Target Hub 경로와 분리 |
| U19 | 140 | 에어갭 반입 시간·비용 | A5·B; 제약을 없앤다고 표현 안 함 |
| U20 | 144 | self-service 설치 정보 부족 | R C03·A3·B 설치; 공개 조건으로 교정 |
| U21 | 146 | build·artifact·설정·실행 | A1·4·B; 현대 Plan 설명 |
| U22 | 175 | 시험·canary·soak·recall | A4·B; Health 평가 예외 추가 |
| U23 | 177 | blue/green·무중단 제한 | A4·B; DB·replica 조건 유지 |
| U24 | 179 | CI/CD 표 소개 | T04로 연결 |
| U25 | 192 | Jenkins 대체 여부 | A1·B 역할; CI 전체 대체 아님 |
| U26 | 194 | GitOps 유사성·직무 분리 | A1·S 역사·R C02; 현대 단일 target 아님 |
| U27 | 196 | 에어갭 workflow 소개 | D04로 연결 |
| U28 | 223 | snapshot·binary·공급망 권고 | A5·B·P3; Bundle 예외·권고 구분 |
| U29 | 227 | supply-chain security | A6·B 보안; 변경·권한 책임 |
| U30 | 238 | 인증·권한 정보 부족 | R C04·S·B; 공개 SAML·RBAC 교정 |
| U31 | 240 | FedRAMP와 개별 설치 범위 | S·A6·B; 자동 인증 확대 금지 |
| U32 | 242 | 회사 인증 목록 | S·R C11; 원문 보존, 현재 전항목 재검증 아님 |
| U33 | 244 | IL6 변경 과정 | S·R C11; 역사/보류 |
| U34 | 246 | fleet 관측 | A6·B; 상태 시점·실제 결과 구분 |
| U35 | 248 | 로그·trace·dump·단절 관측 | S·A6; 역사 세부 보존 |
| U36 | 250 | TB·time series·41k 수치 | S·R C10·B; 역사/보류, SLA 아님 |
| U37 | 252 | 장애 확인표 소개 | T06로 연결 |
| U38 | 265 | 상태부터 runtime까지 triage | A6·B; 현대 채널·Plan 순서로 재구성 |
| U39 | 269 | 서비스·환경·변경 빈도 확장 | A2·7·B; 대상·기준 고정 후 측정 |
| U40 | 271 | multi-node upgrade | A4·6·B; workload HA와 관리 DR 구분 |
| U41 | 273 | control-plane HA 불명확 | A6·B·P4; 계약·시험 미확인 유지 |
| U42 | 275 | 네 DR 구분 소개 | A6·B 복구표·P4 |
| U43 | 277 | 관리·artifact·config·data DR | A6·B·P4; 운영 제안 |
| U44 | 279 | 배포 복원≠backup | A6·B·P4; DB·업무 별도 |
| U45 | 281 | 가격·Marketplace | S·R C13·B; 가격 단위 미확인 |
| U46 | 283 | 군 조달·volume discount | S·R C13; 원문 보존, Apollo 요금 추론 안 함 |
| U47 | 285 | TCO표 소개 | T07로 연결 |
| U48 | 296 | SaaS 운영 경제성 | A7·B 비용; 효과 가설·측정 필요 |
| U49 | 298 | enterprise support | A7·B·P1; 응답·책임·이관 계약 질문 |
| U50 | 302 | 자사 운영·41k·2026자료 | S·R C10·A7; 역사 수치 현행 보증 아님 |
| U51 | 304 | Accenture·Security Forge | R C12·S·B; 새 확인은 2026-06-04 발표 범위 |
| U52 | 306 | 보안·ontology 확장 해석 | S·A7·B; 공급자 방향≠독립 ROI |
| U53 | 308 | Edgescale AI | R C09·S·B; 공식 발표의 VCE로 교정 |
| U54 | 310 | 정부·국방·disconnected | S·A2·5; 과거 설명과 현재 반입 모델 분리 |
| U55 | 312 | 고객 사례 증거 수준 | S·A7·B; 고객 수·ROI·win rate 미확인 |
| U56 | 314 | 환경 목록 우선 | P1·B 검증·T08 |
| U57 | 332 | v1/v2/bad v3/rollback | P2·B; 격리된 시험 제안으로 한정 |
| U58 | 334 | 설치 아닌 안전한 loop 검증 | P2–4·B; 미실행 항목 pass 금지 |
| U59 | 336 | 확실성표 소개 | T09·R·S·B 한계표 |
| U60 | 357 | 조합·이종환경 추상화 해자 | A 결론·B 결론; 분석 판단 |
| U61 | 359 | 적합 조직·단일cluster대안 | A7·B 결론·P5; 비용·복잡성 비교 |
| U62 | 361–364 | 세 줄 요약 | S·A·P·B 요약; 공개 조건과 현대 구조 반영 |

## 보존·교정 결과

원본 절 **7/7**, 표 **9/9**, Mermaid **4/4**, 정의된 산문 블록 **62/62**를 보존·위치 연결했다. 이것은 **보존·경로 커버리지**이며 사실 검증률 100%, 문장 전수 현대화 또는 독립 효과 입증을 뜻하지 않는다. 새 근거 S01–S14와 교정·유지 결정 C01–C15는 R에 기록했다. 역사적 일부 수치·사례·인증 목록은 명시적으로 재검증을 보류했다.

미채택 대안: 원본을 최신 설명으로 덮어쓰기, 옛 인용 ID의 URL을 추측해서 연결하기, 역사적 세부를 삭제하기, 기존 34번 글을 중복 덮어쓰기, 원래 dirty 위키 전체를 PR에 포함하기. 대신 불변 원본·교정 원장·세 위키 페이지·후속 공개 글의 층을 나눴다.

## 3줄 요약

원문 전체와 7개 절·9개 표·4개 도식·62개 산문 블록의 위치를 보존했다.  
최신 문서로 교정한 내용과 역사적 미확인 주장을 분리해 출처·분석·검증 절차로 연결했다.  
보존 완료와 실제 이미지 검수·블로그 배포 완료는 별도의 증거로 확인한다.

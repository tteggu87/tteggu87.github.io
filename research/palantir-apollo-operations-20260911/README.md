# Apollo 운영 심층 보고서 보존·검증 원장

기준일: 2026-09-11 (Asia/Seoul). 사용자 요청: 첨부 보고서의 위키화, 내용 보존, 블로그 배포.

## 원본과 파생본

- 불변 원본: [source-original.md](source-original.md)
- 업로드 이름: `아폴로 운영deep-research-report.md` (파일명의 Unicode 정규화와 무관하게 본문 바이트를 보존)
- 업로드 식별자: `file_000000000c3082308cb6ef295999ea87`
- 원본 크기: **52,532 bytes**, 364줄, 마지막 개행 없음
- 원본 SHA-256: `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`
- 위키 출처: [보고서 수집 메모](../../wiki/sources/palantir-apollo-operations-report-2026-09-11.md)
- 위키 종합: [운영환경·책임·근거 지도](../../wiki/analyses/palantir-apollo-operations-2026-09-11.md)
- 재사용 절차: [도입·실패·복구 검증](../../wiki/playbooks/palantir-apollo-adoption-validation.md)
- 보존 범위: [수집 영수증](../../wiki/_meta/ingest_reports/apollo-operations-20260911.md)
- 독자용 파생 글: [팔란티어 Apollo를 클라우드 밖에서 운영하려면](../../content/notes/온톨로지/palantir-apollo-operations-guide.md)

원본의 문장·표·Mermaid·옛 인용 표식을 수정하지 않았다. 파생본은 원본을 대체하지 않는다. 기존 34번 Apollo 입문 글은 별도 글로 유지한다. 이 번들은 보고서 작성 당시의 전체 리서치 세션이 아니라 **사용자가 첨부한 단일 Markdown의 완전 보존본**이다. 원래 bibliography, 검색 로그, 이미지 파일은 첨부되지 않았다.

## 인용 복구의 한계

원본의 `turn...` 인용은 이전 대화 세션의 내부 식별자다. 그 세션의 URL 원장이 없어 일대일 원출처를 복구했다고 주장하지 않는다. 원본에 표식을 남기고 아래의 실제 URL을 새로 확인해 파생 글에 각주를 작성했다. 따라서 아래 S 번호는 **새 검증 원장**이며 원본 인용 ID의 매핑표가 아니다.

공식 제품 문서는 기능·제약을 설명하는 공급자 1차 자료다. 서로 다른 URL을 독립적인 성능·ROI 증거로 중복 집계하지 않는다. 실제 Apollo 테넌트 설치, PoC, 장애 주입, SLA·견적 확인은 수행하지 않았다.

## 새 출처 원장

확인일은 모두 2026-09-11이다. S01–S12는 공식 HTML 본문, S13은 협력사 공식 발표 본문, S14는 Palantir 공식 게시물의 공개 검색 결과를 확인했다. 외부 페이지 전체 스냅샷을 저장한 것은 아니다.

| ID  | 제목·URL                                                                                                                                                           | 확인 범위와 주장 상한                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| S01 | [Apollo Overview](https://www.palantir.com/docs/apollo/core/overview)                                                                                              | Hub·Spoke·에이전트와 소프트웨어 변경 역할. 모든 업무 승인·데이터 복구 기능으로 확대하지 않음.                                              |
| S02 | [How Apollo works](https://www.palantir.com/docs/apollo/core/how-apollo-works)                                                                                     | Reported State, Plan 선택, 단일 고정 target state와의 차이, 실패 뒤 조건부 rollback Plan.                                                  |
| S03 | [Products, Releases, and Versions](https://www.palantir.com/docs/apollo/core/products-releases-versions)                                                           | 배포 가능한 Product·Release와 CI 산출물의 관계. CI 전체 대체라고 표현하지 않음.                                                            |
| S04 | [Plans and Constraints](https://www.palantir.com/docs/apollo/core/plans-and-constraints)                                                                           | Plan 생애주기, 제약, 실패, suppression. 수동 suppression 우회를 제안하지 않음.                                                             |
| S05 | [Spoke Environment prerequisites](https://www.palantir.com/docs/apollo/managing-environments/spoke-environment-prerequisites)                                      | Kubernetes Spoke의 노드·권장 자원·아키텍처·접근·연결·권한 조건. 모든 엣지 장비의 최소치가 아님.                                            |
| S06 | [Spoke Control Plane](https://www.palantir.com/docs/apollo/core/spoke-control-plane)                                                                               | helm-chart-operator, apollo-auth-broker, expected-state-k8s, 선택적 registry rewrite webhook. 전체 HA·포트 목록의 보증이 아님.             |
| S07 | [Authentication](https://www.palantir.com/docs/apollo/core/authentication)                                                                                         | SAML federation, 메타데이터 교환, Palantir Auth 선택지. 모든 OIDC·agent 인증 방식으로 일반화하지 않음.                                     |
| S08 | [Authorization via roles](https://www.palantir.com/docs/apollo/core/authorization)                                                                                 | Team·역할·자원 범위의 RBAC. 특정 고객의 권한 설정을 확인한 것이 아님.                                                                      |
| S09 | [Configure a Release promotion pipeline](https://www.palantir.com/docs/apollo/managing-release-channels/configure-promotion-pipeline)                              | 시간·canary·Health 승격 평가, Health 미제공 시 해당 평가의 실패 판정 제한.                                                                 |
| S10 | [Recalling Releases](https://www.palantir.com/docs/apollo/recalling-releases/overview)                                                                             | 추가 확산 차단과 roll-off. 반드시 직전 버전·데이터로 복귀한다는 뜻이 아님.                                                                 |
| S11 | [Export and Import](https://www.palantir.com/docs/apollo/export-import/overview)                                                                                   | Source·Target Hub, Bundle, 아티팩트 접근이 없을 때 별도 이미지 전달 책임.                                                                  |
| S12 | [Managing Changes](https://www.palantir.com/docs/apollo/managing-changes/overview)                                                                                 | 운영자 수동 변경·승인. 모든 자동 변경의 건별 사람 승인으로 확대하지 않음.                                                                  |
| S13 | [Accenture and Palantir Transform Cybersecurity with Apollo](https://newsroom.accenture.com/blogs/2026/accenture-and-palantir-transform-cybersecurity-with-apollo) | 2026-06-04 협력 확대, 취약점 대응과 소프트웨어 변경 연결. 독립 ROI 평가가 아님. Security Forge 세부 시연 전체를 이 페이지로 입증하지 않음. |
| S14 | [Palantir의 Live Edge 발표](https://www.linkedin.com/posts/palantir-technologies_palantir-activity-7247199838541352961-RVeJ)                                       | 2024-10-02 공식 게시물, Edgescale AI 협력, Virtual Connected Edge(VCE). 현행 장비별 지원 행렬이 아님.                                      |

## 원문 대비 교정·유지 결정

| ID  | 원문 위치·주장                                       | 파생본 처리                                                                                                                   | 근거                           |
| --- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| C01 | L9–11, L32–40: 현대 구조도 2020 Skylab 중심으로 설명 | 현재는 Hub·Spoke·agents·Plan으로 설명. Skylab·SLS는 역사적 명칭으로 원본에 보존.                                              | S01–S06                        |
| C02 | L9, L144–146, L194: Git의 하나의 목표 버전·설정      | 현행 Apollo를 단일 고정 목표 상태와 동일시하지 않음. Product·Channel·설정·제약에서 Plan 결정.                                 | S02–S04                        |
| C03 | L11, L144, L338–355: 최소 자원·설치 문서가 거의 없음 | Kubernetes Spoke 준비 조건 공개로 교정. 최소 3노드, 전체 control plane 권장 10 vCPU·16GB, x86_64 등은 범위를 함께 기록.       | S05                            |
| C04 | L238: SSO·권한도 불명확                              | 공개 SAML·Palantir Auth·자원 범위 RBAC를 기록. 완전한 인증 프로토콜·수명 정책은 미확인 유지.                                  | S07–S08                        |
| C05 | L11, L229–236: 네트워크 정보 부족                    | 일부 구성·연결 조건은 공개됨. TCP 9111은 선택적 webhook 연결에 한정, 전체 포트 행렬로 확대하지 않음.                          | S05–S06                        |
| C06 | L117–141, L198–224: 오프라인 snapshot·binary 전달    | 역사적 도식 그대로 보존하고 현행 Bundle 경로 추가. Source Hub 저장소 접근이 없으면 이미지 반입은 별도 조직 책임.              | S11                            |
| C07 | L175–177, L254–263: recall/rollback 병렬 표현        | 회수와 상태 복구를 분리. Plan 실패 및 상태 변경 조건, suppression 차이, DB·외부 업무 효과 별도 복구 명시.                     | S02·S04·S10                    |
| C08 | L175–177, L325: Health 평가                          | 제공하지 않는 Health는 해당 승격 평가의 실패 판정에 제한. 모든 실패 감지 부재가 아님.                                         | S09                            |
| C09 | L115, L308: Virtual Compute Environment              | 공식 발표의 Virtual Connected Edge(VCE)로 교정.                                                                               | S14                            |
| C10 | L250, L302: 2020 로그 규모·41,000회 업데이트         | 원문 주장과 역사적 시점으로 보존. 원래 기술 글 전체를 이번에 재확보하지 못했으므로 현행 처리량·SLA로 승격하지 않음.           | 원문, 재검증 보류              |
| C11 | L240–246: 회사 차원 인증·IL6 사례                    | 원본 목록은 보존. 실제 구매 offering·지역·호스팅·경계 확인 필요. 이번 번들에서 모든 인증 유효성을 재인증했다고 주장하지 않음. | 범위 제한; 개별 인증 확인 보류 |
| C12 | L304–306: Accenture Security Forge 시연              | 확인한 2026-06-04 협력 발표까지만 새 사실로 사용. 시연 세부·장기 ROI를 새 출처에 소급 연결하지 않음.                          | S13                            |
| C13 | L281–285: Marketplace·군 조달을 이용한 가격 추론     | 특정 제품 견적·라이선스 단위·SLA 미확인 유지. 회사 전체 조달을 Apollo 가격으로 환산하지 않음.                                 | 미확인·범위 제한               |
| C14 | L287–294: 환경별 TCO 높음·중간                       | 원본 정성표 보존. 공개 글에서는 비용 발생 항목과 측정 질문으로 재구성. 실측 순위가 아님.                                      | 운영 해석                      |
| C15 | L332–336: bad v3·rollback PoC                        | 격리된 시험 환경으로 한정하고 결과를 얻은 실험처럼 표현하지 않음. 데이터 복구·재접속·반입 예외를 검증 항목으로 추가.          | 운영 제안                      |

## 보존 정책과 재검증

역사적 세부가 최신 문서로 확인되지 않는다고 삭제하지 않는다. 원본 위치와 상태를 명시해 후속 조사가 재개될 수 있도록 한다. 반대로 원문에 있었다는 이유만으로 현행 사실로 발행하지도 않는다. 불변 원본의 바이트 일치, 파생 문서의 의미 범위, 외부 사실의 현재성, 공개 배포 성공은 서로 다른 검증이다.

도판은 원본에 포함된 네 Mermaid 코드 외에 새 글의 구조를 설명하는 네 PNG가 필요하다. 신규 PNG의 생성·픽셀 검수와 글·링크·빌드 검증이 끝나기 전까지 발행 준비 완료로 표시하지 않는다. 실제 공개 상태는 `artifacts/publication/palantir-apollo-operations-guide/`의 실행 기록으로 확인한다.

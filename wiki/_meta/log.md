---
title: "위키 변경 로그"
type: meta
status: active
source_of_truth: false
created: 2026-09-11
updated: 2026-09-11
---

# 위키 변경 로그

## 2026-09-11 — Apollo 운영 심층 보고서 보존·위키화

사용자가 첨부한 보고서의 보존·위키화·블로그 배포를 요청했다. 기존 로컬 위키의 색인·로그에서 Apollo 운영환경 출처와 Foundry·AIP 검증 경로를 읽고, 기존 34번 공개 글과 중복 범위를 비교했다. 이 번들은 최신 원격 main 기반의 별도 작업 트리에서 생성했으며 기존 dirty 파일을 덮어쓰거나 원래 vault 전체를 발행 범위에 넣지 않았다.

입력은 [불변 원문](../../research/palantir-apollo-operations-20260911/source-original.md), 52,532bytes, SHA-256 `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`다. [근거·교정 원장](../../research/palantir-apollo-operations-20260911/README.md), [출처 메모](../sources/palantir-apollo-operations-report-2026-09-11.md), [운영 분석](../analyses/palantir-apollo-operations-2026-09-11.md), [검증 플레이북](../playbooks/palantir-apollo-adoption-validation.md)을 추가했다.

[수집 영수증](ingest_reports/apollo-operations-20260911.md)에 원문 7절·9표·4도식·62산문 블록의 경로를 기록했다. 이는 보존 커버리지이며 사실 전수 검증률이 아니다. 현행 Hub·Spoke·Plan, 공개 Kubernetes Spoke 준비 조건, SAML·RBAC, Bundle의 별도 이미지 예외 등을 새 근거로 교정했다. 역사적 수치·사례와 가격·인증 경계·Hub HA 등 미확인 사항은 그 상태를 유지했다.

기존 34번 글을 유지하고 [37번 후속 원고](../../content/notes/온톨로지/palantir-apollo-operations-guide.md)를 작성했다. 새 네 PNG를 제작했으며 일부 대상 픽셀 검수와 사이트 검증·배포는 아직 진행 중이다. 현재 로그는 공개 배포 완료를 의미하지 않는다. 후속 실행 결과는 검증이 끝난 뒤 기록한다.


## 2026-09-11 — 발행 전 검증 통과

원문 해시·위키 연결·독자 이해·네 도판의 의미·16:9 최종 픽셀·본문·경로·타입·형식·122개 테스트·Quartz 빌드를 확인했다. 동시 발행된36번 글을 보존하고 이 운영 가이드를37번으로 정리했다. 현재 상태는 PR 준비이며 공개 배포는 아직 확인하지 않았다. 상세 근거는 [발행 게이트](../../artifacts/publication/palantir-apollo-operations-guide/release-gates.json)에 있다.

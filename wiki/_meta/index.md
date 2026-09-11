---
title: "지식 색인"
type: meta
status: active
source_of_truth: false
created: 2026-09-11
updated: 2026-09-11
---

# 지식 색인

이 원격 저장소의 위키는 원문을 대체하지 않는 파생 지식입니다. 원본은 `research/`, 공개 글은 `content/notes/`에 두며, 위키는 출처와 판단·검증 절차를 연결합니다. 기존 로컬 vault 전체가 아니라 아래의 명시적 수집 번들이 이 원격 트리에 포함돼 있습니다.

## Apollo 운영 보고서 · 2026-09-11

[불변 원본과 새 근거·교정 원장](../../research/palantir-apollo-operations-20260911/README.md)에서 입력의 출처와 SHA-256을 확인할 수 있습니다. [출처 메모](../sources/palantir-apollo-operations-report-2026-09-11.md) → [운영환경·설치·복구 책임 지도](../analyses/palantir-apollo-operations-2026-09-11.md) → [도입 검증 플레이북](../playbooks/palantir-apollo-adoption-validation.md) 순서로 읽습니다.

[수집·보존 영수증](ingest_reports/apollo-operations-20260911.md)은 원문 7개 절·9개 표·4개 도식·62개 산문 블록의 대응과 검증 한계를 기록합니다. [독자용 심층 글](../../content/notes/온톨로지/palantir-apollo-operations-guide.md)은 기존 [34번 Apollo 글](../../content/notes/온톨로지/palantir-apollo-operating-change.md)을 유지하는 후속 편입니다. 배포 여부는 [변경 로그](log.md)의 검증 기록을 참조합니다.

<!-- LLM_WIKI_INDEX_START -->

## Generated Page Index

이 구간은 `python3 scripts/llm_wiki.py reindex`가 관리한다.

### Meta

- [[_meta/ingest_reports/apollo-operations-20260911|Apollo 운영 보고서 수집·보존 영수증]] — 사용자는 첨부 Markdown의 보존·위키화·블로그 배포를 요청했다. 입력은 `file_000000000c3082308cb6ef295999ea87` 한 파일이며, 원래 리서치 세션의 URL 원장·별도 첨부 이미지는 제공되지 않았다.
- [[_meta/log|위키 변경 로그]] — 사용자가 첨부한 보고서의 보존·위키화·블로그 배포를 요청했다. 기존 로컬 위키의 색인·로그에서 Apollo 운영환경 출처와 Foundry·AIP 검증 경로를 읽고, 기존 34번 공개 글과 중복 범위를 비교했다. 이 번들은 최신 원격 main 기반의 별도 작업 트리에서 생성했으며 기존 dirty 파일을 덮어쓰거나 원래 vault 전체를 발행 범위에 넣지 않았다.

### Analyses

- [[analyses/palantir-apollo-operations-2026-09-11|Apollo 운영환경·설치·복구 책임 지도]] — Apollo의 가치를 검토할 때는 배포 기능의 개수보다 **동일 소프트웨어를 서로 다른 연결·보안 경계에서 변경하면서 어떤 책임을 공통화하고 무엇을 현장에 남길지**를 본다. 이 문서는 사용자가 보존을 요청한 보고서를 운영 판단에 재사용하도록 정리한 파생 분석이다. 제품 설치 표준이나 고객별 아키텍처를 대신하지 않는다.

### Playbooks

- [[playbooks/palantir-apollo-adoption-validation|Apollo 도입·실패·복구 검증 플레이북]] — 작은 소프트웨어의 전달·관측·실패·복구를 **격리된 시험 환경**에서 검증한 뒤 대상 환경을 넓히는 제안이다. Palantir 공식 도입 표준, 실제 설치 명령, 자동 변경 승인 또는 실험 결과가 아니다. 출처와 미확인 사항은 [보고서 메모](../sources/palantir-apollo-operations-report-2026-09-11.md), 판단 구조는 [운영 책임 지도](../analyses/palantir-apollo-operations-2026-09-11.md)를 참조한다.

### Sources

- [[sources/palantir-apollo-operations-report-2026-09-11|Apollo 운영 심층 보고서 출처·교정 메모]] — 사용자가 첨부한 「팔란티어 아폴로 심층 리서치」 단일 Markdown을 수집했다. **원본 52,532바이트 전체**는 [연구 원문](../../research/palantir-apollo-operations-20260911/source-original.md)에, 출처·교정 결정은 [연구 원장](../../research/palantir-apollo-operations-20260911/README.md)에 있다. SHA-256은 `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`다.

<!-- LLM_WIKI_INDEX_END -->

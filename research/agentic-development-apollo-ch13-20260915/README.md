# Apollo 13장 중심 개정의 출처와 편집 기준

- 기준일: 2026-09-15
- 공개 글: [38. 에이전틱 개발에서 다시 만난 아폴로](../../content/notes/온톨로지/agentic-development-apollo-change-promotion.md)
- 직접 검토한 자료: 제공된 『팔란티어 파운드리, 판단을 설계하라』 연구용 구조 노트 합본의 CHAPTER 13 「아폴로와 운영 환경」, 앱 기준 p.182~.
- 자료의 성격: 독서·연구 노트. 책 원문 전체를 직접 검증한 자료나 고객의 실제 운영 로그가 아니다.

## 출처의 역할

독서노트를 논제·사례·강조점의 우선 기준으로 삼았다. Apollo의 release를 온톨로지·파이프라인·앱·권한을 묶은 판단 구조의 배포 단위로 소개하는 노트의 설명을 본문에 명시했다. 공식 문서의 Product Release는 코드·관리 메타데이터를 포함한 소프트웨어 버전이라는 더 좁은 정의이므로, 전체 묶음의 일괄 배포·복구 보장은 아니라는 차이를 바로 뒤에서 짧게 밝혔다.

판단의 영향 범위 격리, 현업 리허설·합의, 작은 판단 변화, 변경 케이스, 부분 장애의 판단 보호, 현재 기준의 이유를 보존하는 기록은 13장에서 가져왔다. 특정 배치에 한시 적용되는 액션은 노트에 서술된 실습이다. 품질 담당자의 승인·예외 종료·데이터 지연 대응을 잇는 세부는 집필용 가상 설계로 구분했다.

## 제품 사실과 비교 자료

- [Apollo 개요](https://www.palantir.com/docs/apollo/core/overview): Hub·Spoke의 조율·실행·상태 보고.
- [Product Release](https://www.palantir.com/docs/apollo/core/products-releases-versions): 코드와 관리 메타데이터를 포함한 버전.
- [작동 방식](https://www.palantir.com/docs/apollo/core/how-apollo-works): 보고 상태와 Plan 실행·실패 시 복구.
- [승격 파이프라인](https://www.palantir.com/docs/apollo/managing-release-channels/configure-promotion-pipeline): 시간·시험 대상·Health 평가와 미제공 시 제한.

위 네 문서는 개정일에 재확인했다. 나머지 제품·PR·스킬 근거는 기존 38번 글의 링크와 인용 범위를 유지했다. 가재코드의 브랜치 설명은 본문에 고정한 기여 지침 revision과 PR 기록에 한정한다. PR의 테스트는 작성자 보고이며 재실행하지 않았다. Paperthin·DocTology와의 연결은 운영 원리의 비교이며 동일 구현이나 실측 우열을 주장하지 않는다.

## 편집 범위

기본 채널의 버전 형식별 분류와 반복된 승격 설명은 줄였다. 변경 요청 → 판단 구조 → 환경별 리허설·합의 → 적용·관찰 → 판단 보호 → PR·학습·현재 사실의 기록으로 독자 경로를 재구성했다. 기존 34번·37번은 역할이 다른 관련 글로 연결했다.

제공된 합본의 전체 내용은 이 공개 출처 메모에 재수록하지 않는다. 원본 식별용 해시와 편집·이미지·배포 검증 기록은 작업 artifact에서 관리한다.

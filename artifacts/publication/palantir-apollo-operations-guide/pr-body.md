## 변경 내용

첨부 Apollo 운영 심층 보고서를 원문 바이트 그대로 보존하고, 출처·교정 원장과 재사용 가능한 위키, 37번 운영 가이드로 정리합니다. 기존34번 Apollo 글과 동시 발행된36번 Ontology 글은 유지합니다.

- 원문52,532bytes, SHA-256 `ba4d4aa6852d37d94b24f671b3f8d5cdf07a53511b40b6cbac812eff1684471f`; 7절·9표·4Mermaid·62산문 블록의 보존 위치 기록
- 현재 공식 문서14개에 기반한 Hub·Spoke·Plan, Kubernetes Spoke·SAML·RBAC, Bundle 이미지 예외 등의 교정. 역사적 수치·가격·전체 지원·복구 보장의 미확인 상태 유지
- 출처·분석·검증 플레이북, 수집 영수증, 색인·로그를 함께 Git 보존. 현재AGENTS에 따라 이 번들의 위키 파일만 추적하며 기존 로컬vault는 포함하지 않음
- 4개 새PNG와4Mermaid를 포함한 심층 글. 생성 도판은 내용픽셀을 유지한16:9여백 처리 및 실제픽셀 검수
- `.prettierignore`에는 이 불변 원본 한 파일만 예외 추가. Quartz설정·프레임워크·의존성·잠금파일은 변경하지 않음

## 검증

`npm run check`, `npm test`(122/122), `npx quartz build`, 보고서이미지·본문·built-output검사, Quartz v5경로검사 통과. 원문해시·기존글불변·4PNG·14각주·위키연결도 검사했습니다. 상세기록은 `artifacts/publication/palantir-apollo-operations-guide/`에 있습니다.

모바일에서 도판 핵심 논제는 읽을 수 있으나 작은 보조레이블은 확대가 필요합니다. npmci는 기존의존성 취약점9개(낮음1·중간1·높음7)를 보고했습니다. 의존성 수정은 이 콘텐츠 발행의 범위에 포함하지 않았습니다.

## 배포

main병합 후 일치하는commit의GitHubPages실행과 새 글·4이미지응답을 별도로 검증합니다. 이 PR작성 시점에는 배포완료를 주장하지 않습니다.

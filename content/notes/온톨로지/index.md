---
title: "온톨로지"
description: "온톨로지, 지식그래프, 의미 계약, 문맥 컴파일과 에이전트 검증을 연결해 읽는 1~24번 글 모음입니다."
---

# 온톨로지

온톨로지는 단순한 용어 목록이 아니라, **개념·관계·근거·제약·권한을 공유하는 의미 계약**입니다. 이 카테고리는 온톨로지 에이전트 시리즈 1~24번을 공개 글의 순서와 설계 책임의 흐름에 따라 묶습니다.

## 추천 읽기 경로

처음 읽는다면 다음 순서가 가장 짧습니다.

1. [1. 온톨로지 에이전트](ontology-agent-guide): 온톨로지·지식그래프·LLM·에이전트의 기본 경계를 잡습니다.
2. [5. 온톨로지 도입 비교 실험](ontology-agent-behavior-experiment) → [6. JSON 규칙과 온톨로지](ontology-vs-json-rules): 언제 온톨로지가 필요한지 기준선을 세웁니다.
3. [8. OpenCrab 온톨로지 빌드](opencrab-ontology-build-architecture) → [9. 문맥 컴파일러](ontology-context-compiler-opencrab) → [10. Expertise Pack](ontology-expertise-pack): 지식을 만들고 질문에 공급하는 구조를 봅니다.
4. [11. KG-guided LLM Planning](kg-guided-llm-planning) → [12. 반복 조사·반증 루프](iterative-investigation-refutation-loop) → [13. 시니어 조사·판단 하네스](ontology-senior-investigation-harness) → [14. Pi Agent × DuckCrab 동적 DAG](pi-agent-duckcrab-dag-harness): 계획·검증·실행을 분리합니다.
5. [15. 지식 중심 자기개선](knowledge-centric-self-improvement)부터 [24. 에이전트 평가 증거 사다리](agent-evaluation-evidence-ladder)까지: 지식 수명주기, 문맥 손실, 권한, 검색, 평가의 운영 경계를 확장합니다.

## 이 카테고리에서 보는 것

- 의미 계약과 승격 거버넌스: 후보 지식을 정본과 행동으로 승격하기 전의 검증·승인·rollback
- 도입 경계와 구현: JSON 규칙·검색 카드·SHACL·온톨로지의 비용과 이득 비교
- 지식 Pack과 문맥 컴파일: 지속 지식과 질문별 Context Bundle의 분리
- 조사·실행 하네스: 반례·조건부 판단·DAG·실행 호스트·정본 권위의 분리
- 운영 안전성: 메모리 승격, 권한 lease, GraphRAG 경로, 생성 충실도와 평가 증거

아래 목록은 Quartz의 FolderPage가 이 폴더에 포함된 24개 글을 자동으로 표시합니다. 각 글의 본문과 인용이 공개 정본이며, 이 페이지는 탐색을 위한 카테고리 입구입니다.

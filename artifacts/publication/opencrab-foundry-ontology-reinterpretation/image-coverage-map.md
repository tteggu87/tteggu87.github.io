# Image coverage map

## Shared visual system

- Format: 16:9 report infographic, Korean labels, mobile-readable.
- Style: clean technical editorial diagram, off-white background, restrained navy·teal·amber accents, thin lines, generous whitespace.
- Evidence rule: only article-supported labels, counts and relationships.
- Distinct compositions: lead comparison map, scenario graph, constrained grammar map, lifecycle pipeline.

## Lead infographic

**File:** `opencrab-foundry-ontology-reinterpretation-infographic.png`

**Question:** Foundry and OpenCrab address the same operational ontology problem in what different ways?

**Must show:**

- Left: Foundry `Object · Property · Link → Action · Function → Security · Governance → Operational apps and agents`.
- Right: OpenCrab `Source · Evidence → 9-Space graph → Quality/Promotion → Pack → MCP agents`.
- Center thesis: `복제본이 아니라 운영 온톨로지 문제의 경량 재해석`.
- Bottom comparison: Foundry strength `운영 변경과 통합`, OpenCrab strength `근거 수집·이동성·Agent 연결`.
- Caveat ribbon: `공개 코드 기준 OpenCrab은 알파 단계의 로컬 온톨로지 공장`.

## Figure 01

**File:** `opencrab-foundry-ontology-reinterpretation-figure-01.png`

**Question:** One equipment inspection decision maps to the nine semantic roles how?

**Must show:**

- Center: `설비 점검 주기 30일 → 14일`.
- Subject: 현장팀, 정비 책임자.
- Resource: 설비 매뉴얼, 점검표, 센서 데이터, API.
- Evidence: 진동 측정값, 고장 로그, 보고서 문장.
- Concept: 베어링 마모, 진동 증가.
- Claim: `진동 증가가 고장 위험을 높인다`.
- Community: 반복 고장 패턴 묶음, marked optional.
- Outcome: 비가동 시간, 고장 위험, 정비 비용.
- Lever: 점검 주기, 교체 임계값.
- Policy: `주기 변경은 책임자 승인 필요`.
- Arrows must preserve `Evidence → Claim`, `Concept → Outcome`, `Lever → Outcome`, `Policy → Subject/Resource` directions.

## Figure 02

**File:** `opencrab-foundry-ontology-reinterpretation-figure-02.png`

**Question:** What safety and expressive cost does the closed 9-Space grammar create?

**Must show:**

- Nine Space nodes grouped as 행동, 지식, 결정·통제.
- Exactly 11 allowed directional space-pairs as the article lists.
- Small label: `9 × 9 = 81개 방향 중 11개 허용`.
- Left benefit: `LLM 관계 남발 억제`, `Pack 공통 질문`, `문법 검증`.
- Right cost: `Subject↔Subject 부족`, `Resource↔Resource 부족`, `Claim의 대상 연결 부족`, `도메인 관계 압축`.
- Bottom dual-layer recommendation: `도메인 그래프의 정확한 관계 + 9-Space 역할 투영`.

## Figure 03

**File:** `opencrab-foundry-ontology-reinterpretation-figure-03.png`

**Question:** How do Pack and MCP move knowledge, and where are the current enforcement gaps?

**Must show:**

- Pipeline: `Mission → 수집·파싱 → Evidence 색인 → 9-Space Node·Edge → 문법·품질 검사 → OpenCrab Pack v1 → MCP → Agent`.
- Pack contents: manifest, nodes/edges, evidence index, quality report, Neo4j verified snapshot.
- MCP core groups: ontology/search, workflow/approval, identity/canonicalization, promotion, schema pack, billing, harness.
- Solid gates: grammar validation, Pack artifact contract.
- Dotted or caution gates: approval not universal, promotion not universal, Pack federation contract absent, QueryResult not AnswerBundle.
- Closing label: `지식 유통은 보이지만 운영 강제와 Pack 연합은 아직 미완성`.

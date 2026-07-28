---
title: "16. 올바른 지식이 잘못된 답이 되는 순간: 문맥 컴파일 회귀를 검증하는 법"
description: "정확한 Pack이 왜 잘못된 작업 문맥으로 변하는지, Obligation Set·Receipt·보안 및 그래프 회귀 probe로 진단하는 방법과 DuckCrab 계약 스모크를 정리한다."
date: 2026-07-29
tags:
  - RAG
  - 문맥컴파일
  - LLM평가
  - 지식그래프
  - AI보안
---

![원문과 지식 Pack이 검색·선택·압축·검증을 거쳐 작업용 Context Bundle로 변하는 과정](../attachments/context-compilation-regression/context-compilation-regression-infographic.png)

> [!summary]
> 정확한 원문과 Pack이 있어도 실제 에이전트가 읽는 짧은 문맥은 틀릴 수 있습니다. 그래서 정본 검증과 작업용 Context Bundle 검증을 나누고, 필수 의무의 보존·출처와 revision·외부 명령 격리·그래프 관계 무결성을 함께 검사해야 합니다. 이번 글의 DuckCrab 결과는 이 계약이 누락과 mutation을 잡는지 확인한 제한적 스모크이며, 모델이나 압축기의 성능 우월성을 증명한 benchmark가 아닙니다.

어떤 기술 검토 시스템이 최신 정책, 승인 근거, 예외 조항을 모두 올바르게 저장하고 있다고 가정해 보겠습니다. 사용자가 “이 재료를 지금 현장에 적용해도 되는가?”라고 물었을 때 검색 결과에는 허용 조건과 금지 조건이 모두 들어왔습니다. 그런데 토큰을 줄이는 과정에서 “현장별 별도 승인 필요”가 빠졌고, 최종 답은 “적용 가능”으로 정리됐습니다.

지식베이스가 틀린 것이 아닙니다. 검색도 완전히 실패하지 않았습니다. **정확한 지식이 작업용 문맥으로 변환되는 사이에 판단을 바꾸는 조건이 사라졌습니다.**

이 글에서는 이런 현상을 **문맥 컴파일 회귀**라고 부릅니다. 확립된 표준 용어가 아니라, 이 프로젝트에서 다음 실패를 한 번에 추적하기 위한 분석 이름입니다.

> 원문·Pack·정책은 정확하지만 질문 해석, 검색, 선택, 압축, 배열, revision 결합 또는 task adapter가 바뀐 뒤 실제 에이전트가 읽는 문맥에서 필수 근거·반례·정책·미지·revision이 빠지거나, 외부 자료 속 명령이 제어 지시처럼 취급되는 현상.

[[notes/ontology-context-compiler-opencrab|9번 글]]이 온톨로지와 Pack을 문맥 컴파일러로 보는 관점을 제시했다면, [[notes/knowledge-centric-self-improvement|15번 글]]은 여러 작업의 경험을 검증된 공유 지식으로 승격하는 수명주기를 다뤘습니다. 이번 글은 그 다음 단계입니다. **좋은 지식을 만들었다는 사실과, 지금 질문에 전달된 문맥이 좋다는 사실을 분리해 검증합니다.**

## Pack 정확성과 Context Bundle 정확성은 다릅니다

문맥 컴파일러는 질문을 해석하고, 필요한 의미 역할을 정하고, 후보 근거를 검색·선택하며, 제한된 예산에 맞춰 압축·배열한 뒤 Context Bundle을 만듭니다.

```text
질문 계약
→ retrieval
→ selection / reranking
→ trust-boundary check
→ compression / synthesis
→ ordering / formatting
→ Context Bundle
→ validator
→ 답변·행동
```

최종 답만 보고 실패를 판단하면 원인을 찾기 어렵습니다. 적어도 다음 층을 구분해야 합니다.

1. **질문 계약 실패:** Policy·Counterevidence·Unknown을 처음부터 요구하지 않았습니다.
2. **검색 실패:** 정본에는 있지만 후보 집합에 들어오지 않았습니다.
3. **선택 실패:** 후보에 있던 금지 조항이나 반례가 제거됐습니다.
4. **압축 실패:** 예외 조건, 단위, 출처 위치와 revision이 사라졌습니다.
5. **배열 실패:** 정보는 들어 있지만 위치와 순서 때문에 이용되지 않았습니다.
6. **revision·권한 실패:** 오래된 정책이나 허용되지 않은 자료가 섞였습니다.
7. **생성 실패:** Bundle이 완전해도 모델이 무시하거나 잘못 인용했습니다.
8. **명령 경계 실패:** 외부 문서의 지시가 분석할 데이터가 아니라 상위 명령처럼 작동했습니다.
9. **그래프 무결성 실패:** 문장은 그대로인데 잘못된 edge와 경로가 추론 재료를 바꿨습니다.

![정본·컴파일러·에이전트 이용 단계에서 서로 다르게 발생하는 아홉 가지 실패 위치](../attachments/context-compilation-regression/context-compilation-regression-figure-01.png)

RAGAs, ARES, RAGChecker와 RAGVUE가 검색 문맥, 관련성, faithfulness, 완전성과 생성 오류를 분리하려는 이유도 같습니다. 최종 답 하나로는 retrieval과 generation 중 어디가 잘못됐는지 진단하기 어렵습니다.[src_004](#src-004) [src_005](#src-005) [src_006](#src-006) [src_010](#src-010)

## 포함됐다는 사실과 이용됐다는 사실도 다릅니다

`Lost in the Middle`은 관련 정보의 위치에 따라 긴 문맥 과업 성능이 달라질 수 있음을 보고했습니다. `Found in the Middle`은 U자형 positional attention bias를 분석하고 보정 방식을 제안했습니다.[src_003](#src-003) [src_011](#src-011) 후속 연구에서는 모든 모델이 깔끔한 U자형 패턴을 보이는 것은 아니며, 정보 표현과 위치 변화의 영향도 모델마다 달랐습니다.[src_012](#src-012)

따라서 “필수 조항이 Bundle에 있다”만 확인해서는 부족합니다. 회귀 probe에는 다음 교란이 필요합니다.

- 같은 근거의 순서를 여러 번 섞습니다.
- 결정적 정책을 시작·중간·끝으로 옮깁니다.
- 표면적으로 관련된 distractor를 추가합니다.
- 주장과 반례의 거리를 바꿉니다.
- 여러 턴 뒤에도 caveat가 유지되는지 확인합니다.

## 압축의 비용은 답변 점수와 근거 보존에서 다르게 보입니다

RECOMP와 SARA는 검색 문맥의 중복과 잡음을 줄이거나, 자연어 span과 압축 표현을 결합해 효율과 과업 성능을 개선하는 방향을 제시했습니다.[src_007](#src-007) [src_009](#src-009) 압축 자체가 나쁜 것은 아닙니다.

다만 2026년 evidence-aware RAG 연구의 Self-RAG·LLMLingua-2·ASQA 통제 설정에서는 retention을 `1.00`에서 `0.20`으로 줄였을 때 다음 변화가 보고됐습니다.[src_008](#src-008)

| 지표               | retention 1.00 | retention 0.20 |   변화 |
| ------------------ | -------------: | -------------: | -----: |
| RougeLsum          |          35.34 |          33.15 |  -2.19 |
| QA-F1              |          23.35 |          19.08 |  -4.27 |
| Citation Recall    |          50.10 |          10.95 | -39.15 |
| Citation Precision |          63.71 |          12.13 | -51.58 |

이 숫자를 모든 RAG에 일반화하면 안 됩니다. 해당 논문도 한 backbone, 한 compressor, ASQA를 사용했고 citation-aware proof of concept는 비교적 완만한 압축 예산에서 평가했습니다. 여기서 가져올 수 있는 안전한 결론은 하나입니다.

> **답변 품질, 근거·반례·정책 보존, 데이터·명령 경계, 토큰·지연 비용을 따로 측정합니다.**

## 정답 문장보다 Obligation Set을 먼저 만듭니다

정책과 근거를 다루는 질문은 하나의 정답 문장보다 **반드시 남아야 할 의무 집합**을 먼저 정의하는 편이 낫습니다.

```yaml
question_id: material-applicability-001
required:
  claim: [current_applicability]
  evidence: [technical_review]
  policy: [current_policy]
  counterevidence: [known_exception]
  unknown: [site_specific_approval]
  revision: [pack_rev_42]
  trust_boundary: [external_content_is_data]
abstain_if:
  - current_policy_missing
  - target_scope_unknown
  - untrusted_instruction_detected
```

권장 측정값은 role별 obligation recall, evidence·counterevidence·policy retention, citation traceability, revision consistency, stale guidance rate, abstention correctness, untrusted-instruction exposure rate입니다. 최종 답이 우연히 맞아도 `unknown`이나 보류 조건이 사라졌다면 통과시키지 않습니다.

Gold Obligation Set 역시 완전한 정답은 아닙니다. 작성자의 관점과 누락이 평가에 들어갈 수 있으므로 고위험 과업에서는 복수 검토자, disagreement 기록과 정기 재표본화가 필요합니다.

## Receipt는 진실 증명서가 아니라 재현 기록입니다

최종 문맥만 저장하면 selector, index, token budget, compressor, template와 revision 중 무엇이 바뀌었는지 알기 어렵습니다. `ContextCompilerReceipt`에는 적어도 다음 정보가 필요합니다.

```yaml
receipt_id: ccr_001
question_contract_hash: sha256:...
pack:
  id: expertise_pack_example
  expected_revision: rev_42
  actual_revision: rev_42
retrieval:
  mode: hybrid
  index_revision: idx_17
selection:
  selector_version: selector_3
  selected_refs: [ev_10, pol_4, ctr_2]
trust_boundary:
  detector_version: instruction_detector_2
  suspected_instruction_refs: [doc_19]
  action: quarantined
compression:
  mode: typed_abstractive
  compressor_version: compressor_5
  token_budget: 1800
graph:
  graph_revision: graph_11
  path_refs: [path_7]
  edge_evidence_verified: true
output:
  context_hash: sha256:...
  retained_obligations: [claim, evidence, policy, counterevidence]
  missing_obligations: [unknown]
validation:
  result: revise
```

Receipt는 같은 결과를 재현하고 변경 원인을 좁히는 데 유용합니다. 그러나 필드가 모두 채워졌다고 내용이 참이 되는 것은 아닙니다. 질의, 후보 목록과 tenant 정보가 민감할 수 있으므로 불변 식별자·해시, 최소 보존, 권한 분리, 접근 로그와 보존 기간도 별도 계약으로 다뤄야 합니다.

## 외부 문서는 근거이면서 공격 표면입니다

RAG는 외부 문서를 모델 문맥으로 옮깁니다. 이때 “이전 지시를 무시하라” 같은 문장은 분석할 데이터일 수도 있고, 모델 행동을 바꾸려는 간접 prompt injection일 수도 있습니다.

AIP는 공유·재사용되는 instructional prompt가 retrieval 동작을 바꾸는 공격 표면이 될 수 있음을 보였고, 평가된 데이터셋별 설정에서 최대 `95.23%` 공격 성공률을 보고했습니다. 이 수치는 해당 모델·데이터·top-5 검색·judge 조건에 한정되며 일반 서비스 공격률이 아닙니다.[src_013](#src-013) InstructDetector는 외부 콘텐츠 속 명령을 탐지하는 방어를 제안하고, 자체 protocol에서 높은 ID·OOD 탐지율과 낮은 BIPIA 공격 성공률을 보고했지만 추가 계산 비용과 proprietary model 적용 제약도 남겼습니다.[src_014](#src-014)

따라서 compiler는 문자열을 줄이기 전에 다음 경계를 지켜야 합니다.

- 외부 콘텐츠는 기본적으로 **데이터**이며 상위 명령보다 낮은 신뢰 수준으로 표시합니다.
- 명령형 문장을 무조건 삭제하지 않습니다. 정상 정책과 매뉴얼도 명령문을 포함할 수 있습니다.
- 의심 문장은 격리하고, 인용 대상 텍스트로만 전달하거나 사람 검토로 보냅니다.
- compiler와 retriever의 공통 instructional prompt도 버전·해시·변경 검토 대상에 넣습니다.
- 성공 답변뿐 아니라 데이터가 제어 흐름으로 승격됐는지 probe로 검사합니다.

GraphRAG에서는 텍스트만 검사해도 부족합니다. LogicPoison은 세 공개 데이터셋, 세 LLM, 세 GraphRAG 방법을 대상으로 관계 구조를 겨냥한 공격을 연구했습니다. 정적 영어 corpus와 특정 threat model이라는 한계가 있지만, **edge와 path의 근거·revision·관계 타입을 별도 검증해야 한다**는 설계 근거는 제공합니다.[src_015](#src-015)

![외부 문서의 명령 격리, 재현용 Receipt, 그래프 관계 mutation 검사를 하나의 보안 경계로 연결한 도해](../attachments/context-compilation-regression/context-compilation-regression-figure-03.png)

## 최소 실험은 A부터 H까지 문맥만 바꿉니다

같은 질문, 모델, Pack revision과 예산을 고정하고 전달 문맥만 바꾸면 실패 위치를 더 잘 분리할 수 있습니다.

| 조건 | 전달 방식                                          | 확인할 것               |
| ---- | -------------------------------------------------- | ----------------------- |
| A    | 핵심 원문 span 직접 전달                           | 감사 가능한 상한        |
| B    | top-k 검색 결과 그대로                             | 일반 RAG 기준선         |
| C    | extractive compression                             | 원문 문장 보존          |
| D    | abstractive compression                            | 합성과 caveat 손실      |
| E    | typed Claim·Evidence·Policy·Counterevidence Bundle | 의미 역할 보존          |
| F    | E + Receipt + Obligation probe                     | 원인 추적과 재현        |
| G    | F + instruction detector·quarantine                | 데이터의 명령 승격 방지 |
| H    | G + edge evidence·topology mutation probe          | GraphRAG 관계 무결성    |

필수 probe는 순서 섞기, distractor 주입, caveat 이동, stale revision 혼합, token-budget sweep, 답할 수 없는 질문, multi-turn mutation, 문서 속 명령 주입, instructional prompt 변경, edge 방향·타입·경로 mutation입니다. 평균값뿐 아니라 최악 조건도 함께 봅니다.

### DuckCrab에서 실행한 제한적 계약 스모크

프로젝트의 `tteggu_ontology_agents_arxiv_v1` Pack에서 AgentPoison의 저자 보고 결과와 threat-model 한계를 묻는 고정 질문을 사용했습니다. 필수 의무는 공격 성공, benign impact, poison rate, white-box embedder 접근 한계의 네 가지였습니다.

| 조건                                      | 의무 보존 | 관찰                               |
| ----------------------------------------- | --------: | ---------------------------------- |
| 직접 원문                                 |       4/4 | 모든 의무 보존                     |
| DuckCrab graph-first top-k                |       4/4 | 모든 의무 보존                     |
| 제한된 extractive projection              |       3/4 | threat-model 한계 누락             |
| 고의 손실 claim projection                |       3/4 | threat-model 한계 누락             |
| Typed Bundle                              |       4/4 | claim·limit·evidence refs 보존     |
| Typed Bundle + Receipt                    |       4/4 | pack·source refs·context hash 기록 |
| 합성 외부 명령 probe                      |      검출 | 최종 Bundle에서 격리               |
| `SUPPORTS_CLAIM` → `CONTRADICTS` mutation |      검출 | 예상 관계와 불일치 확인            |

![A부터 H까지의 계약 스모크에서 보존된 의무와 누락된 caveat를 비교한 결과 도판](../attachments/context-compilation-regression/context-compilation-regression-figure-02.png)

> [!warning]
> 이 결과는 결정론적 **계약 스모크**입니다. LLM 답변 생성, citation faithfulness, 학습된 abstractive compressor, detector의 실제 false positive·false negative, graph 의미 정확성은 측정하지 않았습니다. 사용한 Pack에는 활성 vector index가 없어 `graph_first` 진단 경로를 사용했습니다.

이 스모크가 보여 준 것은 “typed bundle이 항상 더 좋다”가 아닙니다. **같은 질문에서 반드시 남아야 할 의무를 정하면, 짧아지는 과정에서 어떤 caveat가 빠졌는지 기계적으로 잡을 수 있다**는 최소 가능성입니다.

## 기본 경로로 승격하기 위한 게이트

새 compiler를 기본값으로 바꾸려면 적어도 다음 조건을 만족해야 합니다.

- 필수 정책·반례·근거 retention이 기준 이하로 떨어지지 않습니다.
- stale revision과 권한 위반이 없습니다.
- 외부 문서의 지시가 상위 명령으로 실행되지 않습니다.
- edge·path의 evidence와 graph revision을 재현할 수 있습니다.
- 답변이 맞아도 grounding이 크게 악화되면 통과시키지 않습니다.
- 특정 배열이나 모델 하나에서만 이득이 나지 않습니다.
- 사람 표본 감사와 자동 judge가 크게 불일치하면 보류합니다.

별도 게이트가 항상 필요한 것은 아닙니다. 짧은 단일 출처 질문은 원문 span을 직접 전달하는 편이 더 단순하고 감사 가능합니다. 기존 RAG 평가에 provenance·revision·policy·보안 검사를 추가하는 것으로 충분한 시스템도 있습니다.

## 결론: 정본을 검증한 뒤, 전달된 문맥도 다시 검증합니다

좋은 Pack은 출발점입니다. 에이전트가 실제로 판단하는 것은 Pack 전체가 아니라 질문에 맞춰 잘린 작은 문맥입니다. 그 사이에는 retrieval, selection, compression, ordering, trust boundary와 graph projection이 있습니다.

따라서 근거·정책·revision·권한을 감사해야 하는 시스템에서는 다음 세 문장을 운영 계약으로 남길 가치가 있습니다.

```text
Pack validation ≠ Context Bundle validation
포함된 정보 ≠ 실제로 이용된 정보
Receipt ≠ 진실 증명
```

[[notes/kg-guided-llm-planning|11번 글]]이 지식그래프를 계획과 검증 신호에 연결하고, [[notes/pi-agent-duckcrab-dag-harness|14번 글]]이 조사 의무를 실행 가능한 작업 구조로 옮겼다면, 문맥 컴파일 회귀 검사는 그 작업에 들어가는 **실제 판단 재료의 품질을 고정하는 게이트**입니다.

다음 과제는 분명합니다. 활성 vector 경로, 실제 compressor와 복수 모델을 포함한 end-to-end 비교를 실행하고, obligation gold set과 사람 검토 비용까지 함께 측정해야 합니다. 그 전까지 이번 결과는 성능 우월성 주장이 아니라 **누락·명령 경계·관계 mutation을 찾기 위한 검증 설계와 제한적 스모크**로 읽어야 합니다.

## 출처

- <a id="src-001"></a> Wang et al. (2026). [Knowledge-Centric Self-Improvement — Official Project Page](https://recursive-knowledge.github.io/knowledge-centric-self-improvement/).
- <a id="src-002"></a> Wang, X. J. et al. (2026). [Knowledge-Centric Self-Improvement](https://arxiv.org/abs/2607.19592). arXiv:2607.19592.
- <a id="src-003"></a> Liu, N. F. et al. (2024). [Lost in the Middle: How Language Models Use Long Contexts](https://aclanthology.org/2024.tacl-1.9/). TACL 12.
- <a id="src-004"></a> Es, S. et al. (2024). [RAGAs: Automated Evaluation of Retrieval Augmented Generation](https://aclanthology.org/2024.eacl-demo.16/). EACL 2024.
- <a id="src-005"></a> Saad-Falcon, J. et al. (2024). [ARES: An Automated Evaluation Framework for Retrieval-Augmented Generation Systems](https://aclanthology.org/2024.naacl-long.20/). NAACL 2024.
- <a id="src-006"></a> Ru, D. et al. (2024). [RAGChecker: A Fine-grained Framework for Diagnosing Retrieval-Augmented Generation](https://arxiv.org/abs/2408.08067). arXiv:2408.08067.
- <a id="src-007"></a> Xu, F., Shi, W., & Choi, E. (2023). [RECOMP: Improving Retrieval-Augmented LMs with Compression and Selective Augmentation](https://arxiv.org/abs/2310.04408). arXiv:2310.04408.
- <a id="src-008"></a> Li, A., Peng, Q., & Chen, B. (2026). [Efficiency vs. Verifiability in Evidence-Aware RAG: Does Prompt Compression Preserve Citation Grounding?](https://aclanthology.org/2026.customnlp4u-1.19/). CustomNLP4U 2026.
- <a id="src-009"></a> Jin, Y. et al. (2026). [SARA: Selective and Adaptive Retrieval-augmented Generation with Context Compression](https://aclanthology.org/2026.acl-long.661/). ACL 2026.
- <a id="src-010"></a> Murugaraj, K. et al. (2026). [RAGVUE: A Diagnostic View for Explainable and Automated Evaluation of Retrieval-Augmented Generation](https://aclanthology.org/2026.eacl-demo.35/). EACL 2026.
- <a id="src-011"></a> Hsieh, C.-Y. et al. (2024). [Found in the Middle: Calibrating Positional Attention Bias Improves Long Context Utilization](https://aclanthology.org/2024.findings-acl.890/). Findings of ACL 2024.
- <a id="src-012"></a> Gupte, M. et al. (2025). [What Works for Lost-in-the-Middle in LLMs? A Study on GM-Extract and Mitigations](https://arxiv.org/abs/2511.13900). arXiv:2511.13900.
- <a id="src-013"></a> Chaturvedi, S. S. et al. (2025). [AIP: Subverting Retrieval-Augmented Generation via Adversarial Instructional Prompt](https://aclanthology.org/2025.emnlp-main.801/). EMNLP 2025.
- <a id="src-014"></a> Wen, T. et al. (2025). [Defending against Indirect Prompt Injection by Instruction Detection](https://aclanthology.org/2025.findings-emnlp.1060/). Findings of EMNLP 2025.
- <a id="src-015"></a> Xiao, Y. et al. (2026). [LogicPoison: Logical Attacks on Graph Retrieval-Augmented Generation](https://aclanthology.org/2026.acl-long.252/). ACL 2026.

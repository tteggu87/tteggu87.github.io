import { QuartzComponent, QuartzComponentConstructor } from "./types"
import style from "./styles/homeHero.scss"

const HomeHero: QuartzComponent = () => (
  <section class="home-hero" aria-labelledby="home-hero-title">
    <p class="home-hero-eyebrow">TTEGGU KNOWLEDGE ARCHIVE · SINCE 2026</p>
    <h1 id="home-hero-title">
      생각을 문서로,
      <br />
      문서를 <span>연결로.</span>
    </h1>
    <p class="home-hero-lead">
      직접 만들고 검증한 AI 에이전트, 온톨로지, 리서치 시스템의 기록을 쌓고 서로 연결합니다.
    </p>
    <div class="home-hero-actions">
      <a class="primary internal" href="./start-here">
        처음 읽기
      </a>
      <a class="secondary-action internal" href="./notes">
        노트 둘러보기
      </a>
    </div>
    <ul class="home-hero-topics" aria-label="주요 주제">
      <li>
        <a class="internal" href="./notes/ontology-agent-guide">
          1. 온톨로지 에이전트
        </a>
      </li>
      <li>
        <a class="internal" href="./notes/ontology-in-the-agentic-era">
          2. 에이전트 시대 온톨로지
        </a>
      </li>
    </ul>
  </section>
)

HomeHero.css = style
export default (() => HomeHero) satisfies QuartzComponentConstructor

from __future__ import annotations

from html import escape
from math import hypot
from pathlib import Path

WIDTH = 1600
HEIGHT = 900
BG = "#F7F3EA"
NAVY = "#17324D"
TEAL = "#2F7F7A"
AMBER = "#D89B32"
CHARCOAL = "#263238"
PALE_NAVY = "#E8EEF3"
PALE_TEAL = "#E5F1EF"
PALE_AMBER = "#F7ECD5"
WHITE = "#FFFFFF"
FONT = "Apple SD Gothic Neo, Pretendard, Noto Sans KR, sans-serif"
OUTDIR = Path(__file__).resolve().parent


def defs() -> str:
    return f"""
    <defs>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="7" flood-color="#17324D" flood-opacity="0.12"/>
      </filter>
      <marker id="arrowNavy" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L12,6 L0,12 z" fill="{NAVY}"/>
      </marker>
      <marker id="arrowTeal" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="strokeWidth">
        <path d="M0,0 L12,6 L0,12 z" fill="{TEAL}"/>
      </marker>
      <style>
        text {{ font-family: {FONT}; fill: {CHARCOAL}; }}
        .title {{ font-size: 46px; font-weight: 800; letter-spacing: -1px; }}
        .subtitle {{ font-size: 26px; font-weight: 650; }}
        .heading {{ font-size: 34px; font-weight: 800; }}
        .cardTitle {{ font-size: 29px; font-weight: 800; }}
        .body {{ font-size: 25px; font-weight: 600; }}
        .small {{ font-size: 21px; font-weight: 600; }}
        .tiny {{ font-size: 18px; font-weight: 600; }}
      </style>
    </defs>
    """


def start() -> list[str]:
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">',
        defs(),
        f'<rect width="{WIDTH}" height="{HEIGHT}" fill="{BG}"/>',
    ]


def finish(parts: list[str], name: str) -> None:
    parts.append("</svg>")
    (OUTDIR / name).write_text("\n".join(parts), encoding="utf-8")


def rect(x: int, y: int, w: int, h: int, fill: str, stroke: str = "none", rx: int = 22, shadow: bool = False, sw: int = 2) -> str:
    filt = ' filter="url(#shadow)"' if shadow else ""
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{filt}/>'


def arrowhead(x1: float, y1: float, x2: float, y2: float, color: str, size: float = 16) -> str:
    dx = x2 - x1
    dy = y2 - y1
    length = hypot(dx, dy) or 1.0
    ux = dx / length
    uy = dy / length
    bx = x2 - size * ux
    by = y2 - size * uy
    px = -uy * size * 0.58
    py = ux * size * 0.58
    points = f"{x2:.1f},{y2:.1f} {bx + px:.1f},{by + py:.1f} {bx - px:.1f},{by - py:.1f}"
    return f'<polygon points="{points}" fill="{color}"/>'


def line(x1: int, y1: int, x2: int, y2: int, color: str = NAVY, width: int = 4, marker: str | None = "arrowNavy", dash: str | None = None) -> str:
    d = f' stroke-dasharray="{dash}"' if dash else ""
    shaft = f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}" stroke-linecap="round"{d}/>'
    return shaft + (arrowhead(x1, y1, x2, y2, color) if marker else "")


def path(
    d: str,
    color: str = NAVY,
    width: int = 4,
    marker: str | None = "arrowNavy",
    dash: str | None = None,
    arrow_from: tuple[float, float] | None = None,
    arrow_to: tuple[float, float] | None = None,
) -> str:
    ds = f' stroke-dasharray="{dash}"' if dash else ""
    shaft = f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"{ds}/>'
    if marker and arrow_from and arrow_to:
        return shaft + arrowhead(*arrow_from, *arrow_to, color)
    return shaft


def text(x: int, y: int, value: str, cls: str = "body", anchor: str = "middle", fill: str | None = None) -> str:
    f = f' fill="{fill}"' if fill else ""
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" dominant-baseline="middle" class="{cls}"{f}>{escape(value)}</text>'


def multiline(x: int, y: int, lines: list[str], cls: str = "body", line_height: int = 31, anchor: str = "middle", fill: str | None = None) -> str:
    start_y = y - (len(lines) - 1) * line_height / 2
    return "".join(
        text(x, round(start_y + i * line_height), item, cls, anchor=anchor, fill=fill)
        for i, item in enumerate(lines)
    )


def card(parts: list[str], x: int, y: int, w: int, h: int, title_value: str, body_lines: list[str] | None = None, fill: str = WHITE, stroke: str = PALE_NAVY, title_fill: str = NAVY, body_cls: str = "body") -> None:
    parts.append(rect(x, y, w, h, fill, stroke=stroke, shadow=True))
    if body_lines:
        parts.append(text(x + w // 2, y + 30, title_value, "cardTitle", fill=title_fill))
        parts.append(multiline(x + w // 2, y + 65 + (h - 85) // 2, body_lines, body_cls, 30))
    else:
        parts.append(text(x + w // 2, y + h // 2, title_value, "cardTitle", fill=title_fill))


def lead() -> None:
    p = start()
    p.append(text(800, 58, "같은 문제의식, 다른 운영 경계", "title", fill=NAVY))
    p.append(text(800, 104, "복제본이 아니라 경량 재해석", "subtitle", fill=AMBER))

    p.append(rect(80, 145, 620, 610, WHITE, stroke=PALE_NAVY, shadow=True))
    p.append(rect(900, 145, 620, 610, WHITE, stroke=PALE_TEAL, shadow=True))
    p.append(text(390, 188, "팔란티어 Foundry", "heading", fill=NAVY))
    p.append(text(1210, 188, "OpenCrab", "heading", fill=TEAL))

    left = ["Object · Property · Link", "Action · Function", "Security · Governance", "운영 앱 · Agent"]
    right = ["Source · Evidence", "9-Space", "품질 검사 · Promotion", "Pack", "MCP · Agent"]
    ly = [245, 345, 445, 545]
    ry = [235, 320, 405, 490, 575]
    for i, value in enumerate(left):
        card(p, 145, ly[i], 490, 70, value, fill=PALE_NAVY, stroke=NAVY)
        if i < len(left) - 1:
            p.append(line(390, ly[i] + 72, 390, ly[i + 1] - 8, NAVY, 4, "arrowNavy"))
    for i, value in enumerate(right):
        card(p, 965, ry[i], 490, 62, value, fill=PALE_TEAL, stroke=TEAL, title_fill=TEAL)
        if i < len(right) - 1:
            p.append(line(1210, ry[i] + 64, 1210, ry[i + 1] - 8, TEAL, 4, "arrowTeal"))

    p.append(text(800, 415, "≠", "title", fill=AMBER))
    p.append(text(390, 684, "운영 변경과 통합", "subtitle", fill=NAVY))
    p.append(text(1210, 684, "근거 수집 · 이동성 · Agent 연결", "subtitle", fill=TEAL))
    p.append(rect(220, 785, 1160, 72, PALE_AMBER, stroke=AMBER, rx=18))
    p.append(text(800, 821, "공개 코드 기준 알파 단계의 로컬 온톨로지 공장", "subtitle", fill=CHARCOAL))
    finish(p, "opencrab-foundry-ontology-reinterpretation-infographic.svg")


def figure1() -> None:
    p = start()
    p.append(text(800, 70, "가상 사례: 설비 점검 주기 30일 → 14일", "title", fill=NAVY))
    p.append(text(800, 112, "한 업무 질문을 Evidence · 의미 · 결정 · 통제 역할로 분해", "subtitle", fill=TEAL))

    card(p, 120, 145, 360, 90, "Policy", ["책임자 승인 필요"], PALE_AMBER, AMBER, AMBER)
    card(p, 120, 270, 360, 90, "Subject", ["현장팀 · 정비 책임자"], PALE_NAVY, NAVY, NAVY)
    card(p, 580, 270, 470, 90, "Resource", ["매뉴얼 · 점검표", "센서 데이터 · API"], PALE_NAVY, NAVY, NAVY, "small")
    card(p, 580, 410, 470, 90, "Evidence", ["진동 측정값 · 고장 로그"], PALE_TEAL, TEAL, TEAL)
    card(p, 120, 555, 360, 90, "Community", ["반복 고장 패턴 (선택)"], WHITE, TEAL, TEAL, "small")
    card(p, 580, 555, 380, 90, "Concept", ["베어링 마모 · 진동 증가"], PALE_TEAL, TEAL, TEAL, "small")
    card(p, 1050, 555, 420, 90, "Claim", ["진동 증가가 고장 위험을 높인다"], PALE_AMBER, AMBER, AMBER, "small")
    card(p, 580, 720, 380, 90, "Lever", ["점검 주기 · 교체 임계값"], PALE_AMBER, AMBER, AMBER, "small")
    card(p, 1050, 720, 420, 90, "Outcome", ["비가동 시간 · 고장 위험", "정비 비용"], PALE_NAVY, NAVY, NAVY, "small")

    # Exact eight directed relationships.
    p.append(line(300, 235, 300, 270, AMBER, 4, "arrowNavy"))  # Policy -> Subject
    p.append(path("M480 190 C540 190 535 315 580 315", AMBER, 4, "arrowNavy", arrow_from=(535, 315), arrow_to=(580, 315)))  # Policy -> Resource
    p.append(line(815, 360, 815, 410, NAVY, 4, "arrowNavy"))  # Resource -> Evidence
    p.append(path("M760 500 C735 520 740 535 760 555", TEAL, 4, "arrowTeal", arrow_from=(740, 535), arrow_to=(760, 555)))  # Evidence -> Concept
    p.append(path("M900 500 C1030 520 1140 525 1220 555", TEAL, 4, "arrowTeal", arrow_from=(1140, 525), arrow_to=(1220, 555)))  # Evidence -> Claim
    p.append(line(480, 600, 580, 600, TEAL, 4, "arrowTeal"))  # Community -> Concept
    p.append(path("M960 600 C1050 620 1120 680 1200 720", TEAL, 4, "arrowTeal", arrow_from=(1120, 680), arrow_to=(1200, 720)))  # Concept -> Outcome
    p.append(line(960, 765, 1050, 765, AMBER, 4, "arrowNavy"))  # Lever -> Outcome

    finish(p, "opencrab-foundry-ontology-reinterpretation-figure-01.svg")


def figure2() -> None:
    p = start()
    p.append(text(800, 70, "9-Space 닫힌 그래프 문법", "title", fill=NAVY))
    p.append(rect(515, 110, 570, 54, PALE_AMBER, stroke=AMBER, rx=16))
    p.append(text(800, 137, "9 × 9 = 81개 방향 중 11개 허용", "subtitle", fill=CHARCOAL))

    rows = [
        ("권한", ["Subject → Resource"]),
        ("근거", ["Resource → Evidence", "Evidence → Concept · Evidence → Claim"]),
        ("지식", ["Concept → Concept · Community → Concept"]),
        ("결정", ["Concept → Outcome", "Lever → Concept · Lever → Outcome"]),
        ("통제", ["Policy → Resource · Policy → Subject"]),
    ]
    y = 180
    for idx, (label, values) in enumerate(rows):
        h = 104 if len(values) > 1 else 88
        p.append(rect(80, y, 960, h, WHITE, stroke=PALE_NAVY, shadow=True, rx=18))
        p.append(rect(80, y, 150, h, NAVY if idx % 2 == 0 else TEAL, rx=18))
        p.append(text(155, y + h // 2, label, "cardTitle", fill=WHITE))
        p.append(multiline(260, y + h // 2, values, "body", 34, anchor="start"))
        y += h + 18

    p.append(rect(1090, 180, 430, 240, PALE_TEAL, stroke=TEAL, shadow=True))
    p.append(text(1305, 220, "안전성 이점", "heading", fill=TEAL))
    p.append(multiline(1140, 290, ["• LLM 관계 남발 억제", "• Pack 공통 질문", "• 문법 검증"], "body", 48, anchor="start"))

    p.append(rect(1090, 450, 430, 300, PALE_AMBER, stroke=AMBER, shadow=True))
    p.append(text(1305, 490, "표현 비용", "heading", fill=AMBER))
    p.append(multiline(1140, 595, ["• Subject↔Subject 부족", "• Resource↔Resource 부족", "• Claim 대상 연결 부족", "• 도메인 관계 압축"], "small", 48, anchor="start"))

    p.append(rect(230, 805, 1140, 62, PALE_NAVY, stroke=NAVY, rx=18))
    p.append(text(800, 836, "도메인 그래프의 정확한 관계 + 9-Space 역할 투영", "subtitle", fill=NAVY))
    finish(p, "opencrab-foundry-ontology-reinterpretation-figure-02.svg")


def figure3() -> None:
    p = start()
    p.append(text(800, 70, "OpenCrab Pack · MCP 수명주기", "title", fill=NAVY))
    p.append(text(800, 115, "지식을 만들고 검증하고 Agent에 전달하는 공개 구조", "subtitle", fill=TEAL))

    labels1 = ["Mission", "수집 · 파싱", "Evidence 색인", "9-Space 그래프"]
    labels2 = ["문법 · 품질 검사", "Pack v1", "MCP", "Agent"]
    xs = [90, 465, 840, 1215]
    y1, y2 = 155, 395
    for i, label in enumerate(labels1):
        card(p, xs[i], y1, 295, 88, label, fill=PALE_NAVY if i < 2 else PALE_TEAL, stroke=NAVY if i < 2 else TEAL, title_fill=NAVY if i < 2 else TEAL)
        if i < 3:
            p.append(line(xs[i] + 295, y1 + 44, xs[i + 1] - 10, y1 + 44, NAVY, 4, "arrowNavy"))
    for i, label in enumerate(labels2):
        card(p, xs[i], y2, 295, 88, label, fill=PALE_AMBER if i < 2 else PALE_TEAL, stroke=AMBER if i < 2 else TEAL, title_fill=AMBER if i < 2 else TEAL)
        if i < 3:
            p.append(line(xs[i] + 295, y2 + 44, xs[i + 1] - 10, y2 + 44, TEAL, 4, "arrowTeal"))
    # One non-crossing U-turn between rows.
    p.append(path("M1510 199 L1550 199 L1550 330 L45 330 L45 439 L90 439", NAVY, 4, "arrowNavy", arrow_from=(45, 439), arrow_to=(90, 439)))

    # Mandatory gate badges.
    p.append(rect(115, 354, 245, 34, AMBER, rx=13))
    p.append(text(238, 371, "필수 게이트", "tiny", fill=WHITE))
    p.append(rect(490, 354, 245, 34, AMBER, rx=13))
    p.append(text(613, 371, "필수 게이트", "tiny", fill=WHITE))

    p.append(rect(405, 525, 430, 126, WHITE, stroke=AMBER, shadow=True, rx=18))
    p.append(text(620, 550, "Pack 내용", "cardTitle", fill=AMBER))
    p.append(multiline(620, 600, ["manifest · nodes/edges", "evidence index · quality report", "Neo4j snapshot"], "small", 30))
    p.append(rect(865, 525, 645, 126, WHITE, stroke=TEAL, shadow=True, rx=18))
    p.append(text(1188, 550, "MCP 도구 영역", "cardTitle", fill=TEAL))
    p.append(multiline(1188, 600, ["온톨로지·검색 · Workflow·Approval", "Identity·Promotion", "Schema Pack · Billing · CrabHarness"], "small", 30))

    chips = ["Approval 선택적", "Promotion 선택적", "Pack 연합 계약 없음", "QueryResult ≠ AnswerBundle"]
    chip_x = [80, 455, 830, 1205]
    for x, label in zip(chip_x, chips):
        p.append(rect(x, 700, 315, 58, PALE_AMBER, stroke=AMBER, rx=17))
        p.append(text(x + 157, 729, label, "small", fill=CHARCOAL))

    p.append(rect(180, 800, 1240, 64, PALE_NAVY, stroke=NAVY, rx=18))
    p.append(text(800, 832, "지식 유통은 보이지만 운영 강제와 Pack 연합은 아직 미완성", "subtitle", fill=NAVY))
    finish(p, "opencrab-foundry-ontology-reinterpretation-figure-03.svg")


if __name__ == "__main__":
    lead()
    figure1()
    figure2()
    figure3()
    print("generated vector sources:")
    for svg in sorted(OUTDIR.glob("opencrab-foundry-ontology-reinterpretation*.svg")):
        print(svg.name)

import { useState } from "react";

/* API 서버 주소
   - 로컬 개발: http://localhost:8080 (기본값)
   - Render 배포 후: https://[서비스이름].onrender.com 로 이 줄만 교체 */
const API_BASE_URL = "http://localhost:8080";

/* ────────────────────────────────────────────────────────────
   UI 조각들
──────────────────────────────────────────────────────────── */

function StarMap() {
  const dots = Array.from({ length: 27 }, (_, i) => {
    const angle = (i / 27) * Math.PI * 2 - Math.PI / 2;
    const r = 78;
    return { x: 100 + r * Math.cos(angle), y: 100 + r * Math.sin(angle) };
  });
  return (
    <svg viewBox="0 0 200 200" className="starmap" aria-hidden="true">
      <circle cx="100" cy="100" r="90" className="rim" />
      <circle cx="100" cy="100" r="78" className="rim-inner" />
      {dots.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={i % 3 === 0 ? 2.6 : 1.4} className="dot" />
      ))}
      <circle cx="100" cy="100" r="3.5" className="dot-core" />
    </svg>
  );
}

function CharacterSlot({ label }) {
  return (
    <div className="char-slot">
      <div className="char-slot-inner">
        <span className="char-slot-plus">＋</span>
        <span className="char-slot-text">{label || "캐릭터 이미지 자리"}</span>
      </div>
    </div>
  );
}

function Section({ n, title, children }) {
  return (
    <div className="section">
      <div className="section-head">
        <span className="section-n">{n}</span>
        <span className="section-title">{title}</span>
      </div>
      <p className="section-body">{children}</p>
    </div>
  );
}

/* 백엔드 fetch 유틸 - 실패 시 사용자에게 보여줄 메시지를 함께 던진다 */
async function postJSON(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `요청 실패 (${res.status})`);
  }
  return res.json();
}

/* ────────────────────────────────────────────────────────────
   메인 앱
──────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [birth, setBirth] = useState({ y: "", m: "", d: "" });
  const [partnerBirth, setPartnerBirth] = useState({ y: "", m: "", d: "" });

  const [star, setStar] = useState(null); // /api/sukyo/star 응답
  const [relation, setRelation] = useState(null); // /api/sukyo/compatibility 응답
  const [unlocked, setUnlocked] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmitBirth = birth.y && birth.m && birth.d;
  const canSubmitPartner = partnerBirth.y && partnerBirth.m && partnerBirth.d;

  async function submitBirth() {
    setError("");
    setLoading(true);
    try {
      const data = await postJSON("/api/sukyo/star", {
        year: Number(birth.y),
        month: Number(birth.m),
        day: Number(birth.d),
      });
      setStar(data);
      setScreen("result");
    } catch (e) {
      setError(
        "결과를 불러오지 못했어요. 서버가 켜져 있는지 확인해 주세요. (" +
          e.message +
          ")"
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitPartner() {
    setError("");
    setLoading(true);
    try {
      const data = await postJSON("/api/sukyo/compatibility", {
        me: { year: Number(birth.y), month: Number(birth.m), day: Number(birth.d) },
        partner: {
          year: Number(partnerBirth.y),
          month: Number(partnerBirth.m),
          day: Number(partnerBirth.d),
        },
      });
      setRelation(data);
      setUnlocked(false);
      setScreen("compat-result");
    } catch (e) {
      setError("궁합을 불러오지 못했어요. (" + e.message + ")");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <style>{css}</style>

      {screen === "landing" && (
        <div className="screen">
          <StarMap />
          <h1 className="hero-title">숙요</h1>
          <p className="hero-sub">
            태어난 날, 달이 머물던 별자리로 읽는
            <br />
            27수(宿) 성향 · 궁합
          </p>

          <div className="divider" />

          <p className="body-text">
            숙요점은 인도에서 비롯되어 불교와 함께 동아시아로 전해진 별자리
            체계입니다. 태어난 날 달이 머물던 하늘의 자리, 27수 중 하나가
            평생의 기질과 인연의 결을 말해준다고 믿었습니다. 사주가 태어난
            순간 전체의 기운을 본다면, 숙요점은 그날 밤 달이 어디에
            있었는지 — 단 하나의 좌표에 집중합니다.
          </p>

          <button className="cta" onClick={() => setScreen("birth")}>
            내 숙(宿) 확인하기
          </button>

          <div className="faq">
            <div className="faq-item">
              <p className="faq-q">사주랑 뭐가 달라요?</p>
              <p className="faq-a">
                사주는 연·월·일·시 네 기둥을 모두 보지만, 숙요점은 태어난
                날 달의 위치 단 하나로 사람을 읽습니다. 그래서 태어난 시간을
                몰라도 정확하게 볼 수 있습니다.
              </p>
            </div>
            <div className="faq-item">
              <p className="faq-q">27수는 어떻게 계산돼요?</p>
              <p className="faq-a">
                생년월일을 입력하면 서버가 그날 달의 황경을 계산해 27개
                구간 중 어디에 해당하는지 판정합니다. 태어난 시간과
                무관하게 날짜만 있으면 됩니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {screen === "birth" && (
        <div className="screen">
          <button className="back" onClick={() => setScreen("landing")}>
            ← 뒤로
          </button>
          <h2 className="page-title">생년월일 입력</h2>
          <p className="page-sub">양력 기준으로 입력해 주세요</p>

          <div className="date-row">
            <input
              className="date-input"
              placeholder="년(YYYY)"
              inputMode="numeric"
              value={birth.y}
              onChange={(e) => setBirth({ ...birth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder="월"
              inputMode="numeric"
              value={birth.m}
              onChange={(e) => setBirth({ ...birth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder="일"
              inputMode="numeric"
              value={birth.d}
              onChange={(e) => setBirth({ ...birth, d: e.target.value })}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="cta" disabled={!canSubmitBirth || loading} onClick={submitBirth}>
            {loading ? "계산 중..." : "결과 보기"}
          </button>
        </div>
      )}

      {screen === "result" && star && (
        <div className="screen">
          <button className="back" onClick={() => setScreen("landing")}>
            ← 처음으로
          </button>

          <div className="result-head">
            <span className="result-group">{star.directionGroup}</span>
            <h2 className="result-name">
              {star.koreanName} <span className="result-hanja">{star.hanja}</span>
            </h2>
            <span className="result-tag">
              {star.element} · {star.animal} · {star.keyword}
            </span>
          </div>

          <CharacterSlot label={`${star.koreanName} 캐릭터 이미지 자리`} />

          {star.profileReady ? (
            <>
              <p className="catchphrase">"{star.catchPhrase}"</p>
              <Section n="02" title="기본 기질">{star.temperament}</Section>
              <Section n="03" title="연애 성향">{star.love}</Section>
              <Section n="04" title="일">{star.work}</Section>
              <Section n="05" title="재물">{star.money}</Section>
              <Section n="06" title="겉과 속">{star.duality}</Section>
              <Section n="07" title="이 별의 힘">{star.power}</Section>
            </>
          ) : (
            <div className="placeholder-note">
              {star.koreanName}의 상세 해설은 준비 중입니다. 지금은{" "}
              {star.element}·{star.animal} 기운을 가진 "{star.keyword}"의
              별이라는 점만 확인할 수 있어요.
            </div>
          )}

          <button className="cta outline" onClick={() => setScreen("compat-input")}>
            우리 궁합은 어떨까?
          </button>
        </div>
      )}

      {screen === "compat-input" && (
        <div className="screen">
          <button className="back" onClick={() => setScreen("result")}>
            ← 뒤로
          </button>
          <h2 className="page-title">상대방 생년월일</h2>
          <p className="page-sub">궁합을 확인할 상대의 생일을 입력해 주세요</p>

          <div className="date-row">
            <input
              className="date-input"
              placeholder="년(YYYY)"
              inputMode="numeric"
              value={partnerBirth.y}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder="월"
              inputMode="numeric"
              value={partnerBirth.m}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder="일"
              inputMode="numeric"
              value={partnerBirth.d}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, d: e.target.value })}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="cta" disabled={!canSubmitPartner || loading} onClick={submitPartner}>
            {loading ? "계산 중..." : "궁합 결과 보기"}
          </button>
        </div>
      )}

      {screen === "compat-result" && relation && (
        <div className="screen">
          <button className="back" onClick={() => setScreen("result")}>
            ← 내 결과로
          </button>

          <div className="result-head">
            <span className="result-group">궁합 관계</span>
            <h2 className="result-name">
              {relation.relationName} <span className="result-hanja">{relation.relationHanja}</span>
            </h2>
            <span className="result-tag">{relation.myStarName} × {relation.partnerStarName}</span>
          </div>

          <div className="char-pair">
            <CharacterSlot label="나" />
            <span className="char-pair-x">×</span>
            <CharacterSlot label="상대" />
          </div>

          <Section n="01" title="관계 한줄평">{relation.oneLiner}</Section>

          <div className={`locked-wrap ${unlocked ? "open" : ""}`}>
            <Section n="02" title="끌림과 관계의 시작">
              {relation.start || "결제 후 공개됩니다."}
            </Section>
            <Section n="03" title="연인으로 만나면">
              {relation.romance || "결제 후 공개됩니다."}
            </Section>
            <Section n="04" title="갈등과 관계의 약점">
              {relation.conflict || "결제 후 공개됩니다."}
            </Section>
            <Section n="05" title="이 관계가 남기는 것">
              {relation.legacy || "결제 후 공개됩니다."}
            </Section>

            {!unlocked && (
              <div className="lock-overlay">
                <p className="lock-text">전체 궁합 리포트는 1,900원에 확인할 수 있어요</p>
                <p className="lock-note">(결제 연동 전 — 상세 카피는 서버에 아직 없음)</p>
                <button className="cta small" onClick={() => setUnlocked(true)}>
                  리포트 잠금 해제
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   스타일
──────────────────────────────────────────────────────────── */
const css = `
  :root {
    --ink: #0F1320;
    --surface: #171C2C;
    --line: #333B57;
    --gold: #C9A24B;
    --gold-soft: #8A7238;
    --vermilion: #A43A2F;
    --text: #EDE8DC;
    --text-dim: #9AA0B8;
  }
  * { box-sizing: border-box; }
  .app {
    background: var(--ink);
    color: var(--text);
    font-family: 'Noto Serif KR', 'Nanum Myeongjo', serif;
    min-height: 100%;
  }
  .screen {
    max-width: 420px;
    margin: 0 auto;
    padding: 28px 22px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .starmap { width: 200px; height: 200px; margin-bottom: 4px; }
  .rim { fill: none; stroke: var(--vermilion); stroke-width: 1.2; opacity: 0.7; }
  .rim-inner { fill: none; stroke: var(--gold-soft); stroke-width: 0.5; opacity: 0.5; }
  .dot { fill: var(--gold); }
  .dot-core { fill: var(--vermilion); }

  .hero-title { font-size: 34px; letter-spacing: 0.08em; margin: 8px 0 6px; font-weight: 600; }
  .hero-sub { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 14px; line-height: 1.7; color: var(--text-dim); margin-bottom: 20px; }
  .divider { width: 40px; height: 1px; background: var(--gold-soft); margin: 6px 0 20px; }
  .body-text { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 14.5px; line-height: 1.85; text-align: left; margin-bottom: 28px; }

  .cta { font-family: 'Pretendard', -apple-system, sans-serif; width: 100%; background: var(--gold); color: #17140A; border: none; padding: 15px; font-size: 15px; font-weight: 700; border-radius: 2px; cursor: pointer; margin-top: 4px; }
  .cta:disabled { opacity: 0.35; cursor: not-allowed; }
  .cta.outline { background: transparent; color: var(--gold); border: 1px solid var(--gold-soft); margin-top: 32px; }
  .cta.small { width: auto; padding: 10px 22px; font-size: 13px; }

  .faq { margin-top: 40px; width: 100%; text-align: left; }
  .faq-item { border-top: 1px solid var(--line); padding: 16px 0; font-family: 'Pretendard', -apple-system, sans-serif; }
  .faq-q { font-weight: 700; font-size: 14px; margin-bottom: 8px; }
  .faq-a { font-size: 13.5px; line-height: 1.75; color: var(--text-dim); }

  .back { align-self: flex-start; background: none; border: none; color: var(--text-dim); font-family: 'Pretendard', -apple-system, sans-serif; font-size: 13px; margin-bottom: 20px; cursor: pointer; }
  .page-title { font-size: 22px; margin-bottom: 6px; }
  .page-sub { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 13px; color: var(--text-dim); margin-bottom: 28px; }

  .date-row { display: flex; gap: 8px; width: 100%; margin-bottom: 12px; }
  .date-input { font-family: 'Pretendard', -apple-system, sans-serif; flex: 2; background: var(--surface); border: 1px solid var(--line); color: var(--text); padding: 13px 10px; font-size: 14px; border-radius: 2px; text-align: center; }
  .date-input.short { flex: 1; }

  .error-text { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 12.5px; color: #E08787; margin: 4px 0 12px; }

  .result-head { margin-bottom: 18px; }
  .result-group { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 12px; color: var(--gold); letter-spacing: 0.08em; }
  .result-name { font-size: 30px; margin: 6px 0 6px; }
  .result-hanja { font-size: 18px; color: var(--text-dim); font-weight: 400; }
  .result-tag { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 12.5px; color: var(--text-dim); }

  .char-slot { width: 100%; aspect-ratio: 1; max-width: 220px; border: 1px dashed var(--gold-soft); border-radius: 4px; margin: 10px 0 24px; display: flex; align-items: center; justify-content: center; background: var(--surface); }
  .char-slot-inner { display: flex; flex-direction: column; align-items: center; gap: 8px; color: var(--text-dim); font-family: 'Pretendard', -apple-system, sans-serif; }
  .char-slot-plus { font-size: 22px; color: var(--gold-soft); }
  .char-slot-text { font-size: 12px; }

  .char-pair { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
  .char-pair .char-slot { width: 130px; margin: 0; }
  .char-pair-x { color: var(--gold-soft); font-size: 18px; }

  .catchphrase { font-size: 17px; line-height: 1.6; color: var(--gold); margin: 4px 0 26px; }

  .section { width: 100%; text-align: left; margin-bottom: 22px; }
  .section-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
  .section-n { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 11px; color: var(--vermilion); letter-spacing: 0.05em; }
  .section-title { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 14px; font-weight: 700; }
  .section-body { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 14px; line-height: 1.85; color: var(--text-dim); }

  .placeholder-note { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 13.5px; line-height: 1.8; color: var(--text-dim); background: var(--surface); border: 1px solid var(--line); padding: 16px; border-radius: 4px; margin-bottom: 8px; text-align: left; }

  .locked-wrap { position: relative; width: 100%; }
  .locked-wrap:not(.open) .section:nth-child(n+2) { filter: blur(5px); user-select: none; pointer-events: none; }
  .lock-overlay { position: absolute; inset: 40px 0 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; text-align: center; padding: 20px; }
  .lock-text { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 14px; background: var(--ink); padding: 4px 10px; }
  .lock-note { font-family: 'Pretendard', -apple-system, sans-serif; font-size: 11px; color: var(--text-dim); background: var(--ink); padding: 0 10px; }
`;

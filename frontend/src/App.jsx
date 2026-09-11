import { useState } from "react";

/* Render 배포 후 이 값을 실제 백엔드 주소로 교체하세요.
   예: https://sukyo-backend.onrender.com */
const API_BASE_URL = "https://sukyo-backend.onrender.com";

/* ── UI 문자열(한/영). 27수 콘텐츠 본문은 한국어 원고만 있어서 아직 번역 대상에서 제외했어요. ── */
const STRINGS = {
  ko: {
    heroSub: "생년월일 하나로 보는 27수 성향 테스트",
    body: "숙요점은 인도에서 비롯되어 불교와 함께 동아시아로 전해진 별자리 체계예요. 태어난 날 달이 머물던 하늘의 자리, 27수 중 하나가 평생의 기질과 인연의 결을 말해준다고 믿었습니다. 사주가 태어난 순간 전체의 기운을 본다면, 숙요점은 그날 밤 달이 어디에 있었는지 — 단 하나의 좌표에 집중해요.",
    freeTag: "무료", freeLabel: "내 宿 결과",
    paidTag: "1,900원", paidLabel: "궁합 리포트",
    cta: "내 숙(宿) 확인하기",
    faqQ1: "사주랑 뭐가 달라요?",
    faqA1: "사주는 연·월·일·시 네 기둥을 모두 보지만, 숙요점은 태어난 날 달의 위치 단 하나로 사람을 읽어요. 태어난 시간을 몰라도 정확하게 볼 수 있어요.",
    faqQ2: "27수는 어떻게 계산돼요?",
    faqA2: "생년월일을 입력하면 그날 달의 황경을 계산해 27개 구간 중 어디에 해당하는지 판정해요. 태어난 시간과 무관하게 날짜만 있으면 됩니다.",
    back: "← 뒤로", backHome: "← 처음으로", backResult: "← 내 결과로",
    birthTitle: "생년월일 입력", birthSub: "양력 기준으로 입력해 주세요",
    partnerTitle: "상대방 생년월일", partnerSub: "궁합을 확인할 상대의 생일을 입력해 주세요",
    year: "년(YYYY)", month: "월", day: "일",
    seeResult: "결과 보기", calculating: "계산 중...", seeCompat: "궁합 결과 보기",
    personal: "개인 성향", love: "연애 성향",
    deepCta: (name) => `내 ${name} 더 깊게 보기`,
    compatCta: "우리 궁합은 어떨까?",
    compatGroup: "궁합 관계",
    oneLiner: "관계 한줄평",
    startTitle: "끌림과 관계의 시작", romanceTitle: "연인으로 만나면",
    conflictTitle: "갈등과 관계의 약점", legacyTitle: "이 관계가 남기는 것",
    lockText: "전체 궁합 리포트는 1,900원에 확인할 수 있어요",
    unlock: "리포트 잠금 해제",
    errStar: "결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
    errCompat: "궁합을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
    share: "결과 공유하기", shareCopied: "링크를 복사했어요",
    charSlot: "캐릭터 이미지 자리", me: "나", partner: "상대",
  },
  en: {
    heroSub: "Discover your 27-Star personality from just your birth date",
    body: "Sukyojeom is a star-mansion system that traveled from India to East Asia along with Buddhism. It's believed the lunar mansion the moon rested in on the night you were born — one of 27 — reveals your lifelong temperament and the shape of your relationships. If saju reads the full energy of the moment you were born, Sukyojeom focuses on a single coordinate: where the moon was that night.",
    freeTag: "Free", freeLabel: "My 宿 result",
    paidTag: "$1.5", paidLabel: "Compatibility report",
    cta: "Find my 宿",
    faqQ1: "How is this different from Saju?",
    faqA1: "Saju reads all four pillars — year, month, day, hour. Sukyojeom reads a single point: where the moon was on your birth date. You don't even need to know your birth time.",
    faqQ2: "How is the 27-Star calculated?",
    faqA2: "We calculate the moon's ecliptic longitude on your birth date and match it to one of 27 segments. Only the date matters — birth time isn't needed.",
    back: "← Back", backHome: "← Home", backResult: "← My result",
    birthTitle: "Enter your birth date", birthSub: "Please use the solar calendar",
    partnerTitle: "Partner's birth date", partnerSub: "Enter your partner's birth date to check compatibility",
    year: "Year", month: "Month", day: "Day",
    seeResult: "See result", calculating: "Calculating...", seeCompat: "See compatibility",
    personal: "Personality", love: "Love style",
    deepCta: (name) => `Go deeper into ${name}`,
    compatCta: "How do we match?",
    compatGroup: "Compatibility",
    oneLiner: "One-line summary",
    startTitle: "How it starts", romanceTitle: "As a couple",
    conflictTitle: "Where it breaks", legacyTitle: "What it leaves behind",
    lockText: "Unlock the full compatibility report for $1.5",
    unlock: "Unlock report",
    errStar: "Couldn't load your result. Please try again.",
    errCompat: "Couldn't load compatibility. Please try again.",
    share: "Share result", shareCopied: "Link copied",
    charSlot: "Character image slot", me: "Me", partner: "Partner",
  },
};

async function fetchStar(y, m, d) {
  const res = await fetch(`${API_BASE_URL}/api/sukyo/star`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ year: y, month: m, day: d }),
  });
  if (!res.ok) throw new Error("별자리 계산에 실패했습니다");
  return res.json();
}

async function fetchCompatibility(me, partner) {
  const res = await fetch(`${API_BASE_URL}/api/sukyo/compatibility`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      me: { year: me.y, month: me.m, day: me.d },
      partner: { year: partner.y, month: partner.m, day: partner.d },
    }),
  });
  if (!res.ok) throw new Error("궁합 계산에 실패했습니다");
  return res.json();
}

async function shareResult(title, text, t, setToast) {
  const url = window.location.href;
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
    } catch (e) {
      /* 사용자가 취소한 경우 등은 무시 */
    }
  } else {
    try {
      await navigator.clipboard.writeText(url);
      setToast(t.shareCopied);
      setTimeout(() => setToast(""), 1800);
    } catch (e) {
      /* clipboard 접근 실패 시 조용히 무시 */
    }
  }
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle">
      <button className={lang === "ko" ? "active" : ""} onClick={() => setLang("ko")}>KR</button>
      <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

function ShareButton({ onClick, label }) {
  return (
    <button className="share-btn" onClick={onClick} aria-label={label}>
      ⤴ {label}
    </button>
  );
}

function CharacterSlot({ label }) {
  return (
    <div className="char-slot">
      <span className="char-slot-plus">＋</span>
      <span className="char-slot-text">{label}</span>
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

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lang, setLang] = useState("ko");
  const [toast, setToast] = useState("");
  const t = STRINGS[lang];

  const [birth, setBirth] = useState({ y: "", m: "", d: "" });
  const [partnerBirth, setPartnerBirth] = useState({ y: "", m: "", d: "" });

  const [star, setStar] = useState(null);
  const [compat, setCompat] = useState(null);
  const [unlocked, setUnlocked] = useState(false);

  const canSubmitBirth = birth.y && birth.m && birth.d;
  const canSubmitPartner = partnerBirth.y && partnerBirth.m && partnerBirth.d;

  async function submitBirth() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchStar(Number(birth.y), Number(birth.m), Number(birth.d));
      setStar(data);
      setScreen("result");
    } catch (e) {
      setError(t.errStar);
    } finally {
      setLoading(false);
    }
  }

  async function submitPartner() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCompatibility(birth, partnerBirth);
      setCompat(data);
      setUnlocked(false);
      setScreen("compat-result");
    } catch (e) {
      setError(t.errCompat);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <style>{css}</style>
      {toast && <div className="toast">{toast}</div>}

      {screen === "landing" && (
        <div className="screen">
          <div className="landing-lang-wrap">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <div className="mark">宿</div>
          <h1 className="hero-title">숙요점</h1>
          <p className="hero-sub">{t.heroSub}</p>

          <p className="body-text">{t.body}</p>

          <div className="pill-row">
            <div className="pill">
              <div className="pill-tag">{t.freeTag}</div>
              <div className="pill-label">{t.freeLabel}</div>
            </div>
            <div className="pill">
              <div className="pill-tag">{t.paidTag}</div>
              <div className="pill-label">{t.paidLabel}</div>
            </div>
          </div>

          <button className="cta" onClick={() => setScreen("birth")}>
            {t.cta}
          </button>

          <div className="faq">
            <div className="faq-item">
              <p className="faq-q">{t.faqQ1}</p>
              <p className="faq-a">{t.faqA1}</p>
            </div>
            <div className="faq-item">
              <p className="faq-q">{t.faqQ2}</p>
              <p className="faq-a">{t.faqA2}</p>
            </div>
          </div>
        </div>
      )}

      {screen === "birth" && (
        <div className="screen">
          <div className="screen-top-row">
            <button className="back" onClick={() => setScreen("landing")}>{t.back}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <h2 className="page-title">{t.birthTitle}</h2>
          <p className="page-sub">{t.birthSub}</p>

          <div className="date-row">
            <input
              className="date-input"
              placeholder={t.year}
              inputMode="numeric"
              value={birth.y}
              onChange={(e) => setBirth({ ...birth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.month}
              inputMode="numeric"
              value={birth.m}
              onChange={(e) => setBirth({ ...birth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.day}
              inputMode="numeric"
              value={birth.d}
              onChange={(e) => setBirth({ ...birth, d: e.target.value })}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="cta" disabled={!canSubmitBirth || loading} onClick={submitBirth}>
            {loading ? t.calculating : t.seeResult}
          </button>
        </div>
      )}

      {screen === "result" && star && (
        <div className="screen">
          <div className="screen-top-row">
            <button className="back" onClick={() => setScreen("landing")}>{t.backHome}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className="result-head">
            <span className="result-group">{star.directionGroup}</span>
            <h2 className="result-name">
              {star.koreanName} <span className="result-hanja">{star.hanja}</span>
            </h2>
            <span className="result-tag">{star.element} · {star.animal}</span>
          </div>

          <CharacterSlot label={`${star.koreanName} ${t.charSlot}`} />

          <p className="catchphrase">“{star.catchPhrase}”</p>

          <Section n="01" title={t.personal}>{star.temperament}</Section>
          <Section n="02" title={t.love}>{star.love}</Section>

          <div className="hook-box">
            <p className="hook-text">{star.hookQuestion}</p>
            <button className="cta outline small-full">{t.deepCta(star.koreanName)}</button>
          </div>

          <ShareButton
            label={t.share}
            onClick={() => shareResult("숙요점", `나는 ${star.koreanName}(${star.hanja})예요 — ${star.catchPhrase}`, t, setToast)}
          />

          <button className="cta outline" onClick={() => setScreen("compat-input")}>
            {t.compatCta}
          </button>
        </div>
      )}

      {screen === "compat-input" && (
        <div className="screen">
          <div className="screen-top-row">
            <button className="back" onClick={() => setScreen("result")}>{t.back}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <h2 className="page-title">{t.partnerTitle}</h2>
          <p className="page-sub">{t.partnerSub}</p>

          <div className="date-row">
            <input
              className="date-input"
              placeholder={t.year}
              inputMode="numeric"
              value={partnerBirth.y}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.month}
              inputMode="numeric"
              value={partnerBirth.m}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.day}
              inputMode="numeric"
              value={partnerBirth.d}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, d: e.target.value })}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="cta" disabled={!canSubmitPartner || loading} onClick={submitPartner}>
            {loading ? t.calculating : t.seeCompat}
          </button>
        </div>
      )}

      {screen === "compat-result" && compat && (
        <div className="screen">
          <div className="screen-top-row">
            <button className="back" onClick={() => setScreen("result")}>{t.backResult}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className="result-head">
            <span className="result-group">{t.compatGroup}</span>
            <h2 className="result-name">
              {compat.relationName} <span className="result-hanja">{compat.relationHanja}</span>
            </h2>
            <span className="result-tag">{compat.oneLiner}</span>
          </div>

          <div className="char-pair">
            <CharacterSlot label={t.me} />
            <span className="char-pair-x">×</span>
            <CharacterSlot label={t.partner} />
          </div>

          <Section n="01" title={t.oneLiner}>{compat.oneLiner}</Section>

          <div className={`locked-wrap ${unlocked ? "open" : ""}`}>
            <Section n="02" title={t.startTitle}>
              {compat.start || "두 사람이 서로에게 끌리는 이유와 관계가 시작되는 방식."}
            </Section>
            <Section n="03" title={t.romanceTitle}>
              {compat.romance || "연애할 때의 분위기와 애정 표현 방식."}
            </Section>
            <Section n="04" title={t.conflictTitle}>
              {compat.conflict || "어디서 부딪히는지, 멀어질 때의 패턴."}
            </Section>
            <Section n="05" title={t.legacyTitle}>
              {compat.legacy || "서로에게 남기는 영향과 오래가기 위한 조건."}
            </Section>

            {!unlocked && (
              <div className="lock-overlay">
                <p className="lock-text">{t.lockText}</p>
                <button className="cta small" onClick={() => setUnlocked(true)}>
                  {t.unlock}
                </button>
              </div>
            )}
          </div>

          {unlocked && (
            <ShareButton
              label={t.share}
              onClick={() => shareResult("숙요점 궁합", `우리는 ${compat.relationName}(${compat.relationHanja}) 관계래요 — ${compat.oneLiner}`, t, setToast)}
            />
          )}
        </div>
      )}
    </div>
  );
}

const css = `
  :root {
    --pink: #E0517D;
    --pink-soft: #FDECF1;
    --ink: #111111;
    --muted: #777777;
    --muted-2: #999999;
    --border: #ECECEC;
  }
  * { box-sizing: border-box; }
  .app {
    background: #ffffff;
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
  }
  @media (min-width: 480px) {
    .app {
      background: var(--pink-soft);
      display: flex;
      justify-content: center;
      padding: 32px 12px;
    }
    .screen {
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(224, 81, 125, 0.08);
      padding-top: 40px;
    }
  }
  .screen {
    max-width: 420px;
    width: 100%;
    margin: 0 auto;
    padding: 44px 22px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-sizing: border-box;
  }
  .mark {
    width: 48px; height: 48px;
    border-radius: 12px;
    background: var(--pink);
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 18px;
  }
  .hero-title { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 6px; }
  .hero-sub { font-size: 13.5px; color: var(--muted); margin-bottom: 22px; }
  .body-text { font-size: 14px; line-height: 1.85; color: #333; text-align: left; margin-bottom: 22px; }

  .pill-row { display: flex; gap: 8px; width: 100%; margin-bottom: 24px; }
  .pill { flex: 1; background: var(--pink-soft); border-radius: 10px; padding: 12px 10px; }
  .pill-tag { font-size: 11px; color: var(--pink); font-weight: 700; }
  .pill-label { font-size: 12.5px; margin-top: 2px; }

  .cta {
    width: 100%;
    background: var(--pink);
    color: #fff;
    border: none;
    padding: 15px;
    font-size: 15px;
    font-weight: 700;
    border-radius: 10px;
    cursor: pointer;
  }
  .cta:disabled { opacity: 0.4; cursor: not-allowed; }
  .cta.outline { background: #fff; color: var(--pink); border: 1.5px solid var(--pink); margin-top: 28px; }
  .cta.small { width: auto; padding: 10px 22px; font-size: 13px; }

  .faq { margin-top: 36px; width: 100%; text-align: left; }
  .faq-item { border-top: 1px solid var(--border); padding: 16px 0; }
  .faq-q { font-weight: 700; font-size: 14px; margin-bottom: 8px; }
  .faq-a { font-size: 13.5px; line-height: 1.75; color: var(--muted); }

  .back { background: none; border: none; color: var(--muted); font-size: 13px; cursor: pointer; padding: 0; }
  .screen-top-row { width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }

  .lang-toggle { display: flex; border: 1px solid var(--border); border-radius: 999px; overflow: hidden; }
  .lang-toggle button { border: none; background: #fff; color: var(--muted); font-size: 11px; font-weight: 700; padding: 5px 10px; cursor: pointer; }
  .lang-toggle button.active { background: var(--pink); color: #fff; }
  .landing-lang-wrap { align-self: flex-end; margin-bottom: 8px; }

  .share-btn {
    background: #fff; border: 1.5px solid var(--border); color: var(--ink);
    font-size: 13px; font-weight: 700; padding: 11px 18px; border-radius: 10px;
    cursor: pointer; margin-top: 14px; width: 100%;
  }

  .toast {
    position: fixed; top: 18px; left: 50%; transform: translateX(-50%);
    background: var(--ink); color: #fff; font-size: 12.5px;
    padding: 9px 16px; border-radius: 999px; z-index: 50;
  }

  .page-title { font-size: 21px; font-weight: 800; margin-bottom: 6px; }
  .page-sub { font-size: 13px; color: var(--muted); margin-bottom: 26px; }

  .date-row { display: flex; gap: 8px; width: 100%; margin-bottom: 8px; }
  .date-input { flex: 2; min-width: 0; width: 100%; background: #fafafa; border: 1px solid var(--border); color: var(--ink); padding: 13px 8px; font-size: 16px; border-radius: 8px; text-align: center; }
  .date-input.short { flex: 1; }
  .error-text { color: var(--pink); font-size: 12.5px; margin: 8px 0 16px; }

  .result-head { margin-bottom: 16px; }
  .result-group { font-size: 12px; color: var(--pink); font-weight: 700; letter-spacing: 0.04em; }
  .result-name { font-size: 27px; font-weight: 800; margin: 6px 0 6px; }
  .result-hanja { font-size: 16px; color: var(--muted); font-weight: 400; }
  .result-tag { font-size: 12.5px; color: var(--muted); }

  .char-slot {
    width: 100%; aspect-ratio: 1; max-width: 200px;
    border: 1.5px dashed #ddd; border-radius: 12px;
    margin: 8px 0 22px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
    background: #fafafa; color: var(--muted-2);
  }
  .char-slot-plus { font-size: 20px; color: #ccc; }
  .char-slot-text { font-size: 12px; }
  .char-pair { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
  .char-pair .char-slot { width: 120px; margin: 0; }
  .char-pair-x { color: #ccc; font-size: 18px; }

  .catchphrase { font-size: 16px; font-weight: 700; line-height: 1.6; color: var(--pink); margin: 4px 0 24px; }

  .section { width: 100%; text-align: left; margin-bottom: 20px; }
  .section-head { display: flex; align-items: baseline; gap: 10px; margin-bottom: 8px; }
  .section-n { font-size: 11px; color: var(--pink); font-weight: 700; }
  .section-title { font-size: 14px; font-weight: 700; }
  .section-body { font-size: 13.5px; line-height: 1.8; color: #444; }

  .placeholder-note { font-size: 13px; line-height: 1.8; color: var(--muted); background: #fafafa; border: 1px solid var(--border); padding: 16px; border-radius: 10px; margin-bottom: 8px; text-align: left; }

  .hook-box { width: 100%; background: var(--pink-soft); border-radius: 12px; padding: 18px; margin: 6px 0 24px; text-align: center; }
  .hook-text { font-size: 14px; font-weight: 700; line-height: 1.6; margin-bottom: 12px; }
  .cta.small-full { width: 100%; padding: 11px; font-size: 13px; margin-top: 0; }

  .locked-wrap { position: relative; width: 100%; }
  .locked-wrap:not(.open) .section:nth-child(n+2) { filter: blur(5px); user-select: none; pointer-events: none; }
  .lock-overlay { position: absolute; inset: 36px 0 0 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; padding: 20px; }
  .lock-text { font-size: 13.5px; background: #fff; padding: 4px 10px; }
`;

import { useEffect, useState } from "react";

/* Render 배포 후 이 값을 실제 백엔드 주소로 교체하세요.
   예: https://sukyo-backend.onrender.com */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://sukyo-backend.onrender.com";

/* ── UI 문자열(한/영). 27수 콘텐츠 본문은 한국어 원고만 있어서 아직 번역 대상에서 제외했어요. ── */
const STRINGS = {
  ko: {
    heroSub: "생년월일 하나로 보는 27수 성향 테스트",
    body: "숙요점은 27개의 숙을 통해 나의 성향과 관계를 살펴보는 전통 점술이에요. 생년월일로 내 숙을 찾고, 나다운 모습과 연애 성향을 만나보세요.",
    freeTag: "무료", freeLabel: "내 宿 결과",
    deepTag: "1,900원", deepLabel: "내 숙 리포트",
    paidTag: "4,900원", paidLabel: "궁합 리포트",
    comingSoon: "준비 중",
    deepDescription: "재물 · 직업 · 겉모습과 속마음 · 연애 패턴",
    invalidDate: "1900~2100년 사이의 실제 양력 날짜를 입력해 주세요.",
    cta: "내 숙(宿) 확인하기",
    faqQ1: "사주랑 뭐가 달라요?",
    faqA1: "사주는 연·월·일·시를 함께 보지만, 이 서비스는 생년월일을 기준으로 숙을 정해요. 태어난 시간은 입력하지 않아도 됩니다.",
    faqQ2: "27수는 어떻게 계산돼요?",
    faqA2: "양력 생년월일을 일본 구력의 월·일로 바꾼 뒤, 전통 숙 배정표(월숙방통력)로 계산해요. 윤달은 같은 월의 표를 사용하며, 한국 음력과 날짜가 다를 수 있어요.",
    back: "← 뒤로", backHome: "← 처음으로", backResult: "← 내 결과로",
    birthTitle: "생년월일 입력", birthSub: "양력 기준으로 입력해 주세요",
    partnerTitle: "상대방 생년월일", partnerSub: "궁합을 확인할 상대의 생일을 입력해 주세요",
    year: "년(YYYY)", month: "월", day: "일",
    seeResult: "결과 보기", calculating: "계산 중...", seeCompat: "궁합 결과 보기",
    loadingTitle: "결과를 불러오고 있어요",
    loadingHint: "잠시만 기다려 주세요.",
    loadingSlow: "첫 연결에는 서버 준비로 1분 정도 걸릴 수 있어요. 이 화면에서 기다려 주세요.",
    loadingLong: "예상보다 오래 걸리고 있어요. 연결을 계속 기다리고 있습니다.",
    personal: "개인 성향", love: "연애 성향",
    deepCta: (name) => `내 ${name} 더 깊게 보기`,
    compatCta: "우리 궁합은 어떨까?",
    compatGroup: "궁합 관계",
    oneLiner: "관계 한줄평",
    startTitle: "끌림과 관계의 시작", romanceTitle: "연인으로 만나면",
    conflictTitle: "갈등과 관계의 약점", legacyTitle: "이 관계가 남기는 것",
    lockText: "전체 궁합 리포트 · 4,900원 · 준비 중",
    unlock: "리포트 잠금 해제",
    errStar: "결과를 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
    errCompat: "궁합을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
    share: "결과 공유하기", shareCopied: "링크를 복사했어요",
    charSlot: "캐릭터 이미지 자리", me: "나", partner: "상대",
  },
  en: {
    heroSub: "Discover your 27-Star personality from just your birth date",
    body: "Explore your personality and relationships through Sukyo's 27 traditional lunar mansions. Enter your birth date to discover your star and love style.",
    freeTag: "Free", freeLabel: "My 宿 result",
    deepTag: "KRW 1,900", deepLabel: "My star report",
    paidTag: "KRW 4,900", paidLabel: "Compatibility report",
    comingSoon: "Coming soon",
    deepDescription: "Money · Career · Outer and inner self · Love patterns",
    invalidDate: "Enter a valid Gregorian date between 1900 and 2100.",
    cta: "Find my 宿",
    faqQ1: "How is this different from Saju?",
    faqA1: "Saju uses the year, month, day and hour. This service uses your birth date, so a birth time is not required.",
    faqQ2: "How is the 27-Star calculated?",
    faqA2: "We convert your Gregorian birth date to Japanese kyureki and use the traditional month/day mansion table. Leap months use the same month's table. Dates may differ from the Korean lunar calendar.",
    back: "← Back", backHome: "← Home", backResult: "← My result",
    birthTitle: "Enter your birth date", birthSub: "Please use the solar calendar",
    partnerTitle: "Partner's birth date", partnerSub: "Enter your partner's birth date to check compatibility",
    year: "Year", month: "Month", day: "Day",
    seeResult: "See result", calculating: "Calculating...", seeCompat: "See compatibility",
    loadingTitle: "Preparing your result",
    loadingHint: "Please wait a moment.",
    loadingSlow: "The first connection can take about a minute while the server starts. Please stay on this screen.",
    loadingLong: "This is taking longer than expected. We are still waiting for the server.",
    personal: "Personality", love: "Love style",
    deepCta: (name) => `Go deeper into ${name}`,
    compatCta: "How do we match?",
    compatGroup: "Compatibility",
    oneLiner: "One-line summary",
    startTitle: "How it starts", romanceTitle: "As a couple",
    conflictTitle: "Where it breaks", legacyTitle: "What it leaves behind",
    lockText: "Full compatibility report · KRW 4,900 · Coming soon",
    unlock: "Unlock report",
    errStar: "Couldn't load your result. Please try again.",
    errCompat: "Couldn't load compatibility. Please try again.",
    share: "Share result", shareCopied: "Link copied",
    charSlot: "Character image slot", me: "Me", partner: "Partner",
  },
};

async function requestResult(path, body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchStar(y, m, d) {
  return requestResult("/api/sukyo/star", { year: y, month: m, day: d });
}

async function fetchCompatibility(me, partner) {
  return requestResult("/api/sukyo/compatibility", {
      me: { year: Number(me.y), month: Number(me.m), day: Number(me.d) },
      partner: { year: Number(partner.y), month: Number(partner.m), day: Number(partner.d) },
  });
}

function LoadingNotice({ t }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const slow = setTimeout(() => setStage(1), 5000);
    const long = setTimeout(() => setStage(2), 60000);
    return () => { clearTimeout(slow); clearTimeout(long); };
  }, []);
  return (
    <div className="loading-notice" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <strong>{t.loadingTitle}</strong>
      <p>{stage === 0 ? t.loadingHint : stage === 1 ? t.loadingSlow : t.loadingLong}</p>
    </div>
  );
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

function isValidBirth({ y, m, d }) {
  if (![y, m, d].every(value => /^\d+$/.test(String(value)))) return false;
  const year = Number(y), month = Number(m), day = Number(d);
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  return day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
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
  const unlocked = false; // Paid reports are not available yet.

  const canSubmitBirth = isValidBirth(birth);
  const canSubmitPartner = isValidBirth(partnerBirth);

  async function submitBirth() {
    if (loading || !canSubmitBirth) return;
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
    if (loading || !canSubmitPartner) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchCompatibility(birth, partnerBirth);
      setCompat(data);

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
              <div className="pill-tag">{t.deepTag}</div>
              <div className="pill-label">{t.deepLabel}</div>
              <div className="pill-status">{t.comingSoon}</div>
            </div>
            <div className="pill">
              <div className="pill-tag">{t.paidTag}</div>
              <div className="pill-label">{t.paidLabel}</div>
              <div className="pill-status">{t.comingSoon}</div>
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
            <button className="back" disabled={loading} onClick={() => setScreen("landing")}>{t.back}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <h2 className="page-title">{t.birthTitle}</h2>
          <p className="page-sub">{t.birthSub}</p>

          <fieldset className="date-row" disabled={loading}>
            <input
              className="date-input"
              placeholder={t.year}
              aria-label={t.year}
              inputMode="numeric"
              value={birth.y}
              onChange={(e) => setBirth({ ...birth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.month}
              aria-label={t.month}
              inputMode="numeric"
              value={birth.m}
              onChange={(e) => setBirth({ ...birth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.day}
              aria-label={t.day}
              inputMode="numeric"
              value={birth.d}
              onChange={(e) => setBirth({ ...birth, d: e.target.value })}
            />
          </fieldset>

          {birth.y && birth.m && birth.d && !canSubmitBirth && <p className="error-text" role="alert">{t.invalidDate}</p>}
          {error && <p className="error-text" role="alert">{error}</p>}
          {loading && <LoadingNotice t={t} />}

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

          {star.keywords?.length > 0 && (
            <ul className="keyword-row" aria-label={lang === "ko" ? "핵심 키워드" : "Key traits"}>
              {star.keywords.map(keyword => <li key={keyword}>#{keyword}</li>)}
            </ul>
          )}
          <CharacterSlot label={`${star.koreanName} ${t.charSlot}`} />

          <p className="catchphrase">“{star.catchPhrase}”</p>

          <Section n="01" title={t.personal}>{star.temperament}</Section>
          <Section n="02" title={t.love}>{star.love}</Section>

          <div className="hook-box">
            <p className="hook-text">{star.hookQuestion}</p>
            <p className="report-details">{t.deepDescription}</p>
            <button className="cta outline small-full" disabled>{t.deepCta(star.koreanName)} · {t.deepTag}</button>
            <p className="report-status">{t.comingSoon}</p>
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
            <button className="back" disabled={loading} onClick={() => setScreen("result")}>{t.back}</button>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <h2 className="page-title">{t.partnerTitle}</h2>
          <p className="page-sub">{t.partnerSub}</p>

          <fieldset className="date-row" disabled={loading}>
            <input
              className="date-input"
              placeholder={t.year}
              aria-label={t.year}
              inputMode="numeric"
              value={partnerBirth.y}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, y: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.month}
              aria-label={t.month}
              inputMode="numeric"
              value={partnerBirth.m}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, m: e.target.value })}
            />
            <input
              className="date-input short"
              placeholder={t.day}
              aria-label={t.day}
              inputMode="numeric"
              value={partnerBirth.d}
              onChange={(e) => setPartnerBirth({ ...partnerBirth, d: e.target.value })}
            />
          </fieldset>

          {partnerBirth.y && partnerBirth.m && partnerBirth.d && !canSubmitPartner && <p className="error-text" role="alert">{t.invalidDate}</p>}
          {error && <p className="error-text" role="alert">{error}</p>}
          {loading && <LoadingNotice t={t} />}

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
            <CharacterSlot label={`${t.me} · ${compat.myStarName}`} />
            <span className="char-pair-x">×</span>
            <CharacterSlot label={`${t.partner} · ${compat.partnerStarName}`} />
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
                <button className="cta small" disabled>
                  {t.comingSoon}
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
  body { margin: 0; }
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
  .pill-status { font-size: 11px; color: var(--muted); margin-top: 5px; }
  .keyword-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 7px; list-style: none; padding: 0; margin: 0 0 16px; }
  .keyword-row li { background: var(--pink-soft); color: #ab3158; border-radius: 999px; padding: 7px 11px; font-size: 12px; font-weight: 600; }
  .report-details, .report-status { color: #666; font-size: 12px; line-height: 1.7; margin: 8px 0; }
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

  .date-row { display: flex; gap: 8px; width: 100%; margin: 0 0 8px; padding: 0; border: 0; min-width: 0; }
  .loading-notice { width: 100%; background: var(--pink-soft); border-radius: 12px; padding: 20px 16px; margin: 8px 0 16px; font-size: 14px; }
  .loading-notice strong { display: block; }
  .loading-notice p { color: #555; font-size: 13px; line-height: 1.7; margin: 8px 0 0; word-break: keep-all; }
  .loading-spinner { display: block; width: 26px; height: 26px; margin: 0 auto 12px; border: 3px solid #f3bfd0; border-top-color: var(--pink); border-radius: 50%; animation: spin 1s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .loading-spinner { animation: none; } }
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

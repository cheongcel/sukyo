# Sukyo — 27수 성향과 궁합

Java 17 · Spring Boot · PostgreSQL · React/Vite

양력 생년월일(1900-01-01~2100-12-31)을 일본 구력의 월·일로 변환한 후
월숙방통력(月宿傍通暦)으로 27수 중 하나를 계산합니다.
달 황경을 27등분하던 이전 방식은 사용하지 않습니다.

- `SukyoCalendarService`: 버전이 고정된 구력 월 시작일 자료로 날짜 변환.
  서버 시간대와 출생시각에 의존하지 않으며, 요청 중 외부 API를 호출하지 않습니다.
- 윤달은 동일한 월 번호의 숙 배정표를 사용합니다.
- `RelationType`: 삼구의 비법. 거리 0/9/18은 명/업/태이며 나머지는
  영/쇠/안/위/성/괴/우/친의 9칸 주기로 계산합니다.
- 각 숙은 무료 성향·연애 본문과 핵심 키워드 3개를 제공합니다.
- 데이터 갱신 시 기존 숙의 DB ID를 보존합니다.

## API

```text
POST /api/sukyo/star
{"year":2002,"month":2,"day":25}
```

장수(張宿), `starIndex: 24`, `keywords: ["표현력", "존재감", "나눔"]`을 반환합니다.
`starIndex`는 0=각수부터 26=진수까지의 고정 식별자이며 DB 행 ID가 아닙니다.
한글 이름이 같은 위수(危宿/胃宿)는 서로 다른 식별자를 사용합니다.

```text
POST /api/sukyo/compatibility
{"me":{"year":2002,"month":2,"day":25},"partner":{"year":2002,"month":2,"day":26}}
```

현재는 숙 이름·관계·한 줄 요약을 무료로 반환하고 상세 본문은 잠긴 상태입니다.
유효하지 않은 날짜는 HTTP 400으로 거부합니다.

## 실행과 검증

```sh
mvn test                         # 실제 PostgreSQL 없이 H2로 API/시드 테스트
mvn spring-boot:run               # PostgreSQL 연결 설정 필요
cd frontend
npm ci
npm run build
npm run dev
```

Docker 실행은 기존 Dockerfile을 사용합니다.
계산 변경은 백엔드, 키워드/가격/로딩 UI는 프론트엔드에 각각 반영해야 합니다.
실제 프론트엔드 진입점은 `frontend/src/main.jsx`가 참조하는 `App.jsx`입니다.
루트 `sukyo.tsx`와 `frontend/src/App.tsx`는 실행 진입점이 아닙니다.

자료 출처·윤달 정책·검증 날짜는 `docs/calculation.md`를 참고하세요.
유료 상품 기획은 `docs/paid-reports.md`에 기록되어 있으며 결제/본문 구현은 보류 상태입니다.

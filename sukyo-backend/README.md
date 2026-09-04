# Sukyo — 27수 기반 성향/궁합 API

Java 17 · Spring Boot · Spring Data JPA · PostgreSQL · Docker

생년월일을 입력받아 그날 달의 황경을 계산해 전통 27수(宿) 체계 중 하나로
매핑하고, 두 사람의 宿 사이 순환 거리로 9가지 궁합 관계를 판정하는 REST API.

## 핵심 설계

- **천문 계산**: 외부 천체력 파일이나 API 없이 Jean Meeus의 달 위치 근사식을
  Java로 직접 구현(`MoonCalculatorService`)해 서버 자체적으로 각(도) 단위
  정밀도의 계산을 수행한다.
- **도메인 모델링**: 27수를 `Star` JPA 엔티티로 관리하고, 궁합 판정 로직은
  `RelationType` enum에 캡슐화해 순환 거리 → 관계 유형 매핑을 표현했다.
- **결제 게이트 설계**: 궁합 API는 관계 유형과 한 줄 요약까지만 무료로
  반환하고, 상세 리포트(`unlocked=true`)는 결제 검증 이후에만 노출하도록
  응답 구조를 분리했다.

## API

```
POST /api/sukyo/star
{ "year": 1996, "month": 3, "day": 14 }

POST /api/sukyo/compatibility
{
  "me": { "year": 1996, "month": 3, "day": 14 },
  "partner": { "year": 1998, "month": 7, "day": 2 }
}
```

## 실행

```bash
# 로컬 (PostgreSQL 필요)
mvn spring-boot:run

# Docker
docker build -t sukyo-backend .
docker run -p 8080:8080 --env-file .env sukyo-backend
```

# 숙요점 프론트엔드

React + Vite. 27수 성향/궁합 결과를 보여주는 화면.

## 로컬 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```
`dist/` 폴더가 생성됩니다. Render Static Site에 이 폴더를 배포하면 됩니다.

## 백엔드 연결

빌드 시 `VITE_API_BASE_URL` 환경변수로 백엔드 주소를 지정할 수 있습니다.
지금은 `https://sukyo-backend.onrender.com`으로 설정되어 있습니다.

## Render 배포 (Static Site)

1. 이 폴더를 GitHub 저장소로 올리기 (기존 `sukyo` 저장소에 `frontend/` 폴더로 넣어도 되고, 새 저장소로 분리해도 됨)
2. Render 대시보드 → New → Static Site
3. 저장소 선택
4. Build Command: `npm install && npm run build`
5. Publish Directory: `dist`

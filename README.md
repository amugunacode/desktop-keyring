# 데스크탑키링 다운로드 페이지

Windows용 데스크탑키링 v2.3 소개·다운로드 사이트입니다. 프레임워크나 런타임 의존 패키지가 없는 HTML/CSS/JavaScript 사이트이며 Vercel에서 정적 파일로 배포합니다. Windows 프로그램 소스는 이 저장소에 포함하지 않습니다.

## 로컬 실행

Node.js 20 이상만 필요합니다. 별도 패키지 설치가 없습니다.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

http://127.0.0.1:4173 에서 확인합니다. `public`이 원본이며 `dist`는 빌드 결과입니다.

## 다운로드와 업데이트

`release.json`에 버전, GitHub 저장소, 공개 ZIP의 바이트 크기와 SHA-256, 운영 사이트 주소를 기록합니다. 다운로드 버튼은 `https://github.com/{repository}/releases/latest/download/DesktopKeyring-Windows.zip`으로 연결됩니다.

새 버전 릴리스에도 **동일한 파일 이름 `DesktopKeyring-Windows.zip`** 을 사용하고 최신 정식 릴리스로 지정하세요. 사용자에게 보낸 사이트 주소와 다운로드 버튼은 유지됩니다. 파일명이나 버전이 바뀌면 `release.json`도 업데이트하고 다시 배포합니다. 자동 업데이트 기능은 Windows 프로그램에 포함되어 있지 않습니다.

## Vercel 배포

Vercel에서 이 GitHub 저장소를 Import합니다. Framework Preset은 **Other**, Build Command는 `node scripts/build.mjs`, Output Directory는 `dist`입니다. `vercel.json`에 이미 설정되어 있습니다.

CLI를 이용할 수도 있습니다.

```sh
npx vercel login
npx vercel --prod
```

GitHub 연동이 설정되어 있으면 `main` 브랜치에 push할 때 자동 배포됩니다. Git 연동 권한은 Vercel/GitHub 계정에서 관리합니다.

## 페이지 동작

- 한국어 반응형 소개 페이지, 모바일 PC용 안내와 링크 복사.
- 곰인형 1개/3개, 밝은/어두운 배경의 Canvas 웹 시연. 고정 시간 간격 물리, 비활성 탭/화면 밖에서 애니메이션 중지, OS 동작 줄이기 설정 존중.
- 실제 Windows 렌더러의 이미지에는 ‘실제 앱 렌더링’을 표시합니다. 웹 시연은 앱의 Win32/아크릴 렌더러를 재현하지 않습니다.
- 다운로드·압축 해제·실행 안내, 트레이 사용법과 호환성 FAQ.
- 외부 분석 도구, 외부 폰트, 쿠키 배너, 연락처 수집 기능은 없습니다.
- 저장소가 미설정된 상태에서는 가짜 다운로드 링크를 활성화하지 않고 운영 빌드를 차단합니다.

기본 곰인형은 이 프로그램용으로 새로 생성한 이미지입니다. 앱의 네이티브 체인/아크릴 렌더링으로 만든 비교 이미지도 함께 사용합니다.

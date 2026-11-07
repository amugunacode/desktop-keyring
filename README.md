# amuguna lab

직접 만든 작은 프로그램들을 모아 둔 정적 사이트입니다. 프레임워크나 런타임 의존 패키지 없이 HTML/CSS/JavaScript로 만들었고 Vercel에서 정적 파일로 배포합니다.

| 주소 | 내용 | 파일 |
|---|---|---|
| https://amugunalab.vercel.app | 프로그램 모음 페이지 (인스타 프로필 링크용) | `public/lab/` |
| https://catpuzzle.vercel.app | 사진 직소 퍼즐 | `public/puzzle/` |

두 주소 모두 같은 Vercel 프로젝트에 연결되어 있고, `vercel.json`의 리다이렉트가 각 주소의 첫 화면을 `/lab/`, `/puzzle/`로 보냅니다. 다른 주소의 첫 화면은 모음 페이지로 갑니다.

## 프로그램 모음 페이지 (`/lab/`)

프로그램마다 미리보기 이미지, 소개, 태그, 버튼이 있는 카드를 보여 줍니다. 프로그램을 추가하려면 `public/lab/index.html`의 `<a class="card">` 블록을 복사해 링크, 이미지, 설명을 바꾸면 됩니다. 스크립트 없이 정적 HTML과 `lab.css`만 씁니다.

## 사진 직소 퍼즐 (`/puzzle/`)

`public/puzzle/index.html` 한 파일로 된 브라우저 직소 퍼즐입니다. 파일을 브라우저로 직접 열어도 동작합니다.

- 사진을 올리거나 샘플 이미지를 골라 24~500조각 퍼즐을 만듭니다. 사진은 브라우저 안에서만 처리되며 업로드되지 않습니다.
- 진행 상황은 이 브라우저의 IndexedDB에만 자동 저장되어 다시 열면 이어서 할 수 있고, 완성하면 지워집니다.
- 화면 문구는 한국어와 영어를 함께 표시합니다.
- 공유하기를 누르면 사진을 작게 압축해 링크의 `#` 뒷부분에 담습니다(서버로 전송되지 않음). 받은 사람은 링크를 열어 바로 플레이하고 보낸 사람의 기록과 비교할 수 있습니다.
- 완성 후에는 맞춘 순서대로 다시 보여 주는 9:16 타임랩스 영상을 브라우저에서 녹화해 저장하거나 공유할 수 있습니다.
- 맞는 자리·틀린 자리·완성 때 나오는 고양이 이미지는 `right-cat.jpg`, `wrong-cat.jpg`, `thumbs-up-cat.jpg`입니다.
- 임시 데모 모드: `?demo=N`(남길 조각 수, 선택적으로 `&t=3:25`)으로 열면 거의 완성된 상태로 시작합니다. 홍보 영상 촬영용이며 저장을 건드리지 않습니다. 코드에 `TEMPORARY`로 표시되어 있습니다.

퍼즐은 인라인 스크립트를 쓰므로 `vercel.json`에서 `/puzzle` 경로에만 별도 CSP를 적용합니다. 나머지 경로에는 인라인 스크립트를 막는 엄격한 CSP가 적용됩니다.

## 로컬 실행

Node.js 20 이상만 필요하며 별도 패키지 설치는 없습니다.

```sh
node scripts/build.mjs
node scripts/serve.mjs
```

http://127.0.0.1:4173 에서 확인합니다. `public`이 원본이며 `dist`는 빌드 결과입니다.

## 배포

`main` 브랜치에 병합하면 Vercel이 자동으로 배포합니다. 빌드 명령(`node scripts/build.mjs`)과 출력 폴더(`dist`)는 `vercel.json`에 설정되어 있습니다. PR마다 Vercel 미리보기 주소가 생깁니다.

새 주소를 붙일 때는 Vercel 프로젝트 **Settings → Domains**에서 추가하고, **Redirect가 아니라 Production에 연결**하세요. 그다음 `vercel.json`의 `redirects`에 그 주소의 첫 화면 규칙을 추가합니다.

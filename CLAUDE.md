# 알바트래커 (AlbaTracker)

소규모 사업장을 위한 아르바이트생 근무 및 급여 관리 웹앱.

## 배포

- GitHub Pages: https://mindg1992.github.io/albatracker/
- 단일 HTML 파일(`index.html`)로 구성되어 별도 빌드 과정 없음
- `main` 브랜치 push 시 자동 배포

## 기술 스택

- **React 18** — CDN (`unpkg.com`) 방식, JSX는 Babel Standalone으로 브라우저에서 변환
- **Tailwind CSS** — CDN 방식
- **데이터 저장** — `localStorage` (서버/DB 없음)

## 프로젝트 구조

모든 코드가 `index.html` 한 파일 안에 있으며, `<script type="text/babel">` 블록 내에 React 컴포넌트가 작성되어 있다.

### 주요 컴포넌트

| 컴포넌트 | 역할 |
|---|---|
| `AlbaTracker` | 루트 컴포넌트, 전역 상태 관리 |
| `LoginScreen` | PIN 잠금 화면 (초기 PIN: `000000`) |
| `TabEmployees` | 현재 근무자 정보 탭 |
| `EmployeeModal` | 근무자 추가/수정 모달 |
| `TabCalendar` | 월별 근무현황 탭 |
| `BulkInputModal` | 월별 일괄 근무 입력 모달 |
| `DailyEditModal` | 일별 근무 수정 모달 |
| `TabPayroll` | 인건비 지급 탭 |
| `TabChart` | 인건비 차트 탭 |
| `TabSettings` | 비밀번호 설정 탭 |

### 탭 구성

1. **현재 근무자 정보** — 근무자 추가/수정/삭제, 시급·소정근로일·계좌 관리
2. **월별 근무현황** — 월별 캘린더, 근무 시간 입력
3. **인건비 지급** — 월별 급여 자동 계산 및 지급 현황
4. **인건비 차트** — 월별 인건비 도넛 차트
5. **비밀번호 설정** — 앱 잠금 PIN 변경

## 근무자 데이터 구조

```js
{
  id: number,
  name: string,
  hireDate: string,       // 'YYYY-MM-DD'
  wage: number,           // 시급 (공란 시 globalMinWage 적용)
  scheduledDays: string,  // 일주일 소정근로일 (주휴수당 계산용)
  dailyHours: string,     // 하루 근로시간 (주휴수당 계산용)
  bank: string,
  account: string,
  memo: string,
  status: 'working' | 'leave' | 'resigned'
}
```

## 전역 설정

- `MIN_WAGE`: 최저시급 기준값 (2026년 기준 `10030`원), UI에서 수정 가능
- `INITIAL_PIN`: 초기 PIN (`000000`)

## 작업 시 주의사항

- 단일 파일 구조이므로 새 파일을 생성하지 않고 `index.html` 내에서 수정
- CDN 라이브러리 버전을 임의로 변경하지 않음
- `localStorage` 키 구조를 바꾸면 기존 사용자 데이터가 유실될 수 있으므로 신중하게 변경
- 빌드/번들러 없음 — npm, package.json 불필요

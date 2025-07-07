# 기여 가이드

프로젝트에 오신 것을 환영합니다! 이 가이드는 개발 환경을 설정하고 기본적인 워크플로우를 이해하는 데 도움을 줄 것입니다.

## 1. 필수 도구 설치

시스템에 다음 도구들이 설치되어 있는지 확인하십시오:

- **pyenv**: Python 버전 관리를 위한 도구입니다.
  - 설치 가이드: [https://github.com/pyenv/pyenv#installation](https://github.com/pyenv/pyenv#installation)
- **pnpm (Corepack을 통해 관리)**: JavaScript/TypeScript 프로젝트를 위한 권장 패키지 관리자입니다. `corepack`을 사용하여 프로젝트에 명시된 `pnpm` 버전을 자동으로 사용합니다.
  - Node.js 16.9 이상 버전에는 `corepack`이 기본으로 포함되어 있습니다.
  - `corepack` 활성화 및 `pnpm` 버전 설정은 초기 설정 단계에서 안내됩니다.
- **Poetry**: `apps/ai-server` 내 Python 의존성 및 가상 환경 관리를 위한 도구입니다.
  - 설치 가이드: [https://python-poetry.org/docs/#installation](https://python-poetry.org/docs/#installation)

## 2. 초기 설정

1.  **저장소 클론:**

    ```bash
    git clone <repository-url>
    cd ai-interview
    ```

2.  **Corepack 활성화 및 pnpm 버전 설정:**
    이 프로젝트는 `corepack`을 사용하여 `pnpm` 버전을 관리합니다.

    ```bash
    corepack enable
    corepack prepare pnpm@10.12.2 --activate
    ```

    이 명령어는 `corepack`을 활성화하고, `package.json`에 명시된 `pnpm` 버전(10.12.2)을 미리 설치하고 활성화하여 프로젝트 전체에서 일관된 `pnpm` 버전을 사용하도록 합니다.

3.  **Python 버전 설치:**
    이 프로젝트는 `pyenv`를 사용하여 Python 버전을 관리합니다.

    ```bash
    pyenv install
    pyenv local
    ```

    이 명령어는 `.python-version`에 지정된 Python 버전을 설치하고 현재 디렉토리에 해당 버전을 설정합니다.

4.  **pnpm 의존성 설치:**
    프로젝트 루트로 이동하여 모든 JavaScript/TypeScript 의존성을 설치합니다.

    ```bash
    pnpm install
    ```

5.  **`ai-server`를 위한 Poetry 의존성 설치:**
    `apps/ai-server` 디렉토리로 이동하여 Poetry를 사용하여 Python 의존성을 설치합니다.
    ```bash
    cd apps/ai-server
    poetry install
    ```
    `poetry shell` 명령어를 사용하여 Poetry 가상 환경을 활성화할 수 있습니다.

## 3. 환경 변수 설정

일부 애플리케이션은 환경 변수를 필요로 합니다. 각 애플리케이션 디렉토리(예: `apps/ai-server/.env.example`) 내의 `.env.example` 파일을 확인하고 이를 기반으로 `.env` 파일을 생성하십시오.

`apps/ai-server` 예시:

```bash
cd apps/ai-server
cp .env.example .env
# .env 파일을 열어 필요한 설정을 편집하십시오.
```

## 4. 애플리케이션 실행

이 프로젝트는 모노레포로 구성되어 있으며, 프로젝트 루트에서 모든 애플리케이션을 통합하여 실행할 수 있습니다.

- **모든 애플리케이션 통합 실행:**
  ```bash
  pnpm dev
  ```
  이 명령어는 `apps/ai-server`, `apps/core-api`, `apps/web-client`를 동시에 개발 모드로 실행합니다.

각 개별 애플리케이션(`apps/ai-server`, `apps/core-api`, `apps/web-client`)에는 실행 방법에 대한 특정 지침이 `README.md` 파일에 있습니다.

- **AI 서버 (Python/FastAPI):**
  ```bash
  cd apps/ai-server
  poetry run uvicorn app.main:app --reload
  ```
- **코어 API (TypeScript/Fastify):**
  ```bash
  cd apps/core-api
  pnpm dev
  ```
- **웹 클라이언트 (Next.js):**
  ```bash
  cd apps/web-client
  pnpm dev
  ```

## 5. 코드 스타일 및 린팅

우리는 코드 포맷팅을 위해 Prettier를, 린팅을 위해 ESLint/Ruff를 사용합니다.

- **코드 포맷팅:**
  ```bash
  pnpm format
  ```
- **코드 린팅:**
  ```bash
  pnpm lint
  ```
  (참고: Ruff를 사용한 Python 린팅은 `ai-server` 프로젝트 내에서 Poetry 스크립트 또는 직접 `ruff` 명령어를 통해 처리됩니다.)

## 6. Git 워크플로우

우리는 커밋 메시지에 Conventional Commits 사양을 따릅니다.

- **커밋 메시지 형식:**

  ```
  <type>(<scope>): <subject>

  [optional body]

  [optional footer]
  ```

  - **type**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `build`, `perf`
  - **scope**: (선택 사항) 예: `web-client`, `ai-server`, `core-api`, `deps`
  - **subject**: 소문자로 시작하고 명령형으로 작성된 간결한 설명.

- **브랜치 전략:**
  우리는 일반적으로 기능 브랜치 워크플로우를 사용합니다.
  1.  새로운 기능 또는 버그 수정을 위한 브랜치를 생성합니다: `git checkout -b feature/your-feature-name` 또는 `bugfix/your-bug-name`.
  2.  변경 사항을 적용하고 Conventional Commits 가이드라인에 따라 커밋합니다.
  3.  푸시하기 전에 필요한 경우 `develop` 브랜치에 리베이스하여 깔끔한 히스토리를 유지합니다 (로컬 브랜치에만 해당하며, 공개된 히스토리는 절대 리베이스하지 마십시오).
      ```bash
      git fetch origin develop
      git rebase origin/develop
      ```
  4.  브랜치를 푸시하고 `develop`으로 Pull Request를 생성합니다.
  5.  기능 구현 완료 시, `develop` 브랜치로 병합할 때 **Squash Merge**를 사용하여 해당 기능의 모든 커밋을 하나의 단일 커밋으로 압축합니다. 이는 `develop` 브랜치의 히스토리를 깔끔하게 유지하고 기능 단위로 관리를 용이하게 합니다.
      ```bash
      # develop 브랜치로 이동
      git checkout develop
      # feature 브랜치의 모든 커밋을 하나의 커밋으로 압축하여 병합
      git merge --squash feature/your-feature-name
      # 압축된 커밋 메시지 작성
      git commit -m "feat(scope): your feature summary"
      ```

# Origin Pricing – Playwright Cucumber Automation Framework

End-to-end test automation framework built using **Playwright**, **Cucumber**, and **TypeScript**, designed to be \*
\*CI-ready**, **Docker-friendly\*\*, and easy to maintain.

---

## Tech Stack

- Playwright – browser automation
- Cucumber (BDD) – feature-driven testing
- TypeScript – strong typing
- Docker – consistent execution across environments
- ESLint – code quality enforcement
- Prettier – code formatting
- Husky + lint-staged – Git hooks
- Winston – structured logging
- multiple-cucumber-html-reporter – HTML reports

---

## Project Structure

```
.
├── features/
├── src/
│   ├── pages/
│   ├── step-definitions/
│   ├── support/
│   ├── utils/
│   └── logger/
├── scripts/
├── reports/
├── logs/
├── Dockerfile
├── .dockerignore
├── .npmrc
├── eslint.config.js
├── cucumber.js
└── package.json
```

---

## Environment Configuration

Create a `.env` file (not committed):

```env
BASE_URL=https://example.com
BROWSER=chromium
HEADLESS=true
```

---

## Running Tests Locally

```bash
npm install
npm test
```

Generate report:

```bash
npm run test:report
```

---

## Docker Usage

Build image:

```bash
docker build -t origin-pricing-tests .
```

Run tests:

```bash
docker run --rm --env-file .env origin-pricing-tests
```

Run with reports:

```bash
docker run --rm \
  --env-file .env \
  -v "$(pwd)/reports:/app/reports" \
  origin-pricing-tests \
  npm run test:report
```

---

## Code Quality

### ESLint

- Errors block commits and pushes
- Warnings allowed

```bash
npm run lint
npm run lint:fix
```

### Prettier

```bash
npm run format
```

---

## Husky Hooks

### Pre-commit

- ESLint (errors only)
- Prettier formatting

### Pre-push

- Full lint check

Warnings never block pushes.

---

## Reporting

HTML report:

```
reports/html/index.html
```

---

## Logging

- Winston logger
- Logs stored under `logs/`
- Info and error logs separated

---

## Notes

- `.env`, `reports/`, `logs/`, `downloads/` are git-ignored
- Docker and CI always run headless

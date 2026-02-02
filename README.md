# Origin Pricing – Playwright Cucumber Automation Framework

### About the Framework

This project is an end-to-end test automation framework for validating Origin Energy pricing journeys, including:

- Address search and plan discovery

- Plan filtering and navigation

- Opening plan details in new tabs

- Downloading and validating PDF plans

- Verifying Gas vs Electricity business rules

The framework is built to be maintainable, scalable, and CI-ready.

### Overall Tech Stack

- Language: TypeScript

- Test Runner: Cucumber (BDD)

- Automation Tool: Playwright

- Design Pattern: Page Object Model (POM)

- Execution: Local (headed/headless) and Docker

### Cucumber (BDD)

Tests are written in Gherkin for readability and collaboration.
Feature files describe behavior, while step definitions implement the logic in TypeScript.

### Playwright

Playwright handles all browser automation:

- Reliable multi-browser support

- New tab and download handling

- Fast, stable headless execution for CI

### Page Object Model

Each page is represented by a dedicated class to:

- Encapsulate locators and actions

- Keep step definitions clean

- Improve reuse and maintainability

## Detailed Tech Stack

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

## Overall Project Structure

```

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

The framework runs fully in Docker using the official Playwright image:

Headless by default

No local browser setup required

Ideal for CI/CD pipelines

Build image:

```bash
docker build -t origin-pricing-tests .
```

Run tests:

```bash
docker run --rm --env-file .env -e HEADLESS=true origin-pricing-tests
```

Run with reports:

```bash
docker run -it --rm \
  --env-file .env \
  -v "$(pwd)/reports:/app/reports" \
  HEADLESS=true
  origin-pricing-tests \
  sh -c "npm run test:report"
```

---

## Code Quality

### ESLint

ESLint enforces:

- TypeScript best practices

- Safer typing

- Consistent code structure

It errors block commits/pushes; warnings are visible but allowed.

- Errors block commits and pushes
- Warnings allowed

```bash
npm run lint
npm run lint:fix
```

### Prettier

Prettier handles automatic code formatting:

- Consistent spacing and quotes

- Zero formatting debates

- Runs automatically via Husky

```bash
npm run format
```

---

## Husky Hooks

Husky enforces quality checks before code reaches the repository.

- pre-commit: runs ESLint and Prettier on staged files

- pre-push: runs full lint validation

This prevents broken or poorly formatted code from being pushed.

### Pre-commit

- ESLint (errors only)
- Prettier formatting

### Pre-push

- Full lint check

Warnings never block pushes.

---

## Reporting & Logging

- Winston for structured execution logs

- Screenshots captured on failure

- Cucumber HTML reports with step-level visibility

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

## Environment Configuration

Runtime configuration is managed via .env:

- BASE_URL=https://www.originenergy.com.au
- HEADLESS=false
- BROWSER=chromium

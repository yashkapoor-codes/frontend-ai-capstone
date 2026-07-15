# Settings Form Workflow: Round 1 vs Round 2

## Overview

This project compared two approaches to building the same Settings form in a React/Vite app. Round 1 used a vague prompt. Round 2 used a structured inspect → plan → approval → implementation → verification workflow.

## Round 1: Vague Prompt

**Prompt:** "Add a settings form with validation to this app."

Round 1 looked successful at first. The form rendered, fields accepted input, and validation messages appeared for bad values. A quick manual pass suggested the feature was done.

The critical gap was persistence. Saved values disappeared after a browser refresh because Round 1 never wrote settings to `localStorage`. I caught this only by reloading the page — something the prompt never required. That is the main AI mistake from Round 1: shipping surface-level validation without defining save, reload, or reset behavior.

## Round 2: Structured Workflow

Round 2 followed inspect → plan → approval → implementation → verification.

Before any code changed, the assistant reviewed `package.json`, `App.jsx`, styles, and project structure, then produced a plan listing files to change, test strategy, and commands to run. Implementation started only after approval.

Round 2 added full persistence using the `frontend-ai-capstone-settings` `localStorage` key. On reload, saved settings repopulate the form. Reset clears the form, removes stored data, and dismisses success feedback. Five automated tests cover invalid email, invalid username, successful saving, reload persistence, and reset behavior. Verification ran `npm run lint`, `npm run build`, and `npm test` — all passed.

Two issues were caught and fixed during Round 2 verification: an ESLint error for loading state inside `useEffect` (fixed with lazy `useState` initialization), and test failures from a missing `localStorage` environment (fixed with a test setup polyfill).

## Comparison

### Correctness

Round 1 validated some inputs but lost data on refresh. Round 2 defined explicit field rules, save and reset contracts, and automated tests that lock behavior in place.

### Accessibility

Round 2 required visible labels, `aria-invalid`, `aria-describedby`, and `role="alert"` on errors. Round 1’s vague prompt left accessibility as optional polish rather than a requirement.

### Edge Cases

Round 2 planned for blur vs Save validation, first-invalid focus on submit, trimmed required fields, bio character limits, and checkbox state. Round 1 focused on happy-path validation without persistence or reset edge cases.

### Review Effort

Round 1 needed manual reload testing to find the persistence bug. Round 2 front-loaded requirements and ended with lint, build, and test gates — reducing guesswork and catching two implementation issues before commit.

## Conclusion

A detailed prompt and approval workflow produced a more durable Settings form than a one-line request that looked done but failed on refresh.

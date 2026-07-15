## Project rules

1. Settings data must use `frontend-ai-capstone-settings` in `localStorage`, and Reset must remove it.
2. Required fields must validate on blur and on Save; Save must focus the first invalid field.
3. Every input needs a visible label; errors need `aria-invalid`, `aria-describedby`, and `role="alert"`.
4. Changes to Settings behavior require tests for invalid input, saving, reload persistence, and Reset; run lint, build, and tests before committing.

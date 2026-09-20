# S1 implementation handoff

Status: folder created; implementation pending.

Nothing in this file should be marked complete until the exact delivered build and harness have been verified.

## Verification checklist

- [ ] Build hash recorded
- [ ] No original baseline overwritten
- [ ] New Run resets OW state
- [ ] Save/load restores OW state and methods
- [ ] End Turn advances one OW wave
- [ ] Meeting verb reaches `OW.encounter`
- [ ] Duplicate messages are idempotent
- [ ] Failed starts refund resources
- [ ] Lifecycle harness passes
- [ ] Visual/WebGL gate status recorded

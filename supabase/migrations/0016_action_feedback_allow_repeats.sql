-- action_feedback (0015) originally allowed exactly one row per
-- (user_id, action_type) ever — the popup has since changed from "ask
-- once, forever" to "check back in periodically" (see lib/action-feedback.ts's
-- COOLDOWN_DAYS), so a user leaving a second rating weeks later must be able
-- to insert a new row rather than being permanently blocked by the old
-- unique constraint. The auto-generated constraint name below is Postgres's
-- default for `unique (user_id, action_type)` declared inline in 0015.
alter table public.action_feedback
  drop constraint if exists action_feedback_user_id_action_type_key;

-- The anonymous "Prepara il colloquio" flow (generate before signup, claim
-- at signup — see lib/interview-prep-store.ts's claimPendingInterviewPrep)
-- has no account yet at generation time, so hashInterviewJobPosting (which
-- is scoped by user_id for duplicate detection) can't be computed until
-- after signup. job_hash is purely a "did I already research this"
-- convenience check, not an identity column, so null is a fine "not
-- checked" state for a claimed anonymous report.
alter table public.interview_preps alter column job_hash drop not null;

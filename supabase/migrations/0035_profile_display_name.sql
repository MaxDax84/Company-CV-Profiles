-- The CV "name" shown throughout the account (card headings, download
-- filenames) used to just BE the URL slug — which itself defaulted to
-- either the uploaded PDF's own filename or the person's name, slugified.
-- Neither is something anyone would choose as a display name on purpose:
-- a descriptively-named upload ("Mario_Rossi_CV_Sales_Manager_2026.pdf")
-- became the CV's permanent-looking "name", hyphens and all. This column
-- decouples the two: the slug stays a technical, auto-generated URL
-- identifier; display_name is a free-text label the owner actually chooses,
-- shown everywhere a CV's name appears.
alter table public.profiles add column if not exists display_name text;

-- Backfill for every row created before this column existed — same
-- derivation lib/download-filename.ts's positionLabel() already uses for a
-- tailored profile's label, extended with a full_name fallback so nothing
-- ends up blank: target_role/target_company (tailored), else
-- personal_info.title, else personal_info.full_name.
update public.profiles set display_name = trim(both ' ' from
  case
    when nullif(data->'metadata'->>'target_role', '') is not null
     and nullif(data->'metadata'->>'target_company', '') is not null
      then (data->'metadata'->>'target_role') || ' - ' || (data->'metadata'->>'target_company')
    when nullif(data->'metadata'->>'target_role', '') is not null
      then data->'metadata'->>'target_role'
    when nullif(data->'metadata'->>'target_company', '') is not null
      then data->'metadata'->>'target_company'
    when nullif(data->'personal_info'->>'title', '') is not null
      then data->'personal_info'->>'title'
    else data->'personal_info'->>'full_name'
  end
)
where display_name is null;

-- Last-resort fallback for the rare row where even full_name was blank.
update public.profiles set display_name = 'CV'
where display_name is null or trim(display_name) = '';

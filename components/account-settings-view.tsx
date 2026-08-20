"use client";

import { useState } from "react";
import EditPersonalInfoForm from "@/components/edit-personal-info-form";
import ChangeEmailForm from "@/components/change-email-form";
import ChangePasswordForm from "@/components/change-password-form";
import RequestDomainForm from "@/components/request-domain-form";
import AvatarUploadForm from "@/components/avatar-upload-form";
import { DeleteAccountButton } from "@/components/account-actions";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </h2>
  );
}

interface AccountSettingsViewProps {
  userId: string;
  userEmail: string;
  avatarUrl: string | null;
  accountCode: string;
  profileRow: { data: ProfileSchema } | null;
}

// A full page (see app/account/settings/page.tsx) rather than the sliding
// drawer this used to be — the rarely-touched, "technical" account sections,
// reached via the avatar dropdown's "Account" item (components/
// account-avatar-menu.tsx) from anywhere on the site.
export default function AccountSettingsView({ userId, userEmail, avatarUrl, accountCode, profileRow }: AccountSettingsViewProps) {
  const [editingEmail, setEditingEmail] = useState(false);
  const { lang } = useLanguage();
  const tr = (it: string, en: string) => (lang === "en" ? en : it);

  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <SectionTitle>{tr("Foto profilo", "Profile photo")}</SectionTitle>
        <div className="glass-card rounded-2xl p-5">
          <AvatarUploadForm userId={userId} currentUrl={avatarUrl} />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>{tr("Dati anagrafici", "Personal details")}</SectionTitle>
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-xs text-muted-foreground/60 mb-0.5">Email</p>
            <div className="flex items-center gap-2.5">
              <p className="text-sm font-medium">{userEmail}</p>
              <button
                onClick={() => setEditingEmail(v => !v)}
                className="text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {editingEmail ? tr("Annulla", "Cancel") : tr("Modifica", "Edit")}
              </button>
            </div>
            {editingEmail && (
              <div className="mt-3">
                <ChangeEmailForm currentEmail={userEmail} />
              </div>
            )}
          </div>
          <div>
            <p className="text-xs text-muted-foreground/60 mb-0.5">{tr("Codice account", "Account code")}</p>
            <p className="text-sm font-medium font-mono tracking-wide">{accountCode}</p>
          </div>
          {profileRow && (
            <EditPersonalInfoForm
              fullName={profileRow.data.personal_info.full_name}
              title={profileRow.data.personal_info.title}
              location={profileRow.data.personal_info.location ?? ""}
            />
          )}
        </div>
        {profileRow && (
          <p className="text-xs text-muted-foreground/50">
            {tr("Nome, ruolo e località arrivano dal tuo CV, ma puoi correggerli qui in qualsiasi momento.", "Name, role, and location come from your CV, but you can correct them here at any time.")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <SectionTitle>Password</SectionTitle>
        <div className="glass-card rounded-2xl p-5">
          <ChangePasswordForm />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>{tr("Dominio personalizzato", "Custom domain")}</SectionTitle>
        <div className="glass-card rounded-2xl p-5 space-y-3">
          <p className="text-xs text-muted-foreground">
            {tr(
              "Vuoi la tua pagina su un dominio tuo (es. mario-rossi.it) invece del link Jobli? Mandaci una richiesta, ti ricontattiamo per i dettagli.",
              "Want your page on your own domain (e.g. mario-rossi.com) instead of a Jobli link? Send us a request and we'll get back to you with the details."
            )}
          </p>
          <RequestDomainForm />
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>{tr("Metodo di pagamento", "Payment method")}</SectionTitle>
        <div className="glass-card rounded-2xl p-5 flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {tr("Al momento i crediti vengono assegnati manualmente — pagamenti self-service in arrivo.", "Credits are currently granted manually — self-service payments are coming soon.")}
          </p>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20">
            {tr("In arrivo", "Coming soon")}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>Privacy</SectionTitle>
        <div className="glass-card rounded-2xl p-5">
          <a href="/privacy" className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
            {tr("Leggi la privacy policy →", "Read the privacy policy →")}
          </a>
        </div>
      </div>

      <div className="space-y-3">
        <SectionTitle>{tr("Zona pericolosa", "Danger zone")}</SectionTitle>
        <div className="rounded-2xl p-5 border border-destructive/20 bg-destructive/[0.03] space-y-3">
          <p className="text-xs text-muted-foreground">
            {tr(
              "Elimina definitivamente il tuo account: profilo, CV adattati e crediti verranno cancellati senza possibilità di recupero.",
              "Permanently delete your account: profile, tailored CVs, and credits will be erased with no way to recover them."
            )}
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}

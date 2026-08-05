import { ShieldCheck, Trash2, Clock } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/i18n";

export default function TrustBadges() {
  const { lang } = useLanguage();
  const t = translations[lang].trust;

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground/50">
      <span className="flex items-center gap-1.5">
        <Clock className="w-3 h-3 shrink-0" />
        {t.autoDelete}
      </span>
      <span className="flex items-center gap-1.5">
        <Trash2 className="w-3 h-3 shrink-0" />
        {t.deletable}
      </span>
      <span className="flex items-center gap-1.5">
        <ShieldCheck className="w-3 h-3 shrink-0" />
        {t.noSharing}
      </span>
    </div>
  );
}

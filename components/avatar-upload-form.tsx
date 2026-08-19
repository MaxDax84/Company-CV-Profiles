"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const MAX_SIZE = 3 * 1024 * 1024; // 3MB — a profile photo, not a portfolio asset

interface AvatarUploadFormProps {
  userId: string;
  currentUrl: string | null;
}

export default function AvatarUploadForm({ userId, currentUrl }: AvatarUploadFormProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setStatus("error");
      setErrorMsg("Il file deve essere un'immagine.");
      return;
    }
    if (file.size > MAX_SIZE) {
      setStatus("error");
      setErrorMsg("L'immagine deve essere sotto i 3MB.");
      return;
    }

    setStatus("uploading");
    const supabase = createBrowserSupabaseClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    // Fixed filename (not a fresh UUID each time) — a re-upload overwrites
    // the previous photo instead of orphaning it in storage forever.
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (uploadError) {
      setStatus("error");
      setErrorMsg(uploadError.message);
      return;
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-bust: same path every time, so without this the browser (and
    // any CDN edge) would keep showing the old photo after a re-upload.
    const url = `${pub.publicUrl}?t=${Date.now()}`;

    const { error: dbError } = await supabase
      .from("account_settings")
      .upsert({ user_id: userId, avatar_url: url }, { onConflict: "user_id" });
    if (dbError) {
      setStatus("error");
      setErrorMsg(dbError.message);
      return;
    }

    setStatus("idle");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => inputRef.current?.click()}
        className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-colors shrink-0 bg-primary/10 flex items-center justify-center group"
      >
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={currentUrl} alt="Foto profilo" className="w-full h-full object-cover" />
        ) : (
          <Camera className="w-5 h-5 text-primary/50" />
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
      </button>
      <div className="space-y-1">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading"}
          className="text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50"
        >
          {status === "uploading" ? "Caricamento…" : currentUrl ? "Cambia foto" : "Carica una foto"}
        </button>
        {status === "error" && <p className="text-xs text-destructive">{errorMsg}</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

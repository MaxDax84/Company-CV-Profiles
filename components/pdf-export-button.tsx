interface PdfExportButtonProps {
  slug: string;
  label: string;
  className?: string;
}

export default function PdfExportButton({ slug, label, className }: PdfExportButtonProps) {
  return (
    <a href={`/api/pdf/${slug}`} download className={className}>
      {label}
    </a>
  );
}

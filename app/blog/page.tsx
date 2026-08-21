import type { Metadata } from "next";
import BlogIndexBody from "./BlogIndexBody";

export const metadata: Metadata = {
  title: "Blog — Jobli",
  description: "Consigli pratici su colloqui, CV, ATS e carriera, scritti per chi sta cercando lavoro adesso, non per fare numero.",
};

export default function BlogIndexPage() {
  return <BlogIndexBody />;
}

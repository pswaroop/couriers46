// src/components/admin/BlogFormDialog.tsx

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────────────

interface ContentBlock {
  _id: string; // local-only key; stripped before save
  type: string;
  heading: string;
  body: string;
  items: string[];
  imageUrl: string;
  imageAlt: string;
  ctaText: string;
  ctaUrl: string;
  cite: string;
}

export interface BlogFormDialogProps {
  open: boolean;
  editingItem: any | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOG_CATEGORIES = [
  { value: "same-day-courier", label: "Same Day Courier" },
  { value: "urgent-delivery", label: "Urgent Delivery" },
  { value: "document-courier", label: "Document Courier" },
  { value: "legal-courier", label: "Legal Courier" },
  { value: "medical-courier", label: "Medical Courier" },
  { value: "courier-cost-guides", label: "Courier Cost Guides" },
  { value: "location-guides", label: "Location Guides" },
  { value: "business-logistics", label: "Business Logistics" },
];

const BLOCK_TYPES = [
  { value: "textSection", label: "📝 Text Section" },
  { value: "bulletSection", label: "• Bullet List" },
  { value: "imageLeftTextRight", label: "🖼️ Image Left + Text Right" },
  { value: "imageRightTextLeft", label: "🖼️ Image Right + Text Left" },
  { value: "calloutCard", label: "📌 Callout Card" },
  { value: "ctaBanner", label: "🎯 CTA Banner" },
  { value: "quoteBlock", label: "💬 Quote Block" },
  { value: "tableBlock", label: "📊 Table Block" },
  { value: "faqSection", label: "❓ FAQ Section" },
  { value: "internalLinkSection", label: "🔗 Internal Link Section" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makeBlock = (): ContentBlock => ({
  _id: Math.random().toString(36).slice(2),
  type: "textSection",
  heading: "",
  body: "",
  items: [],
  imageUrl: "",
  imageAlt: "",
  ctaText: "",
  ctaUrl: "",
  cite: "",
});

// ── Sub-components ────────────────────────────────────────────────────────────

/** Reusable tag/chip input (Enter or comma to add) */
const TagInput = ({
  label,
  tags,
  onChange,
  placeholder = "Type and press Enter",
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");

  const commit = (raw: string) => {
    const val = raw.trim().replace(/,+$/, "");
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit(input);
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold text-[#134467]">{label}</Label>
      <div className="flex flex-wrap gap-1.5 min-h-[42px] rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
            {tag}
            <button
              type="button"
              className="rounded-full hover:bg-destructive/20 p-0.5"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 min-w-[140px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && commit(input)}
          placeholder={tags.length === 0 ? placeholder : ""}
        />
      </div>
    </div>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-bold uppercase tracking-widest text-[#134467]/50 pt-2 pb-1 border-b border-slate-100 mb-3">
    {children}
  </div>
);

const Field = ({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-semibold text-[#134467]">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

export function BlogFormDialog({
  open,
  editingItem,
  onClose,
  onSave,
}: BlogFormDialogProps) {
  const isEdit = !!editingItem;
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [slugManual, setSlugManual] = useState(false);

  // ── Basic ──
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [category, setCategory] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredBadge, setFeaturedBadge] = useState("");

  // ── Hero / Listing ──
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredImageAlt, setFeaturedImageAlt] = useState("");
  const [excerpt, setExcerpt] = useState("");

  // ── Author / Publishing ──
  const [authorName, setAuthorName] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [readingTime, setReadingTime] = useState("");

  // ── Content ──
  const [intro, setIntro] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);

  // ── SEO ──
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [noindex, setNoindex] = useState(false);
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [secondaryKeywords, setSecondaryKeywords] = useState<string[]>([]);

  // ── Relations ──
  const [relatedServiceSlugs, setRelatedServiceSlugs] = useState<string[]>([]);
  const [relatedLocationSlugs, setRelatedLocationSlugs] = useState<string[]>(
    [],
  );
  const [relatedSectorSlugs, setRelatedSectorSlugs] = useState<string[]>([]);

  // ── Populate / reset on open ──────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    if (editingItem) {
      setTitle(editingItem.title ?? "");
      setSlug(editingItem.slug ?? "");
      setSlugManual(true);
      setStatus(editingItem.status ?? "draft");
      setCategory(editingItem.category ?? "");
      setIsFeatured(editingItem.isFeatured ?? false);
      setFeaturedBadge(editingItem.featuredBadge ?? "");
      setFeaturedImage(editingItem.featuredImage ?? "");
      setFeaturedImageAlt(editingItem.featuredImageAlt ?? "");
      setExcerpt(editingItem.excerpt ?? "");
      setAuthorName(editingItem.authorName ?? "");
      setPublishedDate(editingItem.publishedDate ?? "");
      setReadingTime(editingItem.readingTime ?? "");
      setIntro(editingItem.intro ?? "");
      setContentBlocks(
        (editingItem.contentBlocks ?? []).map((b: any) => ({
          _id: Math.random().toString(36).slice(2),
          heading: "",
          body: "",
          items: [],
          imageUrl: "",
          imageAlt: "",
          ctaText: "",
          ctaUrl: "",
          cite: "",
          ...b,
        })),
      );
      setSeoTitle(editingItem.seoTitle ?? "");
      setSeoDescription(editingItem.seoDescription ?? "");
      setCanonicalUrl(editingItem.canonicalUrl ?? "");
      setOgImage(editingItem.ogImage ?? "");
      setNoindex(editingItem.noindex ?? false);
      setPrimaryKeyword(editingItem.primaryKeyword ?? "");
      setSecondaryKeywords(editingItem.secondaryKeywords ?? []);
      setRelatedServiceSlugs(editingItem.relatedServiceSlugs ?? []);
      setRelatedLocationSlugs(editingItem.relatedLocationSlugs ?? []);
      setRelatedSectorSlugs(editingItem.relatedSectorSlugs ?? []);
    } else {
      // Reset all
      setTitle("");
      setSlug("");
      setSlugManual(false);
      setStatus("draft");
      setCategory("");
      setIsFeatured(false);
      setFeaturedBadge("");
      setFeaturedImage("");
      setFeaturedImageAlt("");
      setExcerpt("");
      setAuthorName("");
      setPublishedDate("");
      setReadingTime("");
      setIntro("");
      setContentBlocks([]);
      setSeoTitle("");
      setSeoDescription("");
      setCanonicalUrl("");
      setOgImage("");
      setNoindex(false);
      setPrimaryKeyword("");
      setSecondaryKeywords([]);
      setRelatedServiceSlugs([]);
      setRelatedLocationSlugs([]);
      setRelatedSectorSlugs([]);
      setActiveTab("basic");
    }
  }, [open, editingItem]);

  // Auto-generate slug from title (new posts only)
  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title));
  }, [title, slugManual]);

  // Auto-fill SEO title on new posts
  useEffect(() => {
    if (!isEdit && title && !seoTitle) setSeoTitle(title);
  }, [title]);

  // ── Block Helpers ─────────────────────────────────────────────────────────
  const addBlock = () => setContentBlocks((p) => [...p, makeBlock()]);

  const updateBlock = (id: string, patch: Partial<ContentBlock>) =>
    setContentBlocks((p) =>
      p.map((b) => (b._id === id ? { ...b, ...patch } : b)),
    );

  const removeBlock = (id: string) =>
    setContentBlocks((p) => p.filter((b) => b._id !== id));

  const moveBlock = (id: string, dir: -1 | 1) => {
    setContentBlocks((prev) => {
      const idx = prev.findIndex((b) => b._id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!title.trim()) return "Title is required.";
    if (!slug.trim()) return "Slug is required.";
    if (status === "published") {
      if (!excerpt.trim()) return "Excerpt is required before publishing.";
      if (!seoTitle.trim()) return "SEO Title is required before publishing.";
      if (!seoDescription.trim())
        return "SEO Description is required before publishing.";
    }
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }
    setIsSaving(true);
    try {
      const cleanBlocks = contentBlocks.map(({ _id, ...rest }) => rest);
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        status,
        category: category || null,
        isFeatured,
        featuredBadge: featuredBadge.trim() || null,
        featuredImage: featuredImage.trim() || null,
        featuredImageAlt: featuredImageAlt.trim() || null,
        excerpt: excerpt.trim() || null,
        authorName: authorName.trim() || null,
        publishedDate: publishedDate || null,
        readingTime: readingTime.trim() || null,
        intro: intro.trim() || null,
        contentBlocks: cleanBlocks,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        canonicalUrl: canonicalUrl.trim() || null,
        ogImage: ogImage.trim() || null,
        noindex,
        primaryKeyword: primaryKeyword.trim() || null,
        secondaryKeywords,
        relatedServiceSlugs,
        relatedLocationSlugs,
        relatedSectorSlugs,
      });
    } catch (e: any) {
      toast.error(e.message ?? "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // ── Block field renderer ──────────────────────────────────────────────────
  const renderBlockFields = (block: ContentBlock) => {
    const upd = (patch: Partial<ContentBlock>) => updateBlock(block._id, patch);
    const needsImage = ["imageLeftTextRight", "imageRightTextLeft"].includes(
      block.type,
    );
    const needsItems = block.type === "bulletSection";
    const needsCta = ["ctaBanner", "calloutCard"].includes(block.type);
    const needsCite = block.type === "quoteBlock";
    const needsFaqIds = block.type === "faqSection";
    const needsBody = !needsItems;

    return (
      <div className="space-y-2.5 mt-2 pl-2 border-l-2 border-slate-200">
        <Field label="Heading / Section Title">
          <Input
            value={block.heading}
            onChange={(e) => upd({ heading: e.target.value })}
            placeholder="Section heading (optional)"
            className="bg-white"
          />
        </Field>

        {needsBody && (
          <Field
            label={
              block.type === "quoteBlock" ? "Quote Text" : "Body / HTML Content"
            }
          >
            <Textarea
              value={block.body}
              onChange={(e) => upd({ body: e.target.value })}
              rows={3}
              placeholder={
                block.type === "quoteBlock"
                  ? "Quote text here..."
                  : "Content… HTML supported"
              }
              className="font-mono text-xs bg-white"
            />
          </Field>
        )}

        {needsItems && (
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-[#134467]">
              Bullet Items
            </Label>
            {block.items.map((item, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const next = [...block.items];
                    next[i] = e.target.value;
                    upd({ items: next });
                  }}
                  placeholder={`Item ${i + 1}`}
                  className="bg-white"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50 shrink-0"
                  onClick={() =>
                    upd({ items: block.items.filter((_, j) => j !== i) })
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-1"
              onClick={() => upd({ items: [...block.items, ""] })}
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Item
            </Button>
          </div>
        )}

        {needsImage && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Image URL">
              <Input
                value={block.imageUrl}
                onChange={(e) => upd({ imageUrl: e.target.value })}
                placeholder="https://..."
                className="bg-white"
              />
            </Field>
            <Field label="Image Alt Text">
              <Input
                value={block.imageAlt}
                onChange={(e) => upd({ imageAlt: e.target.value })}
                placeholder="Descriptive alt text"
                className="bg-white"
              />
            </Field>
          </div>
        )}

        {needsCta && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="CTA Button Text">
              <Input
                value={block.ctaText}
                onChange={(e) => upd({ ctaText: e.target.value })}
                placeholder="e.g. Get a Quote"
                className="bg-white"
              />
            </Field>
            <Field label="CTA URL">
              <Input
                value={block.ctaUrl}
                onChange={(e) => upd({ ctaUrl: e.target.value })}
                placeholder="/get-a-quote"
                className="bg-white"
              />
            </Field>
          </div>
        )}

        {needsCite && (
          <Field label="Attribution / Citation">
            <Input
              value={block.cite}
              onChange={(e) => upd({ cite: e.target.value })}
              placeholder="— Source or Author Name"
              className="bg-white"
            />
          </Field>
        )}

        {needsFaqIds && (
          <Field
            label="FAQ IDs (comma-separated)"
            hint="Enter Firestore FAQ document IDs to embed in this section"
          >
            <Input
              value={block.body}
              onChange={(e) => upd({ body: e.target.value })}
              placeholder="faqId1, faqId2, faqId3"
              className="font-mono text-xs bg-white"
            />
          </Field>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[92vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <DialogTitle className="text-[#134467] text-xl font-bold">
            {isEdit ? "✏️ Edit Blog Post" : "✨ Create New Blog Post"}
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col px-6"
        >
          <TabsList className="shrink-0 grid grid-cols-4 w-full mt-4">
            <TabsTrigger value="basic">📋 Basic</TabsTrigger>
            <TabsTrigger value="content">📝 Content</TabsTrigger>
            <TabsTrigger value="seo">🔍 SEO</TabsTrigger>
            <TabsTrigger value="relations">🔗 Relations</TabsTrigger>
          </TabsList>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-0">
            {/* ── TAB 1: Basic ───────────────────────────────────────────── */}
            <TabsContent
              value="basic"
              className="mt-0 space-y-5 focus-visible:outline-none"
            >
              <SectionLabel>Core Details</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field label="Post Title" required>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Same Day Courier Services in London – Everything You Need to Know"
                      className="text-base"
                    />
                  </Field>
                </div>

                <Field
                  label="Slug"
                  required
                  hint="Auto-generated. Edit to override."
                >
                  <Input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setSlugManual(true);
                    }}
                    placeholder="same-day-courier-london"
                    className="font-mono text-sm"
                  />
                </Field>

                <Field label="Status" required>
                  <Select
                    value={status}
                    onValueChange={(v) => setStatus(v as "draft" | "published")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">🟡 Draft</SelectItem>
                      <SelectItem value="published">🟢 Published</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Category">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category…" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Author Name">
                  <Input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="FourSix46 Team"
                  />
                </Field>

                <Field label="Published Date">
                  <Input
                    type="date"
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                  />
                </Field>

                <Field label="Reading Time" hint="Shown to readers">
                  <Input
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    placeholder="5 min read"
                  />
                </Field>
              </div>

              <SectionLabel>Hero / Listing Card</SectionLabel>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Field
                    label="Excerpt"
                    hint="150–220 characters — shown in listing cards and used as meta fallback"
                  >
                    <Textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      rows={3}
                      placeholder="A short summary of the post shown in the blog index and sharing snippets…"
                    />
                    <p
                      className={`text-xs mt-1 ${excerpt.length > 220 ? "text-red-500 font-medium" : "text-muted-foreground"}`}
                    >
                      {excerpt.length} / 220 chars
                    </p>
                  </Field>
                </div>

                <div className="col-span-2">
                  <Field label="Featured Image URL">
                    <Input
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      placeholder="https://cdn.example.com/blog/hero.jpg"
                    />
                  </Field>
                </div>

                <Field label="Featured Image Alt Text">
                  <Input
                    value={featuredImageAlt}
                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                    placeholder="Courier van driving through London"
                  />
                </Field>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-[#134467]">
                    Featured Post?
                  </Label>
                  <div className="flex items-center gap-3 pt-1.5">
                    <Switch
                      checked={isFeatured}
                      onCheckedChange={setIsFeatured}
                    />
                    <span className="text-sm text-muted-foreground">
                      {isFeatured
                        ? "✅ Shown in featured slots"
                        : "Not featured"}
                    </span>
                  </div>
                </div>

                {isFeatured && (
                  <Field
                    label="Featured Badge Label"
                    hint="e.g. Popular · New · Editor's Pick"
                  >
                    <Input
                      value={featuredBadge}
                      onChange={(e) => setFeaturedBadge(e.target.value)}
                      placeholder="New"
                    />
                  </Field>
                )}
              </div>
            </TabsContent>

            {/* ── TAB 2: Content ─────────────────────────────────────────── */}
            <TabsContent
              value="content"
              className="mt-0 space-y-5 focus-visible:outline-none"
            >
              <SectionLabel>Introduction</SectionLabel>
              <Field
                label="Intro Paragraph(s)"
                hint="Displayed directly below the hero image. HTML is supported."
              >
                <Textarea
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  rows={6}
                  placeholder="Opening paragraphs… <p>You can use HTML tags here.</p>"
                  className="font-mono text-xs"
                />
              </Field>

              <SectionLabel>
                Content Blocks&nbsp;
                <span className="text-[#134467] normal-case font-semibold not-italic">
                  ({contentBlocks.length})
                </span>
              </SectionLabel>

              {contentBlocks.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-6 border border-dashed rounded-xl bg-slate-50">
                  No blocks yet — click <strong>+ Add Content Block</strong> to
                  start building the article body.
                </p>
              )}

              <div className="space-y-3">
                {contentBlocks.map((block, idx) => (
                  <div
                    key={block._id}
                    className="border rounded-xl bg-slate-50/60 p-4 hover:border-blue-200 transition-colors"
                  >
                    {/* Block header row */}
                    <div className="flex items-center gap-2">
                      {/* Up / Down */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-slate-400"
                          disabled={idx === 0}
                          onClick={() => moveBlock(block._id, -1)}
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-5 w-5 text-slate-400"
                          disabled={idx === contentBlocks.length - 1}
                          onClick={() => moveBlock(block._id, 1)}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      {/* Type selector */}
                      <div className="flex-1">
                        <Select
                          value={block.type}
                          onValueChange={(v) =>
                            updateBlock(block._id, { type: v })
                          }
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {BLOCK_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                {t.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-xs font-mono shrink-0 border-slate-300"
                      >
                        #{idx + 1}
                      </Badge>

                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 shrink-0"
                        onClick={() => removeBlock(block._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Block fields */}
                    {renderBlockFields(block)}
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-2 text-[#134467] hover:bg-blue-50 hover:border-blue-300 mt-1"
                onClick={addBlock}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Content Block
              </Button>
            </TabsContent>

            {/* ── TAB 3: SEO ─────────────────────────────────────────────── */}
            <TabsContent
              value="seo"
              className="mt-0 space-y-5 focus-visible:outline-none"
            >
              <SectionLabel>Meta Tags</SectionLabel>

              <Field label="SEO Title" hint="Recommended: 50–60 characters">
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Same Day Courier Services London | Route46"
                />
                <p
                  className={`text-xs mt-1 ${seoTitle.length > 60 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}
                >
                  {seoTitle.length} / 60 chars
                </p>
              </Field>

              <Field
                label="SEO Description"
                hint="Recommended: 150–160 characters"
              >
                <Textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  placeholder="Discover fast, reliable same day courier services across London with Route46. Book online in minutes…"
                />
                <p
                  className={`text-xs mt-1 ${seoDescription.length > 160 ? "text-amber-600 font-medium" : "text-muted-foreground"}`}
                >
                  {seoDescription.length} / 160 chars
                </p>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Canonical URL"
                  hint="Leave blank to use the default page URL"
                >
                  <Input
                    value={canonicalUrl}
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    placeholder="https://foursix46.com/blog/your-slug"
                    className="font-mono text-xs"
                  />
                </Field>
                <Field
                  label="OG Image URL"
                  hint="Used for social sharing previews"
                >
                  <Input
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://cdn.example.com/og/blog.jpg"
                  />
                </Field>
              </div>

              <div className="flex items-center justify-between rounded-xl border bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-[#134467]">
                    No-Index this page
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Instruct search engines not to index this post (e.g. for
                    drafts or duplicates)
                  </p>
                </div>
                <Switch checked={noindex} onCheckedChange={setNoindex} />
              </div>

              <SectionLabel>Keyword Targeting</SectionLabel>

              <Field
                label="Primary Keyword"
                hint="The main keyword this post is optimised for"
              >
                <Input
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="same day courier london"
                />
              </Field>

              <TagInput
                label="Secondary Keywords"
                tags={secondaryKeywords}
                onChange={setSecondaryKeywords}
                placeholder="Type keyword, press Enter or comma"
              />
            </TabsContent>

            {/* ── TAB 4: Relations ───────────────────────────────────────── */}
            <TabsContent
              value="relations"
              className="mt-0 space-y-6 focus-visible:outline-none"
            >
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
                💡 Add the <strong>slugs</strong> of related content to build
                contextual internal links. Press{" "}
                <kbd className="bg-white border border-blue-200 rounded px-1.5 py-0.5 text-xs font-mono">
                  Enter
                </kbd>{" "}
                or{" "}
                <kbd className="bg-white border border-blue-200 rounded px-1.5 py-0.5 text-xs font-mono">
                  ,
                </kbd>{" "}
                after each value.
              </div>

              <TagInput
                label="Related Services (slugs)"
                tags={relatedServiceSlugs}
                onChange={setRelatedServiceSlugs}
                placeholder="e.g. same-day-delivery, urgent-courier"
              />

              <TagInput
                label="Related Locations (slugs)"
                tags={relatedLocationSlugs}
                onChange={setRelatedLocationSlugs}
                placeholder="e.g. london, manchester, birmingham"
              />

              <TagInput
                label="Related Sectors (slugs)"
                tags={relatedSectorSlugs}
                onChange={setRelatedSectorSlugs}
                placeholder="e.g. legal-courier, medical-courier"
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer */}
        <DialogFooter className="shrink-0 gap-2 border-t px-6 py-4">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="bg-[#134467] hover:bg-[#0d2f4a] text-white min-w-[130px]"
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Update Post" : "Create Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

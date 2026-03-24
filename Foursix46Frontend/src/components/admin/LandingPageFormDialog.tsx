import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Trash2, GripVertical } from "lucide-react";

interface ProofPoint {
  id: string;
  title: string;
  description: string;
}

type BlockType =
  | "textSection"
  | "bulletSection"
  | "imageLeftTextRight"
  | "imageRightTextLeft"
  | "calloutCard"
  | "ctaBanner";
const blockLabels: Record<BlockType, string> = {
  textSection: "Text Section",
  bulletSection: "Bullet Section",
  imageLeftTextRight: "Image Left + Text Right",
  imageRightTextLeft: "Image Right + Text Left",
  calloutCard: "Callout Card",
  ctaBanner: "CTA Banner",
};
interface ContentBlock {
  id: string;
  type: BlockType;
  heading?: string;
  richText?: string;
  bullets?: string[];
  imageUrl?: string;
  title?: string;
  shortText?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface LandingPageFormData {
  locationSlug: string;
  serviceSlug: string;
  status: "draft" | "published";
  pageLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  intro: string;
  localProofPoints: ProofPoint[];
  coverageAreasOverride: string[];
  serviceDetailsOverride: string;
  contentBlocks: ContentBlock[];
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  noindex: boolean;
  faqIds: string[];
  faqHeading: string;
}

const defaultForm: LandingPageFormData = {
  locationSlug: "",
  serviceSlug: "",
  status: "draft",
  pageLabel: "",
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  intro: "",
  localProofPoints: [],
  coverageAreasOverride: [],
  serviceDetailsOverride: "",
  contentBlocks: [],
  ctaPrimaryText: "Get a Quote",
  ctaPrimaryLink: "/quick-quote",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogImage: "",
  noindex: false,
  faqIds: [],
  faqHeading: "FAQs",
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="col-span-2 mt-2">
    <h3 className="text-sm font-bold uppercase tracking-widest text-[#134467] border-b-2 border-[#F1C40F] pb-1">
      {title}
    </h3>
  </div>
);

const TagInput = ({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  const [input, setInput] = useState("");
  const add = () => {
    const t = input.trim();
    if (t && !values.includes(t)) onChange([...values, t]);
    setInput("");
  };
  return (
    <div>
      <Label className="mb-1 block">{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" size="sm" variant="outline" onClick={add}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <Badge
            key={v}
            variant="secondary"
            className="flex items-center gap-1 pr-1"
          >
            {v}
            <button
              type="button"
              onClick={() => onChange(values.filter((x) => x !== v))}
              className="ml-1 hover:text-red-500"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

const BlockEditor = ({
  block,
  onChange,
  onRemove,
}: {
  block: ContentBlock;
  onChange: (b: ContentBlock) => void;
  onRemove: () => void;
}) => {
  const u = (f: Partial<ContentBlock>) => onChange({ ...block, ...f });
  return (
    <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
          <Badge variant="outline">{blockLabels[block.type]}</Badge>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
      {[
        "textSection",
        "bulletSection",
        "imageLeftTextRight",
        "imageRightTextLeft",
      ].includes(block.type) && (
        <div>
          <Label className="text-xs">Heading</Label>
          <Input
            value={block.heading ?? ""}
            onChange={(e) => u({ heading: e.target.value })}
          />
        </div>
      )}
      {["textSection", "imageLeftTextRight", "imageRightTextLeft"].includes(
        block.type,
      ) && (
        <div>
          <Label className="text-xs">Content (HTML)</Label>
          <Textarea
            value={block.richText ?? ""}
            onChange={(e) => u({ richText: e.target.value })}
            rows={3}
          />
        </div>
      )}
      {block.type === "bulletSection" && (
        <TagInput
          label="Bullets"
          values={block.bullets ?? []}
          onChange={(v) => u({ bullets: v })}
          placeholder="Add bullet"
        />
      )}
      {["imageLeftTextRight", "imageRightTextLeft"].includes(block.type) && (
        <div>
          <Label className="text-xs">Image URL</Label>
          <Input
            value={block.imageUrl ?? ""}
            onChange={(e) => u({ imageUrl: e.target.value })}
          />
        </div>
      )}
      {block.type === "calloutCard" && (
        <>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={block.title ?? ""}
              onChange={(e) => u({ title: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Short Text</Label>
            <Textarea
              value={block.shortText ?? ""}
              onChange={(e) => u({ shortText: e.target.value })}
              rows={2}
            />
          </div>
        </>
      )}
      {block.type === "ctaBanner" && (
        <>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={block.title ?? ""}
              onChange={(e) => u({ title: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Text</Label>
            <Textarea
              value={block.richText ?? ""}
              onChange={(e) => u({ richText: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Button Text</Label>
              <Input
                value={block.buttonText ?? ""}
                onChange={(e) => u({ buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-xs">Button Link</Label>
              <Input
                value={block.buttonLink ?? ""}
                onChange={(e) => u({ buttonLink: e.target.value })}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface Props {
  open: boolean;
  editingItem: any | null;
  existingPairs?: Array<{
    locationSlug: string;
    serviceSlug: string;
    id: string;
  }>;
  onClose: () => void;
  onSave: (data: LandingPageFormData) => Promise<void>;
}

export function LandingPageFormDialog({
  open,
  editingItem,
  existingPairs = [],
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<LandingPageFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "core" | "content" | "seo" | "faqs"
  >("core");
  const [newBlockType, setNewBlockType] = useState<BlockType>("textSection");

  useEffect(() => {
    setForm(editingItem ? { ...defaultForm, ...editingItem } : defaultForm);
    setActiveTab("core");
  }, [editingItem, open]);

  const update = (f: Partial<LandingPageFormData>) =>
    setForm((p) => ({ ...p, ...f }));

  const addProofPoint = () => {
    update({
      localProofPoints: [
        ...form.localProofPoints,
        { id: `pp_${Date.now()}`, title: "", description: "" },
      ],
    });
  };

  const updateProofPoint = (id: string, fields: Partial<ProofPoint>) => {
    update({
      localProofPoints: form.localProofPoints.map((p) =>
        p.id === id ? { ...p, ...fields } : p,
      ),
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!form.locationSlug || !form.serviceSlug) {
      alert("Location slug and Service slug are required.");
      return;
    }
    if (!form.intro) {
      alert("Intro content is required (must be unique per landing page).");
      return;
    }
    if (!form.seoTitle || !form.seoDescription) {
      alert("SEO Title and Description are required.");
      return;
    }
    // Enforce unique pair (skip check when editing same item)
    const duplicate = existingPairs.find(
      (p) =>
        p.locationSlug === form.locationSlug &&
        p.serviceSlug === form.serviceSlug &&
        p.id !== editingItem?.id,
    );
    if (duplicate) {
      alert(
        `A landing page for "${form.locationSlug} × ${form.serviceSlug}" already exists. Each location+service combination must be unique.`,
      );
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ ...form, status });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { key: "core", label: "Core & Hero" },
    { key: "content", label: "Page Content" },
    { key: "seo", label: "SEO" },
    { key: "faqs", label: "FAQs & CTA" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Landing Page" : "Create Landing Page"}
            {form.locationSlug && form.serviceSlug && (
              <Badge variant="outline" className="ml-2 font-mono text-xs">
                /locations/{form.locationSlug}/{form.serviceSlug}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 border-b pb-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${activeTab === tab.key ? "bg-[#134467] text-white" : "text-muted-foreground hover:bg-muted"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-2">
          {/* CORE & HERO */}
          {activeTab === "core" && (
            <div className="grid grid-cols-2 gap-4">
              <SectionHeader title="Page Identity" />
              <div>
                <Label>
                  Location Slug *{" "}
                  <span className="text-xs text-amber-600">
                    (must match existing location)
                  </span>
                </Label>
                <Input
                  value={form.locationSlug}
                  onChange={(e) =>
                    update({
                      locationSlug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="cardiff"
                />
              </div>
              <div>
                <Label>
                  Service Slug *{" "}
                  <span className="text-xs text-amber-600">
                    (must match existing service)
                  </span>
                </Label>
                <Input
                  value={form.serviceSlug}
                  onChange={(e) =>
                    update({
                      serviceSlug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="same-day-courier"
                />
              </div>
              <div className="col-span-2">
                <Label>Page Label (internal name)</Label>
                <Input
                  value={form.pageLabel}
                  onChange={(e) => update({ pageLabel: e.target.value })}
                  placeholder="e.g. Cardiff × Same Day — v2"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => update({ status: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.locationSlug && form.serviceSlug && (
                <div className="col-span-2 bg-blue-50 rounded-lg p-3 text-sm">
                  🔗 Will be published at:{" "}
                  <code className="font-mono text-blue-700">
                    /locations/{form.locationSlug}/{form.serviceSlug}
                  </code>
                </div>
              )}

              <SectionHeader title="Hero Section" />
              <div className="col-span-2">
                <Label>Hero Title *</Label>
                <Input
                  value={form.heroTitle}
                  onChange={(e) => update({ heroTitle: e.target.value })}
                  placeholder="Same Day Courier Cardiff"
                />
              </div>
              <div className="col-span-2">
                <Label>Hero Subtitle</Label>
                <Input
                  value={form.heroSubtitle}
                  onChange={(e) => update({ heroSubtitle: e.target.value })}
                  placeholder="Reliable collections across Cardiff within 60 minutes"
                />
              </div>
              <div className="col-span-2">
                <Label>Hero Image URL</Label>
                <Input
                  value={form.heroImage}
                  onChange={(e) => update({ heroImage: e.target.value })}
                  placeholder="https://..."
                />
                {form.heroImage && (
                  <img
                    src={form.heroImage}
                    alt="preview"
                    className="mt-2 h-24 rounded border object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* PAGE CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-4">
              <div>
                <Label>
                  Intro *{" "}
                  <span className="text-xs text-amber-600">
                    (must be unique — not copy-pasted from another page)
                  </span>
                </Label>
                <Textarea
                  value={form.intro}
                  onChange={(e) => update({ intro: e.target.value })}
                  rows={5}
                  placeholder="<p>For same day courier services in Cardiff, Route46 provides...</p>"
                  className="font-mono text-sm"
                />
              </div>

              <SectionHeader title="Local Proof Points" />
              {form.localProofPoints.map((pp) => (
                <div
                  key={pp.id}
                  className="border rounded-xl p-3 space-y-2 bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Proof Point</Badge>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        update({
                          localProofPoints: form.localProofPoints.filter(
                            (x) => x.id !== pp.id,
                          ),
                        })
                      }
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={pp.title}
                      onChange={(e) =>
                        updateProofPoint(pp.id, { title: e.target.value })
                      }
                      placeholder="5-Star Rated in Cardiff"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description</Label>
                    <Textarea
                      value={pp.description}
                      onChange={(e) =>
                        updateProofPoint(pp.id, { description: e.target.value })
                      }
                      rows={2}
                      placeholder="Over 200 deliveries completed in the Cardiff area..."
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addProofPoint}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Proof Point
              </Button>

              <SectionHeader title="Overrides" />
              <div>
                <Label>
                  Coverage Areas Override{" "}
                  <span className="text-xs text-muted-foreground">
                    (if different from base location)
                  </span>
                </Label>
                <TagInput
                  label=""
                  values={form.coverageAreasOverride}
                  onChange={(v) => update({ coverageAreasOverride: v })}
                  placeholder="e.g. Penylan, Canton"
                />
              </div>
              <div>
                <Label>
                  Service Details Override{" "}
                  <span className="text-xs text-muted-foreground">
                    (if different from base service)
                  </span>
                </Label>
                <Textarea
                  value={form.serviceDetailsOverride}
                  onChange={(e) =>
                    update({ serviceDetailsOverride: e.target.value })
                  }
                  rows={3}
                  placeholder="<p>For Cardiff specifically, we offer...</p>"
                  className="font-mono text-sm"
                />
              </div>

              <SectionHeader title="Content Blocks" />
              {form.contentBlocks.map((block) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onChange={(b) =>
                    update({
                      contentBlocks: form.contentBlocks.map((x) =>
                        x.id === block.id ? b : x,
                      ),
                    })
                  }
                  onRemove={() =>
                    update({
                      contentBlocks: form.contentBlocks.filter(
                        (x) => x.id !== block.id,
                      ),
                    })
                  }
                />
              ))}
              <div className="flex items-center gap-2 pt-2 border-t">
                <Select
                  value={newBlockType}
                  onValueChange={(v) => setNewBlockType(v as BlockType)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(blockLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    update({
                      contentBlocks: [
                        ...form.contentBlocks,
                        { id: `block_${Date.now()}`, type: newBlockType },
                      ],
                    })
                  }
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Block
                </Button>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <Label>
                  SEO Title *{" "}
                  <span className="text-xs text-muted-foreground">
                    ({form.seoTitle.length}/60)
                  </span>
                </Label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => update({ seoTitle: e.target.value })}
                  placeholder="Same Day Courier Cardiff | Route46 | FourSix46®"
                  maxLength={60}
                />
              </div>
              <div>
                <Label>
                  SEO Description *{" "}
                  <span className="text-xs text-muted-foreground">
                    ({form.seoDescription.length}/160)
                  </span>
                </Label>
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => update({ seoDescription: e.target.value })}
                  placeholder="Fast same-day courier Cardiff. Route46 | FourSix46® collects within 60 minutes..."
                  maxLength={160}
                  rows={3}
                />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => update({ canonicalUrl: e.target.value })}
                  placeholder={`https://couriers.route46couriers.co.uk/locations/${form.locationSlug}/${form.serviceSlug}`}
                />
              </div>
              <div>
                <Label>OG Image URL</Label>
                <Input
                  value={form.ogImage}
                  onChange={(e) => update({ ogImage: e.target.value })}
                  placeholder="https://..."
                />
                {form.ogImage && (
                  <img
                    src={form.ogImage}
                    alt="og"
                    className="mt-2 h-20 rounded border object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Checkbox
                  id="noindex-lp"
                  checked={form.noindex}
                  onCheckedChange={(v) => update({ noindex: !!v })}
                />
                <div>
                  <Label
                    htmlFor="noindex-lp"
                    className="cursor-pointer font-medium"
                  >
                    No Index
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hides from Google. Use for drafts only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQs & CTA */}
          {activeTab === "faqs" && (
            <div className="space-y-4">
              <SectionHeader title="CTA" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input
                    value={form.ctaPrimaryText}
                    onChange={(e) => update({ ctaPrimaryText: e.target.value })}
                    placeholder="Get a Quote"
                  />
                </div>
                <div>
                  <Label>CTA Button Link</Label>
                  <Input
                    value={form.ctaPrimaryLink}
                    onChange={(e) => update({ ctaPrimaryLink: e.target.value })}
                    placeholder="/quick-quote"
                  />
                </div>
              </div>
              <SectionHeader title="FAQs" />
              <div>
                <Label>FAQ Section Heading</Label>
                <Input
                  value={form.faqHeading}
                  onChange={(e) => update({ faqHeading: e.target.value })}
                  placeholder="FAQs"
                />
              </div>
              <TagInput
                label="FAQ IDs (Firestore document IDs)"
                values={form.faqIds}
                onChange={(v) => update({ faqIds: v })}
                placeholder="Paste FAQ doc ID and press Enter"
              />
              <p className="text-xs text-muted-foreground">
                💡 Go to FAQs section, copy the Firestore doc ID and paste it
                here.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
          >
            Save as Draft
          </Button>
          <Button
            className="bg-[#134467] hover:bg-[#0e3352]"
            disabled={isSaving}
            onClick={() => handleSave("published")}
          >
            {isSaving
              ? "Saving..."
              : editingItem
                ? "Update & Publish"
                : "Create & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

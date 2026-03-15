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
import { X, Plus } from "lucide-react";

interface LocationFormData {
  name: string;
  slug: string;
  status: "draft" | "published";
  country: "England" | "Wales" | "Scotland" | "Northern Ireland" | "";
  sortOrder: number;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  intro: string;
  postcodeCoverage: string;
  nearbyAreas: string[];
  serviceRadiusMiles: number | "";
  mapEmbedUrl: string;
  recommendedServices: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  noindex: boolean;
  faqIds: string[];
  faqHeading: string;
}

const defaultForm: LocationFormData = {
  name: "",
  slug: "",
  status: "draft",
  country: "",
  sortOrder: 0,
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  intro: "",
  postcodeCoverage: "",
  nearbyAreas: [],
  serviceRadiusMiles: "",
  mapEmbedUrl: "",
  recommendedServices: [],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogImage: "",
  noindex: false,
  faqIds: [],
  faqHeading: "Local FAQs",
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

interface Props {
  open: boolean;
  editingItem: any | null;
  onClose: () => void;
  onSave: (data: LocationFormData) => Promise<void>;
}

export function LocationFormDialog({
  open,
  editingItem,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<LocationFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "core" | "local" | "seo" | "relations"
  >("core");

  useEffect(() => {
    setForm(editingItem ? { ...defaultForm, ...editingItem } : defaultForm);
    setActiveTab("core");
  }, [editingItem, open]);

  const update = (f: Partial<LocationFormData>) =>
    setForm((p) => ({ ...p, ...f }));

  const handleSave = async (status: "draft" | "published") => {
    if (
      !form.name ||
      !form.slug ||
      !form.heroTitle ||
      !form.seoTitle ||
      !form.seoDescription
    ) {
      alert(
        "Name, Slug, Hero Title, SEO Title and SEO Description are required.",
      );
      return;
    }
    if (status === "published" && !form.recommendedServices.length) {
      alert("At least one Recommended Service is required before publishing.");
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
    { key: "local", label: "Local SEO" },
    { key: "seo", label: "SEO" },
    { key: "relations", label: "Relations & FAQs" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? "Edit Location" : "Create Location"}
            <Badge
              className="ml-2"
              variant={form.status === "published" ? "default" : "secondary"}
            >
              {form.status}
            </Badge>
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
              <SectionHeader title="Core" />
              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  placeholder="Cardiff"
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) =>
                    update({
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    })
                  }
                  placeholder="cardiff"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(v) => update({ country: v as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="England">England</SelectItem>
                    <SelectItem value="Wales">Wales</SelectItem>
                    <SelectItem value="Scotland">Scotland</SelectItem>
                    <SelectItem value="Northern Ireland">
                      Northern Ireland
                    </SelectItem>
                  </SelectContent>
                </Select>
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
              <div>
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    update({ sortOrder: Number(e.target.value) })
                  }
                />
              </div>

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
                  placeholder="Fast, reliable courier across Cardiff and surrounding areas"
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

          {/* LOCAL SEO */}
          {activeTab === "local" && (
            <div className="space-y-4">
              <div>
                <Label>Intro (HTML / Rich Text)</Label>
                <Textarea
                  value={form.intro}
                  onChange={(e) => update({ intro: e.target.value })}
                  rows={5}
                  placeholder="<p>We offer same day courier services across Cardiff...</p>"
                  className="font-mono text-sm"
                />
              </div>
              <div>
                <Label>Postcode Coverage</Label>
                <Input
                  value={form.postcodeCoverage}
                  onChange={(e) => update({ postcodeCoverage: e.target.value })}
                  placeholder="CF, NP, SA..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated postcode prefixes
                </p>
              </div>
              <TagInput
                label="Nearby Areas"
                values={form.nearbyAreas}
                onChange={(v) => update({ nearbyAreas: v })}
                placeholder="e.g. Penylan, Canton, Pontcanna"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Service Radius (miles)</Label>
                  <Input
                    type="number"
                    value={form.serviceRadiusMiles}
                    onChange={(e) =>
                      update({
                        serviceRadiusMiles: e.target.value
                          ? Number(e.target.value)
                          : "",
                      })
                    }
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label>Map Embed URL</Label>
                  <Input
                    value={form.mapEmbedUrl}
                    onChange={(e) => update({ mapEmbedUrl: e.target.value })}
                    placeholder="https://maps.google.com/embed?..."
                  />
                </div>
              </div>
              {form.mapEmbedUrl && (
                <iframe
                  src={form.mapEmbedUrl}
                  className="w-full h-48 rounded border"
                  title="Map preview"
                />
              )}
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
                  placeholder="Same Day Courier Cardiff | FourSix46®"
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
                  placeholder="Fast same-day courier services in Cardiff. Collection within 60 minutes..."
                  maxLength={160}
                  rows={3}
                />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => update({ canonicalUrl: e.target.value })}
                  placeholder="https://couriers.foursix46.com/locations/cardiff"
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
                    alt="og preview"
                    className="mt-2 h-20 rounded border object-cover"
                  />
                )}
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Checkbox
                  id="noindex-loc"
                  checked={form.noindex}
                  onCheckedChange={(v) => update({ noindex: !!v })}
                />
                <div>
                  <Label
                    htmlFor="noindex-loc"
                    className="cursor-pointer font-medium"
                  >
                    No Index
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hides page from Google.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* RELATIONS & FAQs */}
          {activeTab === "relations" && (
            <div className="space-y-4">
              <SectionHeader title="Relations" />
              <TagInput
                label="Recommended Services * (service slugs)"
                values={form.recommendedServices}
                onChange={(v) => update({ recommendedServices: v })}
                placeholder="e.g. same-day-courier, next-day-courier"
              />
              <p className="text-xs text-amber-600 font-medium">
                ⚠️ At least one recommended service required before publishing.
              </p>
              <SectionHeader title="FAQs" />
              <div>
                <Label>FAQ Heading</Label>
                <Input
                  value={form.faqHeading}
                  onChange={(e) => update({ faqHeading: e.target.value })}
                  placeholder="Local FAQs"
                />
              </div>
              <TagInput
                label="FAQ IDs (Firestore document IDs)"
                values={form.faqIds}
                onChange={(v) => update({ faqIds: v })}
                placeholder="Paste FAQ doc ID and press Enter"
              />
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

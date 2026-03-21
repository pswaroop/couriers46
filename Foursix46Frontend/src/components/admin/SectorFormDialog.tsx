// import { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { X, Plus, GripVertical, Trash2 } from "lucide-react";

// // --- Block Types ---
// type BlockType =
//   | "textSection"
//   | "bulletSection"
//   | "imageLeftTextRight"
//   | "imageRightTextLeft"
//   | "calloutCard"
//   | "ctaBanner";

// interface ContentBlock {
//   id: string;
//   type: BlockType;
//   heading?: string;
//   richText?: string;
//   bullets?: string[];
//   imageUrl?: string;
//   title?: string;
//   shortText?: string;
//   buttonText?: string;
//   buttonLink?: string;
// }

// const blockLabels: Record<BlockType, string> = {
//   textSection: "Text Section",
//   bulletSection: "Bullet Section",
//   imageLeftTextRight: "Image Left + Text Right",
//   imageRightTextLeft: "Image Right + Text Left",
//   calloutCard: "Callout Card",
//   ctaBanner: "CTA Banner",
// };

// // --- Sector Form Data ---
// interface SectorFormData {
//   name: string;
//   slug: string;
//   status: "draft" | "published";
//   sortOrder: number;
//   heroTitle: string;
//   heroSubtitle: string;
//   heroImage: string;
//   intro: string;
//   contentBlocks: ContentBlock[];
//   recommendedServices: string[];
//   featuredLocations: string[];
//   seoTitle: string;
//   seoDescription: string;
//   canonicalUrl: string;
//   ogImage: string;
//   noindex: boolean;
//   faqIds: string[];
//   faqHeading: string;
// }

// const defaultForm: SectorFormData = {
//   name: "",
//   slug: "",
//   status: "draft",
//   sortOrder: 0,
//   heroTitle: "",
//   heroSubtitle: "",
//   heroImage: "",
//   intro: "",
//   contentBlocks: [],
//   recommendedServices: [],
//   featuredLocations: [],
//   seoTitle: "",
//   seoDescription: "",
//   canonicalUrl: "",
//   ogImage: "",
//   noindex: false,
//   faqIds: [],
//   faqHeading: "Sector FAQs",
// };

// // --- Helpers ---

// /** Safely convert any value to a string slug */
// const toSlugStr = (v: any): string =>
//   typeof v === "string" ? v : (v?.slug ?? v?.id ?? String(v ?? ""));

// /** Safely convert any value to a string id */
// const toIdStr = (v: any): string =>
//   typeof v === "string" ? v : (v?.id ?? v?.slug ?? String(v ?? ""));

// // --- Sub-components ---

// const SectionHeader = ({ title }: { title: string }) => (
//   <div className="col-span-2 mt-2">
//     <h3 className="text-sm font-bold uppercase tracking-widest text-[#134467] border-b-2 border-[#F1C40F] pb-1">
//       {title}
//     </h3>
//   </div>
// );

// const TagInput = ({
//   label,
//   values,
//   onChange,
//   placeholder,
// }: {
//   label: string;
//   values: string[];
//   onChange: (v: string[]) => void;
//   placeholder?: string;
// }) => {
//   const [input, setInput] = useState("");

//   const add = () => {
//     const t = input.trim();
//     if (t && !values.includes(t)) onChange([...values, t]);
//     setInput("");
//   };

//   return (
//     <div>
//       <Label className="mb-1 block">{label}</Label>
//       <div className="flex gap-2 mb-2">
//         <Input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
//           placeholder={placeholder}
//           className="flex-1"
//         />
//         <Button type="button" size="sm" variant="outline" onClick={add}>
//           <Plus className="w-4 h-4" />
//         </Button>
//       </div>
//       <div className="flex flex-wrap gap-2">
//         {/* ✅ v is guaranteed to be a string — safe to render */}
//         {values.map((v) => (
//           <Badge
//             key={v}
//             variant="secondary"
//             className="flex items-center gap-1 pr-1"
//           >
//             {v}
//             <button
//               type="button"
//               onClick={() => onChange(values.filter((x) => x !== v))}
//               className="ml-1 hover:text-red-500"
//             >
//               <X className="w-3 h-3" />
//             </button>
//           </Badge>
//         ))}
//       </div>
//     </div>
//   );
// };

// const BlockEditor = ({
//   block,
//   onChange,
//   onRemove,
// }: {
//   block: ContentBlock;
//   onChange: (b: ContentBlock) => void;
//   onRemove: () => void;
// }) => {
//   const u = (f: Partial<ContentBlock>) => onChange({ ...block, ...f });

//   return (
//     <div className="border rounded-xl p-4 space-y-3 bg-muted/30">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <GripVertical className="w-4 h-4 text-muted-foreground" />
//           <Badge variant="outline">{blockLabels[block.type]}</Badge>
//         </div>
//         <Button type="button" size="sm" variant="ghost" onClick={onRemove}>
//           <Trash2 className="w-4 h-4 text-red-500" />
//         </Button>
//       </div>

//       {[
//         "textSection",
//         "bulletSection",
//         "imageLeftTextRight",
//         "imageRightTextLeft",
//       ].includes(block.type) && (
//         <div>
//           <Label className="text-xs">Heading</Label>
//           <Input
//             value={block.heading ?? ""}
//             onChange={(e) => u({ heading: e.target.value })}
//           />
//         </div>
//       )}

//       {["textSection", "imageLeftTextRight", "imageRightTextLeft"].includes(
//         block.type,
//       ) && (
//         <div>
//           <Label className="text-xs">Content (HTML)</Label>
//           <Textarea
//             value={block.richText ?? ""}
//             onChange={(e) => u({ richText: e.target.value })}
//             rows={3}
//           />
//         </div>
//       )}

//       {block.type === "bulletSection" && (
//         <TagInput
//           label="Bullets"
//           values={block.bullets ?? []}
//           onChange={(v) => u({ bullets: v })}
//           placeholder="Add bullet point"
//         />
//       )}

//       {["imageLeftTextRight", "imageRightTextLeft"].includes(block.type) && (
//         <div>
//           <Label className="text-xs">Image URL</Label>
//           <Input
//             value={block.imageUrl ?? ""}
//             onChange={(e) => u({ imageUrl: e.target.value })}
//             placeholder="https://..."
//           />
//           {block.imageUrl && (
//             <img
//               src={block.imageUrl}
//               alt="block preview"
//               className="mt-2 h-20 rounded border object-cover"
//               onError={(e) => (e.currentTarget.style.display = "none")}
//             />
//           )}
//         </div>
//       )}

//       {block.type === "calloutCard" && (
//         <>
//           <div>
//             <Label className="text-xs">Title</Label>
//             <Input
//               value={block.title ?? ""}
//               onChange={(e) => u({ title: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label className="text-xs">Short Text</Label>
//             <Textarea
//               value={block.shortText ?? ""}
//               onChange={(e) => u({ shortText: e.target.value })}
//               rows={2}
//             />
//           </div>
//         </>
//       )}

//       {block.type === "ctaBanner" && (
//         <>
//           <div>
//             <Label className="text-xs">Title</Label>
//             <Input
//               value={block.title ?? ""}
//               onChange={(e) => u({ title: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label className="text-xs">Text (HTML)</Label>
//             <Textarea
//               value={block.richText ?? ""}
//               onChange={(e) => u({ richText: e.target.value })}
//               rows={2}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label className="text-xs">Button Text</Label>
//               <Input
//                 value={block.buttonText ?? ""}
//                 onChange={(e) => u({ buttonText: e.target.value })}
//                 placeholder="Get a Quote"
//               />
//             </div>
//             <div>
//               <Label className="text-xs">Button Link</Label>
//               <Input
//                 value={block.buttonLink ?? ""}
//                 onChange={(e) => u({ buttonLink: e.target.value })}
//                 placeholder="/quick-quote"
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // --- Main Dialog ---
// interface Props {
//   open: boolean;
//   editingItem: any | null;
//   allServices?: any[];
//   allFaqs?: any[];
//   onClose: () => void;
//   onSave: (data: SectorFormData) => Promise<void>;
// }

// export function SectorFormDialog({
//   open,
//   editingItem,
//   onClose,
//   onSave,
// }: Props) {
//   const [form, setForm] = useState<SectorFormData>(defaultForm);
//   const [isSaving, setIsSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     "core" | "body" | "seo" | "relations"
//   >("core");
//   const [newBlockType, setNewBlockType] = useState<BlockType>("textSection");

//   // ✅ FIXED useEffect — normalises all array fields to plain strings
//   useEffect(() => {
//     if (!open) return;
//     setActiveTab("core");

//     if (editingItem) {
//       setForm({
//         ...defaultForm,
//         ...editingItem,
//         // Normalise: DB may return objects instead of strings
//         recommendedServices: (editingItem.recommendedServices ?? []).map(
//           toSlugStr,
//         ),
//         featuredLocations: (editingItem.featuredLocations ?? []).map(toSlugStr),
//         faqIds: (editingItem.faqIds ?? []).map(toIdStr),
//         // Normalise bullets inside each content block too
//         contentBlocks: (editingItem.contentBlocks ?? []).map((b: any) => ({
//           ...b,
//           bullets: (b.bullets ?? []).map((x: any) =>
//             typeof x === "string" ? x : String(x ?? ""),
//           ),
//         })),
//       });
//     } else {
//       setForm(defaultForm);
//     }
//   }, [editingItem, open]);

//   const update = (f: Partial<SectorFormData>) =>
//     setForm((p) => ({ ...p, ...f }));

//   const addBlock = () => {
//     update({
//       contentBlocks: [
//         ...form.contentBlocks,
//         { id: `block_${Date.now()}`, type: newBlockType },
//       ],
//     });
//   };

//   const handleSave = async (status: "draft" | "published") => {
//     if (!form.name || !form.slug || !form.seoTitle || !form.seoDescription) {
//       alert("Name, Slug, SEO Title and SEO Description are required.");
//       return;
//     }
//     if (status === "published" && !form.recommendedServices.length) {
//       alert("At least one Recommended Service is required before publishing.");
//       return;
//     }
//     setIsSaving(true);
//     try {
//       await onSave({ ...form, status });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const tabs = [
//     { key: "core", label: "Core & Hero" },
//     { key: "body", label: "Body Content" },
//     { key: "seo", label: "SEO" },
//     { key: "relations", label: "Relations & FAQs" },
//   ] as const;

//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         {/* Header */}
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             {editingItem ? "Edit Sector" : "Create Sector"}
//             <Badge
//               className="ml-1"
//               variant={form.status === "published" ? "default" : "secondary"}
//             >
//               {form.status}
//             </Badge>
//           </DialogTitle>
//         </DialogHeader>

//         {/* Tab bar */}
//         <div className="flex gap-1 border-b pb-2 flex-wrap">
//           {tabs.map((tab) => (
//             <button
//               key={tab.key}
//               type="button"
//               onClick={() => setActiveTab(tab.key)}
//               className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
//                 activeTab === tab.key
//                   ? "bg-[#134467] text-white"
//                   : "text-muted-foreground hover:bg-muted"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* Scrollable content */}
//         <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-2">
//           {/* ── CORE & HERO ── */}
//           {activeTab === "core" && (
//             <div className="grid grid-cols-2 gap-4">
//               <SectionHeader title="Core" />

//               <div>
//                 <Label>Name *</Label>
//                 <Input
//                   value={form.name}
//                   onChange={(e) => update({ name: e.target.value })}
//                   placeholder="Dental Courier"
//                 />
//               </div>

//               <div>
//                 <Label>Slug *</Label>
//                 <Input
//                   value={form.slug}
//                   onChange={(e) =>
//                     update({
//                       slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
//                     })
//                   }
//                   placeholder="dental"
//                   className="font-mono text-sm"
//                 />
//               </div>

//               <div>
//                 <Label>Status</Label>
//                 <Select
//                   value={form.status}
//                   onValueChange={(v) =>
//                     update({ status: v as "draft" | "published" })
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="draft">Draft</SelectItem>
//                     <SelectItem value="published">Published</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div>
//                 <Label>Sort Order</Label>
//                 <Input
//                   type="number"
//                   value={form.sortOrder}
//                   onChange={(e) =>
//                     update({ sortOrder: Number(e.target.value) })
//                   }
//                 />
//               </div>

//               <SectionHeader title="Hero Section" />

//               <div className="col-span-2">
//                 <Label>Hero Title *</Label>
//                 <Input
//                   value={form.heroTitle}
//                   onChange={(e) => update({ heroTitle: e.target.value })}
//                   placeholder="Dental Courier Services UK"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <Label>Hero Subtitle</Label>
//                 <Input
//                   value={form.heroSubtitle}
//                   onChange={(e) => update({ heroSubtitle: e.target.value })}
//                   placeholder="Specialist same-day deliveries for dental practices"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <Label>Hero Image URL</Label>
//                 <Input
//                   value={form.heroImage}
//                   onChange={(e) => update({ heroImage: e.target.value })}
//                   placeholder="https://..."
//                 />
//                 {form.heroImage && (
//                   <img
//                     src={form.heroImage}
//                     alt="preview"
//                     className="mt-2 h-24 rounded border object-cover w-full"
//                     onError={(e) => (e.currentTarget.style.display = "none")}
//                   />
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ── BODY CONTENT ── */}
//           {activeTab === "body" && (
//             <div className="space-y-4">
//               <div>
//                 <Label>Intro (HTML / Rich Text)</Label>
//                 <Textarea
//                   value={form.intro}
//                   onChange={(e) => update({ intro: e.target.value })}
//                   rows={5}
//                   placeholder="<p>We specialise in dental courier services...</p>"
//                   className="font-mono text-sm"
//                 />
//               </div>

//               <SectionHeader title="Content Blocks" />

//               {form.contentBlocks.length === 0 && (
//                 <p className="text-sm text-muted-foreground italic">
//                   No blocks yet. Add one below.
//                 </p>
//               )}

//               {form.contentBlocks.map((block) => (
//                 <BlockEditor
//                   key={block.id}
//                   block={block}
//                   onChange={(b) =>
//                     update({
//                       contentBlocks: form.contentBlocks.map((x) =>
//                         x.id === block.id ? b : x,
//                       ),
//                     })
//                   }
//                   onRemove={() =>
//                     update({
//                       contentBlocks: form.contentBlocks.filter(
//                         (x) => x.id !== block.id,
//                       ),
//                     })
//                   }
//                 />
//               ))}

//               <div className="flex items-center gap-2 pt-2 border-t">
//                 <Select
//                   value={newBlockType}
//                   onValueChange={(v) => setNewBlockType(v as BlockType)}
//                 >
//                   <SelectTrigger className="flex-1">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {Object.entries(blockLabels).map(([k, v]) => (
//                       <SelectItem key={k} value={k}>
//                         {v}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Button type="button" variant="outline" onClick={addBlock}>
//                   <Plus className="w-4 h-4 mr-1" />
//                   Add Block
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* ── SEO ── */}
//           {activeTab === "seo" && (
//             <div className="space-y-4">
//               <div>
//                 <Label>
//                   SEO Title *{" "}
//                   <span className="text-xs text-muted-foreground">
//                     ({form.seoTitle.length}/60)
//                   </span>
//                 </Label>
//                 <Input
//                   value={form.seoTitle}
//                   onChange={(e) => update({ seoTitle: e.target.value })}
//                   placeholder="Dental Courier Services | FourSix46®"
//                   maxLength={60}
//                 />
//               </div>

//               <div>
//                 <Label>
//                   SEO Description *{" "}
//                   <span className="text-xs text-muted-foreground">
//                     ({form.seoDescription.length}/160)
//                   </span>
//                 </Label>
//                 <Textarea
//                   value={form.seoDescription}
//                   onChange={(e) => update({ seoDescription: e.target.value })}
//                   placeholder="Same-day dental courier services across the UK..."
//                   maxLength={160}
//                   rows={3}
//                 />
//               </div>

//               <div>
//                 <Label>Canonical URL</Label>
//                 <Input
//                   value={form.canonicalUrl}
//                   onChange={(e) => update({ canonicalUrl: e.target.value })}
//                   placeholder={`https://couriers.foursix46.com/sectors/${form.slug || "slug"}`}
//                 />
//               </div>

//               <div>
//                 <Label>OG Image URL</Label>
//                 <Input
//                   value={form.ogImage}
//                   onChange={(e) => update({ ogImage: e.target.value })}
//                   placeholder="https://..."
//                 />
//                 {form.ogImage && (
//                   <img
//                     src={form.ogImage}
//                     alt="og preview"
//                     className="mt-2 h-20 rounded border object-cover"
//                     onError={(e) => (e.currentTarget.style.display = "none")}
//                   />
//                 )}
//               </div>

//               <div className="flex items-center gap-3 p-3 border rounded-xl">
//                 <Checkbox
//                   id="noindex-sector"
//                   checked={form.noindex}
//                   onCheckedChange={(v) => update({ noindex: !!v })}
//                 />
//                 <div>
//                   <Label
//                     htmlFor="noindex-sector"
//                     className="cursor-pointer font-medium"
//                   >
//                     No Index
//                   </Label>
//                   <p className="text-xs text-muted-foreground">
//                     Hides page from Google. Use for drafts only.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ── RELATIONS & FAQs ── */}
//           {activeTab === "relations" && (
//             <div className="space-y-4">
//               <SectionHeader title="Relations" />

//               <TagInput
//                 label="Recommended Services * (enter service slugs)"
//                 values={form.recommendedServices}
//                 onChange={(v) => update({ recommendedServices: v })}
//                 placeholder="e.g. same-day-courier"
//               />
//               <p className="text-xs text-amber-600 font-medium">
//                 ⚠️ At least one recommended service is required before
//                 publishing.
//               </p>

//               <TagInput
//                 label="Featured Locations (enter location slugs)"
//                 values={form.featuredLocations}
//                 onChange={(v) => update({ featuredLocations: v })}
//                 placeholder="e.g. cardiff, london, bristol"
//               />

//               <SectionHeader title="FAQs" />

//               <div>
//                 <Label>FAQ Section Heading</Label>
//                 <Input
//                   value={form.faqHeading}
//                   onChange={(e) => update({ faqHeading: e.target.value })}
//                   placeholder="Sector FAQs"
//                 />
//               </div>

//               <TagInput
//                 label="FAQ IDs (Firestore document IDs)"
//                 values={form.faqIds}
//                 onChange={(v) => update({ faqIds: v })}
//                 placeholder="Paste FAQ doc ID and press Enter"
//               />
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <DialogFooter className="border-t pt-4 gap-2">
//           <Button variant="outline" onClick={onClose} disabled={isSaving}>
//             Cancel
//           </Button>
//           <Button
//             variant="outline"
//             disabled={isSaving}
//             onClick={() => handleSave("draft")}
//           >
//             Save as Draft
//           </Button>
//           <Button
//             className="bg-[#134467] hover:bg-[#0e3352] text-white"
//             disabled={isSaving}
//             onClick={() => handleSave("published")}
//           >
//             {isSaving
//               ? "Saving..."
//               : editingItem
//                 ? "Update & Publish"
//                 : "Create & Publish"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
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
// ✅ Fix #2 — added toast import
import { toast } from "sonner";
import { X, Plus, GripVertical, Trash2, Loader2 } from "lucide-react";

// --- Block Types ---
type BlockType =
  | "textSection"
  | "bulletSection"
  | "imageLeftTextRight"
  | "imageRightTextLeft"
  | "calloutCard"
  | "ctaBanner";

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

const blockLabels: Record<BlockType, string> = {
  textSection: "Text Section",
  bulletSection: "Bullet Section",
  imageLeftTextRight: "Image Left + Text Right",
  imageRightTextLeft: "Image Right + Text Left",
  calloutCard: "Callout Card",
  ctaBanner: "CTA Banner",
};

// --- Sector Form Data ---
interface SectorFormData {
  name: string;
  slug: string;
  status: "draft" | "published";
  sortOrder: number;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  intro: string;
  contentBlocks: ContentBlock[];
  recommendedServices: string[];
  featuredLocations: string[];
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  noindex: boolean;
  faqIds: string[];
  faqHeading: string;
}

const defaultForm: SectorFormData = {
  name: "",
  slug: "",
  status: "draft",
  sortOrder: 0,
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  intro: "",
  contentBlocks: [],
  recommendedServices: [],
  featuredLocations: [],
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogImage: "",
  noindex: false,
  faqIds: [],
  faqHeading: "Sector FAQs",
};

// --- Helpers ---
const toSlugStr = (v: any): string =>
  typeof v === "string" ? v : (v?.slug ?? v?.id ?? String(v ?? ""));

const toIdStr = (v: any): string =>
  typeof v === "string" ? v : (v?.id ?? v?.slug ?? String(v ?? ""));

// ✅ Fix #6 — auto-slug helper (matches BlogFormDialog pattern)
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

// --- Sub-components ---
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
          placeholder="Add bullet point"
        />
      )}

      {["imageLeftTextRight", "imageRightTextLeft"].includes(block.type) && (
        <div>
          <Label className="text-xs">Image URL</Label>
          <Input
            value={block.imageUrl ?? ""}
            onChange={(e) => u({ imageUrl: e.target.value })}
            placeholder="https://..."
          />
          {block.imageUrl && (
            <img
              src={block.imageUrl}
              alt="block preview"
              className="mt-2 h-20 rounded border object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
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
            <Label className="text-xs">Text (HTML)</Label>
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
                placeholder="Get a Quote"
              />
            </div>
            <div>
              <Label className="text-xs">Button Link</Label>
              <Input
                value={block.buttonLink ?? ""}
                onChange={(e) => u({ buttonLink: e.target.value })}
                placeholder="/quick-quote"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Dialog ---
interface Props {
  open: boolean;
  editingItem: any | null;
  // ✅ Fix #3 — allFaqs kept (passed from AdminDashboard); allServices removed (Fix #4 — was never passed or used)
  allFaqs?: any[];
  onClose: () => void;
  onSave: (data: SectorFormData) => Promise<void>;
}

export function SectorFormDialog({
  open,
  editingItem,
  // ✅ Fix #3 — destructured so it's available for future FAQ picker use
  allFaqs = [],
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<SectorFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "core" | "body" | "seo" | "relations"
  >("core");
  const [newBlockType, setNewBlockType] = useState<BlockType>("textSection");
  // ✅ Fix #6 — track whether slug was manually edited
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (!open) return;
    setActiveTab("core");

    if (editingItem) {
      setSlugManual(true); // editing — preserve existing slug
      setForm({
        ...defaultForm,
        ...editingItem,
        recommendedServices: (editingItem.recommendedServices ?? []).map(
          toSlugStr,
        ),
        featuredLocations: (editingItem.featuredLocations ?? []).map(toSlugStr),
        faqIds: (editingItem.faqIds ?? []).map(toIdStr),
        contentBlocks: (editingItem.contentBlocks ?? []).map((b: any) => ({
          ...b,
          bullets: (b.bullets ?? []).map((x: any) =>
            typeof x === "string" ? x : String(x ?? ""),
          ),
        })),
      });
    } else {
      setSlugManual(false);
      setForm(defaultForm);
    }
  }, [editingItem, open]);

  const update = (f: Partial<SectorFormData>) =>
    setForm((p) => ({ ...p, ...f }));

  // ✅ Fix #6 — auto-slug from name on new sectors
  const handleNameChange = (name: string) => {
    update({ name, ...(!slugManual && { slug: slugify(name) }) });
  };

  const addBlock = () => {
    update({
      contentBlocks: [
        ...form.contentBlocks,
        { id: `block_${Date.now()}`, type: newBlockType },
      ],
    });
  };

  // ✅ Fix #1 — replaced all alert() with toast.error()
  const handleSave = async (status: "draft" | "published") => {
    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!form.slug.trim()) {
      toast.error("Slug is required.");
      return;
    }
    if (!form.seoTitle.trim()) {
      toast.error("SEO Title is required.");
      return;
    }
    if (!form.seoDescription.trim()) {
      toast.error("SEO Description is required.");
      return;
    }
    if (status === "published" && !form.recommendedServices.length) {
      toast.error(
        "At least one Recommended Service is required before publishing.",
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
    { key: "body", label: "Body Content" },
    { key: "seo", label: "SEO" },
    { key: "relations", label: "Relations & FAQs" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingItem ? "Edit Sector" : "Create Sector"}
            <Badge
              className="ml-1"
              variant={form.status === "published" ? "default" : "secondary"}
            >
              {form.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Tab bar */}
        <div className="flex gap-1 border-b pb-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#134467] text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-2">
          {/* ── CORE & HERO ── */}
          {activeTab === "core" && (
            <div className="grid grid-cols-2 gap-4">
              <SectionHeader title="Core" />

              <div>
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  // ✅ Fix #6 — uses handleNameChange for auto-slug
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Dental Courier"
                />
              </div>

              <div>
                <Label>Slug *</Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugManual(true);
                    update({
                      slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                    });
                  }}
                  placeholder="dental"
                  className="font-mono text-sm"
                />
                {/* ✅ Fix #6 — hint mirrors BlogFormDialog */}
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from name. Edit to override.
                </p>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) =>
                    update({ status: v as "draft" | "published" })
                  }
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
                  placeholder="Dental Courier Services UK"
                />
              </div>

              <div className="col-span-2">
                <Label>Hero Subtitle</Label>
                <Input
                  value={form.heroSubtitle}
                  onChange={(e) => update({ heroSubtitle: e.target.value })}
                  placeholder="Specialist same-day deliveries for dental practices"
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
                    className="mt-2 h-24 rounded border object-cover w-full"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            </div>
          )}

          {/* ── BODY CONTENT ── */}
          {activeTab === "body" && (
            <div className="space-y-4">
              <div>
                <Label>Intro (HTML / Rich Text)</Label>
                <Textarea
                  value={form.intro}
                  onChange={(e) => update({ intro: e.target.value })}
                  rows={5}
                  placeholder="<p>We specialise in dental courier services...</p>"
                  className="font-mono text-sm"
                />
              </div>

              <SectionHeader title="Content Blocks" />

              {form.contentBlocks.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No blocks yet. Add one below.
                </p>
              )}

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
                <Button type="button" variant="outline" onClick={addBlock}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Block
                </Button>
              </div>
            </div>
          )}

          {/* ── SEO ── */}
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
                  placeholder="Dental Courier Services | FourSix46®"
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
                  placeholder="Same-day dental courier services across the UK..."
                  maxLength={160}
                  rows={3}
                />
              </div>

              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => update({ canonicalUrl: e.target.value })}
                  placeholder={`https://couriers.foursix46.com/sectors/${form.slug || "slug"}`}
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
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Checkbox
                  id="noindex-sector"
                  checked={form.noindex}
                  onCheckedChange={(v) => update({ noindex: !!v })}
                />
                <div>
                  <Label
                    htmlFor="noindex-sector"
                    className="cursor-pointer font-medium"
                  >
                    No Index
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hides page from Google. Use for drafts only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── RELATIONS & FAQs ── */}
          {activeTab === "relations" && (
            <div className="space-y-4">
              <SectionHeader title="Relations" />

              <TagInput
                label="Recommended Services * (enter service slugs)"
                values={form.recommendedServices}
                onChange={(v) => update({ recommendedServices: v })}
                placeholder="e.g. same-day-courier"
              />
              <p className="text-xs text-amber-600 font-medium">
                ⚠️ At least one recommended service is required before
                publishing.
              </p>

              <TagInput
                label="Featured Locations (enter location slugs)"
                values={form.featuredLocations}
                onChange={(v) => update({ featuredLocations: v })}
                placeholder="e.g. cardiff, london, bristol"
              />

              <SectionHeader title="FAQs" />

              <div>
                <Label>FAQ Section Heading</Label>
                <Input
                  value={form.faqHeading}
                  onChange={(e) => update({ faqHeading: e.target.value })}
                  placeholder="Sector FAQs"
                />
              </div>

              <TagInput
                label="FAQ IDs (Firestore document IDs)"
                values={form.faqIds}
                onChange={(v) => update({ faqIds: v })}
                placeholder="Paste FAQ doc ID and press Enter"
              />

              {/* ✅ Fix #3 — allFaqs hint: show available FAQ IDs if provided */}
              {allFaqs.length > 0 && (
                <div className="rounded-xl border border-dashed border-slate-200 p-3 bg-slate-50">
                  <p className="text-xs font-bold text-[#134467] uppercase tracking-wide mb-2">
                    Available FAQs — click to copy ID
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    {allFaqs.map((faq: any) => (
                      <button
                        key={faq.id}
                        type="button"
                        title={faq.question}
                        onClick={() => {
                          if (!form.faqIds.includes(faq.id)) {
                            update({ faqIds: [...form.faqIds, faq.id] });
                          }
                        }}
                        className="text-xs font-mono bg-white border border-slate-200 px-2 py-1
                          rounded-md hover:border-[#134467] hover:bg-[#134467]/5 transition
                          max-w-[200px] truncate text-left"
                      >
                        <span className="text-[#48AEDD]">{faq.id}</span>
                        <span className="text-slate-400 ml-1 not-truncate">
                          — {faq.question?.slice(0, 30)}…
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
          >
            {/* ✅ Fix #5 — Loader2 spinner on saving state */}
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : null}
            Save as Draft
          </Button>
          <Button
            className="bg-[#134467] hover:bg-[#0e3352] text-white"
            disabled={isSaving}
            onClick={() => handleSave("published")}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : null}
            {isSaving
              ? "Saving…"
              : editingItem
                ? "Update & Publish"
                : "Create & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { X, Plus, GripVertical, Trash2 } from "lucide-react";

// // --- Types ---
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

// interface ServiceFormData {
//   // Core
//   name: string;
//   slug: string;
//   status: "draft" | "published";
//   sortOrder: number;
//   // Hero
//   heroTitle: string;
//   heroSubtitle: string;
//   heroImage: string;
//   // Body
//   intro: string;
//   contentBlocks: ContentBlock[];
//   // Operational
//   collectionTimePromise: string;
//   serviceCoverage: "local" | "regional" | "nationwide" | "UK-mainland" | "";
//   vehicleTypes: string[];
//   whatWeCarry: string[];
//   // CTA
//   ctaPrimaryText: string;
//   ctaPrimaryLink: string;
//   // SEO
//   seoTitle: string;
//   seoDescription: string;
//   canonicalUrl: string;
//   ogImage: string;
//   noindex: boolean;
//   // Relations (slugs as comma-separated for simplicity)
//   relatedSectors: string[];
//   featuredLocations: string[];
//   // FAQs
//   faqIds: string[];
//   faqHeading: string;
// }

// const defaultFormData: ServiceFormData = {
//   name: "",
//   slug: "",
//   status: "draft",
//   sortOrder: 0,
//   heroTitle: "",
//   heroSubtitle: "",
//   heroImage: "",
//   intro: "",
//   contentBlocks: [],
//   collectionTimePromise: "",
//   serviceCoverage: "",
//   vehicleTypes: [],
//   whatWeCarry: [],
//   ctaPrimaryText: "Get a Quote",
//   ctaPrimaryLink: "/quick-quote",
//   seoTitle: "",
//   seoDescription: "",
//   canonicalUrl: "",
//   ogImage: "",
//   noindex: false,
//   relatedSectors: [],
//   featuredLocations: [],
//   faqIds: [],
//   faqHeading: "Frequently Asked Questions",
// };

// // --- Tag Input Component ---
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
//     const trimmed = input.trim();
//     if (trimmed && !values.includes(trimmed)) {
//       onChange([...values, trimmed]);
//     }
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
//           placeholder={placeholder ?? `Type and press Enter`}
//           className="flex-1"
//         />
//         <Button type="button" size="sm" variant="outline" onClick={add}>
//           <Plus className="w-4 h-4" />
//         </Button>
//       </div>
//       <div className="flex flex-wrap gap-2">
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

// // --- Content Block Editor ---
// const blockLabels: Record<BlockType, string> = {
//   textSection: "Text Section",
//   bulletSection: "Bullet Section",
//   imageLeftTextRight: "Image Left + Text Right",
//   imageRightTextLeft: "Image Right + Text Left",
//   calloutCard: "Callout Card",
//   ctaBanner: "CTA Banner",
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
//   const update = (fields: Partial<ContentBlock>) =>
//     onChange({ ...block, ...fields });

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

//       {/* Common: heading */}
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
//             onChange={(e) => update({ heading: e.target.value })}
//             placeholder="Section heading"
//           />
//         </div>
//       )}

//       {/* Rich text */}
//       {["textSection", "imageLeftTextRight", "imageRightTextLeft"].includes(
//         block.type,
//       ) && (
//         <div>
//           <Label className="text-xs">Content (rich text / HTML)</Label>
//           <Textarea
//             value={block.richText ?? ""}
//             onChange={(e) => update({ richText: e.target.value })}
//             rows={4}
//             placeholder="<p>Content here...</p>"
//           />
//         </div>
//       )}

//       {/* Bullets */}
//       {block.type === "bulletSection" && (
//         <TagInput
//           label="Bullets (press Enter to add)"
//           values={block.bullets ?? []}
//           onChange={(v) => update({ bullets: v })}
//           placeholder="Add bullet point"
//         />
//       )}

//       {/* Image URL for image blocks */}
//       {["imageLeftTextRight", "imageRightTextLeft"].includes(block.type) && (
//         <div>
//           <Label className="text-xs">Image URL</Label>
//           <Input
//             value={block.imageUrl ?? ""}
//             onChange={(e) => update({ imageUrl: e.target.value })}
//             placeholder="https://..."
//           />
//         </div>
//       )}

//       {/* Callout card */}
//       {block.type === "calloutCard" && (
//         <>
//           <div>
//             <Label className="text-xs">Title</Label>
//             <Input
//               value={block.title ?? ""}
//               onChange={(e) => update({ title: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label className="text-xs">Short Text</Label>
//             <Textarea
//               value={block.shortText ?? ""}
//               onChange={(e) => update({ shortText: e.target.value })}
//               rows={2}
//             />
//           </div>
//         </>
//       )}

//       {/* CTA Banner */}
//       {block.type === "ctaBanner" && (
//         <>
//           <div>
//             <Label className="text-xs">Title</Label>
//             <Input
//               value={block.title ?? ""}
//               onChange={(e) => update({ title: e.target.value })}
//             />
//           </div>
//           <div>
//             <Label className="text-xs">Text</Label>
//             <Textarea
//               value={block.richText ?? ""}
//               onChange={(e) => update({ richText: e.target.value })}
//               rows={2}
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             <div>
//               <Label className="text-xs">Button Text</Label>
//               <Input
//                 value={block.buttonText ?? ""}
//                 onChange={(e) => update({ buttonText: e.target.value })}
//                 placeholder="Get a Quote"
//               />
//             </div>
//             <div>
//               <Label className="text-xs">Button Link</Label>
//               <Input
//                 value={block.buttonLink ?? ""}
//                 onChange={(e) => update({ buttonLink: e.target.value })}
//                 placeholder="/quick-quote"
//               />
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// // --- Section Header ---
// const SectionHeader = ({ title }: { title: string }) => (
//   <div className="col-span-2 mt-2">
//     <h3 className="text-sm font-bold uppercase tracking-widest text-[#134467] border-b-2 border-[#F1C40F] pb-1">
//       {title}
//     </h3>
//   </div>
// );

// // --- Main Dialog ---
// interface Props {
//   open: boolean;
//   editingItem: any | null;
//   onClose: () => void;
//   onSave: (data: ServiceFormData) => Promise<void>;
// }

// export function ServiceFormDialog({
//   open,
//   editingItem,
//   onClose,
//   onSave,
// }: Props) {
//   const [form, setForm] = useState<ServiceFormData>(defaultFormData);
//   const [isSaving, setIsSaving] = useState(false);
//   const [activeTab, setActiveTab] = useState<
//     "core" | "body" | "operational" | "seo" | "relations"
//   >("core");
//   const [newBlockType, setNewBlockType] = useState<BlockType>("textSection");

//   // Populate form when editing
//   useEffect(() => {
//     if (editingItem) {
//       setForm({ ...defaultFormData, ...editingItem });
//     } else {
//       setForm(defaultFormData);
//     }
//     setActiveTab("core");
//   }, [editingItem, open]);

//   const update = (fields: Partial<ServiceFormData>) =>
//     setForm((prev) => ({ ...prev, ...fields }));

//   const addBlock = () => {
//     const newBlock: ContentBlock = {
//       id: `block_${Date.now()}`,
//       type: newBlockType,
//     };
//     update({ contentBlocks: [...form.contentBlocks, newBlock] });
//   };

//   const updateBlock = (id: string, block: ContentBlock) => {
//     update({
//       contentBlocks: form.contentBlocks.map((b) => (b.id === id ? block : b)),
//     });
//   };

//   const removeBlock = (id: string) => {
//     update({ contentBlocks: form.contentBlocks.filter((b) => b.id !== id) });
//   };

//   const handleSave = async () => {
//     if (!form.name || !form.slug || !form.seoTitle || !form.seoDescription) {
//       alert(
//         "Name, Slug, SEO Title and SEO Description are required before saving.",
//       );
//       return;
//     }
//     setIsSaving(true);
//     try {
//       await onSave(form);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const tabs = [
//     { key: "core", label: "Core & Hero" },
//     { key: "body", label: "Body Content" },
//     { key: "operational", label: "Operational" },
//     { key: "seo", label: "SEO" },
//     { key: "relations", label: "Relations & FAQs" },
//   ] as const;

//   return (
//     <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
//       <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
//         <DialogHeader>
//           <DialogTitle>
//             {editingItem ? "Edit Service" : "Create Service"}
//             {form.status === "published" && (
//               <Badge className="ml-2 bg-green-100 text-green-800">
//                 Published
//               </Badge>
//             )}
//           </DialogTitle>
//         </DialogHeader>

//         {/* Tabs */}
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

//         {/* Scrollable form body */}
//         <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-2">
//           {/* ===== CORE & HERO ===== */}
//           {activeTab === "core" && (
//             <div className="grid grid-cols-2 gap-4">
//               <SectionHeader title="Core" />
//               <div>
//                 <Label>Name *</Label>
//                 <Input
//                   value={form.name}
//                   onChange={(e) => update({ name: e.target.value })}
//                   placeholder="Same Day Courier"
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
//                   placeholder="same-day-courier"
//                 />
//               </div>
//               <div>
//                 <Label>Status</Label>
//                 <Select
//                   value={form.status}
//                   onValueChange={(v) => update({ status: v as any })}
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
//                   placeholder="Fast, Reliable Same Day Courier"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Label>Hero Subtitle</Label>
//                 <Input
//                   value={form.heroSubtitle}
//                   onChange={(e) => update({ heroSubtitle: e.target.value })}
//                   placeholder="UK-wide collection within 60 minutes"
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
//                     alt="Hero preview"
//                     className="mt-2 h-24 rounded border object-cover"
//                   />
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ===== BODY CONTENT ===== */}
//           {activeTab === "body" && (
//             <div className="space-y-4">
//               <div>
//                 <Label>Intro (HTML / Rich Text)</Label>
//                 <Textarea
//                   value={form.intro}
//                   onChange={(e) => update({ intro: e.target.value })}
//                   rows={5}
//                   placeholder="<p>We provide same day courier services across the UK...</p>"
//                   className="font-mono text-sm"
//                 />
//               </div>

//               <SectionHeader title="Content Blocks" />
//               {form.contentBlocks.map((block) => (
//                 <BlockEditor
//                   key={block.id}
//                   block={block}
//                   onChange={(b) => updateBlock(block.id, b)}
//                   onRemove={() => removeBlock(block.id)}
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
//                     {Object.entries(blockLabels).map(([key, label]) => (
//                       <SelectItem key={key} value={key}>
//                         {label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//                 <Button type="button" onClick={addBlock} variant="outline">
//                   <Plus className="w-4 h-4 mr-1" /> Add Block
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* ===== OPERATIONAL ===== */}
//           {activeTab === "operational" && (
//             <div className="grid grid-cols-2 gap-4">
//               <SectionHeader title="Operational Details" />
//               <div className="col-span-2">
//                 <Label>Collection Time Promise</Label>
//                 <Input
//                   value={form.collectionTimePromise}
//                   onChange={(e) =>
//                     update({ collectionTimePromise: e.target.value })
//                   }
//                   placeholder="Collection within 60 minutes"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Label>Service Coverage</Label>
//                 <Select
//                   value={form.serviceCoverage}
//                   onValueChange={(v) => update({ serviceCoverage: v as any })}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select coverage" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="local">Local</SelectItem>
//                     <SelectItem value="regional">Regional</SelectItem>
//                     <SelectItem value="nationwide">Nationwide</SelectItem>
//                     <SelectItem value="UK-mainland">UK Mainland</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="col-span-2">
//                 <TagInput
//                   label="Vehicle Types"
//                   values={form.vehicleTypes}
//                   onChange={(v) => update({ vehicleTypes: v })}
//                   placeholder="e.g. Small Van, SWB, LWB"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <TagInput
//                   label="What We Carry"
//                   values={form.whatWeCarry}
//                   onChange={(v) => update({ whatWeCarry: v })}
//                   placeholder="e.g. Documents, Parcels, Pallets"
//                 />
//               </div>

//               <SectionHeader title="CTA" />
//               <div>
//                 <Label>CTA Button Text</Label>
//                 <Input
//                   value={form.ctaPrimaryText}
//                   onChange={(e) => update({ ctaPrimaryText: e.target.value })}
//                   placeholder="Get a Quote"
//                 />
//               </div>
//               <div>
//                 <Label>CTA Button Link</Label>
//                 <Input
//                   value={form.ctaPrimaryLink}
//                   onChange={(e) => update({ ctaPrimaryLink: e.target.value })}
//                   placeholder="/quick-quote"
//                 />
//               </div>
//             </div>
//           )}

//           {/* ===== SEO ===== */}
//           {activeTab === "seo" && (
//             <div className="space-y-4">
//               <div>
//                 <Label>
//                   SEO Title *{" "}
//                   <span className="text-xs text-muted-foreground">
//                     ({form.seoTitle.length}/60 chars)
//                   </span>
//                 </Label>
//                 <Input
//                   value={form.seoTitle}
//                   onChange={(e) => update({ seoTitle: e.target.value })}
//                   placeholder="Same Day Courier UK | FourSix46®"
//                   maxLength={60}
//                   className={form.seoTitle.length > 60 ? "border-red-500" : ""}
//                 />
//               </div>
//               <div>
//                 <Label>
//                   SEO Description *{" "}
//                   <span className="text-xs text-muted-foreground">
//                     ({form.seoDescription.length}/160 chars)
//                   </span>
//                 </Label>
//                 <Textarea
//                   value={form.seoDescription}
//                   onChange={(e) => update({ seoDescription: e.target.value })}
//                   placeholder="Fast, reliable same day courier services across the UK. Book online or get a quote..."
//                   maxLength={160}
//                   rows={3}
//                   className={
//                     form.seoDescription.length > 160 ? "border-red-500" : ""
//                   }
//                 />
//               </div>
//               <div>
//                 <Label>
//                   Canonical URL{" "}
//                   <span className="text-xs text-muted-foreground">
//                     (optional, leave blank to auto-set)
//                   </span>
//                 </Label>
//                 <Input
//                   value={form.canonicalUrl}
//                   onChange={(e) => update({ canonicalUrl: e.target.value })}
//                   placeholder="https://couriers.foursix46.com/services/same-day-courier"
//                 />
//               </div>
//               <div>
//                 <Label>
//                   OG Image URL{" "}
//                   <span className="text-xs text-muted-foreground">
//                     (optional)
//                   </span>
//                 </Label>
//                 <Input
//                   value={form.ogImage}
//                   onChange={(e) => update({ ogImage: e.target.value })}
//                   placeholder="https://..."
//                 />
//                 {form.ogImage && (
//                   <img
//                     src={form.ogImage}
//                     alt="OG preview"
//                     className="mt-2 h-20 rounded border object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex items-center gap-3 p-3 border rounded-xl">
//                 <Checkbox
//                   id="noindex"
//                   checked={form.noindex}
//                   onCheckedChange={(v) => update({ noindex: !!v })}
//                 />
//                 <div>
//                   <Label
//                     htmlFor="noindex"
//                     className="cursor-pointer font-medium"
//                   >
//                     No Index
//                   </Label>
//                   <p className="text-xs text-muted-foreground">
//                     Hides this page from Google. Use for draft/test pages only.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* ===== RELATIONS & FAQs ===== */}
//           {activeTab === "relations" && (
//             <div className="space-y-4">
//               <SectionHeader title="Relations" />
//               <TagInput
//                 label="Related Sectors (enter sector slugs)"
//                 values={form.relatedSectors}
//                 onChange={(v) => update({ relatedSectors: v })}
//                 placeholder="e.g. dental, medical, aerospace"
//               />
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
//                   placeholder="Frequently Asked Questions"
//                 />
//               </div>
//               <TagInput
//                 label="FAQ IDs (enter Firestore FAQ document IDs)"
//                 values={form.faqIds}
//                 onChange={(v) => update({ faqIds: v })}
//                 placeholder="Paste FAQ document ID and press Enter"
//               />
//               <p className="text-xs text-muted-foreground">
//                 💡 Tip: Go to FAQs section, copy the document ID from the table,
//                 and paste it here to link FAQs to this service.
//               </p>
//             </div>
//           )}
//         </div>

//         <DialogFooter className="border-t pt-4 gap-2">
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             onClick={() => {
//               update({ status: "draft" });
//               handleSave();
//             }}
//             variant="outline"
//             disabled={isSaving}
//           >
//             Save as Draft
//           </Button>
//           <Button
//             onClick={() => {
//               update({ status: "published" });
//               handleSave();
//             }}
//             className="bg-[#134467] hover:bg-[#0e3352]"
//             disabled={isSaving}
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
// ✅ Fix #4 — added toast + Loader2
import { toast } from "sonner";
import { X, Plus, GripVertical, Trash2, Loader2 } from "lucide-react";

// --- Types ---
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

// ✅ Fix #2 — collectionTimePromise + serviceCoverage removed from schema
interface ServiceFormData {
  // Core
  name: string;
  slug: string;
  status: "draft" | "published";
  sortOrder: number;
  // Hero
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  // Body
  intro: string;
  contentBlocks: ContentBlock[];
  // Delivery Info (operational fields retained)
  vehicleTypes: string[];
  whatWeCarry: string[];
  // CTA
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  // SEO
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  ogImage: string;
  noindex: boolean;
  // Relations
  relatedSectors: string[];
  featuredLocations: string[];
  // FAQs
  faqIds: string[];
  faqHeading: string;
}

// ✅ Fix #2 — defaultFormData cleaned of removed fields
const defaultFormData: ServiceFormData = {
  name: "",
  slug: "",
  status: "draft",
  sortOrder: 0,
  heroTitle: "",
  heroSubtitle: "",
  heroImage: "",
  intro: "",
  contentBlocks: [],
  vehicleTypes: [],
  whatWeCarry: [],
  ctaPrimaryText: "Get a Quote",
  ctaPrimaryLink: "/quick-quote",
  seoTitle: "",
  seoDescription: "",
  canonicalUrl: "",
  ogImage: "",
  noindex: false,
  relatedSectors: [],
  featuredLocations: [],
  faqIds: [],
  faqHeading: "Frequently Asked Questions",
};

// ✅ Fix #6 — auto-slug helper
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");

// --- Tag Input Component ---
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
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
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
          placeholder={placeholder ?? "Type and press Enter"}
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

// --- Content Block Editor ---
const blockLabels: Record<BlockType, string> = {
  textSection: "Text Section",
  bulletSection: "Bullet Section",
  imageLeftTextRight: "Image Left + Text Right",
  imageRightTextLeft: "Image Right + Text Left",
  calloutCard: "Callout Card",
  ctaBanner: "CTA Banner",
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
  const update = (fields: Partial<ContentBlock>) =>
    onChange({ ...block, ...fields });

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

      {/* Common: heading */}
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
            onChange={(e) => update({ heading: e.target.value })}
            placeholder="Section heading"
          />
        </div>
      )}

      {/* Rich text */}
      {["textSection", "imageLeftTextRight", "imageRightTextLeft"].includes(
        block.type,
      ) && (
        <div>
          <Label className="text-xs">Content (rich text / HTML)</Label>
          <Textarea
            value={block.richText ?? ""}
            onChange={(e) => update({ richText: e.target.value })}
            rows={4}
            placeholder="<p>Content here...</p>"
          />
        </div>
      )}

      {/* Bullets */}
      {block.type === "bulletSection" && (
        <TagInput
          label="Bullets (press Enter to add)"
          values={block.bullets ?? []}
          onChange={(v) => update({ bullets: v })}
          placeholder="Add bullet point"
        />
      )}

      {/* Image URL for image blocks */}
      {["imageLeftTextRight", "imageRightTextLeft"].includes(block.type) && (
        <div>
          <Label className="text-xs">Image URL</Label>
          <Input
            value={block.imageUrl ?? ""}
            onChange={(e) => update({ imageUrl: e.target.value })}
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

      {/* Callout card */}
      {block.type === "calloutCard" && (
        <>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={block.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Short Text</Label>
            <Textarea
              value={block.shortText ?? ""}
              onChange={(e) => update({ shortText: e.target.value })}
              rows={2}
            />
          </div>
        </>
      )}

      {/* CTA Banner */}
      {block.type === "ctaBanner" && (
        <>
          <div>
            <Label className="text-xs">Title</Label>
            <Input
              value={block.title ?? ""}
              onChange={(e) => update({ title: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs">Text</Label>
            <Textarea
              value={block.richText ?? ""}
              onChange={(e) => update({ richText: e.target.value })}
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Button Text</Label>
              <Input
                value={block.buttonText ?? ""}
                onChange={(e) => update({ buttonText: e.target.value })}
                placeholder="Get a Quote"
              />
            </div>
            <div>
              <Label className="text-xs">Button Link</Label>
              <Input
                value={block.buttonLink ?? ""}
                onChange={(e) => update({ buttonLink: e.target.value })}
                placeholder="/quick-quote"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- Section Header ---
const SectionHeader = ({ title }: { title: string }) => (
  <div className="col-span-2 mt-2">
    <h3 className="text-sm font-bold uppercase tracking-widest text-[#134467] border-b-2 border-[#F1C40F] pb-1">
      {title}
    </h3>
  </div>
);

// --- Main Dialog ---
interface Props {
  open: boolean;
  editingItem: any | null;
  onClose: () => void;
  onSave: (data: ServiceFormData) => Promise<void>;
}

export function ServiceFormDialog({
  open,
  editingItem,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<ServiceFormData>(defaultFormData);
  const [isSaving, setIsSaving] = useState(false);
  // ✅ Fix #2 — "operational" → "delivery" tab (collectionTimePromise + serviceCoverage removed)
  const [activeTab, setActiveTab] = useState<
    "core" | "body" | "delivery" | "seo" | "relations"
  >("core");
  const [newBlockType, setNewBlockType] = useState<BlockType>("textSection");
  // ✅ Fix #6 — track whether slug was manually edited
  const [slugManual, setSlugManual] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (!open) return;
    setActiveTab("core");
    if (editingItem) {
      setSlugManual(true); // preserve existing slug when editing
      setForm({
        ...defaultFormData,
        ...editingItem,
        // Ensure array fields are always arrays of strings
        vehicleTypes: (editingItem.vehicleTypes ?? []).map((v: any) =>
          typeof v === "string" ? v : String(v ?? ""),
        ),
        whatWeCarry: (editingItem.whatWeCarry ?? []).map((v: any) =>
          typeof v === "string" ? v : String(v ?? ""),
        ),
        relatedSectors: (editingItem.relatedSectors ?? []).map((v: any) =>
          typeof v === "string" ? v : (v?.slug ?? v?.id ?? String(v ?? "")),
        ),
        featuredLocations: (editingItem.featuredLocations ?? []).map(
          (v: any) =>
            typeof v === "string" ? v : (v?.slug ?? v?.id ?? String(v ?? "")),
        ),
        faqIds: (editingItem.faqIds ?? []).map((v: any) =>
          typeof v === "string" ? v : (v?.id ?? v?.slug ?? String(v ?? "")),
        ),
        contentBlocks: (editingItem.contentBlocks ?? []).map((b: any) => ({
          ...b,
          bullets: (b.bullets ?? []).map((x: any) =>
            typeof x === "string" ? x : String(x ?? ""),
          ),
        })),
      });
    } else {
      setSlugManual(false);
      setForm(defaultFormData);
    }
  }, [editingItem, open]);

  const update = (fields: Partial<ServiceFormData>) =>
    setForm((prev) => ({ ...prev, ...fields }));

  // ✅ Fix #6 — auto-slug from name on new services
  const handleNameChange = (name: string) => {
    update({ name, ...(!slugManual && { slug: slugify(name) }) });
  };

  const addBlock = () => {
    const newBlock: ContentBlock = {
      id: `block_${Date.now()}`,
      type: newBlockType,
    };
    update({ contentBlocks: [...form.contentBlocks, newBlock] });
  };

  const updateBlock = (id: string, block: ContentBlock) => {
    update({
      contentBlocks: form.contentBlocks.map((b) => (b.id === id ? block : b)),
    });
  };

  const removeBlock = (id: string) => {
    update({ contentBlocks: form.contentBlocks.filter((b) => b.id !== id) });
  };

  // ✅ Fix #1 + #3 — status passed as param (fixes race condition); alert → toast.error
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
    setIsSaving(true);
    try {
      // ✅ Fix #1 — status injected directly here, never relies on async state
      await onSave({ ...form, status });
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ Fix #2 — "operational" renamed to "delivery"
  const tabs = [
    { key: "core", label: "Core & Hero" },
    { key: "body", label: "Body Content" },
    { key: "delivery", label: "Delivery Info" },
    { key: "seo", label: "SEO" },
    { key: "relations", label: "Relations & FAQs" },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingItem ? "Edit Service" : "Create Service"}
            <Badge
              className="ml-1"
              variant={form.status === "published" ? "default" : "secondary"}
            >
              {form.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* Tabs */}
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

        {/* Scrollable form body */}
        <div className="overflow-y-auto flex-1 pr-2 space-y-4 py-2">
          {/* ===== CORE & HERO ===== */}
          {activeTab === "core" && (
            <div className="grid grid-cols-2 gap-4">
              <SectionHeader title="Core" />
              <div>
                <Label>Name *</Label>
                {/* ✅ Fix #6 — auto-slug via handleNameChange */}
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Same Day Courier"
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
                  placeholder="same-day-courier"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Auto-generated from name. Edit to override.
                </p>
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
                <Label>Hero Title</Label>
                <Input
                  value={form.heroTitle}
                  onChange={(e) => update({ heroTitle: e.target.value })}
                  placeholder="Fast, Reliable Same Day Courier"
                />
              </div>
              <div className="col-span-2">
                <Label>Hero Subtitle</Label>
                <Input
                  value={form.heroSubtitle}
                  onChange={(e) => update({ heroSubtitle: e.target.value })}
                  placeholder="UK-wide collection within 60 minutes"
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
                    alt="Hero preview"
                    className="mt-2 h-24 rounded border object-cover w-full"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
            </div>
          )}

          {/* ===== BODY CONTENT ===== */}
          {activeTab === "body" && (
            <div className="space-y-4">
              <div>
                <Label>Intro (HTML / Rich Text)</Label>
                <Textarea
                  value={form.intro}
                  onChange={(e) => update({ intro: e.target.value })}
                  rows={5}
                  placeholder="<p>We provide same day courier services across the UK...</p>"
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
                  onChange={(b) => updateBlock(block.id, b)}
                  onRemove={() => removeBlock(block.id)}
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
                    {Object.entries(blockLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addBlock} variant="outline">
                  <Plus className="w-4 h-4 mr-1" /> Add Block
                </Button>
              </div>
            </div>
          )}

          {/* ===== DELIVERY INFO ===== */}
          {/* ✅ Fix #2 — collectionTimePromise + serviceCoverage fields removed */}
          {activeTab === "delivery" && (
            <div className="grid grid-cols-2 gap-4">
              <SectionHeader title="Vehicle & Cargo" />
              <div className="col-span-2">
                <TagInput
                  label="Vehicle Types"
                  values={form.vehicleTypes}
                  onChange={(v) => update({ vehicleTypes: v })}
                  placeholder="e.g. Small Van, SWB, LWB"
                />
              </div>
              <div className="col-span-2">
                <TagInput
                  label="What We Carry"
                  values={form.whatWeCarry}
                  onChange={(v) => update({ whatWeCarry: v })}
                  placeholder="e.g. Documents, Parcels, Pallets"
                />
              </div>

              <SectionHeader title="CTA" />
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
          )}

          {/* ===== SEO ===== */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <div>
                <Label>
                  SEO Title *{" "}
                  <span className="text-xs text-muted-foreground">
                    ({form.seoTitle.length}/60 chars)
                  </span>
                </Label>
                <Input
                  value={form.seoTitle}
                  onChange={(e) => update({ seoTitle: e.target.value })}
                  placeholder="Same Day Courier UK | FourSix46®"
                  maxLength={60}
                  className={form.seoTitle.length > 60 ? "border-red-500" : ""}
                />
              </div>
              <div>
                <Label>
                  SEO Description *{" "}
                  <span className="text-xs text-muted-foreground">
                    ({form.seoDescription.length}/160 chars)
                  </span>
                </Label>
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => update({ seoDescription: e.target.value })}
                  placeholder="Fast, reliable same day courier services across the UK. Book online or get a quote..."
                  maxLength={160}
                  rows={3}
                  className={
                    form.seoDescription.length > 160 ? "border-red-500" : ""
                  }
                />
              </div>
              <div>
                <Label>
                  Canonical URL{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional, leave blank to auto-set)
                  </span>
                </Label>
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => update({ canonicalUrl: e.target.value })}
                  placeholder={`https://couriers.foursix46.com/services/${form.slug || "slug"}`}
                />
              </div>
              <div>
                <Label>
                  OG Image URL{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  value={form.ogImage}
                  onChange={(e) => update({ ogImage: e.target.value })}
                  placeholder="https://..."
                />
                {form.ogImage && (
                  <img
                    src={form.ogImage}
                    alt="OG preview"
                    className="mt-2 h-20 rounded border object-cover"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-xl">
                <Checkbox
                  id="noindex"
                  checked={form.noindex}
                  onCheckedChange={(v) => update({ noindex: !!v })}
                />
                <div>
                  <Label
                    htmlFor="noindex"
                    className="cursor-pointer font-medium"
                  >
                    No Index
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hides this page from Google. Use for draft/test pages only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ===== RELATIONS & FAQs ===== */}
          {activeTab === "relations" && (
            <div className="space-y-4">
              <SectionHeader title="Relations" />
              <TagInput
                label="Related Sectors (enter sector slugs)"
                values={form.relatedSectors}
                onChange={(v) => update({ relatedSectors: v })}
                placeholder="e.g. dental, medical, aerospace"
              />
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
                  placeholder="Frequently Asked Questions"
                />
              </div>
              <TagInput
                label="FAQ IDs (enter Firestore FAQ document IDs)"
                values={form.faqIds}
                onChange={(v) => update({ faqIds: v })}
                placeholder="Paste FAQ document ID and press Enter"
              />
              <p className="text-xs text-muted-foreground">
                💡 Tip: Go to FAQs section, copy the document ID from the table,
                and paste it here to link FAQs to this service.
              </p>
            </div>
          )}
        </div>

        {/* ✅ Fix #1 — status passed directly to handleSave (no race condition)
            ✅ Fix #5 — Loader2 spinner on isSaving */}
        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={isSaving}
            onClick={() => handleSave("draft")}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Save as Draft
          </Button>
          <Button
            className="bg-[#134467] hover:bg-[#0e3352] text-white"
            disabled={isSaving}
            onClick={() => handleSave("published")}
          >
            {isSaving && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
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

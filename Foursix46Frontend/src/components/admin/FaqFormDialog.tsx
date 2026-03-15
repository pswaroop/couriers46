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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Copy, Check } from "lucide-react";

/* ─────────────────────────────────────────────
   CopyButton — ✅ defined OUTSIDE FaqFormDialog
   so it never remounts on re-render
───────────────────────────────────────────── */
const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for older browsers
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold
        px-3 py-2 rounded-lg border transition-all ${
          copied
            ? "bg-green-50 border-green-300 text-green-700"
            : "bg-white border-slate-200 text-slate-500 hover:border-[#134467] hover:text-[#134467]"
        }`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          Copy ID
        </>
      )}
    </button>
  );
};

/* ─────────────────────────────────────────────
   TagInput
───────────────────────────────────────────── */
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
    const t = input.trim().toLowerCase();
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
            className="flex items-center gap-1 pr-1 capitalize"
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
      <p className="text-xs text-muted-foreground mt-1">
        Suggested: insurance, pricing, tracking, vehicles, delivery, coverage
      </p>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FaqFormData {
  question: string;
  answer: string;
  status: "draft" | "published";
  tags: string[];
  sortOrder: number;
}

const defaultForm: FaqFormData = {
  question: "",
  answer: "",
  status: "draft",
  tags: [],
  sortOrder: 0,
};

interface Props {
  open: boolean;
  editingItem: any | null;
  onClose: () => void;
  onSave: (data: FaqFormData) => Promise<void>;
}

/* ─────────────────────────────────────────────
   FaqFormDialog
───────────────────────────────────────────── */
export function FaqFormDialog({ open, editingItem, onClose, onSave }: Props) {
  const [form, setForm] = useState<FaqFormData>(defaultForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(
      editingItem
        ? {
            ...defaultForm,
            ...editingItem,
            // Normalise tags to plain strings in case DB returns objects
            tags: (editingItem.tags ?? []).map((t: any) =>
              typeof t === "string" ? t : String(t),
            ),
          }
        : defaultForm,
    );
  }, [editingItem, open]);

  const update = (f: Partial<FaqFormData>) => setForm((p) => ({ ...p, ...f }));

  const handleSave = async (status: "draft" | "published") => {
    if (!form.question.trim()) {
      alert("Question is required.");
      return;
    }
    if (!form.answer.trim()) {
      alert("Answer is required.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ ...form, status });
    } finally {
      setIsSaving(false);
    }
  };

  const questionLen = form.question.length;
  const answerLen = form.answer.length;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editingItem ? "Edit FAQ" : "Create FAQ"}
            <Badge
              variant={form.status === "published" ? "default" : "secondary"}
            >
              {form.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2 space-y-5 py-2">
          {/* ✅ FAQ ID banner — only shown when editing, INSIDE the JSX return */}
          {editingItem?.id && (
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                  FAQ Document ID
                </p>
                <code className="text-sm font-mono text-[#134467] break-all select-all">
                  {editingItem.id}
                </code>
              </div>
              <CopyButton value={editingItem.id} />
            </div>
          )}

          {/* Question */}
          <div>
            <Label className="font-semibold">
              Question *{" "}
              <span
                className={`text-xs font-normal ${
                  questionLen > 200 ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                ({questionLen} chars)
              </span>
            </Label>
            <Input
              value={form.question}
              onChange={(e) => update({ question: e.target.value })}
              placeholder="What areas do you cover for same day courier services?"
              className="mt-1"
            />
          </div>

          {/* Answer */}
          <div>
            <Label className="font-semibold">
              Answer (HTML / Rich Text) *{" "}
              <span
                className={`text-xs font-normal ${
                  answerLen > 2000 ? "text-amber-500" : "text-muted-foreground"
                }`}
              >
                ({answerLen} chars)
              </span>
            </Label>
            <Textarea
              value={form.answer}
              onChange={(e) => update({ answer: e.target.value })}
              rows={6}
              placeholder="<p>We cover all major UK cities including Cardiff, London, Bristol...</p>"
              className="mt-1 font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports HTML. Rendered in an accordion with FAQPage JSON-LD
              schema.
            </p>
          </div>

          {/* Status & Sort Order */}
          <div className="grid grid-cols-2 gap-4">
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
              <Label>
                Sort Order{" "}
                <span className="text-xs text-muted-foreground">
                  (lower = shown first)
                </span>
              </Label>
              <Input
                type="number"
                value={form.sortOrder}
                onChange={(e) => update({ sortOrder: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          {/* Tags */}
          <TagInput
            label="Tags (for filtering & grouping)"
            values={form.tags}
            onChange={(v) => update({ tags: v })}
            placeholder="e.g. pricing, insurance, tracking"
          />

          {/* Live Accordion Preview */}
          {form.question && form.answer && (
            <div className="border rounded-xl p-4 space-y-2 bg-blue-50">
              <p className="text-xs font-bold uppercase tracking-wide text-[#134467]">
                Accordion Preview
              </p>
              <details>
                <summary className="cursor-pointer font-medium text-sm">
                  {form.question}
                </summary>
                <div
                  className="mt-2 text-sm text-muted-foreground prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: form.answer }}
                />
              </details>
            </div>
          )}
        </div>

        <DialogFooter className="border-t pt-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
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
            className="bg-[#134467] hover:bg-[#0e3352] text-white"
            disabled={isSaving}
            onClick={() => handleSave("published")}
          >
            {isSaving
              ? "Saving..."
              : editingItem
                ? "Update"
                : "Create & Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

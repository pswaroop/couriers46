import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase";
import { Textarea } from "@/components/ui/textarea";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import {
  Loader2,
  LogOut,
  Check,
  X,
  PackageCheck,
  Banknote,
  Hourglass,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// ── CMS Form Dialogs ──────────────────────────────────────────────────────────
import { ServiceFormDialog } from "@/components/admin/ServiceFormDialog";
import { SectorFormDialog } from "@/components/admin/SectorFormDialog";
import { LocationFormDialog } from "@/components/admin/LocationFormDialog";
import { LandingPageFormDialog } from "@/components/admin/LandingPageFormDialog";
import { FaqFormDialog } from "@/components/admin/FaqFormDialog";

const apiUrl = import.meta.env.VITE_API_URL;

// --- Interfaces ---
interface DriverApplication {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dbsConfirmed?: boolean;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  town: string;
  county?: string;
  postcode: string;
  vehicleType: string;
  registration: string;
  makeModel: string;
  dvlaCheckCode?: string;
  year: string;
  niNumber: string;
  utrNumber?: string;
  rightToWorkCode: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Timestamp;
  drivingLicenseUrl?: string;
  rightToWorkDocUrl?: string;
  vehicleInsuranceUrl?: string;
  publicLiabilityInsuranceUrl?: string;
  goodsInTransitInsuranceUrl?: string;
}

interface BusinessRegistration {
  id: string;
  companyName: string;
  registrationNumber?: string;
  vatNumber?: string;
  businessType: string;
  companyAddress: string;
  contactFirstName: string;
  contactLastName: string;
  contactEmail: string;
  contactPhone: string;
  jobTitle: string;
  monthlyShipments: string;
  parcelTypes: string;
  deliveryAreas: string;
  specialRequirements?: string;
  billingMethod: string;
  billingEmail?: string;
  termsAccepted: boolean;
  status: "pending" | "approved" | "rejected";
  submittedAt: Timestamp;
}

interface DashboardStats {
  pending: number;
  approved: number;
  shippers: number;
  revenue: number;
}

type DashboardView =
  | "overview"
  | "pending"
  | "active"
  | "pendingShippers"
  | "activeShippers"
  | "revenue"
  | "bookings"
  | "services"
  | "sectors"
  | "locations"
  | "landingPages"
  | "faqs"
  | "quickQuotes"
  | "payments";

interface Booking {
  id: string;
  reference?: string;
  mode: "normal" | "business";
  createdAt?: Timestamp;
  sender?: any;
  recipient?: any;
  business?: any;
  parcels: any;
  delivery?: any;
  pricing?: any;
  status: string;
  termsAccepted?: boolean;
  paymentIntentId?: string;
}

// --- Delete Confirmation Modal ---
interface DeleteConfirmProps {
  open: boolean;
  entityName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmModal = ({
  open,
  entityName,
  onConfirm,
  onCancel,
}: DeleteConfirmProps) => {
  const [typed, setTyped] = useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">
            Delete {entityName}?
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            ⚠️ This action{" "}
            <strong className="text-red-600">cannot be undone</strong>. The
            record will be permanently deleted.
          </p>
          <div>
            <Label className="text-sm font-medium">
              Type{" "}
              <span className="font-mono font-bold text-red-600">DELETE</span>{" "}
              to confirm:
            </Label>
            <Input
              className="mt-2"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="DELETE"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={typed !== "DELETE"}
            onClick={() => {
              onConfirm();
              setTyped("");
            }}
          >
            <Trash2 className="w-4 h-4 mr-1" /> Permanently Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- File Preview ---
const FilePreview = ({ url }: { url: string }) => {
  const [show, setShow] = useState(false);
  const lower = url.toLowerCase();
  const isPdf = lower.includes(".pdf");
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Button asChild variant="outline" size="sm">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open in new tab
          </a>
        </Button>
        <Button
          type="button"
          variant={show ? "secondary" : "default"}
          size="sm"
          onClick={() => setShow((v) => !v)}
        >
          {show ? "Hide preview" : "Preview here"}
        </Button>
      </div>
      {show &&
        (isPdf ? (
          <iframe
            src={url}
            title="Document preview"
            className="w-full h-96 rounded border"
          />
        ) : (
          <img
            src={url}
            alt="Document preview"
            className="max-h-96 rounded border"
          />
        ))}
    </div>
  );
};

// --- Detail Row ---
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="rounded-xl px-4 py-4 mb-3 shadow transition duration-200 border-l-4 border-[#48AEDD] bg-gradient-to-r from-blue-50 via-blue-100 to-[#e0e7ff] hover:from-blue-100 hover:to-blue-200">
    <div
      className="text-xs font-bold mb-2 uppercase tracking-wide"
      style={{ color: "#112D4E" }}
    >
      {label}
    </div>
    <div
      className="text-[1rem] font-semibold break-words"
      style={{ color: value ? "#F01927" : "#F1C40F" }}
    >
      {value ?? (
        <span className="italic" style={{ color: "#F1C40F" }}>
          No data
        </span>
      )}
    </div>
  </div>
);

// --- Format Date ---
// ✅ New — handles all 4 timestamp formats
const formatDate = (timestamp: any): string => {
  if (!timestamp) return "N/A";

  let date: Date | null = null;

  // 1. Firestore Timestamp object (direct SDK — drivers, shippers, bookings)
  if (typeof timestamp.toDate === "function") {
    date = timestamp.toDate();
  }
  // 2. Serialized Firestore Timestamp from REST API: { _seconds, _nanoseconds }
  else if (timestamp._seconds !== undefined) {
    date = new Date(timestamp._seconds * 1000);
  }
  // 3. Alternate serialization: { seconds, nanoseconds }
  else if (timestamp.seconds !== undefined) {
    date = new Date(timestamp.seconds * 1000);
  }
  // 4. ISO string or numeric timestamp (e.g. from server.js Date.now())
  else {
    const parsed = new Date(timestamp);
    if (!isNaN(parsed.getTime())) date = parsed;
  }

  if (!date) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingQuote, setEditingQuote] = useState<any | null>(null);
  const [quoteEditForm, setQuoteEditForm] = useState({
    status: "",
    adminPriceQuote: "",
    adminNotes: "",
  });

  const [pendingApplications, setPendingApplications] = useState<
    DriverApplication[]
  >([]);
  const [activeDrivers, setActiveDrivers] = useState<DriverApplication[]>([]);
  const [pendingShippers, setPendingShippers] = useState<
    BusinessRegistration[]
  >([]);
  const [activeShippers, setActiveShippers] = useState<BusinessRegistration[]>(
    [],
  );
  const [stats, setStats] = useState<DashboardStats>({
    pending: 0,
    approved: 0,
    shippers: 0,
    revenue: 0,
  });
  const [currentView, setCurrentView] = useState<DashboardView>("overview");
  const [selectedApp, setSelectedApp] = useState<
    DriverApplication | BusinessRegistration | Booking | null
  >(null);
  const [normalBookings, setNormalBookings] = useState<Booking[]>([]);
  const [businessBookings, setBusinessBookings] = useState<Booking[]>([]);

  // CMS states
  const [services, setServices] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [landingPages, setLandingPages] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [quickQuotes, setQuickQuotes] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  // CMS dialog state — shared open flag + which item is being edited
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Delete confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    label: string;
  } | null>(null);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const getTimestamp = (ts: any): number => {
    if (!ts) return 0;
    if (typeof ts.toMillis === "function") return ts.toMillis(); // Firestore Timestamp (SDK)
    if (ts.seconds !== undefined) return ts.seconds * 1000; // REST serialized { seconds }
    if (ts._seconds !== undefined) return ts._seconds * 1000; // Alt serialization
    const p = new Date(ts);
    return isNaN(p.getTime()) ? 0 : p.getTime(); // ISO string fallback
  };
  // --- Filter & Sort ---
  const filterAndSort = (
    data: any[],
    type: "driver" | "business" | "booking",
  ) => {
    let filtered = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        if (type === "driver") {
          const d = item as DriverApplication;
          return (
            d.firstName?.toLowerCase().includes(q) ||
            d.lastName?.toLowerCase().includes(q) ||
            `${d.firstName} ${d.lastName}`.toLowerCase().includes(q) ||
            d.email?.toLowerCase().includes(q) ||
            d.phone?.includes(q)
          );
        }
        if (type === "business") {
          const b = item as BusinessRegistration;
          return (
            b.companyName?.toLowerCase().includes(q) ||
            b.contactFirstName?.toLowerCase().includes(q) ||
            b.contactEmail?.toLowerCase().includes(q)
          );
        }
        if (type === "booking") {
          const k = item as Booking;
          return (
            k.reference?.toLowerCase().includes(q) ||
            k.sender?.name?.toLowerCase().includes(q) ||
            k.business?.companyName?.toLowerCase().includes(q)
          );
        }
        return false;
      });
    }
    filtered.sort((a, b) => {
      let dateA = 0,
        dateB = 0,
        nameA = "",
        nameB = "";
      if (type === "driver") {
        dateA = getTimestamp(a.submittedAt); // ← was a.submittedAt?.toMillis() ?? 0
        dateB = getTimestamp(b.submittedAt);
        nameA = a.firstName + " " + a.lastName;
        nameB = b.firstName + " " + b.lastName;
      } else if (type === "business") {
        dateA = getTimestamp(a.submittedAt);
        dateB = getTimestamp(b.submittedAt);
        nameA = a.companyName;
        nameB = b.companyName;
      } else if (type === "booking") {
        dateA = getTimestamp(a.createdAt);
        dateB = getTimestamp(b.createdAt);
        nameA = a.reference ?? "";
        nameB = b.reference ?? "";
      }
      switch (sortOrder) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "nameasc":
          return nameA.localeCompare(nameB);
        case "namedesc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });
    return filtered;
  };

  const filteredPendingApplications = filterAndSort(
    pendingApplications,
    "driver",
  ) as DriverApplication[];
  const filteredActiveDrivers = filterAndSort(
    activeDrivers,
    "driver",
  ) as DriverApplication[];
  const filteredPendingShippers = filterAndSort(
    pendingShippers,
    "business",
  ) as BusinessRegistration[];
  const filteredActiveShippers = filterAndSort(
    activeShippers,
    "business",
  ) as BusinessRegistration[];
  const filteredNormalBookings = filterAndSort(
    normalBookings,
    "booking",
  ) as Booking[];
  const filteredBusinessBookings = filterAndSort(
    businessBookings,
    "booking",
  ) as Booking[];

  const totalNormalRevenue = normalBookings.reduce(
    (sum, b) => sum + (b.pricing?.finalPrice ?? 0),
    0,
  );
  const totalBusinessRevenue = businessBookings.reduce(
    (sum, b) => sum + (b.pricing?.finalPrice ?? 0),
    0,
  );
  const totalPaymentsRevenue = (payments ?? [])
    .filter((p: any) => p.status === "paid")
    .reduce((sum: number, p: any) => sum + (Number(p.totalAmount) || 0), 0);
  const totalRevenue =
    totalNormalRevenue + totalBusinessRevenue + totalPaymentsRevenue;

  // --- Fetch CMS Data ---
  const fetchCMSData = useCallback(async () => {
    try {
      const [
        driversRes,
        svcRes,
        secRes,
        locRes,
        landRes,
        faqRes,
        qqRes,
        payRes,
      ] = await Promise.all([
        fetch(`${apiUrl}/api/admin/drivers`),
        fetch(`${apiUrl}/api/admin/services`),
        fetch(`${apiUrl}/api/admin/sectors`),
        fetch(`${apiUrl}/api/admin/locations`),
        fetch(`${apiUrl}/api/admin/location-services`),
        fetch(`${apiUrl}/api/admin/faqs`),
        fetch(`${apiUrl}/api/admin/quick-quotes`).catch(() => ({
          json: async () => [],
        })),
        fetch(`${apiUrl}/api/admin/payments`).catch(() => ({
          json: async () => [],
        })),
      ]);

      const driversData = await driversRes.json();

      // ✅ Populate ALL driver states from the single API call
      setDrivers(driversData);
      setPendingApplications(
        driversData.filter((d: any) => d.status === "pending"),
      );
      setActiveDrivers(driversData.filter((d: any) => d.status === "approved"));
      setStats((prev) => ({
        ...prev,
        pending: driversData.filter((d: any) => d.status === "pending").length,
        approved: driversData.filter((d: any) => d.status === "approved")
          .length,
      }));
      setServices(await svcRes.json());
      setSectors(await secRes.json());
      setLocations(await locRes.json());
      setLandingPages(await landRes.json());
      setFaqs(await faqRes.json());
      setQuickQuotes(await (qqRes as any).json());
      setPayments(await (payRes as any).json());
    } catch (err) {
      console.error("CMS fetch error:", err);
      toast.error("Failed to load CMS data");
    }
  }, []);

  // --- Fetch Firestore Data ---
  const fetchAllData = useCallback(async () => {
    try {
      // const pendingSnap = await getDocs(
      //   query(collection(db, "drivers"), where("status", "==", "pending")),
      // );
      // const pendingDocs = pendingSnap.docs.map((d) => ({
      //   id: d.id,
      //   ...d.data(),
      // })) as DriverApplication[];
      // setPendingApplications(pendingDocs);
      // setStats((prev) => ({ ...prev, pending: pendingDocs.length }));

      // const activeSnap = await getDocs(
      //   query(collection(db, "drivers"), where("status", "==", "approved")),
      // );
      // const activeDocs = activeSnap.docs.map((d) => ({
      //   id: d.id,
      //   ...d.data(),
      // })) as DriverApplication[];
      // setActiveDrivers(activeDocs);
      // setStats((prev) => ({ ...prev, approved: activeDocs.length }));

      const pendingShipSnap = await getDocs(
        query(collection(db, "businesses"), where("status", "==", "pending")),
      );
      const pendingShipDocs = pendingShipSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BusinessRegistration[];
      setPendingShippers(pendingShipDocs);
      setStats((prev) => ({ ...prev, shippers: pendingShipDocs.length }));

      const activeShipSnap = await getDocs(
        query(collection(db, "businesses"), where("status", "==", "approved")),
      );
      const activeShipDocs = activeShipSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as BusinessRegistration[];
      setActiveShippers(activeShipDocs);

      const bookSnap = await getDocs(collection(db, "bookings"));
      const allBookings = bookSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Booking[];
      setNormalBookings(allBookings.filter((b) => b.mode === "normal"));
      setBusinessBookings(allBookings.filter((b) => b.mode === "business"));
    } catch (error: any) {
      console.error("❌ Firestore fetch error:", error);
      toast.error("Failed to load dashboard data: " + error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleQuoteEditSave = async () => {
    if (!editingQuote) return;
    try {
      const res = await fetch(
        `${apiUrl}/api/admin/quick-quotes/${editingQuote.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: quoteEditForm.status,
            adminPriceQuote: quoteEditForm.adminPriceQuote,
            adminNotes: quoteEditForm.adminNotes,
          }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Quote updated!");
      setEditingQuote(null);
      fetchCMSData();
    } catch (err: any) {
      toast.error(err.message ?? "Update failed.");
    }
  };

  // --- Auth Effect ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        try {
          const tokenResult = await user.getIdTokenResult();
          const isAdminClaim = tokenResult.claims.admin === true;
          setIsAdmin(isAdminClaim);
          if (!isAdminClaim) setIsLoading(false);
        } catch (error) {
          console.error("Error fetching token claims", error);
          setIsAdmin(false);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        navigate("/admin/login");
      }
    });
    return unsubscribeAuth;
  }, [navigate]);

  // --- Data Fetch Effect ---
  useEffect(() => {
    if (isAdmin) {
      setIsLoading(true);
      fetchCMSData();
      fetchAllData();
    } else if (!isLoading && user) {
      setIsLoading(false);
    }
  }, [isAdmin]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchCMSData();
    fetchAllData();
  };

  // --- Action Handlers ---
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      toast.error("Failed to sign out.");
    }
  };
  /* ── Copy ID Badge ─────────────────────────────────────────── */
  const CopyIdBadge = ({ id }: { id: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* fallback for older browsers */
        const el = document.createElement("textarea");
        el.value = id;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    return (
      <div className="flex items-center gap-1.5 group">
        <code className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded-md max-w-[120px] truncate block">
          {id}
        </code>
        <button
          onClick={handleCopy}
          title={copied ? "Copied!" : "Copy ID"}
          className={`flex-shrink-0 p-1 rounded transition-colors ${
            copied
              ? "text-green-600 bg-green-50"
              : "text-slate-400 hover:text-[#134467] hover:bg-slate-100"
          }`}
        >
          {copied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    );
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/drivers/${id}/approve`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Failed to approve.");
      toast.success(result.message ?? "Application approved!");
      setSelectedApp(null);
      setPendingApplications((prev) => prev.filter((app) => app.id !== id));
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message ?? "Failed to approve application.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/drivers/${id}/reject`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Failed to reject.");
      toast.success(result.message ?? "Application rejected.");
      setSelectedApp(null);
      setPendingApplications((prev) => prev.filter((app) => app.id !== id));
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message ?? "Failed to reject application.");
    }
  };

  const handleApproveShipper = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/businesses/${id}/approve`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Failed to approve.");
      toast.success(result.message ?? "Business approved!");
      setSelectedApp(null);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message ?? "Failed to approve business.");
    }
  };

  const handleRejectShipper = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/businesses/${id}/reject`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message ?? "Failed to reject.");
      toast.success(result.message ?? "Business rejected.");
      setSelectedApp(null);
      fetchAllData();
    } catch (error: any) {
      toast.error(error.message ?? "Failed to reject business.");
    }
  };

  // Trigger delete confirm modal
  const confirmDelete = (type: string, id: string, label: string) => {
    setDeleteTarget({ type, id, label });
  };

  // Actual delete after confirmation
  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { type, id } = deleteTarget;
    setDeleteTarget(null);
    const endpointMap: Record<string, string> = {
      driver: `${apiUrl}/api/drivers/${id}`,
      business: `${apiUrl}/api/businesses/${id}`,
      booking: `${apiUrl}/api/bookings/${id}`,
      service: `${apiUrl}/api/services/${id}`,
      sector: `${apiUrl}/api/sectors/${id}`,
      location: `${apiUrl}/api/locations/${id}`,
      landingPage: `${apiUrl}/api/location-services/${id}`,
      faq: `${apiUrl}/api/faqs/${id}`,
      quickQuote: `${apiUrl}/api/admin/quick-quotes/${id}`,
    };
    try {
      const res = await fetch(endpointMap[type], { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Deleted successfully");
      setSelectedApp(null);
      fetchCMSData();
      fetchAllData();
    } catch (err: any) {
      toast.error(err.message ?? "Delete failed.");
    }
  };

  // --- CMS Form Open Helpers ---
  const openCreateForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const openEditForm = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // --- CMS save handler factory (used by all 5 dialogs) ---
  const makeSaveHandler =
    (
      createEndpoint: string,
      updateEndpoint: (id: string) => string,
      successLabel: string,
    ) =>
    async (data: any) => {
      const isEdit = !!editingItem;
      const url = isEdit ? updateEndpoint(editingItem.id) : createEndpoint;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message ?? "Save failed");
      toast.success(
        isEdit ? `${successLabel} updated!` : `${successLabel} created!`,
      );
      setIsFormOpen(false);
      fetchCMSData();
    };

  // --- Render Guards ---
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
        <p className="text-lg text-muted-foreground">
          You do not have permission.
        </p>
        <Button onClick={handleLogout} variant="link" className="mt-4">
          Go to Login
        </Button>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/40">
      {/* ── Delete Confirmation Modal ─────────────────────────────────────── */}
      <DeleteConfirmModal
        open={!!deleteTarget}
        entityName={deleteTarget?.label ?? "this item"}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* ── CMS Form Dialogs ──────────────────────────────────────────────── */}

      {/* Services */}
      <ServiceFormDialog
        open={isFormOpen && currentView === "services"}
        editingItem={currentView === "services" ? editingItem : null}
        onClose={() => setIsFormOpen(false)}
        onSave={makeSaveHandler(
          `${apiUrl}/api/services`,
          (id) => `${apiUrl}/api/services/${id}`,
          "Service",
        )}
      />

      {/* Sectors */}
      <SectorFormDialog
        open={isFormOpen && currentView === "sectors"}
        editingItem={currentView === "sectors" ? editingItem : null}
        allFaqs={faqs}
        onClose={() => setIsFormOpen(false)}
        onSave={makeSaveHandler(
          `${apiUrl}/api/sectors`,
          (id) => `${apiUrl}/api/sectors/${id}`,
          "Sector",
        )}
      />

      {/* Locations */}
      <LocationFormDialog
        open={isFormOpen && currentView === "locations"}
        editingItem={currentView === "locations" ? editingItem : null}
        onClose={() => setIsFormOpen(false)}
        onSave={makeSaveHandler(
          `${apiUrl}/api/locations`,
          (id) => `${apiUrl}/api/locations/${id}`,
          "Location",
        )}
      />

      {/* Landing Pages */}
      <LandingPageFormDialog
        open={isFormOpen && currentView === "landingPages"}
        editingItem={currentView === "landingPages" ? editingItem : null}
        existingPairs={landingPages.map((p) => ({
          locationSlug: p.locationSlug,
          serviceSlug: p.serviceSlug,
          id: p.id,
        }))}
        onClose={() => setIsFormOpen(false)}
        onSave={makeSaveHandler(
          `${apiUrl}/api/location-services`,
          (id) => `${apiUrl}/api/location-services/${id}`,
          "Landing page",
        )}
      />

      {/* FAQs */}
      <FaqFormDialog
        open={isFormOpen && currentView === "faqs"}
        editingItem={currentView === "faqs" ? editingItem : null}
        onClose={() => setIsFormOpen(false)}
        onSave={makeSaveHandler(
          `${apiUrl}/api/faqs`,
          (id) => `${apiUrl}/api/faqs/${id}`,
          "FAQ",
        )}
      />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between p-4 md:p-6 bg-card border-b">
        <div>
          <h1 className="text-3xl font-bold text-secondary">
            FourSix46® Admin
          </h1>
          <p className="text-muted-foreground">Welcome, {user?.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <main className="p-4 md:p-6 grid gap-6">
        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {[
            {
              view: "bookings",
              label: "Bookings",
              value: normalBookings.length + businessBookings.length,
              icon: <PackageCheck className="h-4 w-4 text-blue-600" />,
            },
            {
              view: "pending",
              label: "Pending Drivers",
              value: stats.pending,
              icon: <Hourglass className="h-4 w-4 text-yellow-600" />,
            },
            {
              view: "active",
              label: "Active Drivers",
              value: stats.approved,
              icon: <PackageCheck className="h-4 w-4 text-green-600" />,
            },
            {
              view: "pendingShippers",
              label: "Pending Shippers",
              value: pendingShippers.length,
              icon: <Hourglass className="h-4 w-4 text-yellow-600" />,
            },
            {
              view: "activeShippers",
              label: "Active Shippers",
              value: activeShippers.length,
              icon: <PackageCheck className="h-4 w-4 text-green-600" />,
            },
            {
              view: "revenue",
              label: "Revenue",
              value: `£${totalRevenue.toFixed(2)}`,
              icon: <Banknote className="h-4 w-4 text-indigo-600" />,
            },
          ].map(({ view, label, value, icon }) => (
            <Card
              key={view}
              className={`cursor-pointer hover:shadow-md transition-shadow ${currentView === view ? "border-red-500 bg-red-50" : ""}`}
              onClick={() => setCurrentView(view as DashboardView)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                {icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">Click to view</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CMS Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {[
            { view: "services", label: "Services", count: services.length },
            { view: "sectors", label: "Sectors", count: sectors.length },
            { view: "locations", label: "Locations", count: locations.length },
            {
              view: "landingPages",
              label: "Landing Pages",
              count: landingPages.length,
            },
            { view: "faqs", label: "FAQs", count: faqs.length },
            {
              view: "quickQuotes",
              label: "Quick Quotes",
              count: quickQuotes.length,
            },
            { view: "payments", label: "Payments", count: payments.length },
          ].map(({ view, label, count }) => (
            <Card
              key={view}
              className={`cursor-pointer hover:shadow-md transition-shadow ${currentView === view ? "border-blue-500 bg-blue-50" : ""}`}
              onClick={() => setCurrentView(view as DashboardView)}
            >
              <CardHeader>
                <CardTitle className="text-sm">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">Manage {label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Controls */}
        {currentView !== "overview" && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setCurrentView("overview")}
            >
              ← Hide Details
            </Button>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="nameasc">Name A-Z</SelectItem>
                  <SelectItem value="namedesc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* ── Pending Drivers ──────────────────────────────────────────────── */}
        {currentView === "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Pending Driver Applications (
                {filteredPendingApplications.length})
              </CardTitle>
              <CardDescription>
                Review and approve or reject new applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No pending applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>
                          {app.firstName} {app.lastName}
                        </TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.vehicleType}</TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-yellow-100 text-yellow-800"
                          >
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {app.submittedAt ? formatDate(app.submittedAt) : "-"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApp(app)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() => handleApprove(app.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(app.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              confirmDelete(
                                "driver",
                                app.id,
                                `${app.firstName} ${app.lastName}`,
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── Active Drivers ───────────────────────────────────────────────── */}
        {currentView === "active" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Active Drivers ({filteredActiveDrivers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveDrivers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No active drivers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActiveDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>
                          {driver.firstName} {driver.lastName}
                        </TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.vehicleType}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApp(driver)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              confirmDelete(
                                "driver",
                                driver.id,
                                `${driver.firstName} ${driver.lastName}`,
                              )
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── Pending Shippers ─────────────────────────────────────────────── */}
        {currentView === "pendingShippers" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Pending Shippers ({filteredPendingShippers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingShippers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No pending shippers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPendingShippers.map((biz) => (
                      <TableRow key={biz.id}>
                        <TableCell>{biz.companyName}</TableCell>
                        <TableCell>
                          {biz.contactFirstName} {biz.contactLastName}
                        </TableCell>
                        <TableCell>{biz.businessType}</TableCell>
                        <TableCell>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            {biz.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {biz.submittedAt ? formatDate(biz.submittedAt) : "-"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApp(biz)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-600"
                            onClick={() => handleApproveShipper(biz.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectShipper(biz.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              confirmDelete("business", biz.id, biz.companyName)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── Active Shippers ──────────────────────────────────────────────── */}
        {currentView === "activeShippers" && (
          <Card>
            <CardHeader>
              <CardTitle>
                Active Shippers ({filteredActiveShippers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActiveShippers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No active shippers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredActiveShippers.map((biz) => (
                      <TableRow key={biz.id}>
                        <TableCell>{biz.companyName}</TableCell>
                        <TableCell>
                          {biz.contactFirstName} {biz.contactLastName}
                        </TableCell>
                        <TableCell>{biz.contactEmail}</TableCell>
                        <TableCell>{biz.businessType}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            {biz.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedApp(biz)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              confirmDelete("business", biz.id, biz.companyName)
                            }
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── Bookings ─────────────────────────────────────────────────────── */}
        {currentView === "bookings" && (
          <div className="grid gap-8 md:grid-cols-2">
            {[
              { title: "Normal Bookings", data: filteredNormalBookings },
              { title: "Business Bookings", data: filteredBusinessBookings },
            ].map(({ title, data }) => (
              <Card key={title}>
                <CardHeader>
                  <CardTitle>
                    {title} ({data.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Sender/Company</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No bookings found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((b) => (
                          <TableRow key={b.id}>
                            <TableCell>{b.reference ?? b.id}</TableCell>
                            <TableCell>
                              {b.sender?.name ?? b.business?.companyName ?? "-"}
                            </TableCell>
                            <TableCell>
                              {b.createdAt ? formatDate(b.createdAt) : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">{b.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedApp(b)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  confirmDelete(
                                    "booking",
                                    b.id,
                                    b.reference ?? b.id,
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Revenue ──────────────────────────────────────────────────────── */}
        {currentView === "revenue" && (
          <Card>
            <CardHeader>
              <CardTitle>Revenue Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6">
                £{totalRevenue.toFixed(2)}
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    Normal Bookings ({normalBookings.length})
                  </span>
                  <span className="font-medium">
                    £{totalNormalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    Business Bookings ({businessBookings.length})
                  </span>
                  <span className="font-medium">
                    £{totalBusinessRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">
                    Direct Payments (
                    {
                      (payments ?? []).filter((p: any) => p.status === "paid")
                        .length
                    }{" "}
                    paid)
                  </span>
                  <span className="font-medium">
                    £{totalPaymentsRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-base">
                  <span>Total Revenue</span>
                  <span>£{totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Quick Quotes ─────────────────────────────────────────────────── */}
        {currentView === "quickQuotes" && (
          <>
            {/* ── Edit Modal ── */}
            <Dialog
              open={!!editingQuote}
              onOpenChange={(o) => !o && setEditingQuote(null)}
            >
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-[#134467]">
                    Edit Quick Quote
                  </DialogTitle>
                </DialogHeader>

                {editingQuote && (
                  <div className="space-y-5 py-2 max-h-[70vh] overflow-y-auto pr-2">
                    {/* Read-only summary */}
                    <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4 text-sm">
                      <div>
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                          Pickup
                        </p>
                        <p className="font-semibold">
                          {editingQuote.pickup?.name}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.pickup?.postcode}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.pickup?.date}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.pickup?.timeFrom} –{" "}
                          {editingQuote.pickup?.timeTo}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                          Drop
                        </p>
                        <p className="font-semibold">
                          {editingQuote.drop?.name}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.drop?.postcode}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.drop?.date}
                        </p>
                        <p className="text-[#134467]/60">
                          {editingQuote.drop?.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                          Distance
                        </p>
                        <p>{editingQuote.distanceMiles} miles</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                          Vehicle
                        </p>
                        <p>{editingQuote.suggestedVehicle}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                          Job Type
                        </p>
                        <p>{editingQuote.jobDescription}</p>
                      </div>
                      {editingQuote.notes && (
                        <div className="col-span-2">
                          <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-1">
                            Customer Notes
                          </p>
                          <p className="text-[#134467]/70">
                            {editingQuote.notes}
                          </p>
                        </div>
                      )}
                      <div className="col-span-2 border-t border-slate-200 pt-3">
                        <p className="text-xs font-bold text-[#134467]/50 uppercase tracking-wide mb-2">
                          Contact
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-semibold">Name:</span>{" "}
                            {editingQuote.contact?.name ?? "—"}
                          </p>
                          <p>
                            <span className="font-semibold">Email:</span>{" "}
                            <a
                              href={`mailto:${editingQuote.contact?.email}`}
                              className="text-[#48AEDD] underline"
                            >
                              {editingQuote.contact?.email ?? "—"}
                            </a>
                          </p>
                          <p>
                            <span className="font-semibold">Phone:</span>{" "}
                            <a
                              href={`tel:${editingQuote.contact?.phone}`}
                              className="text-[#48AEDD] underline"
                            >
                              {editingQuote.contact?.phone ?? "—"}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Editable fields */}
                    <div className="space-y-1">
                      <Label className="font-semibold text-[#134467]">
                        Status
                      </Label>
                      <select
                        value={quoteEditForm.status}
                        onChange={(e) =>
                          setQuoteEditForm((p) => ({
                            ...p,
                            status: e.target.value,
                          }))
                        }
                        className="w-full border rounded-md p-2 text-sm"
                      >
                        <option value="new">🔵 New</option>
                        <option value="contacted">🟡 Contacted</option>
                        <option value="quoted">🟠 Quoted</option>
                        <option value="won">🟢 Won</option>
                        <option value="lost">🔴 Lost</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="font-semibold text-[#134467]">
                        Admin Price Quote (£)
                      </Label>
                      <Input
                        type="number"
                        placeholder="e.g. 45.00"
                        min="0"
                        step="0.01"
                        value={quoteEditForm.adminPriceQuote}
                        onChange={(e) =>
                          setQuoteEditForm((p) => ({
                            ...p,
                            adminPriceQuote: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="font-semibold text-[#134467]">
                        Admin Notes
                      </Label>
                      <Textarea
                        placeholder="Internal notes about this quote..."
                        rows={3}
                        value={quoteEditForm.adminNotes}
                        onChange={(e) =>
                          setQuoteEditForm((p) => ({
                            ...p,
                            adminNotes: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleQuoteEditSave}
                    className="bg-[#134467] hover:bg-[#0d2f4a] text-white"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ── Table ── */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Quotes ({quickQuotes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Drop</TableHead>
                      <TableHead>Date / Time Window</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Job Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price £</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quickQuotes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-center text-muted-foreground py-8"
                        >
                          No quick quotes yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      quickQuotes.map((q: any) => {
                        const statusColors: Record<string, string> = {
                          new: "bg-blue-100 text-blue-800",
                          contacted: "bg-yellow-100 text-yellow-800",
                          quoted: "bg-orange-100 text-orange-800",
                          won: "bg-green-100 text-green-800",
                          lost: "bg-red-100 text-red-800",
                        };
                        return (
                          <TableRow key={q.id}>
                            <TableCell>
                              <p className="font-medium">{q.pickup?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {q.pickup?.postcode}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium">{q.drop?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {q.drop?.postcode}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-xs">
                                <span className="font-semibold">P:</span>{" "}
                                {q.pickup?.date} {q.pickup?.timeFrom}–
                                {q.pickup?.timeTo}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                <span className="font-semibold">D:</span>{" "}
                                {q.drop?.date} @ {q.drop?.time}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="font-medium text-sm">
                                {q.contact?.name ?? "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {q.contact?.email ?? "—"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {q.contact?.phone ?? "—"}
                              </p>
                            </TableCell>

                            <TableCell>{q.distanceMiles} mi</TableCell>
                            <TableCell className="text-sm">
                              {q.suggestedVehicle}
                            </TableCell>
                            <TableCell className="text-sm">
                              {q.jobDescription}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  statusColors[q.status] ??
                                  "bg-gray-100 text-gray-700"
                                }
                              >
                                {q.status ?? "new"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {q.adminPriceQuote != null ? (
                                <span className="font-semibold text-green-700">
                                  £{Number(q.adminPriceQuote).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  —
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              {q.createdAt ? formatDate(q.createdAt) : "—"}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingQuote(q);
                                  setQuoteEditForm({
                                    status: q.status ?? "new",
                                    adminPriceQuote:
                                      q.adminPriceQuote != null
                                        ? String(q.adminPriceQuote)
                                        : "",
                                    adminNotes: q.adminNotes ?? "",
                                  });
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  confirmDelete(
                                    "quickQuote",
                                    q.id,
                                    `${q.pickup?.name} → ${q.drop?.name}`,
                                  )
                                }
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {/* ── Payments ─────────────────────────────────────────────────────── */}
        {currentView === "payments" && (
          <Card>
            <CardHeader>
              <CardTitle>Payments ({payments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Net</TableHead>
                    <TableHead>VAT</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No payments yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p: any) => (
                      <TableRow key={p.id}>
                        <TableCell>{p.name}</TableCell>
                        <TableCell>{p.email}</TableCell>
                        <TableCell>{p.reference}</TableCell>
                        <TableCell>£{Number(p.netAmount).toFixed(2)}</TableCell>
                        <TableCell>£{Number(p.vatAmount).toFixed(2)}</TableCell>
                        <TableCell className="font-bold">
                          £{Number(p.totalAmount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              p.status === "paid" ? "default" : "secondary"
                            }
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {p.createdAt ? formatDate(p.createdAt) : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* ── CMS Tables: Services / Sectors / Locations / Landing Pages / FAQs */}
        {(
          [
            "services",
            "sectors",
            "locations",
            "landingPages",
            "faqs",
          ] as DashboardView[]
        ).map((view) => {
          if (currentView !== view) return null;
          const dataMap: Record<string, any[]> = {
            services,
            sectors,
            locations,
            landingPages,
            faqs,
          };
          const data = dataMap[view];
          const labelMap: Record<string, string> = {
            services: "Service",
            sectors: "Sector",
            locations: "Location",
            landingPages: "Landing Page",
            faqs: "FAQ",
          };
          return (
            <Card key={view}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{labelMap[view]}s CMS</CardTitle>
                  <CardDescription className="mt-1">
                    {view === "services" && "Manage courier service pages"}
                    {view === "sectors" && "Manage industry/sector pages"}
                    {view === "locations" && "Manage city/region pages"}
                    {view === "landingPages" &&
                      "Manage Location × Service SEO landing pages"}
                    {view === "faqs" && "Manage shared FAQ library"}
                  </CardDescription>
                </div>
                <Button onClick={openCreateForm}>+ Add {labelMap[view]}</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {view === "faqs" ? (
                        <>
                          <TableHead>Question</TableHead>
                          <TableHead>ID</TableHead>
                          <TableHead>Tags</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </>
                      ) : view === "landingPages" ? (
                        <>
                          <TableHead>Location Slug</TableHead>
                          <TableHead>Service Slug</TableHead>
                          <TableHead>URL</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </>
                      ) : (
                        <>
                          <TableHead>Name</TableHead>
                          <TableHead>Slug</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No {labelMap[view].toLowerCase()}s found. Click "+ Add{" "}
                          {labelMap[view]}" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.map((item: any) => (
                        <TableRow key={item.id}>
                          {view === "faqs" ? (
                            <TableCell className="max-w-xs truncate">
                              {item.question}
                            </TableCell>
                          ) : view === "landingPages" ? (
                            <>
                              <TableCell>{item.locationSlug}</TableCell>
                              <TableCell>{item.serviceSlug}</TableCell>
                              <TableCell className="font-mono text-xs text-blue-600">
                                /locations/{item.locationSlug}/
                                {item.serviceSlug}
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell className="font-medium">
                                {item.name}
                              </TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground">
                                {item.slug}
                              </TableCell>
                            </>
                          )}
                          {view === "faqs" && (
                            <TableCell>
                              <CopyIdBadge id={item.id} />
                            </TableCell>
                          )}
                          {view === "faqs" && (
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {(item.tags ?? [])
                                  .slice(0, 3)
                                  .map((t: string) => (
                                    <Badge
                                      key={t}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {t}
                                    </Badge>
                                  ))}
                              </div>
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge
                              className={
                                item.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditForm(item)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                confirmDelete(
                                  view === "landingPages"
                                    ? "landingPage"
                                    : view.replace(/s$/, ""),
                                  item.id,
                                  item.name ??
                                    item.question ??
                                    `${item.locationSlug}/${item.serviceSlug}`,
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </main>

      {/* ── Detail View Dialog ───────────────────────────────────────────── */}
      <Dialog
        open={!!selectedApp}
        onOpenChange={(open) => !open && setSelectedApp(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedApp && "companyName" in selectedApp
                ? "Business Registration Details"
                : selectedApp && "mode" in selectedApp
                  ? "Booking Details"
                  : "Driver Application Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedApp && (
            <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
              {/* Business Details */}
              {"companyName" in selectedApp && (
                <>
                  <h3
                    className="text-lg font-extrabold mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Company Information
                  </h3>
                  <DetailRow
                    label="Company Name"
                    value={(selectedApp as BusinessRegistration).companyName}
                  />
                  <DetailRow
                    label="Business Type"
                    value={(selectedApp as BusinessRegistration).businessType}
                  />
                  <DetailRow
                    label="Registration Number"
                    value={
                      (selectedApp as BusinessRegistration)
                        .registrationNumber ?? "Not provided"
                    }
                  />
                  <DetailRow
                    label="VAT Number"
                    value={
                      (selectedApp as BusinessRegistration).vatNumber ??
                      "Not provided"
                    }
                  />
                  <DetailRow
                    label="Company Address"
                    value={(selectedApp as BusinessRegistration).companyAddress}
                  />
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Contact Details
                  </h3>
                  <DetailRow
                    label="Contact Person"
                    value={`${(selectedApp as BusinessRegistration).contactFirstName} ${(selectedApp as BusinessRegistration).contactLastName}`}
                  />
                  <DetailRow
                    label="Job Title"
                    value={(selectedApp as BusinessRegistration).jobTitle}
                  />
                  <DetailRow
                    label="Email"
                    value={(selectedApp as BusinessRegistration).contactEmail}
                  />
                  <DetailRow
                    label="Phone"
                    value={(selectedApp as BusinessRegistration).contactPhone}
                  />
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Shipping Profile
                  </h3>
                  <DetailRow
                    label="Monthly Shipments"
                    value={
                      (selectedApp as BusinessRegistration).monthlyShipments
                    }
                  />
                  <DetailRow
                    label="Parcel Types"
                    value={(selectedApp as BusinessRegistration).parcelTypes}
                  />
                  <DetailRow
                    label="Delivery Areas"
                    value={(selectedApp as BusinessRegistration).deliveryAreas}
                  />
                  <DetailRow
                    label="Special Requirements"
                    value={
                      (selectedApp as BusinessRegistration)
                        .specialRequirements ?? "None"
                    }
                  />
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Billing
                  </h3>
                  <DetailRow
                    label="Billing Method"
                    value={(selectedApp as BusinessRegistration).billingMethod}
                  />
                  <DetailRow
                    label="Billing Email"
                    value={
                      (selectedApp as BusinessRegistration).billingEmail ??
                      "Same as contact"
                    }
                  />
                  <DetailRow
                    label="Terms Accepted"
                    value={
                      (selectedApp as BusinessRegistration).termsAccepted
                        ? "Yes"
                        : "No"
                    }
                  />
                </>
              )}

              {/* Booking Details */}
              {"mode" in selectedApp && (
                <>
                  <h3
                    className="text-lg font-extrabold mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Booking Details
                  </h3>
                  <DetailRow
                    label="Reference"
                    value={(selectedApp as Booking).reference ?? selectedApp.id}
                  />
                  <DetailRow
                    label="Mode"
                    value={(selectedApp as Booking).mode}
                  />
                  <DetailRow
                    label="Status"
                    value={(selectedApp as Booking).status}
                  />
                  <DetailRow
                    label="Date"
                    value={
                      (selectedApp as Booking).createdAt
                        ? formatDate((selectedApp as Booking).createdAt)
                        : "-"
                    }
                  />
                  <DetailRow
                    label="Pickup Address"
                    value={
                      (selectedApp as Booking).delivery?.pickupAddress ?? "-"
                    }
                  />
                  <DetailRow
                    label="Drop-off Address"
                    value={
                      (selectedApp as Booking).delivery?.dropoffAddress ?? "-"
                    }
                  />
                  <DetailRow
                    label="Total incl. VAT"
                    value={
                      (selectedApp as Booking).pricing?.finalPrice
                        ? `£${Number((selectedApp as Booking).pricing.finalPrice).toFixed(2)}`
                        : "-"
                    }
                  />
                </>
              )}

              {/* Driver Details */}
              {!("companyName" in selectedApp) && !("mode" in selectedApp) && (
                <>
                  <h3
                    className="text-lg font-extrabold mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Personal Information
                  </h3>
                  <DetailRow
                    label="Name"
                    value={`${(selectedApp as DriverApplication).firstName} ${(selectedApp as DriverApplication).lastName}`}
                  />
                  <DetailRow
                    label="Date of Birth"
                    value={(selectedApp as DriverApplication).dateOfBirth}
                  />
                  <DetailRow
                    label="DBS Requested"
                    value={
                      (selectedApp as DriverApplication).dbsConfirmed
                        ? "Yes"
                        : "No"
                    }
                  />
                  <DetailRow
                    label="Email"
                    value={(selectedApp as DriverApplication).email}
                  />
                  <DetailRow
                    label="Phone"
                    value={(selectedApp as DriverApplication).phone}
                  />
                  <DetailRow
                    label="Address"
                    value={`${(selectedApp as DriverApplication).addressLine1}${(selectedApp as DriverApplication).addressLine2 ? ", " + (selectedApp as DriverApplication).addressLine2 : ""}`}
                  />
                  <DetailRow
                    label="Town/City"
                    value={(selectedApp as DriverApplication).town}
                  />
                  <DetailRow
                    label="County"
                    value={(selectedApp as DriverApplication).county ?? "-"}
                  />
                  <DetailRow
                    label="Postcode"
                    value={(selectedApp as DriverApplication).postcode}
                  />
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Vehicle & Compliance
                  </h3>
                  <DetailRow
                    label="Vehicle Type"
                    value={(selectedApp as DriverApplication).vehicleType}
                  />
                  <DetailRow
                    label="License Plate"
                    value={(selectedApp as DriverApplication).registration}
                  />
                  <DetailRow
                    label="Make & Model"
                    value={(selectedApp as DriverApplication).makeModel}
                  />
                  <DetailRow
                    label="DVLA Check Code"
                    value={
                      (selectedApp as DriverApplication).dvlaCheckCode ??
                      "Not provided"
                    }
                  />
                  <DetailRow
                    label="Year"
                    value={(selectedApp as DriverApplication).year}
                  />
                  <DetailRow
                    label="NI Number"
                    value={(selectedApp as DriverApplication).niNumber}
                  />
                  <DetailRow
                    label="UTR Number"
                    value={
                      (selectedApp as DriverApplication).utrNumber ??
                      "Not provided"
                    }
                  />
                  <DetailRow
                    label="Right to Work Code"
                    value={(selectedApp as DriverApplication).rightToWorkCode}
                  />
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Documents
                  </h3>
                  {(selectedApp as DriverApplication).drivingLicenseUrl && (
                    <DetailRow
                      label="Driving License"
                      value={
                        <FilePreview
                          url={
                            (selectedApp as DriverApplication)
                              .drivingLicenseUrl!
                          }
                        />
                      }
                    />
                  )}
                  {(selectedApp as DriverApplication).rightToWorkDocUrl && (
                    <DetailRow
                      label="Right to Work"
                      value={
                        <FilePreview
                          url={
                            (selectedApp as DriverApplication)
                              .rightToWorkDocUrl!
                          }
                        />
                      }
                    />
                  )}
                  {(selectedApp as DriverApplication).vehicleInsuranceUrl && (
                    <DetailRow
                      label="Vehicle Insurance (H&R)"
                      value={
                        <FilePreview
                          url={
                            (selectedApp as DriverApplication)
                              .vehicleInsuranceUrl!
                          }
                        />
                      }
                    />
                  )}
                  {(selectedApp as DriverApplication)
                    .publicLiabilityInsuranceUrl && (
                    <DetailRow
                      label="Public Liability Insurance"
                      value={
                        <FilePreview
                          url={
                            (selectedApp as DriverApplication)
                              .publicLiabilityInsuranceUrl!
                          }
                        />
                      }
                    />
                  )}
                  {(selectedApp as DriverApplication)
                    .goodsInTransitInsuranceUrl && (
                    <DetailRow
                      label="Goods In Transit Insurance"
                      value={
                        <FilePreview
                          url={
                            (selectedApp as DriverApplication)
                              .goodsInTransitInsuranceUrl!
                          }
                        />
                      }
                    />
                  )}
                  <h3
                    className="text-lg font-extrabold mt-4 mb-2 uppercase tracking-wide"
                    style={{
                      color: "#48AEDD",
                      borderBottom: "2px solid #F1C40F",
                    }}
                  >
                    Banking
                  </h3>
                  <DetailRow
                    label="Account Name"
                    value={(selectedApp as DriverApplication).accountName}
                  />
                  <DetailRow
                    label="Sort Code"
                    value={(selectedApp as DriverApplication).sortCode}
                  />
                  <DetailRow
                    label="Account Number"
                    value={(selectedApp as DriverApplication).accountNumber}
                  />
                </>
              )}
            </div>
          )}
          <DialogFooter className="gap-2 flex-wrap">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
            {/* Driver approve/reject/delete */}
            {selectedApp &&
              !("companyName" in selectedApp) &&
              !("mode" in selectedApp) && (
                <>
                  {(selectedApp as DriverApplication).status === "pending" && (
                    <>
                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleReject((selectedApp as DriverApplication).id)
                        }
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        variant="outline"
                        className="text-green-600 border-green-600"
                        onClick={() =>
                          handleApprove((selectedApp as DriverApplication).id)
                        }
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() =>
                      confirmDelete(
                        "driver",
                        (selectedApp as DriverApplication).id,
                        `${(selectedApp as DriverApplication).firstName} ${(selectedApp as DriverApplication).lastName}`,
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
            {/* Business approve/reject/delete */}
            {selectedApp && "companyName" in selectedApp && (
              <>
                {(selectedApp as BusinessRegistration).status === "pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleRejectShipper(
                          (selectedApp as BusinessRegistration).id,
                        )
                      }
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-600"
                      onClick={() =>
                        handleApproveShipper(
                          (selectedApp as BusinessRegistration).id,
                        )
                      }
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  </>
                )}
                <Button
                  variant="destructive"
                  onClick={() =>
                    confirmDelete(
                      "business",
                      (selectedApp as BusinessRegistration).id,
                      (selectedApp as BusinessRegistration).companyName,
                    )
                  }
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

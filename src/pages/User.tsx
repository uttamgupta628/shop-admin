import { useState, useMemo } from "react";
import {
  Search, Download, Plus, Pencil, Trash2,
  Eye, ChevronRight, ChevronLeft, 
  Check, X, Users, Crown, ShoppingBag, Heart,
  MapPin, Phone, Mail, Calendar, Package,
 
  Star, Shield, UserCheck, UserX,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
type UserStatus = "vip" | "active" | "new" | "inactive" | "blocked";
type SortKey    = "name" | "email" | "orders" | "spent" | "joined";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  orders: number;
  spent: number;
  wishlist: number;
  status: UserStatus;
  joined: string;
  lastOrder: string;
  avatar: string;
  avatarColor: string;
}

/* ─────────────────────────────────────────────
   Mock data
───────────────────────────────────────────── */
const INIT_CUSTOMERS: Customer[] = [
  { id:"U001", firstName:"Uttam",   lastName:"Gupta",    email:"uttam@gmail.com",     phone:"+91 98765 43210", address:"42, MG Road",        city:"Kolkata",  orders:14, spent:28450, wishlist:8,  status:"vip",      joined:"Jan 2024", lastOrder:"12 Jun 2025", avatar:"UG", avatarColor:"#f97316" },
  { id:"U002", firstName:"Priya",   lastName:"Sharma",   email:"priya@gmail.com",     phone:"+91 91234 56789", address:"18, Park Street",    city:"Kolkata",  orders:7,  spent:12100, wishlist:14, status:"active",   joined:"Mar 2024", lastOrder:"18 Jun 2025", avatar:"PS", avatarColor:"#ec4899" },
  { id:"U003", firstName:"Rahul",   lastName:"Singh",    email:"rahul@gmail.com",     phone:"+91 99876 54321", address:"7, Lake Avenue",     city:"Mumbai",   orders:3,  spent:4800,  wishlist:5,  status:"active",   joined:"May 2024", lastOrder:"20 Jun 2025", avatar:"RS", avatarColor:"#3b82f6" },
  { id:"U004", firstName:"Ananya",  lastName:"Roy",      email:"ananya@gmail.com",    phone:"+91 88765 43210", address:"3, Jodhpur Park",    city:"Kolkata",  orders:22, spent:45200, wishlist:21, status:"vip",      joined:"Nov 2023", lastOrder:"5 Jun 2025",  avatar:"AR", avatarColor:"#8b5cf6" },
  { id:"U005", firstName:"Kiran",   lastName:"Patel",    email:"kiran@gmail.com",     phone:"+91 77654 32109", address:"22, Gariahat",       city:"Ahmedabad",orders:1,  spent:1199,  wishlist:2,  status:"new",      joined:"Jun 2024", lastOrder:"1 Jun 2025",  avatar:"KP", avatarColor:"#10b981" },
  { id:"U006", firstName:"Deepa",   lastName:"Menon",    email:"deepa@gmail.com",     phone:"+91 66543 21098", address:"9, Ballygunge",      city:"Chennai",  orders:5,  spent:8700,  wishlist:9,  status:"active",   joined:"Feb 2024", lastOrder:"28 May 2025", avatar:"DM", avatarColor:"#ef4444" },
  { id:"U007", firstName:"Arjun",   lastName:"Mehta",    email:"arjun@gmail.com",     phone:"+91 55432 10987", address:"15, Salt Lake",      city:"Kolkata",  orders:0,  spent:0,     wishlist:1,  status:"inactive", joined:"Apr 2024", lastOrder:"—",           avatar:"AM", avatarColor:"#6b7280" },
  { id:"U008", firstName:"Sunita",  lastName:"Joshi",    email:"sunita@gmail.com",    phone:"+91 44321 09876", address:"6, Civil Lines",     city:"Delhi",    orders:11, spent:19800, wishlist:16, status:"active",   joined:"Dec 2023", lastOrder:"14 May 2025", avatar:"SJ", avatarColor:"#f59e0b" },
  { id:"U009", firstName:"Vikram",  lastName:"Nair",     email:"vikram@gmail.com",    phone:"+91 33210 98765", address:"25, Bandra West",    city:"Mumbai",   orders:18, spent:36500, wishlist:11, status:"vip",      joined:"Oct 2023", lastOrder:"9 May 2025",  avatar:"VN", avatarColor:"#0ea5e9" },
  { id:"U010", firstName:"Meena",   lastName:"Pillai",   email:"meena@gmail.com",     phone:"+91 22109 87654", address:"11, Koramangala",    city:"Bangalore",orders:2,  spent:3200,  wishlist:7,  status:"new",      joined:"Jun 2024", lastOrder:"2 May 2025",  avatar:"MP", avatarColor:"#d946ef" },
  { id:"U011", firstName:"Rohit",   lastName:"Verma",    email:"rohit@gmail.com",     phone:"+91 11098 76543", address:"30, Hazratganj",     city:"Lucknow",  orders:0,  spent:0,     wishlist:0,  status:"blocked",  joined:"Mar 2024", lastOrder:"—",           avatar:"RV", avatarColor:"#dc2626" },
  { id:"U012", firstName:"Pooja",   lastName:"Agarwal",  email:"pooja@gmail.com",     phone:"+91 90987 65432", address:"4, Connaught Place", city:"Delhi",    orders:9,  spent:15600, wishlist:12, status:"active",   joined:"Jan 2024", lastOrder:"20 Apr 2025", avatar:"PA", avatarColor:"#7c3aed" },
];

const EMPTY_CUSTOMER: Omit<Customer,"id"|"avatar"|"avatarColor"|"orders"|"spent"|"wishlist"> = {
  firstName:"", lastName:"", email:"", phone:"",
  address:"", city:"", status:"new",
  joined: new Date().toLocaleDateString("en-GB",{month:"short",year:"numeric"}),
  lastOrder:"—",
};

const STATUS_CFG: Record<UserStatus, { label:string; color:string; bg:string; border:string; icon:React.ReactNode }> = {
  vip:      { label:"VIP",      color:"#b45309", bg:"#fef3c7", border:"#fde68a", icon:<Crown size={10}/> },
  active:   { label:"Active",   color:"#16a34a", bg:"#dcfce7", border:"#a7f3d0", icon:<UserCheck size={10}/> },
  new:      { label:"New",      color:"#2563eb", bg:"#dbeafe", border:"#bfdbfe", icon:<Star size={10}/> },
  inactive: { label:"Inactive", color:"#6b7280", bg:"#f3f4f6", border:"#e5e7eb", icon:<UserX size={10}/> },
  blocked:  { label:"Blocked",  color:"#dc2626", bg:"#fee2e2", border:"#fca5a5", icon:<Shield size={10}/> },
};

const STATUS_OPTS: UserStatus[] = ["vip","active","new","inactive","blocked"];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

const AVATAR_COLORS = [
  "#f97316","#ec4899","#3b82f6","#8b5cf6","#10b981",
  "#ef4444","#f59e0b","#0ea5e9","#d946ef","#7c3aed",
];

/* ─────────────────────────────────────────────
   Avatar
───────────────────────────────────────────── */
function Avatar({ initials, color, size = 36 }: { initials: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center font-black text-white shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.32,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        boxShadow: `0 2px 8px ${color}44`,
      }}
    >
      {initials}
    </div>
  );
}

/* ─────────────────────────────────────────────
   View / Edit Modal
───────────────────────────────────────────── */
function CustomerModal({
  customer, onSave, onClose, isEdit,
}: {
  customer: Customer | Omit<Customer,"id">;
  onSave: (c: any) => void;
  onClose: () => void;
  isEdit: boolean;
}) {
  const [form, setForm] = useState({ ...customer });

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  const inp = "w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-gray-400";

  const isFullCustomer = (c: any): c is Customer => "id" in c;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg my-6 overflow-hidden"
        style={{ animation: "fadeUp .3s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/6 bg-orange-50/50">
          <div className="flex items-center gap-3">
            {isFullCustomer(form) ? (
              <Avatar initials={form.avatar} color={form.avatarColor} size={36} />
            ) : (
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <Users size={15} className="text-white" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-orange-500 rounded-full" />
                <span className="text-[9px] font-bold tracking-[.2em] uppercase text-orange-500">Customers</span>
              </div>
              <h3 className="font-black text-[#111] text-[14px] leading-tight">
                {isEdit ? `Edit — ${(form as any).firstName} ${(form as any).lastName}` : "Add New Customer"}
              </h3>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer bg-transparent border-none transition-all">
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">First Name *</label>
              <input className={inp} placeholder="Uttam" value={(form as any).firstName} onChange={set("firstName")} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Last Name *</label>
              <input className={inp} placeholder="Gupta" value={(form as any).lastName} onChange={set("lastName")} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email *</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className={inp + " pl-9"} type="email" placeholder="email@example.com"
                value={(form as any).email} onChange={set("email")} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
            <div className="relative">
              <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input className={inp + " pl-9"} placeholder="+91 XXXXX XXXXX"
                value={(form as any).phone} onChange={set("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
              <input className={inp} placeholder="Street / Colony" value={(form as any).address} onChange={set("address")} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">City</label>
              <input className={inp} placeholder="City" value={(form as any).city} onChange={set("city")} />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <div className="grid grid-cols-5 gap-2">
              {STATUS_OPTS.map(s => {
                const cfg = STATUS_CFG[s];
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, status: s }))}
                    className="py-2 rounded-xl text-[9px] font-black uppercase transition-all cursor-pointer border-2"
                    style={{
                      borderColor: (form as any).status === s ? cfg.color : "#e5e7eb",
                      background: (form as any).status === s ? cfg.bg : "#fff",
                      color: (form as any).status === s ? cfg.color : "#9ca3af",
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-black/6 bg-gray-50/50">
          <button onClick={onClose}
            className="px-6 py-2.5 text-[12px] font-bold text-gray-500 border border-black/10 rounded-2xl cursor-pointer bg-white hover:border-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            className="px-7 py-2.5 text-[12px] font-bold text-white bg-orange-500 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)] flex items-center gap-2">
            <Check size={13} />
            {isEdit ? "Update Customer" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Detail / View Drawer
───────────────────────────────────────────── */
function CustomerDrawer({ customer, onClose, onEdit }: { customer: Customer; onClose: () => void; onEdit: () => void }) {
  const cfg = STATUS_CFG[customer.status];

  const stats = [
    { icon:<Package size={15}/>,     color:"#f97316", bg:"#fff7f0", label:"Orders",  value: customer.orders },
    { icon:<ShoppingBag size={15}/>, color:"#3b82f6", bg:"#eff6ff", label:"Spent",   value: fmt(customer.spent) },
    { icon:<Heart size={15}/>,       color:"#ec4899", bg:"#fdf2f8", label:"Wishlist",value: customer.orders },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-end"
      style={{ background:"rgba(0,0,0,.4)", backdropFilter:"blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white h-full w-full max-w-sm shadow-2xl flex flex-col overflow-y-auto"
        style={{ animation:"slideIn .35s cubic-bezier(.16,1,.3,1)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer header */}
        <div className="relative bg-gradient-to-br from-[#111] to-[#2a1500] p-6 shrink-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.1) 1px,transparent 1px)", backgroundSize:"18px 18px" }}/>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(249,115,22,.2) 0%,transparent 70%)" }}/>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[9px] font-bold tracking-[.22em] uppercase text-orange-400">Customer Profile</span>
              <button onClick={onClose}
                className="w-7 h-7 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer bg-transparent border-none transition-all">
                <X size={14}/>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar initials={customer.avatar} color={customer.avatarColor} size={52} />
              <div>
                <h3 className="font-black text-white text-[16px] leading-tight">
                  {customer.firstName} {customer.lastName}
                </h3>
                <p className="text-white/50 text-[11px] mt-0.5">{customer.email}</p>
                <span
                  className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full mt-1.5"
                  style={{ color: cfg.color, background: cfg.bg }}
                >
                  {cfg.icon}{cfg.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-0 border-b border-black/6">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center justify-center py-4 border-r border-black/5 last:border-0">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5" style={{ background:s.bg, color:s.color }}>{s.icon}</div>
              <p className="font-black text-[#111] text-[13px] leading-none">{s.value}</p>
              <p className="text-[9px] text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info list */}
        <div className="flex-1 p-5 space-y-4">
          <div>
            <p className="text-[9px] font-black tracking-[.2em] uppercase text-gray-400 mb-3">Contact Info</p>
            <div className="space-y-3">
              {[
                { icon:<Mail size={13}/>,    color:"#f97316", label:"Email",   value:customer.email },
                { icon:<Phone size={13}/>,   color:"#3b82f6", label:"Phone",   value:customer.phone },
                { icon:<MapPin size={13}/>,  color:"#8b5cf6", label:"Address", value:`${customer.address}, ${customer.city}` },
              ].map(row => (
                <div key={row.label} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background:`${row.color}15`, color:row.color }}>
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">{row.label}</p>
                    <p className="text-[12px] text-[#111] font-semibold">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px" style={{ background:"repeating-linear-gradient(90deg,#f0f0f0 0,#f0f0f0 5px,transparent 5px,transparent 10px)" }}/>

          <div>
            <p className="text-[9px] font-black tracking-[.2em] uppercase text-gray-400 mb-3">Order Info</p>
            <div className="space-y-2.5">
              {[
                { label:"Member Since",  value:customer.joined    },
                { label:"Last Order",    value:customer.lastOrder },
                { label:"Customer ID",   value:customer.id        },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{row.label}</span>
                  <span className="text-[12px] font-bold text-[#111]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer footer */}
        <div className="shrink-0 p-4 border-t border-black/6 flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-orange-500 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(249,115,22,.35)]"
          >
            <Pencil size={13}/>Edit Customer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Delete modal
───────────────────────────────────────────── */
function DeleteModal({ name, onConfirm, onClose }: { name:string; onConfirm:()=>void; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        style={{ animation:"fadeUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500"/>
        </div>
        <h3 className="font-black text-[#111] text-[16px] mb-2">Remove Customer?</h3>
        <p className="text-[12px] text-gray-400 mb-6">
          Remove <strong className="text-[#111]">"{name}"</strong> from your customer list? Their order history will still be preserved.
        </p>
        <div className="flex gap-2.5 justify-center">
          <button onClick={onClose}
            className="px-6 py-2.5 text-[12px] font-bold text-gray-500 border border-black/10 rounded-2xl cursor-pointer bg-white hover:border-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-6 py-2.5 text-[12px] font-bold text-white bg-red-500 rounded-2xl cursor-pointer border-none hover:bg-red-600 transition-all flex items-center gap-2">
            <Trash2 size={13}/>Remove
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Users / Customers Page
───────────────────────────────────────────── */
const PAGE_SIZE = 8;

export default function UsersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INIT_CUSTOMERS);
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | UserStatus>("All");
  const [sortKey,   setSortKey]   = useState<SortKey>("orders");
  const [sortAsc,   setSortAsc]   = useState(false);
  const [page,      setPage]      = useState(1);
  const [modal,     setModal]     = useState<"add" | "edit" | null>(null);
  const [editUser,  setEditUser]  = useState<Customer | null>(null);
  const [viewUser,  setViewUser]  = useState<Customer | null>(null);
  const [delUser,   setDelUser]   = useState<Customer | null>(null);
  const [toast,     setToast]     = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  /* filter + sort */
  const filtered = useMemo(() => {
    let c = [...customers];
    if (search.trim())            c = c.filter(x =>
      `${x.firstName} ${x.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      x.email.toLowerCase().includes(search.toLowerCase()) ||
      x.city.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "All")   c = c.filter(x => x.status === statusFilter);
    c.sort((a, b) => {
      let A: any, B: any;
      switch (sortKey) {
        case "name":   A = `${a.firstName} ${a.lastName}`; B = `${b.firstName} ${b.lastName}`; break;
        case "email":  A = a.email; B = b.email; break;
        case "orders": A = a.orders; B = b.orders; break;
        case "spent":  A = a.spent;  B = b.spent;  break;
        case "joined": A = a.joined; B = b.joined; break;
      }
      return typeof A === "string"
        ? sortAsc ? A.localeCompare(B) : B.localeCompare(A)
        : sortAsc ? A - B : B - A;
    });
    return c;
  }, [customers, search, statusFilter, sortKey, sortAsc]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const sort = (k: SortKey) => {
    if (sortKey === k) setSortAsc(a => !a);
    else { setSortKey(k); setSortAsc(k === "orders" || k === "spent" ? false : true); }
    setPage(1);
  };

  /* CRUD */
  const handleAdd = (form: any) => {
    const initials = (form.firstName[0] || "U") + (form.lastName[0] || "U");
    const color    = AVATAR_COLORS[customers.length % AVATAR_COLORS.length];
    setCustomers(c => [...c, {
      ...form,
      id: "U" + String(customers.length + 1).padStart(3,"0"),
      avatar: initials.toUpperCase(),
      avatarColor: color,
      orders: 0, spent: 0, wishlist: 0,
    }]);
    setModal(null); showToast("Customer added!");
  };

  const handleEdit = (form: any) => {
    setCustomers(c => c.map(x => x.id === editUser!.id ? { ...x, ...form } : x));
    setModal(null); setEditUser(null); setViewUser(null);
    showToast("Customer updated!");
  };

  const handleDelete = () => {
    setCustomers(c => c.filter(x => x.id !== delUser!.id));
    setDelUser(null); setViewUser(null);
    showToast("Customer removed.");
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    sortKey === k
      ? <span className="text-orange-500 ml-0.5">{sortAsc ? "↑" : "↓"}</span>
      : <span className="text-gray-300 ml-0.5">↕</span>
  );

  /* summary stats */
  const totalSpend = customers.reduce((a, c) => a + c.spent, 0);
  const vipCount   = customers.filter(c => c.status === "vip").length;
  const newCount   = customers.filter(c => c.status === "new").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes dotDrift { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes toastIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes slideIn  { from{transform:translateX(100%)} to{transform:translateX(0)} }
      `}</style>

      <div className="min-h-screen bg-[#f8f8f8] relative" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* dot grid */}
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.04) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 20s linear infinite" }}/>

        <div className="relative z-10 p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

          {/* ── HEADER ── */}
          <div className="flex items-center justify-between flex-wrap gap-3"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-0.5 bg-orange-500 rounded-full"/>
                <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">Store</span>
              </div>
              <h1 className="font-black text-[#111] leading-tight tracking-tight" style={{ fontSize:"clamp(1.4rem,2.5vw,1.9rem)" }}>
                Customers
              </h1>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {customers.length} total · {vipCount} VIP · {newCount} new this month
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-white border border-black/8 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-300 hover:text-orange-500 transition-all">
                <Download size={13}/>Export
              </button>
              <button
                onClick={() => setModal("add")}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-orange-500 px-5 py-2.5 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]">
                <Plus size={14}/>Add Customer
              </button>
            </div>
          </div>

          {/* ── STAT CHIPS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .07s both" }}>
            {[
              { label:"Total Customers", value:customers.length,                                          color:"#f97316", bg:"#fff7f0", border:"#fed7aa" },
              { label:"VIP Members",     value:vipCount,                                                   color:"#b45309", bg:"#fef3c7", border:"#fde68a" },
              { label:"Active",          value:customers.filter(c=>c.status==="active").length,            color:"#16a34a", bg:"#dcfce7", border:"#a7f3d0" },
              { label:"Total Revenue",   value:fmt(totalSpend),                                            color:"#8b5cf6", bg:"#f5f3ff", border:"#ddd6fe" },
            ].map(s => (
              <div key={s.label}
                className="bg-white border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all"
                style={{ borderColor:s.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                  style={{ background:s.bg, color:s.color }}>
                  {s.value}
                </div>
                <p className="text-[11px] font-semibold text-gray-500 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── TOOLBAR ── */}
          <div className="bg-white border border-black/8 rounded-2xl p-4 flex items-center gap-3 flex-wrap"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .14s both" }}>
            {/* Search */}
            <div className="relative min-w-[200px] flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"/>
              <input
                value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search name, email, city…"
                className="w-full pl-8 pr-4 py-2.5 text-[12px] bg-gray-50 border border-black/8 rounded-2xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all text-[#111]"
                style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
            </div>

            {/* Status filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {(["All", ...STATUS_OPTS] as const).map(s => {
                const isAll = s === "All";
                const cfg   = isAll ? null : STATUS_CFG[s as UserStatus];
                return (
                  <button key={s}
                    onClick={() => { setStatusFilter(s as any); setPage(1); }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-2 rounded-2xl border cursor-pointer transition-all"
                    style={{
                      background: statusFilter === s ? (isAll ? "#f97316" : cfg!.bg) : "#fff",
                      borderColor: statusFilter === s ? (isAll ? "#f97316" : cfg!.color) : "rgba(0,0,0,.08)",
                      color: statusFilter === s ? (isAll ? "#fff" : cfg!.color) : "#9ca3af",
                    }}>
                    {!isAll && cfg!.icon}
                    {isAll ? "All" : cfg!.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TABLE ── */}
          <div className="bg-white border border-black/8 rounded-2xl overflow-hidden"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .2s both" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 bg-gray-50/70">
                    {[
                      { label:"Customer",  k:"name"   as SortKey, w:"" },
                      { label:"Contact",   k:null,                 w:"" },
                      { label:"Location",  k:null,                 w:"" },
                      { label:"Orders",    k:"orders" as SortKey, w:"" },
                      { label:"Total Spent",k:"spent" as SortKey, w:"" },
                      { label:"Joined",    k:"joined" as SortKey, w:"" },
                      { label:"Status",    k:null,                 w:"" },
                      { label:"Actions",   k:null,                 w:"" },
                    ].map(h => (
                      <th key={h.label}
                        className={`px-4 py-3.5 text-[9px] font-black tracking-[.18em] uppercase text-gray-400 whitespace-nowrap ${h.k ? "cursor-pointer hover:text-orange-500 select-none transition-colors" : ""}`}
                        onClick={() => h.k && sort(h.k)}>
                        {h.label}{h.k && <SortIcon k={h.k} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16">
                        <div className="text-3xl mb-3">👥</div>
                        <p className="font-bold text-[#111] mb-1">No customers found</p>
                        <p className="text-[12px] text-gray-400">Try a different search or filter</p>
                      </td>
                    </tr>
                  ) : paginated.map((c, i) => {
                    const cfg = STATUS_CFG[c.status];
                    return (
                      <tr key={c.id}
                        className="border-b border-black/4 last:border-0 hover:bg-orange-50/30 transition-colors group"
                        style={{ animation:`fadeUp .4s cubic-bezier(.16,1,.3,1) ${i*0.045}s both` }}>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar initials={c.avatar} color={c.avatarColor} size={36} />
                            <div>
                              <p className="font-bold text-[12px] text-[#111] whitespace-nowrap">
                                {c.firstName} {c.lastName}
                              </p>
                              <p className="text-[9px] text-orange-500 font-bold">{c.id}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-4 py-3.5">
                          <p className="text-[11px] text-[#111] font-medium whitespace-nowrap">{c.email}</p>
                          <p className="text-[10px] text-gray-400">{c.phone}</p>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-orange-400 shrink-0"/>
                            <span className="text-[12px] text-[#111] font-medium">{c.city}</span>
                          </div>
                          <p className="text-[10px] text-gray-400 pl-[19px] truncate max-w-[120px]">{c.address}</p>
                        </td>

                        {/* Orders */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-[12px] font-black ${c.orders === 0 ? "text-gray-300" : "text-[#111]"}`}>{c.orders}</span>
                          <p className="text-[9px] text-gray-300">orders</p>
                        </td>

                        {/* Spent */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className={`text-[12px] font-black ${c.spent === 0 ? "text-gray-300" : "text-orange-500"}`}>{fmt(c.spent)}</span>
                          <p className="text-[9px] text-gray-300">lifetime</p>
                        </td>

                        {/* Joined */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-gray-300 shrink-0"/>
                            <span className="text-[11px] text-gray-500">{c.joined}</span>
                          </div>
                          <p className="text-[9px] text-gray-300 pl-[19px]">Last: {c.lastOrder}</p>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-1 rounded-full"
                            style={{ color:cfg.color, background:cfg.bg, border:`1px solid ${cfg.border}` }}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setViewUser(c)}
                              className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500 cursor-pointer bg-transparent transition-all"
                              title="View">
                              <Eye size={12}/>
                            </button>
                            <button
                              onClick={() => { setEditUser(c); setModal("edit"); }}
                              className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 cursor-pointer bg-transparent transition-all"
                              title="Edit">
                              <Pencil size={12}/>
                            </button>
                            <button
                              onClick={() => setDelUser(c)}
                              className="w-7 h-7 rounded-xl border border-black/8 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 cursor-pointer bg-transparent transition-all"
                              title="Delete">
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-black/5 bg-gray-50/40 flex-wrap gap-2">
              <span className="text-[11px] text-gray-400">
                Showing <strong className="text-[#111]">{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong className="text-orange-500">{filtered.length}</strong> customers
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="w-8 h-8 rounded-xl border border-black/8 flex items-center justify-center text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white transition-all">
                  <ChevronLeft size={14}/>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold transition-all cursor-pointer border
                      ${page===n ? "bg-orange-500 border-orange-500 text-white shadow-[0_3px_10px_rgba(249,115,22,.3)]" : "bg-white border-black/8 text-gray-500 hover:border-orange-300 hover:text-orange-500"}`}>
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages}
                  className="w-8 h-8 rounded-xl border border-black/8 flex items-center justify-center text-gray-500 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white transition-all">
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal === "add" && (
        <CustomerModal
          customer={EMPTY_CUSTOMER as any}
          onSave={handleAdd}
          onClose={() => setModal(null)}
          isEdit={false}
        />
      )}
      {modal === "edit" && editUser && (
        <CustomerModal
          customer={editUser}
          onSave={handleEdit}
          onClose={() => { setModal(null); setEditUser(null); }}
          isEdit={true}
        />
      )}
      {viewUser && (
        <CustomerDrawer
          customer={viewUser}
          onClose={() => setViewUser(null)}
          onEdit={() => { setEditUser(viewUser); setModal("edit"); setViewUser(null); }}
        />
      )}
      {delUser && (
        <DeleteModal
          name={`${delUser.firstName} ${delUser.lastName}`}
          onConfirm={handleDelete}
          onClose={() => setDelUser(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111] text-white text-[12px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ animation:"toastIn .35s cubic-bezier(.16,1,.3,1)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          <Check size={13} className="text-orange-400"/>
          {toast}
        </div>
      )}
    </>
  );
}
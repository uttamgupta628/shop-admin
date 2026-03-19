import { useState, useMemo } from "react";
import {
  Search, Download, Eye, ChevronRight, ChevronLeft,
  Check, X, Truck, Clock, RotateCcw, Package,
  MapPin, Phone, Mail, Calendar,
  ChevronDown, RefreshCw, Printer,
  CheckCircle, XCircle
} from "lucide-react";

type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled" | "returned";
type SortKey     = "id" | "customer" | "amount" | "date" | "status";

interface OrderItem {
  name: string; brand: string; img: string;
  size: string; color: string; qty: number; price: number; orig: number;
}
interface Order {
  id: string; customer: string; avatar: string; avatarColor: string;
  email: string; phone: string; address: string; city: string;
  items: OrderItem[]; amount: number; shipping: number; tax: number; discount: number;
  status: OrderStatus; date: string; deliveredOn?: string; tracking?: string; payMethod: string;
}

/* ── All avatar colours → orange shades ── */
const INIT_ORDERS: Order[] = [
  { id:"ORD-001", customer:"Uttam Gupta",  avatar:"UG", avatarColor:"#f97316",
    email:"uttam@gmail.com",   phone:"+91 98765 43210", address:"42, MG Road, Kolkata 700001",       city:"Kolkata",
    items:[{ name:"Premium Wool Blazer",      brand:"Manyavar",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",       size:"L",  color:"Charcoal",   qty:1, price:3499, orig:5999 }],
    amount:3499, shipping:0,  tax:175, discount:0,   status:"delivered",  date:"12 Jun 2025", deliveredOn:"15 Jun 2025", tracking:"TRK9284756", payMethod:"Visa •4242" },

  { id:"ORD-002", customer:"Priya Sharma", avatar:"PS", avatarColor:"#ea580c",
    email:"priya@gmail.com",   phone:"+91 91234 56789", address:"18, Park Street, Kolkata 700016",   city:"Kolkata",
    items:[{ name:"Embroidered Anarkali",      brand:"Biba",        img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp", size:"M",  color:"Pink",       qty:1, price:2150, orig:3200 }],
    amount:2150, shipping:0,  tax:107, discount:0,   status:"shipped",    date:"18 Jun 2025", tracking:"TRK8837621",     payMethod:"GPay UPI" },

  { id:"ORD-003", customer:"Rahul Singh",  avatar:"RS", avatarColor:"#fb923c",
    email:"rahul@gmail.com",   phone:"+91 99876 54321", address:"7, Lake Avenue, Kolkata 700026",    city:"Kolkata",
    items:[{ name:"Classic White Tee",         brand:"FabIndia",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg",                                  size:"XL", color:"White",      qty:2, price:399,  orig:699  }],
    amount:798,  shipping:99, tax:40,  discount:0,   status:"processing", date:"20 Jun 2025", payMethod:"Mastercard •5353" },

  { id:"ORD-004", customer:"Ananya Roy",   avatar:"AR", avatarColor:"#fdba74",
    email:"ananya@gmail.com",  phone:"+91 88765 43210", address:"3, Jodhpur Park, Kolkata 700068",   city:"Kolkata",
    items:[{ name:"Palazzo Sharara Set",       brand:"W for Woman", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp", size:"S", color:"Red",       qty:1, price:1799, orig:2499 }],
    amount:1799, shipping:0,  tax:90,  discount:200, status:"cancelled",  date:"5 Jun 2025",  payMethod:"Paytm Wallet" },

  { id:"ORD-005", customer:"Kiran Patel",  avatar:"KP", avatarColor:"#f97316",
    email:"kiran@gmail.com",   phone:"+91 77654 32109", address:"22, Gariahat, Kolkata 700029",      city:"Kolkata",
    items:[{ name:"Slim Straight Jeans",       brand:"Levis",       img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295972/images_24_dv4pnt.jpg",                                  size:"32", color:"Dark Blue",  qty:1, price:1199, orig:1999 }],
    amount:1199, shipping:0,  tax:60,  discount:0,   status:"delivered",  date:"1 Jun 2025",  deliveredOn:"4 Jun 2025", tracking:"TRK7723411", payMethod:"COD" },

  { id:"ORD-006", customer:"Deepa Menon",  avatar:"DM", avatarColor:"#ea580c",
    email:"deepa@gmail.com",   phone:"+91 66543 21098", address:"9, Ballygunge, Kolkata 700019",     city:"Kolkata",
    items:[{ name:"Kids Dungaree Playsuit",    brand:"H&M Kids",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg",                                  size:"6Y", color:"Blue",       qty:2, price:599,  orig:899  }],
    amount:1198, shipping:0,  tax:60,  discount:0,   status:"returned",   date:"28 May 2025", payMethod:"PhonePe UPI" },

  { id:"ORD-007", customer:"Arjun Mehta",  avatar:"AM", avatarColor:"#fb923c",
    email:"arjun@gmail.com",   phone:"+91 55432 10987", address:"15, Salt Lake, Kolkata 700091",     city:"Kolkata",
    items:[
      { name:"Bandhgala Nehru Jacket",         brand:"Manyavar",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp",   size:"M",  color:"Navy",       qty:1, price:3299, orig:4999 },
      { name:"Tropical Rayon Shirt",           brand:"Manyavar",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296337/gemini-generated-image-hisdushisdushisd-1-500x500_z8jlod.webp", size:"M", color:"Multicolor", qty:1, price:749, orig:1100 },
    ],
    amount:4048, shipping:0,  tax:202, discount:300, status:"shipped",    date:"25 May 2025", tracking:"TRK6612890",     payMethod:"HDFC NetBanking" },

  { id:"ORD-008", customer:"Sunita Joshi", avatar:"SJ", avatarColor:"#fdba74",
    email:"sunita@gmail.com",  phone:"+91 44321 09876", address:"6, Civil Lines, Delhi 110054",      city:"Delhi",
    items:[{ name:"Cotton Blend Co-ord Set",   brand:"Aurelia",     img:"https://res.cloudinary.com/dquki4xol/image/upload/v1771325461/pngtree-trendy-summer-party-dress-model-girl-in-fashionable-attire-png-image_13211648_ys2ype.png", size:"S", color:"Peach",     qty:1, price:1299, orig:1899 }],
    amount:1299, shipping:0,  tax:65,  discount:0,   status:"delivered",  date:"14 May 2025", deliveredOn:"17 May 2025", tracking:"TRK5501234", payMethod:"Amazon Pay" },

  { id:"ORD-009", customer:"Vikram Nair",  avatar:"VN", avatarColor:"#f97316",
    email:"vikram@gmail.com",  phone:"+91 33210 98765", address:"25, Bandra West, Mumbai 400050",    city:"Mumbai",
    items:[{ name:"Wedding Lehenga Set",       brand:"Biba",        img:"https://res.cloudinary.com/dquki4xol/image/upload/v1771325307/images_11_xlytvq.jpg",                                   size:"S",  color:"Red & Gold", qty:1, price:4999, orig:7999 }],
    amount:4999, shipping:0,  tax:250, discount:500, status:"processing", date:"9 May 2025",  payMethod:"Visa •8181" },

  { id:"ORD-010", customer:"Meena Pillai", avatar:"MP", avatarColor:"#ea580c",
    email:"meena@gmail.com",   phone:"+91 22109 87654", address:"11, Koramangala, Bangalore 560034", city:"Bangalore",
    items:[
      { name:"Palazzo Sharara Set",            brand:"W for Woman", img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp", size:"M", color:"Yellow",    qty:1, price:1799, orig:2499 },
      { name:"Classic White Tee",              brand:"FabIndia",    img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295971/images_25_akc1zl.jpg",                                  size:"S",  color:"White",      qty:1, price:399,  orig:699  },
    ],
    amount:2198, shipping:99, tax:115, discount:0,   status:"delivered",  date:"2 May 2025",  deliveredOn:"5 May 2025",  tracking:"TRK4490011", payMethod:"GPay UPI" },
];

/* ── All status badges → orange family ── */
const STATUS_CFG: Record<OrderStatus,{ label:string; color:string; bg:string; border:string; icon:React.ReactNode }> = {
  delivered:  { label:"Delivered",  color:"#c2410c", bg:"#fff7ed", border:"#fed7aa", icon:<CheckCircle size={10}/> },
  shipped:    { label:"Shipped",    color:"#ea580c", bg:"#ffedd5", border:"#fdba74", icon:<Truck size={10}/> },
  processing: { label:"Processing", color:"#d97706", bg:"#fef3c7", border:"#fde68a", icon:<Clock size={10}/> },
  cancelled:  { label:"Cancelled",  color:"#dc2626", bg:"#fee2e2", border:"#fca5a5", icon:<XCircle size={10}/> },
  returned:   { label:"Returned",   color:"#9a3412", bg:"#fff4ee", border:"#fed7aa", icon:<RotateCcw size={10}/> },
};

const ALL_STATUSES: OrderStatus[] = ["delivered","shipped","processing","cancelled","returned"];
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ── Avatar ── */
function Avatar({ initials, color, size=34 }: { initials:string; color:string; size?:number }) {
  return (
    <div className="rounded-xl flex items-center justify-center font-black text-white shrink-0"
      style={{ width:size, height:size, fontSize:size*0.32,
        background:`linear-gradient(135deg,${color},${color}cc)`,
        boxShadow:`0 2px 8px ${color}44` }}>
      {initials}
    </div>
  );
}

/* ── Status dropdown ── */
function StatusDropdown({ current, onChange }: { current:OrderStatus; onChange:(s:OrderStatus)=>void }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CFG[current];
  return (
    <div className="relative">
      <button onClick={e=>{ e.stopPropagation(); setOpen(o=>!o); }}
        className="inline-flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full cursor-pointer border transition-all hover:opacity-80"
        style={{ color:cfg.color, background:cfg.bg, borderColor:cfg.border }}>
        {cfg.icon}{cfg.label}
        <ChevronDown size={8} className={`transition-transform ${open?"rotate-180":""}`}/>
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-orange-100 rounded-2xl shadow-xl overflow-hidden w-40"
          style={{ animation:"fadeUp .2s cubic-bezier(.16,1,.3,1)" }}>
          {ALL_STATUSES.map(s=>{
            const c=STATUS_CFG[s];
            return (
              <button key={s} onClick={e=>{ e.stopPropagation(); onChange(s); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-[11px] font-bold hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer bg-transparent border-none text-left"
                style={{ color:s===current?c.color:"#374151" }}>
                <span style={{ color:c.color }}>{c.icon}</span>{c.label}
                {s===current && <Check size={10} className="ml-auto text-orange-500"/>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Order detail drawer — all icons orange ── */
function OrderDrawer({ order, onClose, onStatusChange }:{
  order:Order; onClose:()=>void; onStatusChange:(id:string,s:OrderStatus)=>void;
}) {
  const itemsTotal = order.items.reduce((a,i)=>a+i.price*i.qty,0);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end"
      style={{ background:"rgba(0,0,0,.45)", backdropFilter:"blur(4px)" }}
      onClick={onClose}>
      <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col overflow-hidden"
        style={{ animation:"slideIn .35s cubic-bezier(.16,1,.3,1)" }}
        onClick={e=>e.stopPropagation()}>

        {/* Drawer header — dark with orange accents */}
        <div className="relative bg-gradient-to-br from-[#111] to-[#2a1500] p-6 shrink-0 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.1) 1px,transparent 1px)", backgroundSize:"18px 18px" }}/>
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
            style={{ background:"radial-gradient(circle,rgba(249,115,22,.2) 0%,transparent 70%)" }}/>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[9px] font-bold tracking-[.22em] uppercase text-orange-400">Order Details</span>
                <p className="font-black text-white text-[16px] leading-tight">{order.id}</p>
              </div>
              <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 cursor-pointer bg-transparent border-none transition-all">
                <X size={14}/>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar initials={order.avatar} color={order.avatarColor} size={38}/>
                <div>
                  <p className="font-bold text-white text-[13px]">{order.customer}</p>
                  <p className="text-white/50 text-[10px]">{order.date}</p>
                </div>
              </div>
              <StatusDropdown current={order.status} onChange={s=>onStatusChange(order.id,s)}/>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Items */}
          <div className="p-5 border-b border-orange-50">
            <p className="text-[9px] font-black tracking-[.2em] uppercase text-orange-400 mb-3">Items ({order.items.length})</p>
            <div className="space-y-3">
              {order.items.map((item,i)=>(
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-orange-100" style={{ background:"#fff4ee" }}>
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[12px] text-[#111] truncate">{item.name}</p>
                    <p className="text-[10px] text-orange-300">{item.brand} · {item.size} · {item.color}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] font-black text-orange-500">{fmt(item.price)}</span>
                      <span className="text-[10px] text-orange-400 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded-full">×{item.qty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-5 border-b border-orange-50">
            <p className="text-[9px] font-black tracking-[.2em] uppercase text-orange-400 mb-3">Price Breakdown</p>
            <div className="space-y-2">
              {[
                { label:"Subtotal", value:fmt(itemsTotal) },
                { label:"Shipping", value:order.shipping===0?"FREE":fmt(order.shipping), green:order.shipping===0 },
                { label:"Tax (5%)", value:fmt(order.tax) },
                ...(order.discount>0?[{ label:"Discount", value:`−${fmt(order.discount)}`, green:true }]:[]),
              ].map(r=>(
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-500">{r.label}</span>
                  <span className={`text-[11px] font-semibold ${(r as any).green?"text-green-600":"text-[#111]"}`}>{r.value}</span>
                </div>
              ))}
              <div className="h-px my-1" style={{ background:"repeating-linear-gradient(90deg,#fff0e6 0,#fff0e6 5px,transparent 5px,transparent 10px)" }}/>
              <div className="flex items-center justify-between">
                <span className="font-black text-[#111] text-[13px]">Total</span>
                <span className="font-black text-orange-500 text-[16px]">{fmt(order.amount)}</span>
              </div>
              <p className="text-right text-[10px] text-orange-300">{order.payMethod}</p>
            </div>
          </div>

          {/* Delivery + Contact — all icons orange */}
          <div className="p-5 border-b border-orange-50 space-y-4">
            <div>
              <p className="text-[9px] font-black tracking-[.2em] uppercase text-orange-400 mb-3">Delivery Info</p>
              <div className="space-y-2.5">
                {[
                  { icon:<MapPin size={12}/>,      color:"#f97316", label:"Ship to",   value:order.address },
                  ...(order.tracking?[{ icon:<Package size={12}/>,       color:"#fb923c", label:"Tracking",  value:order.tracking }]:[]),
                  ...(order.deliveredOn?[{ icon:<CheckCircle size={12}/>, color:"#ea580c", label:"Delivered", value:order.deliveredOn }]:[]),
                ].map(row=>(
                  <div key={row.label} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:`${row.color}18`, color:row.color }}>
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-[9px] text-orange-300 font-semibold uppercase tracking-wide">{row.label}</p>
                      <p className="text-[12px] text-[#111] font-semibold">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black tracking-[.2em] uppercase text-orange-400 mb-3">Customer Contact</p>
              <div className="space-y-2">
                {[
                  { icon:<Mail size={12}/>,  color:"#f97316", value:order.email },
                  { icon:<Phone size={12}/>, color:"#fb923c", value:order.phone },
                ].map((row,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background:`${row.color}18`, color:row.color }}>
                      {row.icon}
                    </div>
                    <span className="text-[12px] text-[#111] font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 p-4 border-t border-orange-50 flex gap-2">
          <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-orange-500 bg-white border border-orange-200 rounded-2xl cursor-pointer hover:bg-orange-50 transition-colors">
            <Printer size={13}/>Print Invoice
          </button>
          <button className="flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-white bg-orange-500 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(249,115,22,.35)]">
            <Truck size={13}/>Track Shipment
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 7;

export default function OrdersPage() {
  const [orders,       setOrders]       = useState<Order[]>(INIT_ORDERS);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState<"All"|OrderStatus>("All");
  const [sortKey,      setSortKey]      = useState<SortKey>("date");
  const [sortAsc,      setSortAsc]      = useState(false);
  const [page,         setPage]         = useState(1);
  const [viewOrder,    setViewOrder]    = useState<Order|null>(null);
  const [toast,        setToast]        = useState<string|null>(null);

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(null),2500); };

  const handleStatusChange = (id:string, status:OrderStatus) => {
    setOrders(o=>o.map(x=>x.id===id?{...x,status}:x));
    if (viewOrder?.id===id) setViewOrder(v=>v?{...v,status}:v);
    showToast(`Order ${id} → ${STATUS_CFG[status].label}`);
  };

  const filtered = useMemo(()=>{
    let o=[...orders];
    if (search.trim()) o=o.filter(x=>
      x.id.toLowerCase().includes(search.toLowerCase())||
      x.customer.toLowerCase().includes(search.toLowerCase())||
      x.city.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter!=="All") o=o.filter(x=>x.status===statusFilter);
    o.sort((a,b)=>{
      let A:any,B:any;
      switch(sortKey){
        case "id":       A=a.id;        B=b.id;        break;
        case "customer": A=a.customer;  B=b.customer;  break;
        case "amount":   A=a.amount;    B=b.amount;    break;
        case "date":     A=a.date;      B=b.date;      break;
        case "status":   A=a.status;    B=b.status;    break;
      }
      return typeof A==="number"?(sortAsc?A-B:B-A):(sortAsc?A.localeCompare(B):B.localeCompare(A));
    });
    return o;
  },[orders,search,statusFilter,sortKey,sortAsc]);

  const totalPages = Math.ceil(filtered.length/PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);

  const sort=(k:SortKey)=>{
    if(sortKey===k) setSortAsc(a=>!a);
    else{ setSortKey(k); setSortAsc(k==="amount"?false:true); }
    setPage(1);
  };

  const SortIcon=({k}:{k:SortKey})=>
    sortKey===k
      ?<span className="text-orange-500 ml-0.5">{sortAsc?"↑":"↓"}</span>
      :<span className="text-orange-200 ml-0.5">↕</span>;

  const totalRevenue  = orders.reduce((a,o)=>a+o.amount,0);
  const pendingOrders = orders.filter(o=>o.status==="processing"||o.status==="shipped").length;
  const returnedCount = orders.filter(o=>o.status==="returned"||o.status==="cancelled").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes dotDrift{ from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes toastIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
      `}</style>

      <div className="min-h-screen bg-[#fffaf7] relative" style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        <div className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage:"radial-gradient(circle,rgba(249,115,22,.04) 1px,transparent 1px)", backgroundSize:"28px 28px", animation:"dotDrift 20s linear infinite" }}/>

        <div className="relative z-10 p-4 sm:p-6 space-y-5 max-w-[1400px] mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3" style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1)" }}>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-7 h-0.5 bg-orange-500 rounded-full"/>
                <span className="text-[10px] font-bold tracking-[.22em] uppercase text-orange-500">Store</span>
              </div>
              <h1 className="font-black text-[#111] leading-tight tracking-tight" style={{ fontSize:"clamp(1.4rem,2.5vw,1.9rem)" }}>Orders</h1>
              <p className="text-[12px] text-orange-300 mt-0.5">
                {orders.length} total · {pendingOrders} in progress · {returnedCount} returns/cancelled
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 bg-white border border-orange-100 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-300 transition-all">
                <Download size={13}/>Export
              </button>
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 bg-white border border-orange-100 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-300 transition-all">
                <RefreshCw size={13}/>Refresh
              </button>
            </div>
          </div>

          {/* Stat chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .07s both" }}>
            {[
              { label:"Total Orders",       value:orders.length,    color:"#f97316", bg:"#fff7f0", border:"#fed7aa" },
              { label:"Revenue",            value:fmt(totalRevenue),color:"#ea580c", bg:"#fff4ee", border:"#fdba74" },
              { label:"In Progress",        value:pendingOrders,    color:"#fb923c", bg:"#fff7f0", border:"#fed7aa" },
              { label:"Returns/Cancelled",  value:returnedCount,    color:"#c2410c", bg:"#fff4ee", border:"#fdba74" },
            ].map(s=>(
              <div key={s.label}
                className="bg-white border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(249,115,22,.1)] transition-all"
                style={{ borderColor:s.border }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[13px] shrink-0"
                  style={{ background:s.bg, color:s.color }}>
                  {typeof s.value==="number"?s.value:<span className="text-[10px]">{s.value}</span>}
                </div>
                <p className="text-[11px] font-semibold text-gray-500 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-orange-100 rounded-2xl p-4 flex items-center gap-3 flex-wrap"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .14s both" }}>
            <div className="relative min-w-[200px] flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none"/>
              <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }}
                placeholder="Search order ID, customer, city…"
                className="w-full pl-8 pr-4 py-2.5 text-[12px] bg-orange-50/50 border border-orange-100 rounded-2xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all text-[#111] placeholder:text-orange-200"
                style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={()=>{ setStatusFilter("All"); setPage(1); }}
                className={`text-[10px] font-bold px-3 py-2 rounded-2xl border cursor-pointer transition-all
                  ${statusFilter==="All"?"bg-orange-500 border-orange-500 text-white shadow-[0_3px_10px_rgba(249,115,22,.3)]":"bg-white border-orange-100 text-orange-400 hover:border-orange-300 hover:text-orange-500"}`}>
                All
              </button>
              {ALL_STATUSES.map(s=>{
                const cfg=STATUS_CFG[s];
                return (
                  <button key={s} onClick={()=>{ setStatusFilter(s); setPage(1); }}
                    className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-2 rounded-2xl border cursor-pointer transition-all"
                    style={{
                      background: statusFilter===s?cfg.bg:"#fff",
                      borderColor: statusFilter===s?cfg.color:"#ffe4cc",
                      color: statusFilter===s?cfg.color:"#fdba74",
                    }}>
                    {cfg.icon}{cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-orange-100 rounded-2xl overflow-hidden"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .2s both" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-orange-50 bg-orange-50/40">
                    {[
                      { label:"Order ID",k:"id"       as SortKey },
                      { label:"Customer",k:"customer" as SortKey },
                      { label:"Items",   k:null },
                      { label:"Amount",  k:"amount"   as SortKey },
                      { label:"Payment", k:null },
                      { label:"Status",  k:"status"   as SortKey },
                      { label:"Date",    k:"date"     as SortKey },
                      { label:"Actions", k:null },
                    ].map(h=>(
                      <th key={h.label}
                        className={`px-4 py-3.5 text-[9px] font-black tracking-[.18em] uppercase text-orange-400 whitespace-nowrap ${h.k?"cursor-pointer hover:text-orange-600 select-none transition-colors":""}`}
                        onClick={()=>h.k&&sort(h.k)}>
                        {h.label}{h.k&&<SortIcon k={h.k as SortKey}/>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length===0?(
                    <tr><td colSpan={8} className="text-center py-16">
                      <div className="text-3xl mb-3">📦</div>
                      <p className="font-bold text-[#111] mb-1">No orders found</p>
                      <p className="text-[12px] text-orange-300">Try a different search or filter</p>
                    </td></tr>
                  ):paginated.map((o,i)=>(
                    <tr key={o.id}
                      className="border-b border-orange-50/60 last:border-0 hover:bg-orange-50/20 transition-colors group cursor-pointer"
                      style={{ animation:`fadeUp .4s cubic-bezier(.16,1,.3,1) ${i*.045}s both` }}
                      onClick={()=>setViewOrder(o)}>

                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={e=>e.stopPropagation()}>
                        <span className="text-[11px] font-black text-orange-500">{o.id}</span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <Avatar initials={o.avatar} color={o.avatarColor} size={32}/>
                          <div>
                            <p className="text-[12px] font-bold text-[#111]">{o.customer}</p>
                            <p className="text-[10px] text-orange-300">{o.city}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex -space-x-2">
                          {o.items.slice(0,3).map((item,idx)=>(
                            <div key={idx} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white flex items-center justify-center shrink-0" style={{ background:"#fff4ee" }}>
                              <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                          ))}
                        </div>
                        <p className="text-[9px] text-orange-300 mt-1">{o.items.length} item{o.items.length>1?"s":""}</p>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[13px] font-black text-[#111]">{fmt(o.amount)}</span>
                        {o.discount>0&&<p className="text-[9px] text-green-600 font-bold">−{fmt(o.discount)} off</p>}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-[11px] text-gray-500 font-medium">{o.payMethod}</span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap" onClick={e=>e.stopPropagation()}>
                        <StatusDropdown current={o.status} onChange={s=>handleStatusChange(o.id,s)}/>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={11} className="text-orange-200 shrink-0"/>
                          <span className="text-[11px] text-gray-500">{o.date}</span>
                        </div>
                        {o.deliveredOn&&<p className="text-[9px] text-green-600 font-bold pl-[19px]">✓ {o.deliveredOn}</p>}
                        {o.tracking&&<p className="text-[9px] text-orange-400 pl-[19px]">{o.tracking}</p>}
                      </td>

                      <td className="px-4 py-3.5" onClick={e=>e.stopPropagation()}>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={()=>setViewOrder(o)}
                            className="w-7 h-7 rounded-xl border border-orange-100 flex items-center justify-center text-orange-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 cursor-pointer bg-transparent transition-all">
                            <Eye size={12}/>
                          </button>
                          <button className="w-7 h-7 rounded-xl border border-orange-100 flex items-center justify-center text-orange-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 cursor-pointer bg-transparent transition-all">
                            <Printer size={12}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-orange-50 bg-orange-50/20 flex-wrap gap-2">
              <span className="text-[11px] text-orange-300">
                Showing <strong className="text-[#111]">{Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)}</strong> of <strong className="text-orange-500">{filtered.length}</strong> orders
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center text-orange-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white transition-all">
                  <ChevronLeft size={14}/>
                </button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} onClick={()=>setPage(n)}
                    className={`w-8 h-8 rounded-xl text-[12px] font-bold transition-all cursor-pointer border
                      ${page===n?"bg-orange-500 border-orange-500 text-white shadow-[0_3px_10px_rgba(249,115,22,.3)]":"bg-white border-orange-100 text-orange-400 hover:border-orange-300 hover:text-orange-500"}`}>
                    {n}
                  </button>
                ))}
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages}
                  className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center text-orange-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white transition-all">
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewOrder&&<OrderDrawer order={viewOrder} onClose={()=>setViewOrder(null)} onStatusChange={handleStatusChange}/>}

      {toast&&(
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111] text-white text-[12px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ animation:"toastIn .35s cubic-bezier(.16,1,.3,1)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          <Check size={13} className="text-orange-400"/>
          {toast}
        </div>
      )}
    </>
  );
}
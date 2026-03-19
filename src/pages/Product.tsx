import { useState, useMemo } from "react";
import {
  Plus, Search, Download, Upload,
  Pencil, Trash2, ChevronRight, ChevronLeft,
  ChevronDown, Check, X, Star, ShoppingBag,
  Package, AlertCircle, Image
} from "lucide-react";

type ProductStatus = "active" | "out" | "low" | "draft";
type SortKey = "name" | "price" | "stock" | "sales" | "rating";

interface Product {
  id: string; name: string; brand: string; category: string; subcat: string;
  price: number; orig: number; stock: number; sold: number;
  rating: number; reviews: number; fabric: string; sizes: string[];
  badge: string; badgeColor: string; status: ProductStatus;
  img: string; discount: number;
}

/* ── All badge colours → orange family ── */
const INIT_PRODUCTS: Product[] = [
  { id:"P001", name:"Premium Wool Blazer",    brand:"Manyavar",    category:"Men",   subcat:"Suits",    price:3499, orig:5999, stock:24, sold:214, rating:4.7, reviews:214, fabric:"Wool Blend",   sizes:["S","M","L","XL"],        badge:"Bestseller",  badgeColor:"#111",    status:"active", discount:42, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/4_2ab5d4e8-2cc9-4134-83a2-e8a061395274_w6xpfq.webp" },
  { id:"P002", name:"Embroidered Anarkali",   brand:"Biba",        category:"Women", subcat:"Ethnic",   price:2150, orig:3200, stock:0,  sold:178, rating:4.0, reviews:75,  fabric:"Georgette",    sizes:["S","M","L","XL","XXL"],  badge:"Sale",        badgeColor:"#f97316", status:"out",    discount:33, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296338/AmericanSilkPinkZariEmbroideredAnarkaliSuitPantWithDupatta_2_fzwckx.webp" },
  { id:"P003", name:"Slim Fit Stretch Chinos",brand:"FabIndia",    category:"Men",   subcat:"Trousers", price:899,  orig:1299, stock:57, sold:99,  rating:4.5, reviews:99,  fabric:"Cotton Blend", sizes:["30","32","34","36","38"], badge:"New",         badgeColor:"#f97316", status:"active", discount:31, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295573/Untitleddesign_98_r0vlhs.webp" },
  { id:"P004", name:"Cotton Blend Co-ord Set",brand:"Aurelia",     category:"Women", subcat:"Casuals",  price:1299, orig:1899, stock:12, sold:128, rating:4.5, reviews:128, fabric:"100% Cotton",  sizes:["XS","S","M","L","XL"],   badge:"New Arrival", badgeColor:"#ea580c", status:"low",    discount:32, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1771325461/pngtree-trendy-summer-party-dress-model-girl-in-fashionable-attire-png-image_13211648_ys2ype.png" },
  { id:"P005", name:"Kids Dungaree Playsuit", brand:"H&M Kids",    category:"Kids",  subcat:"Casuals",  price:599,  orig:899,  stock:33, sold:61,  rating:4.8, reviews:61,  fabric:"Denim Cotton", sizes:["2Y","4Y","6Y","8Y"],      badge:"New",         badgeColor:"#f97316", status:"active", discount:33, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296148/images_26_wxn2do.jpg" },
  { id:"P006", name:"Palazzo Sharara Set",    brand:"W for Woman", category:"Women", subcat:"Ethnic",   price:1799, orig:2499, stock:8,  sold:88,  rating:4.3, reviews:88,  fabric:"Silk Blend",   sizes:["S","M","L","XL"],        badge:"Sale",        badgeColor:"#f97316", status:"low",    discount:28, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296149/gulmohar-cotton-hand-block-sharara-set-8853992_atc3e2.webp" },
  { id:"P007", name:"Tropical Rayon Shirt",   brand:"Manyavar",    category:"Men",   subcat:"Shirts",   price:749,  orig:1100, stock:44, sold:214, rating:4.5, reviews:214, fabric:"Rayon",        sizes:["S","M","L","XL"],        badge:"Trending",    badgeColor:"#ea580c", status:"active", discount:32, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773296337/gemini-generated-image-hisdushisdushisd-1-500x500_z8jlod.webp" },
  { id:"P008", name:"Flared Denim Jeans",     brand:"Levis",       category:"Women", subcat:"Jeans",    price:1499, orig:2299, stock:0,  sold:302, rating:4.6, reviews:302, fabric:"98% Denim",    sizes:["26","28","30","32"],      badge:"Trending",    badgeColor:"#ea580c", status:"out",    discount:35, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295972/images_24_dv4pnt.jpg" },
  { id:"P009", name:"Bandhgala Nehru Jacket", brand:"Manyavar",    category:"Men",   subcat:"Suits",    price:3299, orig:4999, stock:15, sold:47,  rating:4.7, reviews:47,  fabric:"Art Silk",     sizes:["S","M","L","XL","XXL"],  badge:"New Arrival", badgeColor:"#ea580c", status:"active", discount:34, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1773295571/images_22_n6ftjn.jpg" },
  { id:"P010", name:"Wedding Lehenga Set",    brand:"Biba",        category:"Women", subcat:"Ethnic",   price:4999, orig:7999, stock:6,  sold:32,  rating:4.9, reviews:32,  fabric:"Bridal Silk",  sizes:["XS","S","M","L"],        badge:"Premium",     badgeColor:"#f97316", status:"low",    discount:38, img:"https://res.cloudinary.com/dquki4xol/image/upload/v1771325307/images_11_xlytvq.jpg" },
];

const EMPTY_PRODUCT: Omit<Product,"id"> = {
  name:"", brand:"", category:"Men", subcat:"", price:0, orig:0,
  stock:0, sold:0, rating:0, reviews:0, fabric:"", sizes:[],
  badge:"", badgeColor:"#f97316", status:"draft", discount:0, img:"",
};

const CATEGORIES  = ["All","Men","Women","Kids"];
const STATUS_OPTS = ["All","active","out","low","draft"];

/* ── All status colours → orange tones ── */
const STATUS_CFG: Record<ProductStatus,{ label:string; color:string; bg:string }> = {
  active: { label:"Active",       color:"#c2410c", bg:"#fff7ed" },
  out:    { label:"Out of Stock", color:"#9a3412", bg:"#fff4ee" },
  low:    { label:"Low Stock",    color:"#ea580c", bg:"#ffedd5" },
  draft:  { label:"Draft",       color:"#fdba74", bg:"#fffbf7" },
};

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

function Stars({ n }: { n:number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s=>(
        <Star key={s} size={10}
          fill={s<=Math.floor(n)?"#f97316":"none"}
          stroke={s<=Math.floor(n)?"#f97316":"#fed7aa"}/>
      ))}
    </span>
  );
}

/* ── Add/Edit Modal ── */
function ProductModal({ product, onSave, onClose, isEdit }:{
  product: Omit<Product,"id"> & { id?:string };
  onSave:(p:any)=>void; onClose:()=>void; isEdit:boolean;
}) {
  const [form, setForm] = useState({ ...product });
  const [sizeInput, setSizeInput] = useState("");

  const set   = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}));
  const setNum= (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f=>({...f,[k]:Number(e.target.value)}));

  const addSize = () => {
    const s=sizeInput.trim().toUpperCase();
    if(s && !form.sizes.includes(s)) setForm(f=>({...f,sizes:[...f.sizes,s]}));
    setSizeInput("");
  };
  const removeSize=(s:string)=>setForm(f=>({...f,sizes:f.sizes.filter(x=>x!==s)}));

  const inp="w-full px-3.5 py-2.5 bg-orange-50/50 border border-orange-100 rounded-2xl text-[12px] text-[#111] outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all placeholder:text-orange-200";
  const sel=inp+" appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto"
      style={{ background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 overflow-hidden"
        style={{ animation:"fadeUp .3s cubic-bezier(.16,1,.3,1)" }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-50 bg-orange-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <ShoppingBag size={14} className="text-white"/>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-orange-500 rounded-full"/>
                <span className="text-[9px] font-bold tracking-[.2em] uppercase text-orange-500">Products</span>
              </div>
              <h3 className="font-black text-[#111] text-[14px] leading-tight">{isEdit?"Edit Product":"Add New Product"}</h3>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center text-orange-300 hover:bg-orange-50 hover:text-orange-500 cursor-pointer bg-transparent border-none transition-all">
            <X size={14}/>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Image */}
          <div>
            <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-2">Product Image URL</label>
            <div className="flex gap-3 items-start">
              <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-orange-200 flex items-center justify-center shrink-0 overflow-hidden" style={{ background:"#fff4ee" }}>
                {form.img?<img src={form.img} alt="" className="w-full h-full object-cover"/>:<Image size={22} className="text-orange-300"/>}
              </div>
              <input className={inp+" flex-1"} placeholder="https://..." value={form.img} onChange={set("img")}/>
            </div>
          </div>
          {/* Name + Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Product Name *</label><input className={inp} placeholder="e.g. Slim Fit Blazer" value={form.name} onChange={set("name")}/></div>
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Brand *</label><input className={inp} placeholder="e.g. Manyavar" value={form.brand} onChange={set("brand")}/></div>
          </div>
          {/* Category + Subcat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Category</label>
              <div className="relative">
                <select className={sel} value={form.category} onChange={set("category")} style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  {["Men","Women","Kids","Unisex"].map(c=><option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none"/>
              </div>
            </div>
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Sub-category</label><input className={inp} placeholder="e.g. Suits, Ethnic..." value={form.subcat} onChange={set("subcat")}/></div>
          </div>
          {/* Price + MRP */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Sale Price (₹) *</label><input className={inp} type="number" min={0} placeholder="0" value={form.price||""} onChange={setNum("price")}/></div>
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">MRP (₹) *</label><input className={inp} type="number" min={0} placeholder="0" value={form.orig||""} onChange={setNum("orig")}/></div>
          </div>
          {/* Stock + Fabric */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Stock Qty</label><input className={inp} type="number" min={0} placeholder="0" value={form.stock||""} onChange={setNum("stock")}/></div>
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Fabric</label><input className={inp} placeholder="e.g. 100% Cotton" value={form.fabric} onChange={set("fabric")}/></div>
          </div>
          {/* Badge + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Badge Label</label><input className={inp} placeholder="e.g. New, Sale, Hot..." value={form.badge} onChange={set("badge")}/></div>
            <div>
              <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Status</label>
              <div className="relative">
                <select className={sel} value={form.status} onChange={set("status")} style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="out">Out of Stock</option>
                  <option value="low">Low Stock</option>
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none"/>
              </div>
            </div>
          </div>
          {/* Sizes */}
          <div>
            <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1.5">Sizes</label>
            <div className="flex gap-2 flex-wrap mb-2">
              {form.sizes.map(s=>(
                <span key={s} className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-50 border border-orange-200 text-orange-600 px-2.5 py-1 rounded-xl">
                  {s}
                  <button onClick={()=>removeSize(s)} className="cursor-pointer bg-transparent border-none p-0 text-orange-300 hover:text-red-500 transition-colors"><X size={9}/></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input className={inp} placeholder="Type size and press Add" value={sizeInput} onChange={e=>setSizeInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addSize();}}}/>
              <button onClick={addSize} className="px-4 py-2 bg-orange-500 text-white text-[11px] font-bold rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all whitespace-nowrap flex items-center gap-1">
                <Plus size={12}/>Add
              </button>
            </div>
          </div>
          {/* Discount preview */}
          {form.price>0 && form.orig>form.price && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-2xl text-[11px]">
              <Check size={13} className="text-orange-500 shrink-0"/>
              <span className="text-orange-700 font-semibold">
                Discount: <strong>{Math.round((1-form.price/form.orig)*100)}%</strong>
                {" · "}Customer saves <strong>{fmt(form.orig-form.price)}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-orange-50 bg-orange-50/20">
          <button onClick={onClose} className="px-6 py-2.5 text-[12px] font-bold text-orange-400 border border-orange-100 rounded-2xl cursor-pointer bg-white hover:border-orange-300 transition-colors">Cancel</button>
          <button onClick={()=>onSave(form)} className="px-7 py-2.5 text-[12px] font-bold text-white bg-orange-500 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)] flex items-center gap-2">
            <Check size={13}/>{isEdit?"Update Product":"Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete modal ── */
function DeleteModal({ name, onConfirm, onClose }:{ name:string; onConfirm:()=>void; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background:"rgba(0,0,0,.5)", backdropFilter:"blur(4px)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        style={{ animation:"fadeUp .3s cubic-bezier(.16,1,.3,1)" }}>
        <div className="w-14 h-14 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-orange-500"/>
        </div>
        <h3 className="font-black text-[#111] text-[16px] mb-2">Delete Product?</h3>
        <p className="text-[12px] text-gray-400 mb-6">
          Are you sure you want to delete <strong className="text-[#111]">"{name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-2.5 justify-center">
          <button onClick={onClose} className="px-6 py-2.5 text-[12px] font-bold text-orange-400 border border-orange-100 rounded-2xl cursor-pointer bg-white hover:border-orange-300 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-2.5 text-[12px] font-bold text-white bg-orange-500 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all flex items-center gap-2">
            <Trash2 size={13}/>Delete
          </button>
        </div>
      </div>
    </div>
  );
}

const PAGE_SIZE = 6;

export default function Products() {
  const [products,     setProducts]     = useState<Product[]>(INIT_PRODUCTS);
  const [search,       setSearch]       = useState("");
  const [catFilter,    setCatFilter]    = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey,      setSortKey]      = useState<SortKey>("name");
  const [sortAsc,      setSortAsc]      = useState(true);
  const [page,         setPage]         = useState(1);
  const [modal,        setModal]        = useState<"add"|"edit"|null>(null);
  const [editProd,     setEditProd]     = useState<Product|null>(null);
  const [delProd,      setDelProd]      = useState<Product|null>(null);
  const [toast,        setToast]        = useState<string|null>(null);

  const showToast=(msg:string)=>{ setToast(msg); setTimeout(()=>setToast(null),2400); };

  const filtered = useMemo(()=>{
    let p=[...products];
    if(search.trim()) p=p.filter(x=>x.name.toLowerCase().includes(search.toLowerCase())||x.brand.toLowerCase().includes(search.toLowerCase()));
    if(catFilter!=="All") p=p.filter(x=>x.category===catFilter);
    if(statusFilter!=="All") p=p.filter(x=>x.status===statusFilter);
    p.sort((a,b)=>{
      const A=a[sortKey],B=b[sortKey];
      return typeof A==="string"?(sortAsc?A.localeCompare(B as string):(B as string).localeCompare(A)):(sortAsc?(A as number)-(B as number):(B as number)-(A as number));
    });
    return p;
  },[products,search,catFilter,statusFilter,sortKey,sortAsc]);

  const totalPages=Math.ceil(filtered.length/PAGE_SIZE);
  const paginated=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE);
  const sort=(k:SortKey)=>{ if(sortKey===k) setSortAsc(a=>!a); else{ setSortKey(k); setSortAsc(true); } setPage(1); };

  const handleAdd=(form: Omit<Product,"id">)=>{
    const id="P"+String(products.length+1).padStart(3,"0");
    setProducts(p=>[...p,{...form,id,discount:form.orig>0?Math.round((1-form.price/form.orig)*100):0,sold:0,rating:0,reviews:0}]);
    setModal(null); showToast("Product added!");
  };
  const handleEdit=(form: Omit<Product,"id">)=>{
    setProducts(p=>p.map(x=>x.id===editProd!.id?{...x,...form,discount:form.orig>0?Math.round((1-form.price/form.orig)*100):0}:x));
    setModal(null); setEditProd(null); showToast("Product updated!");
  };
  const handleDelete=()=>{ setProducts(p=>p.filter(x=>x.id!==delProd!.id)); setDelProd(null); showToast("Product deleted."); };

  const SortIcon=({k}:{k:SortKey})=>
    sortKey===k?<span className="text-orange-500 ml-0.5">{sortAsc?"↑":"↓"}</span>:<span className="text-orange-200 ml-0.5">↕</span>;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes dotDrift { from{background-position:0 0} to{background-position:28px 28px} }
        @keyframes toastIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
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
              <h1 className="font-black text-[#111] leading-tight tracking-tight" style={{ fontSize:"clamp(1.4rem,2.5vw,1.9rem)" }}>Products</h1>
              <p className="text-[12px] text-orange-300 mt-0.5">
                {products.length} total · {products.filter(p=>p.status==="active").length} active · {products.filter(p=>p.status==="out").length} out of stock
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 bg-white border border-orange-100 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-300 transition-all"><Upload size={13}/>Import</button>
              <button className="inline-flex items-center gap-1.5 text-[11px] font-bold text-orange-500 bg-white border border-orange-100 px-4 py-2.5 rounded-2xl cursor-pointer hover:border-orange-300 transition-all"><Download size={13}/>Export</button>
              <button onClick={()=>setModal("add")}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-orange-500 px-5 py-2.5 rounded-2xl cursor-pointer border-none hover:bg-orange-600 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(249,115,22,.35)]">
                <Plus size={14}/>Add Product
              </button>
            </div>
          </div>

          {/* Stat chips — all orange */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .07s both" }}>
            {[
              { label:"Total Products", value:products.length,                                color:"#f97316", bg:"#fff7f0", border:"#fed7aa" },
              { label:"Active",         value:products.filter(p=>p.status==="active").length, color:"#c2410c", bg:"#fff4ee", border:"#fdba74" },
              { label:"Low Stock",      value:products.filter(p=>p.status==="low").length,    color:"#ea580c", bg:"#ffedd5", border:"#fcd9b0" },
              { label:"Out of Stock",   value:products.filter(p=>p.status==="out").length,    color:"#9a3412", bg:"#fff4ee", border:"#fed7aa" },
            ].map(s=>(
              <div key={s.label} className="bg-white border rounded-2xl px-4 py-3.5 flex items-center gap-3 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(249,115,22,.1)] transition-all"
                style={{ borderColor:s.border }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg" style={{ background:s.bg, color:s.color }}>{s.value}</div>
                <p className="text-[11px] font-semibold text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="bg-white border border-orange-100 rounded-2xl p-4 flex items-center gap-3 flex-wrap"
            style={{ animation:"fadeUp .5s cubic-bezier(.16,1,.3,1) .14s both" }}>
            <div className="relative min-w-[200px] flex-1">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none"/>
              <input value={search} onChange={e=>{ setSearch(e.target.value); setPage(1); }} placeholder="Search products, brands…"
                className="w-full pl-8 pr-4 py-2.5 text-[12px] bg-orange-50/50 border border-orange-100 rounded-2xl outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 transition-all text-[#111] placeholder:text-orange-200"
                style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(c=>(
                <button key={c} onClick={()=>{ setCatFilter(c); setPage(1); }}
                  className={`text-[11px] font-bold px-3 py-2 rounded-2xl border cursor-pointer transition-all
                    ${catFilter===c?"bg-orange-500 border-orange-500 text-white shadow-[0_3px_10px_rgba(249,115,22,.3)]":"bg-white border-orange-100 text-orange-400 hover:border-orange-300 hover:text-orange-500"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative">
              <select value={statusFilter} onChange={e=>{ setStatusFilter(e.target.value); setPage(1); }}
                className="text-[11px] font-semibold text-orange-500 bg-white border border-orange-100 rounded-2xl px-3 py-2.5 outline-none cursor-pointer focus:border-orange-400 appearance-none pr-7 transition-all"
                style={{ fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                {STATUS_OPTS.map(s=><option key={s}>{s==="All"?"All Status":STATUS_CFG[s as ProductStatus]?.label||s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-orange-300 pointer-events-none"/>
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
                      { label:"Product",  k:"name"   as SortKey },
                      { label:"Category", k:null },
                      { label:"Price",    k:"price"  as SortKey },
                      { label:"Stock",    k:"stock"  as SortKey },
                      { label:"Sold",     k:"sales"  as SortKey },
                      { label:"Rating",   k:"rating" as SortKey },
                      { label:"Status",   k:null },
                      { label:"Actions",  k:null },
                    ].map(h=>(
                      <th key={h.label}
                        className={`px-4 py-3.5 text-[9px] font-black tracking-[.18em] uppercase text-orange-400 whitespace-nowrap ${h.k?"cursor-pointer hover:text-orange-600 transition-colors select-none":""}`}
                        onClick={()=>h.k&&sort(h.k)}>
                        {h.label}{h.k&&<SortIcon k={h.k as SortKey}/>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length===0?(
                    <tr><td colSpan={8} className="text-center py-16">
                      <div className="text-3xl mb-3">🧵</div>
                      <p className="font-bold text-[#111] mb-1">No products found</p>
                      <p className="text-[12px] text-orange-300">Try different search or filters</p>
                    </td></tr>
                  ):paginated.map((p,i)=>{
                    const st=STATUS_CFG[p.status];
                    return (
                      <tr key={p.id} className="border-b border-orange-50/60 last:border-0 hover:bg-orange-50/20 transition-colors group"
                        style={{ animation:`fadeUp .4s cubic-bezier(.16,1,.3,1) ${i*.05}s both` }}>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-orange-100" style={{ background:"#fff4ee" }}>
                              {p.img?<img src={p.img} alt={p.name} className="w-full h-full object-cover"/>:<Package size={16} className="text-orange-300"/>}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[12px] text-[#111] truncate max-w-[160px]">{p.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[9px] text-orange-300">{p.brand}</span>
                                {p.badge&&<span className="text-[8px] font-black px-1.5 py-0.5 rounded-full text-white" style={{ background:p.badgeColor }}>{p.badge}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="text-[11px] font-semibold text-[#111]">{p.category}</span>
                          <p className="text-[9px] text-orange-300">{p.subcat}</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[12px] font-black text-orange-500">{fmt(p.price)}</span>
                          <p className="text-[10px] text-orange-200 line-through">{fmt(p.orig)}</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[12px] font-black ${p.stock===0?"text-red-500":p.stock<15?"text-orange-500":"text-[#111]"}`}>{p.stock}</span>
                            {p.stock<15&&p.stock>0&&<AlertCircle size={11} className="text-orange-400"/>}
                            {p.stock===0&&<AlertCircle size={11} className="text-red-400"/>}
                          </div>
                          <p className="text-[9px] text-orange-200">units</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="text-[12px] font-semibold text-[#111]">{p.sold}</span>
                          <p className="text-[9px] text-orange-200">units</p>
                        </td>

                        <td className="px-4 py-3.5">
                          <Stars n={p.rating}/>
                          <p className="text-[9px] text-orange-300 mt-0.5">{p.rating} ({p.reviews})</p>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center text-[9px] font-black px-2.5 py-1 rounded-full" style={{ color:st.color, background:st.bg }}>{st.label}</span>
                        </td>

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={()=>{ setEditProd(p); setModal("edit"); }}
                              className="w-7 h-7 rounded-xl border border-orange-100 flex items-center justify-center text-orange-300 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-500 cursor-pointer bg-transparent transition-all">
                              <Pencil size={12}/>
                            </button>
                            <button onClick={()=>setDelProd(p)}
                              className="w-7 h-7 rounded-xl border border-orange-100 flex items-center justify-center text-orange-300 hover:bg-red-50 hover:border-red-200 hover:text-red-500 cursor-pointer bg-transparent transition-all">
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
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-orange-50 bg-orange-50/20 flex-wrap gap-2">
              <span className="text-[11px] text-orange-300">
                Showing <strong className="text-[#111]">{Math.min((page-1)*PAGE_SIZE+1,filtered.length)}–{Math.min(page*PAGE_SIZE,filtered.length)}</strong> of <strong className="text-orange-500">{filtered.length}</strong> products
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
                <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page>=totalPages||totalPages===0}
                  className="w-8 h-8 rounded-xl border border-orange-100 flex items-center justify-center text-orange-400 hover:border-orange-300 hover:text-orange-500 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer bg-white transition-all">
                  <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {modal==="add"&&<ProductModal product={EMPTY_PRODUCT} onSave={handleAdd} onClose={()=>setModal(null)} isEdit={false}/>}
      {modal==="edit"&&editProd&&<ProductModal product={editProd} onSave={handleEdit} onClose={()=>{ setModal(null); setEditProd(null); }} isEdit={true}/>}
      {delProd&&<DeleteModal name={delProd.name} onConfirm={handleDelete} onClose={()=>setDelProd(null)}/>}

      {toast&&(
        <div className="fixed bottom-6 right-6 z-[200] bg-[#111] text-white text-[12px] font-bold px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl"
          style={{ animation:"toastIn .35s cubic-bezier(.16,1,.3,1)", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          <Check size={13} className="text-orange-400"/>{toast}
        </div>
      )}
    </>
  );
}
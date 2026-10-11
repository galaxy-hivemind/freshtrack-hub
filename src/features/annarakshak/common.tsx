import { useState, type ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Shield, Leaf, LayoutDashboard, Package, ScanLine, History, CircleHelp, Settings, Bell, Search, ChevronDown, Menu, X, ArrowRight, FlaskConical, House, CircleCheck, Clock, TriangleAlert, LoaderCircle, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { settingsQuery, scansQuery, service } from '@/services/api';
import { displayDate, productStatus } from '@/services/dates';
import type { Product, ProductStatus } from '@/services/types';
const nav = [{to:'/',name:'Dashboard',icon:LayoutDashboard},{to:'/inventory',name:'My Inventory',icon:Package},{to:'/scan',name:'Scan Product',icon:ScanLine},{to:'/history',name:'Scan History',icon:History},{to:'/review',name:'Needs Review',icon:CircleHelp},{to:'/settings',name:'Settings',icon:Settings}] as const;
export function AppShell({children}:{children:ReactNode}) {
 const pathname=useRouterState({select:s=>s.location.pathname}); const [menu,setMenu]=useState(false);const [search,setSearch]=useState(false);const [query,setQuery]=useState('');const [results,setResults]=useState<Product[]>([]);const [searching,setSearching]=useState(false);
 const {data:settings}=useQuery(settingsQuery);const {data:scans}=useQuery(scansQuery);const count=scans?.filter(s=>s.reviewStatus==='Needs Review').length || 0;
 const title=nav.find(n=>n.to===pathname)?.name || 'AnnaRakshak';
 async function find(value:string){setQuery(value);setSearching(true);const all=await service.getProducts();setResults(all.filter(p=>`${p.name} ${p.brand}`.toLowerCase().includes(value.toLowerCase())));setSearching(false);}
 return <div className={`app-shell ${settings?.compact?'compact':''}`}>
 {menu && <div className="sidebar-backdrop" onClick={()=>setMenu(false)} />}
 <aside className={`sidebar ${menu?'open':''}`}>
 <Link to="/" className="brand" onClick={()=>setMenu(false)}><span className="brand-icon"><Shield size={35} strokeWidth={1.8}/><Leaf className="leaf" strokeWidth={2}/></span><div><div className="brand-name">AnnaRakshak</div><div className="brand-tagline">Mindful tracking. Less waste.</div></div></Link>
 <div className="nav-label">Your kitchen, in view</div>
 <nav aria-label="Main navigation">{nav.filter(n=>n.to!=='/settings').map(n=><Link key={n.to} to={n.to} className={`nav-item ${pathname===n.to?'active':''}`} onClick={()=>setMenu(false)}><n.icon/><span>{n.name}</span>{n.to==='/review' && count>0 && <span className="nav-count">{count}</span>}</Link>)}</nav>
 <div className="sidebar-bottom"><Link to="/settings" className={`nav-item ${pathname==='/settings'?'active':''}`} onClick={()=>setMenu(false)}><Settings/><span>Settings</span></Link><div className="demo-note"><strong><FlaskConical size={14}/>Demo workspace</strong>Sample products & simulated scans.<br/>No live scanner connected.</div><div className="workspace"><span className="workspace-icon"><House size={17}/></span><div className="flex-1"><div className="text-xs font-semibold">My kitchen</div><div className="text-[10px] text-muted-foreground mt-1">Personal workspace</div></div><ChevronDown size={14} className="text-muted-foreground"/></div></div>
 </aside>
 <main className="app-main"><header className="topbar"><div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menu?'Close navigation':'Open navigation'} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</Button><span className="topbar-title">{title}</span></div><div className="topbar-tools"><Button variant="ghost" className="global-search" onClick={()=>{setSearch(true);void find('');}} aria-label="Search products"><Search size={15}/><div className="search-label">Search your inventory</div><span><Search size={10}/></span></Button><Button variant="ghost" size="icon" asChild className={count?'notification':''} title={`${count} records need attention`}><Link to="/review" aria-label={`${count} records need attention`}><Bell size={18}/></Link></Button><div className="profile"><span className="avatar">MK</span><div>My kitchen</div><ChevronDown size={13}/></div></div></header>{children}</main>
 <Dialog open={search} onOpenChange={setSearch}><DialogContent><DialogTitle>Search inventory</DialogTitle><DialogDescription>Find a product by its name or brand.</DialogDescription><div className="search-input"><Search/><input autoFocus aria-label="Search inventory" value={query} onChange={e=>void find(e.target.value)} placeholder="Product name or brand"/></div>{searching?<Loading/>:results.length?<div className="max-h-80 overflow-y-auto">{results.map(p=><Link key={p.id} to="/inventory" search={{q:p.name}} onClick={()=>setSearch(false)} className="review-row"><ProductCell product={p}/><ArrowRight size={15} className="ml-auto text-primary"/></Link>)}</div>:<Empty title="No products found" message="Try another product name or brand."/>}</DialogContent></Dialog>
 </div>;
}
export function PageIntro({title,description,children}:{title:string;description:string;children?:ReactNode}){return <div className="page-intro"><div><h1>{title}</h1><p>{description}</p></div>{children && <div className="intro-actions">{children}</div>}</div>;}
export function ProductCell({product}:{product:Pick<Product,'image'|'name'|'brand'>}){return <div className="product-cell"><img src={product.image} width={41} height={45} alt="" className="product-thumb" loading="lazy"/><div><div className="product-name">{product.name}</div><div className="product-brand">{product.brand || 'No brand specified'}</div></div></div>;}
export function StatusBadge({status}:{status:ProductStatus | 'Successful' | 'Failed' | 'Confirmed'}){
 const danger=['Expired','Best Before Passed','Failed'].includes(status);const warn=['Needs Review','Expires Today','Expiring Soon','Best Before Today','Best Before Soon'].includes(status);const neutral=['Unknown','Manufactured','Packed'].includes(status);const Icon=danger?TriangleAlert:warn?Clock:neutral?CalendarDays:CircleCheck;
 return <span className={`status status-${danger?'danger':warn?'warning':neutral?'neutral':'safe'}`}><Icon/>{status}</span>;
}
export function ProductDate({product}:{product:Product}){const {data:settings}=useQuery(settingsQuery);return <div><div className="text-xs">{product.verified?displayDate(product.date,settings?.dateFormat==='long'):'Not confirmed'}</div><div className="text-[10px] text-muted-foreground mt-1 date-type">{product.dateType}{!product.verified?' · needs review':''}</div></div>;}
export function ProductBadge({product}:{product:Product}){const {data:settings}=useQuery(settingsQuery);return <StatusBadge status={productStatus(product,settings?.alertWindow)}/>;}
export function PanelHead({title,subtitle,children}:{title:ReactNode;subtitle?:string;children?:ReactNode}){return <div className="panel-head"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</div>;}
export function Loading(){return <div className="loading"><LoaderCircle size={20} className="animate-spin"/>Loading your workspace…</div>;}
export function Empty({title,message,children}:{title:string;message:string;children?:ReactNode}){return <div className="empty-state"><Package size={32}/><h3>{title}</h3><p className="text-xs mb-4">{message}</p>{children}</div>;}
export function ErrorState({error,retry}:{error:Error;retry:()=>void}){return <div className="empty-state"><TriangleAlert size={30}/><h3>Something didn’t load</h3><p className="mb-4">{error.message}</p><Button variant="outline" onClick={retry}>Try again</Button></div>;}
export function Footer(){return <footer className="footer-note"><span><Shield size={12}/>Dates inform decisions. Always check the packaging and product condition.</span><span><FlaskConical size={12}/>Demo mode · Data resets on refresh</span></footer>;}

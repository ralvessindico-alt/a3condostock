import React, { useState, useEffect, useCallback } from "react";

// ── SUPABASE CONFIG ────────────────────────────────────────────────────────────
const SUPA_URL  = "https://syfoeoncyjhkdvpmhlew.supabase.co";
const SUPA_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Zm9lb25jeWpoa2R2cG1obGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDk5NTYsImV4cCI6MjA5NTAyNTk1Nn0.HmkufeiRXKHbwz1CmnqrUpicE6W6Oy0_ouyFKIiPXbs";

async function supaFetch(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": SUPA_KEY,
    "Authorization": `Bearer ${token || SUPA_KEY}`,
    ...options.headers,
  };
  const res = await fetch(`${SUPA_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error_description || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function signIn(email, password) {
  const data = await supaFetch("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return data;
}

// ── LOGO ───────────────────────────────────────────────────────────────────────
const LOGO = "data:image/png;base64,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";

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#1C1E22",surface:"#25282E",surfaceHigh:"#2E3138",border:"#3A3D45",
  text:"#E8E9EB",textMid:"#9CA3AF",textDim:"#636875",
  yellow:"#F5C518",blue:"#3B82F6",danger:"#EF4444",success:"#22C55E",warning:"#F59E0B",
};
const S = {
  app:{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",color:C.text},
  loginWrap:{minHeight:"100vh",background:"linear-gradient(135deg,#1C1E22 60%,#22252C 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:24},
  loginCard:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,padding:"48px 40px",width:"100%",maxWidth:400,boxShadow:"0 24px 64px rgba(0,0,0,.5)"},
  shell:{display:"flex",height:"100vh",overflow:"hidden"},
  sidebar:{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0},
  sideHeader:{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`},
  nav:{flex:1,padding:"12px 0",overflowY:"auto"},
  navLabel:{fontSize:10,fontWeight:700,color:C.textDim,letterSpacing:1.5,textTransform:"uppercase",padding:"10px 20px 4px"},
  navItem:{display:"flex",alignItems:"center",gap:10,padding:"9px 20px",fontSize:13,fontWeight:500,color:C.textMid,cursor:"pointer",borderLeft:"3px solid transparent"},
  navActive:{color:C.text,borderLeftColor:C.yellow,background:`${C.yellow}10`},
  main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
  topbar:{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"16px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0},
  content:{flex:1,overflowY:"auto",padding:28},
  card:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20},
  cardGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24},
  section:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",marginBottom:20},
  sectionHead:{padding:"14px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"},
  table:{width:"100%",borderCollapse:"collapse"},
  th:{textAlign:"left",fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",padding:"10px 14px",borderBottom:`1px solid ${C.border}`},
  td:{padding:"11px 14px",fontSize:13,borderBottom:`1px solid ${C.border}22`,verticalAlign:"middle"},
  overlay:{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20},
  modal:{background:C.surface,border:`1px solid ${C.border}`,borderRadius:16,width:"100%",maxWidth:520,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 32px 80px rgba(0,0,0,.6)"},
  modalHead:{padding:"18px 24px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"},
  modalBody:{padding:24},
  modalFoot:{padding:"14px 24px",borderTop:`1px solid ${C.border}`,display:"flex",gap:10,justifyContent:"flex-end"},
  label:{display:"block",fontSize:11,fontWeight:700,color:C.textMid,marginBottom:5,letterSpacing:.5,textTransform:"uppercase"},
  input:{width:"100%",background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 13px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box"},
  select:{width:"100%",background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 13px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",appearance:"none"},
  btnYellow:{background:C.yellow,color:"#111",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:700,fontSize:13,cursor:"pointer"},
  btnPrimary:{background:C.blue,color:"#fff",border:"none",borderRadius:8,padding:"10px 18px",fontWeight:600,fontSize:13,cursor:"pointer"},
  btnSecondary:{background:C.surfaceHigh,color:C.text,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 18px",fontWeight:600,fontSize:13,cursor:"pointer"},
  btnSmall:{background:C.surfaceHigh,color:C.textMid,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 11px",fontWeight:600,fontSize:12,cursor:"pointer"},
};
function bdg(color){return{display:"inline-block",background:`${color}22`,color,borderRadius:5,padding:"2px 8px",fontSize:11,fontWeight:700};}
function fmtR(n){return"R$ "+new Intl.NumberFormat("pt-BR",{minimumFractionDigits:2}).format(n||0);}

const CATEGORIES=["Limpeza","Descartáveis","Piscina","Jardinagem","Manutenção","Estética"];
const LEAD_TIMES={"Limpeza":7,"Descartáveis":7,"Piscina":10,"Jardinagem":14,"Manutenção":10,"Estética":7};

// ── CALC UTILS ─────────────────────────────────────────────────────────────────
function calcStock(item,movs){
  const mv=(movs||[]).filter(m=>m.item_id===item.id&&m.client_id===item.client_id);
  return mv.filter(m=>m.type==="entrada").reduce((s,m)=>s+Number(m.qty),0)
        -mv.filter(m=>m.type==="saida").reduce((s,m)=>s+Number(m.qty),0)
        +mv.filter(m=>m.type==="ajuste").reduce((s,m)=>s+Number(m.qty),0);
}
function calcAvgConsumption(item,movs){
  const cutoff=new Date(); cutoff.setDate(cutoff.getDate()-30);
  return (movs||[]).filter(m=>m.item_id===item.id&&m.client_id===item.client_id&&m.type==="saida"&&new Date(m.date)>=cutoff).reduce((s,m)=>s+Number(m.qty),0);
}
function calcAvgPrice(item,movs){
  const e=(movs||[]).filter(m=>m.item_id===item.id&&m.client_id===item.client_id&&m.type==="entrada"&&m.price);
  if(!e.length)return Number(item.avg_price)||0;
  const qty=e.reduce((s,m)=>s+Number(m.qty),0);
  return qty?Math.round(e.reduce((s,m)=>s+Number(m.qty)*Number(m.price),0)/qty*100)/100:Number(item.avg_price)||0;
}
function calcSuggestedOrder(item,movs){return Math.max(0,item.stock_max-calcStock(item,movs));}
function calcSuggestedMin(item,movs){
  const m=calcAvgConsumption(item,movs);
  return m?Math.ceil(m/30*(LEAD_TIMES[item.category]||7)):null;
}
function calcSuggestedMax(item,movs){
  const m=calcAvgConsumption(item,movs);
  if(!m)return null;
  return Math.ceil(m*2+(calcSuggestedMin(item,movs)||0));
}

// ── LOADING / ERROR ────────────────────────────────────────────────────────────
function Spinner(){
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",gap:10,color:C.textMid}}>
      <div style={{width:20,height:20,border:`3px solid ${C.border}`,borderTopColor:C.yellow,borderRadius:"50%",animation:"spin 0.8s linear infinite"}}></div>
      <span style={{fontSize:14}}>Carregando...</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
function ErrBox({msg,retry}){
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",gap:12}}>
      <div style={{color:C.danger,fontSize:14}}>{msg}</div>
      {retry&&<button style={S.btnSmall} onClick={retry}>Tentar novamente</button>}
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  async function go(){
    if(!email||!pass)return;
    setLoading(true);setErr("");
    try{
      const data=await signIn(email,pass);
      const meta=data.user?.user_metadata||{};
      onLogin({
        id:data.user.id,
        token:data.access_token,
        name:meta.name||email,
        role:meta.role||"zelador",
        clientId:meta.client_id||null,
        email,
      });
    }catch(e){setErr(e.message||"Credenciais inválidas");}
    finally{setLoading(false);}
  }
  return(
    <div style={S.loginWrap}>
      <div style={S.loginCard}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
          <img src={LOGO} style={{width:44,height:44,objectFit:"contain"}} alt="A3"/>
          <div>
            <div style={{fontSize:22,fontWeight:700,letterSpacing:-0.5}}>CondoStock</div>
            <div style={{fontSize:10,color:C.textDim,letterSpacing:2,textTransform:"uppercase"}}>Gestão de Estoque</div>
          </div>
        </div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>E-mail</label>
          <input style={S.input} type="email" placeholder="seu@email.com.br" value={email}
            onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={S.label}>Senha</label>
          <input style={S.input} type="password" placeholder="Senha" value={pass}
            onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()}/>
        </div>
        {err&&<div style={{color:C.danger,fontSize:13,marginBottom:10}}>{err}</div>}
        <button style={{...S.btnYellow,width:"100%",padding:14,fontSize:15,opacity:loading?0.7:1}} onClick={go} disabled={loading}>
          {loading?"Entrando...":"Entrar"}
        </button>
      </div>
    </div>
  );
}

// ── SHELL ──────────────────────────────────────────────────────────────────────
function Shell({user,page,setPage,onLogout,clients,children,requisitions}){
  const client=user.clientId?clients.find(c=>c.id===user.clientId):null;
  const rl={zelador:"Zelador",compras:"Compras",supervisor:"Supervisor"}[user.role]||user.role;
  const nav=[
    {id:"dashboard",label:"Dashboard",icon:"⊞"},
    {id:"items",label:"Catálogo",icon:"◫"},
    {id:"entry",label:"Entrada",icon:"↓"},
    {id:"exit",label:"Saída",icon:"↑"},
    {id:"adjust",label:"Ajuste",icon:"⇅"},
    {id:"history",label:"Histórico",icon:"◷"},
    {id:"requisitions",label:"Requisições",icon:"📋",badge:requisitions?.filter(r=>r.status==="enviada").length||0},
    ...(user.role!=="zelador"?[{id:"order",label:"Pedido Sugerido",icon:"◉"}]:[]),
    ...(user.role==="supervisor"?[{id:"report",label:"Rel. Gerencial",icon:"≡"}]:[]),
    ...(user.role==="supervisor"?[{id:"clients",label:"Clientes",icon:"◈"}]:[]),
    ...(user.role==="supervisor"?[{id:"suppliers",label:"Fornecedores",icon:"◆"}]:[]),
  ];
  return(
    <div style={S.shell}>
      <div style={S.sidebar}>
        <div style={S.sideHeader}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
            <img src={LOGO} style={{width:44,height:44,objectFit:"contain"}} alt="A3"/>
            <div>
              <div style={{fontSize:15,fontWeight:700}}>CondoStock</div>
              <div style={{fontSize:10,color:C.textDim,letterSpacing:1,textTransform:"uppercase"}}>v2.0</div>
            </div>
          </div>
          <div style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 11px"}}>
            <div style={{fontSize:10,color:C.textDim}}>{rl}</div>
            <div style={{fontSize:12,fontWeight:600,color:C.yellow}}>{client?client.name:"Todos os clientes"}</div>
          </div>
        </div>
        <nav style={S.nav}>
          <div style={S.navLabel}>Menu</div>
          {nav.map(n=>(
            <div key={n.id} style={{...S.navItem,...(page===n.id?S.navActive:{})}} onClick={()=>setPage(n.id)}>
              <span style={{fontSize:15}}>{n.icon}</span><span style={{flex:1}}>{n.label}</span>{n.badge>0&&<span style={{background:C.warning,color:"#111",borderRadius:10,fontSize:10,fontWeight:800,padding:"1px 6px"}}>{n.badge}</span>}
            </div>
          ))}
        </nav>
        <div style={{padding:16,borderTop:`1px solid ${C.border}`}}>
          <div style={{fontSize:12,color:C.textMid,marginBottom:4}}>{user.name}</div>
          <div style={{fontSize:11,color:C.textDim,marginBottom:8}}>{user.email}</div>
          <button style={{...S.btnSmall,width:"100%"}} onClick={onLogout}>Sair →</button>
        </div>
      </div>
      <div style={S.main}>{children}</div>
    </div>
  );
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
function Dashboard({user,items,movements,clients}){
  const myItems=user.clientId?items.filter(i=>i.client_id===user.clientId):items;
  const sd=myItems.map(item=>({...item,current:calcStock(item,movements),avgPrice:calcAvgPrice(item,movements)}));
  const neg=sd.filter(i=>i.current<0);
  const alerts=sd.filter(i=>i.current>=0&&i.current<=i.stock_min);
  const ok=sd.filter(i=>i.current>i.stock_min);
  const totalVal=sd.reduce((s,i)=>s+Math.max(0,i.current)*i.avgPrice,0);
  const pendMin=myItems.filter(item=>{const sg=calcSuggestedMin(item,movements);return sg!==null&&sg!==item.stock_min;});
  const cn=user.clientId?clients.find(c=>c.id===user.clientId)?.name:"Todos os clientes";
  const today=new Date().toLocaleDateString("pt-BR");
  return(
    <>
      <div style={S.topbar}>
        <div>
          <div style={{fontSize:18,fontWeight:700}}>Dashboard</div>
          <div style={{fontSize:12,color:C.textMid,marginTop:2}}>{cn} · {today}</div>
        </div>
      </div>
      <div style={S.content}>
        {neg.length>0&&(
          <div style={{background:"#7F1D1D22",border:`1px solid ${C.danger}88`,borderRadius:10,padding:16,marginBottom:16,display:"flex",gap:12}}>
            <span style={{fontSize:20}}>🚨</span>
            <div>
              <div style={{fontWeight:700,color:C.danger,marginBottom:6}}>Estoque negativo — corrija com urgência!</div>
              {neg.map(i=>(
                <div key={i.id+"-"+i.client_id} style={{fontSize:13,color:"#FCA5A5",marginBottom:2}}>· <strong>{i.name}</strong>: <strong>{i.current} un</strong></div>
              ))}
            </div>
          </div>
        )}
        {pendMin.length>0&&(
          <div style={{background:`${C.warning}18`,border:`1px solid ${C.warning}55`,borderRadius:10,padding:14,marginBottom:16,display:"flex",gap:10}}>
            <span style={{fontSize:18}}>⚡</span>
            <div>
              <div style={{fontWeight:700,color:C.warning,marginBottom:4}}>{pendMin.length} item(s) com mínimo desatualizado</div>
              <div style={{fontSize:12,color:C.textMid}}>Acesse o Catálogo para revisar e aprovar.</div>
            </div>
          </div>
        )}
        <div style={S.cardGrid}>
          {[["Total Itens",myItems.length,"itens cadastrados",C.blue],["OK",ok.length,"acima do mínimo",C.success],["Alertas",alerts.length,"abaixo do mínimo",alerts.length>0?C.danger:C.success],["Negativos",neg.length,"requerem ajuste",neg.length>0?C.danger:C.textDim]].map(([l,v,s,col])=>(
            <div key={l} style={S.card}>
              <div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{l}</div>
              <div style={{fontSize:28,fontWeight:800,color:col,letterSpacing:-1}}>{v}</div>
              <div style={{fontSize:12,color:C.textMid,marginTop:4}}>{s}</div>
            </div>
          ))}
          <div style={S.card}>
            <div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Valor em Estoque</div>
            <div style={{fontSize:22,fontWeight:800,color:C.yellow}}>{fmtR(totalVal)}</div>
            <div style={{fontSize:12,color:C.textMid,marginTop:4}}>preço médio ponderado</div>
          </div>
        </div>
        {alerts.length>0&&(
          <div style={S.section}>
            <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700,color:C.danger}}>⚠ Estoque Baixo</div></div>
            <table style={S.table}>
              <thead><tr><th style={S.th}>Item</th><th style={S.th}>Categoria</th><th style={S.th}>Atual</th><th style={S.th}>Mínimo</th><th style={S.th}>Pedido Sugerido</th></tr></thead>
              <tbody>
                {alerts.map(item=>(
                  <tr key={item.id+"-"+item.client_id}>
                    <td style={S.td}><strong>{item.name}</strong><br/><span style={{fontSize:11,color:C.textDim}}>{item.code}</span></td>
                    <td style={S.td}><span style={bdg(C.blue)}>{item.category}</span></td>
                    <td style={S.td}><span style={{color:C.danger,fontWeight:700}}>{item.current} un</span></td>
                    <td style={S.td}>{item.stock_min}</td>
                    <td style={S.td}><span style={{color:C.yellow,fontWeight:700}}>{calcSuggestedOrder(item,movements)} un</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={S.section}>
          <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Resumo por Categoria</div></div>
          <div style={{padding:16,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:10}}>
            {CATEGORIES.map(cat=>{
              const ci=sd.filter(i=>i.category===cat);
              const ca=ci.filter(i=>i.current<=i.stock_min).length;
              return(<div key={cat} style={{background:C.surfaceHigh,borderRadius:10,padding:14,border:`1px solid ${ca>0?C.danger+"44":C.border}`}}><div style={{fontSize:11,color:C.textDim,marginBottom:4}}>{cat}</div><div style={{fontSize:20,fontWeight:800}}>{ci.length}</div><div style={{fontSize:11,color:ca>0?C.danger:C.success,marginTop:4}}>{ca>0?`${ca} alerta(s)`:"OK"}</div></div>);
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ── ITEMS PAGE ─────────────────────────────────────────────────────────────────
function ItemsPage({user,items,setItems,movements,setMovements,clients,token}){
  const [filter,setFilter]=useState("Todos");
  const [search,setSearch]=useState("");
  const [sel,setSel]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const my=user.clientId?items.filter(i=>i.client_id===user.clientId):items;
  const filtered=my.filter(i=>filter==="Todos"||i.category===filter).filter(i=>i.name.toLowerCase().includes(search.toLowerCase())||i.code.toLowerCase().includes(search.toLowerCase()));
  return(
    <>
      <div style={S.topbar}>
        <div><div style={{fontSize:18,fontWeight:700}}>Catálogo de Itens</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{filtered.length} itens</div></div>
        {user.role!=="zelador"&&<button style={S.btnYellow} onClick={()=>setShowNew(true)}>+ Novo Item</button>}
      </div>
      <div style={S.content}>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          <input style={{...S.input,flex:1,minWidth:180}} placeholder="Buscar nome ou código..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <select style={{...S.select,width:"auto",minWidth:130}} value={filter} onChange={e=>setFilter(e.target.value)}><option>Todos</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div style={S.section}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Código</th><th style={S.th}>Item</th><th style={S.th}>Categoria</th>
              <th style={S.th}>Tipo</th><th style={S.th}>Atual</th><th style={S.th}>Mín/Máx</th>
              <th style={S.th}>Mín Sugerido</th><th style={S.th}>Preço Médio</th>
            </tr></thead>
            <tbody>
              {filtered.map(item=>{
                const cur=calcStock(item,movements);
                const ap=calcAvgPrice(item,movements);
                const sg=calcSuggestedMin(item,movements);
                const sc=cur<0?C.danger:cur<=item.stock_min?C.warning:C.success;
                return(
                  <tr key={item.id+"-"+item.client_id} style={{cursor:"pointer"}} onClick={()=>setSel(item)}>
                    <td style={{...S.td,color:C.textDim,fontSize:11}}>{item.code}</td>
                    <td style={S.td}><strong>{item.name}</strong>{item.children&&item.children.length>0&&<div style={{fontSize:11,color:C.textDim}}>{item.children.length} variante(s)</div>}</td>
                    <td style={S.td}><span style={bdg(C.blue)}>{item.category}</span></td>
                    <td style={S.td}><span style={bdg(item.type==="periodico"?C.success:C.blue)}>{item.type==="periodico"?"Periódico":"Demanda"}</span></td>
                    <td style={S.td}><strong style={{color:sc}}>{cur} un</strong></td>
                    <td style={{...S.td,color:C.textMid}}>{item.stock_min}/{item.stock_max}</td>
                    <td style={S.td}>{sg===null?<span style={{color:C.textDim,fontSize:11}}>sem dados</span>:sg!==item.stock_min?<span style={{color:C.warning,fontWeight:700}}>{sg} ⚠</span>:<span style={{color:C.success}}>{sg} ✓</span>}</td>
                    <td style={S.td}>{fmtR(ap)}</td>
                  </tr>
                );
              })}
              {filtered.length===0&&<tr><td colSpan={8} style={{...S.td,textAlign:"center",color:C.textDim,padding:32}}>Nenhum item cadastrado ainda</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {sel&&<ItemDetail item={sel} items={items} setItems={setItems} movements={movements} clients={clients} token={token} user={user} onClose={()=>setSel(null)}/>}
      {showNew&&<NewItemModal user={user} items={items} setItems={setItems} clients={clients} token={token} onClose={()=>setShowNew(false)}/>}
    </>
  );
}

// ── ITEM DETAIL ────────────────────────────────────────────────────────────────
function ItemDetail({item,items,setItems,movements,clients,token,user,onClose}){
  const [showEdit,setShowEdit]=useState(false);
  const [saving,setSaving]=useState(false);
  const [confirmDelete,setConfirmDelete]=useState(false);

  async function deleteItem(){
    const hasMov=(movements||[]).some(m=>m.item_id===item.id&&m.client_id===item.client_id);
    if(hasMov){alert("Este item possui movimentações e não pode ser excluído.\nUse o Ajuste para zerar o estoque se necessário.");return;}
    setSaving(true);
    try{
      await supaFetch(`/rest/v1/items?id=eq.${item.id}&client_id=eq.${item.client_id}`,{method:"DELETE"},token);
      setItems(items.filter(i=>!(i.id===item.id&&i.client_id===item.client_id)));
      onClose();
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }
  const current=calcStock(item,movements);
  const avgPrice=calcAvgPrice(item,movements);
  const suggMin=calcSuggestedMin(item,movements);
  const suggMax=calcSuggestedMax(item,movements);
  const lt=LEAD_TIMES[item.category]||7;
  const mv=(movements||[]).filter(m=>m.item_id===item.id&&m.client_id===item.client_id).slice(-10).reverse();
  const tc={entrada:C.success,saida:C.danger,ajuste:C.warning};

  async function approveMin(){
    setSaving(true);
    try{
      await supaFetch(`/rest/v1/items?id=eq.${item.id}&client_id=eq.${item.client_id}`,{method:"PATCH",body:JSON.stringify({stock_min:suggMin})},token);
      setItems(items.map(i=>i.id===item.id&&i.client_id===item.client_id?{...i,stock_min:suggMin}:i));
      onClose();
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }
  async function approveMax(){
    setSaving(true);
    try{
      await supaFetch(`/rest/v1/items?id=eq.${item.id}&client_id=eq.${item.client_id}`,{method:"PATCH",body:JSON.stringify({stock_max:suggMax})},token);
      setItems(items.map(i=>i.id===item.id&&i.client_id===item.client_id?{...i,stock_max:suggMax}:i));
      onClose();
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }

  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}>
          <div><div style={{fontWeight:700,fontSize:16}}>{item.name}</div><div style={{fontSize:12,color:C.textDim}}>{item.code} · {item.category}</div></div>
          <div style={{display:"flex",gap:8}}>
            {user&&user.role!=="zelador"&&<button style={S.btnSmall} onClick={()=>setShowEdit(true)}>Editar</button>}
            {user&&user.role==="supervisor"&&!confirmDelete&&<button style={{...S.btnSmall,color:C.danger,borderColor:`${C.danger}55`}} onClick={()=>setConfirmDelete(true)}>Excluir</button>}
            {confirmDelete&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:C.danger}}>Confirma?</span><button style={{...S.btnSmall,background:C.danger,color:"#fff",border:"none"}} onClick={deleteItem} disabled={saving}>Sim</button><button style={S.btnSmall} onClick={()=>setConfirmDelete(false)}>Não</button></div>}
            <button style={S.btnSmall} onClick={onClose}>✕</button>
          </div>
        </div>
        <div style={S.modalBody}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[["Atual",`${current} un`,current<0?C.danger:current<=item.stock_min?C.warning:C.success],["Preço Médio",fmtR(avgPrice),C.yellow],["Pedido Sugerido",`${calcSuggestedOrder(item,movements)} un`,C.blue]].map(([l,v,col])=>(
              <div key={l} style={{background:C.surfaceHigh,borderRadius:8,padding:12}}><div style={{fontSize:10,color:C.textDim,marginBottom:3}}>{l}</div><div style={{fontSize:15,fontWeight:800,color:col}}>{v}</div></div>
            ))}
          </div>
          {suggMin!==null&&suggMin!==item.stock_min&&(
            <div style={{background:`${C.warning}18`,border:`1px solid ${C.warning}55`,borderRadius:8,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700,color:C.warning}}>Mínimo sugerido: {suggMin} un</div><div style={{fontSize:11,color:C.textMid}}>Lead time {lt}d · Atual: {item.stock_min} un</div></div>
              <button style={{...S.btnSmall,color:C.warning}} onClick={approveMin} disabled={saving}>Aprovar</button>
            </div>
          )}
          {suggMax!==null&&suggMax!==item.stock_max&&(
            <div style={{background:`${C.blue}18`,border:`1px solid ${C.blue}44`,borderRadius:8,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:12,fontWeight:700,color:C.blue}}>Máximo sugerido: {suggMax} un</div><div style={{fontSize:11,color:C.textMid}}>Atual: {item.stock_max} un</div></div>
              <button style={{...S.btnSmall,color:C.blue}} onClick={approveMax} disabled={saving}>Aprovar</button>
            </div>
          )}
          {item.children&&item.children.length>0&&(
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:C.textMid,marginBottom:6}}>VARIANTES</div>
              {item.children.map((c,i)=><div key={i} style={{fontSize:13,padding:"5px 0",borderBottom:`1px solid ${C.border}22`,color:C.textMid}}>· {c}</div>)}
            </div>
          )}
          <div style={{fontSize:11,fontWeight:700,color:C.textMid,marginBottom:8}}>ÚLTIMAS MOVIMENTAÇÕES</div>
          <table style={S.table}>
            <thead><tr><th style={S.th}>Data</th><th style={S.th}>Tipo</th><th style={S.th}>Qtd</th><th style={S.th}>Responsável</th></tr></thead>
            <tbody>
              {mv.map(m=>(
                <tr key={m.id}><td style={S.td}>{m.date}</td><td style={S.td}><span style={bdg(tc[m.type]||C.textDim)}>{m.type}</span></td><td style={S.td}>{m.type==="ajuste"&&Number(m.qty)>0?"+":""}{m.qty} un</td><td style={S.td}>{m.user_name}</td></tr>
              ))}
              {mv.length===0&&<tr><td colSpan={4} style={{...S.td,textAlign:"center",color:C.textDim}}>Sem movimentações</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showEdit&&<EditItemModal item={item} items={items} setItems={setItems} token={token} onClose={()=>setShowEdit(false)}/>}
    </div>
  );
}

// ── EDIT ITEM MODAL ────────────────────────────────────────────────────────────
function EditItemModal({item,items,setItems,token,onClose}){
  const [name,setName]=useState(item.name);
  const [code,setCode]=useState(item.code);
  const [cat,setCat]=useState(item.category);
  const [type,setType]=useState(item.type);
  const [sMin,setSMin]=useState(String(item.stock_min));
  const [sMax,setSMax]=useState(String(item.stock_max));
  const [children,setChildren]=useState(item.children||[]);
  const [nc,setNc]=useState("");
  const [err,setErr]=useState("");
  const [saving,setSaving]=useState(false);

  async function save(){
    if(!name||!code||!sMin||!sMax){setErr("Preencha todos os campos.");return;}
    if(parseInt(sMax)<=parseInt(sMin)){setErr("Máximo deve ser maior que mínimo.");return;}
    setSaving(true);
    try{
      const upd={name,code:code.toUpperCase(),category:cat,type,stock_min:parseInt(sMin),stock_max:parseInt(sMax),children};
      await supaFetch(`/rest/v1/items?id=eq.${item.id}&client_id=eq.${item.client_id}`,{method:"PATCH",body:JSON.stringify(upd)},token);
      setItems(items.map(i=>i.id===item.id&&i.client_id===item.client_id?{...i,...upd}:i));
      onClose();
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  }
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}><div style={{fontWeight:700,fontSize:16}}>Editar Item</div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
        <div style={S.modalBody}>
          {err&&<div style={{background:`${C.danger}22`,border:`1px solid ${C.danger}`,borderRadius:8,padding:10,marginBottom:12,fontSize:13,color:C.danger}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12}}>
              <div><label style={S.label}>Código *</label><input style={S.input} value={code} onChange={e=>setCode(e.target.value)}/></div>
              <div><label style={S.label}>Nome *</label><input style={S.input} value={name} onChange={e=>setName(e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Categoria</label><select style={S.select} value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label style={S.label}>Tipo</label><select style={S.select} value={type} onChange={e=>setType(e.target.value)}><option value="periodico">Periódico</option><option value="demanda">Sob Demanda</option></select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Mínimo *</label><input style={S.input} type="number" value={sMin} onChange={e=>setSMin(e.target.value)}/></div>
              <div><label style={S.label}>Máximo *</label><input style={S.input} type="number" value={sMax} onChange={e=>setSMax(e.target.value)}/></div>
            </div>
            <div>
              <label style={S.label}>Variantes</label>
              <div style={{display:"flex",gap:8,marginBottom:8}}>
                <input style={{...S.input,flex:1}} placeholder="Descrição conforme NF..." value={nc} onChange={e=>setNc(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&nc.trim()){setChildren([...children,nc.trim()]);setNc("");}}}/>
                <button style={S.btnPrimary} onClick={()=>{if(nc.trim()){setChildren([...children,nc.trim()]);setNc("");}}} >+</button>
              </div>
              {children.map((c,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 10px",background:C.surfaceHigh,borderRadius:6,marginBottom:5,fontSize:13}}>
                  <span style={{color:C.textMid}}>· {c}</span>
                  <button style={{...S.btnSmall,color:C.danger,padding:"2px 7px"}} onClick={()=>setChildren(children.filter((_,j)=>j!==i))}>remover</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={S.modalFoot}><button style={S.btnSecondary} onClick={onClose}>Cancelar</button><button style={{...S.btnYellow,opacity:saving?0.7:1}} onClick={save} disabled={saving}>{saving?"Salvando...":"Salvar"}</button></div>
      </div>
    </div>
  );
}

// ── NEW ITEM MODAL ─────────────────────────────────────────────────────────────
function NewItemModal({user,items,setItems,clients,token,onClose}){
  const [cid,setCid]=useState(user.clientId||clients[0]?.id||1);
  const [code,setCode]=useState("");
  const [name,setName]=useState("");
  const [cat,setCat]=useState("Limpeza");
  const [type,setType]=useState("periodico");
  const [sMin,setSMin]=useState("");
  const [sMax,setSMax]=useState("");
  const [childText,setChildText]=useState("");
  const [err,setErr]=useState("");
  const [saving,setSaving]=useState(false);

  async function save(){
    if(!code||!name||!sMin||!sMax){setErr("Código, nome, mínimo e máximo são obrigatórios.");return;}
    if(parseInt(sMax)<=parseInt(sMin)){setErr("Máximo deve ser maior que mínimo.");return;}
    const ch=childText.split("\n").map(s=>s.trim()).filter(Boolean);
    setSaving(true);
    try{
      const body={code:code.toUpperCase(),name,category:cat,unit:"un",type,stock_min:parseInt(sMin),stock_max:parseInt(sMax),client_id:parseInt(cid),avg_price:0,children:ch};
      const res=await supaFetch("/rest/v1/items",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(body)},token);
      setItems([...items,...(Array.isArray(res)?res:[res])]);
      onClose();
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  }
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}><div><div style={{fontWeight:700,fontSize:16}}>Novo Item</div><div style={{fontSize:12,color:C.textDim}}>Item pai — descrição genérica</div></div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
        <div style={S.modalBody}>
          {err&&<div style={{background:`${C.danger}22`,border:`1px solid ${C.danger}`,borderRadius:8,padding:10,marginBottom:12,fontSize:13,color:C.danger}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            {!user.clientId&&<div><label style={S.label}>Condomínio</label><select style={S.select} value={cid} onChange={e=>setCid(e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12}}>
              <div><label style={S.label}>Código *</label><input style={S.input} placeholder="LMP001" value={code} onChange={e=>{setCode(e.target.value);setErr("");}}/></div>
              <div><label style={S.label}>Nome *</label><input style={S.input} placeholder="Ex: Água Sanitária 5L" value={name} onChange={e=>{setName(e.target.value);setErr("");}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Categoria</label><select style={S.select} value={cat} onChange={e=>setCat(e.target.value)}>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></div>
              <div><label style={S.label}>Tipo</label><select style={S.select} value={type} onChange={e=>setType(e.target.value)}><option value="periodico">Periódico</option><option value="demanda">Sob Demanda</option></select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Mínimo (un) *</label><input style={S.input} type="number" placeholder="10" value={sMin} onChange={e=>{setSMin(e.target.value);setErr("");}}/></div>
              <div><label style={S.label}>Máximo (un) *</label><input style={S.input} type="number" placeholder="40" value={sMax} onChange={e=>{setSMax(e.target.value);setErr("");}}/></div>
            </div>
            <div><label style={S.label}>Variantes (uma por linha)</label><textarea style={{...S.input,height:65,resize:"vertical",fontFamily:"inherit"}} placeholder={"Álcool Ypê 5L\nÁlcool Brilux 5L"} value={childText} onChange={e=>setChildText(e.target.value)}></textarea></div>
            <div style={{background:C.surfaceHigh,borderRadius:8,padding:10,fontSize:12,color:C.textMid}}>Lead time: <strong style={{color:C.text}}>{LEAD_TIMES[cat]||7} dias</strong> · {cat}</div>
          </div>
        </div>
        <div style={S.modalFoot}><button style={S.btnSecondary} onClick={onClose}>Cancelar</button><button style={{...S.btnYellow,opacity:saving?0.7:1}} onClick={save} disabled={saving}>{saving?"Salvando...":"Salvar Item"}</button></div>
      </div>
    </div>
  );
}

// ── MOVEMENT PAGE ──────────────────────────────────────────────────────────────
function MovementPage({user,items,movements,setMovements,clients,token,type}){
  const [cid,setCid]=useState(user.clientId||clients[0]?.id||1);
  const [iid,setIid]=useState("");
  const [qty,setQty]=useState("");
  const [price,setPrice]=useState("");
  const [nf,setNf]=useState("");
  const [obs,setObs]=useState("");
  const [ok,setOk]=useState(false);
  const [saving,setSaving]=useState(false);
  const isE=type==="entrada";
  const ac=isE?C.success:C.danger;
  const ci=items.filter(i=>i.client_id===parseInt(cid));
  const si=ci.find(i=>i.id===parseInt(iid));
  const today=new Date().toISOString().slice(0,10);

  async function sub(){
    if(!iid||!qty)return;
    setSaving(true);
    try{
      const body={item_id:parseInt(iid),client_id:parseInt(cid),type,qty:parseFloat(qty),price:price?parseFloat(price):null,date:today,user_name:user.name,nf:nf||null,obs:obs||null};
      const res=await supaFetch("/rest/v1/movements",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(body)},token);
      setMovements([...movements,...(Array.isArray(res)?res:[res])]);
      setQty("");setPrice("");setNf("");setObs("");setIid("");setOk(true);
      setTimeout(()=>setOk(false),3000);
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }
  return(
    <>
      <div style={S.topbar}><div><div style={{fontSize:18,fontWeight:700,color:ac}}>{isE?"↓ Lançar Entrada":"↑ Lançar Saída"}</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{isE?"Registrar recebimento":"Registrar uso de material"}</div></div></div>
      <div style={S.content}>
        <div style={{maxWidth:560}}>
          <div style={{background:`${C.warning}18`,border:`1px solid ${C.warning}55`,borderRadius:8,padding:13,marginBottom:16,display:"flex",gap:10}}>
            <span style={{color:C.warning,flexShrink:0}}>⚠</span>
            <div style={{fontSize:13,color:C.warning,lineHeight:1.5}}><strong>Atenção:</strong> o sistema controla em unidades. Converta quantidades e preços antes de lançar.</div>
          </div>
          {ok&&<div style={{background:`${C.success}22`,border:`1px solid ${C.success}`,borderRadius:8,padding:12,marginBottom:14,color:C.success,fontWeight:600}}>✓ Movimentação registrada!</div>}
          <div style={S.section}>
            <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Dados da {isE?"Entrada":"Saída"}</div></div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:13}}>
              {!user.clientId&&<div><label style={S.label}>Condomínio</label><select style={S.select} value={cid} onChange={e=>{setCid(e.target.value);setIid("");}}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
              <div><label style={S.label}>Item</label><select style={S.select} value={iid} onChange={e=>setIid(e.target.value)}><option value="">Selecione o item...</option>{ci.map(i=><option key={i.id} value={i.id}>{i.name} ({i.code})</option>)}</select></div>
              <div style={{display:"grid",gridTemplateColumns:isE?"1fr 1fr":"1fr",gap:12}}>
                <div><label style={S.label}>Quantidade (un)</label><input style={S.input} type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)}/></div>
                {isE&&<div><label style={S.label}>Preço Unitário (R$)</label><input style={S.input} type="number" placeholder="0,00" value={price} onChange={e=>setPrice(e.target.value)}/></div>}
              </div>
              {isE&&<div><label style={S.label}>Número da NF</label><input style={S.input} placeholder="NF-123" value={nf} onChange={e=>setNf(e.target.value)}/></div>}
              <div><label style={S.label}>Observação</label><input style={S.input} placeholder="Opcional..." value={obs} onChange={e=>setObs(e.target.value)}/></div>
              {si&&<div style={{background:C.surfaceHigh,borderRadius:8,padding:12,fontSize:13,display:"flex",gap:20}}><span><span style={{color:C.textDim}}>Atual: </span><strong>{calcStock(si,movements)} un</strong></span><span><span style={{color:C.textDim}}>Mín: </span>{si.stock_min}</span><span><span style={{color:C.textDim}}>Máx: </span>{si.stock_max}</span></div>}
              <button style={{...S.btnYellow,background:ac,color:"#fff",width:"100%",opacity:saving?0.7:1}} onClick={sub} disabled={saving}>{saving?"Salvando...":"Confirmar "+( isE?"Entrada":"Saída")}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── ADJUST PAGE ────────────────────────────────────────────────────────────────
function AdjustPage({user,items,movements,setMovements,clients,token}){
  const [cid,setCid]=useState(user.clientId||clients[0]?.id||1);
  const [iid,setIid]=useState("");
  const [dir,setDir]=useState("positivo");
  const [qty,setQty]=useState("");
  const [obs,setObs]=useState("");
  const [ok,setOk]=useState(false);
  const [saving,setSaving]=useState(false);
  const ci=items.filter(i=>i.client_id===parseInt(cid));
  const si=ci.find(i=>i.id===parseInt(iid));
  const can=iid&&qty&&obs;
  const today=new Date().toISOString().slice(0,10);

  async function sub(){
    if(!can)return;
    const sq=dir==="positivo"?parseFloat(qty):-parseFloat(qty);
    setSaving(true);
    try{
      const body={item_id:parseInt(iid),client_id:parseInt(cid),type:"ajuste",qty:sq,date:today,user_name:user.name,obs};
      const res=await supaFetch("/rest/v1/movements",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(body)},token);
      setMovements([...movements,...(Array.isArray(res)?res:[res])]);
      setQty("");setObs("");setIid("");setOk(true);setTimeout(()=>setOk(false),3000);
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }
  return(
    <>
      <div style={S.topbar}><div><div style={{fontSize:18,fontWeight:700,color:C.yellow}}>⇅ Lançar Ajuste</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>Não impacta consumo nem pedido sugerido</div></div></div>
      <div style={S.content}>
        <div style={{maxWidth:540}}>
          {ok&&<div style={{background:`${C.success}22`,border:`1px solid ${C.success}`,borderRadius:8,padding:12,marginBottom:14,color:C.success,fontWeight:600}}>✓ Ajuste registrado!</div>}
          <div style={S.section}>
            <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Dados do Ajuste</div></div>
            <div style={{padding:22,display:"flex",flexDirection:"column",gap:13}}>
              {!user.clientId&&<div><label style={S.label}>Condomínio</label><select style={S.select} value={cid} onChange={e=>{setCid(e.target.value);setIid("");}}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
              <div><label style={S.label}>Item</label><select style={S.select} value={iid} onChange={e=>setIid(e.target.value)}><option value="">Selecione...</option>{ci.map(i=>{const cur=calcStock(i,movements);return <option key={i.id} value={i.id}>{i.name} ({i.code}) — {cur} un{cur<0?" ⚠":""}</option>;})}</select></div>
              <div><label style={S.label}>Tipo</label><div style={{display:"flex",gap:10}}>{[["positivo","+ Adicionar",C.success],["negativo","− Remover",C.danger]].map(([val,label,col])=>(<div key={val} onClick={()=>setDir(val)} style={{flex:1,padding:"11px 14px",borderRadius:8,border:`2px solid ${dir===val?col:C.border}`,background:dir===val?`${col}18`:C.surfaceHigh,cursor:"pointer",fontSize:13,fontWeight:600,color:dir===val?col:C.textMid,textAlign:"center"}}>{label}</div>))}</div></div>
              <div><label style={S.label}>Quantidade (un)</label><input style={S.input} type="number" placeholder="0" value={qty} onChange={e=>setQty(e.target.value)}/></div>
              {si&&qty&&<div style={{background:C.surfaceHigh,borderRadius:8,padding:12,fontSize:13}}><span style={{color:C.textDim}}>Atual: </span><strong>{calcStock(si,movements)} un</strong><span style={{color:C.textDim}}> → após: </span><strong style={{color:C.yellow}}>{calcStock(si,movements)+(dir==="positivo"?parseFloat(qty||0):-parseFloat(qty||0))} un</strong></div>}
              <div><label style={S.label}>Motivo *</label><input style={S.input} placeholder="Ex: Inventário físico, item danificado..." value={obs} onChange={e=>setObs(e.target.value)}/></div>
              <button style={{...S.btnYellow,background:can?C.yellow:C.border,color:can?"#111":C.textDim,cursor:can?"pointer":"not-allowed",width:"100%",opacity:saving?0.7:1}} onClick={sub} disabled={saving||!can}>{saving?"Salvando...":"Confirmar Ajuste"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── HISTORY PAGE ───────────────────────────────────────────────────────────────
function HistoryPage({user,items,movements,clients}){
  const [cid,setCid]=useState(user.clientId||"todos");
  const [tf,setTf]=useState("todos");
  const [cf,setCf]=useState("Todos");
  const tc={entrada:C.success,saida:C.danger,ajuste:C.warning};
  const tl={entrada:"Entrada",saida:"Saída",ajuste:"Ajuste"};
  const enriched=(movements||[]).filter(m=>cid==="todos"||m.client_id===parseInt(cid)).filter(m=>tf==="todos"||m.type===tf).map(m=>{const item=items.find(i=>i.id===m.item_id&&i.client_id===m.client_id);const cl=clients.find(c=>c.id===m.client_id);return{...m,itemName:item?.name||"—",itemCode:item?.code||"—",category:item?.category||"—",clientName:cl?.name||"—"};}).filter(m=>cf==="Todos"||m.category===cf).sort((a,b)=>new Date(b.date)-new Date(a.date));
  return(
    <>
      <div style={S.topbar}><div><div style={{fontSize:18,fontWeight:700}}>◷ Histórico</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{enriched.length} registros</div></div></div>
      <div style={S.content}>
        <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
          {!user.clientId&&<select style={{...S.select,width:"auto"}} value={cid} onChange={e=>setCid(e.target.value)}><option value="todos">Todos os clientes</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>}
          <select style={{...S.select,width:"auto"}} value={tf} onChange={e=>setTf(e.target.value)}><option value="todos">Todos os tipos</option><option value="entrada">Entradas</option><option value="saida">Saídas</option><option value="ajuste">Ajustes</option></select>
          <select style={{...S.select,width:"auto"}} value={cf} onChange={e=>setCf(e.target.value)}><option>Todos</option>{CATEGORIES.map(c=><option key={c}>{c}</option>)}</select>
        </div>
        <div style={S.section}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Data</th>{!user.clientId&&<th style={S.th}>Condomínio</th>}
              <th style={S.th}>Tipo</th><th style={S.th}>Item</th><th style={S.th}>Categoria</th>
              <th style={S.th}>Qtd</th><th style={S.th}>Preço Un.</th><th style={S.th}>NF</th><th style={S.th}>Responsável</th>
            </tr></thead>
            <tbody>
              {enriched.map(m=>(
                <tr key={m.id}>
                  <td style={{...S.td,fontSize:12,color:C.textMid}}>{m.date}</td>
                  {!user.clientId&&<td style={{...S.td,fontSize:12}}>{m.clientName}</td>}
                  <td style={S.td}><span style={bdg(tc[m.type]||C.textDim)}>{tl[m.type]||m.type}</span></td>
                  <td style={S.td}><strong>{m.itemName}</strong><br/><span style={{fontSize:11,color:C.textDim}}>{m.itemCode}</span></td>
                  <td style={S.td}><span style={bdg(C.blue)}>{m.category}</span></td>
                  <td style={{...S.td,fontWeight:700,color:tc[m.type]}}>{m.type==="ajuste"&&Number(m.qty)>0?"+":""}{m.qty} un</td>
                  <td style={S.td}>{m.price?fmtR(m.price):"—"}</td>
                  <td style={{...S.td,fontSize:12,color:C.textMid}}>{m.nf||"—"}</td>
                  <td style={{...S.td,fontSize:12}}>{m.user_name}</td>
                </tr>
              ))}
              {enriched.length===0&&<tr><td colSpan={9} style={{...S.td,textAlign:"center",color:C.textDim,padding:32}}>Nenhuma movimentação encontrada</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── ORDER ITEM TABLE ───────────────────────────────────────────────────────────
function OrderItemTable({rows,showCheck,user,selectedDemand,toggleDemand,clients}){
  return(
    <table style={S.table}>
      <thead><tr>
        {showCheck&&<th style={S.th}></th>}
        {!user.clientId&&<th style={S.th}>Condomínio</th>}
        <th style={S.th}>Item</th><th style={S.th}>Categoria</th><th style={S.th}>Lead</th>
        <th style={S.th}>Atual</th><th style={S.th}>Mínimo</th><th style={S.th}>Sugerido</th>
        <th style={S.th}>Preço Médio</th><th style={S.th}>Custo</th>
      </tr></thead>
      <tbody>
        {rows.map(item=>{
          const key=item.id+"-"+item.client_id;
          const chk=!!(selectedDemand&&selectedDemand[key]);
          return(
            <tr key={key} style={{opacity:showCheck&&!chk?0.55:1}}>
              {showCheck&&<td style={S.td}><div onClick={()=>toggleDemand(item)} style={{width:18,height:18,borderRadius:4,border:`2px solid ${chk?C.yellow:C.border}`,background:chk?C.yellow:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#111",fontWeight:800}}>{chk?"✓":""}</div></td>}
              {!user.clientId&&<td style={S.td}>{clients.find(c=>c.id===item.client_id)?.name||"—"}</td>}
              <td style={S.td}><strong>{item.name}</strong><br/><span style={{color:C.textDim,fontSize:11}}>{item.code}</span></td>
              <td style={S.td}><span style={bdg(C.blue)}>{item.category}</span></td>
              <td style={{...S.td,fontSize:12,color:C.textMid}}>{item.leadTime}d</td>
              <td style={S.td}><span style={{color:C.danger,fontWeight:700}}>{item.current} un</span></td>
              <td style={S.td}>{item.stock_min}</td>
              <td style={S.td}><span style={{color:C.yellow,fontWeight:700}}>{item.suggested} un</span></td>
              <td style={S.td}>{fmtR(item.avgPrice)}</td>
              <td style={S.td}><strong>{fmtR(item.suggested*item.avgPrice)}</strong></td>
            </tr>
          );
        })}
        {rows.length===0&&<tr><td colSpan={10} style={{...S.td,textAlign:"center",color:C.textDim,padding:24}}>Nenhum item nesta seção</td></tr>}
      </tbody>
    </table>
  );
}

// ── ORDER PAGE ─────────────────────────────────────────────────────────────────
function OrderPage({user,items,movements,clients}){
  const [cid,setCid]=useState(user.clientId||"todos");
  const [showOrder,setShowOrder]=useState(false);
  const [selDem,setSelDem]=useState({});
  const filtered=cid==="todos"?items:items.filter(i=>i.client_id===parseInt(cid));
  const enriched=filtered.map(item=>({...item,current:calcStock(item,movements),suggested:calcSuggestedOrder(item,movements),avgPrice:calcAvgPrice(item,movements),leadTime:LEAD_TIMES[item.category]||7})).filter(i=>i.current<=i.stock_min);
  const per=enriched.filter(i=>i.type==="periodico");
  const dem=enriched.filter(i=>i.type==="demanda");
  const selDemItems=dem.filter(i=>selDem[i.id+"-"+i.client_id]);
  const allItems=[...per,...selDemItems];
  const total=allItems.reduce((s,i)=>s+i.suggested*i.avgPrice,0);
  function tog(item){const k=item.id+"-"+item.client_id;setSelDem(p=>({...p,[k]:!p[k]}));}
  return(
    <>
      <div style={S.topbar}>
        <div><div style={{fontSize:18,fontWeight:700}}>◉ Pedido Sugerido</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{per.length} periódico(s) · {selDemItems.length}/{dem.length} sob demanda</div></div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {!user.clientId&&<select style={{...S.select,width:"auto"}} value={cid} onChange={e=>setCid(e.target.value)}><option value="todos">Todos os clientes</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>}
          <button style={S.btnYellow} onClick={()=>setShowOrder(true)}>Gerar Pedido</button>
        </div>
      </div>
      <div style={S.content}>
        <div style={S.cardGrid}>
          <div style={S.card}><div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Periódicos</div><div style={{fontSize:24,fontWeight:800,color:C.success}}>{per.length}</div><div style={{fontSize:12,color:C.textMid,marginTop:4}}>automáticos</div></div>
          <div style={S.card}><div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Sob Demanda</div><div style={{fontSize:24,fontWeight:800,color:C.blue}}>{selDemItems.length}/{dem.length}</div><div style={{fontSize:12,color:C.textMid,marginTop:4}}>seleção manual</div></div>
          <div style={S.card}><div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>Previsão Total</div><div style={{fontSize:22,fontWeight:800,color:C.yellow}}>{fmtR(total)}</div></div>
        </div>
        <div style={S.section}><div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}><span style={{color:C.success}}>●</span> Periódicos</div></div><OrderItemTable rows={per} showCheck={false} user={user} selectedDemand={selDem} toggleDemand={tog} clients={clients}/></div>
        <div style={S.section}><div style={S.sectionHead}><div><div style={{fontSize:14,fontWeight:700}}><span style={{color:C.blue}}>●</span> Sob Demanda</div><div style={{fontSize:12,color:C.textDim,marginTop:2}}>Marque os itens que devem entrar no pedido</div></div></div><OrderItemTable rows={dem} showCheck={true} user={user} selectedDemand={selDem} toggleDemand={tog} clients={clients}/></div>
      </div>
      {showOrder&&<PurchaseOrderModal alerts={allItems} clientId={cid} clients={clients} onClose={()=>setShowOrder(false)}/>}
    </>
  );
}

// ── PURCHASE ORDER MODAL ───────────────────────────────────────────────────────
function PurchaseOrderModal({alerts,clientId,clients,onClose}){
  const cats=[...new Set(alerts.map(i=>i.category))];
  const [sc,setSc]=useState(cats[0]||"");
  const [od,setOd]=useState(Object.fromEntries(cats.map(cat=>[cat,{supplier:"",paymentTerms:"",deliveryDays:"",freight:"",minOrder:"",validity:"",obs:""}])));
  const cl=clientId!=="todos"?clients.find(c=>c.id===parseInt(clientId)):null;
  const ci=alerts.filter(i=>i.category===sc);
  const d=od[sc]||{};
  const sf=(f,v)=>setOd(p=>({...p,[sc]:{...p[sc],[f]:v}}));
  const sub=ci.reduce((s,i)=>s+i.suggested*i.avgPrice,0);
  const fv=parseFloat(d.freight)||0;
  const gt=cats.reduce((s,c)=>s+alerts.filter(i=>i.category===c).reduce((ss,i)=>ss+i.suggested*i.avgPrice,0)+(parseFloat(od[c]?.freight)||0),0);
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:700}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}><div><div style={{fontWeight:700,fontSize:16}}>Pedido de Compra</div><div style={{fontSize:12,color:C.textDim}}>{cats.length} categoria(s) · Total: {fmtR(gt)}</div></div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,padding:"0 20px",gap:4,overflowX:"auto"}}>
          {cats.map(cat=>{const s=alerts.filter(i=>i.category===cat).reduce((ss,i)=>ss+i.suggested*i.avgPrice,0);const a=cat===sc;return(<div key={cat} onClick={()=>setSc(cat)} style={{padding:"11px 14px",cursor:"pointer",borderBottom:`3px solid ${a?C.yellow:"transparent"}`,color:a?C.yellow:C.textMid,fontWeight:a?700:500,fontSize:13,whiteSpace:"nowrap",textAlign:"center"}}><div>{cat}</div><div style={{fontSize:10,color:a?C.yellow:C.textDim}}>{fmtR(s)}</div></div>);})}
        </div>
        <div style={S.modalBody}>
          <div style={{background:C.surfaceHigh,borderRadius:9,padding:13,marginBottom:16,border:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}>
            <div><div style={{fontSize:10,color:C.textDim}}>SOLICITANTE</div><div style={{fontWeight:700}}>A3 Condomínios</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:10,color:C.textDim}}>{cl?"CONDOMÍNIO":"ABRANGÊNCIA"}</div><div style={{fontWeight:700,fontSize:13}}>{cl?cl.name:"Todos os clientes"}</div>{cl&&<div style={{fontSize:11,color:C.textMid}}>{cl.cnpj}</div>}</div>
          </div>
          <div style={{fontSize:11,fontWeight:700,color:C.yellow,marginBottom:8,letterSpacing:1,textTransform:"uppercase"}}>Fornecedor — {sc}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {[["Fornecedor","supplier","Nome"],["Prazo Pagamento","paymentTerms","30/60 dias"],["Entrega (dias)","deliveryDays","7"],["Frete (R$)","freight","0,00"],["Pedido Mínimo","minOrder","R$ 500"],["Validade","validity",""]].map(([l,f,ph])=>(
              <div key={f}><label style={S.label}>{l}</label><input style={S.input} placeholder={ph} value={d[f]||""} onChange={e=>sf(f,e.target.value)}/></div>
            ))}
          </div>
          <table style={{...S.table,marginBottom:12}}>
            <thead><tr><th style={S.th}>Item</th><th style={S.th}>Código</th><th style={S.th}>Qtd</th><th style={S.th}>Preço Médio</th><th style={S.th}>Estimativa</th></tr></thead>
            <tbody>{ci.map(item=>(<tr key={item.id+"-"+item.client_id}><td style={S.td}><strong>{item.name}</strong></td><td style={{...S.td,fontSize:11,color:C.textDim}}>{item.code}</td><td style={{...S.td,color:C.yellow,fontWeight:700}}>{item.suggested} un</td><td style={S.td}>{fmtR(item.avgPrice)}</td><td style={S.td}><strong>{fmtR(item.suggested*item.avgPrice)}</strong></td></tr>))}</tbody>
          </table>
          <div style={{background:C.surfaceHigh,borderRadius:9,padding:14,border:`1px solid ${C.border}`}}>
            {[["Subtotal",sub],["Frete",fv]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:13}}><span style={{color:C.textMid}}>{l}</span><strong>{fmtR(v)}</strong></div>))}
            <div style={{display:"flex",justifyContent:"space-between",paddingTop:9,borderTop:`1px solid ${C.border}`,fontSize:14}}><span style={{fontWeight:700}}>Total {sc}</span><strong style={{color:C.yellow}}>{fmtR(sub+fv)}</strong></div>
          </div>
        </div>
        <div style={S.modalFoot}><button style={S.btnSecondary} onClick={onClose}>Fechar</button><button style={S.btnPrimary}>↗ PDF</button></div>
      </div>
    </div>
  );
}

// ── REPORT PAGE ────────────────────────────────────────────────────────────────
function ReportPage({items,movements,clients}){
  const [period,setPeriod]=useState("3");
  const cutoff=new Date(); cutoff.setMonth(cutoff.getMonth()-parseInt(period));
  const fm=(movements||[]).filter(m=>new Date(m.date)>=cutoff);
  const cons=clients.map(cl=>{
    const ci=items.filter(i=>i.client_id===cl.id);
    const tv=ci.reduce((s,item)=>s+Math.max(0,calcStock(item,movements))*calcAvgPrice(item,movements),0);
    const tc=ci.reduce((s,item)=>{const ex=fm.filter(m=>m.item_id===item.id&&m.client_id===cl.id&&m.type==="saida").reduce((ss,m)=>ss+Number(m.qty),0);return s+(ex/parseInt(period))*calcAvgPrice(item,movements);},0);
    const al=ci.filter(i=>calcStock(i,movements)<=i.stock_min).length;
    return{...cl,totalItems:ci.length,totalValue:tv,totalCost:tc,alerts:al};
  });
  const top=items.map(item=>({...item,tc:fm.filter(m=>m.item_id===item.id&&m.type==="saida").reduce((s,m)=>s+Number(m.qty),0),ap:calcAvgPrice(item,movements)})).sort((a,b)=>b.tc*b.ap-a.tc*a.ap).slice(0,8);
  const gt=cons.reduce((s,c)=>s+c.totalCost,0);
  return(
    <>
      <div style={S.topbar}>
        <div><div style={{fontSize:18,fontWeight:700}}>≡ Relatório Gerencial</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>Consolidado</div></div>
        <select style={{...S.select,width:"auto"}} value={period} onChange={e=>setPeriod(e.target.value)}><option value="1">Último mês</option><option value="3">3 meses</option><option value="6">6 meses</option></select>
      </div>
      <div style={S.content}>
        <div style={S.cardGrid}>
          {[["Clientes",clients.length,"",C.blue],["Custo Médio/mês",fmtR(gt),`${period}m`,C.yellow],["Itens",items.length,"",C.success],["Alertas",cons.reduce((s,c)=>s+c.alerts,0),"",C.danger]].map(([l,v,s,col])=>(
            <div key={l} style={S.card}><div style={{fontSize:11,fontWeight:700,color:C.textDim,letterSpacing:1,textTransform:"uppercase",marginBottom:6}}>{l}</div><div style={{fontSize:typeof v==="string"?18:28,fontWeight:800,color:col}}>{v}</div>{s&&<div style={{fontSize:12,color:C.textMid,marginTop:4}}>{s}</div>}</div>
          ))}
        </div>
        <div style={S.section}>
          <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Desempenho por Cliente</div></div>
          <table style={S.table}><thead><tr><th style={S.th}>Condomínio</th><th style={S.th}>Itens</th><th style={S.th}>Valor Estoque</th><th style={S.th}>Custo/mês</th><th style={S.th}>Alertas</th></tr></thead>
          <tbody>{cons.map(c=>(<tr key={c.id}><td style={S.td}><strong>{c.name}</strong></td><td style={S.td}>{c.totalItems}</td><td style={S.td}>{fmtR(c.totalValue)}</td><td style={S.td}>{fmtR(c.totalCost)}</td><td style={S.td}>{c.alerts>0?<span style={bdg(C.danger)}>{c.alerts}</span>:<span style={bdg(C.success)}>0</span>}</td></tr>))}</tbody></table>
        </div>
        <div style={S.section}>
          <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Top Itens</div></div>
          <table style={S.table}><thead><tr><th style={S.th}>Item</th><th style={S.th}>Categoria</th><th style={S.th}>Consumo</th><th style={S.th}>Preço Médio</th><th style={S.th}>Total</th></tr></thead>
          <tbody>{top.map((item,i)=>(<tr key={`${item.id}-${item.client_id}-${i}`}><td style={S.td}><strong>{item.name}</strong></td><td style={S.td}><span style={bdg(C.blue)}>{item.category}</span></td><td style={S.td}>{item.tc} un</td><td style={S.td}>{fmtR(item.ap)}</td><td style={S.td}><strong style={{color:C.yellow}}>{fmtR(item.tc*item.ap)}</strong></td></tr>))}</tbody></table>
        </div>
      </div>
    </>
  );
}

// ── CLIENTS PAGE ───────────────────────────────────────────────────────────────
function ClientsPage({items,movements,clients}){
  const [sel,setSel]=useState(null);
  return(
    <>
      <div style={S.topbar}><div><div style={{fontSize:18,fontWeight:700}}>◈ Clientes</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{clients.length} ativos</div></div></div>
      <div style={S.content}>
        <div style={S.section}>
          <table style={S.table}><thead><tr><th style={S.th}>Condomínio</th><th style={S.th}>CNPJ</th><th style={S.th}>Endereço</th><th style={S.th}>Unidades</th><th style={S.th}>Itens</th><th style={S.th}>Alertas</th></tr></thead>
          <tbody>{clients.map(c=>{const ci=items.filter(i=>i.client_id===c.id);const al=ci.filter(i=>calcStock(i,movements)<=i.stock_min).length;return(<tr key={c.id} style={{cursor:"pointer"}} onClick={()=>setSel(c)}><td style={S.td}><strong>{c.name}</strong></td><td style={{...S.td,fontSize:12,color:C.textMid}}>{c.cnpj}</td><td style={{...S.td,fontSize:12,color:C.textMid,maxWidth:180}}>{c.address}</td><td style={S.td}>{c.units}</td><td style={S.td}>{ci.length}</td><td style={S.td}>{al>0?<span style={bdg(C.danger)}>{al}</span>:<span style={bdg(C.success)}>0</span>}</td></tr>);})}</tbody></table>
        </div>
      </div>
      {sel&&(<div style={S.overlay} onClick={()=>setSel(null)}><div style={S.modal} onClick={e=>e.stopPropagation()}><div style={S.modalHead}><div style={{fontWeight:700,fontSize:16}}>{sel.name}</div><button style={S.btnSmall} onClick={()=>setSel(null)}>✕</button></div><div style={S.modalBody}>{[["CNPJ",sel.cnpj],["Endereço",sel.address],["Contato",sel.contact],["Unidades",sel.units]].map(([l,v])=>(<div key={l} style={{marginBottom:14}}><div style={S.label}>{l}</div><div style={{fontSize:14,background:C.surfaceHigh,padding:"10px 13px",borderRadius:8,border:`1px solid ${C.border}`}}>{v||"—"}</div></div>))}</div></div></div>)}
    </>
  );
}

// ── SUPPLIERS PAGE ─────────────────────────────────────────────────────────────
function SuppliersPage({suppliers,setSuppliers,token}){
  const [showNew,setShowNew]=useState(false);
  const [sel,setSel]=useState(null);
  return(
    <>
      <div style={S.topbar}><div><div style={{fontSize:18,fontWeight:700}}>◆ Fornecedores</div><div style={{fontSize:12,color:C.textMid,marginTop:2}}>{suppliers.length} cadastrados</div></div><button style={S.btnYellow} onClick={()=>setShowNew(true)}>+ Novo Fornecedor</button></div>
      <div style={S.content}>
        <div style={S.section}>
          <table style={S.table}><thead><tr><th style={S.th}>Fornecedor</th><th style={S.th}>Categorias</th><th style={S.th}>Contato</th><th style={S.th}>Telefone</th><th style={S.th}>Pagamento</th><th style={S.th}>Entrega</th></tr></thead>
          <tbody>{suppliers.map(s=>(<tr key={s.id} style={{cursor:"pointer"}} onClick={()=>setSel(s)}><td style={S.td}><strong>{s.name}</strong></td><td style={S.td}>{(s.categories||[]).map(c=><span key={c} style={{...bdg(C.blue),marginRight:4}}>{c}</span>)}</td><td style={{...S.td,fontSize:12,color:C.textMid}}>{s.contact}</td><td style={{...S.td,fontSize:12}}>{s.phone}</td><td style={{...S.td,fontSize:12}}>{s.payment_terms}</td><td style={S.td}><span style={bdg(C.success)}>{s.delivery_days}d</span></td></tr>))}</tbody></table>
        </div>
      </div>
      {showNew&&<NewSupplierModal suppliers={suppliers} setSuppliers={setSuppliers} token={token} onClose={()=>setShowNew(false)}/>}
      {sel&&(<div style={S.overlay} onClick={()=>setSel(null)}><div style={S.modal} onClick={e=>e.stopPropagation()}><div style={S.modalHead}><div style={{fontWeight:700,fontSize:16}}>{sel.name}</div><button style={S.btnSmall} onClick={()=>setSel(null)}>✕</button></div><div style={S.modalBody}>{[["Categorias",(sel.categories||[]).join(", ")],["E-mail",sel.contact],["Telefone",sel.phone],["Prazo Pagamento",sel.payment_terms],["Prazo Entrega",(sel.delivery_days||0)+" dias"]].map(([l,v])=>(<div key={l} style={{marginBottom:14}}><div style={S.label}>{l}</div><div style={{fontSize:14,background:C.surfaceHigh,padding:"10px 13px",borderRadius:8,border:`1px solid ${C.border}`}}>{v||"—"}</div></div>))}</div></div></div>)}
    </>
  );
}

function NewSupplierModal({suppliers,setSuppliers,token,onClose}){
  const [name,setName]=useState("");
  const [cats,setCats]=useState([]);
  const [contact,setContact]=useState("");
  const [phone,setPhone]=useState("");
  const [pt,setPt]=useState("");
  const [dd,setDd]=useState("");
  const [err,setErr]=useState("");
  const [saving,setSaving]=useState(false);
  async function save(){
    if(!name||cats.length===0){setErr("Nome e ao menos uma categoria são obrigatórios.");return;}
    setSaving(true);
    try{
      const body={name,categories:cats,contact,phone,payment_terms:pt,delivery_days:parseInt(dd)||7};
      const res=await supaFetch("/rest/v1/suppliers",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(body)},token);
      setSuppliers([...suppliers,...(Array.isArray(res)?res:[res])]);
      onClose();
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  }
  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}><div style={{fontWeight:700,fontSize:16}}>Novo Fornecedor</div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
        <div style={S.modalBody}>
          {err&&<div style={{background:`${C.danger}22`,border:`1px solid ${C.danger}`,borderRadius:8,padding:10,marginBottom:12,fontSize:13,color:C.danger}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            <div><label style={S.label}>Nome *</label><input style={S.input} value={name} onChange={e=>{setName(e.target.value);setErr("");}} placeholder="Razão social"/></div>
            <div><label style={S.label}>Categorias *</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{CATEGORIES.map(c=>{const a=cats.includes(c);return(<div key={c} onClick={()=>setCats(p=>a?p.filter(x=>x!==c):[...p,c])} style={{padding:"6px 13px",borderRadius:8,border:`2px solid ${a?C.yellow:C.border}`,background:a?`${C.yellow}18`:C.surfaceHigh,cursor:"pointer",fontSize:12,fontWeight:600,color:a?C.yellow:C.textMid}}>{c}</div>);})}</div></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>E-mail</label><input style={S.input} value={contact} onChange={e=>setContact(e.target.value)} placeholder="vendas@..."/></div>
              <div><label style={S.label}>Telefone</label><input style={S.input} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(00) 00000-0000"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Prazo Pagamento</label><input style={S.input} value={pt} onChange={e=>setPt(e.target.value)} placeholder="30/60 dias"/></div>
              <div><label style={S.label}>Entrega (dias)</label><input style={S.input} type="number" value={dd} onChange={e=>setDd(e.target.value)} placeholder="7"/></div>
            </div>
          </div>
        </div>
        <div style={S.modalFoot}><button style={S.btnSecondary} onClick={onClose}>Cancelar</button><button style={{...S.btnYellow,opacity:saving?0.7:1}} onClick={save} disabled={saving}>{saving?"Salvando...":"Salvar"}</button></div>
      </div>
    </div>
  );
}

// ── REQUISITIONS PAGE ─────────────────────────────────────────────────────────
function RequisitionsPage({user,items,movements,setMovements,clients,token,requisitions,setRequisitions,reqItems,setReqItems}){
  const [showNew,setShowNew]=useState(false);
  const [sel,setSel]=useState(null);
  const myReqs=user.clientId?requisitions.filter(r=>r.client_id===user.clientId):requisitions;
  const sorted=[...myReqs].sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
  const statusColor={aberta:C.textDim,enviada:C.blue,separada:C.warning,concluida:C.success,cancelada:C.danger};
  const statusLabel={aberta:"Aguardando colaborador",enviada:"Aguardando separação",separada:"Aguardando confirmação",concluida:"Concluída",cancelada:"Cancelada"};
  const pending=requisitions.filter(r=>r.status==="enviada").length;
  return(
    <>
      <div style={S.topbar}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{fontSize:18,fontWeight:700}}>📋 Requisições</div>
            {pending>0&&<span style={{...bdg(C.warning),fontSize:12}}>{pending} aguardando</span>}
          </div>
          <div style={{fontSize:12,color:C.textMid,marginTop:2}}>{sorted.length} requisições</div>
        </div>
        {(user.role==="zelador"||user.role==="supervisor")&&<button style={S.btnYellow} onClick={()=>setShowNew(true)}>+ Nova Requisição</button>}
      </div>
      <div style={S.content}>
        <div style={S.section}>
          <table style={S.table}>
            <thead><tr>
              <th style={S.th}>Nº</th>
              {!user.clientId&&<th style={S.th}>Condomínio</th>}
              <th style={S.th}>Status</th>
              <th style={S.th}>Colaborador</th>
              <th style={S.th}>Itens</th>
              <th style={S.th}>Criado por</th>
              <th style={S.th}>Data</th>
              <th style={S.th}>Ações</th>
            </tr></thead>
            <tbody>
              {sorted.map(req=>{
                const its=reqItems.filter(i=>i.requisition_id===req.id);
                const cl=clients.find(c=>c.id===req.client_id);
                return(
                  <tr key={req.id} style={{cursor:"pointer"}} onClick={()=>setSel(req)}>
                    <td style={{...S.td,fontWeight:700,color:C.yellow}}>REQ-{String(req.id).padStart(3,"0")}</td>
                    {!user.clientId&&<td style={S.td}>{cl?.name||"—"}</td>}
                    <td style={S.td}><span style={bdg(statusColor[req.status]||C.textDim)}>{statusLabel[req.status]||req.status}</span></td>
                    <td style={S.td}>{req.collaborator_name||"—"}</td>
                    <td style={S.td}>{its.length} item(s)</td>
                    <td style={{...S.td,fontSize:12,color:C.textMid}}>{req.created_by}</td>
                    <td style={{...S.td,fontSize:12,color:C.textMid}}>{req.created_at?.slice(0,10)||"—"}</td>
                    <td style={S.td} onClick={e=>e.stopPropagation()}>
                      {req.status==="aberta"&&<button style={{...S.btnSmall,color:C.blue}} onClick={e=>{e.stopPropagation();handleSendLink(req);}}>Copiar link</button>}
                      {req.status==="enviada"&&<button style={{...S.btnSmall,color:C.warning}} onClick={e=>{e.stopPropagation();setSel(req);}}>Separar</button>}
                      {req.status==="separada"&&<button style={{...S.btnSmall,color:C.success}} onClick={e=>{e.stopPropagation();handleSendLink(req);}}>Copiar link assinatura</button>}
                    </td>
                  </tr>
                );
              })}
              {sorted.length===0&&<tr><td colSpan={8} style={{...S.td,textAlign:"center",color:C.textDim,padding:32}}>Nenhuma requisição ainda</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
      {showNew&&<NewRequisitionModal user={user} items={items} clients={clients} token={token} requisitions={requisitions} setRequisitions={setRequisitions} reqItems={reqItems} setReqItems={setReqItems} onClose={()=>setShowNew(false)}/>}
      {sel&&<RequisitionDetail req={sel} reqItems={reqItems.filter(i=>i.requisition_id===sel.id)} items={items} movements={movements} setMovements={setMovements} clients={clients} token={token} user={user} requisitions={requisitions} setRequisitions={setRequisitions} setReqItems={setReqItems} onClose={()=>setSel(null)}/>}
    </>
  );
  function handleSendLink(req){
    const url=`${window.location.origin}/?req=${req.token}`;
    navigator.clipboard.writeText(url).then(()=>alert(`Link copiado!\n\n${url}`)).catch(()=>alert(`Link da requisição:\n\n${url}`));
  }
}

// ── NEW REQUISITION MODAL ──────────────────────────────────────────────────────
function NewRequisitionModal({user,items,clients,token,requisitions,setRequisitions,onClose}){
  const [cid,setCid]=useState(user.clientId||clients[0]?.id||1);
  const [notes,setNotes]=useState("");
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");
  const [created,setCreated]=useState(null);

  async function save(){
    setSaving(true);setErr("");
    try{
      const reqBody={client_id:parseInt(cid),created_by:user.name,notes:notes||null,status:"aberta"};
      const res=await supaFetch("/rest/v1/requisitions",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(reqBody)},token);
      const newReq=Array.isArray(res)?res[0]:res;
      setRequisitions([newReq,...requisitions]);
      setCreated(newReq);
    }catch(e){setErr(e.message);}
    finally{setSaving(false);}
  }

  if(created){
    const link=`${window.location.origin}/?req=${created.token}`;
    return(
      <div style={S.overlay} onClick={onClose}>
        <div style={{...S.modal,maxWidth:520}} onClick={e=>e.stopPropagation()}>
          <div style={S.modalHead}><div><div style={{fontWeight:700,fontSize:16,color:C.success}}>✓ Requisição criada!</div><div style={{fontSize:12,color:C.textDim}}>REQ-{String(created.id).padStart(3,"0")}</div></div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
          <div style={S.modalBody}>
            <div style={{fontSize:13,color:C.textMid,marginBottom:14}}>Envie o link abaixo para o colaborador. Ele vai escolher os itens e quantidades que precisa, depois você confirma a separação.</div>
            <label style={S.label}>Link para o colaborador</label>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input style={{...S.input,flex:1,fontSize:11}} value={link} readOnly onClick={e=>e.target.select()}/>
              <button style={S.btnYellow} onClick={()=>navigator.clipboard.writeText(link).then(()=>alert("Link copiado!"))}>Copiar</button>
            </div>
            <div style={{background:`${C.blue}18`,border:`1px solid ${C.blue}44`,borderRadius:8,padding:12,fontSize:12,color:C.textMid}}>
              <strong style={{color:C.blue}}>Próximos passos:</strong><br/>
              1. Envie o link ao colaborador<br/>
              2. Ele preenche os itens e quantidades desejadas<br/>
              3. Você confirma a separação no app<br/>
              4. Ele recebe novo link, confirma e assina<br/>
              5. Sistema baixa do estoque automaticamente
            </div>
          </div>
          <div style={S.modalFoot}><button style={S.btnYellow} onClick={onClose}>Concluir</button></div>
        </div>
      </div>
    );
  }

  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:480}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}><div><div style={{fontWeight:700,fontSize:16}}>Nova Requisição</div><div style={{fontSize:12,color:C.textDim}}>Gera link em branco para o colaborador preencher</div></div><button style={S.btnSmall} onClick={onClose}>✕</button></div>
        <div style={S.modalBody}>
          {err&&<div style={{background:`${C.danger}22`,border:`1px solid ${C.danger}`,borderRadius:8,padding:10,marginBottom:12,fontSize:13,color:C.danger}}>{err}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:13}}>
            {!user.clientId&&<div><label style={S.label}>Condomínio</label><select style={S.select} value={cid} onChange={e=>setCid(e.target.value)}>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>}
            <div><label style={S.label}>Observações (opcional)</label><input style={S.input} placeholder="Ex: Solicitação urgente, evento..." value={notes} onChange={e=>setNotes(e.target.value)}/></div>
            <div style={{background:C.surfaceHigh,borderRadius:8,padding:12,fontSize:12,color:C.textMid}}>
              Ao gerar a requisição, um <strong style={{color:C.text}}>link único</strong> será criado.<br/>
              Envie esse link ao colaborador via WhatsApp ou e-mail.
            </div>
          </div>
        </div>
        <div style={S.modalFoot}><button style={S.btnSecondary} onClick={onClose}>Cancelar</button><button style={{...S.btnYellow,opacity:saving?0.7:1}} onClick={save} disabled={saving}>{saving?"Gerando...":"Gerar Link"}</button></div>
      </div>
    </div>
  );
}

// ── REQUISITION DETAIL ─────────────────────────────────────────────────────────
function RequisitionDetail({req,reqItems,items,movements,setMovements,clients,token,user,requisitions,setRequisitions,setReqItems,onClose}){
  const [separating,setSeparating]=useState(req.status==="enviada"&&user.role!=="zelador"?false:false);
  const [sepQtys,setSepQtys]=useState(Object.fromEntries(reqItems.map(i=>[i.id,i.qty_separated??i.qty_requested])));
  const [saving,setSaving]=useState(false);
  const cl=clients.find(c=>c.id===req.client_id);
  const statusColor={aberta:C.textDim,enviada:C.blue,separada:C.warning,concluida:C.success,cancelada:C.danger};
  const statusLabel={aberta:"Aguardando colaborador",enviada:"Aguardando separação",separada:"Aguardando confirmação",concluida:"Concluída",cancelada:"Cancelada"};
  const link=`${window.location.origin}/?req=${req.token}`;

  async function confirmSeparation(){
    setSaving(true);
    try{
      for(const ri of reqItems){
        await supaFetch(`/rest/v1/requisition_items?id=eq.${ri.id}`,{method:"PATCH",body:JSON.stringify({qty_separated:parseFloat(sepQtys[ri.id])||0})},token);
      }
      await supaFetch(`/rest/v1/requisitions?id=eq.${req.id}`,{method:"PATCH",body:JSON.stringify({status:"separada",updated_at:new Date().toISOString()})},token);
      setRequisitions(requisitions.map(r=>r.id===req.id?{...r,status:"separada"}:r));
      setReqItems(prev=>prev.map(ri=>ri.requisition_id===req.id?{...ri,qty_separated:parseFloat(sepQtys[ri.id])||0}:ri));
      onClose();
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }

  function copyLink(){
    navigator.clipboard.writeText(link).then(()=>alert(`Link copiado!\n\n${link}`)).catch(()=>alert(`Link:\n\n${link}`));
  }

  return(
    <div style={S.overlay} onClick={onClose}>
      <div style={{...S.modal,maxWidth:620}} onClick={e=>e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontWeight:700,fontSize:16}}>REQ-{String(req.id).padStart(3,"0")}</div>
              <span style={bdg(statusColor[req.status]||C.textDim)}>{statusLabel[req.status]||req.status}</span>
            </div>
            <div style={{fontSize:12,color:C.textDim,marginTop:2}}>{cl?.name||"—"} · {req.created_by} · {req.created_at?.slice(0,10)}</div>
          </div>
          <button style={S.btnSmall} onClick={onClose}>✕</button>
        </div>
        <div style={S.modalBody}>
          {req.collaborator_name&&<div style={{background:C.surfaceHigh,borderRadius:8,padding:12,marginBottom:14,fontSize:13}}><span style={{color:C.textDim}}>Colaborador: </span><strong>{req.collaborator_name}</strong></div>}
          {req.notes&&<div style={{background:C.surfaceHigh,borderRadius:8,padding:12,marginBottom:14,fontSize:13}}><span style={{color:C.textDim}}>Obs: </span>{req.notes}</div>}

          <table style={{...S.table,marginBottom:16}}>
            <thead><tr>
              <th style={S.th}>Item</th>
              <th style={S.th}>Solicitado</th>
              <th style={S.th}>Estoque</th>
              {req.status==="enviada"&&user.role!=="zelador"&&<th style={S.th}>Separar</th>}
              {(req.status==="separada"||req.status==="concluida")&&<th style={S.th}>Separado</th>}
              {req.status==="concluida"&&<th style={S.th}>Confirmado</th>}
            </tr></thead>
            <tbody>
              {reqItems.map(ri=>{
                const it=items.find(i=>i.id===ri.item_id&&i.client_id===ri.client_id);
                const stock=it?calcStock(it,movements):0;
                return(
                  <tr key={ri.id}>
                    <td style={S.td}><strong>{it?.name||"—"}</strong><br/><span style={{fontSize:11,color:C.textDim}}>{it?.code||""}</span></td>
                    <td style={S.td}>{ri.qty_requested} un</td>
                    <td style={S.td}><span style={{color:stock<ri.qty_requested?C.warning:C.success,fontWeight:600}}>{stock} un</span></td>
                    {req.status==="enviada"&&user.role!=="zelador"&&(
                      <td style={S.td}><input style={{...S.input,width:80,padding:"6px 8px"}} type="number" min="0" max={stock} value={sepQtys[ri.id]??ri.qty_requested} onChange={e=>setSepQtys(p=>({...p,[ri.id]:e.target.value}))}/></td>
                    )}
                    {(req.status==="separada"||req.status==="concluida")&&<td style={S.td}><strong style={{color:C.yellow}}>{ri.qty_separated??"—"} un</strong></td>}
                    {req.status==="concluida"&&<td style={S.td}>{ri.qty_confirmed??ri.qty_separated} un{ri.justification&&<div style={{fontSize:11,color:C.warning}}>Ajuste: {ri.justification}</div>}</td>}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {req.status==="concluida"&&req.signature&&(
            <div style={{marginBottom:14}}>
              <div style={S.label}>Assinatura</div>
              <div style={{background:C.surfaceHigh,borderRadius:8,padding:8,border:`1px solid ${C.border}`}}>
                <img src={req.signature} style={{maxWidth:"100%",height:80}} alt="assinatura"/>
              </div>
              <div style={{fontSize:11,color:C.textDim,marginTop:4}}>Confirmado por: {req.collaborator_name} em {req.confirmed_at?.slice(0,10)}</div>
            </div>
          )}

          {req.status==="separada"&&(
            <div style={{background:`${C.warning}18`,border:`1px solid ${C.warning}55`,borderRadius:8,padding:12,fontSize:13}}>
              <div style={{fontWeight:700,color:C.warning,marginBottom:4}}>Aguardando confirmação do colaborador</div>
              <div style={{color:C.textMid,marginBottom:8}}>Envie o link abaixo para o colaborador confirmar e assinar:</div>
              <div style={{display:"flex",gap:8}}>
                <input style={{...S.input,flex:1,fontSize:11}} value={link} readOnly/>
                <button style={S.btnSmall} onClick={()=>navigator.clipboard.writeText(link).then(()=>alert("Link copiado!"))}>Copiar</button>
              </div>
            </div>
          )}
        </div>
        <div style={S.modalFoot}>
          <button style={S.btnSecondary} onClick={onClose}>Fechar</button>
          {req.status==="aberta"&&<button style={S.btnPrimary} onClick={copyLink}>Copiar link</button>}
          {req.status==="enviada"&&<button style={{...S.btnYellow,opacity:saving?0.7:1}} onClick={confirmSeparation} disabled={saving}>{saving?"Salvando...":"Confirmar Separação"}</button>}
        </div>
      </div>
    </div>
  );
}

// ── PUBLIC REQUISITION PAGE ────────────────────────────────────────────────────
function PublicRequisitionPage({reqToken}){
  const [req,setReq]=useState(null);
  const [reqItems,setReqItems]=useState([]);
  const [items,setItems]=useState([]);
  const [loading,setLoading]=useState(true);
  const [err,setErr]=useState(null);
  const [collabName,setCollabName]=useState("");
  const [collabNotes,setCollabNotes]=useState("");
  const [requestLines,setRequestLines]=useState([{item_id:"",qty:1}]);
  const [qtys,setQtys]=useState({});
  const [justs,setJusts]=useState({});
  const [saving,setSaving]=useState(false);
  const [done,setDone]=useState(false);
  const canvasRef=React.useRef(null);
  const [drawing,setDrawing]=useState(false);
  const [hasSig,setHasSig]=useState(false);

  useEffect(()=>{
    async function load(){
      try{
        const reqs=await supaFetch(`/rest/v1/requisitions?token=eq.${reqToken}&select=*`);
        if(!reqs||reqs.length===0){setErr("Requisição não encontrada ou link inválido.");return;}
        const r=reqs[0];
        setReq(r);
        const ris=await supaFetch(`/rest/v1/requisition_items?requisition_id=eq.${r.id}&select=*`);
        setReqItems(ris||[]);
        // Load all items of the client (so collaborator can pick)
        const its=await supaFetch(`/rest/v1/items?client_id=eq.${r.client_id}&select=*&order=name`);
        setItems(its||[]);
        const initQtys=Object.fromEntries((ris||[]).map(i=>[i.id,i.qty_separated??i.qty_requested]));
        setQtys(initQtys);
        if(r.collaborator_name)setCollabName(r.collaborator_name);
      }catch(e){setErr(e.message);}
      finally{setLoading(false);}
    }
    load();
  },[reqToken]);

  function addLine(){setRequestLines([...requestLines,{item_id:"",qty:1}]);}
  function removeLine(i){setRequestLines(requestLines.filter((_,j)=>j!==i));}
  function updateLine(i,field,val){setRequestLines(requestLines.map((l,j)=>j===i?{...l,[field]:val}:l));}

  async function submitRequest(){
    if(!collabName){alert("Informe seu nome.");return;}
    const valid=requestLines.filter(l=>l.item_id&&l.qty>0);
    if(valid.length===0){alert("Selecione ao menos um item.");return;}
    setSaving(true);
    try{
      const itemsBody=valid.map(l=>({requisition_id:req.id,item_id:parseInt(l.item_id),client_id:req.client_id,qty_requested:parseFloat(l.qty)}));
      await supaFetch("/rest/v1/requisition_items",{method:"POST",body:JSON.stringify(itemsBody)});
      const newNotes=collabNotes?`${req.notes?req.notes+" | ":""}Obs colaborador: ${collabNotes}`:req.notes;
      await supaFetch(`/rest/v1/requisitions?id=eq.${req.id}`,{method:"PATCH",body:JSON.stringify({status:"enviada",collaborator_name:collabName,notes:newNotes,updated_at:new Date().toISOString()})});
      setDone(true);
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }

  // Canvas drawing
  function startDraw(e){
    setDrawing(true);
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    const rect=canvas.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
    const y=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
    ctx.beginPath();ctx.moveTo(x,y);
  }
  function draw(e){
    if(!drawing)return;
    e.preventDefault();
    const canvas=canvasRef.current;
    const ctx=canvas.getContext("2d");
    const rect=canvas.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
    const y=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
    ctx.lineWidth=2;ctx.lineCap="round";ctx.strokeStyle="#F5C518";
    ctx.lineTo(x,y);ctx.stroke();
    setHasSig(true);
  }
  function clearSig(){
    const canvas=canvasRef.current;
    canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height);
    setHasSig(false);
  }

  async function confirm(){
    if(!collabName){alert("Informe seu nome.");return;}
    if(!hasSig){alert("Assine antes de confirmar.");return;}
    // Check justifications
    for(const ri of reqItems){
      const qtyConf=parseFloat(qtys[ri.id])||0;
      const baseQty=ri.qty_separated;
      if(qtyConf!==baseQty&&!justs[ri.id]){alert("Informe o motivo da alteração de quantidade.");return;}
    }
    setSaving(true);
    try{
      const sig=canvasRef.current.toDataURL();
      const today=new Date().toISOString().slice(0,10);
      // Update each item AND create movement
      for(const ri of reqItems){
        const qtyConf=parseFloat(qtys[ri.id])||0;
        const hasChange=qtyConf!==ri.qty_separated;
        await supaFetch(`/rest/v1/requisition_items?id=eq.${ri.id}`,{method:"PATCH",body:JSON.stringify({qty_confirmed:qtyConf,justification:hasChange?(justs[ri.id]||"Sem justificativa"):null})});
        // Lança saída no estoque
        if(qtyConf>0){
          await supaFetch("/rest/v1/movements",{method:"POST",body:JSON.stringify({item_id:ri.item_id,client_id:ri.client_id,type:"saida",qty:qtyConf,date:today,user_name:collabName,obs:`REQ-${String(req.id).padStart(3,"0")} - ${collabName}`})});
        }
      }
      await supaFetch(`/rest/v1/requisitions?id=eq.${req.id}`,{method:"PATCH",body:JSON.stringify({status:"concluida",collaborator_name:collabName,signature:sig,confirmed_at:new Date().toISOString(),updated_at:new Date().toISOString()})});
      setDone(true);
    }catch(e){alert(e.message);}
    finally{setSaving(false);}
  }

  if(loading)return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}><Spinner/></div>;
  if(err)return <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",flexDirection:"column",gap:12}}><div style={{color:C.danger,fontSize:16}}>{err}</div></div>;
  if(done)return(
    <div style={{...S.app,display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center",padding:32}}>
        <div style={{fontSize:48,marginBottom:16}}>✅</div>
        <div style={{fontSize:22,fontWeight:700,color:C.success,marginBottom:8}}>{req.status==="aberta"?"Requisição enviada!":"Recebimento confirmado!"}</div>
        <div style={{fontSize:14,color:C.textMid,marginBottom:16}}>REQ-{String(req.id).padStart(3,"0")} · {collabName}</div>
        <div style={{fontSize:13,color:C.textMid,maxWidth:340}}>{req.status==="aberta"?"Aguarde a separação dos itens. Você receberá um novo link para confirmar e assinar o recebimento.":"Obrigado!"}</div>
      </div>
    </div>
  );

  const isAberta=req.status==="aberta";
  const isSep=req.status==="separada";

  return(
    <div style={{...S.app,minHeight:"100vh",padding:20}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
          <img src={LOGO} style={{width:40,height:40,objectFit:"contain"}} alt="A3"/>
          <div>
            <div style={{fontSize:16,fontWeight:700}}>A3 CondoStock</div>
            <div style={{fontSize:11,color:C.textDim,textTransform:"uppercase",letterSpacing:1}}>Requisição REQ-{String(req?.id||0).padStart(3,"0")}</div>
          </div>
        </div>

        {req.status==="concluida"&&(
          <div style={{background:`${C.success}22`,border:`1px solid ${C.success}`,borderRadius:10,padding:16,textAlign:"center"}}>
            <div style={{color:C.success,fontWeight:700}}>Esta requisição já foi confirmada.</div>
          </div>
        )}

        {isAberta&&(
          <>
            <div style={{marginBottom:16}}>
              <label style={S.label}>Seu nome completo *</label>
              <input style={S.input} placeholder="Nome do colaborador" value={collabName} onChange={e=>setCollabName(e.target.value)}/>
            </div>
            <div style={{...S.section,marginBottom:16}}>
              <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Itens da Solicitação</div></div>
              <div style={{padding:16}}>
                {requestLines.map((line,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 32px",gap:8,marginBottom:8}}>
                    <select style={S.select} value={line.item_id} onChange={e=>updateLine(i,"item_id",e.target.value)}>
                      <option value="">Selecione...</option>
                      {items.map(it=><option key={it.id} value={it.id}>{it.name} ({it.code})</option>)}
                    </select>
                    <input style={S.input} type="number" min="1" placeholder="Qtd" value={line.qty} onChange={e=>updateLine(i,"qty",e.target.value)}/>
                    {requestLines.length>1&&<button style={{...S.btnSmall,color:C.danger,padding:"5px 8px"}} onClick={()=>removeLine(i)}>✕</button>}
                    {requestLines.length<=1&&<div></div>}
                  </div>
                ))}
                <button style={{...S.btnSmall,marginTop:4}} onClick={addLine}>+ Adicionar item</button>
              </div>
            </div>
            <div style={{marginBottom:16}}>
              <label style={S.label}>Observações (opcional)</label>
              <input style={S.input} placeholder="Ex: Para limpeza geral..." value={collabNotes} onChange={e=>setCollabNotes(e.target.value)}/>
            </div>
            <button style={{...S.btnYellow,width:"100%",padding:14,fontSize:15,opacity:saving?0.7:1}} onClick={submitRequest} disabled={saving}>
              {saving?"Enviando...":"Enviar Solicitação"}
            </button>
          </>
        )}

        {isSep&&(
          <>
            <div style={{...S.section,marginBottom:16}}>
              <div style={S.sectionHead}><div style={{fontSize:14,fontWeight:700}}>Itens separados</div></div>
              <table style={S.table}>
                <thead><tr><th style={S.th}>Item</th><th style={S.th}>Separado</th><th style={S.th}>Confirmar</th></tr></thead>
                <tbody>
                  {reqItems.map(ri=>{
                    const it=items.find(i=>i.id===ri.item_id);
                    const baseQty=ri.qty_separated;
                    const changed=parseFloat(qtys[ri.id])!==baseQty;
                    return(
                      <tr key={ri.id}>
                        <td style={S.td}><strong>{it?.name||"—"}</strong></td>
                        <td style={S.td}>{baseQty} un</td>
                        <td style={S.td}>
                          <input style={{...S.input,width:80,padding:"6px 8px"}} type="number" min="0" value={qtys[ri.id]??baseQty} onChange={e=>setQtys(p=>({...p,[ri.id]:e.target.value}))}/>
                          {changed&&<input style={{...S.input,marginTop:6,fontSize:12}} placeholder="Motivo da alteração *" value={justs[ri.id]||""} onChange={e=>setJusts(p=>({...p,[ri.id]:e.target.value}))}/>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{marginBottom:16}}>
              <label style={S.label}>Seu nome completo *</label>
              <input style={S.input} placeholder="Nome do colaborador" value={collabName} onChange={e=>setCollabName(e.target.value)}/>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <label style={S.label}>Assinatura *</label>
                <button style={S.btnSmall} onClick={clearSig}>Limpar</button>
              </div>
              <canvas ref={canvasRef} width={460} height={120}
                style={{background:C.surfaceHigh,border:`1px solid ${C.border}`,borderRadius:8,width:"100%",touchAction:"none",cursor:"crosshair"}}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={()=>setDrawing(false)}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={()=>setDrawing(false)}/>
              <div style={{fontSize:11,color:C.textDim,marginTop:4}}>Assine com o dedo ou mouse</div>
            </div>
            <button style={{...S.btnYellow,width:"100%",padding:14,fontSize:15,opacity:saving?0.7:1}} onClick={confirm} disabled={saving}>
              {saving?"Confirmando...":"✓ Confirmar Recebimento"}
            </button>
          </>
        )}

        {!isAberta&&!isSep&&req.status!=="concluida"&&(
          <div style={{background:`${C.blue}18`,border:`1px solid ${C.blue}44`,borderRadius:10,padding:16,textAlign:"center"}}>
            <div style={{color:C.blue,fontWeight:600,marginBottom:4}}>Aguarde a separação</div>
            <div style={{fontSize:13,color:C.textMid}}>Você receberá um novo link para confirmar e assinar o recebimento.</div>
          </div>
        )}
      </div>
    </div>
  );
}


// ── APP ────────────────────────────────────────────────────────────────────────
export default function App(){
  const [user,setUser]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [clients,setClients]=useState([]);
  const [items,setItems]=useState([]);
  const [movements,setMovements]=useState([]);
  const [suppliers,setSuppliers]=useState([]);
  const [requisitions,setRequisitions]=useState([]);
  const [reqItems,setReqItems]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadErr,setLoadErr]=useState(null);

  useEffect(()=>{
    const link=document.createElement("link");
    link.href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel="stylesheet";
    document.head.appendChild(link);
  },[]);

  const loadData=useCallback(async(token)=>{
    setLoading(true);setLoadErr(null);
    try{
      const [c,i,m,s,rqs,ris]=await Promise.all([
        supaFetch("/rest/v1/clients?select=*&order=name",{},token),
        supaFetch("/rest/v1/items?select=*&order=name",{},token),
        supaFetch("/rest/v1/movements?select=*&order=date.desc&limit=500",{},token),
        supaFetch("/rest/v1/suppliers?select=*&order=name",{},token),
        supaFetch("/rest/v1/requisitions?select=*&order=created_at.desc",{},token),
        supaFetch("/rest/v1/requisition_items?select=*",{},token),
      ]);
      setClients(c||[]);setItems(i||[]);setMovements(m||[]);setSuppliers(s||[]);
      setRequisitions(rqs||[]);setReqItems(ris||[]);
    }catch(e){setLoadErr(e.message);}
    finally{setLoading(false);}
  },[]);

  function handleLogin(u){
    setUser(u);setPage("dashboard");
    loadData(u.token);
  }

  // Public requisition page routing
  const urlParams=new URLSearchParams(window.location.search);
  const reqToken=urlParams.get("req");
  if(reqToken) return <PublicRequisitionPage reqToken={reqToken}/>;

  if(!user) return <Login onLogin={handleLogin}/>;

  const sharedProps={user,clients,token:user.token};

  const pages={
    dashboard:<Dashboard {...sharedProps} items={items} movements={movements}/>,
    items:<ItemsPage {...sharedProps} items={items} setItems={setItems} movements={movements} setMovements={setMovements}/>,
    entry:<MovementPage {...sharedProps} items={items} movements={movements} setMovements={setMovements} type="entrada"/>,
    exit:<MovementPage {...sharedProps} items={items} movements={movements} setMovements={setMovements} type="saida"/>,
    adjust:<AdjustPage {...sharedProps} items={items} movements={movements} setMovements={setMovements}/>,
    history:<HistoryPage {...sharedProps} items={items} movements={movements}/>,
    order:<OrderPage {...sharedProps} items={items} movements={movements}/>,
    report:<ReportPage items={items} movements={movements} clients={clients}/>,
    clients:<ClientsPage items={items} movements={movements} clients={clients}/>,
    suppliers:<SuppliersPage suppliers={suppliers} setSuppliers={setSuppliers} token={user.token}/>,
    requisitions:<RequisitionsPage user={user} items={items} movements={movements} setMovements={setMovements} clients={clients} token={user.token} requisitions={requisitions} setRequisitions={setRequisitions} reqItems={reqItems} setReqItems={setReqItems}/>,
  };

  return(
    <div style={S.app}>
      <Shell user={user} page={page} setPage={setPage} clients={clients} requisitions={requisitions} onLogout={()=>{setUser(null);setPage("dashboard");setItems([]);setMovements([]);}}>
        {loading?<Spinner/>:loadErr?<ErrBox msg={loadErr} retry={()=>loadData(user.token)}/>:(pages[page]||pages.dashboard)}
      </Shell>
    </div>
  );
}

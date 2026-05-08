import { useState, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// THEME
// ═══════════════════════════════════════════════════════════════
const C = {
  bg:"#07080d", surface:"#0d0f18", card:"#121520", border:"#1a1d2e",
  accent:"#f5a623", blue:"#4a90e2", green:"#27ae60", red:"#e74c3c",
  purple:"#8e44ad", cyan:"#16a085", gold:"#f1c40f",
  text:"#e0e4f5", muted:"#525670", sub:"#8088a8",
};
const inp = {
  width:"100%", background:C.card, border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"10px 14px", color:C.text, fontSize:14,
  outline:"none", boxSizing:"border-box", fontFamily:"inherit",
};
const fmt = n => "$"+Number(n||0).toLocaleString("es-MX",{minimumFractionDigits:2});
const ymd = d => (d instanceof Date?d:new Date()).toISOString().slice(0,10);
const todayStr = ymd(new Date());
const addDays = (base,n) => { const d=new Date(base); d.setDate(d.getDate()+n); return ymd(d); };
const DIAS = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const ROLES = {
  admin:     { label:"Administrador", color:C.accent, icon:"👑" },
  trabajador:{ label:"Trabajador",    color:C.blue,   icon:"🔧" },
};
const CUADRILLAS = ["Alpha","Beta","Gamma","Delta"];
const TIPOS = {
  ac:          { label:"A/C y Climatización", icon:"❄️", color:C.cyan },
  electrico:   { label:"Eléctrico",           icon:"⚡", color:C.gold },
  plomeria:    { label:"Plomería",            icon:"🔧", color:C.blue },
  pintura:     { label:"Pintura",             icon:"🎨", color:C.purple },
  impermeab:   { label:"Impermeabilización",  icon:"🏠", color:C.green },
  construccion:{ label:"Construcción",        icon:"🏗️", color:C.accent },
};
const JOB_STATES = {
  pendiente:   { label:"Pendiente",   color:C.accent },
  en_progreso: { label:"En progreso", color:C.blue },
  completado:  { label:"Completado",  color:C.green },
  cancelado:   { label:"Cancelado",   color:C.red },
};
const QUOTE_STATES = {
  borrador: { label:"Borrador",  color:C.muted },
  enviada:  { label:"Enviada",   color:C.blue },
  aceptada: { label:"Aceptada",  color:C.green },
  rechazada:{ label:"Rechazada", color:C.red },
};

// ═══════════════════════════════════════════════════════════════
// CATALOG
// ═══════════════════════════════════════════════════════════════
const CATALOG = [
  {id:1,cat:"ac",nombre:"Mantenimiento preventivo A/C mini split",unidad:"equipo",precio:850,descripcion:"Limpieza de filtros, serpentín, bandeja y revisión de gases"},
  {id:2,cat:"ac",nombre:"Instalación A/C mini split 1 tonelada",unidad:"equipo",precio:3500,descripcion:"Instalación completa con soporte, canalización y carga de gas"},
  {id:3,cat:"ac",nombre:"Carga de gas refrigerante R-410A",unidad:"libra",precio:350,descripcion:"Recarga de gas con verificación de presiones"},
  {id:4,cat:"electrico",nombre:"Cambio de tablero eléctrico 100A",unidad:"pieza",precio:4500,descripcion:"Suministro e instalación de tablero nuevo"},
  {id:5,cat:"electrico",nombre:"Cambio de tablero eléctrico 200A",unidad:"pieza",precio:6800,descripcion:"Suministro e instalación de tablero bifásico"},
  {id:6,cat:"electrico",nombre:"Instalación de circuito dedicado",unidad:"circuito",precio:1200,descripcion:"Circuito 20A con cableado hasta 10m"},
  {id:7,cat:"electrico",nombre:"Cableado por metro lineal",unidad:"metro",precio:85,descripcion:"Cableado calibre 12 AWG con canaleta"},
  {id:8,cat:"plomeria",nombre:"Detección y reparación de fuga",unidad:"servicio",precio:800,descripcion:"Localización y reparación de fuga en tubería visible"},
  {id:9,cat:"plomeria",nombre:"Cambio de tubería PVC por metro",unidad:"metro",precio:120,descripcion:"Suministro y cambio de tubería PVC hidráulica"},
  {id:10,cat:"pintura",nombre:"Pintura interior por m²",unidad:"m²",precio:55,descripcion:"2 manos de pintura vinílica, incluye preparación"},
  {id:11,cat:"pintura",nombre:"Pintura exterior por m²",unidad:"m²",precio:75,descripcion:"Pintura elastomérica 2 manos, resistente a la intemperie"},
  {id:12,cat:"impermeab",nombre:"Impermeabilizante por m²",unidad:"m²",precio:110,descripcion:"2 capas de impermeabilizante acrílico"},
  {id:13,cat:"construccion",nombre:"Muro de tabique por m²",unidad:"m²",precio:320,descripcion:"Tabique rojo con junteado y aplanado"},
  {id:14,cat:"construccion",nombre:"Aplanado de cemento por m²",unidad:"m²",precio:95,descripcion:"Aplanado con mortero cemento-arena"},
];

// ═══════════════════════════════════════════════════════════════
// SEED DATA
// ═══════════════════════════════════════════════════════════════
const USERS = [
  {id:1,nombre:"Admin ENERGY",usuario:"admin",password:"admin123",rol:"admin",email:"admin@energy.mx",avatar:"AE",activo:true},
  {id:2,nombre:"Juan Pérez",usuario:"juan.perez",password:"juan123",rol:"trabajador",email:"juan@energy.mx",cuadrilla:"Alpha",avatar:"JP",activo:true},
  {id:3,nombre:"Miguel Torres",usuario:"miguel.torres",password:"miguel123",rol:"trabajador",email:"miguel@energy.mx",cuadrilla:"Beta",avatar:"MT",activo:true},
];

const PROJECTS_SEED = [
  {
    id:"P001",folio:"PROJ-001",titulo:"Mantenimiento A/C Residencial García",cliente:"Familia García",
    clienteTel:"555-1001",clienteEmail:"garcia@email.com",direccion:"Calle Pino 45, Col. Jardines",
    tipo:"ac",cuadrilla:"Alpha",tecnico:"Juan Pérez",estado:"completado",
    fechaInicio:addDays(todayStr,-5),fechaFin:addDays(todayStr,-4),precioVenta:8500,
    gastos:[
      {id:1,concepto:"Filtros y refacciones",monto:420,cat:"materiales",fecha:addDays(todayStr,-5)},
      {id:2,concepto:"Gas R-410A 2 libras",monto:700,cat:"materiales",fecha:addDays(todayStr,-5)},
    ],
    cotizacionId:"COT-001",
    trabajos:[{id:"T001",fecha:addDays(todayStr,-5),horaInicio:"08:00",horaFin:"13:00",estado:"completado",notas:""}],
    reporte:{fotos:{antes:[],durante:[],despues:[]},comentariosTecnicos:"Se realizó mantenimiento preventivo completo a 2 equipos mini split. Limpieza de filtros, serpentines y bandeja. Ambos equipos funcionando óptimamente.",trabajoRealizado:"• Limpieza de filtros de aire\n• Lavado de serpentín evaporador y condensador\n• Revisión de presiones de gas R-410A\n• Verificación de voltaje y amperaje de motores",observaciones:"Próximo mantenimiento en 6 meses.",calificacion:5,fechaReporte:addDays(todayStr,-4)},
  },
  {
    id:"P002",folio:"PROJ-002",titulo:"Instalación Eléctrica Oficinas Norte",cliente:"Corporativo Norte SA",
    clienteTel:"555-2002",clienteEmail:"admin@cnorte.mx",direccion:"Blvd. Industrial 200, Piso 2",
    tipo:"electrico",cuadrilla:"Beta",tecnico:"Miguel Torres",estado:"en_progreso",
    fechaInicio:todayStr,fechaFin:addDays(todayStr,2),precioVenta:24000,
    gastos:[
      {id:3,concepto:"Cable eléctrico 100m",monto:2400,cat:"materiales",fecha:todayStr},
      {id:4,concepto:"Tablero 200A",monto:3800,cat:"materiales",fecha:todayStr},
    ],
    cotizacionId:"COT-002",
    trabajos:[
      {id:"T002",fecha:todayStr,horaInicio:"09:00",horaFin:"17:00",estado:"en_progreso",notas:""},
      {id:"T003",fecha:addDays(todayStr,1),horaInicio:"08:00",horaFin:"17:00",estado:"pendiente",notas:""},
    ],
    reporte:{fotos:{antes:[],durante:[],despues:[]},comentariosTecnicos:"",trabajoRealizado:"",observaciones:"",calificacion:5,fechaReporte:""},
  },
  {
    id:"P003",folio:"PROJ-003",titulo:"Impermeabilización Azotea González",cliente:"María González",
    clienteTel:"555-3003",clienteEmail:"maria@email.com",direccion:"Av. Roble 88, Col. Las Flores",
    tipo:"impermeab",cuadrilla:"Alpha",tecnico:"Juan Pérez",estado:"pendiente",
    fechaInicio:addDays(todayStr,3),fechaFin:addDays(todayStr,4),precioVenta:15000,
    gastos:[],cotizacionId:null,
    trabajos:[{id:"T004",fecha:addDays(todayStr,3),horaInicio:"07:00",horaFin:"17:00",estado:"pendiente",notas:""}],
    reporte:{fotos:{antes:[],durante:[],despues:[]},comentariosTecnicos:"",trabajoRealizado:"",observaciones:"",calificacion:5,fechaReporte:""},
  },
];

const QUOTES_SEED = [
  {id:"COT-001",folio:"COT-001",fecha:addDays(todayStr,-10),vigencia:addDays(todayStr,5),cliente:"Familia García",clienteTel:"555-1001",clienteEmail:"garcia@email.com",clienteDireccion:"Calle Pino 45",titulo:"Mantenimiento A/C Residencial",descripcionGeneral:"2 equipos mini split",estado:"aceptada",includeIVA:false,notas:"Incluye mano de obra.",items:[{...CATALOG[0],cantidad:2},{...CATALOG[2],cantidad:2}],proyectoId:"P001"},
  {id:"COT-002",folio:"COT-002",fecha:addDays(todayStr,-7),vigencia:addDays(todayStr,8),cliente:"Corporativo Norte SA",clienteTel:"555-2002",clienteEmail:"admin@cnorte.mx",clienteDireccion:"Blvd. Industrial 200",titulo:"Instalación Eléctrica Tablero 200A",descripcionGeneral:"Tablero principal y circuitos",estado:"aceptada",includeIVA:true,notas:"Trabajo en horario nocturno.",items:[{...CATALOG[4],cantidad:1},{...CATALOG[5],cantidad:4},{...CATALOG[6],cantidad:30}],proyectoId:"P002"},
  {id:"COT-003",folio:"COT-003",fecha:todayStr,vigencia:addDays(todayStr,15),cliente:"Roberto Silva",clienteTel:"555-4004",clienteEmail:"rsilva@email.com",clienteDireccion:"Blvd. Insurgentes 500",titulo:"Pintura Exterior Fachada 120m²",descripcionGeneral:"Fachada principal",estado:"enviada",includeIVA:false,notas:"",items:[{...CATALOG[10],cantidad:120}],proyectoId:null},
];

const PERSONAL_SEED = [
  {id:1,nombre:"Juan Pérez",puesto:"Técnico A/C",cuadrilla:"Alpha",sueldoSemanal:2200,imss:true,activo:true},
  {id:2,nombre:"Miguel Torres",puesto:"Electricista",cuadrilla:"Beta",sueldoSemanal:2500,imss:true,activo:true},
  {id:3,nombre:"Luis Hernández",puesto:"Ayudante General",cuadrilla:"Alpha",sueldoSemanal:1800,imss:false,activo:true},
  {id:4,nombre:"Roberto Sánchez",puesto:"Plomero",cuadrilla:"Gamma",sueldoSemanal:2100,imss:true,activo:true},
];

// ═══════════════════════════════════════════════════════════════
// SHARED UI
// ═══════════════════════════════════════════════════════════════
function Badge({color,children}){
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}
function Lbl({children}){
  return <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:5,textTransform:"uppercase",letterSpacing:0.8}}>{children}</div>;
}
function StatCard({icon,label,value,sub,color=C.accent}){
  return(
    <div style={{background:C.surface,borderRadius:14,padding:"16px",border:`1.5px solid ${C.border}`}}>
      <div style={{fontSize:22,marginBottom:6}}>{icon}</div>
      <div style={{fontSize:20,fontWeight:900,color}}>{value}</div>
      <div style={{fontSize:12,color:C.text,fontWeight:700,marginTop:2}}>{label}</div>
      {sub&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{sub}</div>}
    </div>
  );
}
function ModalWrap({onClose,children,maxWidth=560}){
  return(
    <div style={{position:"fixed",inset:0,background:"#000d",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.surface,borderRadius:20,width:"100%",maxWidth,maxHeight:"93vh",overflowY:"auto",border:`1.5px solid ${C.border}`,boxShadow:"0 50px 120px #000f"}}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PDF PRINTERS
// ═══════════════════════════════════════════════════════════════
function printQuotePDF(q){
  const sub=q.items.reduce((s,i)=>s+i.precio*i.cantidad,0);
  const iva=q.includeIVA?sub*0.16:0; const total=sub+iva;
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><title>${q.folio}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;padding:40px;max-width:820px;margin:0 auto}.h{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;border-bottom:3px solid #f5a623;padding-bottom:18px}.brand{font-size:24px;font-weight:900}.badge{background:#f5a623;color:#000;padding:5px 16px;border-radius:99px;font-size:12px;font-weight:900}.ig{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px}.box{background:#f8f9fa;border-radius:10px;padding:14px}.box h3{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:8px}table{width:100%;border-collapse:collapse;margin-bottom:16px}thead{background:#111;color:#fff}th,td{padding:10px 12px;text-align:left;font-size:13px}tr:nth-child(even){background:#fafafa}.totals{display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-bottom:24px}.tr{display:flex;gap:40px;font-size:14px}.grand{font-size:20px;font-weight:900;color:#f5a623;border-top:2px solid #eee;padding-top:8px;margin-top:4px}.footer{text-align:center;font-size:11px;color:#aaa;border-top:1px solid #eee;padding-top:14px}@media print{@page{margin:0}}</style></head><body>
  <div class="h"><div><div class="brand">⚡ ENERGY</div><div style="font-size:11px;color:#888;margin-top:3px">Climatización · Eléctrico · Plomería · Construcción</div></div><div style="text-align:right"><div class="badge">COTIZACIÓN</div><div style="font-size:12px;color:#888;margin-top:6px">${q.folio} · ${q.fecha}</div><div style="font-size:12px;color:#888">Válida: ${q.vigencia}</div></div></div>
  <div class="ig"><div class="box"><h3>Cliente</h3><div style="font-weight:700">${q.cliente}</div><div style="font-size:12px;color:#666">${q.clienteTel||""} · ${q.clienteEmail||""}</div><div style="font-size:12px;color:#666">${q.clienteDireccion||""}</div></div><div class="box"><h3>Servicio</h3><div style="font-weight:700">${q.titulo}</div><div style="font-size:12px;color:#666">${q.descripcionGeneral||""}</div></div></div>
  <table><thead><tr><th>#</th><th>Descripción</th><th>Unidad</th><th style="text-align:right">Cant.</th><th style="text-align:right">P.U.</th><th style="text-align:right">Importe</th></tr></thead><tbody>${q.items.map((it,i)=>`<tr><td>${i+1}</td><td><strong>${it.nombre}</strong><br/><span style="font-size:11px;color:#888">${it.descripcion||""}</span></td><td>${it.unidad}</td><td style="text-align:right">${it.cantidad}</td><td style="text-align:right">${fmt(it.precio)}</td><td style="text-align:right"><strong>${fmt(it.precio*it.cantidad)}</strong></td></tr>`).join("")}</tbody></table>
  <div class="totals"><div class="tr"><span>Subtotal:</span><span>${fmt(sub)}</span></div>${q.includeIVA?`<div class="tr"><span>IVA 16%:</span><span>${fmt(iva)}</span></div>`:""}<div class="tr grand"><span>TOTAL:</span><span>${fmt(total)}</span></div></div>
  ${q.notas?`<div style="background:#fff8e7;border-left:4px solid #f5a623;border-radius:0 8px 8px 0;padding:14px;font-size:13px;color:#555;margin-bottom:20px"><strong>Notas:</strong> ${q.notas}</div>`:""}
  <div class="footer">ENERGY · contacto@energy.mx · Tel: 555-0000</div>
  </body></html>`);
  w.document.close(); setTimeout(()=>w.print(),400);
}

function printReportPDF(project){
  const r=project.reporte;
  const gastosTotal=project.gastos.reduce((s,g)=>s+g.monto,0);
  const utilidad=project.precioVenta-gastosTotal;
  const faseHTML=(key,label,icon,color)=>{
    const photos=r.fotos[key]||[];
    if(!photos.length)return "";
    return `<div style="margin-bottom:20px"><div style="font-size:13px;font-weight:800;border-left:4px solid ${color};padding-left:10px;margin-bottom:10px">${icon} Fotografías ${label}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">${photos.map((p,i)=>`<div><img src="${p.src}" style="width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px;border:1px solid #eee"/><div style="text-align:center;font-size:10px;color:#888;margin-top:3px">${label} ${i+1}</div></div>`).join("")}</div></div>`;
  };
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><title>Reporte ${project.folio}</title><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;background:#f5f5f5}.page{max-width:820px;margin:0 auto;background:#fff}.hdr{background:linear-gradient(135deg,#111 60%,#1a1a2e);color:#fff;padding:32px 40px}.sec{padding:24px 40px;border-bottom:1px solid #eee}.st{font-size:15px;font-weight:900;color:#111;margin-bottom:14px}.ig{display:grid;grid-template-columns:1fr 1fr;gap:14px}.box{background:#f8f9fa;border-radius:10px;padding:14px}.box h3{font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#888;margin-bottom:8px}.row{display:flex;gap:8px;font-size:13px;margin-bottom:3px}.l{color:#888;min-width:80px}.v{font-weight:600;color:#111}.fin{padding:24px 40px;border-bottom:1px solid #eee}.ftr{background:#111;color:#aaa;padding:20px 40px;text-align:center;font-size:11px}@media print{body{background:#fff}@page{margin:0}}</style></head><body>
  <div class="page">
    <div class="hdr">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
        <div><div style="font-size:24px;font-weight:900">⚡ ENERGY</div><div style="font-size:11px;color:#aaa;margin-top:3px;letter-spacing:1px;text-transform:uppercase">Reporte de Trabajo Realizado</div></div>
        <div style="text-align:right"><div style="background:#f5a623;color:#000;padding:5px 16px;border-radius:99px;font-size:11px;font-weight:900;display:inline-block">REPORTE</div><div style="font-size:11px;color:#888;margin-top:6px">${project.folio} · ${r.fechaReporte||project.fechaFin}</div></div>
      </div>
      <div style="font-size:22px;font-weight:900;color:#fff;margin-bottom:6px">${project.titulo}</div>
    </div>
    <div class="sec"><div class="ig">
      <div class="box"><h3>Cliente</h3><div class="row"><span class="l">Nombre:</span><span class="v">${project.cliente}</span></div><div class="row"><span class="l">Teléfono:</span><span class="v">${project.clienteTel}</span></div><div class="row"><span class="l">Email:</span><span class="v">${project.clienteEmail}</span></div><div class="row"><span class="l">Dirección:</span><span class="v">${project.direccion}</span></div></div>
      <div class="box"><h3>Servicio</h3><div class="row"><span class="l">Folio:</span><span class="v">${project.folio}</span></div><div class="row"><span class="l">Técnico:</span><span class="v">${project.tecnico}</span></div><div class="row"><span class="l">Cuadrilla:</span><span class="v">${project.cuadrilla}</span></div><div class="row"><span class="l">Fechas:</span><span class="v">${project.fechaInicio} → ${project.fechaFin}</span></div></div>
    </div></div>
    <div class="fin"><div class="st">💰 Resumen Financiero</div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        <div class="box" style="text-align:center"><div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase">Precio Venta</div><div style="font-size:20px;font-weight:900;color:#27ae60">${fmt(project.precioVenta)}</div></div>
        <div class="box" style="text-align:center"><div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase">Gastos</div><div style="font-size:20px;font-weight:900;color:#e74c3c">${fmt(gastosTotal)}</div></div>
        <div class="box" style="text-align:center"><div style="font-size:11px;color:#888;margin-bottom:4px;text-transform:uppercase">Utilidad</div><div style="font-size:20px;font-weight:900;color:#f5a623">${fmt(utilidad)}</div></div>
      </div>
    </div>
    <div class="sec"><div class="st">📸 Evidencia Fotográfica</div>
      ${faseHTML("antes","Antes","🔴","#e74c3c")}
      ${faseHTML("durante","Durante","🟡","#f5a623")}
      ${faseHTML("despues","Después","🟢","#27ae60")}
      ${!r.fotos.antes.length&&!r.fotos.durante.length&&!r.fotos.despues.length?'<p style="color:#aaa;text-align:center;padding:20px">Sin fotografías adjuntas</p>':""}
    </div>
    <div class="sec"><div class="st">📝 Trabajo Realizado</div>
      <div style="background:#f8f9fa;border-radius:8px;padding:14px;font-size:13px;color:#444;line-height:1.7;white-space:pre-line;margin-bottom:14px">${r.trabajoRealizado||"Sin descripción"}</div>
      <div style="font-size:14px;font-weight:800;color:#111;margin-bottom:8px">💬 Comentarios Técnicos</div>
      <div style="background:#f8f9fa;border-radius:8px;padding:14px;font-size:13px;color:#444;line-height:1.7">${r.comentariosTecnicos||"Sin comentarios"}</div>
      ${r.observaciones?`<div style="background:#fff8e7;border-left:4px solid #f5a623;border-radius:0 8px 8px 0;padding:14px;font-size:13px;color:#555;margin-top:12px"><strong>⚠️ Observaciones:</strong> ${r.observaciones}</div>`:""}
    </div>
    <div class="ftr">ENERGY · contacto@energy.mx · Tel: 555-0000 · ${project.folio}</div>
  </div></body></html>`);
  w.document.close(); setTimeout(()=>w.print(),400);
}

// ═══════════════════════════════════════════════════════════════
// LOGIN
// ═══════════════════════════════════════════════════════════════
function Login({onLogin}){
  const [u,setU]=useState(""); const [p,setP]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false); const [show,setShow]=useState(false);
  const go=async()=>{
    if(!u||!p){setErr("Ingresa usuario y contraseña");return;}
    setLoading(true);setErr("");
    await new Promise(r=>setTimeout(r,700));
    const found=USERS.find(x=>x.usuario===u&&x.password===p&&x.activo);
    if(!found){setErr("Usuario o contraseña incorrectos");setLoading(false);return;}
    setLoading(false);onLogin(found);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <div style={{position:"absolute",top:-100,right:-100,width:400,height:400,borderRadius:"50%",background:`radial-gradient(circle,${C.accent}18 0%,transparent 70%)`}}/>
        <div style={{position:"absolute",bottom:-80,left:-80,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle,${C.blue}14 0%,transparent 70%)`}}/>
      </div>
      <div style={{width:"100%",maxWidth:400,position:"relative",zIndex:1}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:76,height:76,borderRadius:22,background:`linear-gradient(135deg,${C.accent},#c47d0e)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,margin:"0 auto 14px",boxShadow:`0 0 50px ${C.accent}50`}}>⚡</div>
          <div style={{fontSize:38,fontWeight:900,color:C.text,letterSpacing:-2}}>ENERGY</div>
          <div style={{fontSize:12,color:C.muted,letterSpacing:3,textTransform:"uppercase",marginTop:4}}>Sistema de Gestión</div>
        </div>
        <div style={{background:C.surface,borderRadius:20,padding:"32px 28px",border:`1.5px solid ${C.border}`,boxShadow:"0 40px 80px #00000090"}}>
          <div style={{fontSize:16,fontWeight:800,color:C.text,marginBottom:4}}>Iniciar Sesión</div>
          <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Ingresa tus credenciales de acceso</div>
          <div style={{marginBottom:14}}><Lbl>Usuario</Lbl><input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="tu.usuario" style={inp}/></div>
          <div style={{marginBottom:20}}><Lbl>Contraseña</Lbl>
            <div style={{position:"relative"}}>
              <input value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} type={show?"text":"password"} placeholder="••••••••" style={{...inp,paddingRight:44}}/>
              <button onClick={()=>setShow(s=>!s)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>{show?"🙈":"👁️"}</button>
            </div>
          </div>
          {err&&<div style={{background:C.red+"18",border:`1px solid ${C.red}44`,borderRadius:10,padding:"10px 14px",color:C.red,fontSize:13,marginBottom:16,fontWeight:600}}>⚠️ {err}</div>}
          <button onClick={go} disabled={loading} style={{width:"100%",background:loading?C.border:`linear-gradient(135deg,${C.accent},#c47d0e)`,color:loading?C.muted:"#000",border:"none",borderRadius:12,padding:"14px",fontWeight:900,fontSize:15,cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":`0 8px 24px ${C.accent}40`}}>{loading?"Verificando...":"Entrar al sistema →"}</button>
          <div style={{marginTop:20,padding:"12px",background:C.card,borderRadius:10,border:`1px solid ${C.border}`}}>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:6,textTransform:"uppercase",letterSpacing:1}}>Accesos de prueba</div>
            <div style={{fontSize:12,color:C.sub,lineHeight:1.9}}><span style={{color:C.accent}}>admin</span> / admin123 — Administrador<br/><span style={{color:C.blue}}>juan.perez</span> / juan123 — Trabajador (Cuadrilla Alpha)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

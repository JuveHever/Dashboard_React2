import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Upload, ShoppingCart, TrendingUp, Calendar, Clock, Store, Tag, BarChart, Info, ShoppingBag, Layers, Map, ChefHat, Utensils, PieChart, Filter, RotateCcw } from 'lucide-react';

// --- DATOS DE MUESTRA ---
const sampleCSV = `FACT_CODIGO;FACT_FECHA;DIA;HORA;FACT_VALOR;FACT_NOM_EST;EDFP_NOMBRE_PROD;CATEGORIA;SUBCATEGORIA;EDFP_VALOR_PROD;CIUDAD
1;2026-02-21;Sábado;15:27:54;$ 19.000;SUPERTIENDAS CAÑAVERAL S.A.S.;PAN GUADALUPE*450g;ALIMENTOS;PANADERIA;$ 19.000;CALI
2;2026-02-21;Sábado;12:45:00;$ 10.000;SUPERTIENDAS CAÑAVERAL S.A.S.;LECHE ENTERA;LACTEOS;LECHES;$ 10.000;CALI
3;2026-02-24;Martes;21:02:00;$ 200;D1 SAS;BOLSA RECICLA;BOLSAS PLASTICAS;BOLSAS PLASTICAS;$ 200;BOGOTA
4;2026-02-24;Martes;21:05:00;$ 8.000;D1 SAS;DETERGENTE;ASEO;CUIDADO ROPA;$ 5.000;BOGOTA
4;2026-02-24;Martes;21:05:00;$ 8.000;D1 SAS;JABON REY;ASEO;CUIDADO ROPA;$ 3.000;BOGOTA
5;2026-02-24;Martes;23:15:00;$ 15000;SUPERTIENDAS CAÑAVERAL S.A.S.;HUEVOS AA;ALIMENTOS;HUEVOS;$ 15000;CALI
6;2026-02-25;Miércoles;14:30:00;$ 57000;MAKRO;CARNE RES;CARNES;RES;$ 45000;MEDELLIN
6;2026-02-25;Miércoles;14:30:00;$ 57000;MAKRO;ARROZ DIANA;GRANOS;ARROZ;$ 12000;MEDELLIN
7;2026-02-25;Miércoles;15:00:00;$ 15000;D1 SAS;LECHE ENTERA;LACTEOS;LECHES;$ 10000;BOGOTA
7;2026-02-25;Miércoles;15:00:00;$ 15000;D1 SAS;DETERGENTE;ASEO;CUIDADO ROPA;$ 5000;BOGOTA
8;2026-02-25;Miércoles;10:00:00;$ 25000;D1 SAS;HARINA DE TRIGO HAZ DE OROS;ALIMENTOS;HARINAS;$ 5000;BOGOTA
8;2026-02-25;Miércoles;10:00:00;$ 25000;D1 SAS;HUEVOS AA;ALIMENTOS;HUEVOS;$ 10000;BOGOTA
8;2026-02-25;Miércoles;10:00:00;$ 25000;D1 SAS;MANTEQUILLA;LACTEOS;ESPARCIBLES;$ 10000;BOGOTA
9;2026-02-25;Miércoles;11:00:00;$ 15000;MAKRO;HARINA DE MAIZ PAN;ALIMENTOS;HARINAS;$ 4000;MEDELLIN
9;2026-02-25;Miércoles;11:00:00;$ 15000;MAKRO;QUESO CAMPESINO;LACTEOS;QUESOS;$ 11000;MEDELLIN
10;2026-02-25;Miércoles;12:00:00;$ 12000;SUPERTIENDAS CAÑAVERAL S.A.S.;FIDEOS DORIA;ALIMENTOS;PASTAS;$ 3000;CALI
10;2026-02-25;Miércoles;12:00:00;$ 12000;SUPERTIENDAS CAÑAVERAL S.A.S.;SALSA DE TOMATE;ALIMENTOS;SALSAS;$ 5000;CALI
10;2026-02-25;Miércoles;12:00:00;$ 12000;SUPERTIENDAS CAÑAVERAL S.A.S.;QUESO PARMESANO;LACTEOS;QUESOS;$ 4000;CALI
11;2026-02-26;Jueves;13:00:00;$ 12000;D1 SAS;ESPAGUETI LA MUÑECA;ALIMENTOS;PASTAS;$ 4000;BOGOTA
11;2026-02-26;Jueves;13:00:00;$ 12000;D1 SAS;CARNE MOLIDA;CARNES;RES;$ 8000;BOGOTA
12;2026-02-26;Jueves;14:00:00;$ 9000;D1 SAS;AREPARINA;ALIMENTOS;HARINAS;$ 4000;BOGOTA
12;2026-02-26;Jueves;14:00:00;$ 9000;D1 SAS;QUESO CAMPESINO;LACTEOS;QUESOS;$ 5000;BOGOTA`;

const CHART_COLORS = [
  'bg-indigo-500', 'bg-fuchsia-500', 'bg-teal-500', 'bg-amber-500', 
  'bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 
  'bg-cyan-500', 'bg-purple-500', 'bg-pink-500', 'bg-lime-500'
];

// Colores HEX para las gráficas SVG (Donas) equivalentes a la paleta de Tailwind
const HEX_COLORS = [
  '#6366f1', '#d946ef', '#14b8a6', '#f59e0b', 
  '#f43f5e', '#3b82f6', '#10b981', '#f97316', 
  '#06b6d4', '#a855f7', '#ec4899', '#84cc16'
];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
    {children}
  </div>
);

const ProgressBar = ({ label, value, max, formatValue, colorClass = "bg-blue-500", suffix = "", className = "mb-4 last:mb-0" }) => {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={className}>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700 dark:text-gray-200 truncate pr-4">{label}</span>
        <span className="text-gray-500 dark:text-gray-400 font-semibold">
          {formatValue ? formatValue(value) : value}{suffix}
        </span>
      </div>
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

// --- COMPONENTE NUEVO: GRÁFICA DE DONA SVG ---
const SVGDonut = ({ slices, size = "w-28 h-28 sm:w-32 sm:h-32" }) => {
  const total = slices.reduce((acc, s) => acc + s.value, 0);
  let offset = 0;
  return (
    <div className={`relative ${size} flex-shrink-0`}>
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 rounded-full drop-shadow-sm">
        <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="20" className="dark:stroke-gray-700/50" />
        {total > 0 && slices.map((s, i) => {
          const perc = (s.value / total) * 100;
          const dash = `${perc} ${100 - perc}`;
          const currentOffset = offset;
          offset -= perc;
          return (
            <circle
              key={i}
              cx="50" cy="50" r="40"
              fill="transparent"
              stroke={s.hexColor}
              strokeWidth="20"
              strokeDasharray={dash}
              strokeDashoffset={currentOffset}
              pathLength="100"
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
    </div>
  );
};

const cleanNumber = (val) => {
  if (!val) return 0;
  let clean = String(val).replace(/[$\s.]/g, '').replace(/,/g, '.');
  return parseFloat(clean) || 0;
};

const extractHourNum = (timeStr) => {
  if (!timeStr) return -1;
  let cleanTime = String(timeStr).trim().toLowerCase().replace(/[\u202F\u00A0]/g, ' ');
  if (!cleanTime.includes(':') && !isNaN(cleanTime)) {
    const floatTime = parseFloat(cleanTime);
    if (floatTime > 0 && floatTime <= 1) return Math.floor(floatTime * 24) % 24; 
  }
  const match = cleanTime.match(/(\d{1,2}):/);
  if (!match) return -1;
  let hour = parseInt(match[1], 10);
  if (cleanTime.includes('p') && hour < 12) hour += 12;
  if (cleanTime.includes('a') && hour === 12) hour = 0;
  return (hour >= 0 && hour <= 23) ? hour : -1; 
};

const formatHourAmPm = (h) => {
  if (h === 0) return '12am';
  if (h === 12) return '12pm';
  if (h > 12) return `${h - 12}pm`;
  return `${h}am`;
};

const getHourRange = (hour) => {
  if (hour < 0 || hour > 23) return "N/A";
  const nextHour = (hour + 1) % 24;
  return `${formatHourAmPm(hour)} - ${formatHourAmPm(nextHour)}`;
};

const getJornada = (hour) => {
  if (hour < 0 || hour > 23) return "N/A";
  if (hour >= 6 && hour < 12) return "Mañana";
  if (hour >= 12 && hour < 18) return "Tarde";
  if (hour >= 18 && hour < 22) return "Noche";
  return "Madrugada"; 
};

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  const delimiter = lines[0].includes(';') ? ';' : ','; 
  const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(delimiter);
    if (currentLine.length < headers.length) continue; 
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = currentLine[index] ? currentLine[index].trim().replace(/^"|"$/g, '') : '';
    });
    data.push(obj);
  }
  return data;
};

const analyzeData = (data) => {
  const chains = new Set();
  const uniqueCitiesSet = new Set();
  const uniqueCategoriesSet = new Set();
  const cleanRows = []; 

  const scope = {
    harinas: { invoices: new Set(), trigoInvoices: new Set(), maizInvoices: new Set(), trigoCount: 0, maizCount: 0, otrasCount: 0, hours: {}, days: {}, trigoAffinity: {}, maizAffinity: {} },
    pastas: { invoices: new Set(), count: 0, hours: {}, days: {}, affinity: {} }
  };
  
  const invoiceProductsList = {};
  const invoiceSubcategoriesList = {}; 
  const invoiceHourMap = {};
  const invoiceDayMap = {};
  const invoiceTotals = {};

  data.forEach(row => {
    const rawCod = row.FACT_CODIGO || row.FACT_NROFACTURA; 
    const chain = row.FACT_NOM_EST || 'Sin Cadena Identificada';
    const prod = row.EDFP_NOMBRE_PROD || row.Producto;
    const cat = row.CATEGORIA || row.categoria || 'Sin Canasta';
    const subcat = row.SUBCATEGORIA || row.subcategoria || ''; 
    const date = row.FACT_FECHA || row.FECHA;
    const time = row.HORA;
    const city = (row.CIUDAD || row.ciudad || 'Sin Ciudad').toUpperCase();
    
    const invoiceVal = cleanNumber(row.FACT_VALOR); 
    const prodVal = cleanNumber(row.EDFP_VALOR_PROD || row.VALOR_PRODUCTO || 0);
    const dayRaw = row.DIA || row.dia; 

    if (!rawCod || !prod) return;
    const cod = `${chain}_${rawCod}`; 
    const subcatClean = subcat || 'Sin Categoría';
    
    cleanRows.push({...row, CIUDAD_CLEAN: city, CAT_CLEAN: cat, SUBCAT_CLEAN: subcatClean, COD_UNICO: cod, CHAIN_CLEAN: chain, PROD_CLEAN: prod, VAL_CLEAN: invoiceVal, PROD_VAL_CLEAN: prodVal, TIME_CLEAN: time, DATE_CLEAN: date, DAY_CLEAN: dayRaw}); 
    
    chains.add(chain);
    uniqueCitiesSet.add(city);
    uniqueCategoriesSet.add(cat);

    if (!invoiceProductsList[cod]) invoiceProductsList[cod] = [];
    invoiceProductsList[cod].push(prod);

    if (!invoiceSubcategoriesList[cod]) invoiceSubcategoriesList[cod] = new Set();
    invoiceSubcategoriesList[cod].add(subcatClean);

    invoiceTotals[cod] = invoiceVal;

    let dayStr = "N/A";
    if (dayRaw) {
        dayStr = dayRaw.trim().charAt(0).toUpperCase() + dayRaw.trim().slice(1).toLowerCase();
    } else if (date) {
        const d = new Date(date);
        if(!isNaN(d)) dayStr = new Intl.DateTimeFormat('es-CO', {weekday: 'long'}).format(d);
        if(dayStr) dayStr = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
    }
    invoiceDayMap[cod] = dayStr;

    if (time) {
        const hour = extractHourNum(time);
        if (hour !== -1) invoiceHourMap[cod] = hour;
    }

    const pUp = String(prod).toUpperCase();
    const subcatUp = String(subcat).toUpperCase();
    const isHarina = subcatUp.includes('HARINA') || subcatUp === 'HARINAS';
    const isPasta = subcatUp.includes('PASTA') || subcatUp === 'PASTAS';
    
    const isTrigo = isHarina && pUp.includes('TRIGO');
    const isMaiz = isHarina && (pUp.includes('MAIZ') || pUp.includes('AREPAR') || pUp.includes('PROMASA'));
    const isOtraHarina = isHarina && !isTrigo && !isMaiz;

    if (isHarina) {
      scope.harinas.invoices.add(cod);
      if (isTrigo) { scope.harinas.trigoCount++; scope.harinas.trigoInvoices.add(cod); }
      else if (isMaiz) { scope.harinas.maizCount++; scope.harinas.maizInvoices.add(cod); }
      else if (isOtraHarina) { scope.harinas.otrasCount++; }
    }
    if (isPasta) {
      scope.pastas.invoices.add(cod);
      scope.pastas.count++;
    }
  });

  const totalInvoicesCount = Object.keys(invoiceTotals).length;

  Object.entries(invoiceProductsList).forEach(([invCod, prods]) => {
    const isHarinaTrigoInv = scope.harinas.trigoInvoices.has(invCod);
    const isHarinaMaizInv = scope.harinas.maizInvoices.has(invCod);
    const isPastaInv = scope.pastas.invoices.has(invCod);
    const h = invoiceHourMap[invCod];
    const d = invoiceDayMap[invCod];

    if (scope.harinas.invoices.has(invCod)) {
        if (h !== undefined) scope.harinas.hours[h] = (scope.harinas.hours[h] || 0) + 1;
        if (d !== undefined && d !== "N/A") scope.harinas.days[d] = (scope.harinas.days[d] || 0) + 1;
    }
    if (isPastaInv) {
        if (h !== undefined) scope.pastas.hours[h] = (scope.pastas.hours[h] || 0) + 1;
        if (d !== undefined && d !== "N/A") scope.pastas.days[d] = (scope.pastas.days[d] || 0) + 1;
    }

    const subcats = Array.from(invoiceSubcategoriesList[invCod] || []);
    
    subcats.forEach(sub => {
      const subUp = String(sub).toUpperCase();
      if (subUp === 'SIN CATEGORÍA') return;
      
      if (isHarinaTrigoInv && !subUp.includes('HARINA')) scope.harinas.trigoAffinity[sub] = (scope.harinas.trigoAffinity[sub] || 0) + 1;
      if (isHarinaMaizInv && !subUp.includes('HARINA')) scope.harinas.maizAffinity[sub] = (scope.harinas.maizAffinity[sub] || 0) + 1;
      if (isPastaInv && !subUp.includes('PASTA')) scope.pastas.affinity[sub] = (scope.pastas.affinity[sub] || 0) + 1;
    });
  });

  const getPeakHourKey = (hObj) => { const s = Object.entries(hObj).sort((a,b)=>b[1]-a[1]); return s.length > 0 ? parseInt(s[0][0]) : -1; };
  const getPeakDayKey = (dObj) => { const s = Object.entries(dObj).sort((a,b)=>b[1]-a[1]); return s.length > 0 ? s[0][0] : "N/A"; };
  const getAvg = (invSet) => { let sum = 0; invSet.forEach(c => sum += (invoiceTotals[c] || 0)); return invSet.size > 0 ? sum / invSet.size : 0; };
  const getAffinityPercentageList = (obj, totalBaseInvoices) => Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,5).map(x => ({name: x[0], value: totalBaseInvoices > 0 ? (x[1] / totalBaseInvoices) * 100 : 0}));
  const getAvgBasketSize = (invSet) => { let sum = 0; invSet.forEach(c => sum += (invoiceProductsList[c] ? invoiceProductsList[c].length : 0)); return invSet.size > 0 ? sum / invSet.size : 0; };

  const totalHarinasCount = scope.harinas.trigoCount + scope.harinas.maizCount + scope.harinas.otrasCount;
  
  const harinasMix = [
    { name: 'Harina de Trigo', value: totalHarinasCount ? (scope.harinas.trigoCount / totalHarinasCount) * 100 : 0 },
    { name: 'Harina de Maíz', value: totalHarinasCount ? (scope.harinas.maizCount / totalHarinasCount) * 100 : 0 },
    { name: 'Otras Harinas', value: totalHarinasCount ? (scope.harinas.otrasCount / totalHarinasCount) * 100 : 0 }
  ].sort((a, b) => b.value - a.value);

  const deepDive = {
    harinas: {
      penetration: totalInvoicesCount ? (scope.harinas.invoices.size / totalInvoicesCount) * 100 : 0,
      mix: harinasMix,
      avgTicket: getAvg(scope.harinas.invoices),
      avgItems: scope.harinas.invoices.size > 0 ? totalHarinasCount / scope.harinas.invoices.size : 0,
      basketSize: getAvgBasketSize(scope.harinas.invoices),
      peakHour: getHourRange(getPeakHourKey(scope.harinas.hours)),
      peakDay: getPeakDayKey(scope.harinas.days),
      topTrigoAff: getAffinityPercentageList(scope.harinas.trigoAffinity, scope.harinas.trigoInvoices.size),
      topMaizAff: getAffinityPercentageList(scope.harinas.maizAffinity, scope.harinas.maizInvoices.size)
    },
    pastas: {
      penetration: totalInvoicesCount ? (scope.pastas.invoices.size / totalInvoicesCount) * 100 : 0,
      avgTicket: getAvg(scope.pastas.invoices),
      avgItems: scope.pastas.invoices.size > 0 ? scope.pastas.count / scope.pastas.invoices.size : 0,
      basketSize: getAvgBasketSize(scope.pastas.invoices),
      peakHour: getHourRange(getPeakHourKey(scope.pastas.hours)),
      peakDay: getPeakDayKey(scope.pastas.days),
      topAff: getAffinityPercentageList(scope.pastas.affinity, scope.pastas.invoices.size)
    }
  };

  return {
    chainList: Array.from(chains).sort(),
    cityList: Array.from(uniqueCitiesSet).sort(),
    catList: Array.from(uniqueCategoriesSet).sort(),
    cleanRows,
    deepDive
  };
};

// --- COMPONENTE UNIFICADO: GRÁFICA DE BARRAS APILADAS AL 100% (CON EJE Y) ---
const PercentageStackedBarChart = ({ chartData, title, description, icon: Icon, filterLabel, filterValue, setFilterValue, filterOptions, defaultFilterText, valueSuffix = "unid.", isCurrency = false, hideYAxis = false }) => (
  <Card className="flex flex-col h-full">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
      <div>
        <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100"><Icon className="text-indigo-500 dark:text-indigo-400"/> {title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      {filterLabel && (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600 max-w-full sm:max-w-xs">
          <Filter size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <label className="text-sm font-medium text-gray-500 dark:text-gray-300 flex-shrink-0">{filterLabel}:</label>
          <select 
            value={filterValue} 
            onChange={(e) => setFilterValue(e.target.value)} 
            className="bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded focus:ring-0 text-sm font-bold cursor-pointer w-full truncate shadow-sm"
          >
            <option value="TODAS">{defaultFilterText}</option>
            {filterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      )}
    </div>

    {chartData && chartData.chartColumns.length > 0 ? (
      <>
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-8 justify-center">
          {chartData.topSegments.map((segment, idx) => (
            <div key={segment} className="flex items-center gap-1.5">
              <div className={`w-3.5 h-3.5 rounded-sm shadow-sm ${CHART_COLORS[idx % CHART_COLORS.length]}`}></div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{segment}</span>
            </div>
          ))}
          {chartData.chartColumns.some(col => col.blocks.some(b => b.name === 'Otros')) && (
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-sm shadow-sm bg-gray-300 dark:bg-gray-600"></div>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Otros</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 w-full gap-2 relative">
          {!hideYAxis && (
            <div className="flex flex-col justify-between items-end pb-8 pr-2 border-r border-gray-200 dark:border-gray-700 w-10 sm:w-12 flex-shrink-0 relative z-10">
               {['100%', '75%', '50%', '25%', '0%'].map((tick, i) => (
                  <span key={i} className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap transform translate-y-1/2">{tick}</span>
               ))}
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-[280px]">
            {/* ÁREA DE BARRAS */}
            <div className="flex items-end justify-around flex-1 w-full relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-gray-100 dark:border-gray-800/50"></div>)}
              </div>

              {chartData.chartColumns.map(col => (
                <div key={col.label} className={`flex-1 flex flex-col items-center justify-end h-full z-10 px-1 sm:px-2 min-w-0 ${col.isGeneral ? 'border-l-2 border-dashed border-indigo-200 dark:border-indigo-800/50 pl-2 sm:pl-3 ml-1 sm:ml-2 relative' : ''}`}>
                  {col.isGeneral && <span className="absolute -top-7 text-[9px] sm:text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded shadow-sm">Global</span>}
                  <div className={`w-full max-w-[60px] flex flex-col-reverse h-full bg-gray-100 dark:bg-gray-700/50 rounded-t-sm overflow-hidden shadow-inner group ${col.isGeneral ? 'ring-2 ring-indigo-500/30 dark:ring-indigo-400/30' : ''}`}>
                    {col.blocks.map(b => b.perc > 0 && (
                      <div 
                        key={b.name} 
                        style={{ height: `${b.perc}%` }} 
                        className={`${b.color} w-full flex items-center justify-center transition-all hover:opacity-90 cursor-crosshair border-b border-white/20 dark:border-black/20 last:border-b-0`} 
                        title={`${col.label}\n${b.name}\n${b.perc.toFixed(1)}% (${isCurrency ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(b.val) : b.val + ' ' + valueSuffix})`}
                      >
                        {b.perc > 8 && <span className="text-[9px] sm:text-[10px] text-white font-bold tracking-tight px-1 truncate drop-shadow-md">{b.perc.toFixed(0)}%</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* EJE X */}
            <div className="flex justify-around w-full mt-3 h-10">
              {chartData.chartColumns.map(col => (
                <div key={col.label} className={`flex-1 flex flex-col items-center justify-start text-center px-1 sm:px-2 min-w-0 ${col.isGeneral ? 'border-l-2 border-transparent pl-2 sm:pl-3 ml-1 sm:ml-2' : ''}`}>
                  <span className={`text-[9px] sm:text-[10px] font-bold w-full break-words leading-tight line-clamp-2 ${col.isGeneral ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`} title={col.label}>
                    {col.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    ) : (
      <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400 font-medium">No hay datos suficientes para esta selección.</div>
    )}
  </Card>
);


export default function App() {
  const [data, setData] = useState(null);
  
  // Filtros del Capítulo 1
  const [selectedChain, setSelectedChain] = useState("TODAS");
  const [selectedCity, setSelectedCity] = useState("TODAS");
  const [selectedCategory, setSelectedCategory] = useState("TODAS");
  
  // Filtros del Capítulo 2
  const [filterCityForChart1, setFilterCityForChart1] = useState("TODAS"); 
  const [filterChainForChart2, setFilterChainForChart2] = useState("TODAS"); 
  const [filterCityForPies, setFilterCityForPies] = useState("TODAS"); 

  const [fileName, setFileName] = useState("Datos de Muestra");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    try {
      const parsed = parseCSV(sampleCSV);
      const results = analyzeData(parsed);
      setData(results);
    } catch (e) {
      console.error(e);
      setError("Error procesando los datos iniciales.");
    }
  }, []);

  const handleClearFilters = () => {
    setSelectedChain("TODAS");
    setSelectedCity("TODAS");
    setSelectedCategory("TODAS");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setError("");
    setData(null); 
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsed = parseCSV(text);
        if (parsed.length === 0) throw new Error("El archivo está vacío o no se pudo leer.");
        const results = analyzeData(parsed);
        setData(results);
        setSelectedChain("TODAS");
        setSelectedCity("TODAS");
        setSelectedCategory("TODAS");
        setFilterCityForChart1("TODAS");
        setFilterChainForChart2("TODAS");
        setFilterCityForPies("TODAS");
      } catch (err) {
        setError("Error al leer el archivo. Asegúrate de que sea un CSV válido.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const chapter1Stats = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;

    if (selectedChain !== "TODAS") filteredRows = filteredRows.filter(r => r.CHAIN_CLEAN === selectedChain);
    if (selectedCity !== "TODAS") filteredRows = filteredRows.filter(r => r.CIUDAD_CLEAN === selectedCity);
    if (selectedCategory !== "TODAS") filteredRows = filteredRows.filter(r => r.CAT_CLEAN === selectedCategory);

    const invoiceTotals = {};
    const invoiceHourMap = {};
    const dayTransactions = {};
    const hourTransactions = {};

    let totalRevenue = 0;
    let totalItems = 0;
    const categoriesCount = {};
    const subcategoriesCount = {};
    const productsCount = {};
    const catProducts = {};
    const invoiceSubcats = {}; // NUEVO: Para guardar las categorías por factura

    filteredRows.forEach(row => {
      const cod = row.COD_UNICO;
      const cat = row.CAT_CLEAN;
      const subcat = row.SUBCAT_CLEAN || 'Sin Categoría';
      const prod = row.PROD_CLEAN;
      
      categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
      subcategoriesCount[subcat] = (subcategoriesCount[subcat] || 0) + 1;
      productsCount[prod] = (productsCount[prod] || 0) + 1;

      if (!catProducts[cat]) catProducts[cat] = {};
      catProducts[cat][prod] = (catProducts[cat][prod] || 0) + 1;

      totalItems += 1;

      // NUEVO: Agrupamos las subcategorías presentes en cada factura única
      if (!invoiceSubcats[cod]) invoiceSubcats[cod] = new Set();
      invoiceSubcats[cod].add(subcat);

      if (!invoiceTotals.hasOwnProperty(cod)) {
        invoiceTotals[cod] = row.VAL_CLEAN;
        totalRevenue += row.VAL_CLEAN;

        let dayStr = "N/A";
        if (row.DAY_CLEAN) {
            dayStr = row.DAY_CLEAN.trim().charAt(0).toUpperCase() + row.DAY_CLEAN.trim().slice(1).toLowerCase();
        } else if (row.DATE_CLEAN) {
            const d = new Date(row.DATE_CLEAN);
            if(!isNaN(d)) dayStr = new Intl.DateTimeFormat('es-CO', {weekday: 'long'}).format(d);
            if(dayStr) dayStr = dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
        }

        if (dayStr !== "N/A") dayTransactions[dayStr] = (dayTransactions[dayStr] || 0) + 1;

        if (row.TIME_CLEAN) {
            const hour = extractHourNum(row.TIME_CLEAN);
            if (hour !== -1) {
              hourTransactions[hour] = (hourTransactions[hour] || 0) + 1;
              invoiceHourMap[cod] = hour;
            }
        }
      }
    });

    const totalInvoices = Object.keys(invoiceTotals).length;
    
    const topDayE = Object.entries(dayTransactions).sort((a,b) => b[1] - a[1])[0] || ["N/A", 0];
    const topHrE = Object.entries(hourTransactions).sort((a,b) => b[1] - a[1])[0];
    const topHrN = topHrE ? parseInt(topHrE[0]) : -1;

    const hStats = {};
    Object.keys(invoiceTotals).forEach(cod => {
        const h = invoiceHourMap[cod];
        if(h !== undefined && h !== -1) {
            if(!hStats[h]) hStats[h] = { sum: 0, count: 0 };
            hStats[h].sum += invoiceTotals[cod];
            hStats[h].count += 1;
        }
    });

    const topHrStats = hStats[topHrN];
    const topHrAvgVal = topHrStats ? (topHrStats.sum / topHrStats.count) : 0;

    let maxVolumeH = -1;
    let maxVolumeSum = 0;
    Object.entries(hStats).forEach(([h, s]) => {
        if (s.sum > maxVolumeSum) { maxVolumeSum = s.sum; maxVolumeH = parseInt(h); }
    });

    const avgOfMaxVolumeHour = maxVolumeH !== -1 && hStats[maxVolumeH].count > 0 ? (hStats[maxVolumeH].sum / hStats[maxVolumeH].count) : 0;

    const kpis = {
        topDay: topDayE[0], topDayCount: topDayE[1],
        topTxHourRange: getHourRange(topHrN), topTxJornada: getJornada(topHrN), topTxHourCount: topHrE ? topHrE[1] : 0, topTxHourAvgVal: topHrAvgVal,
        topAvgHourRange: getHourRange(maxVolumeH), topAvgJornada: getJornada(maxVolumeH), topAvgHourVal: avgOfMaxVolumeHour
    };

    const topCategories = Object.entries(categoriesCount).sort((a,b)=>b[1]-a[1]).slice(0, 5).map(([name, value]) => {
        const topProds = Object.entries(catProducts[name] || {}).sort((a,b)=>b[1]-a[1]).slice(0, 3).map(x => ({name: x[0], val: x[1]}));
        return { name, value, percentage: totalItems > 0 ? (value / totalItems) * 100 : 0, topProds };
    });

    const topProducts = Object.entries(productsCount).sort((a,b)=>b[1]-a[1]).slice(0, 10).map(([name, value]) => ({
        name, value, percentage: totalItems > 0 ? (value / totalItems) * 100 : 0
    }));

    const topSubcategories = Object.entries(subcategoriesCount)
      .map(([name, count]) => ({ name, count, percentage: totalItems > 0 ? (count / totalItems) * 100 : 0 }))
      .sort((a,b) => b.percentage - a.percentage).slice(0, 10);

    // NUEVO: Calcular afinidades cruzadas para el Top 10
    topSubcategories.forEach(topSub => {
      const affinityCount = {};
      let totalInvoicesWithThisSub = 0;

      Object.values(invoiceSubcats).forEach(subSet => {
        if (subSet.has(topSub.name)) {
          totalInvoicesWithThisSub++;
          subSet.forEach(otherSub => {
            if (otherSub !== topSub.name && otherSub !== 'Sin Categoría' && otherSub !== 'SIN CATEGORÍA') {
              affinityCount[otherSub] = (affinityCount[otherSub] || 0) + 1;
            }
          });
        }
      });

      topSub.top5Affinities = Object.entries(affinityCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({
          name,
          count,
          percentage: totalInvoicesWithThisSub > 0 ? (count / totalInvoicesWithThisSub) * 100 : 0
        }));
    });

    return {
      avgTicket: totalInvoices > 0 ? totalRevenue / totalInvoices : 0,
      avgItems: totalInvoices > 0 ? totalItems / totalInvoices : 0,
      totalInvoices,
      topCategories,
      topProducts,
      topSubcategories,
      kpis
    };
  }, [data, selectedChain, selectedCity, selectedCategory]);

  // --------------------------------------------------------------------------------
  // BARRAS APILADAS % POR DÍA + COLUMNA GENERAL
  // --------------------------------------------------------------------------------
  const daySalesData = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;
    if (selectedChain !== "TODAS") filteredRows = filteredRows.filter(r => r.CHAIN_CLEAN === selectedChain);
    if (selectedCity !== "TODAS") filteredRows = filteredRows.filter(r => r.CIUDAD_CLEAN === selectedCity);
    if (selectedCategory !== "TODAS") filteredRows = filteredRows.filter(r => r.CAT_CLEAN === selectedCategory);

    const dayOrder = { 'Lunes': 1, 'Martes': 2, 'Miércoles': 3, 'Jueves': 4, 'Viernes': 5, 'Sábado': 6, 'Domingo': 7 };
    const xTotals = {}; 
    const xSegmentTotals = {}; 
    const globalSegmentTotals = {}; 
    const invoiceTracker = {};

    filteredRows.forEach(r => {
      const cod = r.COD_UNICO;
      if (!invoiceTracker[cod]) {
        invoiceTracker[cod] = true; 
        
        const day = r.DAY_CLEAN ? r.DAY_CLEAN.trim().charAt(0).toUpperCase() + r.DAY_CLEAN.trim().slice(1).toLowerCase() : 'N/A';
        const chain = r.CHAIN_CLEAN || 'Sin Cadena';
        const val = r.VAL_CLEAN || 0;

        if (day === 'N/A') return;

        xTotals[chain] = (xTotals[chain] || 0) + val;
        
        if (!xSegmentTotals[chain]) xSegmentTotals[chain] = {};
        xSegmentTotals[chain][day] = (xSegmentTotals[chain][day] || 0) + val;
        
        globalSegmentTotals[day] = (globalSegmentTotals[day] || 0) + val;
      }
    });

    const topSegments = Object.keys(globalSegmentTotals).sort((a,b) => (dayOrder[a] || 99) - (dayOrder[b] || 99));
    const xList = Object.keys(xTotals).sort();

    const chartColumns = xList.map(chain => {
      const total = xTotals[chain];
      const blocks = [];
      topSegments.forEach((seg, idx) => {
        const val = xSegmentTotals[chain][seg] || 0;
        const perc = total > 0 ? (val / total) * 100 : 0;
        blocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val });
      });
      return { label: chain, total, blocks };
    });

    // Añadir columna GENERAL
    const generalTotal = Object.values(globalSegmentTotals).reduce((sum, val) => sum + val, 0);
    if (generalTotal > 0) {
      const generalBlocks = [];
      topSegments.forEach((seg, idx) => {
        const val = globalSegmentTotals[seg] || 0;
        const perc = generalTotal > 0 ? (val / generalTotal) * 100 : 0;
        generalBlocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val });
      });
      chartColumns.push({ label: 'GENERAL', total: generalTotal, blocks: generalBlocks, isGeneral: true });
    }

    return { topSegments, chartColumns };
  }, [data, selectedChain, selectedCity, selectedCategory]);

  // --------------------------------------------------------------------------------
  // BARRAS APILADAS % POR FRANJA HORARIA + COLUMNA GENERAL
  // --------------------------------------------------------------------------------
  const hourSalesData = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;
    if (selectedChain !== "TODAS") filteredRows = filteredRows.filter(r => r.CHAIN_CLEAN === selectedChain);
    if (selectedCity !== "TODAS") filteredRows = filteredRows.filter(r => r.CIUDAD_CLEAN === selectedCity);
    if (selectedCategory !== "TODAS") filteredRows = filteredRows.filter(r => r.CAT_CLEAN === selectedCategory);

    const xTotals = {};
    const xSegmentTotals = {};
    const globalSegmentTotals = {};
    const invoiceTracker = {};

    filteredRows.forEach(r => {
      const cod = r.COD_UNICO;
      if (!invoiceTracker[cod]) {
        invoiceTracker[cod] = true;
        
        const hourNum = r.TIME_CLEAN ? extractHourNum(r.TIME_CLEAN) : -1;
        const chain = r.CHAIN_CLEAN || 'Sin Cadena';
        const val = r.VAL_CLEAN || 0;

        if (hourNum === -1) return;

        const hourLabel = getHourRange(hourNum).replace(' - ', '-');

        xTotals[chain] = (xTotals[chain] || 0) + val;
        
        if (!xSegmentTotals[chain]) xSegmentTotals[chain] = {};
        xSegmentTotals[chain][hourLabel] = (xSegmentTotals[chain][hourLabel] || 0) + val;
        
        if (!globalSegmentTotals[hourNum]) globalSegmentTotals[hourNum] = { label: hourLabel, val: 0 };
        globalSegmentTotals[hourNum].val += val;
      }
    });

    const topHourNums = Object.entries(globalSegmentTotals)
      .sort((a,b) => b[1].val - a[1].val)
      .slice(0, 10)
      .map(x => parseInt(x[0]))
      .sort((a, b) => a - b);

    const topSegments = topHourNums.map(h => globalSegmentTotals[h].label);
    const xList = Object.keys(xTotals).sort(); 

    const chartColumns = xList.map(chain => {
      const total = xTotals[chain];
      const blocks = [];
      let remaining = 100;
      let sumVal = 0;
      
      topSegments.forEach((seg, idx) => {
        const val = xSegmentTotals[chain][seg] || 0;
        const perc = total > 0 ? (val / total) * 100 : 0;
        blocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val });
        remaining -= perc;
        sumVal += val;
      });
      
      const otrosVal = total - sumVal;
      if (remaining > 0.1 && otrosVal > 0) blocks.push({ name: 'Otros', perc: remaining, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosVal });
      
      return { label: chain, total, blocks };
    });

    // Añadir columna GENERAL
    const generalTotal = Object.values(globalSegmentTotals).reduce((sum, item) => sum + item.val, 0);
    if (generalTotal > 0) {
      const generalBlocks = [];
      let remainingGen = 100;
      let sumValGen = 0;
      topSegments.forEach((seg, idx) => {
        const gObj = Object.values(globalSegmentTotals).find(g => g.label === seg);
        const val = gObj ? gObj.val : 0;
        const perc = generalTotal > 0 ? (val / generalTotal) * 100 : 0;
        generalBlocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val });
        remainingGen -= perc;
        sumValGen += val;
      });
      const otrosGen = generalTotal - sumValGen;
      if (remainingGen > 0.1 && otrosGen > 0) {
        generalBlocks.push({ name: 'Otros', perc: remainingGen, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosGen });
      }
      chartColumns.push({ label: 'GENERAL', total: generalTotal, blocks: generalBlocks, isGeneral: true });
    }

    return { topSegments, chartColumns };
  }, [data, selectedChain, selectedCity, selectedCategory]);

  // --------------------------------------------------------------------------------
  // CÁLCULO DINÁMICO CAPÍTULO 2 (Mix Canastas) + COLUMNA GENERAL
  // --------------------------------------------------------------------------------
  const chart1Data = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;
    if (filterCityForChart1 !== "TODAS") filteredRows = filteredRows.filter(r => r.CIUDAD_CLEAN === filterCityForChart1);

    const xTotals = {};
    const xSegmentCounts = {};
    const globalSegmentCount = {};

    filteredRows.forEach(r => {
      const xCol = r.CHAIN_CLEAN || 'Sin Cadena'; 
      const seg = r.CAT_CLEAN || 'Sin Canasta'; 
      const val = r.PROD_VAL_CLEAN || 0; 
      
      xTotals[xCol] = (xTotals[xCol] || 0) + val;
      if (!xSegmentCounts[xCol]) xSegmentCounts[xCol] = {};
      xSegmentCounts[xCol][seg] = (xSegmentCounts[xCol][seg] || 0) + val;
      globalSegmentCount[seg] = (globalSegmentCount[seg] || 0) + val;
    });

    const topSegments = Object.entries(globalSegmentCount).sort((a,b)=>b[1]-a[1]).slice(0, 10).map(x=>x[0]);
    const xList = Object.keys(xTotals).sort();

    const chartColumns = xList.map(xLabel => {
      const total = xTotals[xLabel];
      const blocks = [];
      let remaining = 100;
      let sumVal = 0;

      topSegments.forEach((seg, idx) => {
        const count = xSegmentCounts[xLabel][seg] || 0;
        const perc = total > 0 ? (count / total) * 100 : 0;
        blocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val: count });
        remaining -= perc;
        sumVal += count;
      });

      const otrosVal = total - sumVal;
      if (remaining > 0.1 && otrosVal > 0) blocks.push({ name: 'Otros', perc: remaining, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosVal });
      
      return { label: xLabel, total, blocks };
    });

    // Añadir columna GENERAL
    const generalTotal = Object.values(globalSegmentCount).reduce((sum, val) => sum + val, 0);
    if (generalTotal > 0) {
      const generalBlocks = [];
      let remainingGen = 100;
      let sumValGen = 0;
      topSegments.forEach((seg, idx) => {
        const count = globalSegmentCount[seg] || 0;
        const perc = generalTotal > 0 ? (count / generalTotal) * 100 : 0;
        generalBlocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val: count });
        remainingGen -= perc;
        sumValGen += count;
      });
      const otrosGen = generalTotal - sumValGen;
      if (remainingGen > 0.1 && otrosGen > 0) {
         generalBlocks.push({ name: 'Otros', perc: remainingGen, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosGen });
      }
      chartColumns.push({ label: 'GENERAL', total: generalTotal, blocks: generalBlocks, isGeneral: true });
    }

    return { topSegments, chartColumns };
  }, [data, filterCityForChart1]);

  const chart2Data = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;
    if (filterChainForChart2 !== "TODAS") filteredRows = filteredRows.filter(r => r.CHAIN_CLEAN === filterChainForChart2);

    const xTotals = {};
    const xSegmentCounts = {};
    const globalSegmentCount = {};

    filteredRows.forEach(r => {
      const xCol = r.CIUDAD_CLEAN || 'Sin Ciudad'; 
      const seg = r.CAT_CLEAN || 'Sin Canasta'; 
      const val = r.PROD_VAL_CLEAN || 0; 
      
      xTotals[xCol] = (xTotals[xCol] || 0) + val;
      if (!xSegmentCounts[xCol]) xSegmentCounts[xCol] = {};
      xSegmentCounts[xCol][seg] = (xSegmentCounts[xCol][seg] || 0) + val;
      globalSegmentCount[seg] = (globalSegmentCount[seg] || 0) + val;
    });

    const topSegments = Object.entries(globalSegmentCount).sort((a,b)=>b[1]-a[1]).slice(0, 10).map(x=>x[0]);
    const xList = Object.keys(xTotals).sort();

    const chartColumns = xList.map(xLabel => {
      const total = xTotals[xLabel];
      const blocks = [];
      let remaining = 100;
      let sumVal = 0;

      topSegments.forEach((seg, idx) => {
        const count = xSegmentCounts[xLabel][seg] || 0;
        const perc = total > 0 ? (count / total) * 100 : 0;
        blocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val: count });
        remaining -= perc;
        sumVal += count;
      });

      const otrosVal = total - sumVal;
      if (remaining > 0.1 && otrosVal > 0) blocks.push({ name: 'Otros', perc: remaining, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosVal });
      
      return { label: xLabel, total, blocks };
    });

    // Añadir columna GENERAL
    const generalTotal = Object.values(globalSegmentCount).reduce((sum, val) => sum + val, 0);
    if (generalTotal > 0) {
      const generalBlocks = [];
      let remainingGen = 100;
      let sumValGen = 0;
      topSegments.forEach((seg, idx) => {
        const count = globalSegmentCount[seg] || 0;
        const perc = generalTotal > 0 ? (count / generalTotal) * 100 : 0;
        generalBlocks.push({ name: seg, perc, color: CHART_COLORS[idx % CHART_COLORS.length], val: count });
        remainingGen -= perc;
        sumValGen += count;
      });
      const otrosGen = generalTotal - sumValGen;
      if (remainingGen > 0.1 && otrosGen > 0) {
         generalBlocks.push({ name: 'Otros', perc: remainingGen, color: 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200', val: otrosGen });
      }
      chartColumns.push({ label: 'GENERAL', total: generalTotal, blocks: generalBlocks, isGeneral: true });
    }

    return { topSegments, chartColumns };
  }, [data, filterChainForChart2]);

  // --------------------------------------------------------------------------------
  // DATOS PARA LAS DONAS (Top 5 Canastas divididas por Cadena)
  // --------------------------------------------------------------------------------
  const topCategoryPiesData = useMemo(() => {
    if (!data) return null;
    let filteredRows = data.cleanRows;
    if (filterCityForPies !== "TODAS") filteredRows = filteredRows.filter(r => r.CIUDAD_CLEAN === filterCityForPies);

    // 1. Identificar el Top 5 de Canastas por Valor (EDFP_VALOR_PROD)
    const catTotals = {};
    filteredRows.forEach(r => {
      const cat = r.CAT_CLEAN || 'Sin Canasta';
      const val = r.PROD_VAL_CLEAN || 0;
      catTotals[cat] = (catTotals[cat] || 0) + val;
    });
    
    const top5Cats = Object.entries(catTotals)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 5)
      .map(x => x[0]);

    // 2. Para cada una de esas 5 canastas, calcular cuánto vendió cada Cadena
    const pies = top5Cats.map(catName => {
      const chainTotals = {};
      let totalVal = 0;
      
      filteredRows.forEach(r => {
        if ((r.CAT_CLEAN || 'Sin Canasta') === catName) {
          const chain = r.CHAIN_CLEAN || 'Sin Cadena';
          const val = r.PROD_VAL_CLEAN || 0;
          chainTotals[chain] = (chainTotals[chain] || 0) + val;
          totalVal += val;
        }
      });

      // Ordenar las cadenas de mayor a menor participación dentro de esta canasta
      const chains = Object.keys(chainTotals).sort((a,b) => chainTotals[b] - chainTotals[a]);
      
      const slices = chains.map((chain, idx) => {
        const globalChainIdx = data.chainList.indexOf(chain);
        const colorIdx = globalChainIdx >= 0 ? globalChainIdx : idx;
        return {
          label: chain,
          value: chainTotals[chain],
          hexColor: HEX_COLORS[colorIdx % HEX_COLORS.length] || '#000',
          colorClass: CHART_COLORS[colorIdx % CHART_COLORS.length]
        };
      });

      return {
        category: catName,
        total: totalVal,
        slices
      };
    });

    return pies;
  }, [data, filterCityForPies]);

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  const formatNumber = (val) => new Intl.NumberFormat('es-CO', { maximumFractionDigits: 1 }).format(val);

  if (!data && !error) return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-pulse text-xl text-indigo-600 dark:text-indigo-400 font-semibold">Analizando Datos...</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans p-4 sm:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3"><Store className="text-indigo-600 dark:text-indigo-400" size={32} /> Dashboard Retail Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">Archivo actual: <span className="font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/40 px-2 py-0.5 rounded text-sm">{fileName}</span></p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
            <button onClick={() => fileInputRef.current.click()} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm">
              <Upload size={20} /> Cargar Nuevo CSV
            </button>
          </div>
        </header>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl flex items-center gap-3 border border-red-200 dark:border-red-800"><Info size={24} /><p>{error}</p></div>}

        {data && chapter1Stats && (
          <>
            {/* CAPÍTULO 1 UNIFICADO: GENERALIDADES Y DESEMPEÑO */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8 transition-colors duration-300">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 border-l-4 border-indigo-500 pl-3 flex-shrink-0">
                  Capítulo 1: Generalidades y Desempeño
                </h2>
                <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg border border-indigo-100 dark:border-indigo-800/50 flex-wrap">
                  
                  {/* Filtro Cadena */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Store size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <label className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex-shrink-0">Cadena:</label>
                    <select 
                      value={selectedChain} 
                      onChange={(e) => setSelectedChain(e.target.value)} 
                      className="bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded focus:ring-0 text-sm font-bold cursor-pointer shadow-sm w-full sm:w-32"
                    >
                      <option value="TODAS">TODAS</option>
                      {data.chainList.map(chain => <option key={chain} value={chain}>{chain}</option>)}
                    </select>
                  </div>
                  
                  <div className="hidden sm:block w-px h-6 bg-indigo-200 dark:bg-indigo-700"></div>
                  
                  {/* Filtro Ciudad */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Map size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <label className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex-shrink-0">Ciudad:</label>
                    <select 
                      value={selectedCity} 
                      onChange={(e) => setSelectedCity(e.target.value)} 
                      className="bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded focus:ring-0 text-sm font-bold cursor-pointer shadow-sm w-full sm:w-32"
                    >
                      <option value="TODAS">TODAS</option>
                      {data.cityList.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>

                  <div className="hidden sm:block w-px h-6 bg-indigo-200 dark:bg-indigo-700"></div>

                  {/* Filtro Canasta */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Layers size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                    <label className="text-sm font-medium text-indigo-800 dark:text-indigo-300 flex-shrink-0">Canasta:</label>
                    <select 
                      value={selectedCategory} 
                      onChange={(e) => setSelectedCategory(e.target.value)} 
                      className="bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded focus:ring-0 text-sm font-bold cursor-pointer shadow-sm w-full sm:w-32"
                    >
                      <option value="TODAS">TODAS</option>
                      {data.catList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  {/* Botón Borrar Filtros */}
                  {(selectedChain !== "TODAS" || selectedCity !== "TODAS" || selectedCategory !== "TODAS") && (
                    <button 
                      onClick={handleClearFilters}
                      className="flex items-center justify-center p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 dark:hover:bg-red-900/60 transition-colors sm:ml-2 shadow-sm"
                      title="Borrar Filtros"
                    >
                      <RotateCcw size={18} />
                    </button>
                  )}

                </div>
              </div>

              {chapter1Stats.totalInvoices > 0 ? (
                <>
                  {/* 3 Tarjetas de KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-800 border-blue-100 dark:border-gray-700 shadow-none">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg"><Calendar size={24} /></div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Día Pico de Tráfico</p>
                          <h3 className="text-xl font-bold dark:text-gray-100">{chapter1Stats.kpis.topDay}</h3>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{chapter1Stats.kpis.topDayCount} facturas</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-gray-800 dark:to-gray-800 border-emerald-100 dark:border-gray-700 shadow-none">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg"><Clock size={24} /></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hora Más Concurrida</p>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold dark:text-gray-100">{chapter1Stats.kpis.topTxHourRange}</h3>
                            {chapter1Stats.kpis.topTxJornada !== "N/A" && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400">{chapter1Stats.kpis.topTxJornada}</span>}
                          </div>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                            {chapter1Stats.kpis.topTxHourCount} facturas • <span className="text-gray-500 dark:text-gray-400">Tk Prom: {formatCurrency(chapter1Stats.kpis.topTxHourAvgVal)}</span>
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-gray-800 dark:to-gray-800 border-amber-100 dark:border-gray-700 shadow-none">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg"><TrendingUp size={24} /></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Hora de Mayor Gasto (Ticket)</p>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-bold dark:text-gray-100">{chapter1Stats.kpis.topAvgHourRange}</h3>
                            {chapter1Stats.kpis.topAvgJornada !== "N/A" && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">{chapter1Stats.kpis.topAvgJornada}</span>}
                          </div>
                          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{formatCurrency(chapter1Stats.kpis.topAvgHourVal)} prom.</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-600/50">
                        <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full"><ShoppingCart size={28} /></div>
                        <div><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ticket Promedio</p><h3 className="text-3xl font-bold dark:text-gray-100">{formatCurrency(chapter1Stats.avgTicket)}</h3></div>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl border border-gray-100 dark:border-gray-600/50">
                        <div className="p-4 bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400 rounded-full"><ShoppingBag size={28} /></div>
                        <div><p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ítems por Factura</p><h3 className="text-3xl font-bold dark:text-gray-100">{formatNumber(chapter1Stats.avgItems)} <span className="text-lg font-normal text-gray-400 dark:text-gray-500">ítems</span></h3></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Top 10 Productos */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4"><Tag className="text-indigo-500 dark:text-indigo-400" size={20} /><h3 className="text-lg font-bold dark:text-gray-100">Top 10 Productos</h3></div>
                        <div>{chapter1Stats.topProducts.map((prod, idx) => <ProgressBar key={idx} label={prod.name} value={prod.percentage} max={chapter1Stats.topProducts[0]?.percentage || 100} formatValue={(v) => `${v.toFixed(1)}%`} colorClass="bg-indigo-500 dark:bg-indigo-400"/>)}</div>
                      </div>
                      
                      {/* Top 5 Categorías */}
                      <div className="col-span-1 border-l border-r border-gray-100 dark:border-gray-700 px-0 lg:px-8">
                        <div className="flex items-center gap-2 mb-4"><BarChart className="text-fuchsia-500 dark:text-fuchsia-400" size={20} /><h3 className="text-lg font-bold dark:text-gray-100">Top 5 Canastas</h3></div>
                        <div>
                          {chapter1Stats.topCategories.map((cat, idx) => (
                            <div key={idx} className="mb-5 last:mb-0">
                              <ProgressBar label={cat.name} value={cat.percentage} max={chapter1Stats.topCategories[0]?.percentage || 100} formatValue={(v) => `${v.toFixed(1)}%`} colorClass="bg-fuchsia-500 dark:bg-fuchsia-400" className="mb-1" />
                              <div className="flex flex-wrap gap-1">
                                {cat.topProds.map((p, i) => (
                                  <span key={i} className="text-[10px] bg-fuchsia-50 dark:bg-fuchsia-900/30 text-fuchsia-700 dark:text-fuchsia-300 px-1.5 py-0.5 rounded border border-fuchsia-100 dark:border-fuchsia-800/50 truncate max-w-full" title={p.name}>
                                    {p.name} ({p.val})
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Top 10 Subcategorías */}
                    <div className="col-span-1">
                      <div className="flex items-center gap-2 mb-4"><Layers className="text-teal-500 dark:text-teal-400" size={20} /><h3 className="text-lg font-bold dark:text-gray-100">Top 10 Categorías</h3></div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Del total de unidades vendidas, qué porcentaje corresponde a esta categoría:</p>
                      <div>{chapter1Stats.topSubcategories.map((subcat, idx) => <ProgressBar key={idx} label={subcat.name} value={subcat.percentage} max={100} formatValue={(v) => `${v.toFixed(1)}`} suffix="%" colorClass="bg-teal-500 dark:bg-teal-400"/>)}</div>
                    </div>
                  </div>

                  {/* VENTA CRUZADA TOP 10 (Mostrando 5 afinidades) */}
                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-lg">
                        <ShoppingCart size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold dark:text-gray-100">Venta Cruzada: Afinidades del Top 10 Categorías</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Cuando un cliente lleva una de estas 10 categorías principales, ¿qué otras 5 suele incluir en su factura?</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      {chapter1Stats.topSubcategories.map((subcat, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50 flex flex-col h-full hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-200 dark:border-gray-600 truncate" title={subcat.name}>
                            <span className="text-orange-500 dark:text-orange-400 mr-1">{idx + 1}.</span> {subcat.name}
                          </h4>
                          <div className="flex-1 flex flex-col justify-end space-y-3">
                            {subcat.top5Affinities && subcat.top5Affinities.length > 0 ? (
                              subcat.top5Affinities.map((aff, i) => (
                                <ProgressBar 
                                  key={i} 
                                  label={aff.name} 
                                  value={aff.percentage} 
                                  max={subcat.top5Affinities[0]?.percentage || 100} 
                                  formatValue={(v) => `${v.toFixed(1)}%`} 
                                  colorClass="bg-orange-400 dark:bg-orange-500" 
                                  className="mb-0" 
                                />
                              ))
                            ) : (
                              <div className="flex-1 flex items-center justify-center">
                                <p className="text-xs text-gray-400 dark:text-gray-500 italic">Sin cruces frecuentes</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* NUEVOS GRÁFICOS: PORCENTAJES DE VENTA (FACT_VALOR) POR DÍA Y HORA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <PercentageStackedBarChart 
                      chartData={daySalesData}
                      title="Distribución de Ventas por Día"
                      description="% del Dinero total (Ventas) de cada Cadena distribuido según el Día de la semana."
                      icon={Calendar}
                      isCurrency={true}
                      hideYAxis={true}
                    />
                    <PercentageStackedBarChart 
                      chartData={hourSalesData}
                      title="Distribución de Ventas por Hora"
                      description="% del Dinero total (Ventas) de cada Cadena distribuido en su Franja Horaria."
                      icon={Clock}
                      isCurrency={true}
                      hideYAxis={true}
                    />
                  </div>

                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Info size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Sin datos registrados</h3>
                  <p className="text-gray-500 dark:text-gray-400">No encontramos facturas para la combinación de Cadena y Ciudad seleccionada.</p>
                </div>
              )}
            </section>

            {/* CAPÍTULO 2: COMPARATIVO */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-indigo-500 pl-3">Capítulo 2: Análisis Comparativo</h2>
              
              <div className="grid grid-cols-1 gap-8">
                
                {/* NUEVO: TOP 5 CANASTAS POR CIUDAD (PIE CHARTS) */}
                <Card className="col-span-1 border-t-4 border-t-indigo-400 dark:border-t-indigo-500">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div>
                      <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100"><PieChart className="text-indigo-500 dark:text-indigo-400"/> Participación en Top 5 Canastas</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Distribución de las ventas ($) entre Cadenas para las 5 canastas principales.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg border border-gray-200 dark:border-gray-600 max-w-full sm:max-w-xs">
                      <Filter size={18} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-300 flex-shrink-0">Filtrar Ciudad:</label>
                      <select 
                        value={filterCityForPies} 
                        onChange={(e) => setFilterCityForPies(e.target.value)} 
                        className="bg-white dark:bg-gray-800 border-none text-gray-900 dark:text-white rounded focus:ring-0 text-sm font-bold cursor-pointer w-full truncate shadow-sm"
                      >
                        <option value="TODAS">TODAS LAS CIUDADES</option>
                        {data.cityList.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  {topCategoryPiesData && topCategoryPiesData.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                      {topCategoryPiesData.map(pie => (
                        <div key={pie.category} className="flex flex-col items-center bg-gray-50/50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                          <h4 className="text-xs sm:text-sm font-bold text-center mb-4 text-gray-700 dark:text-gray-200 line-clamp-2 h-10 w-full">{pie.category}</h4>
                          <SVGDonut slices={pie.slices} />
                          <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-4 font-bold tracking-wide">{formatCurrency(pie.total)}</p>
                          
                          <div className="mt-4 w-full space-y-2">
                            {pie.slices.map(s => (
                              <div key={s.label} className="flex items-center justify-between text-[10px] sm:text-xs">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <div className={`w-2.5 h-2.5 rounded-sm flex-shrink-0`} style={{backgroundColor: s.hexColor}}></div>
                                  <span className="truncate text-gray-600 dark:text-gray-300 font-medium" title={s.label}>{s.label}</span>
                                </div>
                                <span className="font-bold text-gray-700 dark:text-gray-200 flex-shrink-0">{pie.total > 0 ? ((s.value / pie.total) * 100).toFixed(1) : 0}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No hay datos para mostrar en esta selección.</p>
                  )}
                </Card>

                {/* GRÁFICA 1 */}
                <PercentageStackedBarChart 
                  chartData={chart1Data} 
                  title="Mix de Canastas por Cadena" 
                  description="Distribución porcentual de los ingresos (dinero) por canasta en cada supermercado."
                  icon={BarChart} 
                  filterLabel="Filtrar por Ciudad"
                  filterValue={filterCityForChart1} 
                  setFilterValue={setFilterCityForChart1} 
                  filterOptions={data.cityList} 
                  defaultFilterText="TODAS LAS CIUDADES"
                  isCurrency={true}
                />

                {/* GRÁFICA 2 */}
                <PercentageStackedBarChart 
                  chartData={chart2Data} 
                  title="Distribución de Ventas por Ciudad" 
                  description="Mix porcentual de ingresos (dinero) por canasta observando una Cadena específica a través de las ciudades."
                  icon={Map} 
                  filterLabel="Filtrar por Cadena"
                  filterValue={filterChainForChart2} 
                  setFilterValue={setFilterChainForChart2} 
                  filterOptions={data.chainList} 
                  defaultFilterText="TODAS LAS CADENAS"
                  isCurrency={true}
                />
              </div>
            </section>

            {/* CAPÍTULO 3: SCOPE HARINAS Y PASTAS */}
            <section className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 border-l-4 border-amber-500 pl-3">
                Capítulo 3: Scope Harinas y Pastas (Global)
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <Card className="border-t-4 border-t-amber-400 dark:border-t-amber-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-full"><ChefHat size={28}/></div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Scope: Harinas</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Presente en el <span className="font-bold text-amber-600 dark:text-amber-400">{data.deepDive.harinas.penetration.toFixed(1)}%</span> de toda la muestra.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-4 mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50 flex-wrap">
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Tk. Promedio</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatCurrency(data.deepDive.harinas.avgTicket)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold" title="Paquetes de harina promedio">Ítems Harina</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatNumber(data.deepDive.harinas.avgItems)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold" title="Total de ítems en toda la factura (Canasta)">Total Canasta</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatNumber(data.deepDive.harinas.basketSize)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Hora Compra</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{data.deepDive.harinas.peakHour}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600 hidden sm:block"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Día Compra</p>
                      <p className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">{data.deepDive.harinas.peakDay}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-md font-bold mb-4 flex items-center gap-2 dark:text-gray-200"><PieChart size={18} className="text-amber-500 dark:text-amber-400"/> Mix de Harinas (% unidades)</h4>
                    {data.deepDive.harinas.mix.map((item, idx) => {
                      const colors = {
                        'Harina de Trigo': 'bg-amber-500 dark:bg-amber-500',
                        'Harina de Maíz': 'bg-yellow-400 dark:bg-yellow-500',
                        'Otras Harinas': 'bg-orange-400 dark:bg-orange-500'
                      };
                      return (
                        <ProgressBar 
                          key={idx} 
                          label={item.name} 
                          value={item.value} 
                          max={Math.max(...data.deepDive.harinas.mix.map(i=>i.value))} 
                          formatValue={(v)=>`${v.toFixed(1)}%`} 
                          colorClass={colors[item.name] || "bg-amber-500"}
                        />
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Qué se compra con Trigo:</h4>
                      {data.deepDive.harinas.topTrigoAff.length > 0 ? data.deepDive.harinas.topTrigoAff.map((p, idx) => (
                        <ProgressBar key={idx} label={p.name} value={p.value} max={data.deepDive.harinas.topTrigoAff[0]?.value || 100} formatValue={(v)=>`${v.toFixed(1)}%`} colorClass="bg-amber-500 dark:bg-amber-500"/>
                      )) : <p className="text-xs text-gray-400 dark:text-gray-500">Sin cruces</p>}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">Qué se compra con Maíz:</h4>
                      {data.deepDive.harinas.topMaizAff.length > 0 ? data.deepDive.harinas.topMaizAff.map((p, idx) => (
                        <ProgressBar key={idx} label={p.name} value={p.value} max={data.deepDive.harinas.topMaizAff[0]?.value || 100} formatValue={(v)=>`${v.toFixed(1)}%`} colorClass="bg-yellow-400 dark:bg-yellow-500"/>
                      )) : <p className="text-xs text-gray-400 dark:text-gray-500">Sin cruces</p>}
                    </div>
                  </div>
                </Card>

                <Card className="border-t-4 border-t-red-400 dark:border-t-red-500">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-full"><Utensils size={28}/></div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Scope: Pastas</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Presente en el <span className="font-bold text-red-600 dark:text-red-400">{data.deepDive.pastas.penetration.toFixed(1)}%</span> de toda la muestra.</p>
                    </div>
                  </div>

                  <div className="flex gap-2 sm:gap-4 mb-8 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600/50 flex-wrap">
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Tk. Promedio</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatCurrency(data.deepDive.pastas.avgTicket)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold" title="Paquetes de pasta promedio">Ítems Pasta</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatNumber(data.deepDive.pastas.avgItems)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold" title="Total de ítems en toda la factura (Canasta)">Total Canasta</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{formatNumber(data.deepDive.pastas.basketSize)}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Hora Compra</p>
                      <p className="text-base sm:text-lg font-bold dark:text-gray-100">{data.deepDive.pastas.peakHour}</p>
                    </div>
                    <div className="w-px bg-gray-200 dark:bg-gray-600"></div>
                    <div className="flex-1 text-center min-w-[80px]">
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Día Compra</p>
                      <p className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">{data.deepDive.pastas.peakDay}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-bold mb-4 flex items-center gap-2 dark:text-gray-200"><Layers size={18} className="text-red-500 dark:text-red-400"/> Qué se compra junto con Pastas:</h4>
                    {data.deepDive.pastas.topAff.length > 0 ? data.deepDive.pastas.topAff.map((p, idx) => (
                      <ProgressBar key={idx} label={p.name} value={p.value} max={data.deepDive.pastas.topAff[0]?.value || 100} formatValue={(v)=>`${v.toFixed(1)}%`} colorClass="bg-red-500 dark:bg-red-500"/>
                    )) : <p className="text-sm text-gray-400 dark:text-gray-500">No hay suficientes datos de cruce.</p>}
                  </div>
                </Card>

              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

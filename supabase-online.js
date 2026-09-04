/* Sincronização online da base de vendas — não altera as demais funções do app. */
(() => {
  const SUPABASE_URL = 'https://harlrfhukjvhpufwhtep.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const API = `${SUPABASE_URL}/rest/v1/vendas`;
  const FN = `${SUPABASE_URL}/functions/v1/atualizar-vendas`;
  const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

  const aplicarBase = (rows) => {
    if (!Array.isArray(rows) || !rows.length) return;
    try {
      if (typeof DATA !== 'undefined' && Array.isArray(DATA.vendas)) {
        DATA.vendas = rows.map(r => ({
          cliente: String(r.cliente ?? '').trim(),
          rota: String(r.rota ?? '').trim(),
          razao: String(r.razao ?? '').trim(),
          material: String(r.material ?? '').trim(),
          marca: String(r.marca ?? '').trim(),
          descricao: String(r.descricao ?? '').trim(),
          subcanal: String(r.subcanal ?? '').trim(),
          dataNotaFiscal: r.data_nota_fiscal || '',
          origem: String(r.origem ?? '').trim()
        }));
      }
      if (typeof window.__ITURAMA_ONLINE_APPLY__ === 'function') {
        window.__ITURAMA_ONLINE_APPLY__(rows);
      }
      if (typeof window.refreshMainData === 'function') window.refreshMainData();
      else {
        if (typeof window.fillFilters === 'function') window.fillFilters();
        if (typeof window.render === 'function') window.render();
      }
    } catch (e) {
      console.warn('[Supabase] Aplicação da base:', e);
    }
  };

  // Corrige o acesso ADM sem alterar a senha existente.
  const corrigirLoginADM = () => {
    if (typeof window.login !== 'function' || window.__ADM_LOGIN_CORRIGIDO__) return;
    const loginOriginal = window.login;
    window.login = function () {
      const modal = document.getElementById('modal');
      loginOriginal();
      if (modal && !modal.classList.contains('open')) {
        if (typeof window.openAdminFull === 'function') window.openAdminFull();
      }
    };
    window.__ADM_LOGIN_CORRIGIDO__ = true;
  };

  async function carregarVendasOnline() {
    const get = async (from, to) => {
      const r = await fetch(`${API}?select=cliente,rota,razao,material,marca,descricao,subcanal,data_nota_fiscal,origem&order=id.asc`, {
        headers: { ...headers, Range: `${from}-${to}` }
      });
      if (!r.ok) throw new Error(`Supabase HTTP ${r.status}`);
      return r.json();
    };
    const a = await get(0, 999);
    const b = await get(1000, 1999);
    const rows = a.concat(b);
    if (!rows.length) return;
    aplicarBase(rows);
    window.__SUPABASE_ONLINE_READY__ = true;
    console.info(`[Supabase] ${rows.length} vendas carregadas.`);
  }

  function normalizeHeader(v) {
    return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  async function parseSpreadsheet(file) {
    let XLSXLib = window.XLSX;
    if (!XLSXLib) XLSXLib = await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs');
    const ab = await file.arrayBuffer();
    const wb = XLSXLib.read(ab, { cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSXLib.utils.sheet_to_json(ws, { defval: '' });
    const aliases = {
      cliente: ['cliente', 'codigo cliente', 'codigocliente', 'pv'],
      rota: ['rota', 'codigo rota', 'codigorota'],
      razao: ['razao', 'razao social', 'razaosocial', 'nome cliente'],
      material: ['material', 'codigo material', 'codigomaterial'],
      marca: ['marca'],
      descricao: ['descricao', 'descrição', 'produto'],
      subcanal: ['subcanal', 'sub canal'],
      data_nota_fiscal: ['data nota fiscal', 'datanotafiscal', 'data nf', 'data'],
      origem: ['origem', 'fonte']
    };
    return raw.map(row => {
      const map = {};
      Object.keys(row).forEach(k => map[normalizeHeader(k)] = row[k]);
      const pick = names => {
        for (const n of names) {
          const x = map[normalizeHeader(n)];
          if (x !== undefined && x !== '') return x;
        }
        return '';
      };
      let dt = pick(aliases.data_nota_fiscal);
      if (dt instanceof Date && !isNaN(dt)) dt = dt.toISOString().slice(0, 10);
      else if (dt) dt = String(dt).slice(0, 10);
      return {
        cliente: String(pick(aliases.cliente)).trim(),
        rota: String(pick(aliases.rota)).trim(),
        razao: String(pick(aliases.razao)).trim(),
        material: String(pick(aliases.material)).trim(),
        marca: String(pick(aliases.marca)).trim(),
        descricao: String(pick(aliases.descricao)).trim(),
        subcanal: String(pick(aliases.subcanal)).trim(),
        data_nota_fiscal: dt || null,
        origem: String(pick(aliases.origem)).trim()
      };
    }).filter(r => r.cliente || r.material || r.razao);
  }

  window.handleSalesUpload = async function () {
    const input = document.getElementById('salesFile');
    const file = input && input.files && input.files[0];
    if (!file) return alert('Escolha uma planilha.');
    if (!confirm(`Atualizar a base online com "${file.name}"?\n\nA base atual de vendas será substituída pela nova planilha.`)) return;
    const button = document.querySelector('button[onclick="handleSalesUpload()"]');
    if (button) { button.disabled = true; button.textContent = '⏳ Atualizando base online...'; }
    try {
      const rows = await parseSpreadsheet(file);
      if (!rows.length) throw new Error('A planilha não possui registros válidos.');
      const response = await fetch(FN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ rows })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.error || `Erro HTTP ${response.status}`);
      aplicarBase(rows);
      alert(`Base atualizada com sucesso!\n\n${rows.length.toLocaleString('pt-BR')} registros enviados ao banco online.`);
      if (button) button.textContent = '✅ Base online atualizada';
    } catch (err) {
      console.error(err);
      alert(`Não foi possível atualizar a base online.\n\n${err.message || err}`);
      if (button) button.textContent = '📥 Carregar planilha para teste';
    } finally {
      if (button) button.disabled = false;
    }
  };

  const iniciar = () => {
    corrigirLoginADM();
    carregarVendasOnline().catch(err => console.warn('[Supabase]', err));
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();

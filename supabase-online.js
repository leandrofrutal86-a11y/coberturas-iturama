/* Sincronização online da base de vendas — não altera as demais funções do app. */
(() => {
  const SUPABASE_URL = 'https://harlrfhukjvhpufwhtep.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_gxhN7WK6y9j_m3TJwGDHNw_x_lszXgO';
  const API = `${SUPABASE_URL}/rest/v1/vendas`;
  const FN = `${SUPABASE_URL}/functions/v1/atualizar-vendas`;
  const headers = { apikey: SUPABASE_KEY };

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
    DATA.vendas = rows.map(r => ({
      cliente: String(r.cliente ?? ''),
      rota: String(r.rota ?? ''),
      razao: String(r.razao ?? ''),
      material: String(r.material ?? ''),
      marca: String(r.marca ?? ''),
      descricao: String(r.descricao ?? ''),
      subcanal: String(r.subcanal ?? ''),
      dataNotaFiscal: String(r.data_nota_fiscal ?? ''),
      origem: String(r.origem ?? '')
    }));
    window.__SUPABASE_ONLINE_READY__ = true;
    if (typeof fillFilters === 'function') fillFilters();
    if (typeof render === 'function') render();
    console.info(`[Supabase] ${DATA.vendas.length} vendas carregadas.`);
  }

  function normalizeHeader(v) {
    return String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  async function parseSpreadsheet(file) {
    if (typeof XLSX === 'undefined') {
      await import('https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs').then(() => {});
    }
    const ab = await file.arrayBuffer();
    const wb = XLSX.read(ab, { cellDates: true });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json(ws, { defval: '' });
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
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({ rows })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.error || `Erro HTTP ${response.status}`);
      DATA.vendas = rows.map(r => ({ ...r, dataNotaFiscal: r.data_nota_fiscal }));
      if (typeof fillFilters === 'function') fillFilters();
      if (typeof render === 'function') render();
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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', carregarVendasOnline);
  else carregarVendasOnline();
})();

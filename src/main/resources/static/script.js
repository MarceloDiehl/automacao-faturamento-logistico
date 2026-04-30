
//@autor Marcelo Diehl - DITIC-DSUP

// 1. CONFIGURAÇÕES GLOBAIS
const tiposServico = {
  ml: { nome: "MUDANÇA LOCAL", cor: "#5F8F95" },
  mp:   { nome: "MUDANÇA PRÉDIO", cor: "#4C7F6F" }, // verde suave
  inst: { nome: "INSTALAÇÃO", cor: "#5B7FA6" },
  des:  { nome: "DESINSTALAÇÃO", cor: "#8C7AAE" },
  rac:  { nome: "ROLLOUT AC", cor: "#A39A8A" },
  rabc: { nome: "ROLLOUT ABC", cor: "#6F7C8F" },
};

const itens = ["Impressora", "Scanner", "Ativos de Rede", "Notebook", "Tablet", "Telefone Voip", "Servidor", "Leitor Biométrico", "Outros"];

// 2. CÁLCULOS E LÓGICA DE NEGÓCIO
window.alterarTipoCard = function (idOriginal, novaChave) {
  const card = document.getElementById(`card-${idOriginal}`);
  if (!card) return;

  const tipo = tiposServico[novaChave];
  card.style.setProperty("--accent-color", tipo.cor);
  card.querySelector(".dropdown-toggle").innerText = tipo.nome;
  card.dataset.tipoAtual = novaChave;
  card.dataset.sigla = novaChave;
  window.calcularResultados();
};

window.calcularResultados = async function () {
  const select = document.getElementById("tipo-calculo");
  if (!select?.value || select.value.includes("Selecione")) return;

  const comarcaId = select.value;
  const cards = document.querySelectorAll(".accent-card");
  let totalGeral = 0;

  for (const card of cards) {
    const sigla = card.dataset.sigla || card.dataset.tipoAtual || "ml";

    try {
      const response = await fetch(`/api/valor?comarcaId=${comarcaId}&servicoSigla=${sigla}`);
      const precoUnitario = await response.json();

      let somaItens = 0;
      card.querySelectorAll(".input-calculo").forEach(i => somaItens += parseInt(i.value) || 0);

      const vCPU = parseInt(card.querySelector(".cpu-calculo").value) || 0;
      const vMon = parseInt(card.querySelector(".monitor-calculo").value) || 0;
      const ajusteMon = vMon > vCPU * 3 ? (vMon - vCPU * 3) / 3 : 0;

      const totalCard = Math.ceil(somaItens + vCPU + ajusteMon);
      const subtotal = totalCard * precoUnitario;
      totalGeral += subtotal;

      card.querySelector(".total-itens").innerText = totalCard;
      card.querySelector(".subtotal-valor").innerText = subtotal.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
    } catch (e) { console.error("Erro no cálculo:", e); }
  }

  const out = document.getElementById("pagar-output");
  if (out) {
    const val = totalGeral.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
    out.tagName === "INPUT" ? out.value = val : out.innerText = val;
  }
};

// 3. NAVEGAÇÃO SPA E SEGURANÇA
window.carregarPagina = (pagina) => {
  const content = document.getElementById("content-area");

    const logado = sessionStorage.getItem("isLoggedIn") === "true";
    if (["configuracao-admin"].includes(pagina) && !logado) {
      alert("Acesso restrito. Por favor, faça login.");
      return window.carregarPagina("calculadora");
    }

  fetch(`${pagina}.html`)
    .then(r => r.text())
    .then(html => {
      content.innerHTML = html;
      const evento = pagina === "calculadora" ? "calculadoraCarregada" :
                     pagina === "configuracao-admin" ? "adminCarregado" : null;
      if (evento) window.dispatchEvent(new Event(evento));
    }).catch(e => console.error(e));
};

window.efetuarLogin = async function () {
  const u = document.getElementById("usuario").value;
  const s = document.getElementById("senha").value;

  try {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: u, senha: s })
    });

    if (r.ok) {
      sessionStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("isLoggedIn", "true");
      window.carregarPagina("configuracao-admin");
    } else {
      document.getElementById("login-erro")?.classList.remove("d-none");
    }
  } catch (e) { console.error(e); }
};

window.efetuarLogout = () => {
  sessionStorage.clear();
  window.location.href = "index.html";
};

// 4. ADMINISTRAÇÃO (PREÇOS E MANUAIS)
window.buscarPrecosAtuais = async function() {
  try {
    const r = await fetch('/api/precos/todos');
    const dados = await r.json();

    const mapaSiglaParaId = {
      inst: "instalacao",
      des: "desinstalacao",
      rac: "rolloutac",
      rabc: "rolloutabc",
      ml: "ml",
      mp: "mp"
    };

    dados.forEach(p => {
      if (!p.servico || !p.regiao || !p.servico.sigla) return;

      const s = mapaSiglaParaId[p.servico.sigla];

      const reg = p.regiao.nome.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-');

      const id = `${s}-${reg}`;
      const input = document.getElementById(id);

      if (input) {
        input.value = parseFloat(p.valor).toFixed(2);
        input.style.backgroundColor = "#e7f3ff7a";
        input.style.fontWeight = "bold";
      }
    });

  } catch (e) {
    console.error(e);
  }
};

window.configurarBotaoAtualizar = async function(e) {
  if (e) e.preventDefault();

  const inputs = document.querySelectorAll(".container-atualizacao input[id]");
  const lista = [];
  const regex = /^\d+(\.\d{1,2})?$/;

  for (const input of inputs) {
    const val = input.value.trim();
    if (val && regex.test(val)) {
      lista.push({ idComposta: input.id, novoValor: val });
    } else if (val) {
      Swal.fire({
        icon: 'error',
        title: 'Valor Inválido',
        text: `O campo ${input.id} não segue o formato decimal (ex: 125.00).`,
        confirmButtonColor: '#415a77'
      });
      return input.focus();
    }
  }

  if (!lista.length) {
    return Swal.fire({
      icon: 'info',
      text: 'Nenhum valor foi preenchido para atualização.',
      confirmButtonColor: '#415a77'
    });
  }

  Swal.fire({
    title: 'Confirmar Atualização?',
    text: `Você está prestes a atualizar ${lista.length} valores de serviços. Essa ação afetará todos os cálculos de faturamento.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#415a77',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sim, atualizar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const r = await fetch('/api/precos/atualizar-lote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lista)
        });

        if (r.ok) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Os valores foram atualizados no banco de dados.',
            icon: 'success',
            confirmButtonColor: '#415a77'
          });
          window.buscarPrecosAtuais();
        } else {
          throw new Error('Falha na resposta do servidor');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Erro!', 'Não foi possível conectar ao servidor.', 'error');
      }
    }
  });
};

window.uploadManual = async function(id, tipo) {
  const input = document.getElementById(id);
  if (!input?.files[0]) return;

  Swal.fire({
    title: 'Substituir Manual?',
    text: `Deseja carregar o novo arquivo PDF? O arquivo anterior será removido.`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#415a77',
    confirmButtonText: 'Enviar Arquivo'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const fd = new FormData();
      fd.append("file", input.files[0]);
      fd.append("tipo", tipo);

      try {
        const r = await fetch("/api/manuais/upload", { method: "POST", body: fd });
        if (r.ok) {
          Swal.fire('Concluído!', 'O manual foi atualizado com sucesso.', 'success');
          input.value = "";
        }
      } catch (e) {
        Swal.fire('Erro', 'Falha no upload do arquivo.', 'error');
      }
    }
  });
};

window.limparFormularioAdmin = () => {
  document.querySelectorAll(".container-atualizacao input").forEach(i => {
    i.value = ""; i.style.backgroundColor = ""; i.style.fontWeight = "normal";
  });
};

window.restaurarValores = () => window.buscarPrecosAtuais();

// 5. INICIALIZAÇÃO E EVENTOS
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("calculadoraCarregada", () => {
    renderizarCardsIniciais();
    carregarComarcasNoSelect().then(() => configurarMudancaComarca());
  });

  window.addEventListener("adminCarregado", window.buscarPrecosAtuais);

  // Navegação Global
  ["btn-home", "btn-manual", "btn-login", "titulo"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = (e) => {
      e.preventDefault();
      window.carregarPagina(el.dataset.page || "calculadora");
    };
  });

  // 6. Delegação de Eventos (Inputs e Click)
  document.addEventListener("click", e => {
    if (e.target.closest("#toggle-senha")) {
      const i = document.getElementById("senha");
      if (i) i.type = i.type === "password" ? "text" : "password";
    }
  });

  document.addEventListener("input", e => {
    if (e.target.classList.contains("campo-valor")) {
      let v = e.target.value.replace(/[^0-9.]/g, "");
      const p = v.split(".");
      if (p.length > 2) v = p[0] + "." + p.slice(1).join("");
      if (v.includes(".")) {
        const [int, dec] = v.split(".");
        v = `${int}.${dec.substring(0, 2)}`;
      }
      e.target.value = v;
    }
  });

  window.carregarPagina("calculadora");
});

// 7. FUNÇÕES DE APOIO (CONTEÚDO)
async function carregarComarcasNoSelect() {
  const sel = document.getElementById("tipo-calculo");
  if (!sel) return;
  try {
    const r = await fetch("/api/comarcas");
    const dados = await r.json();
    dados.sort((a, b) => a.nome === "Porto Alegre" ? -1 : a.nome.localeCompare(b.nome));
    sel.innerHTML = '<option selected disabled>Selecione a Comarca</option>';
    dados.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.id; opt.textContent = c.nome; opt.dataset.regiao = c.regiao.nome;
      sel.appendChild(opt);
    });
  } catch (e) { console.error(e); }
}

function renderizarCardsIniciais() {
  const row = document.getElementById("row-cards");
  if (!row) return;
  const ordem = ["ml", "mp", "inst", "des", "rac", "rabc"];
  row.innerHTML = ordem.map(t => criarTemplateCard(t, t)).join("");
  configurarEventosInputs();
  window.calcularResultados();
}

function criarTemplateCard(id, chave) {
  const t = tiposServico[chave];
  return `<div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
    <div class="accent-card" id="card-${id}" data-tipo-atual="${chave}" data-sigla="${chave}" style="--accent-color: ${t.cor}">
      <div class="dropdown text-center">
        <button class="btn btn-sm dropdown-toggle fw-bold text-uppercase p-0 border-0" data-bs-toggle="dropdown">${t.nome}</button>
        <ul class="dropdown-menu">
          ${Object.keys(tiposServico).map(k => `<li><a class="dropdown-item small" href="#" onclick="alterarTipoCard('${id}', '${k}')">${tiposServico[k].nome}</a></li>`).join("")}
        </ul>
      </div>
      <hr class="my-2">
      <div class="inputs-area">
        <label class="form-label d-block">Computador</label>
        <input type="number" class="form-control form-control-sm text-center spinner cpu-calculo" value="0">
        <label class="form-label d-block">Monitor</label>
        <input type="number" class="form-control form-control-sm text-center spinner monitor-calculo" value="0">
        ${itens.map(i => `<label class="form-label d-block">${i}:</label><input type="number" class="form-control form-control-sm text-center spinner input-calculo" value="0">`).join("")}
      </div>
      <div class="resumo-card">
        <small class="d-block">Serviços: <span class="total-itens">0</span></small>
        <small class="fw-bold d-block">Sub-total: <span class="subtotal-valor">R$ 0,00</span></small>
      </div>
    </div>
  </div>`;
}

function configurarEventosInputs() {
  document.getElementById("content-area")?.addEventListener("input", e => {
    const classes = ["input-calculo", "cpu-calculo", "monitor-calculo"];
    if (classes.some(c => e.target.classList.contains(c))) {

      if (e.target.value.length > 2) {
        e.target.value = e.target.value.slice(0, 2);
      }

      if (e.target.value < 0) e.target.value = 0;

      let valorParaCalculo = parseInt(e.target.value) || 0;

      window.calcularResultados();

      e.target.style.backgroundColor = valorParaCalculo > 0 ? "#e7f3ff7a" : "";
      e.target.style.fontWeight = valorParaCalculo > 0 ? "bold" : "normal";
    }
  });
}

function configurarMudancaComarca() {
  const s = document.getElementById("tipo-calculo"), o = document.getElementById("regiao-output");
  if (s && o) s.onchange = () => {
    o.value = s.options[s.selectedIndex].dataset.regiao || "";
    window.calcularResultados();
  };
}
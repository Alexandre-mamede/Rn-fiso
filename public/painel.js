/* =====================================================
   PACIENTES
===================================================== */

async function carregar() {

    const res = await fetch("/pacientes");
    const data = await res.json();

    const lista = document.getElementById("lista");
    const total = document.getElementById("totalPacientes");

    lista.innerHTML = "";
    total.innerText = data.length;

    data.forEach(p => {

        lista.innerHTML += `
        <tr>

            <td>${p.id}</td>
            <td>${p.nome}</td>
            <td>${p.telefone}</td>
            <td>${p.diagnostico}</td>

            <td>
                <div class="acoes-paciente">

                    <button
                        class="btn-acao btn-ficha"
                        onclick="abrirFicha(${p.id})">
                        📋 Ficha
                    </button>

                    <button
                        class="btn-acao btn-editar"
                        onclick="editarPaciente(${p.id})">
                        ✏ Editar
                    </button>

                    <button
                        class="btn-acao btn-excluir"
                        onclick="excluirPaciente(${p.id})">
                        🗑 Excluir
                    </button>

                </div>
            </td>

        </tr>
        `;

    });

}

async function salvar() {

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const diagnostico = document.getElementById("diagnostico").value;

    await fetch("/pacientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome,
            telefone,
            diagnostico
        })
    });

    document.getElementById("nome").value = "";
    document.getElementById("telefone").value = "";
    document.getElementById("diagnostico").value = "";

    carregar();

}

/* =====================================================
   AGENDAMENTOS
===================================================== */

async function carregarAgenda() {

    const res = await fetch("/agendamentos");
    const data = await res.json();

    const lista = document.getElementById("listaAgenda");

    lista.innerHTML = "";

    data.forEach(a => {

        lista.innerHTML += `
        <tr>
            <td>${a.nome}</td>
            <td>${a.data}</td>
            <td>${a.horario}</td>
            <td>${a.observacao || ""}</td>
        </tr>
        `;

    });

}

async function agendar() {

    const paciente_id = document.getElementById("paciente_id").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const observacao = document.getElementById("obs").value;

    await fetch("/agendamentos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            paciente_id,
            data,
            horario,
            observacao
        })
    });

    document.getElementById("paciente_id").value = "";
    document.getElementById("data").value = "";
    document.getElementById("horario").value = "";
    document.getElementById("obs").value = "";

    carregarAgenda();

}

/* =====================================================
   NAVEGAÇÃO
===================================================== */

function mostrarSecao(secao) {

    document.querySelectorAll(".secao").forEach(s => {
        s.classList.add("escondido");
    });

    document.getElementById(secao).classList.remove("escondido");

    if (secao === "pacientes") {
        carregar();
    }

    if (secao === "agendamentos") {
        carregarAgenda();
    }

}

/* =====================================================
   FICHA DO PACIENTE
===================================================== */

function abrirFicha(id) {

    window.location.href = `ficha.html?id=${id}`;

}

/* =====================================================
   EDITAR PACIENTE
===================================================== */

function editarPaciente(id) {

    alert("Função Editar em desenvolvimento.");

}

/* =====================================================
   EXCLUIR PACIENTE
===================================================== */

function excluirPaciente(id) {

    if (!confirm("Deseja realmente excluir este paciente?")) {
        return;
    }

    alert("Função Excluir em desenvolvimento.");

}

/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    mostrarSecao("dashboard");
    carregar();

});
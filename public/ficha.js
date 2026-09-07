async function carregarFicha(){

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const res = await fetch(`/pacientes/${id}`);
    const p = await res.json();

    document.getElementById("subtituloFicha").innerText =
        `Paciente ID: ${p.id}`;

    document.getElementById("dadosPaciente").innerHTML = `
        <p><b>Nome:</b> ${p.nome}</p>
        <p><b>Telefone:</b> ${p.telefone}</p>
        <p><b>Diagnóstico:</b> ${p.diagnostico}</p>
    `;
}

carregarFicha();

document.getElementById("btnVoltar").onclick = () => {
    window.location.href = "painel.html";
};

document.getElementById("btnImprimir").onclick = () => {
    window.print();
};

document.getElementById("btnSalvar").onclick = () => {
    alert("Aqui vamos salvar a ficha no banco depois");
};

function abrirTab(id){

    document.querySelectorAll(".tab").forEach(t => {
        t.classList.add("escondido");
    });

    document.getElementById(id).classList.remove("escondido");
}

async function entrar() {

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    const resposta = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario,
            senha
        })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
        location.href = "painel.html";
    } else {
        alert("Login inválido");
    }

}

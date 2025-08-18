document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formFornecedor");

    carregarFornecedores();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("nomeFornecedor").value;
        const cnpj = document.getElementById("cnpjFornecedor").value;

        await addFornecedor({ nome, cnpj });
        carregarFornecedores();
        form.reset();
    });
});

async function carregarFornecedores() {
    const fornecedores = await getFornecedores();
    if (fornecedores) {
        renderTable(fornecedores, "tabelaFornecedores", ["id", "nome", "cnpj"]);
    }
}

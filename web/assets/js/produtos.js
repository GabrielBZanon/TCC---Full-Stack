document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formProduto");

    // Carrega produtos ao abrir a página
    carregarProdutos();

    // Cadastrar produto
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nome = document.getElementById("nomeProduto").value;
        const preco = parseFloat(document.getElementById("precoProduto").value);
        const estoque = parseInt(document.getElementById("estoqueProduto").value);

        if (!nome || isNaN(preco) || isNaN(estoque)) {
            alert("Preencha todos os campos corretamente!");
            return;
        }

        await addProduto({ nome, preco, estoque });
        carregarProdutos();
        form.reset();
    });
});

async function carregarProdutos() {
    const produtos = await getProdutos();
    if (produtos) {
        renderTable(produtos, "tabelaProdutos", ["id", "nome", "preco", "estoque"]);
    }
}

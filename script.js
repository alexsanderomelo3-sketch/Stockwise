console.log("Stockwise iniciando com sucesso!");
const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");
const totalProdutos = document.getElementById("totalProdutos");
const estoqueBaixo = document.getElementById("estoqueBaixo");
const valorEstoque = document.getElementById("valorEstoque");
const pesquisaProduto = document.getElementById("pesquisaProduto");
const ordenarProdutos = document.getElementById("ordenarProdutos");
const ordenarQuantidade = document.getElementById("ordenarQuantidade");
const filtrarEstoqueBaixo = document.getElementById("filtrarEstoqueBaixo");
let produtoEmEdicao = null;
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
if (localStorage.getItem("produtos") === null) {
  produtos = [
    { nome: "Cafe", categoria: "bebida", quantidade: 20, preco: 35 },
    { nome: "Leite", categoria: "laticionios", quantidade: 20, preco: 35 },
    { nome: "Acucar", categoria: "alimento", quantidade: 30, preco: 5 },
  ];
  localStorage.setItem("produtos", JSON.stringify(produtos));
  
atualizarTotalProdutos();
atualizarListaReposicao();
}
const produtosIniciais = [
  { nome: "Cafe", categoria: "bebida", quantidade: 20, preco: 35 },
  { nome: "Leite", categoria: "laticionios", quantidade: 5, preco: 7 },
  { nome: "Acucar", categoria: "alimento", quantidade: 30, preco: 5 },
];
produtosIniciais.forEach(function (produtoInicial) {
  const existe = produtos.some(function (produto) {
    return produto.nome === produtoInicial.nome;
  });
  if (!existe) {
    produtos.push(produtoInicial);
  }
});
localStorage.setItem("produtos", JSON.stringify(produtos));
function atualizarEstoqueBaixo() {
    const produtos = listaProdutos.querySelectorAll("tr");
    let contador = 0;
    produtos.forEach(function (produto) {
        const quantidade = Number(produto.children[2].textContent);
        if (quantidade <= 5) {
            contador++;
        }
    });
    estoqueBaixo.textContent = contador;
}
function atualizarStatusProdutos() {
    const produtos = listaProdutos.querySelectorAll("tr");
    produtos.forEach(function (produto) {
        const quantidade = Number(produto.children[2].textContent);
        const status = produto.children[4];
        status.textContent = quantidade <= 5 ? "Estoque Baixo" : "Disponível";
        produto.classList.toggle("estoque-baixo", quantidade <= 5);
    });
}
function atualizarListaReposicao() {
  listaReposicao.innerHTML = "";
  const linhas = listaProdutos.querySelectorAll("tr");
  linhas.forEach(function (linha) {
    const quantidade = Number(linha.children[2].textContent);
    if (quantidade <= 5) {
      const item = document.createElement("li");
      item.textContent = linha.children[0].textContent + " - Quantidade: " + quantidade;
      listaReposicao.appendChild(item);
    }
  });
}
function atualizarTotalProdutos() {
    totalProdutos.textContent = listaProdutos.getElementsByTagName("tr").length;
}

function atualizarValorEstoque() {
const produtos = listaProdutos.querySelectorAll("tr");
let valorTotal = 0;

produtos.forEach(function (produto) {
const quantidade = Number(produto.children[2].textContent);

const precoTexto = produto.children[3].textContent
.replace("R$", "")
.replace(/\./g, "")
.replace(",", ".")
.trim();
console.log("Texto de preco:", produto.children[3].textContent);
console.log("Preco convertido:", precoTexto);
const preco = Number(precoTexto);
console.log("Quantidade:", quantidade, "Preço:", preco);

valorTotal += quantidade * preco;
});

valorEstoque.textContent = valorTotal.toLocaleString("pt-BR", {
style: "currency",
currency: "BRL"
});
}
function ativarBotoesProdutos() {
  const linhasProdutos = listaProdutos.querySelectorAll("tr");
  linhasProdutos.forEach(function(linha) {
    const botoes = linha.querySelectorAll("button");
    console.log("Botões encontrados:", botoes.length);
 botoes[1].addEventListener("click", function () {
if (!confirm("Tem certeza que deseja excluir este produto?")) {
  console.log("Excluir foi clicado!");
return;
}

const nomeExcluir = linha.children[0].textContent;

produtos = produtos.filter(function (produto) {
return produto.nome !== nomeExcluir;
});

localStorage.setItem("produtos", JSON.stringify(produtos));

linha.remove();

atualizarTotalProdutos();
atualizarEstoqueBaixo();
atualizarValorEstoque();
});
       botoes[0].addEventListener("click", function () {
        console.log("Botao Editar clicado");
        document.getElementById("nomeProduto").value = linha.children[0].textContent;
        document.getElementById("categoriaProduto").value = linha.children[1].textContent;
        document.getElementById("quantidadeProduto").value = linha.children[2].textContent;
        document.getElementById("precoProduto").value = linha.children[3].textContent.replace("R$", "").replace(",", ".").trim();
        produtoEmEdicao = linha;
    });
  });
}
formProduto.addEventListener("submit", function (event) {
  event.preventDefault();
  const nome = document.getElementById("nomeProduto").value;
  const categoria = document.getElementById("categoriaProduto").value;
  const preco = document.getElementById("precoProduto").value;
  if (Number(preco) <= 0 || !Number.isFinite(Number(preco))) {
    alert("Informe um preço maior que zero!");
    return;
  }
  const quantidade = document.getElementById("quantidadeProduto").value;
  console.log("Quantidade informada:", quantidade);
  if (Number(quantidade) <=0 || !Number.isInteger(Number(quantidade))) {
    alert("Informe uma quantidade inteira maior que zero!.");
    return;
  } 
  const nomeAntigo = produtoEmEdicao ? produtoEmEdicao.children[0].textContent : null; 
  const linhaAtual = produtoEmEdicao || document.createElement("tr");
  linhaAtual.innerHTML = `
    <td>${nome}</td>
    <td>${categoria}</td>
    <td>${quantidade}</td>
    <td>R$ ${Number(preco).toFixed(2)}</td>
    <td>${Number(quantidade) <=5 ? "Estoque Baixo" : "Disponível"}</td>
 <td>
 <button class="btn-editar">Editar</button>
 <button class="btn-excluir">Excluir</button></td>`;
    if (!produtoEmEdicao) {
listaProdutos.appendChild(linhaAtual);

produtos.push({
nome: nome,
categoria: categoria,
quantidade: quantidade,
preco: preco
});

} else {
const indice = produtos.findIndex(function(produto) {
return produto.nome === nomeAntigo;
});

if (indice !== -1) {
produtos[indice] = {
nome: nome,
categoria: categoria,
quantidade: quantidade,
preco: preco
};
}
}

localStorage.setItem("produtos", JSON.stringify(produtos));

produtoEmEdicao = null;


    linhaAtual.querySelector(".btn-excluir").addEventListener("click", function () {
       if (!confirm("Tem certeza que deseja excluir este produto?")) {
        return;
       }
        linhaAtual.remove();
        produtos = produtos.filter(function (produto) {
          return produto.nome !== nome;
        });
        localStorage.setItem("produtos", JSON.stringify(produtos));
        atualizarTotalProdutos();
        atualizarEstoqueBaixo();
        atualizarValorEstoque();
    });
    linhaAtual.querySelector(".btn-editar").addEventListener("click", function () {
        document.getElementById("nomeProduto").value = nome;
        document.getElementById("categoriaProduto").value = categoria;
        document.getElementById("precoProduto").value = preco;
        document.getElementById("quantidadeProduto").value = quantidade;
        produtoEmEdicao = linhaAtual;
        atualizarTotalProdutos();
        atualizarEstoqueBaixo();
        atualizarValorEstoque();
    });

    atualizarTotalProdutos();
    atualizarEstoqueBaixo();
    atualizarValorEstoque();
    atualizarListaReposicao();
    formProduto.reset();
});
if (produtos.length > 0) {
  listaProdutos.innerHTML =  "";
  produtos.forEach(function (produto) {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>${produto.quantidade}</td>
    <td>R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}</td>
    <td>${Number(produto.quantidade) <= 5 ? "Estoque Baixo" : "Disponível"}</td>
      <td>
        <button class="btn-editar">Editar</button>
        <button class="btn-excluir">Excluir</button>
      </td>`;
    listaProdutos.appendChild(linha);
  });
}
atualizarTotalProdutos();
atualizarEstoqueBaixo();
atualizarValorEstoque();
ativarBotoesProdutos();
pesquisaProduto.addEventListener("input", function () {
  const termo = pesquisaProduto.value.toLowerCase();
  const linhas = listaProdutos.querySelectorAll("tr");
  linhas.forEach(function (linha) {
    const nome = linha.children[0].textContent.toLowerCase();
    const categoria = linha.children[1].textContent.toLowerCase();
    linha.style.display = nome.includes(termo) || categoria.includes(termo) ? "" : "none";
  });
});
ordenarProdutos.addEventListener("click", function () {
  const linhas = Array.from(listaProdutos.querySelectorAll("tr"));
  linhas.sort(function (a, b) {
    return a.children[0].textContent.localeCompare(b.children[0].textContent, "pt-BR");
  });
  linhas.forEach(function (linha) {
    listaProdutos.appendChild(linha);
  });
});
ordenarQuantidade.addEventListener("click", function () {
  const linhas = Array.from(listaProdutos.querySelectorAll("tr"));
  linhas.sort(function (a, b) {
    const quantidadeA = Number(a.children[2].textContent);
    const quantidadeB = Number(b.children[2].textContent);
    return quantidadeA - quantidadeB;
  });
  linhas.forEach(function (linha) {
    listaProdutos.appendChild(linha);
  });
});
filtrarEstoqueBaixo.addEventListener("click", function () {
  const mostrarTodos = document.getElementById("mostrarTodos");
  const listaReposicao = document.getElementById("listaReposicao");
  const linhas = listaProdutos.querySelectorAll("tr");
  linhas.forEach(function (linha) {
    const quantidade = Number(linha.children[2].textContent);
    linha.style.display = quantidade <= 5 ? "" : "none";
  });
});
mostrarTodos.addEventListener("click", function () {
  const linhas = listaProdutos.querySelectorAll("tr");
  linhas.forEach(function (linha) {
    linha.style.display = "";
  });
});
atualizarStatusProdutos();
atualizarListaReposicao();
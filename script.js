
const telaExpressao = document.getElementById("expressao")
const telaResultado = document.getElementById("resultado")
const botoes = document.querySelector(".botoes")

let numeroAtual = "0"
let numeroAnterior = null
let operador = null
let aguardandoNumero = false
let calculoFinalizado = false

function atualizarTela() {
    telaResultado.textContent =
        numeroAtual === "Erro"
            ? "Erro"
            : numeroAtual.replace(".", ",")

    telaExpressao.textContent = expressao
}

let expressao = ""

function adicionarNumero(numero) {
    if (
        numeroAtual === "Erro" ||
        aguardandoNumero ||
        calculoFinalizado
    ) {
        numeroAtual = numero
        aguardandoNumero = false
        calculoFinalizado = false
        expressao = ""
    } else if (numeroAtual === "0") {
        numeroAtual = numero
    } else if (numeroAtual.replace("-", "").replace(".", "").length < 15) {
        numeroAtual += numero
    }

    atualizarTela()
}

function adicionarVirgula() {
    if (
        numeroAtual === "Erro" ||
        aguardandoNumero ||
        calculoFinalizado
    ) {
        numeroAtual = "0."
        aguardandoNumero = false
        calculoFinalizado = false
        expressao = ""
    } else if (!numeroAtual.includes(".")) {
        numeroAtual += "."
    }

    atualizarTela()
}

function obterSimbolo(acao) {
    const simbolos = {
        add: "+",
        subtract: "−",
        multiply: "×",
        divide: "÷"
    }

    return simbolos[acao]
}

function escolherOperador(novoOperador) {
    if (numeroAtual === "Erro") return

    if (operador !== null && !aguardandoNumero) {
        calcular()
    }

    numeroAnterior = Number(numeroAtual)
    operador = novoOperador

    expressao =
        numeroAnterior.toString().replace(".", ",") +
        " " + obterSimbolo(operador)

    aguardandoNumero = true
    calculoFinalizado = false

    atualizarTela()
}

function calcular() {
    if (operador === null || numeroAnterior === null) return

    const numero = aguardandoNumero
        ? numeroAnterior
        : Number(numeroAtual)

    let resultado

    switch (operador) {
        case "add":
            resultado = numeroAnterior + numero
            break

        case "subtract":
            resultado = numeroAnterior - numero
            break

        case "multiply":
            resultado = numeroAnterior * numero
            break

        case "divide":
            if (numero === 0) {
                numeroAtual = "Erro"
                expressao = "Divisão por zero"
                operador = null
                numeroAnterior = null
                aguardandoNumero = true
                calculoFinalizado = true
                atualizarTela()
                return
            }

            resultado = numeroAnterior / numero
            break
    }

    expressao =
        numeroAnterior.toString().replace(".", ",") +
        " " + obterSimbolo(operador) +
        " " + numero.toString().replace(".", ",") +
        " ="

    numeroAtual = String(Number(resultado.toPrecision(12)))
    operador = null
    numeroAnterior = null
    aguardandoNumero = true
    calculoFinalizado = true

    atualizarTela()
}

function limpar() {
    numeroAtual = "0"
    numeroAnterior = null
    operador = null
    aguardandoNumero = false
    calculoFinalizado = false
    expressao = ""

    atualizarTela()
}

function inverterSinal() {
    if (numeroAtual === "Erro") return

    if (Number(numeroAtual) !== 0) {
        numeroAtual = String(Number(numeroAtual) * -1)
    }

    atualizarTela()
}

function porcentagem() {
    if (numeroAtual === "Erro") return

    numeroAtual = String(Number(numeroAtual) / 100)

    atualizarTela()
}

function apagarUltimoDigito() {
    if (
        numeroAtual === "Erro" ||
        aguardandoNumero ||
        calculoFinalizado
    ) {
        limpar()
        return
    }

    numeroAtual = numeroAtual.slice(0, -1)

    if (numeroAtual === "" || numeroAtual === "-") {
        numeroAtual = "0"
    }

    atualizarTela()
}

botoes.addEventListener("click", function(evento) {
    const botao = evento.target.closest("button")

    if (!botao) return

    if (botao.dataset.number !== undefined) {
        adicionarNumero(botao.dataset.number)
        return
    }

    switch (botao.dataset.action) {
        case "clear":
            limpar()
            break

        case "sign":
            inverterSinal()
            break

        case "percent":
            porcentagem()
            break

        case "decimal":
            adicionarVirgula()
            break

        case "backspace":
            apagarUltimoDigito()
            break

        case "add":
        case "subtract":
        case "multiply":
        case "divide":
            escolherOperador(botao.dataset.action)
            break

        case "equals":
            calcular()
            break
    }
})

document.addEventListener("keydown", function(evento) {
    if (evento.key >= "0" && evento.key <= "9") {
        adicionarNumero(evento.key)
    } else if (evento.key === "," || evento.key === ".") {
        adicionarVirgula()
    } else if (evento.key === "+") {
        escolherOperador("add")
    } else if (evento.key === "-") {
        escolherOperador("subtract")
    } else if (evento.key === "*") {
        escolherOperador("multiply")
    } else if (evento.key === "/") {
        evento.preventDefault()
        escolherOperador("divide")
    } else if (evento.key === "Enter" || evento.key === "=") {
        calcular()
    } else if (evento.key === "Escape") {
        limpar()
    } else if (evento.key === "Backspace") {
        apagarUltimoDigito()
    } else if (evento.key === "%") {
        porcentagem()
    }
})

atualizarTela()

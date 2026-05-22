# ZYRON — Documentação do Projeto

## Visão Geral

Loja online de calças masculinas com landing page, checkout integrado à gateway Paradise Pagamentos (PIX) e fluxo de upsell de correção de frete.

---

## Estrutura de Rotas

| Rota | Descrição |
|---|---|
| `/` | Landing page do produto (Kit 5 Calças Sarja Retrô Premium) |
| `/checkout` | Formulário de checkout em 3 steps |
| `/pix` | Tela de pagamento PIX com QR Code e polling automático |
| `/frete` | Upsell pós-pagamento: correção de frete (R$ 21,35) |
| `/obrigado` | Redireciona para `/frete` |

---

## Fluxo Completo do Usuário

```
Landing Page (/)
  → Seleciona tamanho → Clica em Comprar
    → Checkout (/checkout)
        Step 1: Dados pessoais (nome, e-mail, CPF, telefone)
        Step 2: Endereço (CEP com busca automática ViaCEP) + frete
        Step 3: Seleção de pagamento (PIX)
      → Gera transação na Paradise
        → Tela PIX (/pix)
            QR Code + código copia-e-cola
            Polling a cada 2s via /api/status/[id]
          → Pagamento aprovado
            → Redireciona para /frete
              → Mostra confirmação do pagamento principal
              → Após 2s: exibe upsell de correção de frete (R$ 21,35)
                → Cliente clica "Pagar correção de frete"
                  → Gera novo PIX via /api/checkout-frete
                    → Exibe QR Code de R$ 21,35
                      → Polling aprovação
                        → Confirmação: "Frete confirmado com sucesso!"
```

---

## Integração Gateway — Paradise Pagamentos

### Credenciais (variáveis de ambiente)

| Variável | Valor |
|---|---|
| `PARADISE_API_KEY` | `sk_86ded9d2236dffd4db9a7a801b72d50fa1f4c0d54f7a060c0e324cd09ca0faae` |
| `PARADISE_ACCOUNT_ID` | `7621` |
| `PARADISE_PRODUCT_HASH` | `prod_a1bf7e58125dc426` |

> As credenciais ficam **somente no servidor** (Next.js Route Handlers). O frontend nunca tem acesso à chave secreta.

### Endpoints da API Paradise usados

| Endpoint | Método | Descrição |
|---|---|---|
| `POST /api/v1/transaction.php` | POST | Cria transação PIX |
| Endpoint de status | GET | Consulta status da transação pelo `transaction_id` |

Base URL: `https://multi.paradisepags.com`

---

## Rotas API Internas (Next.js)

### `POST /api/checkout`
Cria a transação principal do pedido.

**Body esperado:**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "frete": 0
}
```

**Resposta:**
```json
{
  "transaction_id": 123456,
  "qr_code": "00020126...",
  "amount": 12790,
  "reference": "REF-7621-...",
  "expires_at": "..."
}
```

---

### `POST /api/checkout-frete`
Cria transação separada de R$ 21,35 para correção de frete.

Não requer body. Gera automaticamente uma transação com:
- `amount`: 2135 (centavos)
- `description`: "Correção de frete do pedido"

**Resposta:**
```json
{
  "transaction_id": 654321,
  "qr_code": "00020126...",
  "amount": 2135,
  "reference": "FRETE-7621-..."
}
```

---

### `GET /api/status/[id]`
Consulta o status de uma transação pelo `transaction_id`.

**Resposta:**
```json
{
  "status": "approved"
}
```

Status possíveis: `pending`, `approved`, `paid`, `failed`, `refunded`

---

## Dados do Produto

| Campo | Valor |
|---|---|
| Nome | Kit 5 Calças Masculinas em Sarja Retrô Premium |
| Subtotal | R$ 127,90 (12790 centavos) |
| Frete | Grátis (Sedex) ou R$ 12,95 (PAC) |
| Correção de frete (upsell) | R$ 21,35 |

---

## Arquivos de Imagem

Todos em `public/assets/`:

| Arquivo | Uso |
|---|---|
| `fotoproduto1.webp` até `fotoproduto8.webp` | Galeria de fotos na landing page |
| `calca1.webp` até `calca6.webp` | Carrossel de lifestyle / marquee |
| `dep1.jpg` até `dep5.jpg` | Fotos dos depoimentos de clientes |
| `sacolas.webp` | Seção de embalagem premium |
| `reclameaq.webp` | Seção de prova social ReclameAQUI |
| `pix.png` | Logo PIX (usado na tela de pagamento) |

---

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **Estilização**: Tailwind CSS v4 + CSS customizado em `globals.css`
- **Fontes**: Inter + Cinzel (via `next/font/google`)
- **QR Code**: `qrcode` (geração client-side)
- **CEP**: API ViaCEP (`https://viacep.com.br/ws/{cep}/json/`)
- **Gateway de pagamento**: Paradise Pagamentos (PIX)

---

## Observações de Segurança

- A chave secreta `PARADISE_API_KEY` nunca é exposta ao frontend.
- O QR Code é gerado localmente no navegador a partir do `qr_code` retornado pela API.
- O polling de status é feito via rota interna `/api/status/[id]` (proxy seguro).
- Dados do cliente (nome, CPF, e-mail) são enviados apenas via HTTPS para a rota backend.
- O `transaction_id` do upsell de frete é completamente separado do pedido principal.

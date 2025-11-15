## 📌 Descrição do Projeto

Aplicação construída em **Next.js** consumindo a **PokeAPI**, com gerenciamento de favoritos persistido em banco de dados PostgreSQL via **Prisma**.  
Um `userId` é gerado automaticamente no **LocalStorage** para identificar cada usuário.

Este projeto atende aos requisitos do desafio técnico:

- Buscar Pokémons por **nome ou ID**
- Listar Pokémons com **nome, ID e sprite**
- Exibir detalhes completos (tipos, habilidades, stats)
- CRUD de favoritos (**adicionar, editar notas, ver, remover**)
- Persistência em banco de dados
- Integração completa com API pública
- Geração automática de `userId` por LocalStorage
- **Filtro por tipo**
- **Dados persistido em banco de dados**
- Aplicação Responsiva

❗ Única parte opcional não implementada: **testes automatizados**

---

## 🛠 Tecnologias Utilizadas

### **Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Shadcn UI

### **Backend**
- Prisma ORM
- PostgreSQL (Neon)

### **Outros**
- LocalStorage
- API Routes do Next.js
- PokeAPI

---

## 🚀 Como Rodar o Projeto

#### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/AndreSantosOG/Pokedex.git
cd Pokedex
```

---

#### 2️⃣ Instalar dependências

Com **pnpm**:
```bash
pnpm i
```

#### 3️⃣ Criar arquivo `.env`

```bash
cp .env.example .env
```

No `.env`, adicionar:

```
DATABASE_URL="COLE_AQUI_O_LINK_DO_BANCO"
```

⚠️ Observação:  
O link do banco será enviado por **e-mail** e você deve colar no `DATABASE_URL`.

---

#### 5️⃣ Rodar o servidor

Com pnpm:
```bash
pnpm dev
```

Acesse em:  
```
http://localhost:3000
```
---

## 🌐 Deploy

- Netlify

**Deploy:** https://pokedex-nextjs-prroject.netlify.app

---

## 💾 Persistência dos Favoritos

- A aplicação gera um `userId` único no LocalStorage.
- Todos os favoritos são vinculados a esse usuário no banco.

Exemplo:

```json
{
  "id": "uuid",
  "userId": "uuid do localStorage"
  "pokemonId": 4,
  "name": "Charmander",
  "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
  "note": "usar em time elétrico",
  "createdAt": "2025-11-14 20:56:19.958",
  "updatedAt": "2025-11-14 20:56:19.958"
}
```

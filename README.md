# Gestão de Equipamentos - DENtherm

Aplicação web para gestão de equipamentos energéticos (Esquentador, Termoacumulador, AC, Caldeira, Bomba de Calor).

## Funcionalidades

- **Adicionar Equipamento**: Formulário dinâmico com validação e upload de PDF.
- **Pesquisar**: Pesquisa em tempo real por Marca ou Modelo.
- **Filtrar**: Filtragem por tipo de equipamento.
- **Listar**: Visualização em grelha com resumo das especificações.
- **Detalhes**: Página detalhada com opção de download da ficha técnica.
- **Editar/Eliminar**: Gestão completa do ciclo de vida do equipamento.

## Tecnologias

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Zod & React Hook Form
- Persistência em ficheiro JSON local (`data/equipments.json`)

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Iniciar servidor de desenvolvimento:
```bash
npm run dev
```

Aceder a http://localhost:3000

## Deploy no Vercel

1. Fazer push para um repositório Git (GitHub/GitLab/Bitbucket).
2. Importar o projeto no Vercel.
3. O Vercel deteta automaticamente as configurações do Next.js.
4. **Nota**: Como esta versão usa um ficheiro JSON local para persistência, os dados **não persistirão** entre deploys no Vercel (o sistema de ficheiros é efémero). Para produção real, recomenda-se migrar a função `saveEquipment` em `src/lib/storage.ts` para usar uma base de dados (Postgres) ou Vercel KV.

## Estrutura do Projeto

- `src/app`: Páginas e rotas (App Router).
- `src/components`: Componentes React reutilizáveis.
- `src/lib`: Definições de tipos (Zod schemas) e utilitários.
- `src/actions`: Server Actions para lógica de backend.
- `data`: Pasta onde o ficheiro `equipments.json` é guardado.

# Paróquia Nossa Senhora Aparecida — Jardim Ingá

Portal institucional com Next.js, Payload CMS e PostgreSQL. O conteúdo do protótipo em `docs/prototipo` é referência de desenvolvimento: exemplos, pesquisa e acervo permanecem identificados no CMS e não devem ser tratados como informação oficial sem revisão.

## Desenvolvimento local

Requisitos: Node.js 22.23.4 ou superior compatível, npm e Docker com Compose.

1. Copie `.env.example` para `.env` e defina um `PAYLOAD_SECRET` seguro.
2. Suba apenas o banco local:

   ```bash
   docker compose -f docker/postgres.yml up -d
   ```

3. Instale e prepare o projeto:

   ```bash
   npm install
   npm run generate:types
   ```

4. Opcionalmente, defina `PAYLOAD_ADMIN_EMAIL` e `PAYLOAD_ADMIN_PASSWORD` no `.env` e execute `npm run seed`. O seed é idempotente e importa conteúdo de demonstração. Sem essas variáveis, crie o primeiro usuário pela tela `/admin`.
5. Inicie a aplicação com `npm run dev` e abra `http://localhost:3000`.

Em desenvolvimento, demonstrações publicadas são visíveis. Em produção, `SHOW_DEMO_CONTENT` deve permanecer `false`.

## Banco e mídias no Neon (opcional)

Em vez do Postgres local, o projeto pode usar um banco Neon e guardar as mídias no Neon Object Storage (compatível com S3). O arquivo `neon.ts` declara o bucket `uploads`.

1. Instale a CLI e vincule o projeto (o vínculo fica em `.neon`, fora do Git):

   ```bash
   npm install -g neon@latest
   neon login
   neon link --project-id <id-do-projeto> --branch production
   ```

2. Crie o bucket e grave as variáveis no `.env`:

   ```bash
   neon deploy
   ```

   O comando preenche `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_ENDPOINT_URL_S3` e `AWS_REGION`. Ele reescreve `DATABASE_URL` a cada execução, assim como `neon env pull`.

3. Defina `MEDIA_BUCKET=uploads` no `.env`. Com essa variável, os uploads do Payload vão para o bucket; sem ela, ficam na pasta local `media/`.
4. Aplique as migrações e, se quiser, o conteúdo de demonstração:

   ```bash
   npm run payload -- migrate
   npm run seed
   ```

5. Para enviar ao bucket os arquivos que já estão em `media/` e são referenciados pelo banco:

   ```bash
   npm run media:upload
   ```

   O script é idempotente: arquivos já presentes com o mesmo tamanho são ignorados.

Observações:

- O bucket é privado. As imagens continuam em `/api/media/file/...`, com o Payload lendo do bucket a cada requisição; em produção, use cache ou CDN na frente.
- `npm run dev` sincroniza o schema direto no banco (push). Depois disso, `payload migrate` pede uma confirmação interativa antes de aplicar novas migrações.
- `npm run test:int` e `npm run test:e2e` usam o `.env` e criam e apagam registros. Não rode os testes com o `.env` apontando para um banco que guarde dados reais.
- `scripts/backup.sh` e `scripts/restore.sh` cobrem apenas o Postgres e a pasta `media` do Docker, não o Neon.

## Administração

O painel está em `/admin`. As funções são:

- **Administrador**: usuários, configuração, conteúdo e atendimento.
- **Editor**: cria, revisa e publica conteúdo.
- **Colaborador**: cria e edita rascunhos, sem publicar.
- **Secretaria**: acompanha contatos, solicitações e interesses privados.

Publicações, eventos, horários, comunidades, destaques e demais conteúdos possuem formulários estruturados em português. Rascunhos não são públicos. Observações internas e dados de atendimento têm acesso restrito.

## Formulários opcionais

Os fluxos ficam desativados até a paróquia definir responsáveis, atendimento e retenção. Para ativá-los após essa configuração:

```env
CONTACT_FORM_ENABLED=true
SACRAMENT_FORM_ENABLED=true
TITHE_FORM_ENABLED=true
NEWSLETTER_ENABLED=true
```

Os endpoints validam e persistem os dados antes de responder sucesso. Solicitações de sacramento não reservam datas. Newsletter começa como pendente e possui confirmação/descadastro por token; o envio de e-mails exige configurar um provedor real.

## Verificação

```bash
npm run generate:types
npx tsc --noEmit
npm run lint
npm run test:int
npm run test:e2e
npm run build
```

Os testes cobrem regras de acesso, fuso `America/Sao_Paulo`, exceções de celebrações, calendário, navegação pública e administração.

## Produção com Docker

1. Configure `.env` com URL pública HTTPS, segredo e credenciais fortes de banco.
2. Construa a imagem e execute as migrações:

   ```bash
   docker compose build
   docker compose run --rm app npm run payload -- migrate
   ```

3. Suba os serviços:

   ```bash
   docker compose up -d
   ```

`pgdata` e `media` são volumes persistentes. Em produção, alterações de schema usam `src/migrations`; o push automático fica desabilitado. Configure HTTPS por proxy reverso e mantenha a porta do PostgreSQL inacessível publicamente.

## Backup e restauração

Com os serviços de produção ativos:

```bash
scripts/backup.sh
```

O backup contém dump do PostgreSQL, mídia e checksums em `backups/<data UTC>`. Copie esse diretório para um destino separado. Para o banco local do arquivo `docker/postgres.yml`:

```bash
COMPOSE_FILE="$PWD/docker/postgres.yml" scripts/backup.sh
```

A restauração substitui dados e exige confirmação explícita:

```bash
CONFIRM_RESTORE=yes scripts/restore.sh backups/AAAAMMDDTHHMMSSZ
```

Teste a restauração periodicamente em ambiente separado antes de depender do backup.

## Pendências institucionais

Antes da publicação oficial, confirme contatos, horários divergentes, equipe, pastorais, história, requisitos de sacramentos, projetos, patrocinadores e canais de doação. Não publique placeholders, exemplos ou dados financeiros sem aprovação. O dossiê completo está em `docs/DOSSIE-DESENVOLVIMENTO-PAROQUIA.md`.

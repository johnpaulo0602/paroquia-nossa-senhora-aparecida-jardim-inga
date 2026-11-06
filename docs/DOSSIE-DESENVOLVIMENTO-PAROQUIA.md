# Paróquia Nossa Senhora Aparecida — Jardim Ingá
## Dossiê atualizado para desenvolvimento

**Versão:** 28 de outubro de 2026  
**Finalidade:** transferir o contexto do projeto a um agente de desenvolvimento, acompanhado do protótipo navegável.  
**Estado:** protótipo local concluído para apresentação; aplicação de produção e CMS ainda não implementados.

Este documento consolida as decisões funcionais e editoriais vigentes. Substitui as orientações de escopo dos documentos anteriores quando houver divergência. `PLANO.md` e `LEIA-ME.md` contêm registros de etapas antigas, inclusive funcionalidades posteriormente removidas.

Não há especificações de estilo ou design neste documento. O agente deve extrair a apresentação diretamente do protótipo fornecido. As referências externas explicam a origem da organização do conteúdo; não substituem o protótipo atual como referência do projeto.

---

## 1. Contexto e objetivo

O projeto é uma iniciativa pessoal de um devoto que deseja oferecer um site à paróquia. O responsável pelo projeto pretende hospedar e manter a aplicação por conta própria. Não há contratação, publicação oficial ou aprovação institucional documentada nesta etapa.

O produto deve combinar informação institucional, comunicação editorial e serviços paroquiais. As prioridades são:

- Encontrar missas, confissões, secretaria e localização.
- Acompanhar notícias, eventos e a vida das comunidades.
- Conhecer a história, a padroeira, os sacerdotes e os serviços da paróquia.
- Receber orientações sobre sacramentos e participação.
- Permitir que a equipe publique e atualize informações sem depender do desenvolvedor.

**Requisitos expressos:** CMS de fácil gestão, solução open source e hospedagem própria. A operação precisa ser adequada a pessoas sem conhecimento técnico.

## 2. Como interpretar o material entregue

### 2.1 Pacote principal

A pasta `prototipo-paroquia/` contém o protótipo completo. Abra `index.html` mantendo os arquivos e a pasta `assets/` juntos.

| Arquivo | Responsabilidade atual |
| --- | --- |
| `index.html` | Páginas, navegação por hash, dados básicos de comunidades/horários e editor demonstrativo de evento. |
| `conteudo.js` | Dez textos editoriais e os dados iniciais dos destaques. |
| `portal.js` | Destaques, artigos, agenda, eventos, comunidades e orientações de vida cristã. |
| `vida-crista.js` | Pastorais e páginas individuais, reflexões, espiritualidade, mural do dízimo e carrossel de patrocinadores. |
| `comunidade.js` | Comunicação, carregamento de conteúdo, registro fotográfico adicional, projetos, formulários simulados e solicitações de sacramentos. |
| `historia.js` | Navegação pelos marcos das linhas do tempo da paróquia e da padroeira. |
| `assets/` | Imagens e demais recursos locais do protótipo. |
| `previa-*.jpg` | Registros de conferência; algumas capturas pertencem a etapas anteriores. O código atual tem precedência. |

Há dados complementares em pacotes irmãos, caso sejam entregues junto:

- `dossie-igreja/`: pesquisa inicial, fontes e acervo obtido nas redes.
- `conteudo-paroquia/`: textos em Markdown/JSON, banners e artes para redes sociais.
- `identidade-visual/`: materiais produzidos em etapa anterior.

O protótipo é uma referência de produto e conteúdo, não uma arquitetura de produção a ser copiada literalmente. Contém dados fixos, simulações e código acumulado em sucessivas revisões. A implementação pode ser reorganizada em componentes e modelos de domínio.

### 2.2 Distinções obrigatórias

1. **Informação pesquisada:** possui fonte, mas dados operacionais ainda dependem de confirmação paroquial.
2. **Acervo histórico:** descreve uma publicação ou imagem de uma época; não é anúncio vigente.
3. **Placeholder:** texto, nome, imagem ou data provisórios; não pode virar informação oficial automaticamente.
4. **Comportamento demonstrativo:** interação local que não corresponde a serviço de produção.
5. **Recomendação de implementação:** proposta deste documento, ainda sem infraestrutura instalada.

## 3. Identificação da paróquia e fontes

A igreja deste projeto fica no **Jardim Ingá, em Luziânia, Goiás**, vinculada à **Diocese de Luziânia** e à **Forania Cidade Ocidental e Jardim Ingá**. Existem paróquias homônimas, inclusive na mesma diocese. Validar sempre a localização antes de importar informações.

### 3.1 Dados encontrados na pesquisa

| Campo | Informação pesquisada |
| --- | --- |
| Nome | Paróquia Nossa Senhora Aparecida |
| Endereço | Avenida Lucena Roriz, quadra 255, lotes 11 a 20, Parque Estrela D’Alva IX, Jardim Ingá, Luziânia — GO |
| CEP | 72850-010 |
| Telefone/WhatsApp | (61) 3055-0747 |
| E-mail | nsaparecidaparoquia@yahoo.com.br |
| Secretaria | Terça a sexta: 8h às 12h e 14h às 17h; sábado: 8h às 11h |
| Pároco listado | Pe. Inaldo José Salustiano |
| Vigário listado | Pe. Cláudio Eduardo de Faria |
| Criação da paróquia | 1997 |

A identificação dos sacerdotes foi reconferida no diretório diocesano em **28/10/2026**. Não foram obtidas biografias nem fotografias para os perfis da equipe.

**1997 se refere à criação da paróquia.** Não há confirmação da inauguração do prédio atual, do começo das obras, de reformas ou dos primeiros responsáveis. Não associar a fotografia atual da igreja à fachada de 1997.

### 3.2 Fontes principais

- [Cadastro paroquial na Diocese](https://diocesedeluziania.com.br/paroquias/paroquia-nossa-senhora-aparecida-2/).
- [Organização das paróquias](https://diocesedeluziania.com.br/paroquias/).
- [Diretório de sacerdotes](https://diocesedeluziania.com.br/sacerdotes/).
- [História da Diocese](https://diocesedeluziania.com.br/about/).
- [Página de missas](https://diocesedeluziania.com.br/missas/paroquia-nossa-senhora-aparecida-2/).
- [Instagram da paróquia](https://www.instagram.com/nsaaparecidajdinga/).
- [Facebook da matriz](https://www.facebook.com/MatrizAparecidaJardiminga/).

Essas fontes compõem uma pesquisa datada, não uma integração automática. Antes da publicação oficial, confirmar dados de atendimento e programação com a secretaria.

Não usar como contato paroquial o telefone geral da Diocese, (61) 3622-0096, nem o endereço do Parque JK encontrado em rodapés diocesanos. Diretórios externos também apresentaram números antigos.

## 4. Comunidades e horários

A pesquisa relaciona a matriz e cinco capelas:

| Comunidade | Região | Missas encontradas na pesquisa |
| --- | --- | --- |
| Matriz Nossa Senhora Aparecida | Jardim Ingá / Parque Estrela D’Alva IX | Quinta e sexta, 19h; domingo, 7h30 e 19h |
| São Pedro e São Paulo | Jardim Ingá | Quarta, 19h; domingo, 9h |
| São Miguel Arcanjo | Parque Estrela D’Alva VII | Divergência: sábado ou domingo, 17h |
| Nossa Senhora do Perpétuo Socorro | Parque Estrela D’Alva VIII | Domingo, 10h30 |
| Nossa Senhora da Assunção | Parque Estrela D’Alva X | Sábado, 19h |
| Nossa Senhora de Fátima | Parque Estrela D’Alva IX | Terça, 19h; domingo, 17h |

Há outra divergência: uma página diocesana acrescenta **sábado às 8h na matriz**, ausente em outro cadastro. Não foi determinado qual registro era o mais recente.

No protótipo, sábado na matriz e os horários de São Miguel foram omitidos da tabela de celebrações. São Miguel continua como comunidade, com horário aguardando confirmação. Confissão e adoração também aguardam informação validada.

Os endereços completos e as fotografias das capelas ainda faltam. A lista de pastorais e movimentos não está confirmada; menções históricas em redes e diretórios não comprovam atividade atual.

## 5. Inventário das páginas vigentes

Os endereços abaixo são as rotas **do protótipo**, não uma exigência de roteamento por hash para produção.

| Rota | Conteúdo e comportamento |
| --- | --- |
| `#inicio` | Destaques manuais, serviços, publicações com carregamento progressivo, agenda resumida, apresentação da matriz, sacramentos, comunidades, projetos, patrocinadores e vida cristã. |
| `#noticias` | Central “Comunicação da paróquia”: destaques navegáveis, filtros por formato e carregamento incremental. |
| `#noticia/{id}` | Publicação individual com texto, mídia, créditos, fonte quando aplicável e conteúdos relacionados. Inclui o registro fotográfico do acervo. |
| `#agenda` | Eventos em lista ou calendário, com filtro por comunidade. |
| `#evento/{id}` | Detalhes do evento e download de exemplo `.ics`. |
| `#horarios` | Celebrações filtradas por comunidade e dia da semana; orientações sobre confissão e adoração. |
| `#secretaria` | Atendimento, missas da matriz, contatos, localização e orientação sobre celebrações especiais. |
| `#contato` | Formulário de mensagem e canais diretos. É uma página distinta da Secretaria. |
| `#paroquia` | História da paróquia em linha do tempo. Substituiu a antiga página “A nossa paróquia”. |
| `#padroeira` | História de Nossa Senhora Aparecida, marcos da devoção nacional, curiosidades e fontes do A12. |
| `#equipe` | Estrutura da paróquia: sacerdotes e perfis da equipe, com apresentações expansíveis. |
| `#comunidade` e `#comunidade/{id}` | Seleção de capela, apresentação, celebrações e contato pela secretaria. |
| `#vida` | Orientação geral sobre sacramentos. |
| `#vida/catequese` | Primeira Eucaristia, crisma e iniciação cristã de adultos. |
| `#vida/pastorais` | Seis pastorais de exemplo com acesso às apresentações individuais. |
| `#pastoral/{id}` | Missão, atividades, informações de participação e contato pela secretaria. |
| `#vida/in-cordibus-pastorum` | Apresentação dos sacerdotes e reflexões editoriais demonstrativas. |
| `#vida/espiritualidade` | Orientação para oração pessoal, liturgia externa e reflexões. |
| `#reflexao/{id}` | Leitura de uma das três reflexões originais de demonstração. |
| `#vida/mural-do-dizimo` | Aniversariantes por mês, formação sobre partilha e interesse demonstrativo em ser dizimista. |
| `#vida/batismo` | Formas de celebração, documentação/requisitos e solicitação demonstrativa. |
| `#vida/matrimonio` | Informações e solicitação demonstrativa de casamento. |
| `#projetos` | Projetos e propostas de parcerias fictícios. |
| `#contribuir` | Dízimo e doações, sem recebimento de dinheiro. O botão público se chama **“Quero doar”**. |
| `#admin` | Editor demonstrativo de evento, sem autenticação ou backend. |

O menu agrupa história, padroeira, estrutura e comunidades em “A paróquia”. Sacramentos inclui acesso a batismo e casamento. A estrutura também está acessível pelo rodapé e pela Secretaria.

## 6. Regras funcionais por área

### 6.1 Comunicação e destaques

- Abertura com quatro destaques manuais. O primeiro foi substituído por apresentação da matriz com fotografia real; os demais usam conteúdos editoriais.
- A seção de comunicação da home exibe inicialmente seis conteúdos; cada clique em “Carregar mais conteúdos” acrescenta até quatro. O botão desaparece ao acabar o acervo.
- A página Comunicação tem controles de anterior/próximo nos destaques.
- Filtros vigentes: Todos, Notícias, Artigos, Fotos e Vídeos.
- O arquivo exibe inicialmente até seis itens; “Ver mais conteúdo” acrescenta até seis. Trocar o filtro reinicia a quantidade exibida.
- Existe estado vazio para um formato sem conteúdo. Não inventar vídeos apenas para preencher o filtro.
- **A busca foi removida de toda a interface.** Não reintroduzir a busca geral nem o campo de pesquisa de notícias por causa dos documentos antigos.
- Na produção, usar paginação real e ordenação editorial/data, sem carregar indefinidamente todo o banco no navegador.
- Destaques precisam ter conteúdo de destino, ordem, período de exibição e alternativa quando não houver destaque ativo.

### 6.2 Acervo editorial atual

O pacote contém **dez textos**: nove sínteses de notícias da Igreja e uma apresentação institucional da matriz. `comunidade.js` acrescenta um registro fotográfico, totalizando **onze conteúdos navegáveis** na central.

Os textos editoriais usam fontes consultadas em **12/10/2026**. Eles não são um feed atualizado automaticamente e não devem continuar anunciados como “notícias atuais” sem revisão. Cada publicação mantém sua data e fonte. O enquadramento em Notícia, Artigo ou Fotos no protótipo demonstra o funcionamento; a classificação final exige revisão editorial.

IDs dos dez textos: `padroeira`, `papa-aparecida`, `missoes`, `rosario-paz`, `familias`, `saude-mental`, `francisco-assis`, `criancas-rosario`, `juventude` e `matriz`. O registro fotográfico adicional usa `album-matriz`.

Os artigos são resumos originais com referências; não são reproduções integrais de terceiros. Preservar créditos e distinguir notícias da Igreja em geral de acontecimentos efetivamente locais.

### 6.3 Agenda e celebrações

O calendário atual está fixado em **novembro de 2026**, com três eventos fictícios:

- 15/11: Encontro de formação, 9h–11h, matriz.
- 21/11: Encontro da comunidade, 16h–18h, São Pedro e São Paulo.
- 28/11: Reunião pastoral, 14h–16h, Nossa Senhora de Fátima.

Não publicar esses eventos como programação oficial. Na aplicação real, gerar calendário a partir das datas cadastradas e permitir navegação entre períodos. Eventos e horários recorrentes de missa são entidades diferentes.

Usar `America/Sao_Paulo` nas datas e horários. Exceções por data devem prevalecer sobre o horário semanal: alteração, cancelamento ou celebração adicional. Mostrar avisos especiais somente dentro da validade. Eventos passados permanecem no arquivo, sem ocupar a programação futura.

O `.ics` atual é explicitamente fictício e não foi validado por importação em aplicativos externos. A versão real precisa representar corretamente fuso, início, fim, local e identificação do evento.

### 6.4 História da paróquia

A linha do tempo possui seis marcos: criação em 1997; primeiros passos; construção; expansão das comunidades; registro da camiseta de 2025; situação atual.

Primeiros passos, construção e expansão têm **“Data a confirmar”**, espaços de imagem e lorem ipsum. Isso não estabelece datas nem sequência histórica documentada. Na produção, cada marco deve permitir data exata, somente ano, período ou rótulo textual, além de ordenação manual e fonte.

A arte de 2025 comprova a existência do material de divulgação daquele ano, não a realização de uma atividade específica. A fotografia atual não comprova o estado do prédio em uma data antiga.

### 6.5 Padroeira

Há seis marcos: encontro da imagem em 1717; expansão da devoção nos séculos XVIII/XIX; coroação em 1904; proclamação como padroeira do Brasil em 1930; dedicação da nova Basílica em 1980; devoção na comunidade atual.

Fontes de conteúdo:

- [A12 — história da devoção](https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717).
- [A12 — história do Santuário Nacional](https://www.a12.com/devotos-mirins/historia-do-santuario-nacional).

A página tem leitura complementar e curiosidades. Não há documentário integrado: o acesso complementar leva ao A12. Os episódios próprios da Catedral/Arquidiocese de Brasília foram excluídos. Não atribuir sua fundação, celebrações na Esplanada ou reconhecimento patrimonial ao Jardim Ingá.

### 6.6 Estrutura da paróquia

Dois sacerdotes identificados no diretório diocesano e seis perfis provisórios de serviços: Secretaria, Coordenação administrativa, Comunicação, Conselho pastoral, Catequese e Acolhimento.

Os nomes dos demais responsáveis, a composição desses serviços, as biografias e todas as fotografias estão pendentes. Os cartões usam a imagem placeholder fornecida pelo usuário e lorem ipsum. Não há contatos pessoais fictícios; o encaminhamento é para a secretaria.

No CMS, separar papel/função, pessoa, biografia, foto, ordem de exibição, situação e contato público autorizado. A saída de um integrante deve permitir atualizar a equipe sem perder eventual informação histórica.

### 6.7 Secretaria e Contato

Secretaria reúne atendimento e informações práticas. Contato é destinado à mensagem do visitante. Manter a separação.

O formulário de contato contém nome, e-mail, assunto, relação com a paróquia e mensagem. Os assuntos incluem sacramentos, participação, parcerias, comunicação e outros. Hoje valida os campos no navegador e informa que o envio foi simulado.

Para produção, definir destinatário, quem acompanha as mensagens e como ocorre a resposta. Exibir sucesso apenas após recebimento efetivo pelo serviço. Se a integração ainda não estiver configurada, não apresentar um envio fictício como real.

### 6.8 Batismo e casamento

- Batismo: opções de formas de celebração, documentação/requisitos e formulário.
- Casamento: informações e formulário.
- As opções podem ser percorridas por teclado; preservar acesso a todo o conteúdo em dispositivos móveis.
- Batismo demonstra campos de criança, nascimento, responsáveis, padrinhos, e-mail, telefone, data desejada, local e observações.
- Casamento demonstra nomes dos noivos, contato, data desejada, local e observações.
- **Campos, obrigatoriedade e requisitos ainda são demonstrativos.** Não converter automaticamente os asteriscos do protótipo em regras paroquiais definitivas.
- A data informada é uma preferência. Solicitação não equivale a confirmação ou reserva.
- Não foram transferidos taxas, limites de vagas ou critérios específicos da Catedral para esta paróquia.
- Não existe upload de documentos: há somente uma explicação sobre futura definição desse procedimento.

Os formulários atuais não enviam nem armazenam dados. A ativação real depende da definição do fluxo com a secretaria. Não implementar um cadastro sacramental completo, prontuário religioso ou cobrança com base nesses exemplos.

### 6.9 Newsletter

Presente nas páginas públicas, com campo de e-mail, validação e retorno de inscrição simulada. Não existe lista de inscritos, provedor de envio ou inscrição real.

Antes da ativação, definir serviço de envio, confirmação da inscrição, consentimento, descadastro e responsável editorial. Os dados de inscrição não devem ser expostos pela API pública.

### 6.10 Projetos, patrocinadores e doações

Projetos fictícios: Mãos que acolhem, Amigos da comunidade e Cuidar da nossa casa. Patrocinadores demonstrativos: sete logos fornecidas pelo usuário (Logo, Sponsor, Loremlogo, BrandName, Company Name e duas marcas de casas). Os quatro nomes fictícios da versão anterior foram substituídos. As imagens estão em `assets/patrocinadores/exemplo-1.png` a `exemplo-7.png`. Não há vínculo com empresas reais.

Tratar esses registros como exemplos até substituição por iniciativas e apoiadores aprovados. Os botões de parceria levam ao contato. O carrossel percorre continuamente as sete logos, com pausa/retomada e pausa ao passar o ponteiro. A cópia usada para continuidade fica oculta aos leitores de tela; a preferência por movimento reduzido apresenta as logos sem animação.

“Quero doar” leva à página de contribuição. Não há checkout, Pix, conta bancária, recorrência ou recebimento de dinheiro. Só publicar canais financeiros após fornecimento e confirmação oficial pela paróquia. A presença do botão não autoriza inventar dados bancários ou contratar um meio de pagamento.

### 6.11 Liturgia e redes sociais

A liturgia diária abre [Canção Nova](https://liturgia.cancaonova.com/pb/) em fonte externa. Não há importação de leituras, API ou cópia automática. Instagram e Facebook são links diretos; o funcionamento do portal não depende de login nas redes nem de feed incorporado.

### 6.12 Pastorais e movimentos

A relação oficial ainda não está confirmada. Foram criados seis exemplos, cada um com página própria: `liturgia-musica`, `catequese`, `comunicacao`, `acolhimento`, `dizimo` e `caridade`. Não assumir que estejam ativos na paróquia.

Cada apresentação contém missão, atividades ilustrativas, informações sobre participação e chamada para a Secretaria. Coordenação, encontros, local e requisitos estão a confirmar. Não foram copiados nomes, números de participantes, horários ou exigências da Catedral. Ilustrações existentes foram reutilizadas; não representam registros dos grupos locais. Alguns textos permanecem em lorem ipsum.

### 6.13 In Cordibus Pastorum e Espiritualidade

A página In Cordibus Pastorum apresenta os dois sacerdotes já identificados no diretório diocesano, fotografia provisória e espaço para mensagens/homilias futuras. Não apresenta o arcebispo de Brasília como responsável pela paróquia.

Há três reflexões originais de demonstração, compartilhadas com Espiritualidade: `escuta`, `servir` e `oracao`. Elas têm páginas de leitura próprias em `#reflexao/{id}` e não são atribuídas aos padres. São conteúdos adicionais aos onze registros da central de comunicação; não foram adicionados àquela listagem. Em produção, usar um único modelo de Publicação com relações e categorias, evitando duplicar conteúdos entre áreas.

Espiritualidade reúne orientação introdutória à oração, três práticas (escuta da Palavra, apresentação da vida a Deus e cuidado com o próximo), link externo para liturgia diária e leituras. A chamada “Reze conosco” encaminha aos horários; não inventa encontros locais de oração.

### 6.14 Mural do dízimo

Inclui seleção dos doze meses, estado vazio de aniversariantes, apresentação do dízimo como participação livre e consciente, dez motivos de partilha em texto original e formulário demonstrativo de interesse com nome, e-mail e confirmação de que se trata de demonstração.

A seleção de mês atualiza o título; não há nomes ou aniversários reais cadastrados. O envio apenas valida e exibe retorno na própria página, sem transmissão, armazenamento, cadastro, pagamento ou reserva. O botão “Quero ser dizimista” encaminha à Secretaria. A página não substitui `#contribuir`, que continua sendo o destino de “Quero doar”.

Em produção, o cadastro de dizimistas é privado. Uma eventual lista pública de aniversariantes precisa de autorização e seleção explícita de quais dados podem aparecer. Não publicar ano de nascimento, contatos, valores ou histórico financeiro. O formulário atual expressa interesse; não equivale a um cadastro completo de dizimista.

## 7. CMS e aplicação de produção

### 7.1 Diretriz técnica

O CMS é um requisito do produto. A recomendação anterior foi **Next.js + Payload CMS + PostgreSQL**, com hospedagem própria; nada disso está instalado no protótipo. É uma proposta de arquitetura, não evidência de infraestrutura existente nem decisão contratual de stack.

Preferir formulários de conteúdo estruturados, com campos em português, a um construtor livre de páginas. O editor deve reconhecer tarefas como “cadastrar evento”, “alterar horário” e “publicar notícia”.

### 7.2 Modelos sugeridos

| Modelo | Dados e relações principais |
| --- | --- |
| Configurações da paróquia | Nome, endereço, contatos, redes, atendimento e canais públicos. |
| Comunidade | Nome, descrição, localização, fotografia, contato aprovado e situação. |
| Celebração recorrente | Tipo, comunidade, dia, hora e período de validade. |
| Exceção de celebração | Data, regra afetada, cancelamento, substituição ou celebração extra. |
| Evento | Título, descrição, início/fim, comunidade/local, mídia, informações de participação e situação. |
| Publicação | Título, resumo, corpo, formato, assuntos, capa, autor, data, fonte e relações com comunidade/pastoral. |
| Álbum e vídeo | Fotografias com legendas/créditos ou vídeo autorizado; relação com publicação/evento. |
| Destaque | Conteúdo ou destino, chamada, mídia, ordem e início/fim de exibição. |
| Aviso | Texto, destino opcional, período de validade e contexto de exibição. |
| Marco histórico | Contexto paróquia/padroeira, data/período/rótulo, título, texto, mídia, fonte e ordem. |
| Pessoa/equipe | Nome, função, apresentação, foto, contato público e situação. |
| Pastoral/movimento | Identificador, nome, missão, atividades, coordenação, encontros, local, requisitos, mídia, contato aprovado, comunidades relacionadas e situação. |
| Orientação de sacramento | Assunto, seções, requisitos revisados, contatos e atualização. |
| Projeto/parceria | Nome, descrição, responsáveis institucionais, período, mídia e situação. |
| Apoiador/patrocinador | Nome, marca, link, período, projeto relacionado e aprovação. |
| Interesse no dízimo (privado) | Nome, contato, consentimento, situação do atendimento e retenção. Eventual publicação de aniversário depende de autorização separada. |
| Mídia | Arquivo, descrição alternativa, legenda, autoria/crédito, origem e autorização. |

Mensagens, solicitações sacramentais e inscrições na newsletter são dados privados de atendimento. Se ativados, mantê-los separados do conteúdo público, com acesso por função e política de retenção definida.

### 7.3 Fluxo editorial

- Rascunho, revisão, publicação e arquivamento.
- Prévia protegida antes de publicar.
- Histórico de alterações e recuperação de versão, conforme suporte da solução adotada.
- Agendamento e expiração para destaques e avisos.
- Não publicar automaticamente placeholders, exemplos ou conteúdo sem aprovação.
- Conteúdo não publicado não pode ser lido pela API pública.
- Não duplicar notícia para vinculá-la a uma pastoral: usar relações.

Perfis sugeridos: administrador técnico; editor com publicação; colaborador que cria rascunhos. Acesso da secretaria a mensagens e pedidos deve ser configurado separadamente. As permissões ainda precisam ser implementadas e verificadas.

## 8. O que o painel demonstrativo realmente faz

A rota `#admin` não é um CMS instalado. É um formulário local de evento com título, data, horário, local, descrição, imagem, texto alternativo e opção de destaque.

- Atualiza uma prévia enquanto o usuário preenche.
- Grava os campos de rascunho no `localStorage` deste navegador.
- A imagem selecionada permanece apenas na sessão; não é enviada a servidor.
- “Publicar” mostra confirmação de simulação, sem alterar o conteúdo público.
- Não há login, usuários, banco, API administrativa ou fluxo de revisão.

Na versão real, substituir a simulação por persistência e publicação efetivas. Não usar `localStorage` como banco de produção, nem expor `/admin` sem autenticação.

## 9. Arquivos de mídia e limites de uso

- `assets/logo-igreja.png`: desenho recortado fornecido pelo usuário; é o arquivo atualmente usado no site.
- `assets/logo.png`: arquivo anterior, preservado no acervo; não deve substituir automaticamente a versão usada.
- `assets/matriz-atual.jpg` e `assets/fachada.png`: fotografias fornecidas para o projeto.
- `assets/equipe-placeholder.png`: imagem genérica enviada pelo usuário para perfis sem fotografia.
- `assets/camiseta-2025.jpg`: divulgação histórica da camiseta, não oferta comercial vigente.
- `assets/editorial/`: ilustrações geradas para os banners e conteúdos. Não são fotografias de acontecimentos.
- `assets/aparecida.jpg`: representação devocional do acervo fornecido.

Há mais imagens no dossiê inicial; algumas são miniaturas de vídeos. Não apresentar miniatura como registro fotográfico original de alta resolução. Antes da publicação oficial, confirmar o uso do acervo com a paróquia, inclusive imagens de pessoas e crianças.

Não inventar retratos de integrantes, fotografias de capelas ou imagens documentais de acontecimentos passados. Preservar descrição alternativa, créditos e indicação de ilustração quando aplicável.

## 10. Referências de organização

A referência principal aprovada é a [Catedral de Brasília](https://catedral.org.br/). Foram usados como orientação funcional:

- [Comunicação](https://catedral.org.br/comunicacao/).
- [Secretaria](https://catedral.org.br/institucional/secretaria-paroquial/).
- [História](https://catedral.org.br/institucional/historia/).
- [Padroeira](https://catedral.org.br/institucional/padroeira/).
- [Estrutura](https://catedral.org.br/institucional/estrutura-da-paroquia/).
- [Batismo](https://catedral.org.br/solicitacoes-de-celebracoes/batismo/).
- [Casamento](https://catedral.org.br/solicitacoes-de-celebracoes/casamento/).

Não importar contatos, equipe, taxas, normas locais, eventos ou dados bancários da Catedral. A padroeira é a mesma; a instituição, a história local e os procedimentos são distintos.

## 11. Fora do escopo atualmente estabelecido

- Busca geral, removida por solicitação do usuário.
- Turismo, visitas guiadas, patrimônio arquitetônico e solicitações de iluminação.
- Sala de imprensa e credenciamento profissional.
- Transmissão ao vivo ou canal de vídeo não confirmado.
- Contas para fiéis e rede social interna.
- Pedidos de oração e intenções de missa, sem fluxo definido.
- Loja, venda de camisetas e pagamentos integrados.
- Gestão sacramental completa ou sistema financeiro paroquial.
- Importação automática de notícias e republicação integral de artigos de terceiros.

Uma página anual de Festa da Padroeira, galerias mais completas e compartilhamento por WhatsApp são extensões possíveis já discutidas, mas não estão plenamente implementadas como módulos próprios.

## 12. Hospedagem e manutenção

A aplicação será hospedada pelo responsável pelo projeto. Não foi contratado provedor nem registrado domínio no contexto desta entrega.

Preparar implantação reproduzível, HTTPS, configuração por ambiente e persistência de banco e mídia. Definir backup do banco e arquivos em destino separado, com teste de restauração. Documentar atualização da aplicação, recuperação e cadastro de editores. A mídia pode ser local ou em armazenamento compatível com S3, conforme a infraestrutura escolhida.

Integrações de e-mail, newsletter e arquivos dependem de configuração real. Não inserir credenciais no código nem alegar funcionamento de um serviço que não foi configurado e testado.

## 13. Pendências de conteúdo e operação

Antes da publicação institucional, obter:

1. Aprovação da paróquia e responsáveis pelo conteúdo/atendimento.
2. Contatos, endereço e expediente atualizados.
3. Horários de todas as celebrações e solução das divergências da matriz e de São Miguel.
4. Lista oficial de equipe, pastorais e comunidades, com fotos e apresentações autorizadas.
5. Documentos e depoimentos para completar a história local.
6. Orientações de batismo, casamento e catequese; campos e documentos realmente necessários.
7. Decisão sobre ativação dos formulários, seus destinatários e confirmação de atendimento.
8. Serviço e rotina de newsletter, caso seja ativada.
9. Projetos e patrocinadores reais; remoção dos exemplos antes da publicação oficial.
10. Canais oficiais de doação, se forem divulgados.
11. Domínio, infraestrutura, backups e responsabilidade de manutenção.

Essas pendências não impedem implementar os modelos e as páginas com dados de desenvolvimento. Impedem tratar exemplos e fluxos não definidos como serviços oficiais funcionando.

## 14. Critérios de conclusão para o agente

### Conteúdo e administração

- Um editor consegue alterar contato e expediente, cadastrar comunidade, corrigir horário, publicar evento/notícia e gerenciar destaques sem editar código.
- Rascunhos e conteúdo privado permanecem inacessíveis ao público.
- Atualizações aparecem na página correspondente e nas relações em que o conteúdo é usado.
- Datas especiais, cancelamentos, avisos vencidos e eventos passados seguem regras previsíveis.
- Placeholders e registros de teste ficam identificados e fora da publicação institucional.

### Navegação e serviços

- Todas as páginas do inventário possuem acesso direto, título e comportamento de erro para itens inexistentes.
- Comunicação permite filtrar e carregar mais sem duplicar itens ou perder o filtro.
- Secretaria e Contato continuam separados; não há campo de busca.
- As linhas do tempo e as apresentações da equipe funcionam com teclado e no celular.
- Os formulários oferecem validação e retorno real quando ativados; nenhuma solicitação vira reserva automaticamente.
- Não existem envios, pagamentos ou inscrições com sucesso aparente e sem persistência/integrador real.
- Acesso à liturgia e às redes permanece ligado às fontes corretas.

### Operação

- Implantação e configuração estão documentadas.
- Fluxos críticos do CMS, permissões, datas/fuso e formulários são testados.
- O download de calendário é verificado em aplicativo compatível.
- Backup e restauração são exercitados antes de considerar a hospedagem pronta.

## 15. Início recomendado do trabalho

1. Ler este dossiê e navegar pelo protótipo atual, inclusive as rotas internas.
2. Inventariar os conteúdos e separar dados reais pesquisados, acervo, placeholders e exemplos.
3. Definir a arquitetura open source para hospedagem própria e registrar as decisões.
4. Implementar os modelos e as permissões do CMS; migrar os dados de demonstração de forma identificada.
5. Implementar páginas e consultas, sem reproduzir as limitações do protótipo: calendário fixo, publicação simulada e armazenamento apenas local.
6. Ativar serviços de atendimento/newsletter somente com fluxo e configuração definidos.
7. Validar o conteúdo com a paróquia, concluir verificações e preparar publicação e treinamento.

**Resultado esperado:** transformar o protótipo aprovado em um portal administrável e sustentável, preservando as decisões atuais e deixando explícito o que ainda precisa de informação ou autorização institucional.

## Atualização de escopo — Vida cristã e patrocinadores (28/10/2026)

Esta edição incorpora as novas páginas e substitui a listagem simples anterior de pastorais e os antigos quatro nomes de patrocinadores. Referências de organização consultadas:

- https://catedral.org.br/vida-crista/pastorais/
- https://catedral.org.br/pastorais/liturgia-musica/
- https://catedral.org.br/vida-crista/in-cordibus-pastorum/
- https://catedral.org.br/vida-crista/espiritualidade/
- https://catedral.org.br/vida-crista/mural-do-dizimo/

Pastorais e Espiritualidade não expuseram conteúdo central na consulta ao site; suas páginas locais foram organizadas de forma coerente com o restante do portal. As referências de pastoral individual, apresentação dos pastores e mural do dízimo forneceram a estrutura funcional. Nenhum dado de operação da Catedral foi transplantado como informação local.

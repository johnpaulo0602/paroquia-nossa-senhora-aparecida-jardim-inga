# Ajustes de comunicação e serviços — 28/10/2026

Referências: https://catedral.org.br/comunicacao/ ; https://catedral.org.br/solicitacoes-de-celebracoes/batismo/ ; https://catedral.org.br/solicitacoes-de-celebracoes/casamento/ . A adaptação mantém Poppins, cores e conteúdos do Jardim Ingá. Não importa regras, valores ou programação da Catedral.

Implementados no protótipo: bento grid com carregamento progressivo; central com carrossel e filtros por formato; ícones Lucide; separação de secretaria e contato; abas e formulários demonstrativos de sacramentos; newsletter simulada; projetos, parcerias e patrocinadores fictícios. Busca removida.

Implementação posterior: CMS real, destinatários e fluxo de atendimento, política de dados, confirmação de horários, integração de newsletter e gestão dos pedidos. Os formulários atuais operam apenas na sessão do navegador e não fazem requisições.

# Redesenho aprovado — 28/10/2026

A referência principal passa a ser a Catedral de Brasília em sua organização institucional e editorial, com adaptação para uma paróquia de bairro. A tipografia é Poppins sem serifa, incluída localmente com licença. A interface prioriza a matriz, horários, sacramentos, comunidades, agenda e comunicação. Turismo, patrimônio arquitetônico, guias, iluminação promocional e credenciamento de imprensa não integram o protótipo.

O CMS real permanece uma etapa posterior. O escopo atual é o protótipo local navegável: páginas e estilos renovados, submenus acessíveis, busca, notícias e editor demonstrativo. Para a implementação, ampliar o painel para notícias, destaques, páginas institucionais, comunidades, horários e mídia. Conteúdos e dados locais exigem revisão da paróquia antes da publicação oficial.

## Conteúdo editorial — 12/10/2026

Foram integrados quatro banners ilustrados e dez artigos curtos com fontes: nove notícias da Igreja e uma apresentação institucional. Duas artes para redes sociais estão no pacote `conteudo-paroquia`. Os textos são originais, e as imagens geradas estão identificadas como ilustrações. A seleção não atualiza automaticamente. O CMS permanece planejado; o protótipo usa dados locais.

# Etapa atual: portal de notícias e vida paroquial

O protótipo foi atualizado para a direção aprovada: conteúdo editorial na abertura, notícias, agenda e páginas institucionais. Abaixo está o planejamento de implementação; os detalhes anteriores das quatro telas registram a primeira etapa do trabalho.

## Implementado na demonstração

Banners manuais; quatro publicações de demonstração/acervo; listagem filtrável; notícia individual; agenda fictícia em lista e calendário; evento individual; busca geral; paróquia; vida de fé (sacramentos, catequese e pastorais); contato; comunidades e horários; editor local de evento.

## Próxima etapa do produto

Implementar os modelos no Payload CMS, autenticação e permissões, mídia, prévia protegida, publicação e expiração de avisos/destaques. Relacionar notícias e eventos às comunidades e pastorais. Validar conteúdos com a paróquia. Galerias, compartilhamento editorial e página anual da festa da padroeira serão construídos com os conteúdos aprovados.

## Conteúdo e operação

Notícia, evento, aviso e página institucional são modelos distintos. O editor escolhe até quatro destaques a partir desses conteúdos, com ordem e validade. No celular, a abertura prioriza banner, acessos rápidos e notícias. Liturgia direciona à fonte enquanto não houver uma integração autorizada e confiável. Não há formulários de pedidos nem transmissão fictícia.

---

# Site da Paróquia Nossa Senhora Aparecida — Jardim Ingá

## Objetivo
Oferecer uma presença digital acolhedora que ajude as pessoas a encontrar missas, participar da comunidade e falar com a secretaria. A equipe deve conseguir atualizar o conteúdo sem depender do desenvolvedor. Esta proposta é uma demonstração para apresentar à paróquia; a publicação oficial depende de validar os dados e definir quem cuidará do conteúdo.

## Escopo do lançamento

| Página | Conteúdo e função |
| --- | --- |
| Início | Foto real, apresentação breve, horários em destaque, próximos eventos, avisos e acesso à secretaria. |
| Missas e celebrações | Horários por comunidade e dia; mudanças para datas específicas; localização e contato. |
| A paróquia | História, padroeira, equipe e fotos autorizadas. |
| Comunidades | Lista e página de cada comunidade, com endereço, foto, horários e contato. |
| Pastorais e movimentos | Apresentação, como participar e contato autorizado do responsável. |
| Sacramentos e catequese | Orientações aprovadas pela secretaria e botão para conversar sobre batismo, matrimônio e catequese. |
| Agenda e notícias | Eventos futuros, notícias e galerias dentro das publicações. |
| Contato | Secretaria, atendimento, telefone, endereço, mapa e redes oficiais. |

Uma página especial da Festa da Padroeira poderá reunir programação, novena, fotos e comunicados de cada ano. O menu principal pode agrupar paróquia, comunidades e pastorais em “Nossa comunidade”, para manter a navegação curta.

## As quatro telas do protótipo

1. **Início:** mostra a direção visual e prioriza “Horários”, “Como chegar” e “Falar com a secretaria”.
2. **Horários:** demonstra filtros por local e dia, inclusive o estado sem resultados.
3. **Comunidade:** permite alternar entre comunidades e mostra onde entrarão fotos e informações confirmadas.
4. **Editor de evento:** demonstra formulário, prévia, destaque, imagem, texto alternativo e rascunho local. A ação de publicar é simulada. Não há autenticação, banco de dados ou CMS instalado nesta entrega.

Os horários estão identificados como “a confirmar”. O evento é fictício. Não foram inventadas fotos das capelas. A marca é uma proposta baseada no desenho já utilizado pela paróquia e precisa de aprovação antes do uso institucional.

## Gestão do conteúdo

Recomendação: **Next.js + Payload CMS + PostgreSQL**, hospedados por você. O painel será em português, com nomes familiares e formulários estruturados. Evitar um construtor livre de páginas: a equipe preenche título, foto, texto e datas, e o site organiza a apresentação.

| Área do painel | Campos principais |
| --- | --- |
| Dados da paróquia | Nome, contatos, endereço, atendimento, redes, apresentação e marca. |
| Comunidades | Nome, endereço, localização, foto, descrição e contato público. |
| Celebrações | Tipo, comunidade, dia da semana, hora, período de validade e observação. |
| Exceções de horários | Data, celebração correspondente, cancelamento ou horário substituto. |
| Eventos | Título, início/fim, local, descrição, imagem, inscrição externa opcional e destaque. |
| Notícias | Título, resumo, texto, capa, categoria, galeria e data de publicação. |
| Avisos | Texto curto, link opcional, início e término da exibição. |
| Pastorais e orientações | Apresentação, como participar, contatos e instruções para sacramentos. |
| Biblioteca de mídia | Arquivo, descrição alternativa, autoria/crédito e autorização de uso. |

Rascunhos e versões permitem revisar antes de publicar. A prévia autenticada será implementada no site. Perfis: administrador técnico; editor com publicação; colaborador com criação de rascunhos. As permissões serão configuradas e verificadas na implementação.

Datas e horários seguirão **America/Sao_Paulo**. Uma exceção de data terá prioridade sobre a regra semanal. Eventos passados vão para o arquivo; avisos vencidos deixam de aparecer. Conteúdo não publicado não pode ser acessado pela API pública. As páginas usam apenas informações aprovadas.

## Direção visual

- Azul principal `#123B63`: marca, títulos e botões.
- Azul da fachada `#8EB9D5`: fundos de apoio e detalhes.
- Dourado `#B9944F`: pequenos acentos.
- Branco acolhedor `#F6F4EE`: fundo principal.
- Grafite `#273541`: textos.

Títulos com serifa, textos com fonte simples e legível, fotos reais e desenho da fachada como elemento de reconhecimento. A composição deve funcionar no celular, com texto confortável, botões grandes, navegação por teclado e contraste verificado. A logo atual entregue é raster; a versão vetorial e a simplificação para tamanhos pequenos entram na finalização da identidade.

## Hospedagem e operação

Aplicação e banco em uma VPS, com HTTPS, implantação reproduzível em contêineres e volumes persistentes. Mídia local no lançamento, com possibilidade de armazenamento compatível com S3 depois. Backup automático do banco e arquivos em destino separado, com teste de restauração. Contas individuais para editores e instruções curtas de uso. Definir responsabilidade por atualizações e recuperação antes da entrega.

## Fora da primeira versão

Contas de fiéis, pedidos de oração, pagamentos, cadastro sacramental e inscrições próprias ficam para uma necessidade real posterior. Na primeira versão, contatos e inscrições podem direcionar aos canais já utilizados pela paróquia. Instagram e Facebook entram como links; o site não depende de um feed automático para funcionar.

## Conteúdo necessário para publicar

Validar nome institucional, responsável atual, endereço, contatos e atendimento. Conferir todos os horários: as páginas da Diocese consultadas divergem sobre a missa de sábado da matriz e a celebração de São Miguel. Pedir fotos das comunidades, história revisada, apresentação das pastorais, orientações dos sacramentos e autorização das imagens. Escolher pelo menos um editor e aprovar a identidade.

Fonte inicial: [página da paróquia na Diocese de Luziânia](https://diocesedeluziania.com.br/paroquias/paroquia-nossa-senhora-aparecida-2/). O dossiê anterior reúne as demais fontes; esta proposta não substitui a confirmação pela secretaria.

## Ordem de execução

1. Apresentar estas quatro telas e ajustar escopo, identidade e conteúdo com a paróquia.
2. Implementar CMS, modelos, permissões e páginas; inserir conteúdo validado.
3. Verificar celular e teclado, formulários, horários especiais, publicação/rascunhos, avisos vencidos, links, compartilhamento social, desempenho e recuperação de backup.
4. Treinar o editor, aprovar o conteúdo e publicar no domínio escolhido.

O lançamento estará pronto quando a secretaria conseguir alterar um horário, cadastrar um evento, publicar uma notícia e encerrar um aviso sem intervenção técnica; os visitantes devem encontrar horário, localização e contato facilmente pelo celular.

## Revisão visual — 12 de outubro de 2026

Referências analisadas por transcrição automática e trechos visuais no navegador:
- [Crie Sites REALMENTE Bonitos com Claude Code](https://www.youtube.com/watch?v=HtbZQaDjUvM): direção coerente com o assunto, referências, iteração e acabamento (1:41–5:24; 13:58–20:54).
- [Criei um site animado com Claude Code](https://www.youtube.com/watch?v=l22bWCZPM8Y): avaliação de hierarquia, responsividade, tipografia e movimentos; revisão dos efeitos que poluem a apresentação (9:35–13:08; 18:44–24:52).
- [Como criar site com o Codex do zero](https://www.youtube.com/watch?v=vhzPt_SBbdo): refinamento da abertura e verificação após inserir um componente visual (14:31–17:46).

Aplicação nesta proposta: fotografia real em abertura ampla com contraste para leitura; nome da paróquia e mensagem de acolhimento; três acessos rápidos; destaque específico para a missa; listas de participação em vez de cartões iguais; seção da padroeira usando a ilustração fornecida; tipografia Baskerville/Palatino com alternativas locais; cores marianas; entrada suave e revelação de seções, respeitando a preferência de movimento reduzido. Nenhuma interação exige assistir uma animação para acessar horários ou contatos. O formulário de gestão continua simples. Não foram instaladas ferramentas ou serviços indicados nos vídeos.

## História da paróquia — linha do tempo

A página `#paroquia` substitui “A nossa paróquia” por uma história visual, inspirada na linha do tempo da Catedral de Brasília. Usa HTML/CSS nativos, Poppins e Lucide, com cartões alternados no computador, coluna única no celular e navegação pelos marcos. Nenhuma dependência adicional de framework foi necessária.

O dossiê registra 1997 como criação da paróquia, sem confirmar a inauguração da construção atual. A arte da camiseta de 2025 é identificada como acervo. Outros marcos têm datas a confirmar, campos de imagem e lorem ipsum. Não foram inventadas datas de construção, primeiros párocos ou fundações de capelas.

Verificação: seis marcos, links locais sem arquivos ausentes, IDs únicos, navegação pelos marcos e celular com largura de conteúdo igual à tela. Prévia completa: `previa-historia.jpg`; prévia móvel: `previa-historia-mobile.jpg`.

## Padroeira e estrutura da paróquia — 28/10/2026

A página `#padroeira` segue a linguagem da Catedral: abertura ilustrada, linha do tempo alternada, leitura complementar e curiosidades. Os textos são resumos próprios com fontes do Santuário Nacional/A12. A coroação é apresentada em 1904 e a dedicação da nova Basílica em 1980. Os episódios específicos da história de Brasília não foram atribuídos ao Jardim Ingá. As imagens são artes já geradas para o projeto e a fotografia fornecida da matriz, com identificação.

Referências de conteúdo: https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717 e https://www.a12.com/devotos-mirins/historia-do-santuario-nacional . Referência de layout: https://catedral.org.br/institucional/padroeira/ .

Nova página `#equipe`: dois perfis em destaque e seis cartões com apresentação expansível. Pe. Inaldo José Salustiano (pároco) e Pe. Cláudio Eduardo de Faria (vigário) são listados pelo diretório diocesano consultado nesta data: https://diocesedeluziania.com.br/sacerdotes/ . Fotos e biografias são provisórias. Os demais nomes e funções estão identificados como itens a confirmar. Usa o placeholder de imagem fornecido pelo usuário, sem retratos inventados ou contatos pessoais fictícios. Referência visual: https://catedral.org.br/institucional/estrutura-da-paroquia/ .

A nova página está ligada ao menu, ao rodapé e ao cartão da Secretaria. Verificados: navegação por marcos da padroeira, expansão de apresentação, oito perfis, responsividade de ambas as páginas sem rolagem horizontal, referências locais e IDs únicos. Console sem erros nos fluxos conferidos.

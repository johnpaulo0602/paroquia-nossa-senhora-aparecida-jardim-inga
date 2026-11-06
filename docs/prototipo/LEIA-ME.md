# Atualização editorial e serviços — 28/10/2026

- Comunicação da home em bento grid com seis conteúdos iniciais e carregamento progressivo.
- Central de comunicação com carrossel, filtros Todos/Notícias/Artigos/Fotos/Vídeos e carregamento incremental. O acervo de demonstração tem dez textos e um registro fotográfico; vídeos apresentam estado vazio.
- Botão “Quero doar”. Ícones Lucide incluídos localmente, com licença ISC em `assets/LUCIDE-LICENSE.txt`.
- Campo de busca removido de toda a interface.
- Secretaria paroquial independente (`#secretaria`): atendimento, missas, confissão, localização, contatos e celebrações especiais. Dados locais a confirmar.
- Contato (`#contato`) com formulário demonstrativo e canais diretos.
- Batismo e casamento (`#vida/batismo`, `#vida/matrimonio`) com abas laterais, orientações e formulário. Navegação das abas por teclado: setas, Home e End.
- Projetos e patrocinadores fictícios, identificados como exemplos; página `#projetos`.
- Newsletter no rodapé com inscrição simulada.

Nenhum formulário transmite ou armazena dados pessoais. Não há envio de e-mail, inscrição real, reserva de data, pagamento ou vínculo com os patrocinadores fictícios. Os documentos de sacramentos não podem ser enviados neste protótipo. Requisitos, contribuições e procedimentos dependem da validação da paróquia.

Verificados: carregar mais na home; filtros e estado vazio; abas de batismo e casamento; simulação de casamento, contato e newsletter; ausência de campos de busca; ícones SVG; celular sem rolagem horizontal e console sem erros nos fluxos conferidos.

# Protótipo paroquial — redesenho de 28/10/2026

Abra `index.html` no navegador mantendo todos os arquivos e a pasta `assets` juntos. Não é necessário instalar dependências. Se a página já estiver aberta, recarregue para ver o redesenho.

## Nova direção

Referência de organização: Catedral de Brasília, adaptada para a vida paroquial do Jardim Ingá. Todas as interfaces usam Poppins sem serifa. Os dois pesos da fonte e sua licença estão incluídos em `assets/fonts`, sem dependência de serviço externo.

A abertura usa a fotografia real fornecida da matriz, seguida por acessos rápidos, comunicação, apresentação da paróquia, agenda, sacramentos, comunidades e vida cristã. O cabeçalho tem submenus e busca. O rodapé organiza as páginas por assunto.

Foram redesenhadas também a listagem e a leitura de notícias, agenda, páginas institucionais, contatos, comunidades e orientações. Há novas páginas da padroeira, contribuição, batismo e matrimônio. A página de contribuição não recebe pagamentos.

## O que experimentar

- Quatro destaques manuais na abertura: fotografia real da matriz e três ilustrações geradas por IA. O quarto banner ilustrado permanece no acervo.
- Notícias com filtro de categoria, pesquisa e página individual.
- Busca geral por notícias, comunidades, eventos e orientações.
- Agenda em lista e calendário de novembro de 2026.
- Página individual de evento e download .ics identificado como fictício.
- Páginas de paróquia, comunidades, vida de fé e contato.
- Horários com filtros por local e dia.
- Menu móvel e links diretos por endereço com #.
- Editor de evento com prévia e rascunho no navegador.

## Limites desta entrega

Este é um protótipo local. O CMS real, login, banco de dados, publicação, expiração automática de banners/avisos, integração litúrgica e gestão editorial ainda precisam ser implementados. O editor de evento não altera as notícias nem os eventos de exemplo do portal. Seus textos de rascunho ficam apenas no navegador; imagens ficam na sessão.

Os eventos são fictícios e identificados como tal. A seção Notícias contém dez textos originais curtos: nove resumos de notícias da Igreja e uma apresentação institucional, com links às fontes consultadas em 12/10/2026. As imagens geradas são identificadas como ilustrações; a apresentação da matriz usa a fotografia fornecida. Horários e contatos precisam de confirmação. A liturgia abre a Canção Nova; não copia nem importa as leituras.

## Verificação

Verificados no navegador: troca dos quatro banners; filtro combinado de categoria e assunto; notícia individual; alternância lista/calendário e abertura de evento; busca por batismo; acesso à vida de fé; menu móvel; prévia e gravação de rascunho; apresentação em 390 e 1280 pixels e ausência de rolagem horizontal no celular. O download .ics foi implementado, mas não importado em aplicativo de calendário.

`PLANO.md` descreve o projeto e a etapa atual. `previa.jpg` e `previa-mobile.jpg` mostram a apresentação.

## Pacote editorial

`conteudo.js` reúne os dez artigos e os quatro destaques utilizados pelo portal. O pacote irmão `conteudo-paroquia` contém imagens em resolução original, artigos em Markdown e JSON, duas artes para redes sociais, sugestões de legendas e os prompts da ferramenta integrada de geração de imagens. Os conteúdos são uma seleção datada, sem atualização automática.

## Verificação deste redesenho

Verificados no navegador: navegação principal, submenu da paróquia, fechamento do menu móvel ao navegar, página da padroeira, orientação de batismo, busca de notícias e abertura de artigo, troca de destaque e apresentação móvel. A largura de conteúdo móvel coincide com a tela, sem rolagem horizontal. Nenhum erro foi registrado no console durante os fluxos conferidos. Referências de arquivos locais e IDs também foram conferidos.

Prévias atualizadas: `previa.jpg`, `previa-mobile.jpg`, `previa-noticia.jpg` e `previa-completa.jpg`.

## História da paróquia — linha do tempo

A página `#paroquia` substitui “A nossa paróquia” por uma história visual, inspirada na linha do tempo da Catedral de Brasília. Usa HTML/CSS nativos, Poppins e Lucide, com cartões alternados no computador, coluna única no celular e navegação pelos marcos. Nenhuma dependência adicional de framework foi necessária.

O dossiê registra 1997 como criação da paróquia, sem confirmar a inauguração da construção atual. A arte da camiseta de 2025 é identificada como acervo. Outros marcos têm datas a confirmar, campos de imagem e lorem ipsum. Não foram inventadas datas de construção, primeiros párocos ou fundações de capelas.

Verificação: seis marcos, links locais sem arquivos ausentes, IDs únicos, navegação pelos marcos e celular com largura de conteúdo igual à tela. Prévia completa: `previa-historia.jpg`; prévia móvel: `previa-historia-mobile.jpg`.

## Padroeira e estrutura da paróquia — 28/10/2026

A página `#padroeira` segue a linguagem da Catedral: abertura ilustrada, linha do tempo alternada, leitura complementar e curiosidades. Os textos são resumos próprios com fontes do Santuário Nacional/A12. A coroação é apresentada em 1904 e a dedicação da nova Basílica em 1980. Os episódios específicos da história de Brasília não foram atribuídos ao Jardim Ingá. As imagens são artes já geradas para o projeto e a fotografia fornecida da matriz, com identificação.

Referências de conteúdo: https://www.a12.com/santuario/historia-de-nossa-senhora-aparecida-1717 e https://www.a12.com/devotos-mirins/historia-do-santuario-nacional . Referência de layout: https://catedral.org.br/institucional/padroeira/ .

Nova página `#equipe`: dois perfis em destaque e seis cartões com apresentação expansível. Pe. Inaldo José Salustiano (pároco) e Pe. Cláudio Eduardo de Faria (vigário) são listados pelo diretório diocesano consultado nesta data: https://diocesedeluziania.com.br/sacerdotes/ . Fotos e biografias são provisórias. Os demais nomes e funções estão identificados como itens a confirmar. Usa o placeholder de imagem fornecido pelo usuário, sem retratos inventados ou contatos pessoais fictícios. Referência visual: https://catedral.org.br/institucional/estrutura-da-paroquia/ .

A nova página está ligada ao menu, ao rodapé e ao cartão da Secretaria. Verificados: navegação por marcos da padroeira, expansão de apresentação, oito perfis, responsividade de ambas as páginas sem rolagem horizontal, referências locais e IDs únicos. Console sem erros nos fluxos conferidos.

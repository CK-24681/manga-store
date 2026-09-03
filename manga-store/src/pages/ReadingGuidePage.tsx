import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, BookOpen, Clock, Film, CheckCircle2, ChevronRight,
  Bookmark, ArrowRight, X, Star, Loader2, BookMarked, Tv2, Info,
} from 'lucide-react';
import { MangaItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ReadingGuidePageProps {
  onSelectManga: (manga: MangaItem) => void;
}

interface GuideEntry {
  chronology: string;
  arcs: Array<{
    name: string;
    volumes: string;
    episodes: string;
    summary: string;
  }>;
  tips: string[];
  animeNote: string;
}

const VERIFIED_GUIDES: Record<string, GuideEntry> = {
  'one piece': {
    chronology: 'Saga do Leste Azul (Vol. 1–12) → Saga Alabasta (Vol. 12–24) → Saga Skypiea (Vol. 24–32) → Saga Water 7 & Enies Lobby (Vol. 32–46) → Saga Thriller Bark (Vol. 46–50) → Saga Guerra dos Maiorais / Marineford (Vol. 50–60) → Saga Ilha dos Homens-Peixe (Vol. 61–66) → Saga Aliança Pirata / Dressrosa (Vol. 66–80) → Saga Ilha Whole Cake (Vol. 81–90) → Saga País de Wano (Vol. 90–105) → Saga Final / Egghead (Vol. 106+)',
    arcs: [
      { name: 'Saga do Leste Azul', volumes: 'Vol. 1–12', episodes: 'Ep. 1–61', summary: 'Monkey D. Luffy inicia sua jornada pelos mares, reunindo os primeiros membros do Bando do Chapéu de Palha: Zoro, Nami, Usopp e Sanji, antes de zarpar rumo à perigosa Grand Line.' },
      { name: 'Saga de Alabasta / Baroque Works', volumes: 'Vol. 12–24', episodes: 'Ep. 62–135', summary: 'O bando entra na Grand Line ao lado da Princesa Nefertari Vivi para deter a guerra civil e desmascarar a conspiração criminosa Baroque Works, liderada por Sir Crocodile.' },
      { name: 'Saga de Skypiea (Ilha do Céu)', volumes: 'Vol. 24–32', episodes: 'Ep. 144–195', summary: 'Em busca da lendária cidade de ouro acima das nuvens, os Chapéus de Palha desafiam o céu e enfrentam o autoproclamado deus Enel em Skypiea.' },
      { name: 'Saga Water 7 & Enies Lobby', volumes: 'Vol. 32–46', episodes: 'Ep. 229–325', summary: 'A lealdade do bando é posta à prova extrema em Water 7. Luffy declara guerra aberta contra o Governo Mundial em Enies Lobby para resgatar Nico Robin.' },
      { name: 'Saga Thriller Bark', volumes: 'Vol. 46–50', episodes: 'Ep. 337–381', summary: 'A tripulação adentra a névoa do Triângulo Florian e se vê presa no navio-ilha de zumbis do Shichibukai Gecko Moria, conhecendo o músico Brook.' },
      { name: 'Saga da Guerra dos Maiorais (Marineford)', volumes: 'Vol. 50–60', episodes: 'Ep. 385–516', summary: 'Após o bando ser dispersado no Arquipélago Sabaody, Luffy invade a prisão submarina de Impel Down e a base de Marineford para tentar resgatar seu irmão Portgas D. Ace.' },
      { name: 'Saga da Ilha dos Homens-Peixe', volumes: 'Vol. 61–66', episodes: 'Ep. 517–574', summary: 'Dois anos após os eventos de Marineford, o bando reunido submerge 10.000 metros abaixo do mar rumo ao Novo Mundo, enfrentando preconceito racial e Hody Jones.' },
      { name: 'Saga de Dressrosa & Punk Hazard', volumes: 'Vol. 66–80', episodes: 'Ep. 579–746', summary: 'Luffy firma aliança pirata com Trafalgar Law em Punk Hazard e parte para Dressrosa com a missão de destronar o tirano Donquixote Doflamingo.' },
      { name: 'Saga da Ilha Whole Cake', volumes: 'Vol. 81–90', episodes: 'Ep. 783–877', summary: 'Equipe de resgate viaja até o território da Imperatriz Yonkou Big Mom para resgatar Sanji de um casamento político arranjado com a família Vinsmoke.' },
      { name: 'Saga do País de Wano', volumes: 'Vol. 90–105', episodes: 'Ep. 892–1085', summary: 'A épica guerra civil e a invasão de Onigashima para libertar a nação de Wano do jugo dos Yonkous Kaido e Big Mom, culminando no despertar do Gear 5 (Deus do Sol Nika).' },
      { name: 'Saga Final / Ilha de Egghead', volumes: 'Vol. 106+', episodes: 'Ep. 1086+', summary: 'O bando desembarca na ilha tecnológica do Dr. Vegapunk, desencadeando revelações monumentais sobre o Século Perdido e o início do clímax definitivo de One Piece.' },
    ],
    tips: [
      'One Piece conta atualmente com mais de 108 volumes publicados e mais de 1120 capítulos.',
      'A série é dividida em 11 sagas oficiais canônicas.',
      'Pule os episódios puramente filler do anime (ex: Ep. 131–143, 196–206, 326–335) para manter o ritmo narrativo perfeito.',
      'A edição oficial brasileira em mangá é publicada pela Panini Comics.',
    ],
    animeNote: 'Anime disponível com legendas e dublagem no Crunchyroll e Netflix. Adaptação fiel com mais de 1100 episódios.',
  },

  'naruto': {
    chronology: 'Naruto Clássico — País das Ondas (Vol. 1–4) → Exame Chunin (Vol. 4–13) → Invasão de Konoha (Vol. 13–16) → Busca por Tsunade (Vol. 16–19) → Resgate de Sasuke (Vol. 20–27) → Naruto Shippuden — Resgate do Kazekage (Vol. 28–32) → Hidan e Kakuzu (Vol. 35–38) → Invasão de Pain (Vol. 44–48) → Reunião dos Cinco Kages (Vol. 48–52) → 4ª Grande Guerra Ninja (Vol. 52–72)',
    arcs: [
      { name: 'Prólogo & País das Ondas', volumes: 'Vol. 1–4', episodes: 'Ep. 1–19', summary: 'Formação do Time 7 com Kakashi, Naruto, Sasuke e Sakura. A primeira missão de risco mortal escoltando Tazuna e enfrentando Zabuza Momochi e Haku.' },
      { name: 'Exame Chunin & Esmagamento de Konoha', volumes: 'Vol. 4–16', episodes: 'Ep. 20–80', summary: 'Testes de sobrevivência na Floresta da Morte, a marca da maldição de Orochimaru e a traição de Sunagakure durante o torneio final.' },
      { name: 'Busca por Tsunade', volumes: 'Vol. 16–19', episodes: 'Ep. 81–100', summary: 'Jiraiya e Naruto partem para convencer a lendária médica Tsunade a assumir o posto de Quinta Hokage, enquanto Naruto aprende o Rasengan.' },
      { name: 'Resgate de Sasuke', volumes: 'Vol. 20–27', episodes: 'Ep. 107–135', summary: 'Sasuke abandona a aldeia seduzido pelo poder de Orochimaru. Shikamaru lidera uma equipe de gennins em uma perseguição dramática até o Vale do Fim.' },
      { name: 'Shippuden: Resgate do Kazekage', volumes: 'Vol. 28–32', episodes: 'Shippuden Ep. 1–32', summary: 'Após 2 anos e meio de treinamento, Naruto retorna a Konoha e corre contra o tempo para salvar Gaara das garras da organização terrorista Akatsuki.' },
      { name: 'Shippuden: Batalha contra Pain', volumes: 'Vol. 44–48', episodes: 'Shippuden Ep. 152–175', summary: 'Após a morte de Jiraiya, Pain ataca e destrói Konoha. Naruto domina o Modo Sábio no Monte Myoboku e retorna para a batalha mais emblemática da saga.' },
      { name: 'Shippuden: Quarta Grande Guerra Ninja', volumes: 'Vol. 52–72', episodes: 'Shippuden Ep. 261–479', summary: 'As Cinco Grandes Nações se unem na Força Aliada Shinobi para combater o Exército de Zetsus, os ninjas ressuscitados pelo Edo Tensei, Madara e Kaguya.' },
    ],
    tips: [
      'Naruto é uma obra completa composta por exatamente 72 volumes e 700 capítulos.',
      'No anime clássico, os episódios 136 a 220 são completamente filler e podem ser pulados diretamente para o início de Shippuden.',
      'Em Shippuden, os arcos canônicos essenciais são Pain, Reunião dos Kages e a Guerra Ninja.',
    ],
    animeNote: 'Série completa disponível no Crunchyroll e Netflix. Para melhor experiência, consulte um guia de episódios canônicos.',
  },

  'attack on titan': {
    chronology: 'Queda de Shiganshina & Batalha de Trost (Vol. 1–4) → Titã Fêmea (Vol. 4–8) → Investida dos Titãs / Castelo Utgard (Vol. 9–12) → Insurreição / Golpe de Estado (Vol. 13–17) → Retorno a Shiganshina (Vol. 18–22) → Saga de Marley (Vol. 23–26) → Guerra em Paradis & O Estrondo (Vol. 27–34)',
    arcs: [
      { name: 'Queda de Shiganshina & Batalha de Trost', volumes: 'Vol. 1–4', episodes: 'T1 Ep. 1–13', summary: 'O Titã Colossal destrói a Muralha Maria e Eren Yeager presencia sua mãe sendo devorada. Anos depois, ele descobre sua habilidade de se transformar em Titã.' },
      { name: '57ª Expedição & Titã Fêmea', volumes: 'Vol. 4–8', episodes: 'T1 Ep. 14–25', summary: 'A Divisão de Reconhecimento parte para capturar uma anômala Titã Fêmea inteligente que persegue Eren implacavelmente no Distrito de Stohess.' },
      { name: 'Investida dos Titãs / Queda da Muralha Rose', volumes: 'Vol. 9–12', episodes: 'T2 Ep. 26–37', summary: 'Titãs surgem misteriosamente dentro da Muralha Rose, revelando as identidades chocantes do Titã Blindado e do Titã Colossal no alto da muralha.' },
      { name: 'Arco da Insurreição (Golpe de Estado)', volumes: 'Vol. 13–17', episodes: 'T3 Ep. 38–49', summary: 'Levi e o Esquadrão enfrentam a Polícia Militar e desvendam os segredos da verdadeira linhagem real da família Reiss e a origem dos Titãs.' },
      { name: 'Retorno a Shiganshina', volumes: 'Vol. 18–22', episodes: 'T3 Ep. 50–59', summary: 'A batalha desesperada para selar a Muralha Maria contra o Titã Bestial e a tão esperada abertura do porão da família Yeager.' },
      { name: 'Saga de Marley', volumes: 'Vol. 23–26', episodes: 'T4 Ep. 60–75', summary: 'A perspectiva da narrativa vira para o continente exterior de Marley, mostrando a vida dos guerreiros Eldianos antes do ataque surpresa de Eren em Liberio.' },
      { name: 'O Estrondo (The Rumbling)', volumes: 'Vol. 27–34', episodes: 'T4 Especiais Finais', summary: 'Eren ativa o despertar de milhões de Titãs Colossais adormecidos nas muralhas para marchar sobre o globo, forçando amigos e inimigos a se aliarem.' },
    ],
    tips: [
      'Obra concluída com 34 volumes e 139 capítulos escritos e desenhados por Hajime Isayama.',
      'Não há conteúdo filler nem no mangá nem no anime.',
      'Recomenda-se ler em ordem sequencial estrita sem pesquisar termos para evitar grandes reviravoltas da trama.',
    ],
    animeNote: 'Anime com animação dos estúdios Wit Studio (Temporadas 1–3) e MAPPA (Temporada Final), disponível na Crunchyroll.',
  },

  'demon slayer': {
    chronology: 'Seleção Final (Vol. 1–2) → Monte Natagumo (Vol. 4–6) → Trem do Infinito (Vol. 7–8) → Distrito do Entretenimento (Vol. 9–11) → Vila dos Ferreiros (Vol. 12–15) → Treinamento dos Hashiras (Vol. 15–16) → Castelo Infinito (Vol. 16–23)',
    arcs: [
      { name: 'Seleção Final & Primeiras Missões', volumes: 'Vol. 1–3', episodes: 'T1 Ep. 1–14', summary: 'O massacre da família Kamado, o treinamento rigoroso de Tanjiro com Urokodaki na Montanha Sagiri e sua sobrevivência na Seleção Final.' },
      { name: 'Monte Natagumo & Reunião dos Hashiras', volumes: 'Vol. 4–6', episodes: 'T1 Ep. 15–26', summary: 'Tanjiro, Zenitsu e Inosuke enfrentam a temível família de aranhas do Lua Inferior Rui, culminando no despertar da Respiração do Deus do Fogo (Hinokami Kagura).' },
      { name: 'Trem do Infinito (Mugen Train)', volumes: 'Vol. 7–8', episodes: 'Filme / T2 Ep. 1–7', summary: 'Ao lado do Hashira das Chamas, Kyojuro Rengoku, os jovens caçadores investigam o desaparecimento em massa de passageiros a bordo de uma locomotiva possuída.' },
      { name: 'Distrito do Entretenimento', volumes: 'Vol. 9–11', episodes: 'T2 Ep. 8–18', summary: 'Infiltração no bairro das gueixas com o Hashira do Som, Tengen Uzui, em uma batalha de tirar o fôlego contra os irmãos Luas Superiores Daki e Gyutaro.' },
      { name: 'Vila dos Ferreiros', volumes: 'Vol. 12–15', episodes: 'T3 Ep. 1–11', summary: 'Tanjiro viaja à vila secreta onde as espadas Nichirin são forjadas, lutando com Muichiro Tokito e Mitsuri Kanroji contra Hantengu e Gyokko.' },
      { name: 'Castelo Infinito & Clímax Final', volumes: 'Vol. 16–23', episodes: 'Trilogia de Filmes (Cinema)', summary: 'A invasão ao Castelo Infinito dimensional para a ofensiva final contra as Luas Superiores restantes e o criador de todos os demônios, Muzan Kibutsuji.' },
    ],
    tips: [
      'Mangá completo com exatamente 23 volumes e 205 capítulos.',
      'O filme Mugen Train é 100% canônico e obrigatório antes de prosseguir na história.',
      'Publicado no Brasil em edição tankobon completa pela Panini Comics.',
    ],
    animeNote: 'Produzido pelo consagrado estúdio ufotable com qualidade de animação incomparável. Disponível na Netflix e Crunchyroll.',
  },

  'jujutsu kaisen': {
    chronology: 'Introdução & Dedos de Sukuna (Vol. 1–2) → Treinamento & Mahito (Vol. 3–4) → Intercâmbio de Kyoto (Vol. 4–6) → Passado de Gojo (Vol. 8–9) → Incidente de Shibuya (Vol. 10–16) → Jogo do Abate (Vol. 17–25) → Batalha de Shinjuku (Vol. 26–30)',
    arcs: [
      { name: 'Introdução & O Útero Amaldiçoado', volumes: 'Vol. 1–2', episodes: 'T1 Ep. 1–8', summary: 'Yuji Itadori engole o dedo de Ryomen Sukuna e é admitido na Escola Jujutsu ao lado de Megumi Fushiguro e Nobara Kugisaki.' },
      { name: 'Intercâmbio com Kyoto', volumes: 'Vol. 4–6', episodes: 'T1 Ep. 14–21', summary: 'Competição entre as filiais de Tóquio e Kyoto interrompida por uma invasão de Espíritos Amaldiçoados de Grau Especial liderados por Hanami.' },
      { name: 'Passado de Gojo (Inventário Oculto)', volumes: 'Vol. 8–9', episodes: 'T2 Ep. 1–5', summary: 'Ano de 2006: Satoru Gojo e Suguru Geto são incumbidos de proteger o Receptáculo de Plasma Estelar, confrontando Toji Fushiguro.' },
      { name: 'O Incidente de Shibuya', volumes: 'Vol. 10–16', episodes: 'T2 Ep. 6–23', summary: 'A operação terrorista das maldições na noite de Halloween em Shibuya para selar Satoru Gojo no Reino da Prisão, mudando para sempre o Japão.' },
      { name: 'Jogo do Abate (Culling Game)', volumes: 'Vol. 17–25', episodes: 'Temporada 3 (Em Produção)', summary: 'Kenjaku força o Japão inteiro em um torneio de sobrevivência sangrento entre feiticeiros antigos ressuscitados e novatos.' },
      { name: 'Batalha Decisiva em Shinjuku', volumes: 'Vol. 26–30', episodes: 'Conclusão do Mangá', summary: 'O confronto dos mais fortes: Gojo vs Sukuna no clímax do jujutsu moderno com consecutivas Expansões de Domínio e o destino da humanidade.' },
    ],
    tips: [
      'Mangá concluído oficialmente em 2024 com 30 volumes e 271 capítulos.',
      'Leia o volume especial "Jujutsu Kaisen 0" (história de Yuta Okkotsu) antes do arco de Shibuya.',
      'Preste atenção aos sistemas de Restrição Celestial e Votos Vinculativos.',
    ],
    animeNote: 'Animação produzida pelo estúdio MAPPA, com duas temporadas e o filme 0 disponíveis na Crunchyroll.',
  },

  'berserk': {
    chronology: 'O Espadachim Negro (Vol. 1–3) → A Era de Ouro (Vol. 3–14) → Condenação (Vol. 14–21) → O Falcão do Milênio (Vol. 22–35) → Fantasia (Vol. 35–42+)',
    arcs: [
      { name: 'O Espadachim Negro', volumes: 'Vol. 1–3', episodes: 'Anime 1997 / 2016', summary: 'Introdução brutal de Guts caçando apóstolos e revelando a Marca do Sacrifício que atrai espíritos malignos todas as noites.' },
      { name: 'A Era de Ouro & O Eclipse', volumes: 'Vol. 3–14', episodes: 'Filmes 2012 / Anime 1997', summary: 'O passado de Guts no exército de mercenários do Bando do Falcão ao lado de Griffith e Casca, culminando na traição trágica do Eclipse.' },
      { name: 'Arco da Condenação', volumes: 'Vol. 14–21', episodes: 'Anime 2016 (Parcial)', summary: 'Guts chega à Torre da Convicção na Terra Santa de Albion para resgatar Casca das garras dos inquisidores fanáticos de Mozgus.' },
      { name: 'O Falcão do Milênio', volumes: 'Vol. 22–35', episodes: 'Sem adaptação fiel', summary: 'Guts adquire a lendária Armadura Berserker e viaja com um novo grupo em busca da ilha dos elfos de Skellig para restaurar a mente de Casca.' },
      { name: 'Arco Fantasia', volumes: 'Vol. 35–42+', episodes: 'Em publicação', summary: 'A fusão entre os mundos astral e físico transforma a Terra em um reino de mitos e monstros governado pelo novo império de Falconia.' },
    ],
    tips: [
      'Obra-prima de fantasia sombria criada por Kentaro Miura, continuada pelo Studio Gaga e Kouji Mori.',
      'Classificação indicativa estrita para maiores de 18 anos por conter violência gráfica e nudez.',
      'Recomenda-se a edição brasileira Berserk Deluxe ou edições tankobon da Panini.',
    ],
    animeNote: 'A trilogia de filmes "Era de Ouro" (2012–2013) é a adaptação audiovisual mais recomendada para novos leitores.',
  },

  'chainsaw man': {
    chronology: 'Parte 1: Saga da Segurança Pública (Vol. 1–11) → Parte 2: Saga da Vida Escolar (Vol. 12+)',
    arcs: [
      { name: 'Segurança Pública & Demônio Katana', volumes: 'Vol. 1–5', episodes: 'T1 Ep. 1–12', summary: 'Denji renasce com o coração de Pochita e começa a trabalhar na Divisão Especial sob as ordens misteriosas de Makima.' },
      { name: 'Demônio Bomba (Reze)', volumes: 'Vol. 5–6', episodes: 'Filme anunciado (Cinema)', summary: 'Denji conhece uma doce garota chamada Reze em uma cafeteria, sem desconfiar que ela esconde a forma do letal Demônio Bomba.' },
      { name: 'Assassinos Internacionais & Demônio da Arma', volumes: 'Vol. 7–11', episodes: 'Sem adaptação anime ainda', summary: 'Assassinos de elite do mundo inteiro viajam ao Japão com o objetivo de capturar o coração de Denji, revelando a verdadeira face de Makima.' },
      { name: 'Parte 2: Vida Escolar & Demônio da Guerra', volumes: 'Vol. 12+', episodes: 'Em publicação no mangá', summary: 'A estudante Asa Mitaka faz um pacto com o Demônio da Guerra (Yoru) para caçar o Chainsaw Man, que agora é uma celebridade pública.' },
    ],
    tips: [
      'A Parte 1 é completa e fechada nos primeiros 11 volumes.',
      'A Parte 2 está em publicação semanal e introduz uma nova protagonista.',
      'Subversão constante dos tropos habituais de mangás shonen.',
    ],
    animeNote: 'Primeira temporada animada pelo estúdio MAPPA disponível no Crunchyroll com dublagem em português.',
  },

  'solo leveling': {
    chronology: 'Dungeon Dupla & Despertar (Cap. 1–10) → Dungeons & Reclassificação (Cap. 11–60) → Ilha de Jeju (Cap. 90–110) → Guerra dos Monarcas (Cap. 111–179)',
    arcs: [
      { name: 'Dungeon Dupla & O Despertar do Sistema', volumes: 'Vol. 1–2', episodes: 'T1 Ep. 1–7', summary: 'O caçador Rank E Sung Jin-Woo é abandonado para morrer em uma masmorra e desperta um sistema exclusivo de RPG que só ele enxerga.' },
      { name: 'Subida de Rank & Castelo Demoníaco', volumes: 'Vol. 3–6', episodes: 'T1 Ep. 8–12', summary: 'Jin-Woo evolui em segredo para a classe Necromante, criando seu exército de sombras com os soldados que ele derrota.' },
      { name: 'A Crise da Ilha de Jeju', volumes: 'Vol. 7–9', episodes: 'Temporada 2', summary: 'Formigas monstruosas dizimam a equipe de caçadores de Rank S coreanos e japoneses, forçando Jin-Woo a intervir com seu exército.' },
      { name: 'Guerra entre Monarcas e Soberanos', volumes: 'Vol. 10–14', episodes: 'Clímax do Manhwa', summary: 'As entidades mais antigas do cosmos colidem contra a Terra, revelando a identidade original do Monarca das Sombras herdada por Jin-Woo.' },
    ],
    tips: [
      'História completa de manhwa com 179 capítulos coloridos.',
      'Arte de tirar o fôlego desenhada pelo falecido artista DUBU (Redice Studio).',
      'Edição impressa em formato livro lançada no Brasil pela Panini.',
    ],
    animeNote: 'Produzido pela A-1 Pictures, disponível na Crunchyroll com primeira temporada completa e sequência garantida.',
  },

  'death note': {
    chronology: 'Fase 1: L vs Kira (Vol. 1–7) → Fase 2: O Sucessor de L (Near & Mello) (Vol. 7–12)',
    arcs: [
      { name: 'Duelo de Intelectos: Light vs L', volumes: 'Vol. 1–7', episodes: 'Ep. 1–25', summary: 'Light Yagami e o lendário detetive L travam uma monumental batalha de raciocínio, dedução e xadrez mental após as mortes inexplicáveis de criminosos.' },
      { name: 'Segunda Fase: Near & Mello', volumes: 'Vol. 7–12', episodes: 'Ep. 26–37', summary: 'Anos após o desfecho da primeira fase, os prodígios do orfanato Wammy\'s House, Near e Mello, fecham o cerco contra a identidade secreta de Kira.' },
    ],
    tips: [
      'Mangá finalizado com exatamente 12 volumes e 108 capítulos.',
      'Uma das narrativas de suspense e suspense psicológico mais aclamadas da história dos quadrinhos.',
      'Disponível no Brasil em edição Black Edition (volumes duplos) pela Editora JBC.',
    ],
    animeNote: 'Anime clássico de 37 episódios produzido pelo estúdio Madhouse, disponível em quase todos os serviços de streaming.',
  },

  'hunter x hunter': {
    chronology: 'Exame Hunter (Vol. 1–5) → Arena Celestial (Vol. 5–7) → Leilão de Yorknew (Vol. 8–13) → Greed Island (Vol. 13–18) → Formigas Quimera (Vol. 18–30) → Eleição do Presidente (Vol. 30–32) → Guerra de Sucessão (Vol. 32+)',
    arcs: [
      { name: 'Exame Hunter & Família Zoldyck', volumes: 'Vol. 1–5', episodes: 'Ep. 1–25', summary: 'Gon Freecss deixa a Ilha da Baleia para prestar o arriscado Exame Hunter, conhecendo Kurapika, Leorio e o assassino prodígio Killua.' },
      { name: 'Arena Celestial & Introdução ao Nen', volumes: 'Vol. 5–7', episodes: 'Ep. 26–36', summary: 'Gon e Killua sobem os andares de um edifício de lutas e aprendem os quatro princípios fundamentais da energia vital Nen com Wing.' },
      { name: 'Leilão de Yorknew & A Trupe Fantasma', volumes: 'Vol. 8–13', episodes: 'Ep. 37–58', summary: 'Kurapika busca vingança contra os criminosos Genei Ryodan que massacraram seu clã, em um dos melhores arcos urbanos já escritos.' },
      { name: 'Greed Island', volumes: 'Vol. 13–18', episodes: 'Ep. 59–75', summary: 'Gon e Killua ingressam no jogo virtual de vida ou morte criado pelo pai de Gon, treinando sob a tutela da mestra Biscuit Krueger.' },
      { name: 'Formigas Quimera (Chimera Ants)', volumes: 'Vol. 18–30', episodes: 'Ep. 76–136', summary: 'Insetos mutantes devoram humanos e evoluem para predadores com Nen, culminando no confronto entre o Presidente Netero e o Rei Meruem.' },
      { name: 'Expedição ao Continente Negro & Guerra de Sucessão', volumes: 'Vol. 32+', episodes: 'Sem adaptação anime', summary: 'Príncipes do Império Kakin disputam o trono em um navio colossal a caminho do Continente Negro, com Kurapika no centro do conflito.' },
    ],
    tips: [
      'Obra-prima de Yoshihiro Togashi com sistema de batalha (Nen) considerado o mais sofisticado dos animes.',
      'O arco das Formigas Quimera é reverenciado pela crítica internacional por sua densidade filosófica.',
      'Publicação em andamento conforme a saúde do autor permite.',
    ],
    animeNote: 'O anime de 2011 (Madhouse, 148 episódios) adapta com perfeição até o arco da Eleição. Disponível na Netflix e Crunchyroll.',
  },

  'fullmetal alchemist': {
    chronology: 'Em Busca da Pedra Filosofal (Vol. 1–3) → Laboratório 5 & Homúnculos (Vol. 4–7) → Central & Xing (Vol. 8–15) → Fortaleza de Briggs (Vol. 16–20) → O Dia Prometido (Vol. 21–27)',
    arcs: [
      { name: 'Início & O Tabu da Transmutação', volumes: 'Vol. 1–3', episodes: 'Brotherhood Ep. 1–10', summary: 'Edward e Alphonse Elric perdem seus corpos ao tentar ressuscitar a mãe e partem pelo país como cães do exército.' },
      { name: 'Os Homúnculos & Conspiração Militar', volumes: 'Vol. 4–7', episodes: 'Brotherhood Ep. 11–19', summary: 'A descoberta do Laboratório 5 e a verdade aterradora de que a Pedra Filosofal exige vidas humanas como matéria-prima.' },
      { name: 'Fortaleza de Briggs & Olivier Armstrong', volumes: 'Vol. 16–20', episodes: 'Brotherhood Ep. 39–49', summary: 'Os irmãos viajam à fronteira gelada do norte para investigar o círculo de transmutação nacional cavado sob o país.' },
      { name: 'O Dia Prometido & Batalha Final', volumes: 'Vol. 21–27', episodes: 'Brotherhood Ep. 50–64', summary: 'A convergência de todos os personagens e aliados em Central durante um eclipse solar para derrotar o Pai e salvar a humanidade.' },
    ],
    tips: [
      'História 100% concluída em 27 volumes perfeitamente amarrados sem furos de roteiro.',
      'Considere assistir "Fullmetal Alchemist: Brotherhood", que segue fielmente o mangá original.',
      'Publicado no Brasil pela Editora JBC.',
    ],
    animeNote: 'Fullmetal Alchemist: Brotherhood (64 episódios) é classificado consistentemente entre os melhores animes de todos os tempos.',
  },

  'dragon ball': {
    chronology: 'Busca pelas Esferas & Torneios (Vol. 1–16) → Saga dos Saiyajins (Vol. 17–20) → Saga de Freeza (Vol. 21–28) → Saga dos Androides & Cell (Vol. 28–35) → Saga de Majin Boo (Vol. 36–42)',
    arcs: [
      { name: 'Infância de Goku & Exército Red Ribbon', volumes: 'Vol. 1–16', episodes: 'DB Clássico Ep. 1–153', summary: 'Goku conhece Bulma e Mestre Kame, treina o Kamehameha e participa de torneios mundiais antes de derrotar Piccolo Daimaoh.' },
      { name: 'Saga dos Saiyajins', volumes: 'Vol. 17–20', episodes: 'DBZ Ep. 1–35', summary: 'Raditz revela a origem alienígena de Goku, levando à chegada de Nappa e do Príncipe dos Saiyajins, Vegeta, à Terra.' },
      { name: 'Saga de Freeza em Namekusei', volumes: 'Vol. 21–28', episodes: 'DBZ Ep. 36–107', summary: 'Gohan, Kuririn e Goku viajam ao planeta natal de Piccolo para encontrar as Esferas originais, despertando a lenda do Super Saiyajin.' },
      { name: 'Saga dos Androides & Jogos de Cell', volumes: 'Vol. 28–35', episodes: 'DBZ Ep. 118–194', summary: 'Trunks do Futuro alerta sobre a ameaça biológica criada pelo Dr. Gero, forçando Gohan a ultrapassar os limites em Super Saiyajin 2.' },
      { name: 'Saga de Majin Boo', volumes: 'Vol. 36–42', episodes: 'DBZ Ep. 200–291', summary: 'O mago Babidi desperta o demônio ancestral Majin Boo, exigindo a Fusão e a lendária Genki Dama universal para salvar o cosmos.' },
    ],
    tips: [
      'Mangá seminal com 42 volumes criado pelo lendário Akira Toriyama.',
      'Base para praticamente todos os shonens de batalha modernos.',
      'Publicado no Brasil em várias edições completas pela Panini.',
    ],
    animeNote: 'Dividido na televisão em Dragon Ball (infância) e Dragon Ball Z (fase adulta). Versão "Dragon Ball Kai" elimina todos os fillers.',
  },
};

function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
}

function findGuide(manga: MangaItem): GuideEntry | null {
  const norm = normalizeTitle(manga.title);
  for (const key of Object.keys(VERIFIED_GUIDES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return VERIFIED_GUIDES[key];
    }
  }
  return null;
}

export const ReadingGuidePage: React.FC<ReadingGuidePageProps> = ({ onSelectManga }) => {
  const { t, formatPrice, translateFormat } = useLanguage();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MangaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selected, setSelected] = useState<MangaItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams({ q: q.trim(), limit: '12' });
      const res = await fetch(`/api/manga?${params.toString()}`);
      const data = await res.json();
      const list: MangaItem[] = data.data ?? [];
      setResults(list);
      if (list.length > 0) setSelected(list[0]);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsSearching(true);
      try {
        const res = await fetch('/api/manga?limit=12&sortBy=rank');
        const data = await res.json();
        const list: MangaItem[] = data.data ?? [];
        setResults(list);
        if (list.length > 0) setSelected(list[0]);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    load();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) doSearch(query);
  };

  const guide = selected ? findGuide(selected) : null;

  return (
    <div className="min-h-screen bg-[#EAEDED] font-sans">
      {/* ── Page Header ── */}
      <div className="bg-[#131921] text-white py-8 px-3 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <BookMarked className="w-7 h-7 text-[#FF9900]" />
            <h1 className="text-2xl sm:text-3xl font-black">
              Guia de Leitura & Ordem Cronológica
            </h1>
          </div>
          <p className="text-gray-400 text-sm mb-5">
            Pesquise qualquer mangá para consultar a ordem cronológica, divisão oficial de sagas, equivalência com os episódios do anime e dicas de colecionador.
          </p>
          <form onSubmit={handleSubmit} className="flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                id="reading-guide-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar mangá... (ex: One Piece, Naruto, Bleach, Berserk, Jujutsu Kaisen)"
                className="w-full pl-9 pr-10 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900] placeholder-gray-400"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit" className="bg-[#FF9900] hover:bg-[#e68a00] text-black font-bold px-5 py-3 rounded-lg transition-colors flex items-center gap-2 text-sm cursor-pointer">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Buscar
            </button>
          </form>

          {/* Popular Series Suggestion Chips */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-gray-400 font-semibold">Séries Populares:</span>
            {['One Piece', 'Berserk', 'Naruto', 'Attack on Titan', 'Jujutsu Kaisen', 'Demon Slayer', 'Chainsaw Man'].map((title) => (
              <button
                key={title}
                type="button"
                onClick={() => {
                  setQuery(title);
                  doSearch(title);
                }}
                className="text-xs bg-white/10 hover:bg-[#FF9900] hover:text-black text-gray-200 px-3 py-1 rounded-full transition-all cursor-pointer border border-white/20 active:scale-95"
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        {isSearching ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#FF9900]" />
            <p className="text-sm font-medium">Buscando informações oficiais do mangá...</p>
          </div>
        ) : results.length === 0 && hasSearched ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500">
            <BookOpen className="w-12 h-12 text-gray-300" />
            <p className="font-medium">Nenhum mangá encontrado para sua busca.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left panel: Manga selection */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {hasSearched ? `${results.length} título(s) encontrado(s)` : 'Títulos Populares'}
                  </h2>
                </div>
                <ul className="divide-y divide-gray-100 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {results.map((m) => {
                    const hasDetail = !!findGuide(m);
                    return (
                      <li key={m.id}>
                        <button
                          onClick={() => setSelected(m)}
                          className={`w-full text-left p-3 flex items-center gap-3 transition-colors hover:bg-amber-50 cursor-pointer ${selected?.id === m.id ? 'bg-amber-50 border-l-4 border-[#FF9900]' : 'border-l-4 border-transparent'}`}
                        >
                          <img src={m.coverImage} alt={m.title} referrerPolicy="no-referrer" className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-bold text-gray-900 truncate leading-tight">{m.title}</p>
                              {hasDetail && <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-1 rounded font-bold flex-shrink-0">GUIA</span>}
                            </div>
                            <p className="text-[11px] text-gray-500 truncate mt-0.5">{m.author}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-[#FF9900] text-[#FF9900]" />
                              <span className="text-[10px] text-gray-600">{m.rating.toFixed(1)}</span>
                              <span className="text-[10px] text-[#E67A00] font-bold ml-1">#{m.rank}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Right: Guide or Honest Uncataloged Message */}
            {selected && (
              <div className="flex-1 space-y-4 min-w-0">
                {/* Manga Overview Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img 
                      src={selected.coverImage} 
                      alt={selected.title} 
                      referrerPolicy="no-referrer" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80';
                      }}
                      className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0 self-start" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-black text-gray-900 leading-tight">{selected.title}</h2>
                            {guide ? (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                ✓ Guia Canônico Confirmado
                              </span>
                            ) : (
                              <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-300 px-2 py-0.5 rounded-full font-medium">
                                Dados Gerais da Obra
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 italic mt-0.5">{selected.japaneseTitle}</p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>Autor:</strong> {selected.author}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>Categoria:</strong> {selected.category} · <strong>Volumes Publicados:</strong> {selected.volumesCount > 0 ? selected.volumesCount : 'Em publicação'}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {selected.tags.slice(0, 5).map((tag) => (
                              <span key={tag} className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-medium">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <button onClick={() => onSelectManga(selected)} className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-4 py-2 rounded-full text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap transition-colors cursor-pointer">
                            <span>Ver Produto</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <p className="text-sm font-black text-[#B12704]">
                            a partir de {formatPrice(selected.formats?.[0]?.price ?? 0)}
                          </p>
                        </div>
                      </div>
                      {selected.synopsis && <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-3">{selected.synopsis}</p>}
                      <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{selected.volumesCount > 0 ? `${selected.volumesCount} Volumes Catalogados` : 'Obra em Publicação Contínua'}</span>
                        {selected.isPrimeEligible && <span className="ml-2 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Frete Grátis</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* If VERIFIED guide exists: show real chronological order, arcs, anime and tips */}
                {guide ? (
                  <>
                    {/* Chronological Order */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-[#E67A00] uppercase tracking-wider mb-3">
                        <Clock className="w-4 h-4" />
                        <span>Ordem Cronológica Oficial das Sagas</span>
                      </div>
                      <p className="text-xs text-gray-800 leading-relaxed font-mono bg-gray-50 p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">{guide.chronology}</p>
                    </div>

                    {/* Arc breakdown */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider">
                          <Bookmark className="w-4 h-4 text-[#FF9900]" />
                          <span>Divisão Oficial de Arcos & Episódios</span>
                        </div>
                        <span className="text-xs text-gray-500 font-semibold">{guide.arcs.length} sagas/arcos catalogados</span>
                      </div>
                      <div className="space-y-3">
                        {guide.arcs.map((arc, i) => (
                          <div key={i} className="p-3.5 bg-amber-50/50 hover:bg-amber-50 rounded-lg border border-amber-200/80 space-y-2 transition-colors">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="font-bold text-xs sm:text-sm text-gray-900">{arc.name}</span>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="bg-white px-2 py-0.5 rounded border border-gray-300 text-gray-800 font-semibold shadow-2xs">{arc.volumes}</span>
                                <span className="bg-[#131921] text-[#FF9900] px-2 py-0.5 rounded font-mono font-bold">{arc.episodes}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed">{arc.summary}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Anime note */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                        <Tv2 className="w-4 h-4 text-[#007185]" />
                        <span>Adaptação em Anime</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-relaxed bg-blue-50 border border-blue-100 rounded-lg p-3">{guide.animeNote}</p>
                    </div>

                    {/* Collector tips */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                        <Film className="w-4 h-4 text-[#007185]" />
                        <span>Dicas de Leitura & Colecionador</span>
                      </div>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                            <Info className="w-3.5 h-3.5 text-[#FF9900] mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  /* Honest message when no verified arc guide exists — NO generic fake data! */
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center space-y-3">
                    <div className="w-12 h-12 bg-amber-50 text-[#FF9900] rounded-full flex items-center justify-center mx-auto border border-amber-200">
                      <Info className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">
                      Guia detalhado de arcos não catalogado para esta obra
                    </h3>
                    <p className="text-xs text-gray-600 max-w-lg mx-auto leading-relaxed">
                      Não possuímos a divisão precisa de arcos e equivalência de episódios catalogada para <strong>{selected.title}</strong>. Para evitar dados imprecisos ou genéricos, este guia detalhado é restrito a obras com cronologia canônica verificada.
                    </p>
                    <p className="text-xs text-emerald-700 font-semibold">
                      Recomendamos a leitura direta do Volume 1 ao Volume {selected.volumesCount || 1}.
                    </p>
                  </div>
                )}

                {/* Formats Available */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                    <BookOpen className="w-4 h-4 text-[#FF9900]" />
                    <span>Formatos Disponíveis para Compra</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {selected.formats.map((fmt) => (
                      <button key={fmt.format} onClick={() => onSelectManga(selected)} className="p-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-[#FF9900] rounded-lg text-left transition-colors group cursor-pointer">
                        <p className="text-[11px] font-bold text-gray-800 group-hover:text-[#B12704] leading-tight">
                          {translateFormat(fmt.format)}
                        </p>
                        <p className="text-sm font-black text-[#B12704] mt-1">{formatPrice(fmt.price)}</p>
                        {fmt.savingsPercent > 0 && <p className="text-[10px] text-gray-400 line-through">{formatPrice(fmt.originalPrice)}</p>}
                        <p className={`text-[10px] mt-1 font-semibold ${fmt.inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                          {fmt.inStock ? 'Em Estoque' : 'Indisponível'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

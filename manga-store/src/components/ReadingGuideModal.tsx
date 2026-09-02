import React, { useState } from 'react';
import { X, BookOpen, Clock, Film, CheckCircle2, ChevronRight, Bookmark, ArrowRight } from 'lucide-react';
import { MangaItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ReadingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  allManga: MangaItem[];
  onSelectManga: (manga: MangaItem) => void;
}

export const ReadingGuideModal: React.FC<ReadingGuideModalProps> = ({
  isOpen,
  onClose,
  allManga = [],
  onSelectManga,
}) => {
  const { t, language } = useLanguage();
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(allManga[0]?.id || 'one-piece-vol-105');

  if (!isOpen) return null;

  const currentManga = (allManga || []).find((m) => m?.id === selectedSeriesId) || allManga[0];

  const seriesGuides: Record<string, {
    arcs: Array<{ name: string; volumes: string; episodes: string; summary: string }>;
    tips: string[];
    chronology: string;
  }> = {
    'one-piece-vol-105': {
      chronology: language === 'pt' ? 'East Blue (Vol 1-12) → Alabasta (Vol 12-24) → Skypiea (Vol 24-32) → Water 7 / Enies Lobby (Vol 32-46) → Guerra dos Maiorais (Vol 46-60) → Ilha dos Homens-Peixe & Dressrosa (Vol 61-80) → Ilha Whole Cake (Vol 81-90) → País de Wano & Egghead (Vol 90-108+)' : 'East Blue (Vol 1-12) → Alabasta (Vol 12-24) → Skypiea (Vol 24-32) → Water 7 & Enies Lobby (Vol 32-46) → Summit War (Vol 46-60) → Fish-Man Island & Dressrosa (Vol 61-80) → Whole Cake Island (Vol 81-90) → Wano Country & Egghead (Vol 90-108+)',
      arcs: [
        {
          name: language === 'pt' ? 'Arco do País de Wano (Clímax)' : 'Wano Country Arc (Climax)',
          volumes: 'Vol. 90 - 105',
          episodes: 'Ep. 892 - 1085',
          summary: language === 'pt' ? 'A invasão de Onigashima, batalha decisiva contra Kaido e Big Mom, e a revelação do Deus do Sol Nika (Gear 5).' : 'The raid on Onigashima, epic duel against Kaido and Big Mom, and the historic awakening of Sun God Nika Gear 5.',
        },
        {
          name: language === 'pt' ? 'Arco de Egghead (Ilha do Futuro)' : 'Egghead Island Arc (Future Island)',
          volumes: 'Vol. 106 - 108+',
          episodes: 'Ep. 1086+',
          summary: language === 'pt' ? 'Dr. Vegapunk, revelações sobre o Século Perdido, armas antigas e o início da Saga Final de One Piece.' : 'Dr. Vegapunk revelations, Void Century secrets, Gorosei confrontation, and the kick-off of the Final Saga.',
        },
      ],
      tips: [
        language === 'pt' ? 'Recomendado ler o mangá oficial em volumes físicos para apreciar as páginas duplas desenhadas por Eiichiro Oda.' : 'Read in tankobon format to enjoy Oda’s intricate double-page spreads and SBS bonus columns.',
        language === 'pt' ? 'O Volume 105 contém os capítulos 1056 a 1065, marcando a transição épica para o arco de Egghead.' : 'Volume 105 collects chapters 1056 to 1065, seamlessly transitioning to Egghead Island.',
      ],
    },
    'jujutsu-kaisen-vol-24': {
      chronology: language === 'pt' ? 'Introdução & Útero Amaldiçoado (Vol 1-8) → Incidente de Shibuya (Vol 9-16) → Jogo do Abate (Vol 17-25) → Batalha de Shinjuku (Vol 26+)' : 'Fearsome Womb & Origin (Vol 1-8) → Shibuya Incident (Vol 9-16) → Culling Game (Vol 17-25) → Shinjuku Showdown (Vol 26+)',
      arcs: [
        {
          name: language === 'pt' ? 'Confronto em Shinjuku: Gojo vs Sukuna' : 'Shinjuku Showdown: Gojo vs Sukuna',
          volumes: 'Vol. 24 - 26',
          episodes: language === 'pt' ? 'Em produção (Anime 3ª Temporada)' : 'Anime Season 3 (Upcoming)',
          summary: language === 'pt' ? 'O ápice da feitiçaria moderna onde o Feiticeiro Mais Forte da Era Atual enfrenta o Rei das Maldições com Expansões de Domínio consecutivas.' : 'The highest tactical sorcery duel between Gojo Satoru and Ryomen Sukuna, featuring consecutive domain clashes.',
        },
      ],
      tips: [
        language === 'pt' ? 'Preste atenção nas notas técnicas sobre Energia Amaldiçoada Reversa e condições de Votos Vinculativos.' : 'Pay close attention to Binding Vow technical breakdowns and Reverse Cursed Technique mechanics.',
      ],
    },
    'berserk-deluxe-vol-1': {
      chronology: language === 'pt' ? 'O Espadachim Negro (Vol 1-3) → A Era de Ouro (Vol 3-14) → Condenação (Vol 14-21) → Falcão do Milênio (Vol 22-35) → Fantasia (Vol 35-42+)' : 'The Black Swordsman (Vol 1-3) → Golden Age (Vol 3-14) → Conviction (Vol 14-21) → Falcon of the Millennium (Vol 22-35) → Fantasia (Vol 35-42+)',
      arcs: [
        {
          name: language === 'pt' ? 'A Era de Ouro & O Eclipse' : 'Golden Age Arc & The Eclipse',
          volumes: 'Deluxe Vol. 1 - 4 (Tankobon 1-14)',
          episodes: language === 'pt' ? 'Anime 1997 / Memorial Edition' : '1997 Classic Anime / Memorial Edition',
          summary: language === 'pt' ? 'A formação do Bando do Falcão, a irmandade entre Guts e Griffith, e o trágico evento que transformou o destino do mundo.' : 'The rise of the Band of the Hawk, the brotherhood of Guts and Griffith, and the tragic Eclipse that reshaped dark fantasy.',
        },
      ],
      tips: [
        language === 'pt' ? 'A Edição Deluxe em capa dura de couro sintético é o formato definitivo em tamanho 7x10 polegadas.' : 'The leatherette Deluxe Hardcover is the definitive format, preserving Miura’s monumental ink cross-hatching at 7x10 inches.',
      ],
    },
  };

  const currentGuide = seriesGuides[selectedSeriesId] || seriesGuides['one-piece-vol-105'];

  return (
    <div
      id="reading-guide-modal"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-300 text-left max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#131921] text-white px-5 py-3.5 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF9900]" />
            <div>
              <h2 className="font-bold text-base text-white">{t.readingGuideModalTitle}</h2>
              <p className="text-xs text-gray-400">{t.readingGuideModalSub}</p>
            </div>
          </div>
          <button
            id="reading-guide-close-btn"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50">
          {/* Series Sidebar (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {t.readingGuideAllSeries}
            </h3>
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {allManga.slice(0, 8).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedSeriesId(m.id)}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 border transition-all cursor-pointer ${
                    selectedSeriesId === m.id
                      ? 'bg-white border-[#FF9900] shadow-sm ring-1 ring-[#FF9900]'
                      : 'bg-white/80 border-gray-200 hover:bg-white hover:border-gray-300'
                  }`}
                >
                  <img
                    src={m.coverImage}
                    alt={m.title}
                    referrerPolicy="no-referrer"
                    className="w-10 h-14 object-cover rounded shadow-xs flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{m.title}</h4>
                    <p className="text-[11px] text-gray-500 truncate">{m.author}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-[#E67A00] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Rank #{m.rank}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Guide Details (8 cols) */}
          <div className="md:col-span-8 space-y-5">
            {/* Header info */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-start justify-between">
              <div className="flex gap-3">
                <img
                  src={currentManga.coverImage}
                  alt={currentManga.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-24 object-cover rounded-md shadow"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-900">{currentManga.title}</h3>
                  <p className="text-xs text-gray-500 font-serif italic">{currentManga.japaneseTitle}</p>
                  <p className="text-xs text-gray-700 mt-1">
                    <strong>{t.authorBy}:</strong> {currentManga.author} • <strong>{t.categoryLabel}:</strong> {currentManga.category}
                  </p>
                  <div className="mt-2 text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentManga.volumesCount} Volumes Publicados</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectManga(currentManga);
                  onClose();
                }}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 font-bold px-4 py-2 rounded-full text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer self-end sm:self-center"
              >
                <span>{t.quickView}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chronology Timeline */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E67A00] uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                <span>{t.chronologicalOrder}</span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed font-mono bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                {currentGuide.chronology}
              </p>
            </div>

            {/* Key Arcs Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <Bookmark className="w-4 h-4 text-[#FF9900]" />
                <span>{t.keyArcsMilestones}</span>
              </div>
              <div className="space-y-2.5">
                {currentGuide.arcs.map((arc, i) => (
                  <div key={i} className="p-3 bg-amber-50/50 rounded-lg border border-amber-200/70 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-gray-900">{arc.name}</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700 font-semibold">
                          {arc.volumes}
                        </span>
                        <span className="bg-[#131921] text-amber-300 px-2 py-0.5 rounded font-mono">
                          {arc.episodes}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">{arc.summary}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Anime Sync & Collector Tips */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 uppercase tracking-wider">
                <Film className="w-4 h-4 text-[#007185]" />
                <span>{t.readingTipsTitle}</span>
              </div>
              <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                {currentGuide.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

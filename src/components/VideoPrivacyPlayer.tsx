import React, { useState } from 'react';
import { Play, Shield, Clock, Copy, Check, FileText } from 'lucide-react';
import { VideoEmbed, VideoChapter } from '../types';

interface VideoPrivacyPlayerProps {
  video: VideoEmbed;
  articleTitle: string;
}

export const VideoPrivacyPlayer: React.FC<VideoPrivacyPlayerProps> = ({
  video,
  articleTitle,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeChapter, setActiveChapter] = useState<VideoChapter | null>(null);
  const [copiedTime, setCopiedTime] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const handleCiteMoment = (chapter: VideoChapter) => {
    const citation = `[Cita por minuto] En "${articleTitle}", min ${chapter.time} ("${chapter.title}"): ${video.embedUrl}?t=${chapter.seconds}`;
    navigator.clipboard.writeText(citation);
    setCopiedTime(chapter.time);
    setTimeout(() => setCopiedTime(null), 2500);
  };

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs space-y-4">
      {/* Video Player or Privacy Click-to-Load Container */}
      <div className="relative aspect-video w-full bg-[var(--bg-subtle)]">
        {isLoaded ? (
          <iframe
            src={video.embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-[var(--bg-subtle)]">
            <div className="h-12 w-12 rounded-full bg-[var(--action-primary)] text-white flex items-center justify-center shadow-md">
              <Play className="h-6 w-6 ml-1" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="font-serif text-sm font-semibold text-[var(--text-primary)]">
                {video.title}
              </h4>
              <p className="text-[11px] text-[var(--text-tertiary)] flex items-center justify-center gap-1">
                <Shield className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                <span>Protección de privacidad: el reproductor externo no cargará cookies hasta que hagas clic.</span>
              </p>
            </div>
            <button
              onClick={() => setIsLoaded(true)}
              className="px-4 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] transition-colors"
            >
              Cargar vídeo explicativo
            </button>
          </div>
        )}
      </div>

      {/* Chapters & Citation Actions */}
      <div className="p-4 pt-0 space-y-3">
        <div className="flex items-center justify-between text-xs border-b border-[var(--border-subtle)] pb-2">
          <div className="flex items-center gap-1.5 font-semibold text-[var(--text-primary)]">
            <Clock className="h-3.5 w-3.5 text-[var(--action-primary)]" />
            <span>Capítulos y citas por minuto ({video.chapters.length})</span>
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="text-[var(--action-primary)] hover:underline flex items-center gap-1 text-[11px]"
          >
            <FileText className="h-3 w-3" />
            <span>{showTranscript ? 'Ocultar transcripción' : 'Ver transcripción'}</span>
          </button>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {video.chapters.map((chap) => {
            const isCopied = copiedTime === chap.time;
            return (
              <div
                key={chap.time}
                className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-[11px] font-bold text-[var(--action-primary)] shrink-0">
                    {chap.time}
                  </span>
                  <span className="text-[11px] text-[var(--text-primary)] truncate font-medium">
                    {chap.title}
                  </span>
                </div>

                <button
                  onClick={() => handleCiteMoment(chap)}
                  title="Copiar cita directa a este minuto exacto"
                  className="text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] shrink-0 flex items-center gap-1"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Citar minuto</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Optional Transcript Excerpt */}
        {showTranscript && video.transcriptExcerpt && (
          <div className="p-3 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle-lilac)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-1">
            <span className="font-serif font-semibold text-[var(--text-primary)] block text-xs">
              Extracto de la transcripción oficial:
            </span>
            <p className="italic">"{video.transcriptExcerpt}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

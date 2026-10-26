import React, { useState } from 'react';
import {
  User,
  Camera,
  Image as ImageIcon,
  Edit3,
  Save,
  Check,
  ShieldCheck,
  Link as LinkIcon,
  RotateCcw,
  GitBranch,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Heart,
  DollarSign,
  Eye,
  EyeOff,
  Globe,
  ExternalLink,
  Plus,
  Trash2,
  Award,
  Calendar,
  CheckCircle2,
  Lock,
  Share2,
  AlertCircle,
  X,
  Clipboard,
} from 'lucide-react';
import { UserProfile, Article, ForumThread, KnowledgeGap, SupporterRecord } from '../types';
import { VerificationBadge, EpistemicBadge, LevelIndicator, LicenseChip } from './SemanticBadges';

interface UserProfileViewProps {
  currentUser: UserProfile;
  articles: Article[];
  forumThreads: ForumThread[];
  gaps: KnowledgeGap[];
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSelectArticle: (articleId: string) => void;
  onNavigateForumThread?: (threadId: string) => void;
  onNavigateGap?: (gapId: string) => void;
  onNavigateEditor: () => void;
  onBack: () => void;
}

const PRESET_BANNERS = [
  { name: 'Biblioteca Clásica', url: 'https://images.unsplash.com/photo-1507842229452-78d10a47214e?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Archivo y Astrofísica', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Manuscrito y Libros', url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Luz y Arquitectura', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80' },
  { name: 'Travertino Sereno', url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&auto=format&fit=crop&q=80' },
];

const PRESET_AVATARS = [
  { name: 'Filosofía / Epistemología', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80' },
  { name: 'Ingeniería / Matemáticas', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80' },
  { name: 'Investigación / Humanidades', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80' },
  { name: 'Ciencias Naturales', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80' },
];

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  currentUser,
  articles,
  forumThreads,
  gaps,
  onUpdateUser,
  onSelectArticle,
  onNavigateForumThread,
  onNavigateGap,
  onNavigateEditor,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'threads' | 'articles' | 'gaps' | 'donations' | 'community' | 'edit'>('threads');
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showBannerPicker, setShowBannerPicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Form edit state
  const [name, setName] = useState(currentUser.name || '');
  const [role, setRole] = useState(currentUser.role || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(currentUser.bannerUrl || PRESET_BANNERS[0].url);
  const [bannerInputVal, setBannerInputVal] = useState(currentUser.bannerUrl || PRESET_BANNERS[0].url);
  const [avatarInputVal, setAvatarInputVal] = useState(currentUser.avatarUrl || '');
  const [bannerError, setBannerError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [copiedNote, setCopiedNote] = useState<string | null>(null);

  const handlePasteClipboard = async (setter: (val: string) => void, note: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setter(text.trim());
        setCopiedNote(`¡Enlace pegado! (${note})`);
        setTimeout(() => setCopiedNote(null), 2500);
      }
    } catch {
      // Clipboard blocked or unavailable in environment
    }
  };

  const [githubUser, setGithubUser] = useState(currentUser.githubUser || '');
  const [githubVerified, setGithubVerified] = useState(currentUser.githubVerified || false);
  const [orcidId, setOrcidId] = useState(currentUser.orcidId || '');
  const [orcidVerified, setOrcidVerified] = useState(currentUser.orcidVerified || false);
  const [linkedinUrl, setLinkedinUrl] = useState(currentUser.linkedinUrl || '');
  const [personalUrl, setPersonalUrl] = useState(currentUser.personalUrl || '');
  const [mastodonUrl, setMastodonUrl] = useState(currentUser.mastodonUrl || '');

  // Donation state
  const [donationsPublic, setDonationsPublic] = useState(currentUser.donationsPublic ?? true);
  const [donationsMessage, setDonationsMessage] = useState(
    currentUser.donationsMessage || 'Las donaciones recibidas apoyan la digitalización y redacción de fuentes libres bajo licencias abiertas (CC BY / CC0).'
  );
  const [donationsGoal, setDonationsGoal] = useState(currentUser.donationsGoal || '');
  const [kofiLink, setKofiLink] = useState(currentUser.donationLinks?.kofi || '');
  const [liberapayLink, setLiberapayLink] = useState(currentUser.donationLinks?.liberapay || '');
  const [paypalLink, setPaypalLink] = useState(currentUser.donationLinks?.paypal || '');
  const [githubSponsorsLink, setGithubSponsorsLink] = useState(currentUser.donationLinks?.githubSponsors || '');
  const [cryptoAddress, setCryptoAddress] = useState(currentUser.donationLinks?.cryptoAddress || '');

  // Community support stats
  const stats = currentUser.communityStats || {
    citationsGivenCount: 14,
    changedMindCount: 3,
    gapsAnsweredCount: 5,
    articlesPublishedCount: 4,
    threadsCreatedCount: 3,
    reviewsDoneCount: 6,
  };

  // User's forum threads
  const userThreads = forumThreads.filter(
    (t) =>
      t.author.toLowerCase() === currentUser.name.toLowerCase() ||
      t.author.toLowerCase() === currentUser.username.toLowerCase() ||
      t.replies.some(
        (r) =>
          r.author.toLowerCase() === currentUser.name.toLowerCase() ||
          r.author.toLowerCase() === currentUser.username.toLowerCase()
      )
  );

  // User's published articles
  const userArticles = articles.filter(
    (a) =>
      a.author.name.toLowerCase() === currentUser.name.toLowerCase() ||
      a.author.id === currentUser.id
  );

  // User's knowledge gaps
  const userGaps = gaps.filter(
    (g) =>
      g.authorName.toLowerCase() === currentUser.name.toLowerCase() ||
      g.answers.some((ans) => ans.authorName.toLowerCase() === currentUser.name.toLowerCase())
  );

  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated: UserProfile = {
      ...currentUser,
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      bannerUrl: bannerUrl.trim(),
      githubUser: githubUser.trim(),
      githubVerified,
      orcidId: orcidId.trim(),
      orcidVerified,
      linkedinUrl: linkedinUrl.trim(),
      personalUrl: personalUrl.trim(),
      mastodonUrl: mastodonUrl.trim(),
      donationsPublic,
      donationsMessage: donationsMessage.trim(),
      donationsGoal: donationsGoal.trim(),
      donationLinks: {
        kofi: kofiLink.trim(),
        liberapay: liberapayLink.trim(),
        paypal: paypalLink.trim(),
        githubSponsors: githubSponsorsLink.trim(),
        cryptoAddress: cryptoAddress.trim(),
      },
    };

    onUpdateUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const hasDonationLinks =
    Boolean(kofiLink || liberapayLink || paypalLink || githubSponsorsLink || cryptoAddress);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top action row */}
      <div className="flex items-center justify-between text-xs border-b border-[var(--border-subtle)] pb-3">
        <button
          onClick={onBack}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
        >
          ← Volver a la vista anterior
        </button>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1 text-[11px] animate-fadeIn">
              <Check className="h-3.5 w-3.5" />
              <span>Perfil guardado con éxito</span>
            </span>
          )}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveProfile();
              } else {
                setIsEditing(true);
                setActiveTab('edit');
              }
            }}
            className={`px-3.5 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs ${
              isEditing
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)]'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Guardar cambios</span>
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" />
                <span>Personalizar perfil</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Profile Header with Banner and Avatar */}
      <section className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
        {/* Cover Banner */}
        <div className="relative h-44 sm:h-56 w-full bg-[var(--bg-subtle)] overflow-hidden">
          {bannerUrl && !bannerError ? (
            <img
              src={bannerUrl}
              alt="Fondo de portada"
              className="h-full w-full object-cover transition-opacity duration-300"
              referrerPolicy="no-referrer"
              onError={() => setBannerError(true)}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-indigo-950/60 via-slate-900/50 to-teal-950/40 flex items-center justify-center">
              <span className="text-xs font-mono text-white/40 tracking-wider">
                {bannerError ? 'Enlace de portada no accesible · Mostrando fondo neutro' : 'Fondo neutro de Chen'}
              </span>
            </div>
          )}

          {/* Quick banner change button */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {copiedNote && (
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-[11px] font-medium shadow-md animate-fadeIn">
                {copiedNote}
              </span>
            )}
            <button
              onClick={() => {
                setShowBannerPicker(!showBannerPicker);
                setShowAvatarPicker(false);
              }}
              className="px-2.5 py-1 rounded bg-black/70 text-white text-[11px] backdrop-blur-sm hover:bg-black/90 flex items-center gap-1.5 transition-colors shadow-xs"
              title="Cambiar imagen de fondo"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>{showBannerPicker ? 'Cerrar selector' : 'Cambiar fondo web'}</span>
            </button>
          </div>

          {/* Banner Selector Drawer (URL from any web + Presets) */}
          {showBannerPicker && (
            <div className="absolute inset-x-0 bottom-0 bg-slate-950/95 text-white p-3.5 sm:p-4 text-xs space-y-3 z-20 backdrop-blur-md border-t border-white/10 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Fondo de portada desde la web (0 KB internos)
                  </span>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Pega cualquier enlace web de imagen (Instagram, Reddit, Imgur, Pinterest, Flickr, repositorios de arte). Se enlaza directamente sin ocupar espacio en tu cuenta.
                  </p>
                </div>
                <button
                  onClick={() => setShowBannerPicker(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* URL Input and Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  value={bannerInputVal}
                  onChange={(e) => {
                    setBannerInputVal(e.target.value);
                    setBannerError(false);
                  }}
                  placeholder="https://.../imagen.jpg o enlace directo de imagen web"
                  className="flex-1 rounded border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:border-indigo-400 focus:outline-none"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePasteClipboard(setBannerInputVal, 'portada')}
                    className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs flex items-center gap-1 transition-colors"
                    title="Pegar enlace desde portapapeles"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    <span>Pegar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = bannerInputVal.trim();
                      setBannerUrl(trimmed);
                      setBannerError(false);
                      setShowBannerPicker(false);
                      onUpdateUser({ ...currentUser, bannerUrl: trimmed });
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Aplicar fondo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBannerUrl('');
                      setBannerInputVal('');
                      setBannerError(false);
                      setShowBannerPicker(false);
                      onUpdateUser({ ...currentUser, bannerUrl: '' });
                    }}
                    className="px-2 py-1.5 rounded bg-rose-900/40 hover:bg-rose-900/70 text-rose-200 text-xs flex items-center gap-1 transition-colors"
                    title="Quitar fondo personalizado y usar gradiente neutro"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Quitar</span>
                  </button>
                </div>
              </div>

              {/* Preset buttons */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-400 font-mono">O elige una foto clásica predeterminada:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_BANNERS.map((b) => (
                    <button
                      key={b.name}
                      onClick={() => {
                        setBannerUrl(b.url);
                        setBannerInputVal(b.url);
                        setBannerError(false);
                        setShowBannerPicker(false);
                        onUpdateUser({ ...currentUser, bannerUrl: b.url });
                      }}
                      className="group relative h-11 rounded overflow-hidden border border-white/20 hover:border-indigo-400 transition-all text-left"
                    >
                      <img
                        src={b.url}
                        alt={b.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute inset-0 bg-black/40 p-1 flex items-end text-[9px] font-medium leading-tight">
                        {b.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Card Body */}
        <div className="p-6 sm:p-8 pt-0 relative space-y-6">
          {/* Avatar and Primary Names Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-14">
            <div className="flex items-end gap-4">
              {/* Avatar with Camera Button */}
              <div className="relative group shrink-0">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-4 border-[var(--bg-surface)] bg-[var(--bg-subtle-lilac)] shadow-md overflow-hidden flex items-center justify-center">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="h-full w-full object-cover transition-opacity duration-300"
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="font-serif text-3xl font-bold text-[var(--action-primary)]">
                      {currentUser.avatarInitials || name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setShowAvatarPicker(!showAvatarPicker);
                    setShowBannerPicker(false);
                  }}
                  className="absolute bottom-1 right-1 p-1.5 rounded-full bg-[var(--action-primary)] text-white hover:bg-[var(--action-hover)] shadow-sm transition-transform hover:scale-110"
                  title="Cambiar foto de perfil desde enlace web"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Title & Role */}
              <div className="space-y-1 pb-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
                    {name}
                  </h1>
                  <span className="font-mono text-xs text-[var(--text-tertiary)]">
                    @{currentUser.username}
                  </span>
                  {githubVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>GitHub verificado</span>
                    </span>
                  )}
                  {orcidVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-800 dark:text-teal-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                      <span>ORCID verificado</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
                  {role}
                </p>
              </div>
            </div>

            {/* Public donation button (only if enabled by the user!) */}
            <div className="flex items-center gap-3 shrink-0 pb-1">
              {donationsPublic && hasDonationLinks ? (
                <div className="flex items-center gap-2">
                  <a
                    href={liberapayLink || kofiLink || paypalLink || githubSponsorsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Heart className="h-3.5 w-3.5 fill-current" />
                    <span>Donar al autor</span>
                  </a>
                  <span className="text-[10px] text-[var(--text-tertiary)] font-mono hidden md:inline">
                    (Directo · 0% comisión)
                  </span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] font-mono">
                  <EyeOff className="h-3.5 w-3.5" />
                  <span>Donaciones privadas</span>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Picker Drawer (Web URL + Presets) */}
          {showAvatarPicker && (
            <div className="p-4 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-3.5 text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-xs text-[var(--text-primary)] flex items-center gap-1.5">
                    <Camera className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                    Foto de perfil desde cualquier enlace web (0 KB internos)
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Pega cualquier URL de imagen de la web (tu avatar de Instagram, Reddit, Twitter/X, Imgur o repositorios). No ocupa espacio local ni en base de datos.
                  </p>
                </div>
                <button
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* URL Input and Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="url"
                  value={avatarInputVal}
                  onChange={(e) => {
                    setAvatarInputVal(e.target.value);
                    setAvatarError(false);
                  }}
                  placeholder="https://.../foto.jpg o enlace web directo"
                  className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:outline-none"
                />

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePasteClipboard(setAvatarInputVal, 'foto')}
                    className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs flex items-center gap-1 transition-colors"
                    title="Pegar enlace desde portapapeles"
                  >
                    <Clipboard className="h-3.5 w-3.5" />
                    <span>Pegar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = avatarInputVal.trim();
                      setAvatarUrl(trimmed);
                      setAvatarError(false);
                      setShowAvatarPicker(false);
                      onUpdateUser({ ...currentUser, avatarUrl: trimmed });
                    }}
                    className="px-3 py-1.5 rounded bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Aplicar foto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAvatarUrl('');
                      setAvatarInputVal('');
                      setAvatarError(false);
                      setShowAvatarPicker(false);
                      onUpdateUser({ ...currentUser, avatarUrl: '' });
                    }}
                    className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-secondary)] text-xs flex items-center gap-1 transition-colors"
                  >
                    <span>Usar iniciales</span>
                  </button>
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1.5 pt-1 border-t border-[var(--border-subtle)]">
                <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                  O elige una foto académica predeterminada:
                </span>
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((av) => (
                    <button
                      key={av.name}
                      onClick={() => {
                        setAvatarUrl(av.url);
                        setAvatarInputVal(av.url);
                        setAvatarError(false);
                        setShowAvatarPicker(false);
                        onUpdateUser({ ...currentUser, avatarUrl: av.url });
                      }}
                      className="flex flex-col items-center gap-1 shrink-0 group"
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        className="h-11 w-11 rounded-full object-cover border-2 border-transparent group-hover:border-[var(--action-primary)] transition-all"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-[var(--text-secondary)]">
                        {av.name.split('/')[0]}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setAvatarUrl('');
                      setAvatarInputVal('');
                      setAvatarError(false);
                      setShowAvatarPicker(false);
                      onUpdateUser({ ...currentUser, avatarUrl: '' });
                    }}
                    className="flex flex-col items-center gap-1 shrink-0 p-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[10px] text-[var(--text-secondary)]"
                  >
                    <div className="h-9 w-9 rounded-full bg-[var(--bg-subtle-lilac)] text-[var(--action-primary)] font-bold flex items-center justify-center text-xs">
                      {currentUser.avatarInitials}
                    </div>
                    <span>Iniciales</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bio text */}
          <p className="font-serif text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
            {bio || 'Este autor aún no ha añadido una descripción biográfica.'}
          </p>

          {/* Social Links Row (Verifiable Policy per Chen Manifesto) */}
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            {githubUser && (
              <a
                href={`https://github.com/${githubUser}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={githubVerified} label={`GitHub: @${githubUser}`} />
              </a>
            )}

            {orcidId && (
              <a
                href={`https://orcid.org/${orcidId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80"
              >
                <VerificationBadge verified={orcidVerified} label={`ORCID: ${orcidId}`} />
              </a>
            )}

            {linkedinUrl && (
              <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <VerificationBadge verified={false} label="LinkedIn (no verificado)" />
              </a>
            )}

            {personalUrl && (
              <a href={personalUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <VerificationBadge verified={false} label="Web personal (no verificado)" />
              </a>
            )}

            {mastodonUrl && (
              <a href={mastodonUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
                <VerificationBadge verified={false} label="Fediverso (no verificado)" />
              </a>
            )}
          </div>

          {/* Community contributions row (No popularity metrics, strictly epistemics!) */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-5 border-t border-[var(--border-subtle)] text-xs">
            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Citas aportadas:</span>
              <div className="font-mono text-base font-semibold text-[var(--action-primary)] flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5" />
                <span>{stats.citationsGivenCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">En la red libre</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Cambié de opinión:</span>
              <div className="font-mono text-base font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{stats.changedMindCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">Rectificaciones</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Huecos resueltos:</span>
              <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
                <span>{stats.gapsAnsweredCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">Respuestas dadas</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Artículos libres:</span>
              <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-600" />
                <span>{userArticles.length || stats.articlesPublishedCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">Con licencia CC</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Hilos en foro:</span>
              <div className="font-mono text-base font-semibold text-[var(--text-primary)] flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5 text-purple-600" />
                <span>{userThreads.length || stats.threadsCreatedCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">Debates abiertos</span>
            </div>

            <div className="space-y-1">
              <span className="text-[var(--text-tertiary)] block text-[11px]">Revisiones de pares:</span>
              <div className="font-mono text-base font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <Award className="h-3.5 w-3.5" />
                <span>{stats.reviewsDoneCount}</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)]">Revisión crítica</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation Strip */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] overflow-x-auto text-xs pb-1">
        <button
          onClick={() => setActiveTab('threads')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'threads'
              ? 'border-[var(--action-primary)] text-[var(--action-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Mis Hilos en el Foro ({userThreads.length})
        </button>

        <button
          onClick={() => setActiveTab('articles')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'articles'
              ? 'border-[var(--action-primary)] text-[var(--action-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Mis Artículos y Apuntes ({userArticles.length})
        </button>

        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'gaps'
              ? 'border-[var(--action-primary)] text-[var(--action-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Huecos del Saber ({userGaps.length})
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'donations'
              ? 'border-[var(--action-primary)] text-[var(--action-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          <span>Apoyo y Donaciones {donationsPublic ? '(Público)' : '(Privado)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'community'
              ? 'border-[var(--action-primary)] text-[var(--action-primary)]'
              : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Apoyo a la Comunidad
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`px-3 py-2 font-medium transition-colors border-b-2 whitespace-nowrap flex items-center gap-1 text-[var(--action-primary)] ${
            activeTab === 'edit'
              ? 'border-[var(--action-primary)] font-bold'
              : 'border-transparent hover:text-[var(--action-primary)]'
          }`}
        >
          <Edit3 className="h-3 w-3" />
          <span>Editar datos</span>
        </button>
      </div>

      {/* Tab 1: Mis Hilos en el Foro */}
      {activeTab === 'threads' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                Hilos de debate iniciados o participados
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Debates constructivos fundamentados en argumentos y evidencias, sin votos de popularidad.
              </p>
            </div>
            <button
              onClick={() => onNavigateForumThread && onNavigateForumThread('new')}
              className="px-3 py-1.5 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nuevo hilo</span>
            </button>
          </div>

          {userThreads.length === 0 ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)] space-y-2">
              <p>Aún no has iniciado hilos de debate en el foro.</p>
              <button
                onClick={() => onNavigateForumThread && onNavigateForumThread('new')}
                className="text-[var(--action-primary)] hover:underline font-medium"
              >
                Inicia una discusión razonada en el foro de Chen
              </button>
            </div>
          ) : (
            userThreads.map((thread) => (
              <div
                key={thread.id}
                onClick={() => onNavigateForumThread && onNavigateForumThread(thread.id)}
                className="cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2.5 hover:border-[var(--border-strong)] transition-all shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                  <span className="font-mono text-[11px] text-[var(--action-primary)] font-medium">
                    {thread.category}
                  </span>
                  <span>{thread.date}</span>
                </div>

                <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)] hover:text-[var(--action-primary)] transition-colors">
                  {thread.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {thread.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" />
                    <span>{thread.replies.length} respuestas argumentadas</span>
                  </span>
                  <span className="text-[var(--action-primary)] hover:underline font-medium">
                    Ver hilo completo →
                  </span>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab 2: Mis Artículos y Apuntes */}
      {activeTab === 'articles' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                Artículos, tutoriales y apuntes publicados
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Todo tu contenido bajo licencias abiertas (CC BY, CC0) con versionado transparente.
              </p>
            </div>
            <button
              onClick={onNavigateEditor}
              className="px-3 py-1.5 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Escribir nuevo artículo</span>
            </button>
          </div>

          {userArticles.length === 0 ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)] space-y-2">
              <p>Aún no has publicado ningún artículo en Chen.</p>
              <button
                onClick={onNavigateEditor}
                className="text-[var(--action-primary)] hover:underline font-medium"
              >
                Comienza a escribir tu primer artículo en Markdown con citas
              </button>
            </div>
          ) : (
            userArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art.id)}
                className="cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2 hover:border-[var(--border-strong)] transition-all shadow-xs"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
                  <span className="font-medium text-[var(--text-primary)]">{art.area}</span>
                  <span>·</span>
                  <LevelIndicator level={art.level} />
                  <span>·</span>
                  <EpistemicBadge status={art.epistemicStatus} />
                  <span>·</span>
                  <LicenseChip license={art.license} />
                  <span>·</span>
                  <span>{art.readTimeMinutes} min</span>
                </div>

                <h3 className="font-serif text-base sm:text-xl font-bold text-[var(--text-primary)] hover:text-[var(--action-primary)] transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {art.subtitle}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)]">
                  <span className="font-mono text-[var(--action-primary)]">
                    {art.citations.length} citas conectadas
                  </span>
                  <span>v{art.versionNumber} · Publicado el {art.publishedDate}</span>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab 3: Huecos del Saber */}
      {activeTab === 'gaps' && (
        <section className="space-y-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Huecos del saber formulados y respondidos
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Preguntas de frontera donde la literatura científica aún no tiene consenso absoluto.
            </p>
          </div>

          {userGaps.length === 0 ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)]">
              No tienes preguntas abiertas en este momento.
            </div>
          ) : (
            userGaps.map((gap) => (
              <div
                key={gap.id}
                onClick={() => onNavigateGap && onNavigateGap(gap.id)}
                className="cursor-pointer rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2 hover:border-[var(--border-strong)] transition-all shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)]">
                  <span className="font-mono text-[11px] text-[var(--action-primary)]">{gap.area}</span>
                  <span>{gap.date}</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  {gap.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {gap.myHypothesis || gap.whatIReadFirst}
                </p>
                <div className="pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-tertiary)] flex items-center justify-between">
                  <span>{gap.answers.length} respuestas aportadas</span>
                  <span className="text-[var(--action-primary)]">Ver hueco →</span>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Tab 4: Apoyo y Donaciones con Control de Privacidad */}
      {activeTab === 'donations' && (
        <section className="space-y-6">
          {/* Privacy Switch Card */}
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--text-primary)]">
                    Visibilidad de Donaciones y Apoyo al Autor
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] max-w-xl leading-relaxed">
                  Tú decides si quieres que los visitantes vean tus enlaces de donación externa (Ko-fi, Liberapay, PayPal, etc.) o mantener este módulo completamente oculto.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {donationsPublic ? 'Público en tu perfil' : 'Oculto / Privado'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = !donationsPublic;
                    setDonationsPublic(next);
                    onUpdateUser({ ...currentUser, donationsPublic: next });
                  }}
                  role="switch"
                  aria-checked={donationsPublic}
                  className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                    donationsPublic ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      donationsPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Non-negotiable Chen Ethical Principles Notice */}
            <div className="p-3.5 rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-[var(--bg-subtle-lilac)] text-xs text-[var(--text-secondary)] space-y-1">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--action-primary)]" />
                <span>Principio no negociable: Dinero fuera de la plataforma</span>
              </span>
              <p className="text-[11px] leading-relaxed text-[var(--text-tertiary)]">
                Chen nunca retiene comisiones, no intermedia pagos y no guarda datos bancarios. Las donaciones son 100% directas mediante tus propios enlaces externos. Recibir donaciones <strong>nunca altera la reputación, ni otorga votos, ni modifica la visibilidad de los artículos</strong>.
              </p>
            </div>
          </div>

          {/* Active Donation Configuration Overview */}
          {donationsPublic ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: How Visitors See Your Donation Box */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 p-6 space-y-4">
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300 tracking-wider block">
                  Vista Previa del Módulo de Apoyo (Público)
                </span>

                <div className="space-y-2">
                  <h4 className="font-serif text-lg font-bold text-[var(--text-primary)]">
                    Apoyo directo a {name}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-serif">
                    "{donationsMessage}"
                  </p>
                  {donationsGoal && (
                    <div className="p-2.5 rounded border border-emerald-500/20 bg-[var(--bg-surface)] text-xs text-emerald-900 dark:text-emerald-200">
                      <strong>Meta declarada:</strong> {donationsGoal}
                    </div>
                  )}
                </div>

                {/* Direct donation links */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-[var(--text-primary)] block">
                    Canales de apoyo configurados:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {kofiLink && (
                      <a
                        href={kofiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:text-[var(--action-primary)] flex items-center gap-1.5 shadow-xs font-medium"
                      >
                        <Heart className="h-3.5 w-3.5 text-rose-500" />
                        <span>Ko-fi</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                    {liberapayLink && (
                      <a
                        href={liberapayLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:text-[var(--action-primary)] flex items-center gap-1.5 shadow-xs font-medium"
                      >
                        <Globe className="h-3.5 w-3.5 text-amber-500" />
                        <span>Liberapay</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                    {paypalLink && (
                      <a
                        href={paypalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:text-[var(--action-primary)] flex items-center gap-1.5 shadow-xs font-medium"
                      >
                        <DollarSign className="h-3.5 w-3.5 text-blue-500" />
                        <span>PayPal.me</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                    {githubSponsorsLink && (
                      <a
                        href={githubSponsorsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:text-[var(--action-primary)] flex items-center gap-1.5 shadow-xs font-medium"
                      >
                        <Heart className="h-3.5 w-3.5 text-pink-500" />
                        <span>GitHub Sponsors</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                    {cryptoAddress && (
                      <span className="px-2.5 py-1.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] font-mono text-[11px] text-[var(--text-secondary)]">
                        Crypto: {cryptoAddress.slice(0, 10)}...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Public Supporters Board */}
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-[var(--action-primary)]" />
                    <h4 className="font-serif text-base font-bold text-[var(--text-primary)]">
                      Muro Público de Agradecimiento
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                    {currentUser.supportersList?.length || 0} reconocimientos
                  </span>
                </div>

                <p className="text-xs text-[var(--text-tertiary)]">
                  Puedes reconocer públicamente a lectores o cátedras que hayan apoyado tu investigación libre.
                </p>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {(currentUser.supportersList && currentUser.supportersList.length > 0) ? (
                    currentUser.supportersList.map((sup) => (
                      <div
                        key={sup.id}
                        className="p-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-subtle)] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[var(--text-primary)]">
                            {sup.name}
                          </span>
                          <span className="text-[10px] text-[var(--text-tertiary)]">
                            {sup.date}
                          </span>
                        </div>
                        <p className="font-serif italic text-[var(--text-secondary)]">
                          "{sup.note}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[var(--text-tertiary)] italic p-4 text-center">
                      No hay reconocimientos públicos registrados todavía.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center text-xs text-[var(--text-tertiary)] space-y-2">
              <EyeOff className="h-6 w-6 mx-auto text-[var(--text-tertiary)] opacity-60" />
              <p className="font-medium text-[var(--text-primary)]">
                Las donaciones y enlaces de apoyo están actualmente ocultos.
              </p>
              <p>
                Ningún visitante verá opciones de pago o donación en tu perfil de Chen. Activa el interruptor arriba si deseas mostrarlos.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Tab 5: Apoyo a la Comunidad */}
      {activeTab === 'community' && (
        <section className="space-y-6">
          <div>
            <h2 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
              Registro Verificable de Apoyo a la Comunidad Chen
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              En Chen tu credibilidad se construye a través de evidencias aportadas, rectificaciones honestas y ayuda a otros aprendices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Citas y Red */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-indigo-600" />
                <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                  Red de Citas Formuladas
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Has conectado {stats.citationsGivenCount} referencias semánticas a otros artículos de Chen clasificándolas explícitamente en:
              </p>
              <div className="space-y-1.5 text-xs font-mono pt-1">
                <div className="flex items-center justify-between text-indigo-700 dark:text-indigo-400">
                  <span>• Citas que apoyan:</span>
                  <span className="font-bold">8</span>
                </div>
                <div className="flex items-center justify-between text-rose-700 dark:text-rose-400">
                  <span>• Citas que contradicen:</span>
                  <span className="font-bold">3</span>
                </div>
                <div className="flex items-center justify-between text-teal-700 dark:text-teal-400">
                  <span>• Citas que amplían:</span>
                  <span className="font-bold">3</span>
                </div>
              </div>
            </div>

            {/* Cambié de Opinión */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/20 dark:bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-600" />
                <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                  Insignia «Cambié de opinión»
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Chen premia la honestidad intelectual: corregir una postura errónea ante una prueba experimental suma prestigio.
              </p>
              <div className="p-3 rounded bg-[var(--bg-surface)] border border-emerald-500/20 text-xs space-y-1">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">
                  {stats.changedMindCount} rectificaciones públicas
                </span>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Última rectificación: Notación en la función de coste estocástica (24 de Octubre).
                </p>
              </div>
            </div>

            {/* Resolución de Huecos */}
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-amber-600" />
                <h3 className="font-serif font-bold text-sm text-[var(--text-primary)]">
                  Huecos del Saber Resueltos
                </h3>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Has aportado {stats.gapsAnsweredCount} explicaciones razonadas con fuentes a preguntas abiertas que ningún autor había clarificado.
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-[var(--action-primary)] font-medium">
                  Áreas de mayor aporte: Filosofía, Epistemología y Sistemas.
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 6: Formulario Completo de Edición */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 sm:p-8 space-y-8 shadow-xs">
          <div className="border-b border-[var(--border-subtle)] pb-4">
            <h2 className="font-serif text-xl font-bold text-[var(--text-primary)]">
              Personalizar Perfil, Redes y Donaciones
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Actualiza tus datos públicos, enlaces de apoyo voluntario y preferencias de visibilidad.
            </p>
          </div>

          {/* Section: Identidad */}
          <div className="space-y-4">
            <h3 className="font-mono text-xs font-semibold text-[var(--action-primary)] uppercase tracking-wider">
              1. Identidad y Biografía
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Nombre completo o firma pública
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Rol / Especialidad profesional o académica
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ej. Investigadora en Filosofía de la Ciencia"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Biografía descriptiva (máx. 500 caracteres)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Explica tus líneas de interés, método de trabajo y qué materias estás estudiando o investigando..."
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none leading-relaxed"
              />
              <span className="text-[10px] text-[var(--text-tertiary)] block text-right font-mono">
                {bio.length} / 500
              </span>
            </div>

            {/* Custom URLs for Avatar & Banner (Direct from any web) */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">
                    URL de foto de perfil personalizada (cualquier web)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        setAvatarInputVal(e.target.value);
                        setAvatarError(false);
                      }}
                      placeholder="https://.../foto.jpg o enlace web directo"
                      className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handlePasteClipboard((val) => {
                        setAvatarUrl(val);
                        setAvatarInputVal(val);
                        setAvatarError(false);
                      }, 'foto')}
                      className="px-2.5 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs flex items-center gap-1 shrink-0"
                      title="Pegar enlace del portapapeles"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Pegar</span>
                    </button>
                  </div>
                  {avatarUrl && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <img
                        src={avatarUrl}
                        alt="Vista previa foto"
                        className="h-7 w-7 rounded-full object-cover border border-[var(--border-subtle)]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                        Vista previa con no-referrer activo
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[var(--text-primary)]">
                    URL de foto de fondo / portada (cualquier web)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="url"
                      value={bannerUrl}
                      onChange={(e) => {
                        setBannerUrl(e.target.value);
                        setBannerInputVal(e.target.value);
                        setBannerError(false);
                      }}
                      placeholder="https://.../banner.jpg o enlace web directo"
                      className="flex-1 rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handlePasteClipboard((val) => {
                        setBannerUrl(val);
                        setBannerInputVal(val);
                        setBannerError(false);
                      }, 'portada')}
                      className="px-2.5 py-2 rounded border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] text-[var(--text-primary)] text-xs flex items-center gap-1 shrink-0"
                      title="Pegar enlace del portapapeles"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Pegar</span>
                    </button>
                  </div>
                  {bannerUrl && (
                    <div className="flex items-center gap-2 pt-0.5">
                      <img
                        src={bannerUrl}
                        alt="Vista previa portada"
                        className="h-7 w-16 rounded object-cover border border-[var(--border-subtle)]"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[10px] text-[var(--text-tertiary)] font-mono">
                        Vista previa con no-referrer activo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded p-2.5 bg-[var(--bg-subtle-lilac)]/40 border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)] flex items-start gap-2">
                <span className="font-bold text-[var(--action-primary)] shrink-0">💡 0 KB Internos:</span>
                <p>
                  Puedes utilizar cualquier imagen de la web (Instagram, Imgur, Reddit, Pinterest, portafolios de arte o tu propio sitio). Se visualizan mediante enlaces directos con cabecera <code className="font-mono text-[10px] text-[var(--action-primary)]">referrerPolicy="no-referrer"</code> para evitar bloqueos por hotlink y sin sobrecargar la memoria ni almacenamiento interno.
                </p>
              </div>
            </div>
          </div>

          {/* Section: Redes Sociales */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="space-y-1">
              <h3 className="font-mono text-xs font-semibold text-[var(--action-primary)] uppercase tracking-wider">
                2. Redes Sociales y Perfiles Verificables
              </h3>
              <p className="text-[11px] text-[var(--text-tertiary)]">
                Por política de honestidad de Chen, solo GitHub y ORCID reciben marca técnica verificada tras prueba de clave. LinkedIn y otras redes se muestran siempre como «No verificado».
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Usuario GitHub</span>
                  <label className="flex items-center gap-1 font-normal text-[10px] text-emerald-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={githubVerified}
                      onChange={(e) => setGithubVerified(e.target.checked)}
                      className="rounded text-emerald-600"
                    />
                    <span>Verificado por OAuth</span>
                  </label>
                </label>
                <div className="flex items-center">
                  <span className="px-2 py-2 bg-[var(--border-subtle)] text-[var(--text-tertiary)] text-xs rounded-l border border-r-0 border-[var(--border-subtle)] font-mono">
                    github.com/
                  </span>
                  <input
                    type="text"
                    value={githubUser}
                    onChange={(e) => setGithubUser(e.target.value)}
                    placeholder="usuario"
                    className="flex-1 rounded-r border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)] flex items-center justify-between">
                  <span>Identificador ORCID</span>
                  <label className="flex items-center gap-1 font-normal text-[10px] text-teal-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={orcidVerified}
                      onChange={(e) => setOrcidVerified(e.target.checked)}
                      className="rounded text-teal-600"
                    />
                    <span>Verificado</span>
                  </label>
                </label>
                <input
                  type="text"
                  value={orcidId}
                  onChange={(e) => setOrcidId(e.target.value)}
                  placeholder="0000-0002-1825-0097"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Perfil de LinkedIn (mostrado como no verificado)
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Página web personal o cuaderno público
                </label>
                <input
                  type="url"
                  value={personalUrl}
                  onChange={(e) => setPersonalUrl(e.target.value)}
                  placeholder="https://miweb.org"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Perfil en el Fediverso / Mastodon / Bluesky
                </label>
                <input
                  type="text"
                  value={mastodonUrl}
                  onChange={(e) => setMastodonUrl(e.target.value)}
                  placeholder="https://mastodon.social/@usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Donaciones y Mecenazgo */}
          <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="font-mono text-xs font-semibold text-[var(--action-primary)] uppercase tracking-wider">
                  3. Canales de Donación y Mecenazgo
                </h3>
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  Configura tus pasarelas de pago externas. Puedes activar o desactivar la visibilidad en cualquier momento.
                </p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--text-primary)]">
                <input
                  type="checkbox"
                  checked={donationsPublic}
                  onChange={(e) => setDonationsPublic(e.target.checked)}
                  className="rounded text-emerald-600 h-4 w-4"
                />
                <span>Hacer públicas las donaciones</span>
              </label>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Mensaje de transparencia del autor
              </label>
              <input
                type="text"
                value={donationsMessage}
                onChange={(e) => setDonationsMessage(e.target.value)}
                placeholder="Explica qué financian las donaciones (ej. compra de libros para liberar, servidores de prueba...)"
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-[var(--text-primary)]">
                Meta o proyecto específico (opcional)
              </label>
              <input
                type="text"
                value={donationsGoal}
                onChange={(e) => setDonationsGoal(e.target.value)}
                placeholder="Ej. Digitalizar las cartas de Descartes bajo CC0"
                className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Enlace Ko-fi
                </label>
                <input
                  type="url"
                  value={kofiLink}
                  onChange={(e) => setKofiLink(e.target.value)}
                  placeholder="https://ko-fi.com/usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Enlace Liberapay
                </label>
                <input
                  type="url"
                  value={liberapayLink}
                  onChange={(e) => setLiberapayLink(e.target.value)}
                  placeholder="https://liberapay.com/usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Enlace PayPal.me
                </label>
                <input
                  type="url"
                  value={paypalLink}
                  onChange={(e) => setPaypalLink(e.target.value)}
                  placeholder="https://paypal.me/usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  GitHub Sponsors
                </label>
                <input
                  type="url"
                  value={githubSponsorsLink}
                  onChange={(e) => setGithubSponsorsLink(e.target.value)}
                  placeholder="https://github.com/sponsors/usuario"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-semibold text-[var(--text-primary)]">
                  Dirección Monero / Bitcoin para donaciones directas (opcional)
                </label>
                <input
                  type="text"
                  value={cryptoAddress}
                  onChange={(e) => setCryptoAddress(e.target.value)}
                  placeholder="Dirección pública"
                  className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={() => setActiveTab('threads')}
              className="px-4 py-2 rounded text-xs border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-[var(--action-primary)] text-white text-xs font-medium hover:bg-[var(--action-hover)] shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Guardar perfil de Chen</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

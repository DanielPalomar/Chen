import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Sparkles,
  Plus,
  X,
  BookMarked,
  Info,
} from 'lucide-react';
import { FreeBook } from '../types';

interface FreeBooksViewProps {
  books: FreeBook[];
  onAddBook?: (newBook: FreeBook) => void;
  onNavigateNotebookTip?: () => void;
  onNavigateRepositories?: () => void;
}

export const FreeBooksView: React.FC<FreeBooksViewProps> = ({
  books,
  onAddBook,
  onNavigateRepositories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('todos');
  const [selectedTopic, setSelectedTopic] = useState<string>('todos');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('todos');
  const [selectedFormat, setSelectedFormat] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  // Form state for suggesting a new open book
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newLanguage, setNewLanguage] = useState<FreeBook['language']>('Español');
  const [newTopic, setNewTopic] = useState<FreeBook['topic']>('Matemáticas');
  const [newPlatform, setNewPlatform] = useState<FreeBook['sourcePlatform']>('OpenStax');
  const [newUrl, setNewUrl] = useState('');
  const [newLicense, setNewLicense] = useState('CC BY 4.0');
  const [newDescription, setNewDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Available filter options extracted dynamically
  const languages = useMemo(() => {
    return ['todos', 'Español', 'Inglés', 'Francés', 'Alemán', 'Portugués'];
  }, []);

  const topics = useMemo(() => {
    const set = new Set<string>([
      'Matemáticas',
      'Física',
      'Computación',
      'Filosofía',
      'Biología',
      'Ciencias Sociales',
      'Literatura',
      'Sistemas',
      'Economía',
    ]);
    books.forEach((b) => {
      if (b.topic) set.add(b.topic);
    });
    return ['todos', ...Array.from(set)];
  }, [books]);

  const platforms = useMemo(() => {
    const set = new Set<string>([
      'OpenStax',
      'Proyecto Gutenberg',
      'LibreTexts',
      'MIT OCW',
      'Internet Archive',
      'arXiv',
    ]);
    books.forEach((b) => {
      if (b.sourcePlatform) set.add(b.sourcePlatform);
    });
    return ['todos', ...Array.from(set)];
  }, [books]);

  const formats = useMemo(() => {
    return ['todos', 'PDF', 'EPUB', 'Web'];
  }, []);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      // Language filter
      if (selectedLanguage !== 'todos' && book.language !== selectedLanguage) {
        return false;
      }
      // Topic filter
      if (selectedTopic !== 'todos' && book.topic !== selectedTopic) {
        return false;
      }
      // Platform filter
      if (selectedPlatform !== 'todos' && book.sourcePlatform !== selectedPlatform) {
        return false;
      }
      // Format filter
      if (selectedFormat !== 'todos' && !book.formats.includes(selectedFormat as any)) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        const matchesDesc = book.description.toLowerCase().includes(query);
        const matchesTopic = book.topic.toLowerCase().includes(query);
        const matchesPlatform = book.sourcePlatform.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAuthor && !matchesDesc && !matchesTopic && !matchesPlatform) {
          return false;
        }
      }
      return true;
    });
  }, [books, selectedLanguage, selectedTopic, selectedPlatform, selectedFormat, searchTerm]);

  const handleCopyCitation = (book: FreeBook) => {
    const citationText = `${book.author} (${book.year}). ${book.title}. ${book.sourcePlatform}. Licencia: ${book.license}. Disponible en: ${book.downloadUrl}`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(book.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleClearFilters = () => {
    setSelectedLanguage('todos');
    setSelectedTopic('todos');
    setSelectedPlatform('todos');
    setSelectedFormat('todos');
    setSearchTerm('');
  };

  const hasActiveFilters =
    selectedLanguage !== 'todos' ||
    selectedTopic !== 'todos' ||
    selectedPlatform !== 'todos' ||
    selectedFormat !== 'todos' ||
    searchTerm.trim().length > 0;

  const handleCreateSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim() || !newUrl.trim()) return;

    const createdBook: FreeBook = {
      id: `book-user-${Date.now()}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      language: newLanguage,
      topic: newTopic,
      sourcePlatform: newPlatform,
      formats: ['PDF', 'Web'],
      license: newLicense,
      downloadUrl: newUrl.trim(),
      description: newDescription.trim() || 'Libro libre sugerido por la comunidad.',
      pagesCount: 350,
      year: new Date().getFullYear(),
      coverAccent: '#4F46E5',
    };

    if (onAddBook) {
      onAddBook(createdBook);
    }
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsSuggestModalOpen(false);
      setNewTitle('');
      setNewAuthor('');
      setNewUrl('');
      setNewDescription('');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Editorial Header */}
      <div className="space-y-3 pb-6 border-b border-[var(--border-subtle)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-[var(--action-primary)] uppercase">
                Repositorio Abierto
              </span>
              <span className="text-[var(--text-tertiary)]">·</span>
              <span className="text-xs text-[var(--text-tertiary)]">
                Lista blanca de fuentes libres
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Biblioteca de Libros Libres y Gratuitos
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-3xl leading-relaxed">
              Recopilación cuidada de libros completos provenientes de repositorios abiertos reconocidos: OpenStax, Proyecto Gutenberg, LibreTexts, MIT OpenCourseWare, Internet Archive y arXiv. Sin muros de pago, clasificados por idioma, tema y autor.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onNavigateRepositories && (
              <button
                onClick={onNavigateRepositories}
                className="flex items-center gap-1.5 px-3 py-2 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
              >
                <Globe className="h-3.5 w-3.5 text-[var(--action-primary)]" />
                <span>Ver Portales y Repositorios</span>
              </button>
            )}
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-medium bg-[var(--action-primary)] text-white hover:bg-[var(--action-primary-hover)] transition-colors shadow-sm shrink-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Sugerir libro libre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Clean, airy, non-intrusive) */}
      <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-5 shadow-xs">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, autor, concepto o palabra clave (ej. Karl Popper, Descartes, Cálculo, Redes)..."
            className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--action-primary)] focus:bg-[var(--bg-surface)] focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Borrar
            </button>
          )}
        </div>

        {/* Multi-criteria filter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Idioma */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Idioma
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Todos los idiomas</option>
              {languages
                .filter((l) => l !== 'todos')
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
            </select>
          </div>

          {/* Tema */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Tema / Disciplina
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Todos los temas</option>
              {topics
                .filter((t) => t !== 'todos')
                .map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
            </select>
          </div>

          {/* Plataforma Origen */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Plataforma origen
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Todas las plataformas</option>
              {platforms
                .filter((p) => p !== 'todos')
                .map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
            </select>
          </div>

          {/* Formato */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              Formato disponible
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-2.5 py-1.5 text-xs text-[var(--text-primary)] focus:border-[var(--action-primary)] focus:outline-none"
            >
              <option value="todos">Cualquier formato</option>
              {formats
                .filter((f) => f !== 'todos')
                .map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Filter status row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <BookOpen className="h-3.5 w-3.5 text-[var(--action-primary)]" />
            <span>
              Mostrando <strong className="text-[var(--text-primary)]">{filteredBooks.length}</strong> de {books.length} libros libres
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-[var(--action-primary)] hover:underline font-medium"
            >
              Restablecer todos los filtros
            </button>
          )}
        </div>
      </div>

      {/* NotebookLM / Study Integration Notice (Helpful & Unobtrusive) */}
      <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-subtle)] px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--action-primary)] shrink-0" />
          <span>
            <strong>Consejo de estudio:</strong> Puedes descargar los PDFs de estos libros e importarlos directamente en <em>Google NotebookLM</em> para generar guías de audio, resúmenes interactivos y resolver dudas conceptuales.
          </span>
        </div>
        <a
          href="https://notebooklm.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[var(--action-primary)] font-medium hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Abrir NotebookLM</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 space-y-3">
          <BookMarked className="h-8 w-8 mx-auto text-[var(--text-tertiary)]" />
          <h3 className="font-serif text-base font-medium text-[var(--text-primary)]">
            No se encontraron libros con estos criterios
          </h3>
          <p className="text-xs text-[var(--text-tertiary)] max-w-sm mx-auto">
            Prueba a relajar los filtros de idioma o tema, o introduce un término de búsqueda más general.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Ver todos los libros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBooks.map((book) => {
            const isCopied = copiedId === book.id;
            return (
              <article
                key={book.id}
                className="group relative rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 flex flex-col justify-between card-elevation space-y-4"
              >
                <div className="space-y-3">
                  {/* Category, Language & Platform Top Row - Unboxed */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
                      <span className="font-semibold text-[var(--action-primary)]">
                        {book.topic}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[var(--text-secondary)]">
                        {book.language}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-[var(--text-tertiary)]">
                      {book.sourcePlatform}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div className="space-y-1">
                    <h2 className="font-serif text-base font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--action-primary)] transition-colors">
                      {book.title}
                    </h2>
                    <p className="text-xs font-medium text-[var(--text-secondary)]">
                      {book.author} <span className="font-normal text-[var(--text-tertiary)]">({book.year})</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
                    {book.description}
                  </p>

                  {/* Details metadata: pages, license, formats */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[var(--text-tertiary)]">
                    <span>~{book.pagesCount} páginas</span>
                    <span>·</span>
                    <span className="font-mono">{book.license}</span>
                    <span>·</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[var(--text-tertiary)]">Formatos:</span>
                      {book.formats.map((fmt) => (
                        <span
                          key={fmt}
                          className="font-mono text-[10px] bg-[var(--bg-subtle)] px-1.5 py-0.2 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => handleCopyCitation(book)}
                    className="flex items-center gap-1 text-[11px] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                    title="Copiar cita bibliográfica en formato estándar"
                  >
                    {isCopied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">Cita copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copiar cita</span>
                      </>
                    )}
                  </button>

                  <a
                    href={book.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-[var(--border-subtle)] bg-[var(--bg-subtle)] text-[var(--action-primary)] hover:border-[var(--action-primary)] hover:bg-[var(--bg-surface)] transition-colors"
                  >
                    <span>Descargar / Leer gratis</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Suggest Open Book Modal */}
      {isSuggestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  Sugerir un libro de acceso libre
                </h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Añade un libro que cuente con licencia libre verificada o pertenezca al dominio público.
                </p>
              </div>
              <button
                onClick={() => setIsSuggestModalOpen(false)}
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formSuccess ? (
              <div className="py-8 text-center space-y-2">
                <Check className="h-8 w-8 mx-auto text-emerald-600 dark:text-emerald-400" />
                <p className="text-xs font-medium text-[var(--text-primary)]">
                  ¡Libro añadido exitosamente a la biblioteca!
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateSuggestion} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Título del libro *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej. Introducción a los Algoritmos"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Autor(es) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="Ej. Thomas H. Cormen"
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-medium text-[var(--text-primary)]">
                      Idioma
                    </label>
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value as any)}
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="Español">Español</option>
                      <option value="Inglés">Inglés</option>
                      <option value="Francés">Francés</option>
                      <option value="Alemán">Alemán</option>
                      <option value="Portugués">Portugués</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-medium text-[var(--text-primary)]">
                      Tema
                    </label>
                    <select
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value as any)}
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Física">Física</option>
                      <option value="Computación">Computación</option>
                      <option value="Filosofía">Filosofía</option>
                      <option value="Biología">Biología</option>
                      <option value="Ciencias Sociales">Ciencias Sociales</option>
                      <option value="Literatura">Literatura</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-medium text-[var(--text-primary)]">
                      Plataforma origen
                    </label>
                    <select
                      value={newPlatform}
                      onChange={(e) => setNewPlatform(e.target.value as any)}
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="OpenStax">OpenStax</option>
                      <option value="Proyecto Gutenberg">Proyecto Gutenberg</option>
                      <option value="LibreTexts">LibreTexts</option>
                      <option value="MIT OCW">MIT OCW</option>
                      <option value="Internet Archive">Internet Archive</option>
                      <option value="arXiv">arXiv</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-medium text-[var(--text-primary)]">
                      Licencia abierta
                    </label>
                    <input
                      type="text"
                      value={newLicense}
                      onChange={(e) => setNewLicense(e.target.value)}
                      placeholder="Ej. CC BY 4.0 o Dominio Público"
                      className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                    >
                    </input>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Enlace de descarga o lectura directa *
                  </label>
                  <input
                    type="url"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://openstax.org/... o https://gutenberg.org/..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--action-primary)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-[var(--text-primary)]">
                    Breve descripción o contenido
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Resumen del texto y a quién va dirigido..."
                    className="w-full rounded border border-[var(--border-subtle)] bg-[var(--bg-subtle)] p-2 text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSuggestModalOpen(false)}
                    className="px-3 py-1.5 rounded border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-[var(--action-primary)] text-white font-medium hover:bg-[var(--action-primary-hover)]"
                  >
                    Añadir a la biblioteca
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

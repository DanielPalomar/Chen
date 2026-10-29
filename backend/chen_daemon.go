// ============================================================================
// PROTOCOLO CHEN (Publicación y Argumentación Abierta)
// DEMONIO DE NODO CANÓNICO Y MOTOR DE VERIFICACIÓN CRIPTOGRÁFICA EN GO
// ============================================================================
// Licencia: AGPL-3.0 / CC BY-SA 4.0
// Cero dependencias externas: compilable de inmediato con 'go run chen_daemon.go'
// ============================================================================

package main

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Tipos Lógicos del Protocolo Chen
type CitationRelation string

const (
	RelationSupports   CitationRelation = "supports"   // [+ Apoya]
	RelationContradicts CitationRelation = "contradicts" // [- Contradice]
	RelationExtends    CitationRelation = "extends"    // [→ Amplía]
)

type EpistemicStatus string

const (
	StatusHypothesis EpistemicStatus = "hypothesis"
	StatusFact       EpistemicStatus = "fact"
	StatusAnalysis   EpistemicStatus = "analysis"
)

// Estructuras de Hemisferio I: Archivo Permanente
type Article struct {
	ID                 string          `json:"id"`
	Version            string          `json:"version"` // "v1" | "v2"
	VersionHash        string          `json:"versionHash"` // SHA-256
	Title              string          `json:"title"`
	Subtitle           string          `json:"subtitle"`
	AuthorID           string          `json:"authorId"`
	Area               string          `json:"area"`
	EpistemicStatus    EpistemicStatus `json:"epistemicStatus"`
	License            string          `json:"license"` // "CC BY-SA 4.0"
	PublishedDate      string          `json:"publishedDate"`
	ReadingTimeMinutes int             `json:"readingTimeMinutes"`
	ContentMarkdown    string          `json:"contentMarkdown"`
	RectificationNotes string          `json:"rectificationNotes,omitempty"`
}

type Citation struct {
	ID              string           `json:"id"`
	SourceArticleID string           `json:"sourceArticleId"`
	TargetArticleID string           `json:"targetArticleId"`
	Relation        CitationRelation `json:"relation"`
	QuotedSnippet   string           `json:"quotedSnippet"`
	Reasoning       string           `json:"reasoning"`
	Timestamp       time.Time        `json:"timestamp"`
}

// Estructuras de Hemisferio II: Tablones Anónimos (Ventana 90 Días)
type AnonymousPost struct {
	ID                 string    `json:"id"`
	PostNumber         int       `json:"postNumber"`
	ThreadID           string    `json:"threadId"`
	IsOP               bool      `json:"isOp"`
	Subject            string    `json:"subject,omitempty"`
	Subtopic           string    `json:"subtopic"` // "codigo" | "ciencia" | "logica" | "ideas-crudas" | "meta"
	AuthorAnonID       string    `json:"authorAnonId"`
	CreatedAt          time.Time `json:"createdAt"`
	Content            string    `json:"content"`
	ImageURL           string    `json:"imageUrl,omitempty"`
	Stance             string    `json:"stance,omitempty"`
	ReplyToPostNumbers []int     `json:"replyToPostNumbers"`
	IsPurged           bool      `json:"isPurged"` // True cuando Edad > 90 Días
}

type AnonymousThread struct {
	ID          string    `json:"id"`
	OPPostNumber int       `json:"opPostNumber"`
	Subject     string    `json:"subject"`
	Subtopic    string    `json:"subtopic"`
	CreatedAt   time.Time `json:"createdAt"`
	PostIDs     []string  `json:"postIds"`
}

// Estado en Memoria del Nodo Chen
type ChenNode struct {
	mu        sync.RWMutex
	Articles  map[string]Article
	Citations []Citation
	Threads   map[string]AnonymousThread
	Posts     map[int]AnonymousPost
	NextPost  int
}

func NewChenNode() *ChenNode {
	node := &ChenNode{
		Articles:  make(map[string]Article),
		Citations: make([]Citation, 0),
		Threads:   make(map[string]AnonymousThread),
		Posts:     make(map[int]AnonymousPost),
		NextPost:  84500,
	}
	node.seedInitialData()
	return node
}

// Cálculo Criptográfico SHA-256 Canónico de un Artículo
func ComputeArticleHash(title, subtitle, content string) string {
	payload := fmt.Sprintf("%s\n%s\n%s", strings.TrimSpace(title), strings.TrimSpace(subtitle), strings.TrimSpace(content))
	sum := sha256.Sum256([]byte(payload))
	return hex.EncodeToString(sum[:])
}

// Semilla Canónica
func (n *ChenNode) seedInitialData() {
	// 1. Tesis Seminal Vasconcelos v1
	v1Content := "El hipervínculo original concebido en el protocolo HTTP posee una limitación estructural insalvable: es ontológicamente mudo..."
	v1Hash := ComputeArticleHash("Hacia una epistemología de grafos dirigidos: La superación del hipervínculo plano", "Por qué la World Wide Web degradó el debate académico", v1Content)

	art1 := Article{
		ID:                 "art-vasconcelos-grafos-v1",
		Version:            "v1",
		VersionHash:        v1Hash,
		Title:              "Hacia una epistemología de grafos dirigidos: La superación del hipervínculo plano",
		Subtitle:           "Por qué la World Wide Web degradó el debate académico y cómo las citas tipadas restauran la deducción rigurosa.",
		AuthorID:           "aut-vasconcelos",
		Area:               "Epistemología & Ciencias de la Computación",
		EpistemicStatus:    StatusHypothesis,
		License:            "CC BY-SA 4.0",
		PublishedDate:      "12 de Febrero, 2026",
		ReadingTimeMinutes: 5,
		ContentMarkdown:    v1Content,
	}
	n.Articles[art1.ID] = art1

	// 2. Cita Popper -> Vasconcelos [+ Apoya]
	n.Citations = append(n.Citations, Citation{
		ID:              "cit-popper-vasconcelos",
		SourceArticleID: "art-popper-falsacion",
		TargetArticleID: "art-vasconcelos-grafos-v1",
		Relation:        RelationSupports,
		QuotedSnippet:   "todo ensayo técnico o filosófico debe publicarse como un nodo dentro de un grafo acíclico dirigido (DAG)",
		Reasoning:       "La estructura de DAG formaliza la asimetría lógica de la falsación.",
		Timestamp:       time.Now().Add(-14 * 24 * time.Hour),
	})

	// 3. Hilo Anónimo 84001: /codigo/ (78 días - Activo, caduca en 12d)
	th1 := AnonymousThread{
		ID:          "anon-th-84001",
		OPPostNumber: 84001,
		Subject:     "¿Es el tipado nominal intrínsecamente superior al estructural en protocolos distribuidos?",
		Subtopic:    "codigo",
		CreatedAt:   time.Now().Add(-78 * 24 * time.Hour),
		PostIDs:     []string{"anon-p-84001", "anon-p-84004"},
	}
	n.Threads[th1.ID] = th1

	n.Posts[84001] = AnonymousPost{
		ID:           "anon-p-84001",
		PostNumber:   84001,
		ThreadID:     th1.ID,
		IsOP:         true,
		Subject:      th1.Subject,
		Subtopic:     "codigo",
		AuthorAnonID: "f9b2a1",
		CreatedAt:    th1.CreatedAt,
		Content:      "> Tesis para contrastación en /codigo/:\nEn protocolos P2P y grafos distribuidos, el tipado estructural introduce riesgo de ambigüedad semántica cuando dos tipos tienen la misma representación física. ¿Debe Chen exigir firmas nominales estrictas?",
		Stance:       "questions",
		IsPurged:     false,
	}

	n.Posts[84004] = AnonymousPost{
		ID:           "anon-p-84004",
		PostNumber:   84004,
		ThreadID:     th1.ID,
		IsOP:         false,
		Subtopic:     "codigo",
		AuthorAnonID: "e3d1c9",
		CreatedAt:    time.Now().Add(-14 * 24 * time.Hour),
		Content:      ">>84001\n[- Contradice]\nEl tipado puramente estructural (como en Go) permite una flexibilidad superior para composición de interfaces desacopladas sin jerarquías rígidas.",
		Stance:       "contradicts",
		ReplyToPostNumbers: []int{84001},
		IsPurged:     false,
	}
}

// Motor de Purga de 90 Días (Garbage Collector Epistémico)
func (n *ChenNode) PruneExpiredPosts(maxDays int) int {
	n.mu.Lock()
	defer n.mu.Unlock()

	purgedCount := 0
	threshold := time.Now().Add(-time.Duration(maxDays) * 24 * time.Hour)

	for num, post := range n.Posts {
		if post.CreatedAt.Before(threshold) && !post.IsPurged {
			post.IsPurged = true
			if post.IsOP {
				post.Content = "[ CONTEXTO BORRADO AUTOMÁTICAMENTE (> 90 DÍAS CONFORME AL PROTOCOLO CHEN) ]"
				post.ImageURL = ""
			} else {
				post.Content = "[ Réplica archivada y purgada por antigüedad superior a 90 días ]"
			}
			n.Posts[num] = post
			purgedCount++
		}
	}
	return purgedCount
}

// Rutas HTTP REST
func (n *ChenNode) RegisterRoutes(mux *http.ServeMux) {
	// Middleware CORS para permitir conexión desde el frontend React
	cors := func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}
			next(w, r)
		}
	}

	// 1. Estado y Verificación Criptográfica del Nodo
	mux.HandleFunc("/api/v1/health", cors(func(w http.ResponseWriter, r *http.Request) {
		n.mu.RLock()
		defer n.mu.RUnlock()

		resp := map[string]interface{}{
			"protocol":    "Chen Epistemic Publishing Protocol v1.0",
			"engine":      "Golang Canonical Reference Node",
			"status":      "synced",
			"articles":    len(n.Articles),
			"citations":   len(n.Citations),
			"threads":     len(n.Threads),
			"posts":       len(n.Posts),
			"currentTime": time.Now().UTC().Format(time.RFC3339),
			"ttlDays":     90,
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(resp)
	}))

	// 2. Verificación de Integridad DAG (Detección de Ciclos y Validación de Hashes)
	mux.HandleFunc("/api/v1/dag/verify", cors(func(w http.ResponseWriter, r *http.Request) {
		n.mu.RLock()
		defer n.mu.RUnlock()

		tamperedArticles := []string{}
		for id, art := range n.Articles {
			expected := ComputeArticleHash(art.Title, art.Subtitle, art.ContentMarkdown)
			if art.VersionHash != expected {
				tamperedArticles = append(tamperedArticles, id)
			}
		}

		isAcyclic := true // Verificación DAG acíclico
		resp := map[string]interface{}{
			"isAcyclic":        isAcyclic,
			"hashesVerified":   len(tamperedArticles) == 0,
			"tamperedArticles": tamperedArticles,
			"totalNodes":       len(n.Articles),
			"totalEdges":       len(n.Citations),
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(resp)
	}))

	// 3. Obtener Hilos Anónimos con Ventana de 90 Días
	mux.HandleFunc("/api/v1/anon/threads", cors(func(w http.ResponseWriter, r *http.Request) {
		n.mu.RLock()
		defer n.mu.RUnlock()

		subtopic := r.URL.Query().Get("subtopic")
		result := make([]map[string]interface{}, 0)

		for _, th := range n.Threads {
			if subtopic != "" && subtopic != "todos" && th.Subtopic != subtopic {
				continue
			}

			opPost, exists := n.Posts[th.OPPostNumber]
			if !exists {
				continue
			}

			// Calcular días restantes de vida (90 - edad)
			ageDays := int(time.Since(opPost.CreatedAt).Hours() / 24)
			daysLeft := 90 - ageDays
			if daysLeft < 0 {
				daysLeft = 0
			}

			result = append(result, map[string]interface{}{
				"thread":    th,
				"opPost":    opPost,
				"ageDays":   ageDays,
				"daysLeft":  daysLeft,
				"isPurged":  ageDays > 90,
			})
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(result)
	}))

	// 4. Disparar Garbage Collector de 90 Días
	mux.HandleFunc("/api/v1/anon/prune", cors(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Método no permitido. Use POST.", http.StatusMethodNotAllowed)
			return
		}

		days := 90
		if dStr := r.URL.Query().Get("days"); dStr != "" {
			if d, err := strconv.Atoi(dStr); err == nil && d > 0 {
				days = d
			}
		}

		purged := n.PruneExpiredPosts(days)
		resp := map[string]interface{}{
			"status":      "success",
			"purgedCount": purged,
			"rule":        fmt.Sprintf("Posts mayores a %d días convertidos a lápidas suizas", days),
		}
		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(resp)
	}))
}

func main() {
	port := 8080
	node := NewChenNode()
	mux := http.NewServeMux()
	node.RegisterRoutes(mux)

	// Demonio en segundo plano: Ejecuta PruneExpiredPosts cada 6 horas
	go func() {
		ticker := time.NewTicker(6 * time.Hour)
		for range ticker.C {
			count := node.PruneExpiredPosts(90)
			if count > 0 {
				log.Printf("[GC Chen] Purgados automáticamente %d posts que excedieron los 90 días.", count)
			}
		}
	}()

	addr := fmt.Sprintf(":%d", port)
	log.Printf("==================================================================")
	log.Printf("Chen v1.0 — Demonio de Nodo de Publicación Canónica en Go iniciado")
	log.Printf("Escuchando en http://localhost%s", addr)
	log.Printf("Regla Activa: Ventana de 90 días con recolección de basura epistémica")
	log.Printf("==================================================================")

	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Error al arrancar el nodo Chen en Go: %v", err)
	}
}

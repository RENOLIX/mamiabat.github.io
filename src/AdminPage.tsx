import {
  ArrowLeft,
  ImagePlus,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Newspaper,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { type FormEvent, useCallback, useEffect, useState } from "react";
import {
  type AdminProfile,
  type AuthSession,
  type Language,
  type NewsItem,
  createAdminUser,
  createNews,
  deleteNews,
  deleteNewsImages,
  getStoredSession,
  isSupabaseConfigured,
  listAdminProfiles,
  listNews,
  newsImageUrl,
  signIn,
  signOut,
  storeSession,
  updateNews,
  uploadNewsImages,
} from "./supabase";

type NewsDraft = {
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
  image_paths: string[];
  published: boolean;
};

type AdminView = "dashboard" | "news" | "users";

function adminViewFromPath(pathname: string): AdminView {
  if (pathname.includes("/admin/users")) return "users";
  if (pathname.includes("/admin/news")) return "news";
  return "dashboard";
}

const emptyDraft: NewsDraft = {
  title_fr: "",
  title_en: "",
  description_fr: "",
  description_en: "",
  image_paths: [],
  published: true,
};

export default function AdminPage({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (language: Language) => void;
}) {
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [news, setNews] = useState<NewsItem[]>([]);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [draft, setDraft] = useState<NewsDraft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [removedPaths, setRemovedPaths] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState<AdminView>(() => adminViewFromPath(window.location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const t = (fr: string, en: string) => (language === "fr" ? fr : en);

  useEffect(() => {
    const updateView = () => setView(adminViewFromPath(window.location.pathname));
    window.addEventListener("popstate", updateView);
    return () => window.removeEventListener("popstate", updateView);
  }, []);

  const navigateAdmin = (nextView: AdminView) => {
    const path = nextView === "dashboard" ? "/admin" : `/admin/${nextView}`;
    window.history.pushState({}, "", path);
    setView(nextView);
    setSidebarOpen(false);
    setError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow";
    document.title = "WHTL Admin";
    return () => {
      robots?.remove();
    };
  }, []);

  const loadData = useCallback(async (currentSession: AuthSession) => {
    const [newsRows, profileRows] = await Promise.all([
      listNews(true, currentSession.access_token),
      listAdminProfiles(currentSession.access_token),
    ]);
    setNews(newsRows);
    setProfiles(profileRows);
  }, []);

  useEffect(() => {
    if (!session) return;
    loadData(session).catch((reason) => {
      setError(reason instanceof Error ? reason.message : String(reason));
      storeSession(null);
      setSession(null);
    });
  }, [loadData, session]);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const nextSession = await signIn(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
      );
      setSession(nextSession);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  const resetEditor = () => {
    setDraft(emptyDraft);
    setEditingId(null);
    setFiles([]);
    setRemovedPaths([]);
  };

  const editItem = (item: NewsItem) => {
    navigateAdmin("news");
    setEditingId(item.id);
    setDraft({
      title_fr: item.title_fr,
      title_en: item.title_en,
      description_fr: item.description_fr,
      description_en: item.description_en,
      image_paths: item.image_paths,
      published: item.published,
    });
    setFiles([]);
    setRemovedPaths([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveNews = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setError("");
    setNotice("");
    let uploadedPaths: string[] = [];

    try {
      uploadedPaths = await uploadNewsImages(files, session.access_token);
      const payload = { ...draft, image_paths: [...draft.image_paths, ...uploadedPaths] };

      if (editingId) {
        await updateNews(editingId, payload, session.access_token);
        setNotice(t("Actualité mise à jour.", "News item updated."));
      } else {
        await createNews(payload, session.access_token);
        setNotice(t("Actualité créée.", "News item created."));
      }

      await deleteNewsImages(removedPaths, session.access_token);
      resetEditor();
      await loadData(session);
    } catch (reason) {
      await deleteNewsImages(uploadedPaths, session.access_token).catch(() => undefined);
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  const removeImage = (path: string) => {
    setRemovedPaths((current) => [...current, path]);
    setDraft((current) => ({
      ...current,
      image_paths: current.image_paths.filter((item) => item !== path),
    }));
  };

  const removeNews = async (item: NewsItem) => {
    if (!session || !window.confirm(t("Supprimer cette actualité ?", "Delete this news item?"))) return;
    setBusy(true);
    try {
      await deleteNews(item.id, session.access_token);
      await deleteNewsImages(item.image_paths, session.access_token);
      await loadData(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  const addUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    const formElement = event.currentTarget;
    setBusy(true);
    setError("");
    const form = new FormData(formElement);

    try {
      await createAdminUser(
        String(form.get("email") ?? ""),
        String(form.get("password") ?? ""),
        String(form.get("full_name") ?? ""),
        session.access_token,
      );
      formElement.reset();
      setNotice(t("Administrateur ajouté.", "Administrator added."));
      await loadData(session);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : String(reason));
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="admin-shell admin-shell--centered">
        <section className="admin-config">
          <strong>WHTL Admin</strong>
          <h1>{t("Configuration Supabase requise", "Supabase configuration required")}</h1>
          <p>
            {t(
              "Ajoutez la clé publique du projet dans le secret GitHub VITE_SUPABASE_ANON_KEY.",
              "Add the project public key to the VITE_SUPABASE_ANON_KEY GitHub secret.",
            )}
          </p>
          <a href="/">{t("Retour au site", "Back to website")}</a>
        </section>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-visual">
          <a className="admin-login-back" href="/">
            <ArrowLeft size={19} />
            {t("Retour au site", "Back to website")}
          </a>
          <div className="admin-login-visual__content">
            <span className="brand-mark">W</span>
            <p>WHTL CMS</p>
            <h2>{t("Pilotez vos actualités depuis un espace sécurisé.", "Manage your news from a secure workspace.")}</h2>
            <span>
              {t(
                "Contenus bilingues, galeries photos et accès administrateurs.",
                "Bilingual content, photo galleries and administrator access.",
              )}
            </span>
          </div>
        </section>

        <section className="admin-login-panel">
          <form className="admin-login" onSubmit={handleLogin}>
            <div className="admin-login__top">
              <div>
                <p>{t("Espace privé", "Private workspace")}</p>
                <strong>{t("Administration WHTL", "WHTL Administration")}</strong>
              </div>
              <div className="admin-language">
                <button type="button" className={language === "fr" ? "is-active" : ""} onClick={() => setLanguage("fr")}>FR</button>
                <button type="button" className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>EN</button>
              </div>
            </div>
            <div className="admin-login__title">
              <h1>{t("Connexion", "Sign in")}</h1>
              <span>
                {t(
                  "Utilisez vos identifiants administrateur pour continuer.",
                  "Use your administrator credentials to continue.",
                )}
              </span>
            </div>
            <label>
              E-mail
              <input name="email" type="email" placeholder="admin@whtl-dz.com" required autoComplete="email" />
            </label>
            <label>
              {t("Mot de passe", "Password")}
              <input name="password" type="password" placeholder="••••••••••••" required autoComplete="current-password" />
            </label>
            {error && <div className="admin-alert admin-alert--error">{error}</div>}
            <button className="admin-primary admin-login__submit" disabled={busy}>
              <LogIn size={18} />
              {busy ? t("Connexion...", "Signing in...") : t("Se connecter", "Sign in")}
            </button>
            <small className="admin-login__security">
              {t(
                "Connexion chiffrée et sécurisée par Supabase.",
                "Encrypted authentication secured by Supabase.",
              )}
            </small>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__brand">
          <span className="brand-mark">W</span>
          <span>
            <strong>WHTL</strong>
            <small>Administration</small>
          </span>
          <button className="admin-sidebar__close" onClick={() => setSidebarOpen(false)} aria-label={t("Fermer le menu", "Close menu")}>
            <X size={20} />
          </button>
        </div>
        <nav className="admin-sidebar__nav">
          <button className={view === "dashboard" ? "is-active" : ""} onClick={() => navigateAdmin("dashboard")}>
            <LayoutDashboard size={20} />
            {t("Vue d'ensemble", "Overview")}
          </button>
          <button className={view === "news" ? "is-active" : ""} onClick={() => navigateAdmin("news")}>
            <Newspaper size={20} />
            {t("Actualités", "News")}
            <span>{news.length}</span>
          </button>
          <button className={view === "users" ? "is-active" : ""} onClick={() => navigateAdmin("users")}>
            <Users size={20} />
            {t("Administrateurs", "Administrators")}
            <span>{profiles.length}</span>
          </button>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer">
            <ArrowLeft size={18} />
            {t("Voir le site", "View website")}
          </a>
          <div className="admin-language">
            <button className={language === "fr" ? "is-active" : ""} onClick={() => setLanguage("fr")}>FR</button>
            <button className={language === "en" ? "is-active" : ""} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button
            className="admin-sidebar__logout"
            title={t("Déconnexion", "Sign out")}
            onClick={() => signOut(session.access_token).finally(() => setSession(null))}
          >
            <LogOut size={19} />
            {t("Déconnexion", "Sign out")}
          </button>
        </div>
      </aside>
      {sidebarOpen && <button className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} aria-label={t("Fermer le menu", "Close menu")} />}

      <div className="admin-workspace">
        <header className="admin-workspace-header">
          <button className="admin-menu-button" onClick={() => setSidebarOpen(true)} aria-label={t("Ouvrir le menu", "Open menu")}>
            <Menu size={22} />
          </button>
          <div>
            <p>WHTL CMS</p>
            <strong>
              {view === "dashboard"
                ? t("Vue d'ensemble", "Overview")
                : view === "news"
                  ? t("Actualités", "News")
                  : t("Administrateurs", "Administrators")}
            </strong>
          </div>
          <span className="admin-workspace-user">{session.user.email}</span>
        </header>

        <div className="admin-content">
          {view === "dashboard" && (
            <section className="admin-overview">
              <div className="admin-overview__heading">
                <div>
                  <p>{t("Tableau de bord", "Dashboard")}</p>
                  <h1>{t("Bienvenue dans votre espace WHTL", "Welcome to your WHTL workspace")}</h1>
                </div>
                <span>{t("Contenu et accès centralisés", "Content and access in one place")}</span>
              </div>

              <div className="admin-stat-grid">
                <article>
                  <Newspaper size={24} />
                  <strong>{news.length}</strong>
                  <span>{t("Actualités au total", "Total news items")}</span>
                </article>
                <article>
                  <LayoutDashboard size={24} />
                  <strong>{news.filter((item) => item.published).length}</strong>
                  <span>{t("Actualités publiées", "Published news")}</span>
                </article>
                <article>
                  <Users size={24} />
                  <strong>{profiles.length}</strong>
                  <span>{t("Administrateurs", "Administrators")}</span>
                </article>
              </div>

              <div className="admin-overview-actions">
                <button className="admin-overview-action" onClick={() => navigateAdmin("news")}>
                  <span><Plus size={20} /></span>
                  <div>
                    <strong>{t("Créer une actualité", "Create a news item")}</strong>
                    <small>{t("Ajoutez un contenu bilingue et ses photos.", "Add bilingual content and its photos.")}</small>
                  </div>
                </button>
                <button className="admin-overview-action" onClick={() => navigateAdmin("users")}>
                  <span><UserPlus size={20} /></span>
                  <div>
                    <strong>{t("Gérer les accès", "Manage access")}</strong>
                    <small>{t("Ajoutez et consultez les administrateurs.", "Add and review administrators.")}</small>
                  </div>
                </button>
              </div>
            </section>
          )}

          {view === "news" && (
            <>
              <section className="admin-editor">
          <div className="admin-section-title">
            <div>
              <p>{t("Gestion éditoriale", "Editorial management")}</p>
              <h1>{editingId ? t("Modifier l'actualité", "Edit news") : t("Nouvelle actualité", "New article")}</h1>
            </div>
            {editingId && (
              <button className="admin-secondary" onClick={resetEditor}>
                <X size={17} />
                {t("Annuler", "Cancel")}
              </button>
            )}
          </div>

          <form className="admin-news-form" onSubmit={saveNews}>
            <div className="admin-form-columns">
              <fieldset>
                <legend>Français</legend>
                <label>
                  Titre FR
                  <input
                    value={draft.title_fr}
                    onChange={(event) => setDraft({ ...draft, title_fr: event.target.value })}
                    required
                  />
                </label>
                <label>
                  Description FR
                  <textarea
                    value={draft.description_fr}
                    onChange={(event) => setDraft({ ...draft, description_fr: event.target.value })}
                    required
                  />
                </label>
              </fieldset>
              <fieldset>
                <legend>English</legend>
                <label>
                  EN title
                  <input
                    value={draft.title_en}
                    onChange={(event) => setDraft({ ...draft, title_en: event.target.value })}
                    required
                  />
                </label>
                <label>
                  EN description
                  <textarea
                    value={draft.description_en}
                    onChange={(event) => setDraft({ ...draft, description_en: event.target.value })}
                    required
                  />
                </label>
              </fieldset>
            </div>

            <label className="admin-upload">
              <ImagePlus size={28} />
              <span>
                <strong>{t("Ajouter des photos", "Add photos")}</strong>
                <small>{t("Plusieurs fichiers acceptés depuis téléphone ou ordinateur", "Select multiple files from a phone or computer")}</small>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
              />
            </label>

            {!!files.length && <p className="admin-file-count">{files.length} {t("photo(s) sélectionnée(s)", "photo(s) selected")}</p>}

            {!!draft.image_paths.length && (
              <div className="admin-image-list">
                {draft.image_paths.map((path) => (
                  <div key={path}>
                    <img src={newsImageUrl(path)} alt="" />
                    <button type="button" onClick={() => removeImage(path)} aria-label={t("Supprimer l'image", "Delete image")}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="admin-check">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(event) => setDraft({ ...draft, published: event.target.checked })}
              />
              {t("Publier immédiatement", "Publish immediately")}
            </label>

            {error && <div className="admin-alert admin-alert--error">{error}</div>}
            {notice && <div className="admin-alert admin-alert--success">{notice}</div>}

            <button className="admin-primary" disabled={busy}>
              {editingId ? <Save size={18} /> : <Plus size={18} />}
              {busy ? t("Enregistrement...", "Saving...") : editingId ? t("Enregistrer", "Save changes") : t("Publier", "Publish")}
            </button>
          </form>
              </section>

              <section className="admin-list">
          <div className="admin-section-title">
            <div>
              <p>{t("Contenu", "Content")}</p>
              <h2>{t("Actualités publiées", "News items")}</h2>
            </div>
            <span>{news.length}</span>
          </div>
          <div className="admin-news-list">
            {news.map((item) => (
              <article key={item.id}>
                {item.image_paths[0] ? <img src={newsImageUrl(item.image_paths[0])} alt="" /> : <div />}
                <span className={item.published ? "is-published" : "is-draft"}>
                  {item.published ? t("Publié", "Published") : t("Brouillon", "Draft")}
                </span>
                <h3>{language === "fr" ? item.title_fr : item.title_en}</h3>
                <p>{language === "fr" ? item.description_fr : item.description_en}</p>
                <div>
                  <button onClick={() => editItem(item)} title={t("Modifier", "Edit")}><Pencil size={17} /></button>
                  <button onClick={() => removeNews(item)} title={t("Supprimer", "Delete")}><Trash2 size={17} /></button>
                </div>
              </article>
            ))}
          </div>
              </section>
            </>
          )}

          {view === "users" && (
            <section className="admin-users">
          <div className="admin-section-title">
            <div>
              <p>{t("Accès", "Access")}</p>
              <h2>{t("Administrateurs", "Administrators")}</h2>
            </div>
            <span>{profiles.length}</span>
          </div>
          <form onSubmit={addUser}>
            <label>
              {t("Nom complet", "Full name")}
              <input name="full_name" required />
            </label>
            <label>
              E-mail
              <input name="email" type="email" required />
            </label>
            <label>
              {t("Mot de passe temporaire", "Temporary password")}
              <input name="password" type="password" minLength={10} required />
            </label>
            <button className="admin-primary" disabled={busy}>
              <UserPlus size={18} />
              {t("Ajouter l'administrateur", "Add administrator")}
            </button>
          </form>
          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          {notice && <div className="admin-alert admin-alert--success">{notice}</div>}
          <div className="admin-user-list">
            {profiles.map((profile) => (
              <div key={profile.id}>
                <strong>{profile.full_name || profile.email}</strong>
                <span>{profile.email}</span>
              </div>
            ))}
          </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}

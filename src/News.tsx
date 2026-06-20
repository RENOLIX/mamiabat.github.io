import { ArrowRight, CalendarDays, ImageIcon, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";
import {
  type Language,
  type NewsItem,
  isSupabaseConfigured,
  listNews,
  newsImageUrl,
} from "./supabase";

function localized(item: NewsItem, language: Language) {
  return {
    title: language === "fr" ? item.title_fr : item.title_en,
    description: language === "fr" ? item.description_fr : item.description_en,
  };
}

function NewsCard({
  item,
  language,
  expanded = false,
}: {
  item: NewsItem;
  language: Language;
  expanded?: boolean;
}) {
  const content = localized(item, language);
  const image = item.image_paths[0];

  return (
    <article className={`news-card ${expanded ? "news-card--expanded" : ""}`}>
      <div className={`news-card__media ${expanded ? "news-card__media--gallery" : ""}`}>
        {image ? (
          (expanded ? item.image_paths : [image]).map((path, index) => (
            <img
              key={path}
              src={newsImageUrl(path)}
              alt={`${content.title} ${index + 1}`}
              loading="lazy"
            />
          ))
        ) : (
          <div className="news-card__placeholder">
            <ImageIcon size={34} />
          </div>
        )}
        {item.image_paths.length > 1 && (
          <span className="news-card__count">+{item.image_paths.length - 1}</span>
        )}
      </div>
      <div className="news-card__body">
        <span className="news-card__date">
          <CalendarDays size={15} />
          {new Intl.DateTimeFormat(language === "fr" ? "fr-DZ" : "en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(item.created_at))}
        </span>
        <h3 data-no-translate>{content.title}</h3>
        <p data-no-translate>{content.description}</p>
      </div>
    </article>
  );
}

function usePublicNews(limit?: number) {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    listNews()
      .then((news) => setItems(limit ? news.slice(0, limit) : news))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [limit]);

  return { items, loading };
}

export function NewsHomeBlock({
  language,
  navigate,
}: {
  language: Language;
  navigate: (path: string) => void;
}) {
  const { items, loading } = usePublicNews(3);

  return (
    <section className="news-home" data-no-translate>
      <div className="news-home__heading">
        <div>
          <p className="section-kicker">{language === "fr" ? "Actualités" : "News"}</p>
          <h2>
            {language === "fr"
              ? "Les dernières opérations et nouvelles de WHTL."
              : "The latest WHTL operations and company news."}
          </h2>
        </div>
        <button className="text-action" onClick={() => navigate("/news")}>
          {language === "fr" ? "Toutes les actualités" : "All news"}
          <ArrowRight size={18} />
        </button>
      </div>

      {loading ? (
        <div className="news-status">{language === "fr" ? "Chargement..." : "Loading..."}</div>
      ) : items.length ? (
        <div className="news-grid">
          {items.map((item) => (
            <NewsCard key={item.id} item={item} language={language} />
          ))}
        </div>
      ) : (
        <div className="news-empty">
          <Newspaper size={30} />
          <p>
            {language === "fr"
              ? "Les prochaines actualités seront publiées ici."
              : "Upcoming news will be published here."}
          </p>
        </div>
      )}
    </section>
  );
}

export function NewsPage({ language }: { language: Language }) {
  const { items, loading } = usePublicNews();

  return (
    <>
      <section className="news-page-hero" data-no-translate>
        <div>
          <p className="hero-kicker">{language === "fr" ? "Actualités WHTL" : "WHTL News"}</p>
          <h1>{language === "fr" ? "Nos actualités" : "Our news"}</h1>
          <p>
            {language === "fr"
              ? "Découvrez nos opérations, réalisations et informations récentes."
              : "Discover our latest operations, projects and company updates."}
          </p>
        </div>
      </section>
      <section className="news-page-list" data-no-translate>
        {loading ? (
          <div className="news-status">{language === "fr" ? "Chargement..." : "Loading..."}</div>
        ) : items.length ? (
          <div className="news-grid news-grid--page">
            {items.map((item) => (
              <NewsCard key={item.id} item={item} language={language} expanded />
            ))}
          </div>
        ) : (
          <div className="news-empty">
            <Newspaper size={34} />
            <h2>{language === "fr" ? "Aucune actualité publiée" : "No published news yet"}</h2>
          </div>
        )}
      </section>
    </>
  );
}

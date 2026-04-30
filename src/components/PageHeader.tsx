import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
}

const PageHeader = ({ eyebrow, title, subtitle, crumbs }: Props) => (
  <section className="bg-cream border-b border-border">
    <div className="container py-14 md:py-20 text-center space-y-4">
      {crumbs && crumbs.length > 0 && (
        <nav className="text-[11px] tracking-luxe uppercase text-bordeaux/50 flex items-center justify-center gap-2">
          <Link to="/" className="hover:text-gold transition-smooth">Accueil</Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              <span>/</span>
              {c.to ? (
                <Link to={c.to} className="hover:text-gold transition-smooth">
                  {c.label}
                </Link>
              ) : (
                <span className="text-bordeaux">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      {eyebrow && <div className="text-gold text-xs tracking-luxe uppercase">{eyebrow}</div>}
      <h1 className="font-serif text-4xl md:text-5xl text-bordeaux">{title}</h1>
      {subtitle && <p className="text-bordeaux/60 max-w-2xl mx-auto">{subtitle}</p>}
    </div>
  </section>
);

export default PageHeader;

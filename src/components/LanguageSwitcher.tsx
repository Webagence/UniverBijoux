import { useLocale } from "@/context/LocaleContext";
import { ChevronDown, Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher() {
  const { locale, locales, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (locales.length <= 1) {
    return null;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-bordeaux/70 hover:text-bordeaux transition-colors"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLocale?.flag_emoji} {currentLocale?.native_name}</span>
        <span className="sm:hidden">{currentLocale?.flag_emoji}</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-ivory rounded-lg shadow-elegant border border-bordeaux/10 py-1 z-50">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-bordeaux/5 transition-colors ${
                l.code === locale ? "text-gold font-medium" : "text-bordeaux/70"
              }`}
            >
              <span className="text-lg">{l.flag_emoji}</span>
              <span>{l.native_name}</span>
              {l.code === locale && (
                <span className="ml-auto text-gold text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

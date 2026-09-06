import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { SheetMark } from './Sheet';

/* The register index. Every sheet in the cabinet carries an accession
   number, and the one you are reading is the one that is stamped. */

export default function Navbar({ activeRoute, onNavigate, onOpenDemo }) {
  const { toggleTheme, isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  const navItems = [
    { id: 'home', label: t('nav_home'), no: '01' },
    { id: 'crop-recommendation', label: t('nav_crop_rec'), no: '02' },
    { id: 'crop-health', label: t('nav_crop_health'), no: '03' },
    { id: 'production', label: t('nav_production'), no: '04' },
    { id: 'yield', label: t('nav_yield'), no: '05' },
    { id: 'advisor', label: t('nav_advisor'), no: '06' },
    { id: 'farm-analysis', label: t('nav_farm_analysis'), no: '07', badge: 'Workflow' },
    { id: 'dashboard', label: t('nav_dashboard'), no: '08' },
  ];

  const langs = [
    { id: 'en', short: 'EN', long: 'English' },
    { id: 'hi', short: 'हिं', long: 'हिन्दी' },
    { id: 'hinglish', short: 'Hing', long: 'Hinglish' },
  ];

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b transition-colors duration-300"
      style={{
        borderColor: lifted ? 'var(--rule-strong)' : 'var(--rule)',
        background: lifted
          ? 'color-mix(in oklab, var(--sheet) 88%, transparent)'
          : 'var(--sheet)',
        backdropFilter: lifted ? 'blur(10px)' : undefined,
      }}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        {/* ── The cabinet label ─────────────────────────────────── */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex shrink-0 cursor-pointer items-center gap-2.5 bg-transparent p-0"
          style={{ color: 'var(--ink)', border: 0 }}
        >
          <SheetMark size={26} />
          <span
            className="text-[0.95rem] font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Krishi360
          </span>
          <span
            className="label-typed-sm ml-0.5 hidden border-l pl-2.5 sm:inline-block"
            style={{ color: 'var(--ink-faint)', borderColor: 'var(--rule)' }}
          >
            Precision Agri-AI
          </span>
        </button>

        {/* ── The index, typed ──────────────────────────────────── */}
        <nav
          className="no-scrollbar hidden items-center gap-5 overflow-x-auto xl:flex"
          aria-label="Register index"
        >
          {navItems.map((item) => {
            const isActive = activeRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="label-typed relative shrink-0 cursor-pointer whitespace-nowrap bg-transparent py-1.5 transition-colors duration-200"
                style={{
                  border: 0,
                  color: isActive ? 'var(--ink)' : 'var(--ink-faint)',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute inset-x-0 -bottom-[3px] h-[2px]"
                    style={{ background: 'var(--stamp)' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ── The reading-room controls ─────────────────────────── */}
        <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
          <div
            className="flex items-center border"
            style={{ borderColor: 'var(--rule-strong)' }}
          >
            {langs.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                aria-pressed={language === l.id}
                className="label-typed-sm cursor-pointer px-2 py-1.5 transition-colors duration-200"
                style={
                  language === l.id
                    ? { background: 'var(--ink)', color: 'var(--sheet-raised)', border: 0 }
                    : { background: 'transparent', color: 'var(--ink-faint)', border: 0 }
                }
              >
                {l.short}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title={isDark ? 'Read under the lamp' : 'Read with the lamp off'}
            aria-label={isDark ? 'Switch to light sheet' : 'Switch to dark sheet'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border bg-transparent"
            style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-soft)' }}
          >
            {isDark ? <Sun width={16} height={16} /> : <Moon width={16} height={16} />}
          </button>

          <button
            type="button"
            onClick={onOpenDemo}
            className="btn btn-outline btn-sm hidden lg:inline-flex"
          >
            {t('cta_try_demo')}
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('farm-analysis')}
            className="btn btn-ink btn-sm"
          >
            {t('cta_get_started')}
            <ArrowRight width={15} height={15} />
          </button>
        </div>

        {/* ── Narrow sheet ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light sheet' : 'Switch to dark sheet'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border bg-transparent sm:hidden"
            style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink-soft)' }}
          >
            {isDark ? <Sun width={16} height={16} /> : <Moon width={16} height={16} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close register index' : 'Open register index'}
            className="flex h-9 w-9 cursor-pointer items-center justify-center border bg-transparent"
            style={{ borderColor: 'var(--rule-strong)', color: 'var(--ink)' }}
          >
            {mobileMenuOpen ? <X width={18} height={18} /> : <Menu width={18} height={18} />}
          </button>
        </div>
      </div>

      {/* ── The index, pulled out of the cabinet ────────────────── */}
      {mobileMenuOpen && (
        <div
          className="border-t xl:hidden"
          style={{ borderColor: 'var(--rule)', background: 'var(--sheet-raised)' }}
        >
          <nav className="shell flex flex-col py-1" aria-label="Register index">
            {navItems.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex cursor-pointer items-center gap-3 border-b bg-transparent py-3.5 text-left last:border-b-0"
                  style={{
                    borderColor: 'var(--rule)',
                    color: isActive ? 'var(--ink)' : 'var(--ink-soft)',
                  }}
                >
                  <span
                    className="accession flex h-[18px] w-[22px] shrink-0 items-center justify-center text-[0.6875rem]"
                    style={
                      isActive
                        ? { background: 'var(--stamp)', color: 'var(--sheet-raised)' }
                        : { color: 'var(--rule-strong)' }
                    }
                  >
                    {item.no}
                  </span>
                  <span
                    className="label-typed min-w-0 flex-1"
                    style={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {item.label}
                  </span>
                  {item.badge && (
                    <span className="stamp stamp-determ shrink-0">{item.badge}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div
            className="shell flex flex-col gap-3 border-t py-4"
            style={{ borderColor: 'var(--rule-strong)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="label-typed-sm" style={{ color: 'var(--ink-faint)' }}>
                Language
              </span>
              <div className="flex border" style={{ borderColor: 'var(--rule-strong)' }}>
                {langs.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLanguage(l.id)}
                    aria-pressed={language === l.id}
                    className="label-typed-sm cursor-pointer px-2.5 py-1.5"
                    style={
                      language === l.id
                        ? { background: 'var(--ink)', color: 'var(--sheet-raised)', border: 0 }
                        : { background: 'transparent', color: 'var(--ink-faint)', border: 0 }
                    }
                  >
                    {l.long}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onOpenDemo();
                setMobileMenuOpen(false);
              }}
              className="btn btn-outline btn-sm w-full"
            >
              {t('cta_try_demo')}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('farm-analysis')}
              className="btn btn-ink btn-sm w-full"
            >
              {t('cta_analyze_farm')}
              <ArrowRight width={15} height={15} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

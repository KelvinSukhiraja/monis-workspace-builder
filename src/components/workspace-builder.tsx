"use client";

import dynamic from "next/dynamic";
import { useEffect, useReducer, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Info,
  Minus,
  Plus,
  RotateCcw,
  Rotate3D,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import {
  builderReducer,
  categories,
  formatPrice,
  initialState,
  matchingTemplate,
  periodLabel,
  products,
  selectedProducts,
  shortPrice,
  templates,
  totalPrice,
  type Category,
  type Period,
  type Product,
} from "@/lib/catalog";
import { ProductArt, TemplateArt } from "./product-art";

const RoomScene = dynamic(() => import("./room-scene"), {
  ssr: false,
  loading: () => (
    <div className="scene-loading">
      <span />
      Opening your room…
    </div>
  ),
});
const STORAGE_KEY = "monis-workspace-v1";

function PeriodSwitch({
  period,
  onChange,
}: {
  period: Period;
  onChange: (period: Period) => void;
}) {
  return (
    <div
      className="period-switch"
      role="group"
      aria-label="Rental billing period"
    >
      {(["weekly", "monthly"] as Period[]).map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={period === value}
          className={period === value ? "active" : ""}
          onClick={() => onChange(value)}
        >
          {value === "weekly" ? "Weekly" : "Monthly"}
        </button>
      ))}
    </div>
  );
}

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function WorkspaceBuilder() {
  const [state, dispatch] = useReducer(builderReducer, initialState);
  const [ready, setReady] = useState(false);
  const [category, setCategory] = useState<Category>("desks");
  const [notice, setNotice] = useState("");
  const [details, setDetails] = useState<Product | null>(null);
  const [zoom, setZoom] = useState(90);
  const [resetView, setResetView] = useState(0);
  const [mode, setMode] = useState<"review" | "request" | "success" | null>(
    null,
  );
  const [requestName, setRequestName] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [baseZoom, setBaseZoom] = useState(90);
  const selected = selectedProducts(state.config);
  const activeTemplate = matchingTemplate(state.config);
  const total = totalPrice(state.config, state.period);
  const canReview = Boolean(state.config.desk && state.config.chair);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "restore", value: JSON.parse(saved) });
    } catch {
      setStorageWarning(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ config: state.config, period: state.period }),
      );
    } catch {
      setStorageWarning(true);
    }
  }, [state.config, state.period, ready]);
  useEffect(() => {
    if (!scene.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const next = Math.min(
        entry.contentRect.width / 6.9,
        entry.contentRect.height / 5.1,
      );
      setBaseZoom(next);
      setZoom(next);
    });
    observer.observe(scene.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 5500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (mode && !dialog.current?.open) dialog.current?.showModal();
    if (!mode && dialog.current?.open) dialog.current?.close();
  }, [mode]);
  useEffect(() => {
    if (!mode) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [mode]);

  function chooseCategory(value: Category, scroll = false) {
    setCategory(value);
    setDetails(null);
    if (scroll)
      panel.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
  }
  function selectProduct(product: Product) {
    dispatch({ type: "select", id: product.id });
    setNotice(`${product.name} added to your space.`);
  }
  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const date = String(data.get("date") || "");
    if (!name || date < localDate()) return;
    setRequestName(name.split(/\s+/)[0]);
    setRequestDate(date);
    setMode("success");
  }
  function closeDialog() {
    setMode(null);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#catalog">
        Skip to furniture choices
      </a>
      <header className="site-header">
        <a
          href="/"
          className="wordmark"
          aria-label="Monis workspace builder home"
        >
          monis<span>.</span>
        </a>
        <span className="header-divider" />
        <span className="eyebrow brand-descriptor">WORKSPACE BUILDER</span>
        <div className="header-right">
          <span className="location">
            <i />
            BALI, INDONESIA
          </span>
          <button
            className="reset-button"
            disabled={!selected.length}
            onClick={() => {
              dispatch({ type: "reset" });
              setNotice("A fresh start. Your previous setup can be restored.");
              setCategory("desks");
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>
      </header>

      <main className="builder-layout">
        <section className="workspace" aria-label="Your workspace">
          <div className="scene-container" ref={scene}>
            <div className="scene-heading">
              <p className="eyebrow">01 / YOUR SPACE</p>
              <h1>
                Good work.
                <br />
                Great space.
              </h1>
              <p className="scene-subtitle">A workspace that feels like you.</p>
            </div>
            <div className="room-canvas">
              <RoomScene
                config={state.config}
                zoom={zoom}
                resetView={resetView}
                onSelectCategory={chooseCategory}
              />
            </div>
            {!selected.length && (
              <div className="empty-prompt">
                <span className="empty-dot" />
                <span>A little empty. A lot of possibility.</span>
                <button onClick={() => chooseCategory("desks", true)}>
                  Choose your desk <ArrowUpRight size={15} />
                </button>
              </div>
            )}
            <div className="scene-toolbar">
              <span className="rotate-hint">
                <Rotate3D size={22} />
                <span>Drag to rotate</span>
              </span>
              <div className="view-controls">
                <button
                  aria-label="Zoom out"
                  disabled={zoom <= baseZoom * 0.76}
                  onClick={() =>
                    setZoom((z) =>
                      Math.max(baseZoom * 0.75, z - baseZoom * 0.1),
                    )
                  }
                >
                  <Minus size={15} />
                </button>
                <span>{Math.round((zoom / baseZoom) * 100)}%</span>
                <button
                  aria-label="Zoom in"
                  disabled={zoom >= baseZoom * 1.34}
                  onClick={() =>
                    setZoom((z) =>
                      Math.min(baseZoom * 1.35, z + baseZoom * 0.1),
                    )
                  }
                >
                  <Plus size={15} />
                </button>
                <button
                  aria-label="Reset camera"
                  onClick={() => {
                    setZoom(baseZoom);
                    setResetView((v) => v + 1);
                  }}
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>
          </div>

          <section
            className="templates-section"
            aria-label="Workspace templates"
          >
            <div className="section-label">
              <h2 className="eyebrow">A LITTLE INSPIRATION</h2>
              <span>
                Make it yours from here <ArrowDown size={12} />
              </span>
            </div>
            <div className="template-grid">
              {templates.map((template) => (
                <button
                  className={`template-card ${activeTemplate?.id === template.id ? "selected" : ""}`}
                  key={template.id}
                  aria-label={`Load ${template.name} template`}
                  aria-pressed={activeTemplate?.id === template.id}
                  onClick={() => {
                    dispatch({ type: "template", id: template.id });
                    setNotice(
                      `${template.name} loaded. Every item is yours to change.`,
                    );
                  }}
                >
                  <TemplateArt template={template} />
                  <span className="template-title">
                    {template.name}
                    {activeTemplate?.id === template.id ? (
                      <Check size={14} />
                    ) : (
                      <ArrowUpRight size={14} />
                    )}
                  </span>
                  <span className="template-note">{template.note}</span>
                </button>
              ))}
            </div>
          </section>
        </section>

        <aside
          className="catalog-panel"
          id="catalog"
          ref={panel}
          aria-label="Customize your workspace"
        >
          <div className="catalog-heading">
            <h2>Make it yours</h2>
            <span className="eyebrow">
              {String(selected.length).padStart(2, "0")} ITEMS
            </span>
          </div>
          <div
            className="category-tabs"
            role="tablist"
            aria-label="Product categories"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                id={`tab-${c.id}`}
                role="tab"
                aria-selected={category === c.id}
                aria-controls="product-panel"
                tabIndex={category === c.id ? 0 : -1}
                onClick={() => chooseCategory(c.id)}
                onKeyDown={(e) => {
                  const index = categories.findIndex(
                    (item) => item.id === category,
                  );
                  const next =
                    e.key === "ArrowRight"
                      ? (index + 1) % 4
                      : e.key === "ArrowLeft"
                        ? (index + 3) % 4
                        : e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 3
                            : null;
                  if (next !== null) {
                    e.preventDefault();
                    chooseCategory(categories[next].id);
                    document
                      .getElementById(`tab-${categories[next].id}`)
                      ?.focus();
                  }
                }}
              >
                {c.label}
                {selected.some((p) => p.category === c.id) && (
                  <span className="tab-dot" />
                )}
              </button>
            ))}
          </div>

          <div
            className="product-list"
            role="tabpanel"
            id="product-panel"
            aria-labelledby={`tab-${category}`}
          >
            {products
              .filter((p) => p.category === category)
              .map((product) => {
                const isSelected = state.config[product.slot] === product.id;
                return (
                  <article
                    className={`product-card ${isSelected ? "selected" : ""}`}
                    key={product.id}
                  >
                    <button
                      className="product-choice"
                      aria-pressed={isSelected}
                      aria-label={`Select ${product.name}`}
                      onClick={() => selectProduct(product)}
                    >
                      <ProductArt
                        product={product}
                        className="product-illustration"
                      />
                      <span className="product-copy">
                        <strong>{product.name}</strong>
                        <span>{product.detail}</span>
                        <b>
                          {shortPrice(product[state.period])}
                          <small> / {periodLabel(state.period)}</small>
                        </b>
                      </span>
                      <span className="selection-indicator">
                        {isSelected ? <Check size={12} /> : <Plus size={12} />}
                      </span>
                    </button>
                    <button
                      className="product-details"
                      aria-label={`Details for ${product.name}`}
                      aria-expanded={details?.id === product.id}
                      onClick={() =>
                        setDetails(details?.id === product.id ? null : product)
                      }
                    >
                      <Info size={13} />
                    </button>
                    {details?.id === product.id && (
                      <div className="product-description">
                        {product.badge && (
                          <span className="eyebrow">{product.badge}</span>
                        )}
                        <p>{product.description}</p>
                        {isSelected && (
                          <button
                            onClick={() => {
                              dispatch({ type: "remove", slot: product.slot });
                              setNotice(`${product.name} removed.`);
                            }}
                          >
                            Remove from setup
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            {!state.config.desk && category === "tech" && (
              <p className="catalog-note">
                Add a desk to give your tech a home. Until then, it sits on the
                room floor.
              </p>
            )}
          </div>

          <section className="selection-section">
            <div className="section-label">
              <h3 className="eyebrow">IN YOUR SPACE</h3>
              {selected.length > 0 && (
                <span>
                  {activeTemplate ? activeTemplate.name : "Custom setup"}
                </span>
              )}
            </div>
            {!selected.length ? (
              <div className="empty-selection">
                <span>
                  Start with a desk.
                  <br />
                  See where it takes you.
                </span>
                <span className="empty-selection-icon">↗</span>
              </div>
            ) : (
              <ul className="selection-list">
                {selected.map((product) => (
                  <li key={product.id}>
                    <div className="selection-thumb">
                      <ProductArt product={product} />
                    </div>
                    <button
                      className="selection-name"
                      onClick={() => {
                        chooseCategory(product.category, true);
                        setDetails(product);
                      }}
                    >
                      <strong>{product.name}</strong>
                      <span>
                        {shortPrice(product[state.period])} /{" "}
                        {periodLabel(state.period)}
                      </span>
                    </button>
                    <button
                      className="remove-item"
                      aria-label={`Remove ${product.name}`}
                      onClick={() => {
                        dispatch({ type: "remove", slot: product.slot });
                        setNotice(`${product.name} removed.`);
                      }}
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <p className="demo-note">
            <Info size={14} />
            <span>Demo catalog & pricing. Make yourself at home.</span>
          </p>
          {storageWarning && (
            <p className="catalog-note" role="status">
              Your browser couldn’t save this setup. Keep this page open to
              retain it.
            </p>
          )}
        </aside>
      </main>

      <p className="developer-credit">
        Developed by <span>Kelvin Sukhiraja</span>
      </p>

      <footer className="rental-bar">
        <div className="rental-left">
          <strong>Your space, your pace.</strong>
          <PeriodSwitch
            period={state.period}
            onChange={(period) => dispatch({ type: "period", period })}
          />
        </div>
        <div className="rental-right">
          <div className="rental-total" aria-live="polite">
            <strong>
              {shortPrice(total)}
              <span> / {periodLabel(state.period)}</span>
            </strong>
            <small>
              {selected.length
                ? `${selected.length} items · Demo rental request`
                : "Your next chapter starts here"}
            </small>
          </div>
          <button
            className="primary-button review-button"
            disabled={!canReview}
            onClick={() => setMode("review")}
          >
            {canReview ? "Review setup" : "Add a desk & chair"}
            <ArrowUpRight size={18} />
          </button>
        </div>
      </footer>

      <div
        className={`toast ${notice ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Check size={15} />
        <span>{notice}</span>
        {state.undo && (
          <button
            onClick={() => {
              dispatch({ type: "undo" });
              setNotice("Previous setup restored.");
            }}
          >
            <Undo2 size={13} />
            Undo
          </button>
        )}
      </div>

      <dialog
        ref={dialog}
        className="checkout-dialog"
        onCancel={closeDialog}
        onClose={closeDialog}
        onClick={(e) => {
          if (e.target === dialog.current) closeDialog();
        }}
        aria-labelledby="checkout-title"
      >
        <div className="dialog-inner">
          <button
            className="dialog-close"
            aria-label="Close rental summary"
            onClick={closeDialog}
          >
            <X size={20} />
          </button>
          {mode === "success" ? (
            <div className="success-content">
              <div className="success-check">
                <Check size={30} />
              </div>
              <p className="eyebrow">
                LOOKING GOOD, {requestName.toUpperCase()}.
              </p>
              <h2 id="checkout-title">
                Your space.
                <br />
                All imagined.
              </h2>
              <p>
                Your demo request is ready for{" "}
                {new Date(`${requestDate}T12:00:00`).toLocaleDateString(
                  "en-GB",
                  { day: "numeric", month: "long", year: "numeric" },
                )}
                .
              </p>
              <div className="success-summary">
                <span>{selected.length} selected items</span>
                <strong>
                  {formatPrice(total)} / {periodLabel(state.period)}
                </strong>
              </div>
              <p className="demo-disclosure">
                This is a demo confirmation. Nothing has been sent, booked, or
                charged. Your setup stays saved on this device.
              </p>
              <button className="primary-button" onClick={closeDialog}>
                Back to my space <ArrowUpRight size={17} />
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow">02 / YOUR NEXT CHAPTER</p>
              <h2 id="checkout-title">
                {mode === "request"
                  ? "Make yourself at home."
                  : "A space to do your thing."}
              </h2>
              <p className="dialog-intro">
                {mode === "request"
                  ? "Try the rental request. No payment, no commitment."
                  : "A little you. A little monis. Here’s your workspace."}
              </p>
              {mode === "review" ? (
                <>
                  <div className="summary-period">
                    <span>Rental period</span>
                    <PeriodSwitch
                      period={state.period}
                      onChange={(period) =>
                        dispatch({ type: "period", period })
                      }
                    />
                  </div>
                  <ul className="checkout-items">
                    {selected.map((p) => (
                      <li key={p.id}>
                        <ProductArt product={p} />
                        <div>
                          <strong>{p.name}</strong>
                          <span>{p.detail}</span>
                        </div>
                        <b>{formatPrice(p[state.period])}</b>
                        <button
                          aria-label={`Remove ${p.name} from review`}
                          onClick={() =>
                            dispatch({ type: "remove", slot: p.slot })
                          }
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="checkout-total">
                    <span>Total / {periodLabel(state.period)}</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <p className="demo-disclosure">
                    Illustrative rental rates only. Delivery, availability and
                    any deposit would be confirmed by Monis in a real booking.
                  </p>
                  {!canReview && (
                    <p className="validation-message">
                      Add a desk and chair to complete this workspace.
                    </p>
                  )}
                  <button
                    className="primary-button wide-button"
                    disabled={!canReview}
                    onClick={() => setMode("request")}
                  >
                    Continue to rental request <ArrowUpRight size={17} />
                  </button>
                  <button className="text-button" onClick={closeDialog}>
                    <ArrowLeft size={14} />
                    Keep creating
                  </button>
                </>
              ) : (
                <form onSubmit={submitRequest}>
                  <div className="request-fields">
                    <label>
                      Your name
                      <input
                        name="name"
                        required
                        autoComplete="given-name"
                        placeholder="Alex"
                        maxLength={80}
                        pattern=".*\S.*"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="alex@example.com"
                        maxLength={200}
                      />
                    </label>
                    <label>
                      Preferred delivery date
                      <input
                        name="date"
                        type="date"
                        required
                        min={localDate()}
                      />
                    </label>
                    <label>
                      Where in Bali?
                      <select name="area" required defaultValue="">
                        <option value="" disabled>
                          Choose your area
                        </option>
                        <option>Canggu</option>
                        <option>Pererenan</option>
                        <option>Seminyak</option>
                        <option>Ubud</option>
                        <option>Uluwatu</option>
                        <option>Other area in Bali</option>
                      </select>
                    </label>
                  </div>
                  <div className="checkout-total">
                    <span>
                      {selected.length} items / {periodLabel(state.period)}
                    </span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <p className="demo-disclosure">
                    Demo only. These details aren’t sent or saved. No real
                    reservation or payment will be made.
                  </p>
                  <button className="primary-button wide-button" type="submit">
                    Preview rental request <ArrowUpRight size={17} />
                  </button>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => setMode("review")}
                  >
                    <ArrowLeft size={14} />
                    Back to summary
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}

import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Check, ChevronDown, ChevronRight, X } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export function Screen({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-dvh bg-background text-foreground",
        padded && "px-4 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Header({
  title,
  subtitle,
  back = true,
  right,
  fallbackTo = "/home",
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  fallbackTo?: string;
}) {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  return (
    <header className="sticky top-0 z-30 bg-background px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <div className="flex items-center gap-3">
        {back && (
          <button
            aria-label="Go back"
            onClick={() => (canGoBack ? router.history.back() : router.navigate({ to: fallbackTo as never }))}
            className="flex h-11 w-11 items-center justify-center border border-border text-foreground hover:bg-muted"
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-[17px] font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted-foreground">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}

export function Button({
  children,
  variant = "primary",
  full,
  className,
  loading,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "trust" | "danger" | "ghost" | "light";
  full?: boolean;
  loading?: boolean;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
    outline: "border border-trust bg-transparent text-trust hover:bg-trust/8",
    trust: "bg-trust text-white hover:bg-trust/90",
    light: "border border-white/50 bg-transparent text-white hover:bg-white/10",
    danger: "bg-danger text-white hover:opacity-90",
    ghost: "text-trust hover:bg-trust/8",
  }[variant];
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "inline-flex h-11 min-h-11 items-center justify-center gap-1.5 rounded-none px-4 text-[17px] font-semibold tracking-tight transition-colors disabled:opacity-50",
        styles,
        full && "w-full",
        className,
      )}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function LinkButton({
  to,
  params,
  search,
  children,
  variant = "primary",
  full,
  className,
}: {
  to: string;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  children: ReactNode;
  variant?: "primary" | "outline" | "trust" | "danger" | "light";
  full?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary-dark",
    outline: "border border-trust bg-transparent text-trust hover:bg-trust/8",
    trust: "bg-trust text-white hover:bg-trust/90",
    light: "border border-white/50 text-white hover:bg-white/10",
    danger: "bg-danger text-white hover:opacity-90",
  }[variant];
  return (
    <Link
      to={to as "/"}
      params={params}
      search={search}
      className={cn(
        "inline-flex h-11 min-h-11 items-center justify-center gap-1.5 rounded-none px-4 text-center text-[17px] font-semibold tracking-tight transition-colors",
        styles,
        full && "w-full",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
  onClick,
  selected,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-none border bg-card p-4",
        selected ? "border-2 border-primary" : "border-border",
        onClick && "cursor-pointer transition-colors hover:border-foreground/20",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Mobile tab row: 44pt targets. `done` marks completed steps; active stays red. */
export function ScrollTabs<T extends string>({
  items,
  value,
  onChange,
  fit,
  className,
}: {
  items: readonly { id: T; label: string; done?: boolean }[] | { id: T; label: string; done?: boolean }[];
  value?: T;
  onChange?: (id: T) => void;
  fit?: boolean;
  className?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const active = activeRef.current;
    if (!active || fit) return;
    const frame = requestAnimationFrame(() => {
      active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [value, fit]);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        fit
          ? "flex gap-2"
          : "no-scrollbar -mx-4 flex gap-2 overflow-x-auto scroll-px-4 px-4 snap-x snap-mandatory",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.id === value;
        const done = Boolean(item.done) && !active;
        return (
          <button
            key={item.id}
            ref={active ? activeRef : undefined}
            type="button"
            aria-current={active ? "step" : undefined}
            onClick={() => onChange?.(item.id)}
            className={cn(
              "inline-flex h-11 min-h-11 items-center justify-center gap-1 px-3.5 text-[15px] font-medium",
              fit ? "min-w-0 flex-1 px-2" : "shrink-0 snap-start",
              active && "bg-primary text-white",
              done && "border border-trust bg-trust/8 text-trust",
              !active && !done && "border border-border bg-card text-muted-foreground",
            )}
          >
            {done && <Check size={14} strokeWidth={2.6} className="shrink-0" />}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "trust" | "muted" | "sold";
  className?: string;
}) {
  const chipTone = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    danger: "bg-primary text-white",
    trust: "bg-trust text-white",
    muted: "border border-border bg-muted text-muted-foreground",
    sold: "bg-muted text-muted-foreground line-through",
  }[tone];
  return (
    <span
      className={cn(
        "inline-block rounded-none px-2.5 py-1 text-[11px] font-semibold",
        chipTone,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Field({
  label,
  error,
  children,
  hint,
  tone = "light",
}: {
  label: string;
  error?: string;
  hint?: string;
  tone?: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <label className="mb-4 block">
      <span
        className={cn(
          "mb-1.5 block text-[13px] font-medium",
          tone === "dark" ? "text-white/70" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      {children}
      {hint && !error && (
        <span className={cn("mt-1 block text-xs", tone === "dark" ? "text-white/40" : "text-muted-foreground")}>
          {hint}
        </span>
      )}
      {error && <span className="mt-1 block text-xs font-medium text-primary">{error}</span>}
    </label>
  );
}

export const inputClass =
  "h-11 min-h-11 w-full rounded-none border border-border bg-card px-3.5 text-[17px] text-foreground outline-none placeholder:text-muted-foreground focus:border-trust";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, "min-h-28", props.className)} />;
}

type SelectOption = { value: string; label: string };

function optionsFromChildren(children: ReactNode): SelectOption[] {
  const next: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement<{ value?: string | number; children?: ReactNode }>(child)) return;
    if (child.type !== "option") return;
    const label = String(child.props.children ?? "");
    const value = child.props.value !== undefined ? String(child.props.value) : label;
    next.push({ value, label });
  });
  return next;
}

export function Select({
  value,
  onChange,
  children,
  className,
  disabled,
  options: optionsProp,
}: React.SelectHTMLAttributes<HTMLSelectElement> & { options?: SelectOption[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const fromChildren = useMemo(() => optionsFromChildren(children), [children]);
  const options = optionsProp ?? fromChildren;
  const current = String(value ?? "");
  const selected = options.find((o) => o.value === current);
  const placeholder = options.find((o) => o.value === "")?.label || "Select";
  const filled = Boolean(selected && selected.value !== "");
  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  function pick(next: string) {
    onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          setQuery("");
          setOpen(true);
        }}
        className={cn(
          inputClass,
          "flex items-center justify-between gap-3 text-left",
          !filled && "text-muted-foreground",
          className,
        )}
      >
        <span className="truncate">{filled ? selected?.label : placeholder}</span>
        <ChevronDown size={18} strokeWidth={2} className="shrink-0 text-muted-foreground" />
      </button>
      <BottomSheet
        open={open}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
        title={placeholder}
      >
        {options.length > 10 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className={cn(inputClass, "mb-3")}
            autoFocus
          />
        )}
        <div className="no-scrollbar max-h-[55dvh] overflow-y-auto">
          {filtered.map((o) => {
            const active = o.value === current;
            return (
              <button
                key={`${o.value}-${o.label}`}
                type="button"
                onClick={() => pick(o.value)}
                className={cn(
                  "flex h-11 min-h-11 w-full items-center justify-between gap-3 border-b border-border px-1 text-left text-[17px]",
                  active ? "font-semibold text-primary" : "text-foreground",
                  o.value === "" && "text-muted-foreground",
                )}
              >
                <span className="truncate">{o.label}</span>
                {active && <Check size={18} strokeWidth={2.4} className="shrink-0 text-primary" />}
              </button>
            );
          })}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-[15px] text-muted-foreground">No matches</p>
          )}
        </div>
      </BottomSheet>
    </>
  );
}

export function Row({
  icon,
  label,
  value,
  to,
  params,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  value?: ReactNode;
  to?: string;
  params?: Record<string, string>;
  onClick?: () => void;
}) {
  const inner = (
    <>
      {icon && <span className="text-trust">{icon}</span>}
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      {value && <span className="text-xs text-muted-foreground">{value}</span>}
      <ChevronRight size={16} className="text-muted-foreground" />
    </>
  );
  const cls =
    "flex w-full items-center gap-3 border-b border-border bg-card px-4 py-4 text-left transition-colors hover:bg-muted";
  return to ? (
    <Link to={to as "/"} params={params} className={cls}>
      {inner}
    </Link>
  ) : (
    <button onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/55" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-none border-t border-border bg-card px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-border bg-card p-8 text-center">
      <h3 className="text-[17px] font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function WarningBanner({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-primary bg-primary/8 px-3 py-2.5 text-xs leading-relaxed text-foreground">
      {children}
    </div>
  );
}

export function AmberBanner({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-4 border-amber bg-amber/10 px-3 py-2.5 text-xs leading-relaxed text-foreground">
      {children}
    </div>
  );
}

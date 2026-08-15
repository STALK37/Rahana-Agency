import { useMemo, useState } from "react";
import { formatAmd } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

type Tab = "full" | "installment" | "rental";

export function PaymentPlanner({
  initialPrice = 45000000,
  initialTab = "full",
  compact = false,
}: {
  initialPrice?: number;
  initialTab?: Tab;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [price, setPrice] = useState(initialPrice);
  const [fee, setFee] = useState(2);
  const [down, setDown] = useState(Math.round(initialPrice * 0.3));
  const [months, setMonths] = useState(24);
  const [income, setIncome] = useState(700000);
  const [rent, setRent] = useState(280000);
  const [utilities, setUtilities] = useState(35000);

  const feeAmount = (price * fee) / 100;
  const financed = Math.max(price - down, 0);
  const monthly = months > 0 ? financed / months : 0;

  const schedule = useMemo(() => {
    const rows: { n: number; payment: number; balance: number }[] = [];
    let balance = financed;
    for (let i = 1; i <= Math.min(months, 120); i++) {
      balance = Math.max(balance - monthly, 0);
      rows.push({ n: i, payment: monthly, balance });
    }
    return rows;
  }, [financed, monthly, months]);

  const ratio = income > 0 ? ((rent + utilities) / income) * 100 : 0;
  const verdict =
    ratio <= 30 ? "calc.verdict.good" : ratio <= 45 ? "calc.verdict.ok" : "calc.verdict.bad";

  const tabs: { key: Tab; label: string }[] = [
    { key: "full", label: t("calc.full") },
    { key: "installment", label: t("calc.installment") },
    { key: "rental", label: t("calc.rental") },
  ];

  return (
    <div className={`card-r ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button
            key={x.key}
            onClick={() => setTab(x.key)}
            className={`btn ${tab === x.key ? "btn-ink" : "btn-outline"}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {tab !== "rental" && <Field label={t("calc.price")} value={price} onChange={setPrice} />}
        {tab === "full" && <Field label={t("calc.fee")} value={fee} onChange={setFee} step={0.5} />}
        {tab === "installment" && (
          <>
            <Field label={t("calc.down")} value={down} onChange={setDown} />
            <Field label={t("calc.months")} value={months} onChange={setMonths} />
          </>
        )}
        {tab === "rental" && (
          <>
            <Field label={t("calc.income")} value={income} onChange={setIncome} />
            <Field label={t("calc.rent")} value={rent} onChange={setRent} />
            <Field label={t("calc.utilities")} value={utilities} onChange={setUtilities} />
          </>
        )}
      </div>

      <div className="mt-6 overflow-hidden rounded-card bg-surface-alt">
        {tab === "full" && (
          <Table
            head={[t("calc.period"), t("calc.payment")]}
            rows={[
              [t("calc.price"), formatAmd(price)],
              [`${t("calc.fee")} (${fee}%)`, formatAmd(feeAmount)],
            ]}
            total={[t("calc.total"), formatAmd(price + feeAmount)]}
          />
        )}

        {tab === "installment" && (
          <div>
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Stat label={t("calc.monthly")} value={formatAmd(monthly)} gold />
              <Stat label={t("calc.total")} value={formatAmd(down + financed)} />
            </div>
            <div className="max-h-80 overflow-y-auto border-t border-line">
              <Table
                head={[t("calc.period"), t("calc.payment"), t("calc.balance")]}
                rows={schedule.map((r) => [`${r.n}`, formatAmd(r.payment), formatAmd(r.balance)])}
                total={[t("calc.total"), formatAmd(financed), formatAmd(0)]}
              />
            </div>
          </div>
        )}

        {tab === "rental" && (
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Stat label={t("calc.ratio")} value={`${ratio.toFixed(1)} %`} gold />
            <Stat label={t("calc.total")} value={t(verdict as never)} />
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="label-caps">{label}</span>
      <input
        type="number"
        step={step}
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="input-r mt-2 bg-surface"
      />
    </label>
  );
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div>
      <p className="label-caps">{label}</p>
      <p className={`t-sub mt-1 ${gold ? "text-gold" : ""}`}>{value}</p>
    </div>
  );
}

function Table({ head, rows, total }: { head: string[]; rows: string[][]; total: string[] }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          {head.map((h) => (
            <th key={h} className="label-caps px-5 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t border-line">
            {r.map((c, j) => (
              <td key={j} className="t-body px-5 py-2.5">
                {c}
              </td>
            ))}
          </tr>
        ))}
        <tr className="border-t border-line bg-surface">
          {total.map((c, j) => (
            <td key={j} className={`t-body px-5 py-3 ${j === total.length - 1 ? "text-gold" : ""}`}>
              {c}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}

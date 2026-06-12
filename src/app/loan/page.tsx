'use client';

import { useState, useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Calculator, TrendingDown, AlertTriangle, CheckCircle2 } from 'lucide-react';

function calcMonthly(principal: number, annualRate: number, years: number): number {
  if (annualRate === 0) return principal / (years * 12);
  const r = annualRate / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export default function LoanPage() {
  const [price, setPrice] = useState(6000);
  const [down, setDown] = useState(1200);
  const [rate, setRate] = useState(0.725);
  const [years, setYears] = useState(35);
  const [income, setIncome] = useState(700); // 年収 万円

  const loan = price - down;
  const monthly = useMemo(() => calcMonthly(loan * 10000, rate, years) / 10000, [loan, rate, years]);
  const total = useMemo(() => monthly * years * 12, [monthly, years]);
  const totalInterest = total - loan;
  const annualPayment = monthly * 12;
  const repaymentRatio = income > 0 ? (annualPayment / income) * 100 : 0;

  // Amortization schedule (yearly)
  const schedule = useMemo(() => {
    const r = rate / 100 / 12;
    let balance = loan;
    const rows: { year: number; interest: number; principal: number; balance: number }[] = [];
    for (let yr = 1; yr <= years; yr++) {
      let yearInterest = 0;
      let yearPrincipal = 0;
      for (let mo = 0; mo < 12; mo++) {
        const intAmt = balance * r;
        const prinAmt = monthly - intAmt;
        yearInterest += intAmt;
        yearPrincipal += prinAmt;
        balance = Math.max(0, balance - prinAmt);
      }
      rows.push({
        year: yr,
        interest: Math.round(yearInterest * 100) / 100,
        principal: Math.round(yearPrincipal * 100) / 100,
        balance: Math.round(balance * 100) / 100,
      });
    }
    return rows;
  }, [loan, rate, years, monthly]);

  const chartData = schedule.map((r) => ({
    年: `${r.year}年`,
    元金: +r.principal.toFixed(0),
    利息: +r.interest.toFixed(0),
    残高: +r.balance.toFixed(0),
  }));

  const RATE_SCENARIOS = [
    { label: '変動（現在）', rate: 0.725, color: 'text-blue-600' },
    { label: '変動（+1%）', rate: 1.725, color: 'text-yellow-600' },
    { label: '変動（+2%）', rate: 2.725, color: 'text-orange-600' },
    { label: '固定35年', rate: 2.2, color: 'text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">住宅ローン シミュレーター</h1>
        <p className="text-gray-500 text-sm mt-1">返済計画・金利リスクを事前に把握しよう</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Calculator size={18} className="text-blue-600" />
            入力条件
          </h2>

          <Slider
            label="物件価格"
            value={price}
            onChange={setPrice}
            min={1000}
            max={30000}
            step={100}
            unit="万円"
            format={(v) => `${v.toLocaleString()}万円`}
          />
          <Slider
            label="頭金"
            value={down}
            onChange={setDown}
            min={0}
            max={price}
            step={100}
            unit="万円"
            format={(v) => `${v.toLocaleString()}万円 (${price > 0 ? ((v / price) * 100).toFixed(0) : 0}%)`}
          />
          <Slider
            label="金利（年利）"
            value={rate}
            onChange={setRate}
            min={0.1}
            max={5}
            step={0.025}
            unit="%"
            format={(v) => `${v.toFixed(3)}%`}
          />
          <Slider
            label="返済期間"
            value={years}
            onChange={setYears}
            min={10}
            max={35}
            step={5}
            unit="年"
            format={(v) => `${v}年`}
          />
          <Slider
            label="年収（審査用）"
            value={income}
            onChange={setIncome}
            min={300}
            max={3000}
            step={50}
            unit="万円"
            format={(v) => `${v.toLocaleString()}万円`}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Figures */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <ResultCard label="借入金額" value={`${loan.toLocaleString()}万`} sub="万円" color="blue" />
            <ResultCard label="月々の返済" value={`${monthly.toFixed(1)}万`} sub="万円/月" color={repaymentRatio > 25 ? 'red' : 'green'} />
            <ResultCard label="総返済額" value={`${total.toFixed(0)}万`} sub="万円" color="gray" />
            <ResultCard label="総利息" value={`${totalInterest.toFixed(0)}万`} sub="万円" color="orange" />
          </div>

          {/* Repayment Ratio Warning */}
          <div className={`rounded-xl border p-4 flex items-start gap-3 ${
            repaymentRatio > 35
              ? 'bg-red-50 border-red-200'
              : repaymentRatio > 25
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-green-50 border-green-200'
          }`}>
            {repaymentRatio > 25 ? (
              <AlertTriangle size={18} className={repaymentRatio > 35 ? 'text-red-500' : 'text-yellow-500'} />
            ) : (
              <CheckCircle2 size={18} className="text-green-500" />
            )}
            <div>
              <div className="font-semibold text-sm text-gray-900">
                返済負担率: {repaymentRatio.toFixed(1)}%
                {repaymentRatio > 35 ? ' ⚠ 高すぎます' : repaymentRatio > 25 ? ' △ やや高め' : ' ✓ 適正範囲'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                年収に占める年間返済額の割合。金融機関の審査基準は通常25〜35%以内。
                {repaymentRatio > 35 && ' 頭金を増やすか借入額を減らすことを検討してください。'}
              </div>
            </div>
          </div>

          {/* Rate Scenarios */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingDown size={16} className="text-orange-500" />
              金利上昇シナリオ（月々返済額）
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {RATE_SCENARIOS.map((s) => {
                const m = calcMonthly(loan * 10000, s.rate, years) / 10000;
                const diff = m - monthly;
                return (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className={`text-xs font-medium mb-1 ${s.color}`}>{s.label}</div>
                    <div className="text-lg font-bold text-gray-900">{m.toFixed(1)}万</div>
                    {diff > 0.01 && (
                      <div className="text-xs text-red-500 mt-0.5">+{diff.toFixed(1)}万/月</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Amortization Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">元金・利息の推移</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="年"
                  tick={{ fontSize: 10 }}
                  interval={Math.floor(years / 5) - 1}
                />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(0)}`} />
                <Tooltip formatter={(v) => `${typeof v === 'number' ? v.toFixed(1) : v}万円`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="利息" stackId="1" stroke="#f87171" fill="#fee2e2" />
                <Area type="monotone" dataKey="元金" stackId="1" stroke="#60a5fa" fill="#dbeafe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">
              返済サマリー
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: '物件価格', value: `${price.toLocaleString()}万円` },
                { label: '頭金', value: `${down.toLocaleString()}万円（${price > 0 ? ((down / price) * 100).toFixed(0) : 0}%）` },
                { label: '借入額', value: `${loan.toLocaleString()}万円` },
                { label: '月々返済', value: `${monthly.toFixed(2)}万円` },
                { label: '年間返済', value: `${annualPayment.toFixed(1)}万円` },
                { label: '返済負担率', value: `${repaymentRatio.toFixed(1)}%` },
                { label: '総返済額', value: `${total.toFixed(0)}万円` },
                { label: '総利息', value: `${totalInterest.toFixed(0)}万円（物件価格の${loan > 0 ? ((totalInterest / loan) * 100).toFixed(0) : 0}%）` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between px-5 py-2.5 text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
    </div>
  );
}

function ResultCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    gray: 'bg-gray-50 text-gray-700',
  };
  return (
    <div className={`rounded-xl p-3 text-center ${colors[color] ?? colors.gray}`}>
      <div className="text-xs mb-1 opacity-70">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      <div className="text-xs opacity-60">{sub}</div>
    </div>
  );
}

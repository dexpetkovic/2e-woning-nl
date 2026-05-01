export const TAX_RATES_2024 = {
  BANK_SAVINGS_RATE: 0.0103, // 1.03%
  INVESTMENTS_RATE: 0.0604,  // 6.04%
  DEBT_RATE: 0.0247,         // 2.47%
  TAX_PERCENTAGE: 0.36,      // 36%
};

export const TAX_RATES_2025 = {
  BANK_SAVINGS_RATE: 0.0144, // 1.44%
  INVESTMENTS_RATE: 0.0604,  // 6.04%
  DEBT_RATE: 0.0261,         // 2.61%
  TAX_PERCENTAGE: 0.36,      // 36%
};

// Keep TAX_RATES as an alias for current year
export const TAX_RATES = TAX_RATES_2025;

export const THRESHOLDS = {
  TAX_FREE_AMOUNT_SINGLE: 57000,
  TAX_FREE_AMOUNT_PARTNER: 114000,
  DEBT_THRESHOLD_SINGLE: 3700,
  DEBT_THRESHOLD_PARTNER: 7400,
  GREEN_INVESTMENTS_EXEMPTION_SINGLE: 71251,
  GREEN_INVESTMENTS_EXEMPTION_PARTNER: 142502,
};

export interface Assets {
  bankSavings: number;
  investments: number;
  properties: number;
  otherAssets: number;
  greenInvestments: number;
  debts: number;
}

export interface TaxCalculationResult {
  taxableReturn: number;
  taxBase: number;
  savingsAndInvestmentBase: number;
  shareInTaxBase: number;
  benefitFromSavingsAndInvestments: number;
  taxAmount: number;
  steps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
  };
}

type TaxRates = typeof TAX_RATES_2025;

function calculateWithRates(assets: Assets, hasFiscalPartner: boolean, rates: TaxRates): TaxCalculationResult {
  const greenInvestmentsExemption = hasFiscalPartner
    ? THRESHOLDS.GREEN_INVESTMENTS_EXEMPTION_PARTNER
    : THRESHOLDS.GREEN_INVESTMENTS_EXEMPTION_SINGLE;

  const taxableGreenInvestments = Math.max(0, assets.greenInvestments - greenInvestmentsExemption);

  const bankSavingsReturn = assets.bankSavings * rates.BANK_SAVINGS_RATE;
  const investmentsValue = assets.investments + assets.properties + assets.otherAssets + taxableGreenInvestments;
  const investmentsReturn = investmentsValue * rates.INVESTMENTS_RATE;

  const debtThreshold = hasFiscalPartner ? THRESHOLDS.DEBT_THRESHOLD_PARTNER : THRESHOLDS.DEBT_THRESHOLD_SINGLE;
  const taxableDebt = Math.max(0, assets.debts - debtThreshold);
  const debtReturn = taxableDebt * rates.DEBT_RATE;

  const taxableReturn = bankSavingsReturn + investmentsReturn - debtReturn;

  const totalAssets = assets.bankSavings + assets.investments + assets.properties + assets.otherAssets + taxableGreenInvestments;
  const taxBase = totalAssets - taxableDebt;

  const taxFreeAmount = hasFiscalPartner ? THRESHOLDS.TAX_FREE_AMOUNT_PARTNER : THRESHOLDS.TAX_FREE_AMOUNT_SINGLE;
  const savingsAndInvestmentBase = Math.max(0, taxBase - taxFreeAmount);

  const shareInTaxBase = taxBase === 0 ? 0 : savingsAndInvestmentBase / taxBase;
  const benefitFromSavingsAndInvestments = taxableReturn * shareInTaxBase;
  const taxAmount = benefitFromSavingsAndInvestments * rates.TAX_PERCENTAGE;

  const steps = {
    step1: `Bank savings: €${assets.bankSavings.toLocaleString('nl-NL')} × ${(rates.BANK_SAVINGS_RATE * 100).toFixed(2)}% = €${bankSavingsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Investments and other assets: €${investmentsValue.toLocaleString('nl-NL')} × ${(rates.INVESTMENTS_RATE * 100).toFixed(2)}% = €${investmentsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Taxable debt: €${taxableDebt.toLocaleString('nl-NL')} × ${(rates.DEBT_RATE * 100).toFixed(2)}% = €${debtReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Taxable return: €${taxableReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    step2: `Total assets: €${totalAssets.toLocaleString('nl-NL')}
Taxable debt: €${taxableDebt.toLocaleString('nl-NL')}
Tax base: €${taxBase.toLocaleString('nl-NL')}`,
    step3: `Tax base: €${taxBase.toLocaleString('nl-NL')}
Tax-free amount: €${taxFreeAmount.toLocaleString('nl-NL')}
Savings and investment base: €${savingsAndInvestmentBase.toLocaleString('nl-NL')}`,
    step4: `Share in tax base: ${(shareInTaxBase * 100).toFixed(3)}%`,
    step5: `Benefit from savings and investments: €${benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    step6: `Tax amount: €${benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${(rates.TAX_PERCENTAGE * 100).toFixed(0)}% = €${taxAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };

  return { taxableReturn, taxBase, savingsAndInvestmentBase, shareInTaxBase, benefitFromSavingsAndInvestments, taxAmount, steps };
}

export function calculateBox3Tax(assets: Assets, hasFiscalPartner = false): TaxCalculationResult {
  return calculateWithRates(assets, hasFiscalPartner, TAX_RATES_2025);
}

export function calculateBox3TaxForYear(assets: Assets, hasFiscalPartner: boolean, year: '2024' | '2025'): TaxCalculationResult {
  return calculateWithRates(assets, hasFiscalPartner, year === '2024' ? TAX_RATES_2024 : TAX_RATES_2025);
}

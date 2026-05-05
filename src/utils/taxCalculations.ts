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

// 2026: investments rate is final (6.00%); savings and debt rates are provisional
// (based on July 2025 data; final rates published Jan 2027)
export const TAX_RATES_2026 = {
  BANK_SAVINGS_RATE: 0.0128, // 1.28% provisional
  INVESTMENTS_RATE: 0.0600,  // 6.00% final
  DEBT_RATE: 0.0270,         // 2.70% provisional
  TAX_PERCENTAGE: 0.36,      // 36%
};

export const TAX_RATES = TAX_RATES_2025;

export const THRESHOLDS_2024 = {
  TAX_FREE_AMOUNT_SINGLE: 57000,
  TAX_FREE_AMOUNT_PARTNER: 114000,
  DEBT_THRESHOLD_SINGLE: 3700,
  DEBT_THRESHOLD_PARTNER: 7400,
  GREEN_INVESTMENTS_EXEMPTION_SINGLE: 71251,
  GREEN_INVESTMENTS_EXEMPTION_PARTNER: 142502,
};

export const THRESHOLDS_2025 = {
  TAX_FREE_AMOUNT_SINGLE: 57000,
  TAX_FREE_AMOUNT_PARTNER: 114000,
  DEBT_THRESHOLD_SINGLE: 3700,
  DEBT_THRESHOLD_PARTNER: 7400,
  GREEN_INVESTMENTS_EXEMPTION_SINGLE: 71251,
  GREEN_INVESTMENTS_EXEMPTION_PARTNER: 142502,
};

export const THRESHOLDS_2026 = {
  TAX_FREE_AMOUNT_SINGLE: 59357,
  TAX_FREE_AMOUNT_PARTNER: 118714,
  DEBT_THRESHOLD_SINGLE: 3800,
  DEBT_THRESHOLD_PARTNER: 7600,
  GREEN_INVESTMENTS_EXEMPTION_SINGLE: 71251,  // unchanged from 2025
  GREEN_INVESTMENTS_EXEMPTION_PARTNER: 142502,
};

export const THRESHOLDS = THRESHOLDS_2025;

export type TaxYear = '2024' | '2025' | '2026';

type TaxThresholds = typeof THRESHOLDS_2025;

export function getThresholdsForYear(year: TaxYear): TaxThresholds {
  if (year === '2026') return THRESHOLDS_2026;
  if (year === '2024') return THRESHOLDS_2024;
  return THRESHOLDS_2025;
}

export interface Assets {
  bankSavings: number;
  investments: number;
  properties: number;               // Dutch real estate (second homes, rental)
  foreignTreatyProperties: number;  // Real estate in tax-treaty countries
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
  grossTaxAmount: number;   // before treaty reduction
  treatyReduction: number;  // Bvdb 2001 art. 23 proportional exemption
  taxAmount: number;        // net tax (grossTaxAmount - treatyReduction)
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

function calculateWithRates(assets: Assets, hasFiscalPartner: boolean, rates: TaxRates, thresholds: TaxThresholds = THRESHOLDS_2025): TaxCalculationResult {
  const foreignTreatyProperties = assets.foreignTreatyProperties ?? 0;

  const greenInvestmentsExemption = hasFiscalPartner
    ? thresholds.GREEN_INVESTMENTS_EXEMPTION_PARTNER
    : thresholds.GREEN_INVESTMENTS_EXEMPTION_SINGLE;

  const taxableGreenInvestments = Math.max(0, assets.greenInvestments - greenInvestmentsExemption);

  const bankSavingsReturn = assets.bankSavings * rates.BANK_SAVINGS_RATE;
  const investmentsValue = assets.investments + assets.properties + foreignTreatyProperties + assets.otherAssets + taxableGreenInvestments;
  const investmentsReturn = investmentsValue * rates.INVESTMENTS_RATE;

  const debtThreshold = hasFiscalPartner ? thresholds.DEBT_THRESHOLD_PARTNER : thresholds.DEBT_THRESHOLD_SINGLE;
  const taxableDebt = Math.max(0, assets.debts - debtThreshold);
  const debtReturn = taxableDebt * rates.DEBT_RATE;

  const taxableReturn = bankSavingsReturn + investmentsReturn - debtReturn;

  const totalAssets = assets.bankSavings + assets.investments + assets.properties + foreignTreatyProperties + assets.otherAssets + taxableGreenInvestments;
  const taxBase = totalAssets - taxableDebt;

  const taxFreeAmount = hasFiscalPartner ? thresholds.TAX_FREE_AMOUNT_PARTNER : thresholds.TAX_FREE_AMOUNT_SINGLE;
  const savingsAndInvestmentBase = Math.max(0, taxBase - taxFreeAmount);

  const shareInTaxBase = taxBase === 0 ? 0 : savingsAndInvestmentBase / taxBase;
  const benefitFromSavingsAndInvestments = taxableReturn * shareInTaxBase;
  const grossTaxAmount = benefitFromSavingsAndInvestments * rates.TAX_PERCENTAGE;

  // Bvdb 2001 art. 23: reduction = tax attributable to the foreign property's income.
  // Formula: foreign property's share of voordeel × tax rate
  //   = (foreignProperties × investmentRate × shareInTaxBase) × TAX_PERCENTAGE
  // Using income proportion (not asset proportion) because bank savings and real estate
  // have different rates — asset proportion would overstate the Dutch taxing share.
  const foreignTreatyReturn = foreignTreatyProperties * rates.INVESTMENTS_RATE;
  const treatyReduction = foreignTreatyProperties > 0 && benefitFromSavingsAndInvestments > 0
    ? foreignTreatyReturn * shareInTaxBase * rates.TAX_PERCENTAGE
    : 0;
  const taxAmount = grossTaxAmount - treatyReduction;

  const steps = {
    step1: `Bank savings: €${assets.bankSavings.toLocaleString('nl-NL')} × ${(rates.BANK_SAVINGS_RATE * 100).toFixed(2)}% = €${bankSavingsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
Investments and other assets: €${investmentsValue.toLocaleString('nl-NL')} × ${(rates.INVESTMENTS_RATE * 100).toFixed(2)}% = €${investmentsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${foreignTreatyProperties > 0 ? `\n  (incl. treaty-country real estate: €${foreignTreatyProperties.toLocaleString('nl-NL')})` : ''}
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
    step6: `Gross tax: €${benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${(rates.TAX_PERCENTAGE * 100).toFixed(0)}% = €${grossTaxAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${treatyReduction > 0 ? `\nTreaty reduction (Bvdb 2001 art. 23): -€${treatyReduction.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
Net tax: €${taxAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };

  return { taxableReturn, taxBase, savingsAndInvestmentBase, shareInTaxBase, benefitFromSavingsAndInvestments, grossTaxAmount, treatyReduction, taxAmount, steps };
}

export function calculateBox3Tax(assets: Assets, hasFiscalPartner = false): TaxCalculationResult {
  return calculateWithRates(assets, hasFiscalPartner, TAX_RATES_2025, THRESHOLDS_2025);
}

export function calculateBox3TaxForYear(assets: Assets, hasFiscalPartner: boolean, year: TaxYear): TaxCalculationResult {
  if (year === '2024') return calculateWithRates(assets, hasFiscalPartner, TAX_RATES_2024, THRESHOLDS_2024);
  if (year === '2026') return calculateWithRates(assets, hasFiscalPartner, TAX_RATES_2026, THRESHOLDS_2026);
  return calculateWithRates(assets, hasFiscalPartner, TAX_RATES_2025, THRESHOLDS_2025);
}

// Rough estimate for 2028 accrual-tax scenario: taxableBase × assumedReturnRate × 36%
// Treaty reduction applied proportionally (same principle, rules not yet finalised).
// The final rules are not set; this uses a user-provided assumed annual return.
export function calculateBox3Tax2028(assets: Assets, hasFiscalPartner: boolean, assumedReturnRate: number, thresholds: TaxThresholds = THRESHOLDS_2025): number {
  const foreignTreatyProperties = assets.foreignTreatyProperties ?? 0;
  const greenInvestmentsExemption = hasFiscalPartner
    ? thresholds.GREEN_INVESTMENTS_EXEMPTION_PARTNER
    : thresholds.GREEN_INVESTMENTS_EXEMPTION_SINGLE;
  const taxableGreenInvestments = Math.max(0, assets.greenInvestments - greenInvestmentsExemption);
  const debtThreshold = hasFiscalPartner ? thresholds.DEBT_THRESHOLD_PARTNER : thresholds.DEBT_THRESHOLD_SINGLE;
  const taxableDebt = Math.max(0, assets.debts - debtThreshold);
  const totalAssets = assets.bankSavings + assets.investments + assets.properties + foreignTreatyProperties + assets.otherAssets + taxableGreenInvestments;
  const taxBase = totalAssets - taxableDebt;
  const taxFreeAmount = hasFiscalPartner ? thresholds.TAX_FREE_AMOUNT_PARTNER : thresholds.TAX_FREE_AMOUNT_SINGLE;
  const taxableBase = Math.max(0, taxBase - taxFreeAmount);
  const grossTax = taxableBase * assumedReturnRate * 0.36;
  const treatyReduction = taxBase > 0 && foreignTreatyProperties > 0
    ? grossTax * (foreignTreatyProperties / taxBase)
    : 0;
  return grossTax - treatyReduction;
}

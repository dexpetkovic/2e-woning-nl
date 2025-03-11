// Constants for 2024 Box 3 tax calculations
export const TAX_RATES = {
  BANK_SAVINGS_RATE: 0.0144, // 1.44%
  INVESTMENTS_RATE: 0.0604, // 6.04%
  DEBT_RATE: 0.0261, // 2.61%
  TAX_PERCENTAGE: 0.36, // 36%
};

export const THRESHOLDS = {
  TAX_FREE_AMOUNT_SINGLE: 57000, // €57,000 per person
  TAX_FREE_AMOUNT_PARTNER: 114000, // €114,000 for fiscal partners
  DEBT_THRESHOLD_SINGLE: 3700, // €3,700 per person
  DEBT_THRESHOLD_PARTNER: 7400, // €7,400 for fiscal partners
  GREEN_INVESTMENTS_EXEMPTION_SINGLE: 71251, // €71,251 per person
  GREEN_INVESTMENTS_EXEMPTION_PARTNER: 142502, // €142,502 for fiscal partners
};

export interface Assets {
  bankSavings: number; // Bank and savings accounts
  investments: number; // Stocks, bonds, etc.
  properties: number; // Second homes, rental properties
  otherAssets: number; // Other assets
  greenInvestments: number; // Green investments
  debts: number; // Debts
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

/**
 * Calculate Box 3 tax based on assets and fiscal partner status
 */
export function calculateBox3Tax(
  assets: Assets,
  hasFiscalPartner: boolean = false
): TaxCalculationResult {
  // Step 1: Calculate taxable return
  const bankSavingsReturn = assets.bankSavings * TAX_RATES.BANK_SAVINGS_RATE;
  
  // Calculate taxable green investments (exempt up to threshold)
  const greenInvestmentsExemption = hasFiscalPartner
    ? THRESHOLDS.GREEN_INVESTMENTS_EXEMPTION_PARTNER
    : THRESHOLDS.GREEN_INVESTMENTS_EXEMPTION_SINGLE;
  
  const taxableGreenInvestments = Math.max(0, assets.greenInvestments - greenInvestmentsExemption);
  
  // Calculate investments and other assets return
  const investmentsAndOtherAssetsValue = 
    assets.investments + 
    assets.properties + 
    assets.otherAssets + 
    taxableGreenInvestments;
  
  const investmentsAndOtherAssetsReturn = investmentsAndOtherAssetsValue * TAX_RATES.INVESTMENTS_RATE;
  
  // Calculate debt threshold and return
  const debtThreshold = hasFiscalPartner
    ? THRESHOLDS.DEBT_THRESHOLD_PARTNER
    : THRESHOLDS.DEBT_THRESHOLD_SINGLE;
  
  const taxableDebt = Math.max(0, assets.debts - debtThreshold);
  const debtReturn = taxableDebt * TAX_RATES.DEBT_RATE;
  
  // Calculate total taxable return
  const taxableReturn = bankSavingsReturn + investmentsAndOtherAssetsReturn - debtReturn;
  
  // Step 2: Calculate tax base (rendementsgrondslag)
  const totalAssets = 
    assets.bankSavings + 
    assets.investments + 
    assets.properties + 
    assets.otherAssets + 
    taxableGreenInvestments;
  
  const taxBase = totalAssets - taxableDebt;
  
  // Step 3: Calculate savings and investment base (grondslag sparen en beleggen)
  const taxFreeAmount = hasFiscalPartner
    ? THRESHOLDS.TAX_FREE_AMOUNT_PARTNER
    : THRESHOLDS.TAX_FREE_AMOUNT_SINGLE;
  
  const savingsAndInvestmentBase = Math.max(0, taxBase - taxFreeAmount);
  
  // Step 4: Calculate share in tax base
  // If tax base is 0, share is 0 to avoid division by zero
  const shareInTaxBase = taxBase === 0 ? 0 : (savingsAndInvestmentBase / taxBase);
  
  // Step 5: Calculate benefit from savings and investments
  const benefitFromSavingsAndInvestments = taxableReturn * shareInTaxBase;
  
  // Step 6: Calculate tax amount
  const taxAmount = benefitFromSavingsAndInvestments * TAX_RATES.TAX_PERCENTAGE;
  
  // Format steps for display
  const steps = {
    step1: `
      Bank savings: €${assets.bankSavings.toLocaleString('nl-NL')} × ${(TAX_RATES.BANK_SAVINGS_RATE * 100).toFixed(2)}% = €${bankSavingsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      Investments and other assets: €${investmentsAndOtherAssetsValue.toLocaleString('nl-NL')} × ${(TAX_RATES.INVESTMENTS_RATE * 100).toFixed(2)}% = €${investmentsAndOtherAssetsReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      Taxable debt: €${taxableDebt.toLocaleString('nl-NL')} × ${(TAX_RATES.DEBT_RATE * 100).toFixed(2)}% = €${debtReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      Taxable return: €${taxableReturn.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    `,
    step2: `
      Total assets: €${totalAssets.toLocaleString('nl-NL')}
      Taxable debt: €${taxableDebt.toLocaleString('nl-NL')}
      Tax base: €${taxBase.toLocaleString('nl-NL')}
    `,
    step3: `
      Tax base: €${taxBase.toLocaleString('nl-NL')}
      Tax-free amount: €${taxFreeAmount.toLocaleString('nl-NL')}
      Savings and investment base: €${savingsAndInvestmentBase.toLocaleString('nl-NL')}
    `,
    step4: `
      Share in tax base: ${(shareInTaxBase * 100).toFixed(3)}%
    `,
    step5: `
      Benefit from savings and investments: €${benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    `,
    step6: `
      Tax amount: €${benefitFromSavingsAndInvestments.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × ${(TAX_RATES.TAX_PERCENTAGE * 100).toFixed(0)}% = €${taxAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    `,
  };
  
  return {
    taxableReturn,
    taxBase,
    savingsAndInvestmentBase,
    shareInTaxBase,
    benefitFromSavingsAndInvestments,
    taxAmount,
    steps,
  };
} 
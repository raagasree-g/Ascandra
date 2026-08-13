export interface BusinessInformation {
  business_type: string;
  products: string;
}

export interface FinancialInformation {
  purchase_cost_per_unit: number;
  selling_price_per_unit: number;
  sales_volume: number;
  monthly_operating_expenses: number;
  current_cash_balance: number;
}

export interface CreditInformation {
  supplier_amount_owed: number;
  supplier_payment_days: number;
  customer_amount_due: number;
  customer_payment_days: number;
}

export interface AnalysisPayload {
  session_id: string;
  input_type: "text" | "voice" | "document";

  user_message: string;

  business_information: BusinessInformation;
  financial_information: FinancialInformation;
  credit_information: CreditInformation;
}

export interface AnalysisResponse {
  [key: string]: unknown;
}

export interface ApiError {
  error: string;
  details?: unknown;
}
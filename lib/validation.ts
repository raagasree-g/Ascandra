import type { AnalysisPayload } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateAnalysisPayload(
  payload: AnalysisPayload,
): ValidationResult {
  const errors: string[] = [];

  if (!payload.business_information.business_type.trim()) {
    errors.push("Business type is required.");
  }

  if (!payload.business_information.products.trim()) {
    errors.push("Products or services are required.");
  }

  if (
    payload.financial_information.purchase_cost_per_unit < 0
  ) {
    errors.push("Purchase cost cannot be negative.");
  }

  if (
    payload.financial_information.selling_price_per_unit < 0
  ) {
    errors.push("Selling price cannot be negative.");
  }

  if (payload.financial_information.sales_volume < 0) {
    errors.push("Sales volume cannot be negative.");
  }

  if (
    payload.financial_information.monthly_operating_expenses < 0
  ) {
    errors.push(
      "Monthly operating expenses cannot be negative.",
    );
  }

  if (
    payload.financial_information.current_cash_balance < 0
  ) {
    errors.push("Cash balance cannot be negative.");
  }

  if (payload.credit_information.supplier_amount_owed < 0) {
    errors.push("Supplier amount owed cannot be negative.");
  }

  if (payload.credit_information.supplier_payment_days < 0) {
    errors.push("Supplier payment days cannot be negative.");
  }

  if (payload.credit_information.customer_amount_due < 0) {
    errors.push("Customer amount due cannot be negative.");
  }

  if (payload.credit_information.customer_payment_days < 0) {
    errors.push("Customer payment days cannot be negative.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
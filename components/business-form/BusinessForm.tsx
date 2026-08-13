"use client";

import { FormEvent, useState } from "react";
import InputField from "./InputField";

export interface BusinessFormData {
  businessType: string;
  products: string;
  sellingPricePerUnit: string;
  purchaseCostPerUnit: string;
  salesVolume: string;
  supplierPaymentDays: string;
  customerPaymentDays: string;
  supplierAmountOwed: string;
  customerAmountDue: string;
  monthlyOperatingExpenses: string;
  currentCashBalance: string;
  monthlyDebtPayments: string;
  otherMonthlyCashOutflows: string;
}

interface BusinessFormProps {
  onSubmit?: (data: BusinessFormData) => void;
  loading?: boolean;
}

const initialForm: BusinessFormData = {
  businessType: "",
  products: "",
  sellingPricePerUnit: "",
  purchaseCostPerUnit: "",
  salesVolume: "",
  supplierPaymentDays: "",
  customerPaymentDays: "",
  supplierAmountOwed: "",
  customerAmountDue: "",
  monthlyOperatingExpenses: "",
  currentCashBalance: "",
  monthlyDebtPayments: "",
  otherMonthlyCashOutflows: "",
};

export default function BusinessForm({
  onSubmit,
  loading = false,
}: BusinessFormProps) {
  const [form, setForm] = useState<BusinessFormData>(initialForm);

  const updateField = (field: keyof BusinessFormData, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.businessType || !form.products) {
      return;
    }

    onSubmit?.(form);
  };

  return (
    <form className="business-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h1>Analyze Your Business</h1>
        <p>
          Enter your business information to generate a financial health and
          risk assessment.
        </p>
      </div>

      <section className="form-section">
        <h2>Business Information</h2>

        <div className="form-grid">
          <InputField
            label="Business Type"
            name="businessType"
            value={form.businessType}
            onChange={(value) => updateField("businessType", value)}
            placeholder="e.g. Saree business"
            required
          />

          <InputField
            label="Products / Services"
            name="products"
            value={form.products}
            onChange={(value) => updateField("products", value)}
            placeholder="e.g. Sarees"
            required
          />
        </div>
      </section>

      <section className="form-section">
        <h2>Sales & Costs</h2>

        <div className="form-grid">
          <InputField
            label="Selling Price per Unit"
            name="sellingPricePerUnit"
            type="number"
            value={form.sellingPricePerUnit}
            onChange={(value) => updateField("sellingPricePerUnit", value)}
            placeholder="₹1000"
          />

          <InputField
            label="Purchase Cost per Unit"
            name="purchaseCostPerUnit"
            type="number"
            value={form.purchaseCostPerUnit}
            onChange={(value) => updateField("purchaseCostPerUnit", value)}
            placeholder="₹700"
          />

          <InputField
            label="Monthly Sales Volume"
            name="salesVolume"
            type="number"
            value={form.salesVolume}
            onChange={(value) => updateField("salesVolume", value)}
            placeholder="50"
          />

          <InputField
            label="Monthly Operating Expenses"
            name="monthlyOperatingExpenses"
            type="number"
            value={form.monthlyOperatingExpenses}
            onChange={(value) =>
              updateField("monthlyOperatingExpenses", value)
            }
            placeholder="₹12000"
          />
        </div>
      </section>

      <section className="form-section">
        <h2>Cash & Credit</h2>

        <div className="form-grid">
          <InputField
            label="Supplier Payment Days"
            name="supplierPaymentDays"
            type="number"
            value={form.supplierPaymentDays}
            onChange={(value) => updateField("supplierPaymentDays", value)}
            placeholder="30"
          />

          <InputField
            label="Customer Payment Days"
            name="customerPaymentDays"
            type="number"
            value={form.customerPaymentDays}
            onChange={(value) => updateField("customerPaymentDays", value)}
            placeholder="15"
          />

          <InputField
            label="Amount Owed to Suppliers"
            name="supplierAmountOwed"
            type="number"
            value={form.supplierAmountOwed}
            onChange={(value) => updateField("supplierAmountOwed", value)}
            placeholder="₹20000"
          />

          <InputField
            label="Amount Due from Customers"
            name="customerAmountDue"
            type="number"
            value={form.customerAmountDue}
            onChange={(value) => updateField("customerAmountDue", value)}
            placeholder="₹10000"
          />

          <InputField
            label="Current Cash Balance"
            name="currentCashBalance"
            type="number"
            value={form.currentCashBalance}
            onChange={(value) => updateField("currentCashBalance", value)}
            placeholder="₹30000"
          />

          <InputField
            label="Monthly Debt Payments"
            name="monthlyDebtPayments"
            type="number"
            value={form.monthlyDebtPayments}
            onChange={(value) => updateField("monthlyDebtPayments", value)}
            placeholder="₹5000"
          />

          <InputField
            label="Other Monthly Cash Outflows"
            name="otherMonthlyCashOutflows"
            type="number"
            value={form.otherMonthlyCashOutflows}
            onChange={(value) =>
              updateField("otherMonthlyCashOutflows", value)
            }
            placeholder="₹2000"
          />
        </div>
      </section>

      <button
        type="submit"
        className="primary-button"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Business"}
      </button>
    </form>
  );
}
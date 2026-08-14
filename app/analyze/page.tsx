"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import VoiceInput from "@/components/input/VoiceInput";
import LanguageSelector from "@/components/input/LanguageSelector";

export default function AnalyzePage() {
  const router = useRouter();

  const [businessType, setBusinessType] = useState("");
  const [products, setProducts] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [salesVolume, setSalesVolume] = useState("");
  const [supplierDays, setSupplierDays] = useState("");
  const [customerDays, setCustomerDays] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] =
    useState("");
  const [cashBalance, setCashBalance] =
    useState("");
  const [supplierOwed, setSupplierOwed] =
    useState("");
  const [customerDue, setCustomerDue] =
    useState("");

  const [message, setMessage] = useState("");

  const [language, setLanguage] =
    useState("en");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleVoiceTranscript(
    transcript: string,
  ) {
    setMessage((previous) =>
      previous
        ? `${previous} ${transcript}`
        : transcript,
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    const payload = {
      session_id: `session_${Date.now()}`,

      input_type: "text",

      user_message: message,

      response_language: language,

      business_information: {
        business_type: businessType,
        products,
      },

      financial_information: {
        purchase_cost_per_unit:
          Number(purchaseCost) || 0,

        selling_price_per_unit:
          Number(sellingPrice) || 0,

        sales_volume:
          Number(salesVolume) || 0,

        monthly_operating_expenses:
          Number(monthlyExpenses) || 0,

        current_cash_balance:
          Number(cashBalance) || 0,
      },

      credit_information: {
        supplier_amount_owed:
          Number(supplierOwed) || 0,

        supplier_payment_days:
          Number(supplierDays) || 0,

        customer_amount_due:
          Number(customerDue) || 0,

        customer_payment_days:
          Number(customerDays) || 0,
      },
    };

    try {
      const response = await fetch(
        "/api/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Analysis failed",
        );
      }

      sessionStorage.setItem(
        "ascandra-analysis",
        JSON.stringify(data),
      );

      router.push("/results");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the business.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <div className="form-container">

        <div className="form-header">
          <h1>
            Analyze your business
          </h1>

          <p>
            Provide your business
            information using structured
            fields or simply tell Ascandra
            what is happening.
          </p>
        </div>

        <form
          className="form-card"
          onSubmit={handleSubmit}
        >

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* LANGUAGE */}

          <div className="field">
            <label>
              Response Language
            </label>

            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />
          </div>

          {/* TEXT INPUT */}

          <div className="field">
            <label>
              Tell Ascandra
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value,
                )
              }
              placeholder="Example: I run a small saree business and my customers are taking too long to pay..."
              rows={5}
            />

            <p className="input-hint">
              Press Enter to send ·
              Shift + Enter for a new line
            </p>
          </div>

          {/* VOICE INPUT */}

          <VoiceInput
            onTranscript={
              handleVoiceTranscript
            }
            language={language}
            disabled={loading}
          />

          {/* BUSINESS INFORMATION */}

          <h2>
            Business Information
          </h2>

          <div className="field">
            <label>
              Business type
            </label>

            <input
              value={businessType}
              onChange={(e) =>
                setBusinessType(
                  e.target.value,
                )
              }
              placeholder="Example: Saree business"
              required
            />
          </div>

          <div className="field">
            <label>
              Products / services
            </label>

            <input
              value={products}
              onChange={(e) =>
                setProducts(
                  e.target.value,
                )
              }
              placeholder="Example: Sarees"
              required
            />
          </div>

          {/* FINANCIAL INFORMATION */}

          <h2>
            Financial Information
          </h2>

          <div className="form-grid">

            <div className="field">
              <label>
                Purchase cost per unit (₹)
              </label>

              <input
                type="number"
                min="0"
                value={purchaseCost}
                onChange={(e) =>
                  setPurchaseCost(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Selling price per unit (₹)
              </label>

              <input
                type="number"
                min="0"
                value={sellingPrice}
                onChange={(e) =>
                  setSellingPrice(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Monthly sales volume
              </label>

              <input
                type="number"
                min="0"
                value={salesVolume}
                onChange={(e) =>
                  setSalesVolume(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Monthly operating expenses (₹)
              </label>

              <input
                type="number"
                min="0"
                value={monthlyExpenses}
                onChange={(e) =>
                  setMonthlyExpenses(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Current cash balance (₹)
              </label>

              <input
                type="number"
                min="0"
                value={cashBalance}
                onChange={(e) =>
                  setCashBalance(
                    e.target.value,
                  )
                }
              />
            </div>

          </div>

          {/* CREDIT INFORMATION */}

          <h2>
            Credit Information
          </h2>

          <div className="form-grid">

            <div className="field">
              <label>
                Supplier amount owed (₹)
              </label>

              <input
                type="number"
                min="0"
                value={supplierOwed}
                onChange={(e) =>
                  setSupplierOwed(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Supplier payment period (days)
              </label>

              <input
                type="number"
                min="0"
                value={supplierDays}
                onChange={(e) =>
                  setSupplierDays(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Customer amount due (₹)
              </label>

              <input
                type="number"
                min="0"
                value={customerDue}
                onChange={(e) =>
                  setCustomerDue(
                    e.target.value,
                  )
                }
              />
            </div>

            <div className="field">
              <label>
                Customer payment period (days)
              </label>

              <input
                type="number"
                min="0"
                value={customerDays}
                onChange={(e) =>
                  setCustomerDays(
                    e.target.value,
                  )
                }
              />
            </div>

          </div>

          {/* ADDITIONAL MESSAGE */}

          <div className="field">
            <label>
              Tell Ascandra anything else
              about your business
            </label>

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value,
                )
              }
              placeholder="Example: I run a small saree business. I sell each saree for ₹1,000..."
              rows={5}
            />
          </div>

          {/* SUBMIT */}

          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Analyzing business..."
              : "Analyze Business"}
          </button>

        </form>
      </div>
    </main>
  );
}
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import VoiceInput from "@/components/input/VoiceInput";
import LanguageSelector from "@/components/input/LanguageSelector";

export default function AnalyzePage() {
  const router = useRouter();

  // =========================================================
  // STATE
  // =========================================================

  const [language, setLanguage] = useState("English");

  const [message, setMessage] = useState("");

  const [businessType, setBusinessType] = useState("");
  const [products, setProducts] = useState("");

  const [purchaseCost, setPurchaseCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [salesVolume, setSalesVolume] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [cashBalance, setCashBalance] = useState("");

  const [supplierOwed, setSupplierOwed] = useState("");
  const [supplierDays, setSupplierDays] = useState("");
  const [customerDue, setCustomerDue] = useState("");
  const [customerDays, setCustomerDays] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // VOICE INPUT
  // =========================================================

  function handleVoiceTranscript(transcript: string) {
    setMessage((current) => {
      if (!current.trim()) {
        return transcript;
      }

      return `${current.trim()} ${transcript}`;
    });
  }

  // =========================================================
  // SUBMIT
  // IMPORTANT:
  // KEEP THIS PAYLOAD COMPATIBLE WITH YOUR WORKING BACKEND
  // =========================================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      language,

      user_message: message,

      business_information: {
        business_type: businessType,
        products_services: products,
      },

      financial_information: {
        purchase_cost_per_unit:
          purchaseCost === "" ? null : Number(purchaseCost),

        selling_price_per_unit:
          sellingPrice === "" ? null : Number(sellingPrice),

        sales_volume:
          salesVolume === "" ? null : Number(salesVolume),

        monthly_operating_expenses:
          monthlyExpenses === "" ? null : Number(monthlyExpenses),

        current_cash_balance:
          cashBalance === "" ? null : Number(cashBalance),
      },

      credit_information: {
        supplier_amount_owed:
          supplierOwed === "" ? null : Number(supplierOwed),

        supplier_payment_days:
          supplierDays === "" ? null : Number(supplierDays),

        customer_amount_due:
          customerDue === "" ? null : Number(customerDue),

        customer_payment_days:
          customerDays === "" ? null : Number(customerDays),
      },
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.details ||
            "Unable to analyze the business.",
        );
      }

      // Store the exact backend response for /results
      sessionStorage.setItem(
        "ascandra-analysis",
        JSON.stringify(data),
      );

      // Keep the existing working navigation
      router.push("/results");
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the business.",
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="analyze-page">
      <div className="analyze-shell">

        {/* TOP BAR */}
        <header className="analyze-topbar">
          <div className="analyze-brand">
            <span className="brand-mark-dot" />
            <span>Ascandra</span>
          </div>

          <div className="language-mini">
            <span>Language</span>

            <LanguageSelector
              value={language}
              onChange={setLanguage}
            />
          </div>
        </header>

        {/* HERO */}
        <section className="analyze-hero">
          <div className="hero-copy">
            <span className="section-kicker">
              BUSINESS INTELLIGENCE
            </span>

            <h1>
              Let&apos;s understand
              <br />
              <em>your business.</em>
            </h1>

            <p>
              Tell Ascandra what is happening in your
              business. You can speak naturally or add
              the numbers you know.
            </p>
          </div>

          <div className="hero-decoration">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />

            <div className="hero-center">
              <span>✦</span>
            </div>
          </div>
        </section>

        <form
          className="analyze-form"
          onSubmit={handleSubmit}
        >

          {/* ERROR */}
          {error && (
            <div className="analyze-error">
              <span>!</span>

              <p>{error}</p>
            </div>
          )}

          {/* =================================================
              NATURAL LANGUAGE
          ================================================= */}

          <section className="story-card">

            <div className="story-card-heading">

              <div className="heading-icon peach-icon">
                ✦
              </div>

              <div>
                <span className="section-kicker">
                  START HERE
                </span>

                <h2>
                  Tell Ascandra what&apos;s happening
                </h2>
              </div>

            </div>

            <p className="section-description">
              You don&apos;t need to know all the numbers.
              Just explain your situation in your own
              words.
            </p>

            <div className="story-input-wrapper">

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="For example: I run a small saree business. Sales are okay, but customers are taking too long to pay me..."
                rows={6}
                disabled={loading}
              />

              <div className="story-input-footer">

                <span>
                  You can write naturally — no accounting
                  language needed.
                </span>

                <VoiceInput
                  language={language}
                  onTranscript={handleVoiceTranscript}
                  disabled={loading}
                />

              </div>
            </div>

          </section>

          {/* DIVIDER */}

          <div className="or-divider">
            <span>OR ADD DETAILS BELOW</span>
          </div>

          {/* =================================================
              BUSINESS INFORMATION
          ================================================= */}

          <section className="form-section-card">

            <div className="form-section-header">

              <div className="section-number">
                01
              </div>

              <div>
                <span className="section-kicker">
                  YOUR BUSINESS
                </span>

                <h2>
                  Tell us a little about it
                </h2>

                <p>
                  These details help Ascandra understand
                  what you actually sell.
                </p>
              </div>

            </div>

            <div className="fields-grid">

              <div className="modern-field">

                <label htmlFor="business-type">
                  What kind of business do you run?
                </label>

                <input
                  id="business-type"
                  type="text"
                  value={businessType}
                  onChange={(event) =>
                    setBusinessType(event.target.value)
                  }
                  placeholder="e.g. Saree business"
                  disabled={loading}
                />

              </div>

              <div className="modern-field">

                <label htmlFor="products">
                  What do you sell or provide?
                </label>

                <input
                  id="products"
                  type="text"
                  value={products}
                  onChange={(event) =>
                    setProducts(event.target.value)
                  }
                  placeholder="e.g. Handloom sarees"
                  disabled={loading}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              FINANCIAL INFORMATION
          ================================================= */}

          <section className="form-section-card">

            <div className="form-section-header">

              <div className="section-number">
                02
              </div>

              <div>
                <span className="section-kicker">
                  MONEY
                </span>

                <h2>
                  How is the money moving?
                </h2>

                <p>
                  Don&apos;t worry if you don&apos;t know every
                  number. Fill in what you know.
                </p>
              </div>

            </div>

            <div className="fields-grid">

              {/* PURCHASE COST */}

              <div className="modern-field">

                <label htmlFor="purchase-cost">
                  Cost to make / buy one
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="purchase-cost"
                    type="number"
                    min="0"
                    value={purchaseCost}
                    onChange={(event) =>
                      setPurchaseCost(
                        event.target.value,
                      )
                    }
                    placeholder="700"
                    disabled={loading}
                  />

                </div>

                <small>
                  What one unit costs you
                </small>

              </div>

              {/* SELLING PRICE */}

              <div className="modern-field">

                <label htmlFor="selling-price">
                  Selling price per unit
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="selling-price"
                    type="number"
                    min="0"
                    value={sellingPrice}
                    onChange={(event) =>
                      setSellingPrice(
                        event.target.value,
                      )
                    }
                    placeholder="1000"
                    disabled={loading}
                  />

                </div>

                <small>
                  What your customer pays
                </small>

              </div>

              {/* SALES VOLUME */}

              <div className="modern-field">

                <label htmlFor="sales-volume">
                  Units sold each month
                </label>

                <input
                  id="sales-volume"
                  type="number"
                  min="0"
                  value={salesVolume}
                  onChange={(event) =>
                    setSalesVolume(
                      event.target.value,
                    )
                  }
                  placeholder="50"
                  disabled={loading}
                />

                <small>
                  An approximate number is fine
                </small>

              </div>

              {/* MONTHLY EXPENSES */}

              <div className="modern-field">

                <label htmlFor="monthly-expenses">
                  Monthly business expenses
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="monthly-expenses"
                    type="number"
                    min="0"
                    value={monthlyExpenses}
                    onChange={(event) =>
                      setMonthlyExpenses(
                        event.target.value,
                      )
                    }
                    placeholder="15000"
                    disabled={loading}
                  />

                </div>

                <small>
                  Rent, salaries, transport, etc.
                </small>

              </div>

              {/* CASH BALANCE */}

              <div className="modern-field field-full">

                <label htmlFor="cash-balance">
                  Money currently available for the business
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="cash-balance"
                    type="number"
                    min="0"
                    value={cashBalance}
                    onChange={(event) =>
                      setCashBalance(
                        event.target.value,
                      )
                    }
                    placeholder="25000"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              CREDIT INFORMATION
          ================================================= */}

          <section className="form-section-card">

            <div className="form-section-header">

              <div className="section-number">
                03
              </div>

              <div>
                <span className="section-kicker">
                  PAYMENTS
                </span>

                <h2>
                  Who owes whom?
                </h2>

                <p>
                  This helps us understand your cash-flow
                  pressure.
                </p>
              </div>

            </div>

            <div className="credit-explainer">

              <div>

                <span className="credit-dot customer" />

                <div>
                  <strong>
                    Customers owe you
                  </strong>

                  <span>
                    Money you are waiting to receive
                  </span>
                </div>

              </div>

              <div>

                <span className="credit-dot supplier" />

                <div>
                  <strong>
                    You owe suppliers
                  </strong>

                  <span>
                    Money your business needs to pay
                  </span>
                </div>

              </div>

            </div>

            <div className="fields-grid">

              {/* CUSTOMER DUE */}

              <div className="modern-field">

                <label htmlFor="customer-due">
                  Customers owe you
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="customer-due"
                    type="number"
                    min="0"
                    value={customerDue}
                    onChange={(event) =>
                      setCustomerDue(
                        event.target.value,
                      )
                    }
                    placeholder="25000"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* CUSTOMER DAYS */}

              <div className="modern-field">

                <label htmlFor="customer-days">
                  Customers usually pay in
                </label>

                <div className="input-with-suffix">

                  <input
                    id="customer-days"
                    type="number"
                    min="0"
                    value={customerDays}
                    onChange={(event) =>
                      setCustomerDays(
                        event.target.value,
                      )
                    }
                    placeholder="30"
                    disabled={loading}
                  />

                  <span>days</span>

                </div>

              </div>

              {/* SUPPLIER OWED */}

              <div className="modern-field">

                <label htmlFor="supplier-owed">
                  You owe suppliers
                </label>

                <div className="input-with-prefix">

                  <span>₹</span>

                  <input
                    id="supplier-owed"
                    type="number"
                    min="0"
                    value={supplierOwed}
                    onChange={(event) =>
                      setSupplierOwed(
                        event.target.value,
                      )
                    }
                    placeholder="35000"
                    disabled={loading}
                  />

                </div>

              </div>

              {/* SUPPLIER DAYS */}

              <div className="modern-field">

                <label htmlFor="supplier-days">
                  You usually pay suppliers in
                </label>

                <div className="input-with-suffix">

                  <input
                    id="supplier-days"
                    type="number"
                    min="0"
                    value={supplierDays}
                    onChange={(event) =>
                      setSupplierDays(
                        event.target.value,
                      )
                    }
                    placeholder="30"
                    disabled={loading}
                  />

                  <span>days</span>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <section className="analyze-submit-card">

            <div>

              <span className="section-kicker">
                READY?
              </span>

              <h2>
                Let&apos;s make sense of it.
              </h2>

              <p>
                Ascandra will look at what you&apos;ve shared
                and highlight the decisions that matter
                most.
              </p>

            </div>

            <button
              className="analyze-submit-button"
              type="submit"
              disabled={loading}
            >

              <span>
                {loading
                  ? "Analyzing your business..."
                  : "Understand my business"}
              </span>

              {!loading && (
                <span className="submit-arrow">
                  →
                </span>
              )}

            </button>

          </section>

          <p className="privacy-note">
            Your information is used to generate your
            business analysis.
          </p>

        </form>
      </div>
    </main>
  );
}
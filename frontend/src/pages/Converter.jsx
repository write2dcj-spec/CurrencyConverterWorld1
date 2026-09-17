import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import API from "../api/api";

import "../css/Converter.css";


function Converter() {

    // ==========================================
    // BASIC STATE
    // ==========================================

    const [amount, setAmount] =
        useState("");

    const [fromCurrency, setFromCurrency] =
        useState("USD");

    const [toCurrency, setToCurrency] =
        useState("INR");

    const [result, setResult] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ==========================================
    // AUTHENTICATION
    // ==========================================

    const token =
        localStorage.getItem("token");

    const isLoggedIn =
        Boolean(token);


    // ==========================================
    // GUEST CONVERSION LIMIT
    // ==========================================

    const GUEST_CONVERSION_LIMIT = 10;


    const getStoredGuestCount = () => {

        const storedCount =
            Number(
                localStorage.getItem(
                    "guestConversionCount"
                )
            );


        if (
            Number.isNaN(storedCount) ||
            storedCount < 0
        ) {

            return 0;
        }


        return storedCount;
    };


    const [
        guestConversionCount,
        setGuestConversionCount
    ] =
        useState(
            getStoredGuestCount
        );


    const [
        showGuestLimit,
        setShowGuestLimit
    ] =
        useState(false);


    // ==========================================
    // DYNAMIC CURRENCIES
    // ==========================================

    const [
        currencies,
        setCurrencies
    ] =
        useState([]);


    const [
        currenciesLoading,
        setCurrenciesLoading
    ] =
        useState(true);


    const [
        currenciesError,
        setCurrenciesError
    ] =
        useState("");


    // ==========================================
    // LOAD CURRENCIES FROM SPRING BOOT
    // ==========================================

    useEffect(() => {

        const loadCurrencies = async () => {

            try {

                setCurrenciesLoading(
                    true
                );

                setCurrenciesError(
                    ""
                );


                const response =
                    await API.get(
                        "/currencies"
                    );


                if (
                    !Array.isArray(
                        response.data
                    )
                ) {

                    throw new Error(
                        "Invalid currency response"
                    );
                }


                // ==================================
                // ACTIVE CURRENCIES ONLY
                // ==================================

                const activeCurrencies =
                    response.data

                        .filter(
                            (currency) =>
                                currency.active &&
                                currency.code
                        )

                        .sort(
                            (a, b) =>
                                a.code.localeCompare(
                                    b.code
                                )
                        );


                setCurrencies(
                    activeCurrencies
                );


            } catch (error) {

                console.error(
                    "Currency Loading Error:",
                    error
                );


                setCurrenciesError(
                    "Unable to load currencies. Please try again."
                );


            } finally {

                setCurrenciesLoading(
                    false
                );
            }
        };


        loadCurrencies();

    }, []);


    // ==========================================
    // FIND SELECTED CURRENCY
    // ==========================================

    const getCurrency = (code) => {

        return currencies.find(
            (currency) =>
                currency.code === code
        );
    };


    const selectedFromCurrency =
        getCurrency(
            fromCurrency
        );


    const selectedToCurrency =
        getCurrency(
            toCurrency
        );


    // ==========================================
    // RESET RESULT
    // ==========================================

    const resetResult = () => {

        setResult(null);

        setError("");
    };


    // ==========================================
    // SWAP CURRENCIES
    // ==========================================

    const handleSwap = () => {

        const oldFromCurrency =
            fromCurrency;


        setFromCurrency(
            toCurrency
        );


        setToCurrency(
            oldFromCurrency
        );


        resetResult();
    };


    // ==========================================
    // CONVERT CURRENCY
    // ==========================================

    const handleConvert = async () => {

        // ======================================
        // VALIDATE AMOUNT
        // ======================================

        if (
            !amount ||
            Number(amount) <= 0
        ) {

            setError(
                "Please enter a valid amount."
            );

            return;
        }


        // ======================================
        // CHECK CURRENCY LIST
        // ======================================

        if (
            currenciesLoading ||
            currencies.length === 0
        ) {

            setError(
                "Currencies are still loading. Please try again."
            );

            return;
        }


        // ======================================
        // CHECK GUEST LIMIT
        // ======================================

        if (
            !isLoggedIn &&
            guestConversionCount >=
                GUEST_CONVERSION_LIMIT
        ) {

            setResult(null);

            setError("");

            setShowGuestLimit(
                true
            );

            return;
        }


        try {

            setLoading(
                true
            );

            setError(
                ""
            );

            setResult(
                null
            );

            setShowGuestLimit(
                false
            );


            // ==================================
            // CALL SPRING BOOT
            // ==================================

            const response =
                await API.post(
                    "/conversions",
                    {

                        amount:
                            Number(amount),

                        fromCurrency:
                            fromCurrency,

                        toCurrency:
                            toCurrency
                    }
                );


            // ==================================
            // SHOW RESULT
            // ==================================

            setResult(
                response.data
            );


            // ==================================
            // SUCCESSFUL GUEST CONVERSION
            //
            // Only successful conversions count.
            // ==================================

            if (!isLoggedIn) {

                const newCount =
                    Math.min(

                        guestConversionCount + 1,

                        GUEST_CONVERSION_LIMIT
                    );


                localStorage.setItem(
                    "guestConversionCount",
                    String(newCount)
                );


                setGuestConversionCount(
                    newCount
                );
            }


        } catch (error) {

            console.error(
                "Conversion Error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                setError(
                    "Your session has expired. Please sign in again."
                );


            } else {

                setError(
                    error.response?.data?.message ||
                    "Unable to convert currency. Please try again."
                );
            }


        } finally {

            setLoading(
                false
            );
        }
    };


    // ==========================================
    // GUEST CONVERSIONS REMAINING
    // ==========================================

    const guestConversionsRemaining =
        Math.max(

            GUEST_CONVERSION_LIMIT -
                guestConversionCount,

            0
        );


    // ==========================================
    // DISPLAY NAME HELPERS
    // ==========================================

    const fromCurrencyName =
        selectedFromCurrency?.name ||
        fromCurrency;


    const toCurrencyName =
        selectedToCurrency?.name ||
        toCurrency;


    // ==========================================
    // FORMAT RATE DATE
    // ==========================================

    const formatRateDate = (rateDate) => {

        if (!rateDate) {
            return "Not available";
        }


        try {

            return new Date(
                rateDate + "T00:00:00"
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

        } catch (error) {

            return rateDate;
        }
    };


    // ==========================================
    // FORMAT FETCHED TIME
    // ==========================================

    const formatFetchedAt = (fetchedAt) => {

        if (!fetchedAt) {
            return "Not available";
        }


        try {

            return new Date(
                fetchedAt
            ).toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        } catch (error) {

            return fetchedAt;
        }
    };


    // ==========================================
    // FORMAT SOURCE
    // ==========================================

    const formatSource = (source) => {

        if (!source) {
            return "Not available";
        }


        if (source === "FRANKFURTER") {
            return "Frankfurter";
        }


        if (source === "SAME_CURRENCY") {
            return "Same Currency";
        }


        return source;
    };


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="converter-page">

            <div className="container">

                <div className="converter-wrapper">


                    {/* ==================================
                        MAIN CONVERTER CARD
                    ================================== */}

                    <div className="converter-card">


                        {/* ==============================
                            HEADER
                        ============================== */}

                        <div className="converter-header">

                            <div className="converter-header-icon">

                                💱

                            </div>


                            <div>

                                <span className="converter-header-label">

                                    Currency Exchange

                                </span>


                                <h1>

                                    Currency Converter

                                </h1>


                                <p>

                                    Convert currencies quickly using
                                    the latest available exchange rates.

                                </p>

                            </div>

                        </div>


                        {/* ==============================
                            CONTENT
                        ============================== */}

                        <div className="converter-content">


                            {/* ==========================
                                GUEST INFORMATION
                            ========================== */}

                            {
                                !isLoggedIn &&
                                !showGuestLimit && (

                                    <div className="converter-guest-info">

                                        <span>

                                            🎁

                                        </span>


                                        <p>

                                            <strong>

                                                Free Guest Conversion

                                            </strong>

                                            {" — "}

                                            {
                                                guestConversionsRemaining
                                            }{" "}

                                            of{" "}

                                            {
                                                GUEST_CONVERSION_LIMIT
                                            }{" "}

                                            conversions remaining.

                                        </p>

                                    </div>
                                )
                            }


                            {/* ==========================
                                GUEST LIMIT
                            ========================== */}

                            {
                                !isLoggedIn &&
                                showGuestLimit && (

                                    <div className="converter-limit-box">

                                        <div className="converter-limit-icon">

                                            🔒

                                        </div>


                                        <div className="converter-limit-content">

                                            <h3>

                                                Free Conversion Limit Reached

                                            </h3>


                                            <p>

                                                You've used your 10 free
                                                currency conversions.
                                                Sign in or create a free
                                                account to continue converting.

                                            </p>


                                            <div className="converter-limit-actions">

                                                <Link
                                                    to="/login"
                                                    className="converter-limit-login"
                                                >

                                                    Sign In

                                                </Link>


                                                <Link
                                                    to="/register"
                                                    className="converter-limit-register"
                                                >

                                                    Create Account

                                                </Link>

                                            </div>

                                        </div>

                                    </div>
                                )
                            }


                            {/* ==========================
                                AMOUNT
                            ========================== */}

                            <div className="converter-section">

                                <label className="converter-label">

                                    Amount

                                </label>


                                <div className="converter-amount-wrapper">

                                    <div className="converter-amount-icon">

                                        💰

                                    </div>


                                    <input
                                        type="number"
                                        value={amount}
                                        min="0"
                                        step="any"
                                        placeholder="Enter amount"
                                        className="converter-amount-input"

                                        onChange={(e) => {

                                            setAmount(
                                                e.target.value
                                            );

                                            resetResult();

                                            setShowGuestLimit(
                                                false
                                            );
                                        }}
                                    />


                                    <div className="converter-amount-currency">

                                        <span>

                                            💱

                                        </span>


                                        <strong>

                                            {fromCurrency}

                                        </strong>

                                    </div>

                                </div>

                            </div>


                            {/* ==========================
                                CURRENCY SELECTION
                            ========================== */}

                            <div className="converter-currency-grid">


                                {/* ======================
                                    FROM
                                ====================== */}

                                <div className="converter-currency-field">

                                    <label className="converter-label">

                                        From

                                    </label>


                                    <div className="converter-select-wrapper">

                                        <div className="converter-selected-flag">

                                            💱

                                        </div>


                                        <select

                                            value={
                                                fromCurrency
                                            }

                                            disabled={
                                                currenciesLoading ||
                                                currencies.length === 0
                                            }

                                            onChange={(e) => {

                                                setFromCurrency(
                                                    e.target.value
                                                );

                                                resetResult();
                                            }}
                                        >

                                            {
                                                currenciesLoading ? (

                                                    <option value="">

                                                        Loading currencies...

                                                    </option>

                                                ) : (

                                                    currencies.map(
                                                        (currency) => (

                                                            <option

                                                                key={
                                                                    currency.code
                                                                }

                                                                value={
                                                                    currency.code
                                                                }
                                                            >

                                                                {
                                                                    currency.code
                                                                }

                                                                {" — "}

                                                                {
                                                                    currency.name
                                                                }

                                                            </option>
                                                        )
                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {
                                        selectedFromCurrency && (

                                            <small>

                                                {
                                                    fromCurrencyName
                                                }

                                            </small>
                                        )
                                    }

                                </div>


                                {/* ======================
                                    SWAP
                                ====================== */}

                                <div className="converter-swap-area">

                                    <button

                                        type="button"

                                        className="converter-swap-button"

                                        onClick={
                                            handleSwap
                                        }

                                        disabled={
                                            currenciesLoading ||
                                            currencies.length === 0
                                        }

                                        title="Swap currencies"

                                        aria-label="Swap currencies"
                                    >

                                        ⇄

                                    </button>

                                </div>


                                {/* ======================
                                    TO
                                ====================== */}

                                <div className="converter-currency-field">

                                    <label className="converter-label">

                                        To

                                    </label>


                                    <div className="converter-select-wrapper">

                                        <div className="converter-selected-flag">

                                            💱

                                        </div>


                                        <select

                                            value={
                                                toCurrency
                                            }

                                            disabled={
                                                currenciesLoading ||
                                                currencies.length === 0
                                            }

                                            onChange={(e) => {

                                                setToCurrency(
                                                    e.target.value
                                                );

                                                resetResult();
                                            }}
                                        >

                                            {
                                                currenciesLoading ? (

                                                    <option value="">

                                                        Loading currencies...

                                                    </option>

                                                ) : (

                                                    currencies.map(
                                                        (currency) => (

                                                            <option

                                                                key={
                                                                    currency.code
                                                                }

                                                                value={
                                                                    currency.code
                                                                }
                                                            >

                                                                {
                                                                    currency.code
                                                                }

                                                                {" — "}

                                                                {
                                                                    currency.name
                                                                }

                                                            </option>
                                                        )
                                                    )
                                                )
                                            }

                                        </select>

                                    </div>


                                    {
                                        selectedToCurrency && (

                                            <small>

                                                {
                                                    toCurrencyName
                                                }

                                            </small>
                                        )
                                    }

                                </div>

                            </div>


                            {/* ==========================
                                CONVERT BUTTON
                            ========================== */}

                            <button

                                type="button"

                                className="converter-submit-button"

                                disabled={

                                    !amount ||

                                    Number(amount) <= 0 ||

                                    loading ||

                                    currenciesLoading ||

                                    currencies.length === 0
                                }

                                onClick={
                                    handleConvert
                                }
                            >

                                {
                                    loading ? (

                                        <>

                                            <span className="converter-spinner" />

                                            Converting...

                                        </>

                                    ) : (

                                        <>

                                            Convert Currency

                                            <span>

                                                →

                                            </span>

                                        </>
                                    )
                                }

                            </button>


                            {/* ==========================
                                CURRENCY LOADING ERROR
                            ========================== */}

                            {
                                currenciesError && (

                                    <div
                                        className="converter-error"
                                        role="alert"
                                    >

                                        <span>

                                            !

                                        </span>


                                        <p>

                                            {
                                                currenciesError
                                            }

                                        </p>

                                    </div>
                                )
                            }


                            {/* ==========================
                                CONVERSION ERROR
                            ========================== */}

                            {
                                error && (

                                    <div
                                        className="converter-error"
                                        role="alert"
                                    >

                                        <span>

                                            !

                                        </span>


                                        <p>

                                            {error}

                                        </p>

                                    </div>
                                )
                            }


                            {/* ==========================
                                CONVERSION RESULT
                            ========================== */}

                            <div

                                className={

                                    result

                                        ? "converter-result converter-result-active"

                                        : "converter-result"
                                }
                            >

                                <div className="converter-result-label">

                                    <span>

                                        ✓

                                    </span>

                                    Conversion Result

                                </div>


                                {
                                    result ? (

                                        <>


                                            {/* ==================
                                                RESULT VALUES
                                            ================== */}

                                            <div className="converter-result-main">


                                                {/* FROM RESULT */}

                                                <div className="converter-result-currency">

                                                    <span>

                                                        💱

                                                    </span>


                                                    <div>

                                                        <small>

                                                            {
                                                                result
                                                                    .fromCurrency
                                                            }

                                                        </small>


                                                        <strong>

                                                            {
                                                                result
                                                                    .amount
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                <div className="converter-result-arrow">

                                                    →

                                                </div>


                                                {/* TO RESULT */}

                                                <div className="converter-result-currency converter-result-currency-right">

                                                    <span>

                                                        💱

                                                    </span>


                                                    <div>

                                                        <small>

                                                            {
                                                                result
                                                                    .toCurrency
                                                            }

                                                        </small>


                                                        <strong>

                                                            {
                                                                result
                                                                    .convertedAmount
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ==================
                                                EXCHANGE RATE
                                            ================== */}

                                            <div className="converter-rate">

                                                <span>

                                                    Exchange Rate

                                                </span>


                                                <strong>

                                                    1{" "}

                                                    {
                                                        result
                                                            .fromCurrency
                                                    }

                                                    {" = "}

                                                    {
                                                        result
                                                            .exchangeRate
                                                    }{" "}

                                                    {
                                                        result
                                                            .toCurrency
                                                    }

                                                </strong>

                                            </div>


                                            {/* ==================
                                                RATE DETAILS
                                            ================== */}

                                            <div className="converter-rate-details">


                                                {/* RATE SOURCE */}

                                                <div className="converter-rate-detail">

                                                    <span className="converter-rate-detail-icon">

                                                        🏦

                                                    </span>


                                                    <div>

                                                        <small>

                                                            Rate Source

                                                        </small>


                                                        <strong>

                                                            {
                                                                formatSource(
                                                                    result.source
                                                                )
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* RATE DATE */}

                                                <div className="converter-rate-detail">

                                                    <span className="converter-rate-detail-icon">

                                                        📅

                                                    </span>


                                                    <div>

                                                        <small>

                                                            Rate Date

                                                        </small>


                                                        <strong>

                                                            {
                                                                formatRateDate(
                                                                    result.rateDate
                                                                )
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>


                                                {/* FETCHED AT */}

                                                <div className="converter-rate-detail">

                                                    <span className="converter-rate-detail-icon">

                                                        🕒

                                                    </span>


                                                    <div>

                                                        <small>

                                                            Fetched At

                                                        </small>


                                                        <strong>

                                                            {
                                                                formatFetchedAt(
                                                                    result.fetchedAt
                                                                )
                                                            }

                                                        </strong>

                                                    </div>

                                                </div>

                                            </div>


                                            {/* ==================
                                                RATE STATUS
                                            ================== */}

                                            <div className="converter-rate-status">

                                                <span>

                                                    ✓

                                                </span>


                                                <p>

                                                    Latest available reference
                                                    rate fetched from the
                                                    exchange-rate provider.

                                                </p>

                                            </div>

                                        </>

                                    ) : (

                                        <div className="converter-result-empty">

                                            <div>

                                                💱

                                            </div>


                                            <strong>

                                                Ready to convert

                                            </strong>


                                            <span>

                                                Enter an amount and choose
                                                your currencies above.

                                            </span>

                                        </div>
                                    )
                                }

                            </div>


                            {/* ==========================
                                FOOTER NOTE
                            ========================== */}

                            <div className="converter-footer-note">

                                <span>

                                    ⚡

                                </span>


                                <p>

                                    Exchange rates are fetched from
                                    the latest available rate data.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default Converter;
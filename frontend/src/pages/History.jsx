import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import API from "../api/api";

import "../css/History.css";


function History() {

    // ==========================================
    // NAVIGATION
    // ==========================================

    const navigate = useNavigate();


    // ==========================================
    // HISTORY DATA
    // ==========================================

    const [history, setHistory] =
        useState([]);


    // ==========================================
    // LOADING / ERROR
    // ==========================================

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // PAGINATION
    // ==========================================

    const PAGE_SIZE = 10;

    const [currentPage, setCurrentPage] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [totalElements, setTotalElements] =
        useState(0);

    const [firstPage, setFirstPage] =
        useState(true);

    const [lastPage, setLastPage] =
        useState(true);


    // ==========================================
    // LOAD CONVERSION HISTORY
    // ==========================================

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                setLoading(true);

                setError("");


                // ==================================
                // SERVER-SIDE PAGINATION
                //
                // Example:
                //
                // /conversions/history?page=0&size=10
                // ==================================

                const response =
                    await API.get(
                        "/conversions/history",
                        {
                            params: {
                                page: currentPage,
                                size: PAGE_SIZE
                            }
                        }
                    );


                const data =
                    response.data;


                // ==================================
                // VALIDATE RESPONSE
                // ==================================

                if (
                    !data ||
                    !Array.isArray(data.content)
                ) {

                    throw new Error(
                        "Invalid history response"
                    );
                }


                // ==================================
                // SET PAGE DATA
                // ==================================

                setHistory(
                    data.content
                );


                setTotalElements(
                    data.totalElements ?? 0
                );


                setTotalPages(
                    data.totalPages ?? 0
                );


                setFirstPage(
                    data.first ?? true
                );


                setLastPage(
                    data.last ?? true
                );


            } catch (error) {

                console.error(
                    "History Error:",
                    error
                );


                // ==================================
                // EXPIRED / INVALID JWT
                // ==================================

                if (
                    error.response?.status === 401
                ) {

                    setError(
                        "Your session has expired. Please sign in again."
                    );


                    // Remove invalid/expired token.
                    localStorage.removeItem(
                        "token"
                    );


                } else {

                    setError(
                        error.response?.data?.message ||
                        "Unable to load conversion history."
                    );
                }


                setHistory([]);

                setTotalElements(0);

                setTotalPages(0);


            } finally {

                setLoading(false);
            }
        };


        fetchHistory();

    }, [currentPage]);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (dateValue) => {

        if (!dateValue) {

            return {
                date: "-",
                time: ""
            };
        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return {
                date: "-",
                time: ""
            };
        }


        const formattedDate =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        const formattedTime =
            date.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );


        return {
            date: formattedDate,
            time: formattedTime
        };
    };


    // ==========================================
    // FORMAT MONEY / AMOUNT
    // ==========================================

    const formatAmount = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";
        }


        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return value;
        }


        return number.toLocaleString(
            "en-IN",
            {
                maximumFractionDigits: 2
            }
        );
    };


    // ==========================================
    // FORMAT EXCHANGE RATE
    //
    // Keep more precision than converted amount.
    // ==========================================

    const formatRate = (value) => {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "-";
        }


        const number =
            Number(value);


        if (
            Number.isNaN(number)
        ) {

            return value;
        }


        return number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 6
            }
        );
    };


    // ==========================================
    // PAGE CHANGE
    // ==========================================

    const changePage = (pageNumber) => {

        if (
            pageNumber < 0 ||
            pageNumber >= totalPages ||
            pageNumber === currentPage
        ) {

            return;
        }


        setCurrentPage(
            pageNumber
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    // ==========================================
    // PREVIOUS PAGE
    // ==========================================

    const handlePrevious = () => {

        if (!firstPage) {

            changePage(
                currentPage - 1
            );
        }
    };


    // ==========================================
    // NEXT PAGE
    // ==========================================

    const handleNext = () => {

        if (!lastPage) {

            changePage(
                currentPage + 1
            );
        }
    };


    // ==========================================
    // GENERATE PAGE NUMBERS
    //
    // Example:
    //
    // 1 2 3 4 5
    //
    // For many pages, only nearby pages
    // are displayed.
    // ==========================================

    const getVisiblePages = () => {

        if (totalPages <= 0) {

            return [];
        }


        const visiblePages = [];

        const maxVisiblePages = 5;


        let startPage =
            Math.max(
                0,
                currentPage - 2
            );


        let endPage =
            Math.min(
                totalPages - 1,
                startPage +
                    maxVisiblePages -
                    1
            );


        if (
            endPage -
                startPage +
                1 <
            maxVisiblePages
        ) {

            startPage =
                Math.max(
                    0,
                    endPage -
                        maxVisiblePages +
                        1
                );
        }


        for (
            let page = startPage;
            page <= endPage;
            page++
        ) {

            visiblePages.push(
                page
            );
        }


        return visiblePages;
    };


    const visiblePages =
        getVisiblePages();


    // ==========================================
    // FIRST RECORD NUMBER ON CURRENT PAGE
    // ==========================================

    const firstRecordNumber =
        currentPage * PAGE_SIZE + 1;


    // ==========================================
    // LAST RECORD NUMBER ON CURRENT PAGE
    // ==========================================

    const lastRecordNumber =
        Math.min(
            currentPage * PAGE_SIZE +
                history.length,
            totalElements
        );


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="history-page">

            <div className="container">

                <div className="history-wrapper">

                    <div className="history-card">


                        {/* ==================================
                            HEADER
                        ================================== */}

                        <div className="history-topbar">

                            <div className="history-heading">

                                <span className="history-label">

                                    Activity

                                </span>


                                <h1>

                                    Conversion History

                                </h1>


                                <p>

                                    Review your previous
                                    currency conversions.

                                </p>

                            </div>


                            {
                                !loading &&
                                !error && (

                                    <div className="history-topbar-actions">


                                        {/* TOTAL */}

                                        <div className="history-total">

                                            <span>

                                                Total

                                            </span>


                                            <strong>

                                                {totalElements}

                                            </strong>

                                        </div>


                                        {/* NEW CONVERSION */}

                                        <Link
                                            to="/converter"
                                            className="history-convert-button"
                                        >

                                            <span>

                                                +

                                            </span>

                                            New Conversion

                                        </Link>

                                    </div>
                                )
                            }

                        </div>


                        {/* ==================================
                            LOADING
                        ================================== */}

                        {
                            loading && (

                                <div className="history-loading">

                                    <div
                                        className="spinner-border text-primary"
                                        role="status"
                                    >

                                        <span className="visually-hidden">

                                            Loading...

                                        </span>

                                    </div>


                                    <p>

                                        Loading your conversion history...

                                    </p>

                                </div>
                            )
                        }


                        {/* ==================================
                            ERROR
                        ================================== */}

                        {
                            !loading &&
                            error && (

                                <div className="history-error">

                                    <div className="history-error-icon">

                                        !

                                    </div>


                                    <div>

                                        <strong>

                                            Unable to load history

                                        </strong>


                                        <span>

                                            {error}

                                        </span>


                                        {
                                            error.includes(
                                                "session"
                                            ) && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        navigate(
                                                            "/login"
                                                        )
                                                    }
                                                >

                                                    Sign In Again

                                                </button>
                                            )
                                        }

                                    </div>

                                </div>
                            )
                        }


                        {/* ==================================
                            EMPTY HISTORY
                        ================================== */}

                        {
                            !loading &&
                            !error &&
                            totalElements === 0 && (

                                <div className="history-empty">

                                    <div className="history-empty-icon">

                                        💱

                                    </div>


                                    <h3>

                                        No conversions yet

                                    </h3>


                                    <p>

                                        Your previous currency
                                        conversions will appear here.

                                    </p>


                                    <Link to="/converter">

                                        Make Your First Conversion

                                    </Link>

                                </div>
                            )
                        }


                        {/* ==================================
                            HISTORY TABLE
                        ================================== */}

                        {
                            !loading &&
                            !error &&
                            history.length > 0 && (

                                <>


                                    <div className="history-table-wrapper">

                                        <table className="history-modern-table">

                                            <thead>

                                                <tr>

                                                    <th>

                                                        #

                                                    </th>


                                                    <th>

                                                        Currency

                                                    </th>


                                                    <th>

                                                        Amount

                                                    </th>


                                                    <th>

                                                        Converted

                                                    </th>


                                                    <th>

                                                        Rate

                                                    </th>


                                                    <th>

                                                        Date

                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {
                                                    history.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {

                                                            const formattedDate =
                                                                formatDate(
                                                                    item.createdAt
                                                                );


                                                            const recordNumber =
                                                                currentPage *
                                                                    PAGE_SIZE +
                                                                index +
                                                                1;


                                                            return (

                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >


                                                                    {/* ==================
                                                                        RECORD NUMBER
                                                                    ================== */}

                                                                    <td>

                                                                        <span className="history-index">

                                                                            {
                                                                                recordNumber
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* ==================
                                                                        CURRENCY PAIR
                                                                    ================== */}

                                                                    <td>

                                                                        <div className="history-pair">


                                                                            {/* FROM */}

                                                                            <div className="history-pair-currency">

                                                                                <span className="history-currency-icon">

                                                                                    💱

                                                                                </span>


                                                                                <strong>

                                                                                    {
                                                                                        item.fromCurrency
                                                                                    }

                                                                                </strong>

                                                                            </div>


                                                                            {/* ARROW */}

                                                                            <span className="history-pair-arrow">

                                                                                →

                                                                            </span>


                                                                            {/* TO */}

                                                                            <div className="history-pair-currency">

                                                                                <strong>

                                                                                    {
                                                                                        item.toCurrency
                                                                                    }

                                                                                </strong>

                                                                            </div>

                                                                        </div>

                                                                    </td>


                                                                    {/* ==================
                                                                        ORIGINAL AMOUNT
                                                                    ================== */}

                                                                    <td>

                                                                        <div className="history-value">

                                                                            <strong>

                                                                                {
                                                                                    formatAmount(
                                                                                        item.amount
                                                                                    )
                                                                                }

                                                                            </strong>


                                                                            <span>

                                                                                {
                                                                                    item.fromCurrency
                                                                                }

                                                                            </span>

                                                                        </div>

                                                                    </td>


                                                                    {/* ==================
                                                                        CONVERTED AMOUNT
                                                                    ================== */}

                                                                    <td>

                                                                        <div className="history-value history-converted">

                                                                            <strong>

                                                                                {
                                                                                    formatAmount(
                                                                                        item.convertedAmount
                                                                                    )
                                                                                }

                                                                            </strong>


                                                                            <span>

                                                                                {
                                                                                    item.toCurrency
                                                                                }

                                                                            </span>

                                                                        </div>

                                                                    </td>


                                                                    {/* ==================
                                                                        RATE
                                                                    ================== */}

                                                                    <td>

                                                                        <span className="history-rate">

                                                                            {
                                                                                formatRate(
                                                                                    item.rateUsed
                                                                                )
                                                                            }

                                                                        </span>

                                                                    </td>


                                                                    {/* ==================
                                                                        DATE / TIME
                                                                    ================== */}

                                                                    <td>

                                                                        <div className="history-date">

                                                                            <strong>

                                                                                {
                                                                                    formattedDate.date
                                                                                }

                                                                            </strong>


                                                                            <span>

                                                                                {
                                                                                    formattedDate.time
                                                                                }

                                                                            </span>

                                                                        </div>

                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                }

                                            </tbody>

                                        </table>

                                    </div>


                                    {/* ==================================
                                        PAGINATION FOOTER
                                    ================================== */}

                                    <div className="history-pagination-wrapper">


                                        {/* RESULT INFORMATION */}

                                        <div className="history-pagination-info">

                                            Showing{" "}

                                            <strong>

                                                {firstRecordNumber}

                                            </strong>

                                            {" – "}

                                            <strong>

                                                {lastRecordNumber}

                                            </strong>

                                            {" of "}

                                            <strong>

                                                {totalElements}

                                            </strong>

                                            {" conversions"}

                                        </div>


                                        {/* PAGE CONTROLS */}

                                        {
                                            totalPages > 1 && (

                                                <div className="history-pagination">


                                                    {/* PREVIOUS */}

                                                    <button
                                                        type="button"
                                                        className="history-page-nav"
                                                        onClick={
                                                            handlePrevious
                                                        }
                                                        disabled={
                                                            firstPage
                                                        }
                                                        aria-label="Previous page"
                                                    >

                                                        ←

                                                        <span>

                                                            Previous

                                                        </span>

                                                    </button>


                                                    {/* PAGE NUMBERS */}

                                                    <div className="history-page-numbers">

                                                        {
                                                            visiblePages.map(
                                                                (
                                                                    page
                                                                ) => (

                                                                    <button
                                                                        type="button"
                                                                        key={
                                                                            page
                                                                        }
                                                                        className={
                                                                            page ===
                                                                            currentPage
                                                                                ? "history-page-number active"
                                                                                : "history-page-number"
                                                                        }
                                                                        onClick={() =>
                                                                            changePage(
                                                                                page
                                                                            )
                                                                        }
                                                                        aria-label={
                                                                            `Go to page ${
                                                                                page +
                                                                                1
                                                                            }`
                                                                        }
                                                                        aria-current={
                                                                            page ===
                                                                            currentPage
                                                                                ? "page"
                                                                                : undefined
                                                                        }
                                                                    >

                                                                        {
                                                                            page +
                                                                            1
                                                                        }

                                                                    </button>
                                                                )
                                                            )
                                                        }

                                                    </div>


                                                    {/* NEXT */}

                                                    <button
                                                        type="button"
                                                        className="history-page-nav"
                                                        onClick={
                                                            handleNext
                                                        }
                                                        disabled={
                                                            lastPage
                                                        }
                                                        aria-label="Next page"
                                                    >

                                                        <span>

                                                            Next

                                                        </span>

                                                        →

                                                    </button>

                                                </div>
                                            )
                                        }

                                    </div>

                                </>
                            )
                        }

                    </div>

                </div>

            </div>

        </div>
    );
}


export default History;
import React, { useContext, useEffect, useState, forwardRef } from 'react'
import Button from './Button'

const PrevIcon = function PrevIcon(props) {
    return (
        <svg {...props} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
            ></path>
        </svg>
    )
}

const NextIcon = function NextIcon(props) {
    return (
        <svg {...props} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
            <path
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
                fillRule="evenodd"
            ></path>
        </svg>
    )
}

export const NavigationButton = function NavigationButton({
    onClick,
    disabled,
    directionIcon,
}) {
    const ariaLabel = directionIcon === 'prev' ? 'Previous' : 'Next'

    const icon = directionIcon === 'prev' ? PrevIcon : NextIcon

    return (
        <Button
            size="small"
            layout="link"
            icon={icon}
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
        />
    )
}



export const PageButton = function PageButton({
    page,
    isActive,
    onClick,
}) {
    return (
        <Button size="pagination" layout={isActive ? 'primary' : 'link'} onClick={onClick}>
            {page}
        </Button>
    )
}

export const EmptyPageButton = () => <span className="px-2 py-1">...</span>

const style = {
    base: 'flex flex-col justify-between text-xs sm:flex-row text-gray-600 dark:text-gray-400',
}

const Pagination = forwardRef((props, ref) => {
    const { totalResults, resultsPerPage = 10, label, onChange, ...other } = props
    const [pages, setPages] = useState([])
    const [activePage, setActivePage] = useState(1)

    const TOTAL_PAGES = Math.ceil(totalResults / resultsPerPage)
    const FIRST_PAGE = 1
    const LAST_PAGE = TOTAL_PAGES
    const MAX_VISIBLE_PAGES = 7

    function handlePreviousClick() {
        setActivePage(activePage - 1)
    }

    function handleNextClick() {
        setActivePage(activePage + 1)
    }

    useEffect(() => {
        // [1], 2, 3, 4, 5, ..., 12 case #1
        // 1, [2], 3, 4, 5, ..., 12
        // 1, 2, [3], 4, 5, ..., 12
        // 1, 2, 3, [4], 5, ..., 12
        // 1, ..., 4, [5], 6, ..., 12 case #2
        // 1, ..., 5, [6], 7, ..., 12
        // 1, ..., 6, [7], 8, ..., 12
        // 1, ..., 7, [8], 9, ..., 12
        // 1, ..., 8, [9], 10, 11, 12 case #3
        // 1, ..., 8, 9, [10], 11, 12
        // 1, ..., 8, 9, 10, [11], 12
        // 1, ..., 8, 9, 10, 11, [12]
        // [1], 2, 3, 4, 5, ..., 8
        // always show first and last
        // max of 7 pages shown (incl. [...])
        if (TOTAL_PAGES <= MAX_VISIBLE_PAGES) {
            setPages(Array.from({ length: TOTAL_PAGES }).map((_, i) => i + 1))
        } else if (activePage < 5) {
            // #1 active page < 5 -> show first 5
            setPages([1, 2, 3, 4, 5, '...', TOTAL_PAGES])
        } else if (activePage >= 5 && activePage < TOTAL_PAGES - 3) {
            // #2 active page >= 5 && < TOTAL_PAGES - 3
            setPages([1, '...', activePage - 1, activePage, activePage + 1, '...', TOTAL_PAGES])
        } else {
            // #3 active page >= TOTAL_PAGES - 3 -> show last
            setPages([
                1,
                '...',
                TOTAL_PAGES - 4,
                TOTAL_PAGES - 3,
                TOTAL_PAGES - 2,
                TOTAL_PAGES - 1,
                TOTAL_PAGES,
            ])
        }
    }, [activePage, TOTAL_PAGES])

    useEffect(() => {
        onChange(activePage)
    }, [activePage])

    return (
        <div className={style.base} ref={ref} {...other}>
            {/*
         * This (label) should probably be an option, and not the default
         */}
            <span className="flex items-center font-semibold tracking-wide uppercase">
                Showing {activePage * resultsPerPage - resultsPerPage + 1}-
                {Math.min(activePage * resultsPerPage, totalResults)} of {totalResults}
            </span>

            <div className="flex mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label={label}>
                    <ul className="inline-flex items-center">
                        <li>
                            <NavigationButton
                                directionIcon="prev"
                                disabled={activePage === FIRST_PAGE}
                                onClick={handlePreviousClick}
                            />
                        </li>
                        {pages.map((p, i) => (
                            <li key={p.toString() + i}>
                                {p === '...' ? (
                                    <EmptyPageButton />
                                ) : (
                                    <PageButton
                                        page={p}
                                        isActive={p === activePage}
                                        onClick={() => setActivePage(+p)}
                                    />
                                )}
                            </li>
                        ))}
                        <li>
                            <NavigationButton
                                directionIcon="next"
                                disabled={activePage === LAST_PAGE}
                                onClick={handleNextClick}
                            />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
})

export default Pagination

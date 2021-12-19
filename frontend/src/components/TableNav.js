import React from 'react';
import Button from "./Button";

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
const NavigationButton = function NavigationButton({onClick, disabled, directionIcon}) {
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

const TableNav = (props) => {
    return (
        <div>
            <div className="flex mt-2 sm:mt-auto sm:justify-end">
                <nav aria-label="Table Navigation">
                    <ul className="inline-flex items-center">
                        <li>
                            <NavigationButton
                                directionIcon="prev"
                                disabled={props.isFirstPage}
                                onClick={props.onPrevious}
                            />
                        </li>
                        <li>
                            <NavigationButton
                                directionIcon="next"
                                disabled={props.isLastPage}
                                onClick={props.onNext}
                            />
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default TableNav;
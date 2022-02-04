import classNames from 'classnames'
import React, { forwardRef } from 'react'

const button = {
    base:
      'align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none',
    block: 'w-full',
    size: {
      larger: 'px-10 py-4 rounded-lg',
      large: 'px-5 py-3 rounded-lg',
      regular: 'px-4 py-2 rounded-md text-sm',
      small: 'px-3 py-1 rounded-md text-sm',
      icon: {
        larger: 'p-4 rounded-lg',
        large: 'p-3 rounded-lg',
        regular: 'p-2 rounded-lg',
        small: 'p-2 rounded-md',
      },
      pagination: 'px-3 py-1 rounded-md text-xs',
    },
    // styles applied to the SVG icon
    icon: {
      larger: 'h-5 w-5',
      large: 'h-5 w-5',
      regular: 'h-5 w-5',
      small: 'h-3 w-3',
      left: 'mr-2 -ml-1',
      right: 'ml-2 -mr-1',
    },
    primary: {
      base: 'text-white bg-indigo-600 border border-transparent',
      active: 'hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    submit: {
      base: 'text-white bg-green-600 border border-transparent',
      active: 'hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    neutral: {
      base: 'text-white bg-gray-600 border border-transparent',
      active: 'hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    danger: {
      base: 'text-white bg-red-600 border border-transparent',
      active: 'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    outline: {
      base: 'text-gray-600 border-gray-300 border dark:text-gray-400 focus:outline-none',
      active:
        'active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:ring focus:ring-gray-300',
      disabled: 'opacity-50 cursor-not-allowed bg-gray-300',
    },
    link: {
      base: 'text-gray-600 dark:text-gray-400 focus:outline-none border border-transparent',
      active:
        'active:bg-transparent hover:bg-gray-100 focus:ring focus:ring-gray-300 dark:hover:bg-gray-500 dark:hover:text-gray-300 dark:hover:bg-opacity-10',
      disabled: 'opacity-50 cursor-not-allowed',
    },
    // this is the button that lives inside the DropdownItem
    dropdownItem: {
      base:
        'inline-flex items-center cursor-pointer w-full px-2 py-1 text-sm font-medium transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-200',
    },
  }


const Button = forwardRef((props, ref) => {
  const {
    tag = 'button',
    // Fix https://github.com/estevanmaito/windmill-react-ui/issues/7
    type = tag === 'button' ? 'button' : undefined,
    disabled = false,
    size = 'regular',
    layout = 'primary',
    block = false,
    icon,
    iconLeft,
    iconRight,
    className,
    children,
    ...other
  } = props


  function hasIcon() {
    return !!icon || !!iconLeft || !!iconRight
  }

  const IconLeft = iconLeft || icon
  const IconRight = iconRight

  const baseStyle = button.base
  const blockStyle = button.block
  const sizeStyles = {
    larger: button.size.larger,
    large: button.size.large,
    regular: button.size.regular,
    small: button.size.small,
    /**
     * Only used in Pagination.
     * Not meant for general use.
     */
    pagination: button.size.pagination,
  }
  const iconSizeStyles = {
    larger: button.size.icon.larger,
    large: button.size.icon.large,
    regular: button.size.icon.regular,
    small: button.size.icon.small,
    pagination: button.size.icon.regular,
  }
  const iconStyle = button.icon[size]
  const layoutStyles = {
    primary: button.primary.base,
    submit: button.submit.base,
    neutral: button.neutral.base,
    danger: button.danger.base,
    outline: button.outline.base,
    link: button.link.base,
  }
  const activeStyles = {
    primary: button.primary.active,
    submit: button.submit.active,
    neutral: button.neutral.active,
    outline: button.outline.active,
    danger: button.danger.active,
    link: button.link.active,
  }
  const disabledStyles = {
    primary: button.primary.disabled,
    submit: button.submit.disabled,
    neutral: button.neutral.disabled,
    outline: button.outline.disabled,
    danger: button.danger.disabled,
    link: button.link.disabled,
  }

  /**
   * Only used in DropdownItem.
   * Not meant for general use.
   */
  const dropdownItemStyle = button.dropdownItem.base

  const buttonStyles =
    layout === '__dropdownItem'
      ? classNames(dropdownItemStyle, className)
      : classNames(
          baseStyle,
          // has icon but no children
          hasIcon() && !children && iconSizeStyles[size],
          // has icon and children
          hasIcon() && children && sizeStyles[size],
          // does not have icon
          !hasIcon() && sizeStyles[size],
          layoutStyles[layout],
          disabled ? disabledStyles[layout] : activeStyles[layout],
          block ? blockStyle : null,
          className
        )

  const iconLeftStyles = classNames(iconStyle, children ? button.icon.left : '')
  const iconRightStyles = classNames(iconStyle, children ? button.icon.right : '')

  return React.createElement(
    tag,
    {
      className: buttonStyles,
      ref,
      disabled,
      type,
      ...other,
    },
    IconLeft
      ? React.createElement(IconLeft, { className: iconLeftStyles, 'aria-hidden': true })
      : null,
    children,
    IconRight
      ? React.createElement(IconRight, { className: iconRightStyles, 'aria-hidden': true })
      : null
  )
})

export default Button

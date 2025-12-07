import PropTypes from 'prop-types'
import { twMerge } from 'tailwind-merge'

export function Button({ className, variant = 'primary', size = 'default', ...props }) {

    const baseStyles = "flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
        ghost: 'hover:bg-gray-100 text-gray-700'
    }

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
    }

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        />
    )
}


Button.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['default', 'sm', 'lg', 'icon']),
    children: PropTypes.node,
    onClick: PropTypes.func
}


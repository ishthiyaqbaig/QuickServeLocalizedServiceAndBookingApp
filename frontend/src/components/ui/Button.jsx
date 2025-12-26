import PropTypes from 'prop-types'
import { twMerge } from 'tailwind-merge'

export function Button({ className, variant = 'primary', size = 'default', ...props }) {

    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95"

    const variants = {
        primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200 focus:ring-indigo-500',
        secondary: 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200 shadow-sm focus:ring-gray-300',
        outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
        ghost: 'hover:bg-indigo-50 text-indigo-600'
    }

    const sizes = {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 rounded-lg px-4 text-sm',
        lg: 'h-14 rounded-2xl px-10 text-lg',
        icon: 'h-11 w-11'
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


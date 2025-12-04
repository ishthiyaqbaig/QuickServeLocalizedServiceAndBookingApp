import { twMerge } from 'tailwind-merge'
import PropTypes from 'prop-types'

export function Button({ className, variant = 'primary', ...props }) {
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border-2 border-gray-300 hover:bg-gray-50 focus:ring-gray-500'
    }
    return (
        <button
            className={twMerge(baseStyles, variants[variant], className)}
            {...props}
        />
    )
}

Button.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline'])
}


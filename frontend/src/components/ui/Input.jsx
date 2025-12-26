import PropTypes from 'prop-types'
import { twMerge } from 'tailwind-merge'

export function Input({ className, label, error, ...props }) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && <label className="text-sm font-semibold text-gray-700 ml-1">{label}</label>}
            <input
                className={twMerge(
                    'px-4 py-3 bg-white/50 backdrop-blur-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-transparent transition-all duration-300 placeholder:text-gray-400',
                    error ? 'border-red-500 focus:ring-red-500' : 'border-white/40 shadow-sm',
                    className
                )}
                {...props}
            />
            {error && <span className="text-xs font-medium text-red-500 ml-1">{error}</span>}
        </div>
    )
}

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string
}

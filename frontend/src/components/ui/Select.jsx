import React from 'react'
import PropTypes from 'prop-types'
import { twMerge } from 'tailwind-merge'

export function Select({ className, label, error, options = [], ...props }) {
    return (
        <div className="flex flex-col gap-1">
            {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">
                <select
                    className={twMerge(
                        'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white',
                        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )
}

Select.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
}

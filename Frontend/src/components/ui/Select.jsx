import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';
import { ChevronDown } from 'lucide-react';

export const Select = ({ label, options, error, className = '', ...props }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                <select
                    className={twMerge(
                        'w-full glass px-5 py-4 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border-white/60 transition-all font-medium text-gray-700 cursor-pointer',
                        error ? 'border-rose-500 ring-2 ring-rose-500/10' : 'hover:border-indigo-400/50',
                        className
                    )}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-indigo-500 transition-colors">
                    <ChevronDown size={18} strokeWidth={3} />
                </div>
            </div>
            {error && <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter px-1 mt-1">{error}</span>}
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
    })).isRequired,
}

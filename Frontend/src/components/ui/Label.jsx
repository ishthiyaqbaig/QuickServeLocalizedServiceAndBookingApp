import PropTypes from 'prop-types';

export const Label = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`text-xs font-black text-gray-400 uppercase tracking-widest px-1 ${className}`}
            {...props}
        >
            {children}
        </label>
    );
};
Label.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};


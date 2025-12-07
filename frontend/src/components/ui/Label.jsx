import PropTypes from 'prop-types';

export const Label = ({ children, className = '', ...props }) => {
    return (
        <label
            className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
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


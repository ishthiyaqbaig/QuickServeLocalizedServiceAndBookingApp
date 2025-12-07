import PropTypes from 'prop-types';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    );
};
export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex items-center p-6 pt-0 ${className}`} {...props}>
            {children}
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

CardHeader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

CardTitle.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

CardContent.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

CardFooter.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};


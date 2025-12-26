import PropTypes from 'prop-types';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div className={`rounded-2xl border border-white/40 bg-white/70 backdrop-blur-md text-gray-950 shadow-xl shadow-indigo-100/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-200/50 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex flex-col space-y-1.5 p-8 pb-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ children, className = '', ...props }) => {
    return (
        <h3 className={`text-2xl font-bold leading-tight tracking-tight text-gray-900 ${className}`} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-8 pt-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex items-center p-8 pt-0 ${className}`} {...props}>
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


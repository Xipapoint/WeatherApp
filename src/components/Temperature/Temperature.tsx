import React, { memo } from "react";

type Props = React.HTMLAttributes<HTMLParagraphElement> 

const Temperature: React.FC<Props> = ({ children, className, ...props }) => {
  return (<p className={className} {...props}>{children}</p>);
};

export default memo(Temperature);

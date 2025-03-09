import React, { useRef, useEffect } from "react";
import { useNavigation } from "./context/NavigationContext";

// This component ensures sections are properly registered with the navigation context
const Section = ({ id, className, children, ...props }) => {
  const sectionRef = useRef(null);
  const { registerSection } = useNavigation();

  useEffect(() => {
    if (sectionRef.current && id) {
      registerSection(id, sectionRef.current);
    }
  }, [id, registerSection]);

  return (
    <div id={id} ref={sectionRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default Section;

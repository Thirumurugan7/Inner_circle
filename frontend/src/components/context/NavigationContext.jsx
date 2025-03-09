// Updated scrollToSection function
const scrollToSection = (sectionId) => {
  console.log(`Attempting to scroll to section: ${sectionId}`);

  // Clear any previous scroll timeouts
  if (scrollTimeoutRef.current) {
    clearTimeout(scrollTimeoutRef.current);
  }

  // Set scrolling state
  setIsScrolling(true);

  // First try using the registered refs (preferred method)
  const sectionRef = sectionRefs.current[sectionId];
  let element = sectionRef || document.getElementById(sectionId);

  if (element) {
    console.log(`Found section with ID: ${sectionId}`);

    // Calculate position with header offset
    const yOffset = -80;
    const y =
      element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    console.log(`Scrolling to position Y: ${y}`);

    // Perform the scroll
    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    // Update active section
    setActiveSection(sectionId);

    // Reset scrolling state after animation completes
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Typical scroll animation takes ~1000ms
  } else {
    console.error(`Section with ID "${sectionId}" not found in the DOM`);
    setIsScrolling(false);

    // Extra attempt - check all IDs in the document for debugging
    const allIds = Array.from(document.querySelectorAll("[id]")).map(
      (el) => el.id
    );
    console.log("Available section IDs:", allIds);
  }
};

import React from 'react';

// Industry standard framer-motion mock for testing
// This mock strips animation props and renders as regular HTML elements

// Helper to create motion components that strip animation props
const createMotionComponent = (element: string) => {
  // Create a component using forwardRef
  const MotionComponent = React.forwardRef<any, any>((props, ref) => {
    // Extract and remove all animation-related props
    const {
      children,
      initial,
      animate,
      exit,
      transition,
      variants,
      whileHover,
      whileTap,
      whileFocus,
      whileTapInView,
      whileDrag,
      whileInView,
      layout,
      layoutId,
      layoutDependency,
      layoutRoot,
      drag,
      dragConstraints,
      dragElastic,
      dragMomentum,
      dragPropagation,
      dragDirectionLock,
      dragTransition,
      onDrag,
      onDragStart,
      onDragEnd,
      ...restProps
    } = props;

    // Render as regular HTML element without animation props
    // Use React.createElement to ensure proper rendering
    // This is the industry standard approach
    return React.createElement(element, { ...restProps, ref }, children);
  });

  MotionComponent.displayName = `Motion${element.charAt(0).toUpperCase() + element.slice(1)}`;
  return MotionComponent;
};

export const motion = {
  div: createMotionComponent('div'),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  // AnimatePresence should pass through children to maintain lifecycle
  // Use Fragment to wrap children
  if (Array.isArray(children)) {
    return React.createElement(React.Fragment, {}, ...children);
  }
  return React.createElement(React.Fragment, {}, children);
};

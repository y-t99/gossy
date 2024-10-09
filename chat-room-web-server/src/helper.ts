import type { LexicalEditor, NodeKey } from "lexical";
import { createElement, Suspense, useEffect, useMemo, useState } from "react";
import useLayoutEffect from "./useLayoutEffect";
import { createPortal, flushSync } from "react-dom";

export function invariant(cond?: boolean, message?: string): asserts cond {
  if (cond) {
    return;
  }
  throw new Error(`Invariant: ${message}`);
}

export const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

export function mergeRefs<T>(
  ...refs: Array<
    React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null
  >
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}


type ErrorBoundaryProps = {
  children: JSX.Element;
  onError: (error: Error) => void;
};

export type ErrorBoundaryType =
  | React.ComponentClass<ErrorBoundaryProps>
  | React.FC<ErrorBoundaryProps>;

  export function useDecorators(
    editor: LexicalEditor,
    ErrorBoundary: ErrorBoundaryType,
  ): Array<JSX.Element> {
    const [decorators, setDecorators] = useState<Record<NodeKey, JSX.Element>>(
      () => editor.getDecorators<JSX.Element>(),
    );
  
    // Subscribe to changes
    useLayoutEffect(() => {
      return editor.registerDecoratorListener<JSX.Element>((nextDecorators) => {
        flushSync(() => {
          setDecorators(nextDecorators);
        });
      });
    }, [editor]);
  
    useEffect(() => {
      // If the content editable mounts before the subscription is added, then
      // nothing will be rendered on initial pass. We can get around that by
      // ensuring that we set the value.
      setDecorators(editor.getDecorators());
    }, [editor]);
  
    // Return decorators defined as React Portals
    return useMemo(() => {
      const decoratedPortals = [];
      const decoratorKeys = Object.keys(decorators);
  
      for (let i = 0; i < decoratorKeys.length; i++) {
        const nodeKey = decoratorKeys[i];
        const reactDecorator = createElement(ErrorBoundary, { onError: (e) => editor._onError(e), children: createElement(Suspense, { fallback: null }, decorators[nodeKey]) });
        const element = editor.getElementByKey(nodeKey);
  
        if (element !== null) {
          decoratedPortals.push(createPortal(reactDecorator, element, nodeKey));
        }
      }
  
      return decoratedPortals;
    }, [ErrorBoundary, decorators, editor]);
  }
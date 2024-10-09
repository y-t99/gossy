import {useEffect, useLayoutEffect} from 'react';

const CAN_USE_DOM: boolean =
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

// This workaround is no longer necessary in React 19,
// but we currently support React >=17.x
// https://github.com/facebook/react/pull/26395
const useLayoutEffectImpl: typeof useLayoutEffect = CAN_USE_DOM
  ? useLayoutEffect
  : useEffect;

export default useLayoutEffectImpl;
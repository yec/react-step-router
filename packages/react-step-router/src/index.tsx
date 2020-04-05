/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { property, isEqual } from 'lodash';

const __DEV__ = true;

///////////////////////////////////////////////////////////////////////////////
// CONTEXT
///////////////////////////////////////////////////////////////////////////////

const LocationContext = React.createContext<any>(null);

if (__DEV__) {
  LocationContext.displayName = 'Location';
}

const StepContext = React.createContext<any>({
  outlet: null,
  indexes: null,
  step: null,
});

if (__DEV__) {
  StepContext.displayName = 'Step';
}

///////////////////////////////////////////////////////////////////////////////
// COMPONENTS
///////////////////////////////////////////////////////////////////////////////

/**
 * StepRouter
 */
export const StepRouter = ({
  activeStep = [],
  completedSteps = [],
  highestStep = [],
  children,
  shouldShowStep = showActiveStep,
}: any) => {
  // e.g. [0] is the first step.
  // [1] is the second step
  // [1,0] etc
  // const [activeStep, setActiveStep] = useState([0]);
  const [steps, setSteps] = useState([]);
  const [leafSteps, setLeafSteps] = useState([]);
  const historyRef = React.useRef<MemoryHistory>();

  if (historyRef.current == null) {
    historyRef.current = createMemoryHistory();
  }

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.push(`/${activeStep.join('/')}`);
    }
  }, [activeStep]);

  const nleaf = React.useMemo(() => nextLeaf(leafSteps, activeStep), [
    leafSteps,
    activeStep,
  ]);

  const currentStepRef = React.useRef<any>();

  currentStepRef.current = {
    currentStep: activeStep,
    nextStep: nleaf,
  };

  /**
   * set up variables for use in connect StepRouter
   */
  return (
    <LocationContext.Provider
      value={{
        history: historyRef.current,
        steps,
        setSteps,
        activeStep,
        completedSteps,
        highestStep,
        leafSteps,
        setLeafSteps,
        nextLeaf: nleaf,
        shouldShowStep,
        currentStepRef,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export function ConnectStepRouter({ children }: any): any {
  const values = useContext(LocationContext);
  return children(values);
}

/**
 * Renders the child route's element, if there is one.
 */
export function Outlet() {
  return useOutlet();
}

if (__DEV__) {
  Outlet.displayName = 'Outlet';
  Outlet.propTypes = {};
}

export function Steps({ children }: { children: any }) {
  const { setLeafSteps, setSteps } = useContext(LocationContext);
  const steps = createStepsFromChildren(children);
  const flattenedSteps = useMemo(() => flattenSteps(steps), [steps]);
  const leafSteps = useMemo(() => flattenedSteps.filter((step) => step[3]), []);

  useEffect(() => {
    setLeafSteps(leafSteps);
    setSteps(steps);
  }, []);

  return useSteps(flattenedSteps);
}

/**
 * Used in a step config to render an element.
 */
export function Step({ element = <Outlet /> }: any) {
  return element;
}

/**
 * Utility function that creates a steps config object from a React
 * "children" object, which is usually either a React element or an
 * array of elements.
 */
export function createStepsFromChildren(children: any, path: Array<any> = []) {
  const steps: Array<any> = [];

  React.Children.forEach(children, (element) => {
    // Ignore non-elements. This allows people to more
    // easily inline conditionals in their route config.
    if (!React.isValidElement(element)) {
      return;
    }

    const { name, children: childChildren }: any = element.props;

    // Transparently support React.Fragment and its children.
    if (element.type === React.Fragment) {
      // eslint-disable-next-line prefer-spread
      steps.push.apply(steps, createStepsFromChildren(childChildren));
      return;
    }

    const currentPath = [...path, steps.length];

    const step: any = {
      path: steps.length,
      element,
      name,
    };

    const childSteps = createStepsFromChildren(childChildren, currentPath);
    if (childSteps.length) {
      step.children = childSteps;
    }

    steps.push(step);
  });

  return steps;
}

///////////////////////////////////////////////////////////////////////////////
// HOOKS
///////////////////////////////////////////////////////////////////////////////

export function useActiveStep() {
  return React.useContext(LocationContext).activeStep;
}

export function useCompletedSteps() {
  return React.useContext(LocationContext).completedSteps;
}

export function useHighestStep() {
  return React.useContext(LocationContext).highestStep;
}

export function useStep(): {
  currentStep: Array<number>;
  nextStep: Array<number>;
} {
  const { indexes } = React.useContext(StepContext);
  const { leafSteps } = React.useContext(LocationContext);

  const nextStep = nextLeaf(leafSteps, indexes);
  return { currentStep: indexes, nextStep };
}

/**
 * evt handler that sets { currentStep, nextStep }
 */
export function useSetStepHandler() {
  const s = useStep();
  const { currentStepRef } = React.useContext(LocationContext);
  return () => {
    currentStepRef.current = s;
  };
}

export function useIndexes() {
  return React.useContext(StepContext).indexes;
}

export function useIsActive() {
  const { indexes } = React.useContext(StepContext);
  const { activeStep } = React.useContext(LocationContext);
  return eq(indexes, activeStep);
}

export function useLocation() {
  return React.useContext(LocationContext).location;
}

/**
 * Returns the outlet element at this level of the step hierarchy. Used to
 * render child steps.
 */
export function useOutlet() {
  return React.useContext(StepContext).outlet;
}

function getParentProvider(element: any, indexes: any): any {
  return indexes.length === 0
    ? element
    : getParentProvider(
        element.props.value.outlet[indexes[0]],
        indexes.slice(1),
      );
}

function showActiveStep(thisStep: any, activeStep: any, highestStep: any): any {
  const show = lte(thisStep, highestStep) && thisStep[0] === activeStep[0];
  return show;
}

export function renderTreeTailCall(
  element: any,
  flattenedSteps: any,
  depth: any,
  activeStep: any,
  highestStep: any,
  shouldShowStep: any,
): any {
  const childSteps = flattenedSteps
    // [path, joinedSteps, indexes, !step.children]
    .filter((flatStep: any) => flatStep[2].length === depth + 1)
    .map((flatStep: any) => [
      ...flatStep,
      shouldShowStep(flatStep[2], activeStep, highestStep),
    ])
    .map((flatStep: any) => {
      const step = flatStep[1][flatStep[1].length - 1];
      const indexes = flatStep[2];
      return {
        indexes: indexes,
        provider: (
          <StepContext.Provider
            key={steptopath(indexes)}
            value={{
              outlet: null,
              indexes,
              step,
            }}
          >
            {flatStep[4] && step.element}
          </StepContext.Provider>
        ),
      };
    })
    .reduce((accumulator: Record<string, any>, { indexes, provider }: any) => {
      const parentIndexes = indexes.slice(0, -1);
      const parentPath = steptopath(parentIndexes);
      const children: any = property('children')(accumulator[parentPath]) || [];
      accumulator[parentPath] = {
        parentIndexes,
        children: [...children, provider],
      };
      return accumulator;
    }, {});

  Object.values(childSteps).forEach(({ parentIndexes, children }: any) => {
    const parentElement = getParentProvider(element, parentIndexes);
    if (parentElement) {
      parentElement.props.value.outlet = children;
    }
  });

  return depth === 0
    ? renderTreeTailCall(
        element,
        flattenedSteps,
        depth + 1,
        activeStep,
        highestStep,
        shouldShowStep,
      )
    : element;
}

export function useSteps(flattenedSteps: Array<any>) {
  const activeStep = useActiveStep();
  const highestStep = useHighestStep();
  const { shouldShowStep } = useContext(LocationContext);

  const root = (
    <StepContext.Provider
      value={{
        outlet: <div>add some steps</div>,
        indexes: [],
        step: null,
      }}
    >
      <Outlet />
    </StepContext.Provider>
  );

  return renderTreeTailCall(
    root,
    flattenedSteps,
    0,
    activeStep,
    highestStep,
    shouldShowStep,
  );
}

///////////////////////////////////////////////////////////////////////////////
// UTILS
///////////////////////////////////////////////////////////////////////////////

export function steptopath(step: Array<any>) {
  return step.length > 0 ? `/${step.join('/')}` : '/';
}

export function pathtostep(path: string) {
  return path.slice(1).split('/');
}

export const eq = isEqual;

export function lte(a: Array<any>, b: Array<any>) {
  return steptopath(a) <= steptopath(b);
}

export function nextLeaf(leafSteps: Array<any>, currentStep: Array<any>) {
  for (let i = 0; i < leafSteps.length - 1; i += 1) {
    if (eq(leafSteps[i][2], currentStep)) {
      return leafSteps[i + 1][2];
    }
  }
  return null;
}

function flattenSteps(
  steps: any,
  flattenedSteps: Array<any> = [],
  parentPath = '',
  parentSteps = [],
  parentIndexes: Array<number> = [],
) {
  steps.forEach((step: any, index: number) => {
    const path = joinPaths([parentPath, step.path]);
    const joinedSteps = parentSteps.concat(step);
    const indexes = parentIndexes.concat(index);

    flattenedSteps.push([path, joinedSteps, indexes, !step.children]);

    if (step.children) {
      flattenSteps(step.children, flattenedSteps, path, joinedSteps, indexes);
    }
  });

  return flattenedSteps;
}

// const trimTrailingSlashes = (path: string) => path.replace(/\/+$/, '');
const normalizeSlashes = (path: string) => path.replace(/\/\/+/g, '/');
const joinPaths = (paths: Array<any>) => normalizeSlashes(paths.join('/'));
// const splitPath = (path: string) => normalizeSlashes(path).split('/');

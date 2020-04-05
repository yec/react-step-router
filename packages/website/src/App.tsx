import React from 'react';
import './App.css';
import {
  StepRouter,
  Steps,
  Step,
  Outlet,
  ConnectStepRouter,
} from 'react-step-router';

function App() {
  const [activeStep, setActiveStep] = React.useState([0]);
  const [highestStep, setHighestStep] = React.useState([0]);
  const [completedSteps, setCompletedSteps] = React.useState<any>([]);
  const [branch, setBranch] = React.useState('a');

  return (
    <div className="App">
      <StepRouter
        activeStep={activeStep}
        highestStep={highestStep}
        completedSteps={completedSteps}
      >
        <ConnectStepRouter>
          {({ currentStepRef }: { currentStepRef: any }) => {
            return (
              <>
                <Steps>
                  <Step
                    name="Introduction"
                    element={<div>Welcome to react step router.</div>}
                  />
                  <Step
                    name="Step 2"
                    element={<div>Hi this is the second step.</div>}
                  />
                  <Step
                    name="Nested step"
                    element={
                      <div>
                        This is a nested step.
                        <Outlet />
                      </div>
                    }
                  >
                    <Step name="Nested 1" element={<div>Nested step 1</div>} />
                    <Step name="Nested 2" element={<div>Nested step 2</div>} />
                  </Step>
                  <Step
                    name="Branch step"
                    element={
                      <div>
                        <div>Branch step. Choose A or B and continue.</div>
                        <div>
                          <input
                            name="branch"
                            defaultChecked={branch === 'a'}
                            type="radio"
                            id="a"
                            onClick={() => setBranch('a')}
                          />{' '}
                          <label htmlFor="a">Branch A</label>
                        </div>
                        <div>
                          <input
                            name="branch"
                            defaultChecked={branch === 'b'}
                            type="radio"
                            id="b"
                            onClick={() => setBranch('b')}
                          />{' '}
                          <label htmlFor="b">Branch B</label>
                        </div>
                      </div>
                    }
                  />
                  {branch === 'a' ? (
                    <Step
                      name="Branch A"
                      element={<div>Branch A chosen.</div>}
                    />
                  ) : (
                    <Step
                      name="Branch B"
                      element={<div>Branch B chosen.</div>}
                    />
                  )}
                  <Step
                    name="The end"
                    element={<div>The end. Thanks for reading. :)</div>}
                  />
                </Steps>
                {currentStepRef.current.nextStep && (
                  <button
                    onClick={() => {
                      setActiveStep(currentStepRef.current.nextStep);
                      setHighestStep(currentStepRef.current.nextStep);
                      setCompletedSteps([
                        ...completedSteps,
                        currentStepRef.current.nextStep,
                      ]);
                    }}
                  >
                    Continue
                  </button>
                )}
              </>
            );
          }}
        </ConnectStepRouter>
      </StepRouter>
    </div>
  );
}

export default App;

# React Step Router

<div align="center">
    <p align="center">
        <a href="https://github.com/yec/react-step-router#readme" title="React Step Router">
            <img src="https://raw.githubusercontent.com/yec/react-step-router/master/packages/website/public/example.gif" alt="React Router video" width="400px" />
        </a>
    </p>
</div>

```
function App() {
  const [activeStep, setActiveStep] = React.useState([0]);
  const [highestStep, setHighestStep] = React.useState([0]);
  const [completedSteps, setCompletedSteps] = React.useState([]);
  const [branch, setBranch] = React.useState('a');

  return (
    <div className="App">
      <StepRouter
        activeStep={activeStep}
        highestStep={highestStep}
        completedSteps={completedSteps}
      >
        <ConnectStepRouter>
          {({ currentStepRef }) => {
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
```

Step router inspired by react router 6. No form handling or ui included. 
The only responsibility is registering steps and step, step are allowed to be nested. Only leaf step node are visitable. i.e. Step with children step are not able to be visited though they will be rendered as part of the activeStep hierarchy. As a leaf step is marked completed the next step will be viewable currently configured such that as a step at depth 0 is complete it will show the next step and the completed step is not shown. Step with depth 1 with show completed steps with the same root step. e.g. Completed step of [1,1] will also show [1,0].

Prop highestStep allows you to have activeStep of [1,1] but also have step [1,2] visible if you have completed that step before. This will be useful when viewing completed steps or saving the state.

Hook useSetStepHandler is used to set the onClick of a submit button. What this will do is set currentStepRef.current = { currentStep, nextStep } to the step being submitted. You can then use this value to set the next step.

The connect component can be used to render a navbar for instance.
```
<ConnectStepRouter>{({ steps }) => <Nav steps={steps} />}</ConnectStepRouter>
```

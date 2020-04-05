# React Step Router

<div align="center">
    <p align="center">
        <a href="https://github.com/yec/react-step-router#readme" title="React Step Router">
            <img src="https://raw.githubusercontent.com/yec/react-step-router/master/packages/website/public/example.gif" alt="React Router video" width="400px" />
        </a>
    </p>
</div>

Step router inspired by react router 6. No form handling or ui included. 
The only responsibility is registering steps and step, step are allowed to be nested. Only leaf step node are show. i.e. Step with children step are not rendered. As a leaf step is marked completed the next step will be viewable currently configured such that as a step at depth 0 is complete it will show the next step and the completed step is not shown. Step with depth 1 with show completed steps with the same root step. e.g. Completed step of [1,1] will also show [1,0].

Prop highestStep allows you to have activeStep of [1,1] but also have step [1,2] visible if you have completed that step before. This will be useful when viewing completed steps or saving the state.

Hook useSetStepHandler is used to set the onClick of a submit button. What this will do is set currentStepRef.current = { currentStep, nextStep } to the step being submitted. You can then use this value to set the next step.

The connect component can be used to render a navbar for instance.
```
<ConnectStepRouter>{({ steps }) => <Nav steps={steps} />}</ConnectStepRouter>
```

```
<StepRouter>
  <Steps>
    <Step name="step 1" element={<Outlet />}>
      <Step element={<div>step 1.1</div>} />
      <Step element={<div>step 1.2</div>} />
    </Step>
    <Step name="step 2" />
  </Steps>
</StepRouter>
```

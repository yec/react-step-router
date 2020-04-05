import * as React from 'react';
import { create as createTestRenderer } from 'react-test-renderer';
import { lte, StepRouter, Steps, Step, useOutlet } from 'react-step-router';

describe('utils', () => {
  describe('lte', () => {
    it('returns less than or equal to', () => {
      expect(lte([0], [0])).toBe(true);
      expect(lte([1], [0])).toBe(false);
    });
  });
});

describe('useOutlet', () => {
  describe('when there is no child route', () => {
    it('returns null', () => {
      function Home() {
        return useOutlet();
      }

      const renderer = createTestRenderer(
        <StepRouter activeStep={[0]} highestStep={[0]}>
          <Steps>
            <Step path="/home" element={<Home />} />
          </Steps>
        </StepRouter>,
      );

      expect(renderer.toJSON()).toBeNull();
    });
  });

  describe('when there is a child step', () => {
    it('returns an element', () => {
      function Users() {
        return useOutlet();
      }

      function Profile() {
        return <p>Profile</p>;
      }

      const renderer = createTestRenderer(
        <StepRouter activeStep={[0, 0]} highestStep={[0, 0]}>
          <Steps>
            <Step element={<Users />}>
              <Step element={<Profile />} />
            </Step>
          </Steps>
        </StepRouter>,
      );

      expect(renderer.toJSON()).toMatchSnapshot();
    });
  });
});

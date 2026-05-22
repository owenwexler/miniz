import { test, expect } from "bun:test";

import { mz } from './mz';

test("it is real", () => {
  expect(1).toBe(1);
});

test('mz.js contains the attached errors object', () => {
  expect(mz).toHaveProperty('errors');
  expect(mz.errors).not.toBeNull();
  expect(mz.errors).not.toBeUndefined();
});


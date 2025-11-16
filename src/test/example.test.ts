import { describe, it, expect } from 'vitest';
import { VALIDATION } from '../constants';

describe('Validation Constants', () => {
  it('should have valid email regex', () => {
    const validEmail = 'test@example.com';
    const invalidEmail = 'invalid-email';

    expect(VALIDATION.EMAIL_REGEX.test(validEmail)).toBe(true);
    expect(VALIDATION.EMAIL_REGEX.test(invalidEmail)).toBe(false);
  });

  it('should have valid phone regex', () => {
    const validPhone = '+60123456789';
    const invalidPhone = 'abc';

    expect(VALIDATION.PHONE_REGEX.test(validPhone)).toBe(true);
    expect(VALIDATION.PHONE_REGEX.test(invalidPhone)).toBe(false);
  });

  it('should have correct min/max values', () => {
    expect(VALIDATION.MIN_NAME_LENGTH).toBe(2);
    expect(VALIDATION.MAX_NAME_LENGTH).toBe(100);
    expect(VALIDATION.MIN_MESSAGE_LENGTH).toBe(10);
    expect(VALIDATION.MAX_MESSAGE_LENGTH).toBe(1000);
  });
});

import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: any, formValues?: Record<string, any>) => string | undefined;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface UseFormValidationProps<T> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => Promise<void> | void;
}

export const useFormValidation = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormValidationProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: string, value: any): string | undefined => {
      const rule = validationRules[name];
      if (!rule) return undefined;

      if (rule.required && !value) {
        return 'This field is required';
      }

      if (rule.minLength && value?.length < rule.minLength) {
        return `Minimum ${rule.minLength} characters required`;
      }

      if (rule.maxLength && value?.length > rule.maxLength) {
        return `Maximum ${rule.maxLength} characters allowed`;
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return 'Invalid format';
      }

      if (rule.validate) {
        return rule.validate(value, values);
      }

      return undefined;
    },
    [validationRules, values]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;

      setValues((prev) => ({ ...prev, [name]: finalValue }));

      if (touched[name]) {
        const error = validateField(name, finalValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue = type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value;

      setTouched((prev) => ({ ...prev, [name]: true }));
      const error = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const setFieldValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [touched, validateField]);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      if (!validateForm()) {
        return;
      }

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [onSubmit, validateForm, values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    setValues,
  };
};
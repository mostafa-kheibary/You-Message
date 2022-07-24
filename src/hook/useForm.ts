import { ChangeEvent, FormEvent, useState } from 'react';

const useForm = (submitFunction: () => void, defualtValues = {}) => {
  const [values, setValues] = useState<any>(defualtValues);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setValues({ ...values, [e.target.name]: e.target.value || '' });
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement | HTMLTextAreaElement>): void => {
    e.preventDefault();
    submitFunction();
  };
  return { handleChange, handleSubmit, values };
};

export default useForm;

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const Form = ({ fields, onSubmit }) => {
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
    );

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        fields.forEach((field) => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label || field.name} is required`;
            }
            if (field.validate && !field.validate(formData[field.name])) {
                newErrors[field.name] = field.errorMessage || `${field.label || field.name} is invalid`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container space-y-6 bg-white p-6 rounded-lg shadow-md">
            {fields.map((field) => (
                <div key={field.name} className="form-field">
                    <label htmlFor={field.name} className="form-label block text-sm font-medium text-gray-700 mb-1">
                        {field.label}
                    </label>
                    <Input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                    />
                    {errors[field.name] && <span className="error-message text-red-500 text-sm">{errors[field.name]}</span>}
                </div>
            ))}
            <Button type="submit" className="submit-button bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
                Submit
            </Button>
        </form>
    );
};

export default Form;
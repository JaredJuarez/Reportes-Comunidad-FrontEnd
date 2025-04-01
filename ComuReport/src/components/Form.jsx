import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';

const Form = ({ fields, onSubmit }) => {
 
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.name]: field.defaultValue || '' }), {})
  );

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field, index) => (
        <div
          key={field.name}
          className={`relative ${index < fields.length - 1 ? 'mb-6' : 'mb-8'}`}
        >
         
          {field.icon && (
            <field.icon className="absolute left-3 top-3 text-white/80" />
          )}
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            required={field.required}
            className="bg-white/10 border border-white/20 text-white placeholder-gray-300 pl-10 pr-3 py-2 w-full rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      ))}

      <Button
        type="submit"
        className="bg-white text-[#0D2538] w-full py-2 rounded-full font-semibold tracking-wide hover:bg-gray-100 transition-colors"
      >
        Entrar
      </Button>
    </form>
  );
};

export default Form;

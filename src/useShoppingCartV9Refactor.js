import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxRate, setTaxRate] = useState('');
  const [discount, setDiscount] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  const validators = {
    name: (value) => value.trim() !== '',
    price: (value) => !isNaN(value) && parseFloat(value) >= 0,
    quantity: (value) => !isNaN(value) && parseInt(value, 10) > 0,
    taxRate: (value) => !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100,
    discount: (value) => !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100,
  };

  const validateInput = (type, value) => {
    if (validators[type]) {
      return validators[type](value);
    }
    return true;
  };

  const addItem = (item) => {
    const validationChecks = {
      name: { isValid: validateInput('name', item.name), errorMessage: 'Please enter a valid name.' },
      price: { isValid: validateInput('price', item.price), errorMessage: 'Please enter a valid price.' },
      quantity: { isValid: validateInput('quantity', item.quantity), errorMessage: 'Please enter a valid quantity.' },
      taxRate: { isValid: (!item.taxable || validateInput('taxRate', item.taxRate)), errorMessage: 'Please enter a valid tax rate (0-100).' },
      discount: { isValid: (item.discount === '' || validateInput('discount', item.discount)), errorMessage: 'Please enter a valid discount rate (0-100).' },
    };

    const invalidInputs = Object.keys(validationChecks).filter(key => !validationChecks[key].isValid);

    if (invalidInputs.length > 0) {
      const errorMessages = invalidInputs.map(key => validationChecks[key].errorMessage).join(' ');
      setError(errorMessages);
      return;
    }

    const newItem = {
      id: uuidv4(),
      name: item.name,
      price: parseFloat(item.price),
      quantity: parseInt(item.quantity, 10),
      taxable: item.taxable,
      taxRate: item.taxable ? parseFloat(item.taxRate) / 100 : 0,
      discount: item.discount !== '' ? parseFloat(item.discount) : 0,
    };

    if (editId !== null) {
      const updatedItems = items.map((item) =>
        item.id === editId ? newItem : item
      );
      setItems(updatedItems);
      setEditId(null);
    } else {
      setItems([...items, newItem]);
    }

    setName('');
    setPrice('');
    setQuantity('');
    setTaxable(false);
    setTaxRate('');
    setDiscount('');
    setError('');
  };

  const removeItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
  };

  const editItem = (id, updatedItem) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const updatedItems = items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      setItems(updatedItems);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const calculateItemTotal = (item) => {
    let itemTotal = item.price * item.quantity;
    if (item.taxable) {
      itemTotal += calculateTax(itemTotal, item.taxRate);
    }
    if (item.discount > 0 && item.discount <= 100) {
      itemTotal -= calculateDiscount(itemTotal, item.discount);
    }
    return itemTotal;
  };

  const calculateTax = (amount, taxRate) => {
    return amount * taxRate;
  };

  const calculateDiscount = (amount, discountRate) => {
    return (amount * discountRate) / 100;
  };

  return {
    items,
    name,
    price,
    quantity,
    taxable,
    taxRate,
    discount,
    editId,
    error,
    setName,
    setPrice,
    setQuantity,
    setTaxable,
    setTaxRate,
    setDiscount,
    addItem,
    removeItem,
    editItem,
    calculateTotal,
  };
};

export default useShoppingCart;

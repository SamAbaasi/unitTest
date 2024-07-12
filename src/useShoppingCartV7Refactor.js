import { useState } from 'react';

export const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxRate, setTaxRate] = useState('');
  const [discount, setDiscount] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  // Object containing validation functions for each input type
  const validators = {
    name: (value) => value.trim() !== '',
    price: (value) => !isNaN(value) && parseFloat(value) >= 0,
    quantity: (value) => !isNaN(value) && parseInt(value, 10) > 0,
    taxRate: (value) => !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100,
    discount: (value) => !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100,
  };

  // Function to validate input based on type and conditions
  const validateInput = (type, value) => {
    if (validators[type]) {
      return validators[type](value);
    }
    return true; // Default to true for unknown types
  };

  // Function to add an item to the shopping cart
  const addItem = () => {
    // Define validation checks for each input field
    const validationChecks = {
      name: () => validateInput('name', name),
      price: () => validateInput('price', price),
      quantity: () => validateInput('quantity', quantity),
      taxRate: () => (!taxable || validateInput('taxRate', taxRate)),
      discount: () => (discount === '' || validateInput('discount', discount)),
    };

    // Check all validations
    const isValid = Object.keys(validationChecks).every((key) => validationChecks[key]());

    // If any validation fails, set error and return
    if (!isValid) {
      setError('Please check the input fields and try again.');
      return;
    }

    // Create new item object
    const newItem = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      taxable,
      taxRate: taxable ? parseFloat(taxRate) / 100 : 0,
      discount: discount !== '' ? parseFloat(discount) : 0,
    };

    // If editing an item, update the existing item in the cart
    if (editIndex !== null) {
      const updatedItems = items.map((item, index) =>
        index === editIndex ? newItem : item
      );
      setItems(updatedItems);
      setEditIndex(null);
    } else {
      // Otherwise, add the new item to the cart
      setItems([...items, newItem]);
    }

    // Clear input fields and reset error state
    setName('');
    setPrice('');
    setQuantity('');
    setTaxable(false);
    setTaxRate('');
    setDiscount('');
    setError('');
  };

  // Function to remove an item from the shopping cart
  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Function to edit an item in the shopping cart
  const editItem = (index) => {
    const item = items[index];
    setName(item.name);
    setPrice(item.price.toString());
    setQuantity(item.quantity.toString());
    setTaxable(item.taxable);
    setTaxRate((item.taxRate * 100).toString());
    setDiscount(item.discount.toString());
    setEditIndex(index);
  };

  // Function to calculate the total cost of all items in the shopping cart
  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  // Function to calculate total cost of an item including tax and discount
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

  // Function to calculate tax amount based on total amount and tax rate
  const calculateTax = (amount, taxRate) => {
    return amount * taxRate;
  };

  // Function to calculate discount amount based on total amount and discount rate
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
    editIndex,
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

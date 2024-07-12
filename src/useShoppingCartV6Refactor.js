import { useState } from 'react';

const useShoppingCart = () => {
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
    // Validate input fields before adding item
    if (!validateInput('name', name)) {
      setError('Please enter a valid name.');
      return;
    }
    if (!validateInput('price', price)) {
      setError('Please enter a valid price.');
      return;
    }
    if (!validateInput('quantity', quantity)) {
      setError('Please enter a valid quantity.');
      return;
    }
    if (taxable && !validateInput('taxRate', taxRate)) {
      setError('Please enter a valid tax rate (0-100).');
      return;
    }
    if (discount !== '' && !validateInput('discount', discount)) {
      setError('Please enter a valid discount rate (0-100).');
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

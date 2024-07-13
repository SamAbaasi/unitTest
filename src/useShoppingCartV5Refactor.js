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

  // Function to validate input based on type and conditions
  const validateInput = (type, value) => {
    switch (type) {
      case 'name':
        return value.trim() !== '';
      case 'price':
        return !isNaN(value) && parseFloat(value) >= 0;
      case 'quantity':
        return !isNaN(value) && parseInt(value, 10) > 0;
      case 'taxRate':
        return !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100;
      case 'discount':
        return !isNaN(value) && parseFloat(value) >= 0 && parseFloat(value) <= 100;
      default:
        return true; // Default to true for unknown types
    }
  };

  const addItem = () => {
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

    const newItem = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      taxable,
      taxRate: taxable ? parseFloat(taxRate) / 100 : 0,
      discount: discount !== '' ? parseFloat(discount) : 0,
    };

    if (editIndex !== null) {
      const updatedItems = items.map((item, index) =>
        index === editIndex ? newItem : item
      );
      setItems(updatedItems);
      setEditIndex(null);
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

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

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

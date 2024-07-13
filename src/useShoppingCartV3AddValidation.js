import { useState } from 'react';

const calculateItemTotal = (item) => {
  let itemTotal = item.price * item.quantity;
  if (item.taxable) {
    itemTotal += calculateTax(itemTotal, item.taxRate);
  }
  return itemTotal;
};

const calculateTax = (amount, taxRate) => {
  return amount * taxRate;
};

const validateName = (name) => {
  return name.trim() !== '';
};

const validatePrice = (price) => {
  return !isNaN(price) && parseFloat(price) >= 0;
};

const validateQuantity = (quantity) => {
  return !isNaN(quantity) && parseInt(quantity, 10) > 0;
};

const validateTaxRate = (taxRate) => {
  return !isNaN(taxRate) && parseFloat(taxRate) >= 0 && parseFloat(taxRate) <= 100;
};

export const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxRate, setTaxRate] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const addItem = () => {
    // Validate input fields before adding item
    if (!validateName(name)) {
      setError('Please enter a valid name.');
      return;
    }
    if (!validatePrice(price)) {
      setError('Please enter a valid price.');
      return;
    }
    if (!validateQuantity(quantity)) {
      setError('Please enter a valid quantity.');
      return;
    }
    if (taxable && !validateTaxRate(taxRate)) {
      setError('Please enter a valid tax rate (0-100).');
      return;
    }

    const newItem = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      taxable,
      taxRate: taxable ? parseFloat(taxRate) / 100 : 0,
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
    setEditIndex(index);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return {
    items,
    name,
    price,
    quantity,
    taxable,
    taxRate,
    editIndex,
    error,
    setName,
    setPrice,
    setQuantity,
    setTaxable,
    setTaxRate,
    addItem,
    removeItem,
    editItem,
    calculateTotal,
  };
};

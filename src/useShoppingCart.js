import { useState } from 'react';

export const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [taxable, setTaxable] = useState(false);
  const [taxRate, setTaxRate] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  const addItem = () => {
    const newItem = {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      taxable,
      taxRate: parseFloat(taxRate) / 100,
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
  };

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const editItem = (index) => {
    const item = items[index];
    setName(item.name);
    setPrice(item.price);
    setQuantity(item.quantity);
    setTaxable(item.taxable);
    setTaxRate(item.taxRate * 100);
    setEditIndex(index);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      let itemTotal = item.price * item.quantity;
      if (item.taxable) {
        itemTotal += itemTotal * item.taxRate;
      }
      return total + itemTotal;
    }, 0);
  };

  return {
    items,
    name,
    price,
    quantity,
    taxable,
    taxRate,
    editIndex,
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

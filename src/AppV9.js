import React from 'react';
import './App.css';
import { useShoppingCart } from './useShoppingCartV9Refactor';

function App() {
  const {
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
  } = useShoppingCart();

  const handleAddItem = () => {
    addItem({
      name,
      price,
      quantity,
      taxable,
      taxRate,
      discount,
    });
  };

  const handleEditItem = (id) => {
    editItem(id, {
      name,
      price,
      quantity,
      taxable,
      taxRate,
      discount,
    });
  };

  return (
    <div className="App">
      <h1>Shopping Cart</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <label>
          Taxable
          <input
            type="checkbox"
            checked={taxable}
            onChange={(e) => setTaxable(e.target.checked)}
          />
        </label>
        {taxable && (
          <input
            type="number"
            placeholder="Tax Rate (%)"
            value={taxRate}
            onChange={(e) => setTaxRate(e.target.value)}
          />
        )}
        <input
          type="number"
          placeholder="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <button onClick={handleAddItem}>{editId !== null ? 'Update Item' : 'Add Item'}</button>
        {error && <p className="error">{error}</p>}
      </div>
      <h2>Total: ${calculateTotal().toFixed(2)}</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            Name: {item.name}, Price: ${item.price}, Quantity: {item.quantity}, Taxable: {item.taxable ? 'Yes' : 'No'}, Tax Rate: {(item.taxRate * 100).toFixed(2)}%, Discount: {item.discount}%
            <button onClick={() => handleEditItem(item.id)}>Edit</button>
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

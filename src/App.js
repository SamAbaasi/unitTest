import React from 'react';
import './App.css';
import { useShoppingCart } from './useShoppingCart';
// import { useShoppingCart } from './useShoppingCartV2';

function App() {
  const {
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
  } = useShoppingCart();

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
        <input
          type="number"
          placeholder="Tax Rate (%)"
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        />
        <button onClick={addItem}>{editIndex !== null ? 'Update Item' : 'Add Item'}</button>
      </div>
      <h2>Total: ${calculateTotal().toFixed(2)}</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            Name: {item.name}, Price: ${item.price}, Quantity: {item.quantity}, Taxable: {item.taxable ? 'Yes' : 'No'}, Tax Rate: {(item.taxRate * 100).toFixed(2)}%
            <button onClick={() => editItem(index)}>Edit</button>
            <button onClick={() => removeItem(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

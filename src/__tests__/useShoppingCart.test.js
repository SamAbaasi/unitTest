import { act, renderHook } from '@testing-library/react';
import { useShoppingCart } from '../useShoppingCartV8Refactor';

describe('useShoppingCart', () => {
  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useShoppingCart());

    act(() => {
      result.current.setName('Item 1');
      result.current.setPrice('10');
      result.current.setQuantity('2');
      result.current.setTaxable(true);
      result.current.setTaxRate('8');
      result.current.setDiscount('0');
      result.current.addItem();
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Item 1');
    expect(result.current.items[0].price).toBe(10);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.items[0].taxable).toBe(true);
    expect(result.current.items[0].taxRate).toBe(0.08);
    expect(result.current.items[0].discount).toBe(0);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useShoppingCart());

    // Add an item first
    act(() => {
      result.current.setName('Item 1');
      result.current.setPrice('10');
      result.current.setQuantity('2');
      result.current.addItem();
    });
    expect(result.current.items).toHaveLength(1);

    // Remove the item
    act(() => {
      result.current.removeItem(0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should edit an item in the cart', () => {
    const { result } = renderHook(() => useShoppingCart());
  
    // Add an initial item
    act(() => {
      result.current.setName('Item 1');
      result.current.setPrice('10');
      result.current.setQuantity('2');
      result.current.setTaxable(true);
      result.current.setTaxRate('8');
      result.current.setDiscount('0');
      result.current.addItem();
    });
  
    // Edit the item
    act(() => {
      result.current.editItem(0);
      result.current.setName('Updated Item 1');
      result.current.setPrice('15');
      result.current.setQuantity('3');
      result.current.setTaxRate('10');
      result.current.setDiscount('5');
      result.current.addItem(); // This should update the existing item
    });
  
    // Assert the updated item
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Updated Item 1');
    expect(result.current.items[0].price).toBe(15);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.items[0].taxRate).toBe(0.1); // 10% tax rate
    expect(result.current.items[0].discount).toBe(5);
  });
  

  it('should calculate the total cost correctly', () => {
    const { result } = renderHook(() => useShoppingCart());
  
    act(() => {
      result.current.setName('Item 1');
      result.current.setPrice('20');
      result.current.setQuantity('2');
      result.current.setTaxable(true);
      result.current.setTaxRate('8');
      result.current.setDiscount('10');
      result.current.addItem();
    });
  
    expect(result.current.calculateTotal()).toBeCloseTo(36.8); // Expected total after tax and discount: 36.8
  });
  

  it('should validate input fields correctly', () => {
    const { result } = renderHook(() => useShoppingCart());

    act(() => {
      result.current.setName('');
      result.current.setPrice('abc'); // Invalid price
      result.current.setQuantity('0'); // Invalid quantity
      result.current.setTaxRate('200'); // Invalid tax rate
      result.current.addItem();
    });

    expect(result.current.error).toBe('Please enter a valid name. Please enter a valid price. Please enter a valid quantity. Please enter a valid tax rate (0-100).');
    expect(result.current.items).toHaveLength(0); // No items should be added due to validation errors
  });
});

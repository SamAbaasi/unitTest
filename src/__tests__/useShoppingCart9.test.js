// import { act, renderHook } from '@testing-library/react';
// import { useShoppingCart } from '../useShoppingCartV9Refactor';
// Common Matchers toBe, toEqual

test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
//toBe uses Object.is to test exact equality. If you want to check the value of an object, use toEqual
test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

// You can also test for the opposite of a matcher using not:
test('adding positive numbers is not zero', () => {
  for (let a = 1; a < 10; a++) {
    for (let b = 1; b < 10; b++) {
      expect(a + b).not.toBe(0);
    }
  }
});

// in tests, you sometimes need to distinguish between undefined, null, and false, 
//but you sometimes do not want to treat these differently. 
//Jest contains helpers that let you be explicit about what you want.

// toBeNull matches only null
// toBeUndefined matches only undefined
// toBeDefined is the opposite of toBeUndefined
// toBeTruthy matches anything that an if statement treats as true
// toBeFalsy matches anything that an if statement treats as false

test('null', () => {
  const n = null;
  expect(n).toBeNull();
  expect(n).toBeDefined();
  expect(n).not.toBeUndefined();
  expect(n).not.toBeTruthy();
  expect(n).toBeFalsy();
});

test('zero', () => {
  const z = 0;
  expect(z).not.toBeNull();
  expect(z).toBeDefined();
  expect(z).not.toBeUndefined();
  expect(z).not.toBeTruthy();
  expect(z).toBeFalsy();
});


// Numbers
// Most ways of comparing numbers have matcher equivalents.

test('two plus two', () => {
  const value = 2 + 2;
  expect(value).toBeGreaterThan(3);
  expect(value).toBeGreaterThanOrEqual(3.5);
  expect(value).toBeLessThan(5);
  expect(value).toBeLessThanOrEqual(4.5);

  // toBe and toEqual are equivalent for numbers
  expect(value).toBe(4);
  expect(value).toEqual(4);
});

// For floating point equality, use toBeCloseTo instead of toEqual, 
// because you don't want a test to depend on a tiny rounding error.

test('adding floating point numbers', () => {
  const value = 0.1 + 0.2;
  //expect(value).toBe(0.3);           This won't work because of rounding error
  expect(value).toBeCloseTo(0.3); // This works.
});

// Strings
// You can check strings against regular expressions with toMatch:

test('there is no I in team', () => {
  expect('team').not.toMatch(/I/);
});

test('but there is a "stop" in Christoph', () => {
  expect('Christoph').toMatch(/stop/);
});

// Arrays and iterables
// You can check if an array or iterable contains a particular item using toContain:

const shoppingList = [
  'diapers',
  'kleenex',
  'trash bags',
  'paper towels',
  'milk',
];

test('the shopping list has milk on it', () => {
  expect(shoppingList).toContain('milk');
  expect(new Set(shoppingList)).toContain('milk');
});

// Exceptions
// If you want to test whether a particular function throws an error when it's called, use toThrow.

function compileAndroidCode() {
  throw new Error('you are using the wrong JDK!');
}

test('compiling android goes as expected', () => {
  expect(() => compileAndroidCode()).toThrow();
  expect(() => compileAndroidCode()).toThrow(Error);

  // You can also use a string that must be contained in the error message or a regexp
  expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
  expect(() => compileAndroidCode()).toThrow(/JDK/);

  // Or you can match an exact error message using a regexp like below
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
  expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK!$/); // Test pass
});

// describe('useShoppingCart', () => {
//   it('should add an item to the cart', () => {
//     const { result } = renderHook(() => useShoppingCart());

//     act(() => {
//       result.current.addItem({
//         name: 'Item 1',
//         price: 10,
//         quantity: 2,
//         taxable: false,
//         taxRate: 0,
//         discount: 0
//       });
//     });

//     expect(result.current.items).toHaveLength(1);
//     expect(result.current.items[0].name).toBe('Item 1');
//     expect(result.current.items[0].price).toBe(10);
//     expect(result.current.items[0].quantity).toBe(2);
//     expect(result.current.items[0].taxable).toBe(false);
//     expect(result.current.items[0].taxRate).toBe(0);
//     expect(result.current.items[0].discount).toBe(0);
//   });

//   it('should remove an item from the cart', () => {
//     const { result } = renderHook(() => useShoppingCart());

//     act(() => {
//       result.current.addItem({
//         name: 'Item 1',
//         price: 10,
//         quantity: 2,
//         taxable: false,
//         taxRate: 0,
//         discount: 0
//       });
//     });

//     const itemId = result.current.items[0].id;
//     expect(result.current.items).toHaveLength(1);

//     act(() => {
//       result.current.removeItem(itemId);
//     });

//     expect(result.current.items).toHaveLength(0);
//   });

  // it('should edit an item in the cart', () => {
  //   const { result } = renderHook(() => useShoppingCart());

  //   act(() => {
  //     result.current.addItem({
  //       name: 'Item 1',
  //       price: 10,
  //       quantity: 2,
  //       taxable: true,
  //       taxRate: 0.08,
  //       discount: 0
  //     });
  //   });
  //   const itemId = result.current.items[0].id;
  //   act(() => {
  //     result.current.editItem(itemId, {
  //       name: 'Updated Item 1',
  //       price: 15,
  //       quantity: 3,
  //       taxable: true,
  //       taxRate: 0.1,
  //       discount: 5
  //     });
  //   });
  //   expect(result.current.items).toHaveLength(1);
  //   expect(result.current.items[0].name).toBe('Updated Item 1');
  //   expect(result.current.items[0].price).toBe(15);
  //   expect(result.current.items[0].quantity).toBe(3);
  //   expect(result.current.items[0].taxRate).toBe(0.1); // 10% tax rate
  //   expect(result.current.items[0].discount).toBe(5);
  // });

  // it('should calculate the total cost correctly', () => {
  //   const { result } = renderHook(() => useShoppingCart());

  //   act(() => {
  //     result.current.addItem({
  //       name: 'Item 1',
  //       price: 20,
  //       quantity: 2,
  //       taxable: true,
  //       taxRate: 8,
  //       discount: 10
  //     });
  //   });
  //   expect(result.current.calculateTotal()).toBeCloseTo(38.88);
  // });

  // it('should validate input fields correctly', () => {
  //   const { result } = renderHook(() => useShoppingCart());

  //   act(() => {
  //     result.current.addItem({
  //       name: '',
  //       price: 'abc',
  //       quantity: '0',
  //       taxable: true,
  //       taxRate: '200',
  //       discount: '5'
  //     });
  //   });

  //   expect(result.current.error).toBe('Please enter a valid name. Please enter a valid price. Please enter a valid quantity. Please enter a valid tax rate (0-100).');
  //   expect(result.current.items).toHaveLength(0);
  // });
// });

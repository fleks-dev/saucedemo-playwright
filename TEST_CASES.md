# Test Cases

This document outlines the manual test cases derived from the automated Playwright specifications.

## **Authentication**

### **`[login] Locked out user (login)`**

**Source:** `tests/authentication/locked-out-user-login.spec.ts`

**Pre-conditions:**

- User is on the login page.

**Steps:**

1. **Navigate to Login Page**.
2. **Attempt Login**:
   - Enter Username: `locked_out_user`.
   - Enter Password: `secret_sauce`.
   - Click "Login" button.
3. **Verify Error State**:
   - **Assert**: Username input displays error icon (SVG).
   - **Assert**: Password input displays error icon (SVG).
   - **Assert**: Error message container is visible with text: `Epic sadface: Sorry, this user has been locked out.`

### **`[login] Standard user (login)`**

**Source:** `tests/authentication/standard-user-login.spec.ts`

**Pre-conditions:**

- User is on the login page.

**Steps:**

1. **Navigate to Login Page**.
2. **Perform Valid Login**:
   - Enter Username: `standard_user`.
   - Enter Password: `secret_sauce` (default).
   - Click "Login" button.
3. **Verify Successful Login**:
   - **Assert**: URL contains `/inventory.html`.
   - **Assert**: "Products" title is visible.
   - **Assert**: Inventory container is visible.
   - **Assert**: 6 inventory items are displayed.

---

## **Burger Menu**

### **`[burger] Verify burger menu actions`**

**Source:** `tests/burger-menu/verify-menu-actions.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.
- User is on the Inventory page.

**Steps:**

1. **Open Burger Menu**:
   - Click the Burger Menu button (top left).
   - **Assert**: Sidebar menu is visible (not hidden).
2. **Verify Menu Items**:
   - **Assert**: "All Items" link is visible with text "All Items".
   - **Assert**: "About" link is visible with text "About" and href `https://saucelabs.com/`.
   - **Assert**: "Logout" link is visible with text "Logout".
   - **Assert**: "Reset App State" link is visible with text "Reset App State".
3. **Verify "All Items" Navigation**:
   - Click "All Items".
   - **Assert**: URL contains `/inventory.html`.
4. **Verify "About" Navigation**:
   - Click "About".
   - **Assert**: URL contains `https://saucelabs.com/`.
   - _Navigate back to inventory_.
5. **Verify "Logout" Navigation**:
   - Click "Logout".
   - **Assert**: URL is the base URL (Login page).
   - _Log back in_.
6. **Verify "Reset App State"**:
   - Add an item to cart (e.g., "Sauce Labs Backpack").
   - Open Burger Menu.
   - Click "Reset App State".
   - **Assert**: Shopping cart badge is empty/hidden.
   - Open Cart.
   - **Assert**: Cart is empty (0 items).

---

## **Products Page**

### **`[products-page] Verify filters`**

**Source:** `tests/products-page/filters.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Verify Default Filter**:
   - **Assert**: Active filter option is `Name (A to Z)`.
2. **Verify Filter Options**:
   - Click Filter dropdown.
   - **Assert**: Dropdown contains 4 options:
     1. `Name (A to Z)`
     2. `Name (Z to A)`
     3. `Price (low to high)`
     4. `Price (high to low)`
3. **Select Options**:
   - Cycle through selecting each option.
   - **Assert**: Option is successfully selected.

### **`[products-page] Verify products page`**

**Source:** `tests/products-page/products-page-standard-user.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Verify Page Structure**:
   - **Assert**: Inventory container is visible.
   - **Assert**: Title is "Products".
   - **Assert**: 6 Inventory items are present.
2. **Verify Product Details (for each of the 6 items)**:
   - **Assert**: Product Name is visible.
   - **Assert**: Price is visible and formatted correctly (e.g., `$29.99`).
   - **Assert**: Description is visible.
   - **Assert**: Image is visible and `src` matches product definition.
   - **Assert**: "Add to Cart" button is visible and enabled.

---

## **Cart**

### **`[cart] Add to cart`**

**Source:** `tests/cart/add-to-cart.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Initial State**:
   - **Assert**: Cart badge is not visible (empty).
   - Open Cart.
   - **Assert**: URL contains `/cart.html`.
   - **Assert**: Title "Your Cart" is visible.
2. **Navigate Back**:
   - Click "Continue Shopping".
   - **Assert**: Returned to Inventory page.
3. **Add First Item**:
   - Add "Sauce Labs Backpack" to cart.
4. **Verify Single Item**:
   - **Assert**: Cart badge displays "1".
   - Open Cart.
   - **Assert**: "Sauce Labs Backpack" is visible in cart.
   - **Assert**: Price and Description match.
   - Click "Continue Shopping".
5. **Add Second Item**:
   - Add "Sauce Labs Bike Light" to cart.
6. **Verify Multiple Items**:
   - **Assert**: Cart badge displays "2".
   - Open Cart.
   - **Assert**: Cart contains 2 items.

### **`[cart] Remove from cart`**

**Source:** `tests/cart/remove-from-cart.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Setup**:
   - Open Cart -> Verify open.
   - Continue Shopping.
2. **Add Items**:
   - Add "Sauce Labs Bolt T-Shirt".
   - Verify item in cart and continue shopping.
   - Add "Sauce Labs Fleece Jacket".
   - Verify item in cart.
3. **Remove Items**:
   - Open Cart.
   - Click "Remove" button for "Sauce Labs Bolt T-Shirt".
   - Click "Remove" button for "Sauce Labs Fleece Jacket".
4. **Verify Empty**:
   - **Assert**: Cart contents list has 0 items.

---

## **Checkout**

### **`[checkout] Full checkout flow`**

**Source:** `tests/checkout/full-checkout-flow.spec.ts`

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Prepare Cart**:
   - Add "Sauce Labs Bolt T-Shirt".
   - Add "Sauce Labs Fleece Jacket".
   - Add "Sauce Labs Onesie".
   - **Assert**: Cart badge shows "3".
2. **Start Checkout**:
   - Open Cart -> verify items.
   - Click "Checkout" button.
3. **Verify Step One (Information)**:
   - **Assert**: URL contains `/checkout-step-one.html`.
   - **Assert**: Title "Checkout: Your Information".
   - **Assert**: First Name, Last Name, Zip Code inputs are empty and enabled.
   - **Assert**: "Continue" button is visible.
4. **Validation Check**:
   - Click "Continue" without filling form.
   - **Assert**: Error icons on all inputs.
   - **Assert**: Error message `Error: First Name is required`.
5. **Fill Information**:
   - First Name: `John`
   - Last Name: `Doe`
   - Zip Code: `12345`
   - Click "Continue".
6. **Verify Step Two (Overview)**:
   - **Assert**: Title "Checkout: Overview".
   - **Assert**: Payment Info label and value "SauceCard #31337" visible.
   - **Assert**: Shipping Info label and value "Free Pony Express Delivery!" visible.
   - **Assert**: Item Total calculated correctly ($73.97).
   - **Assert**: Tax calculated correctly ($5.92, 8%).
   - **Assert**: Total calculated correctly ($79.89).
7. **Complete Order**:
   - Click "Finish".
8. **Verify Success**:
   - **Assert**: Title "Checkout: Complete!".
   - **Assert**: Header "Thank you for your order!".
   - **Assert**: Dispatch text "Your order has been dispatched..." is visible.
9. **Post-Checkout State**:
   - Click "Back Home".
   - **Assert**: Redirected to Inventory.
   - **Assert**: Cart badge is empty.
   - Open Cart -> **Assert**: Cart is empty.

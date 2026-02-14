## **Authentication**

### **`[login] Locked out user (login)`**

**Pre-conditions:**

- User is on the login page.

**Steps:**

1. **Login with locked out user credentials**:
   - Enter username: `locked_out_user`
   - Enter password: `secret_sauce`
   - Click Login button.
2. **Verify error messages are displayed correctly**:
   - **Assert**: Username input shows error icon (red X).
   - **Assert**: Password input shows error icon (red X).
   - **Assert**: Error message container is visible and displays text: `Epic sadface: Sorry, this user has been locked out.`

### **`[login] Standard user (login)`**

**Pre-conditions:**

- User is on the login page.

**Steps:**

1. **Login with valid credentials**:
   - Enter username: `standard_user`
   - Enter password: `secret_sauce`
   - Click Login button.
2. **Verify products page is loaded**:
   - **Assert**: Inventory container is visible.
   - **Assert**: Title "Products" is visible.
   - **Assert**: 6 inventory items are displayed.

## **Cart**

### **`[cart] Add to cart`**

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Open cart and verify it is open**:
   - Click the shopping cart link.
   - **Assert**: URL contains `/cart.html`.
   - **Assert**: Title "Your Cart" is visible.
2. **Continue shopping**:
   - Click "Continue Shopping" button.
3. **Add Product to cart**:
   - Locate "Sauce Labs Backpack".
   - Click "Add to Cart".
   - **Assert**: "Remove" button becomes visible for the product.
   - **Assert**: "Add to Cart" button becomes hidden.
4. **Verify items in cart**:
   - Open Cart.
   - **Assert**: "Sauce Labs Backpack" is visible in cart.
   - **Assert**: Price is `$29.99` and visible.
   - **Assert**: Description matches product description.
   - **Assert**: Cart items count is 1 (or 2 if repeating).

### **`[cart] Remove from cart`**

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Add products to cart**:
   - Add "Sauce Labs Bolt T-Shirt" and "Sauce Labs Fleece Jacket".
2. **Remove items**:
   - Open Cart.
   - Click "Remove" for "Sauce Labs Bolt T-Shirt".
   - Click "Remove" for "Sauce Labs Fleece Jacket".
3. **Verify removal**:
   - **Assert**: Cart items count is 0.

## **Checkout**

### **`[checkout] Full checkout flow`**

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Add products to cart**:
   - Add "Sauce Labs Bolt T-Shirt", "Sauce Labs Fleece Jacket", "Sauce Labs Onesie".
2. **Start Checkout**:
   - Open Cart.
   - Click "Checkout".
3. **Verify Checkout Page (Step One)**:
   - **Assert**: URL contains `/checkout-step-one.html`.
   - **Assert**: Title is "Checkout: Your Information".
   - **Assert**: First Name, Last Name, Zip Code inputs are visible, enabled, and empty.
   - **Assert**: Continue button is visible, enabled, and has text "Continue".
4. **Verify Error Messages (Empty Form)**:
   - Click "Continue" without filling form.
   - **Assert**: First Name, Last Name, Zip Code inputs show error icons.
   - **Assert**: Error message is visible: `Error: First Name is required`.
   - **Assert**: URL remains on `/checkout-step-one.html`.
5. **Fill Checkout Form**:
   - Fill First Name: "John"
   - Fill Last Name: "Doe"
   - Fill Zip Code: "12345"
   - Click "Continue".
6. **Verify Checkout Overview (Step Two)**:
   - **Assert**: Title is "Checkout: Overview".
   - **Assert**: Payment Info, Shipping Info, Price Total labels are visible.
   - **Assert**: Payment Info is "SauceCard #31337" (implied by label presence check).
   - **Assert**: Shipping Info is "Free Pony Express Delivery!" (implied).
   - **Assert**: Subtotal (Item total) is sum of products: `$73.97`.
   - **Assert**: Tax is 8% of subtotal: `$5.92` (`73.97 * 0.08`).
   - **Assert**: Total is Subtotal + Tax: `$79.89`.
7. **Finish Checkout**:
   - Click "Finish".
   - **Assert**: Title is "Checkout: Complete!".
   - **Assert**: Header "Thank you for your order!" is visible.
   - **Assert**: Dispatch text "Your order has been dispatched..." is visible.
8. **Return Home and Verify Cart**:
   - Click "Back Home".
   - **Assert**: Products page loaded.
   - Open Cart.
   - **Assert**: Cart is empty.

## **Products Page**

### **`[products-page] Verify filters`**

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Verify Default Filter**:
   - **Assert**: "Name (A to Z)" is selected by default.
2. **Verify Filter Options**:
   - Click Filter dropdown.
   - **Assert**: 4 options exist:
     - Name (A to Z)
     - Name (Z to A)
     - Price (low to high)
     - Price (high to low)
3. **Test Filter Selection**:
   - Select each option and verify it can be selected.

### **`[products-page] Verify products page`**

**Pre-conditions:**

- User is logged in as `standard_user`.

**Steps:**

1. **Verify Product Display**:
   - For all 6 products:
     - **Assert**: Name is visible.
     - **Assert**: Price is visible and correct (e.g., Backpack $29.99).
     - **Assert**: Description is visible.
     - **Assert**: Image is visible and source matches.
     - **Assert**: "Add to Cart" button is visible and enabled.

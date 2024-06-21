import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Checkout = () => {
  const [shoppingCartItems, setShoppingCartItems] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('transporto');
  const [country, setCountry] = useState('');
  const [transportCost, setTransportCost] = useState(2.00); // Default transport cost for Kosova
  const [user, setUser] = useState({ firstName: '', lastName: '', phone: '', address: '', city: '' });
  const [errors, setErrors] = useState({});
  const [subtotal, setSubtotal] = useState(66.95); // Replace with dynamic subtotal calculation if needed
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [outOfStockItems, setOutOfStockItems] = useState([]);
  const [cartEmptyMessage, setCartEmptyMessage] = useState(false); // State to handle empty cart message

  useEffect(() => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userName = payload.sub;
      axios.get(`http://localhost:8080/user/${userName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          setUser({
            firstName: response.data.name,
            lastName: response.data.surname,
            phone: response.data.user_telephone_number,
            address: response.data.user_address,
            city: response.data.user_city || '',
          });
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });

      fetchCartItems(userName);

      // Add an event listener to update the cart when storage changes
      const handleStorageChange = () => {
        // Handle storage change by fetching updated cart items
        fetchCartItems();
      };

      window.addEventListener('storage', handleStorageChange);

      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);


  const fetchCartItems = (userName) => {
    const token = sessionStorage.getItem('jwtToken');
    axios.get(`http://localhost:8080/shoppingCarts/${userName}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        const cartItems = response.data;
        setShoppingCartItems(cartItems);
        calculateSubtotal(cartItems);
        if (cartItems.length === 0) {
          setCartEmptyMessage(true);
        } else {
          setCartEmptyMessage(false);
        }
      })
      .catch(error => {
        console.error('Error fetching shopping carts:', error);
      });
  };

  const calculateSubtotal = (cartItems) => {
    const subtotalValue = cartItems.reduce((total, cart) => total + (cart.product_id.price * cart.quantity), 0);
    setSubtotal(subtotalValue);
  };



  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    console.log('Selected country:', selectedCountry);
    setCountry(selectedCountry);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.country;
      return newErrors;
    });
    if (shippingMethod === 'merre') {
      setTransportCost(0);
    } else {
      if (selectedCountry === 'Shqiperia' || selectedCountry === 'Macedonia') {
        setTransportCost(5.00);
      } else if (selectedCountry === 'Kosova') {
        setTransportCost(2.00);
      } else {
        setTransportCost(0); // Default case, should not really happen
      }
    }

    if (shippingMethod === 'transporto' && !selectedCountry) {
      setErrors((prevErrors) => ({ ...prevErrors, country: 'Kjo fushë është e detyrueshme' }));
    }
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);
    if (method === 'merre') {
      setTransportCost(0);
    } else {
      if (country === 'Shqiperia' || country === 'Macedonia') {
        setTransportCost(5.00);
      } else if (country === 'Kosova') {
        setTransportCost(2.00);
      } else {
        setTransportCost(0); // Default case, should not really happen
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'phone'];

    if (shippingMethod === 'transporto') {
      requiredFields.push('country', 'address', 'city');
    }

    for (const field of requiredFields) {
      if (!user[field]) {
        newErrors[field] = 'Kjo fushë është e detyrueshme';
      }
    }

    if (shippingMethod === 'transporto' && !country) {
      newErrors['country'] = 'Kjo fushë është e detyrueshme';
    }

    // Clear the error message when the country is selected
    if (country) {
      delete newErrors.country;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const token = sessionStorage.getItem('jwtToken');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userName = payload.sub;
    setIsSubmitting(true);

    try {
      // Check stock availability
      const outOfStockItems = [];
      for (const item of shoppingCartItems) {
        const productResponse = await axios.get(`http://localhost:8080/products/id/${item.product_id.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const availableStock = productResponse.data.quantity;
        if (item.quantity > availableStock) {
          outOfStockItems.push({ name: item.product_id.product_name, availableStock });
        }
      }

      if (outOfStockItems.length > 0) {
        setOutOfStockItems(outOfStockItems);
        setIsSubmitting(false);
        return;
      }

      // Construct the order data conditionally
      const orderData = {
        total: subtotal + transportCost,
        status: 'Ne Procesim',
        username_of_user: userName,
        type_of_transport: shippingMethod === 'transporto' ? 'transporto' : 'Merre ne Zyrat e Tech Mall',
      };

      if (shippingMethod === 'transporto') {
        orderData.country = country;
        orderData.city = user.city;
        orderData.address = user.address;
      }

      // Send the order data to the server
      const newOrderResponse = await axios.post('http://localhost:8080/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const orderId = newOrderResponse.data.id;

      // Send the order items to the server
      await Promise.all(
        shoppingCartItems.map(item =>
          axios.post('http://localhost:8080/orderItems',
            {
              id_of_order: orderId,
              id_of_product: item.product_id.id,
              quantity: item.quantity,
              price: item.product_id.price,
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`

              }
            })
        )
      );

      // Update the product quantities
      await Promise.all(
        shoppingCartItems.map(item =>
          axios.put(`http://localhost:8080/products/${item.product_id.id}`,
            {
              quantity: item.product_id.quantity - item.quantity,
            },
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            })
        )
      );

      // Delete the shopping cart items
      await axios.delete(`http://localhost:8080/shoppingCart/delete/${userName}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setShowSuccessMessage(true);
      setTimeout(() => {
        window.location.href = '/'; // Redirect to the home page
      }, 2000);

    } catch (error) {
      console.error('Error creating order:', error);
      alert("Pati një gabim gjatë krijimit të porosisë.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-gray-100 p-6">
      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Porosia u krijua me sukses!</h2>
            <p>Ju lutemi prisni, po ju ridrejtojmë në faqen kryesore...</p>
          </div>
        </div>
      )}
      {outOfStockItems.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Produkte të pamjaftueshme në stok:</strong>
          <ul className="list-disc pl-5">
            {outOfStockItems.map((item, index) => (
              <li key={index}>{item.name}: {item.availableStock} në stok</li>
            ))}
          </ul>
        </div>
      )}
      {cartEmptyMessage && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Shporta është bosh!</strong>
          <p>Ju lutemi shtoni produkte në shportën tuaj për të vazhduar me porosinë.</p>
        </div>
      )}
      {!cartEmptyMessage && (
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-2/3 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Detajet e porosisë</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">Emri</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={user.firstName}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${errors.firstName ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Mbiemri</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={user.lastName}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${errors.lastName ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">Telefoni</label>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  value={user.phone}
                  onChange={handleInputChange}
                  className={`shadow appearance-none border ${errors.phone ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                />
                {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone}</p>}
              </div>
              {shippingMethod === 'transporto' && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">Shteti</label>
                    <select
                      id="country"
                      name="country"
                      value={country}
                      onChange={handleCountryChange}
                      className={`shadow appearance-none border ${errors.country ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    >
                      <option value="">Zgjidhni Shtetin</option>
                      <option value="Kosova">Kosova</option>
                      <option value="Shqiperia">Shqipëria</option>
                      <option value="Macedonia">Maqedonia</option>
                    </select>
                    {errors.country && <p className="text-red-500 text-xs italic">{errors.country}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">Qyteti</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={user.city}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border ${errors.city ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.city && <p className="text-red-500 text-xs italic">{errors.city}</p>}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Adresa</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={user.address}
                      onChange={handleInputChange}
                      className={`shadow appearance-none border ${errors.address ? 'border-red-500' : ''} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                    />
                    {errors.address && <p className="text-red-500 text-xs italic">{errors.address}</p>}
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippingMethod">Metoda e Transportit</label>
                <div className="flex items-center mb-2">
                  <input
                    id="transporto"
                    type="radio"
                    name="shippingMethod"
                    value="transporto"
                    checked={shippingMethod === 'transporto'}
                    onChange={() => handleShippingMethodChange('transporto')}
                    className="mr-2 leading-tight"
                  />
                  <label htmlFor="transporto" className="text-gray-700">Transporto (Kosto: {transportCost.toFixed(2)} €)</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="merre"
                    type="radio"
                    name="shippingMethod"
                    value="merre"
                    checked={shippingMethod === 'merre'}
                    onChange={() => handleShippingMethodChange('merre')}
                    className="mr-2 leading-tight"
                  />
                  <label htmlFor="merre" className="text-gray-700">Merre në Zyrat e Tech Mall (Pa pagesë)</label>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md mt-6 md:mt-0">
              <h2 className="text-2xl font-bold mb-4">Përmbledhja e Porosisë</h2>
              <div className="mb-4">
                <h3 className="font-semibold">Produkte</h3>
                {shoppingCartItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.product_id.product_name} (x{item.quantity})</span>
                    <span>{(item.product_id.price * item.quantity).toFixed(2)} €</span>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Nëntotali</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Transporti</span>
                  <span>{transportCost.toFixed(2)} €</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-xl">Totali</span>
                <span className="font-bold text-xl">{(subtotal + transportCost).toFixed(2)} €</span>
              </div>
              <button
                onClick={handleSubmit}
                className={`mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Po dërgohet...' : 'Dërgo Porosinë'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
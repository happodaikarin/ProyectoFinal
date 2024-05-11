import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('orders');
        return savedOrders ? JSON.parse(savedOrders) : [];
    });

    useEffect(() => {
        const wsUrl = `${import.meta.env.VITE_REACT_APP_API_URL2}:1231`;
        const client = new WebSocket(wsUrl);
        client.onopen = () => {
            console.log('WebSocket connection established.');
        };
        client.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const text = reader.result;
                        const data = JSON.parse(text);
                        setOrders(prevOrders => {
                            const updatedOrders = [data, ...prevOrders];
                            localStorage.setItem('orders', JSON.stringify(updatedOrders));
                            return updatedOrders;
                        });
                    } catch (error) {
                        console.error('Error parsing JSON from Blob:', error);
                    }
                };
                reader.onerror = (error) => {
                    console.error('Error reading Blob:', error);
                };
                reader.readAsText(event.data);
            } else {
                try {
                    const data = JSON.parse(event.data);
                    setOrders(prevOrders => {
                        const updatedOrders = [data, ...prevOrders];
                        localStorage.setItem('orders', JSON.stringify(updatedOrders));
                        return updatedOrders;
                    });
                } catch (error) {
                    console.error('Error parsing order data:', error);
                }
            }
        };
        return () => {
            client.close();
            console.log('WebSocket connection closed.');
        };
    }, []);

    return (
        <OrderContext.Provider value={{ orders, setOrders }}>
            {children}
        </OrderContext.Provider>
    );
};

// Simple in-memory storage version (for testing/debugging)
// Note: This version loses data when the function cold-starts
// Use this only for testing if the Blobs version has issues

let pins = [];

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // GET - Retrieve all pins
        if (event.httpMethod === 'GET') {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    pins,
                    note: 'Using simple in-memory storage. Data will reset on function restart.'
                })
            };
        }

        // POST - Add a new pin
        if (event.httpMethod === 'POST') {
            const newPin = JSON.parse(event.body);
            
            // Validate pin data
            if (!newPin.lat || !newPin.lng) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid pin data: lat and lng are required' })
                };
            }

            // Add unique ID and ensure timestamp
            newPin.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            newPin.timestamp = newPin.timestamp || new Date().toISOString();
            
            // Sanitize message
            if (newPin.message) {
                newPin.message = newPin.message.substring(0, 500);
            }

            // Add new pin
            pins.push(newPin);

            // Keep only last 100 pins
            if (pins.length > 100) {
                pins = pins.slice(-100);
            }

            return {
                statusCode: 201,
                headers,
                body: JSON.stringify({ 
                    message: 'Pin added successfully (in-memory storage)',
                    pin: newPin 
                })
            };
        }

        // Method not allowed
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Error in pins-simple function:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                stack: error.stack
            })
        };
    }
};


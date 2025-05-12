// utils/api.js
export async function fetchAPI(path, options = {}) {
    const isServer = typeof window === 'undefined';

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || (
      isServer
        ? 'http://backend:8000'  // Docker default
        : 'http://localhost:8000' // Browser fallback for local dev
    );

    // const baseURL = 'http://localhost:8000';

    const url = `${baseURL}${path}`;
    // console.log('🌐 ENV:', process.env.NEXT_PUBLIC_API_BASE_URL);
    // console.log('🌐 Using baseURL:', baseURL);

    try {
        const response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            // Handling the specific Bad Request scenario for time restrictions
            const error = new Error(response.statusText);
            error.status = response.status;

            // If the status code is 400 (Bad Request), check if the error message 
            // is related to the time window
            const data = await response.json();
            console.log(data.message)
            if (data.message && data.message.includes('Sun Points can only be claimed between')) {
                throw new Error(data.message);
            }

            throw error; // Throw other types of errors as usual
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error; // Rethrow the error for further handling in the component
    }
}

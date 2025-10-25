

export async function getProperties() {
    try {
        const response = await fetch("http://localhost:3001/api/properties");
        
        // Check if response is ok (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch properties:", error);
        throw error;  // Re-throw so the calling component can handle it
    }
}
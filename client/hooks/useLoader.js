const { useState } = require("react")

const useLoader = () => {
    const [loading, setLoading] = useState(false);
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);
    return { loading, startLoading, stopLoading };
}

export default useLoader;
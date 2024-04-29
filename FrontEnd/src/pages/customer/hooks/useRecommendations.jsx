import { useState, useEffect } from 'react';

const useRecommendations = (userId) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = () => {
    setLoading(true);
    fetch(`http://localhost:5009/api/recommendations?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching recommendations:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId]);

  return { recommendations, loading, fetchRecommendations };
};

export default useRecommendations;

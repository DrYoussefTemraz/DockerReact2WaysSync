import { useEffect, useState, useRef } from "react";
import "./styles.css";

export default function LoadMoreData() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [disableButton, setDisableButton] = useState(false);
  //to prvent the initial twice renders
  const initialFetchDone = useRef(false);

  async function fetchProducts() {
    try {
      setLoading(true);
      const response = await fetch(
        `https://dummyjson.com/products?limit=20&skip=${count * 20}`,
      );
      const result = await response.json();

      if (result && result.products && result.products.length) {
        setProducts((prevData) => [...prevData, ...result.products]);
      }

      // Disable button if products length reaches 100
      if (products.length + result.products.length >= 100) {
        setDisableButton(true);
      }

      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchProducts();
    }
  }, []);

  useEffect(() => {
    if (count > 0) {
      fetchProducts();
    }
  }, [count]);

  if (loading) {
    return <div>Loading data! Please wait.</div>;
  }

  return (
    <div className="load-more-container">
      <div className="product-container">
        {products.length > 0 &&
          products.map((item) => (
            <div className="product" key={item.id}>
              <img src={item.thumbnail} alt={item.title} />
              <p>{item.title}</p>
            </div>
          ))}
      </div>
      <div className="button-container">
        <button disabled={disableButton} onClick={() => setCount(count + 1)}>
          Load More Products
        </button>
        {disableButton && <p>You have reached 100 products</p>}
      </div>
    </div>
  );
}

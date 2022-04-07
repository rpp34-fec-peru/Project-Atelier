import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ProductCard from './ProductCard.jsx';
import Modal from './Modal.jsx';
import Carousel from './Carousel.jsx';

// related products are same for every customer(display associated with the current product)
// realted products list are the same each time load
// action button - star icon => open modal window comparing the DETAILS of products (current page product vs selected product from the list)

const productID = 64620;

class RelatedProductsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productOfCurrentPage: ''
    };
  }

  componentDidMount() {
    axios.get(`products/${productID}`)
      .then((data) => {
        console.log('hello data',data.data);
        // this.setState = ({
        //   productOfCurrentPage: data
        // })
      })
      .catch((error) => {
        console.log('Error fetching product details in relatedProductsList', error);
      });
  }

  render() {
    return (
    <div id="relatedProductsList">
      <h3>RELATED PRODUCTS</h3>
      {this.state.productOfCurrentPage}
      <ProductCard />
    </div>
    );
  }
}

export default RelatedProductsList;
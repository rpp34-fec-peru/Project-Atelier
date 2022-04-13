import React from 'react';
import ImageGallery from './ImageGallery.jsx';
import ProductInformation from './ProductInformation.jsx';
import StyleSelector from './StyleSelector.jsx';
import AddToCart from './AddToCart.jsx';
import {headers, uri} from '../../../../config.js';
import axios from 'axios';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 64620,
      information: {},
      styles: [],
      selectedStyle: {},
      selectedSize: '',
      selectedQuantity: '',
      ratings: '',
      reviewsCount: ''
    }
  }

  componentDidMount() {
    let id = this.state.id;
    this.getProductInformation(id);
    this.getProductStyles(id);
    this.getProductRatings(id);
  }

  getProductInformation = (id) => {
    axios.get(`/products/${id}`)
      .then((res) => {
        const information = res.data;
        console.log(information);
        this.setState({ information });
      })
      .catch((err) => {
        console.error('getProductInformation', err);
      })
  }

  getProductStyles = (id) => {
    axios.get(`/products/${id}/styles`)
      .then((res) => {
        const styles = res.data.results;
        console.log('styles', res.data);
        this.setState({ styles });
      })
      .catch((err) => {
        console.error('getProductStyles', err);
      })
  }

  getProductReviews = (id) => {
    aixos.get(`/reviews/?sort='newest'&product_id=${id}`)
  }

  getProductRatings = (id) => {
    axios.get(`/reviews/meta/?product_id=${id}`)
      .then((res) => {
        // console.log('getProductRatings', res.data.ratings['1']);
        const reviewsCount = Number(res.data.ratings['1']) + Number(res.data.ratings['2']) + Number(res.data.ratings['3']) + Number(res.data.ratings['4']) + Number(res.data.ratings['5']);
        const ratings = ((Number(res.data.ratings['1']) * 1 + Number(res.data.ratings['2']) * 2 + Number(res.data.ratings['3']) * 3 + Number(res.data.ratings['4']) * 4 + Number(res.data.ratings['5']) * 5) / reviewsCount).toFixed(1);
        this.setState({ ratings, reviewsCount });
      })
      .catch((err) => {
        console.error('getProductRatings', err);
      })
  }

  onStyleClick = (e) => {
    const checkboxes = document.getElementsByClassName("checkbox");
    for (let checkbox of checkboxes) {
      checkbox.checked = false;
    }
    const styles = [...this.state.styles];
    const selectedCheckbox = e.target;
    selectedCheckbox.checked = true;
    const selectedStyle = styles[selectedCheckbox.id];
    this.setState({selectedStyle});
  }

  onSizeChange = (e) => {
    const selectedSize = e.target.value;
    this.setState({selectedSize});
  }

  render() {
    return (
      <div id="overview">
        <h1>Overview</h1>
        <ImageGallery />
        <ProductInformation information={this.state.information} ratings={this.state.ratings} reviewsCount={this.state.reviewsCount} />
        <StyleSelector styles={this.state.styles} onStyleClick={this.onStyleClick} selectedStyle={this.state.selectedStyle} selectedSize={this.state.selectedSize} onSizeChange={this.onSizeChange}/>
        <AddToCart />
        <br></br>
      </div>
    );
  }
}

export default Overview;
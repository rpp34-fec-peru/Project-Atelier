import React from 'react';
import axios from 'axios';
import PreviewImages from './ProductCard/PreviewImages.jsx';
import Stars from '../Shared/Stars.jsx';

// expect props.list is an array of objects
// each card displays info for a single product
// card itself are clickable, navigate to the detail page for that product

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productStyle: {},
      defaultStyle: {
        photos: [
          {
            "thumbnail_url": null,
            "url": null
          }
        ]
      },
      productRating: null
    };
    this.handleModalClick = this.handleModalClick.bind(this);
    this.handleProductCard = this.handleProductCard.bind(this);
  }

  componentDidMount() {
    this.getProductStyle();
    this.getProductRatings();
    // this.getProductStyleAndRatings();
  }

  // getProductStyleAndRatings() {
  //   axios.get(`/products/${this.props.productInfo.id}/styles`)
  //   .then(response => {
  //     var results = response.data.results;
  //     console.log('styles results',results)
  //     return axios.get(`/reviews/meta`, { params: { product_id: this.props.productInfo.id } })
  //   })
  //   .then(response => {
  //     var ratings = response.data.ratings;
  //     console.log('ratings', ratings)
  //   })
  // }

  getProductStyle() {
    axios.get(`/products/${this.props.productInfo.id}/styles`)
      .then((result) => {
        var results = result.data.results;
        var defaultStyle = '';
        for (var i = 0; i < results.length; i++) {
          if (results[i]['default?']) {
            defaultStyle = results[i];
            break;
          }
        }
        if (defaultStyle === '') {
          defaultStyle = results[0];
        }
        this.setState({
          productStyle: result.data,
          defaultStyle: defaultStyle
        })
      })
      .catch((error) => {
        console.log('Error fetching product style in Product Card', error);
      });
  }

  getProductRatings() {
    axios.get(`/reviews/meta`, { params: { product_id: this.props.productInfo.id } })
      .then((response) => {
        // check if there is a rating
        var ratings = response.data.ratings;
        if (Object.keys(ratings).length > 0) {
          var total = 0;
          var amount = 0;
          for (var key in ratings) {
            total += (parseInt(key) * parseInt(ratings[key]));
            amount += parseInt(ratings[key]);
          }
          var average = total / amount;
          this.setState({
            productRating: average.toFixed(2)
          })
        }
      })
      .catch((error) => {
        console.log('Get product review failed...', error);
      })
  }

  handleModalClick(e) {
    this.props.updateModal(this.props.productInfoOfCurrentPage, this.props.productInfo);
  }

  handleProductCard(e) {
    var id = this.props.productInfo.id;
    // console.log('clicked product = ', this.props.productInfo)
    // this.props.updateProduct(id);
  }

  render() {
    const { productRating, defaultStyle, productStyle} = this.state;
    const { productInfo, productInfoOfCurrentPage, action, removeOutfit, updateModal, updateProduct } = this.props;
    return (
      <div className="productCard" id={productInfo.id} onClick={this.handleProductCard}>
        <div className="productInfo-upper">
          {action === 'relatedProducts' ? <button className="action-btn" onClick={this.handleModalClick}>{"\u2606"}</button> : <button className="action-btn of" id={productInfo.id} onClick={removeOutfit}> X </button>}
          <PreviewImages currentStyle={defaultStyle} productID={productInfo.id}/>
        </div>
        <div className="productInfo">
          <div className="productInfo-category">{productInfo.category}</div>
          <div className="productInfo-name">{productInfo.name}</div>
          {defaultStyle.original_price && defaultStyle.sale_price ?
            <div className="productInfo-price">
              <div className="sale">${defaultStyle.sale_price}</div>
              <div className="original">${defaultStyle.original_price}</div>
            </div>
            :
            <div className="productInfo-price">${defaultStyle.original_price}</div>
          }
          <Stars rating={productRating} />
        </div>
      </div>
    );
  }
};

export default ProductCard;
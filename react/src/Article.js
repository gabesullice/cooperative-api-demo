import React, { Component } from 'react';

class Article extends Component {

  constructor(props) {
    super(props);
    this.state = {
      article: this.mapResource(this.props.resource),
    };
    this.handleRelationships = this.handleRelationships.bind(this);
    this.handleRelationships(this.props.resource.relationships);
  }

  static attributes() {
    return ['title'];
  }

  static relationships() {
    return {
      image: {
        field: 'field_image',
        anticipate: {
          file: '.data.attributes.url',
        }
      },
    };
  }

  getBody(post) {
    return { __html: post.body };
  }

  mapResource(resource) {
    return {
      id: resource.id,
      title: resource.attributes.title,
    };
  }

  handleRelationships(relationships) {
    relationships.image.consume(image => {
      this.setState((prevState, props) => {
        const article = prevState.article;
        article.image = `https://http2.sullice.com${image.attributes.url}`;
        return article;
      })
    });
  }

  render() {
    const article = this.state.article;
    return (
      <div className="Article">
        {article.image && <img src={article.image} alt=""/>}
        <p className="title">Title: {article.title}</p>
        <p className="title">ID: {article.id}</p>
      </div>
    );
  }
}

export default Article;

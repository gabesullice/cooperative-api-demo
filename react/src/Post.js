import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Post extends Component {

  constructor(props) {
    super(props);
    this.state = {
      resource: this.mapResource(this.props.resource),
    };
  }

  getBody(post) {
    return { __html: post.body };
  }

  mapResource(resource) {
    return {
      id: resource.id,
      title: resource.attributes.title,
      body: resource.attributes.body.processed,
      link: resource.attributes.path.alias,
    };
  }

  render() {
    const post = this.state.resource;
    return (
      <div className="Post">
        <h2 className="title">{post.title}<Link to={post.link} className="permalink" title="permalink">&#10968;</Link></h2>
        <div className="body" dangerouslySetInnerHTML={ this.getBody(post) } />
      </div>
    );
  }
}

export default Post;

import React, { Component } from 'react';
import Filter from './juissy/lib/filters.js';

function Collection(WrappedComponent) {
  return class extends Component {

    constructor(props) {
      super(props);
      this.state = {resources: []};
      this.handleFeed = this.handleFeed.bind(this);
    }

    componentDidMount() {
      this.props.client.findAll(this.getResourceType(), this.getOptions()).then(this.handleFeed);
    }

    handleFeed(feed) {
      const doHandle = async () => {
        let count = 0;
        let next = true;
        while (next && count < 25) {
          next = await feed.consume((resource, relationships) => this.pushResource(resource, relationships), this.shouldPreserveOrder());
          if (next) {
            next(5);
            next = true;
          }
          count += 5;
        }
      };
      doHandle()
    }

    pushResource(resource, relationships) {
      resource.relationships = relationships;
      this.setState((prevState, props) => {
        const state = {resources: prevState.resources};
        state.resources.push(this.mapResource(resource))
        return state;
      });
    }

    getResourceType() {
      return this.props.resourceType;
    }

    getOptions() {
      const attributes = WrappedComponent.attributes();
      const relationships = WrappedComponent.relationships();
      const options = {
        sort: this.props.sort || '',
        limit: this.props.limit || 50,
        attributes: attributes.concat(...Object.keys(relationships).map(key => relationships[key].field)),
        relationships
      };
      let filter = this.getFilter();
      if (filter) {
        options.filter = filter;
      }
      return options;
    }

    getFilter() {
      return this.props.filter instanceof Filter
        ? this.props.filter.compile(this.getFilterParams())
        : this.props.filter;
    }

    getFilterParams() {
      return this.props.filterParams || {};
    }

    shouldPreserveOrder() {
      return this.props.preserveOrder || true
    }

    mapResource(resource) {
      return resource;
    }

    render() {
      return this.state.resources.length ? this.renderAll() : null;
    }

    renderAll() {
      return (
        <div className="ResourceCollection">
          {this.state.resources.map(resource => (
            <WrappedComponent key={resource.id} resource={resource} {...this.props} />
          ))}
        </div>
      );
    }

  }
}

export default Collection;

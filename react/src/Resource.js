import React, { Component } from 'react';

function Resource(WrappedComponent) {
  return class extends Component {

    constructor(props) {
      super(props);
      this.state = {resource: null};
      this.handleResource = this.handleResource.bind(this);
    }

    componentDidMount() {
      const debug = this.props.client.debugger();
      if (this.props.type && this.props.id) {
        this.props.client.get(this.props.type, this.props.id).catch(debug).then(this.handleResource);
      }
      if (this.props.path) {
        this.props.client.resolve(this.props.path).catch(debug).then(this.handleResource);
      }
    }

    handleResource(resource) {
      this.setState({resource});
    }

    render() {
      return this.state.resource
        ? <WrappedComponent resource={this.state.resource} {...this.props} />
        : null;
    }

  };
}

export default Resource;

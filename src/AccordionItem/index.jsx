'use strict';

import className from 'classnames';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AccordionItemBody from '../AccordionItemBody';
import AccordionItemTitle from '../AccordionItemTitle';

export default class AccordionItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      maxHeight: props.expanded ? 'none' : 0,
      overflow: props.expanded ? 'visible' : 'hidden',
      duration: 300
    };
  }

  componentDidMount() {
    this.setMaxHeight();
  }

  componentDidUpdate(prevProps) {
    const { expanded, disabled, children } = this.props;

    if (prevProps.expanded !== expanded) {
      if (disabled) return;

      if (expanded) {
        this.handleExpand();
      } else {
        this.handleCollapse();
      }
    } else if(prevProps.children !== children) {
      this.setMaxHeight();
    }
  }

  handleExpand() {
    const { onExpand, slug } = this.props;

    this.setMaxHeight();

    if(onExpand) {
      slug ? onExpand(slug) : onExpand();
    }
  }

  handleCollapse() {
    const { onClose, slug } = this.props;

    this.setMaxHeight();

    if(onClose) {
      slug ? onClose(slug) : onClose();
    }
  }

  setMaxHeight() {
    var bodyNode = ReactDOM.findDOMNode(this.refs.body);
    var images = bodyNode.querySelectorAll('img');

    if (images.length > 0) {
      return this.preloadImages(bodyNode, images);
    }

    this.setState({
      maxHeight: this.props.expanded ? bodyNode.scrollHeight + 'px' : 0,
      overflow: 'hidden'
    });
  }

  // Wait for images to load before calculating maxHeight
  preloadImages(node, images = []) {
    var imagesLoaded = 0;
    var imgLoaded = () => {
      imagesLoaded++;

      if (imagesLoaded === images.length) {
        this.setState({
          maxHeight: this.props.expanded ? node.scrollHeight + 'px' : 0,
          overflow: 'hidden'
        });
      }
    };

    for (let i = 0; i < images.length; i += 1) {
      let img = new Image();
      img.src = images[i].src;
      img.onload = img.onerror = imgLoaded;
    }
  }

  getProps() {
    var props = {
      className: className(
        'react-sanfona-item',
        this.props.className,
        { 'react-sanfona-item-expanded': (this.props.expanded && !this.props.disabled)},
        this.props.expandedClassName && { [this.props.expandedClassName]: this.props.expanded },
        { 'react-sanfona-item-disabled': this.props.disabled },
        this.props.disabledClassName && { [this.props.disabledClassName]: this.props.disabled },
      ),
      role: 'tabpanel',
      tabIndex: '0',
      style: this.props.style
    };

    if (this.props.expanded) {
      props['aria-expanded'] = true;
    } else {
      props['aria-hidden'] = true;
    }

    return props;
  }

  handleKeyDown(e) {
    if (e.keyCode === 13) {
      if (typeof this.props.onKeyDown === 'function') {
          this.props.onKeyDown();
      }
    }
  }

  render() {
    const title = typeof this.props.title !== 'object' ? `${this.props.title.toLowerCase().replace(/\s/g, '-')}-${this.props.index}` : this.props.index;
    return (
      <div {...this.getProps()} ref="item" onKeyDown={this.handleKeyDown.bind(this)}>
        <AccordionItemTitle
          className={this.props.titleClassName}
          title={this.props.title}
          onClick={this.props.disabled ? null : this.props.onClick}
          titleColor= {this.props.titleColor}
          uuid={title} />
        <AccordionItemBody
          maxHeight={this.state.maxHeight}
          duration={this.state.duration}
          className={this.props.bodyClassName}
          overflow={this.state.overflow}
          ref="body"
          uuid={title}>
          {this.props.children}
        </AccordionItemBody>
      </div>
    );
  }

}

AccordionItem.propTypes = {
  bodyClassName: PropTypes.string,
  className: PropTypes.string,
  expanded: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  expandedClassName: PropTypes.string,
  style: PropTypes.object,
  titleClassName: PropTypes.string,
  disabled: PropTypes.bool,
  disabledClassName: PropTypes.string,
};
// @flow

import React from 'react';
import {Button} from 'react-bootstrap';
import LinkEntryModal from './LinkEntryModal.jsx'
import ConfirmationModal from '../common/confirmation/ConfirmationModal.jsx'
import type { LinkInfo } from './LinkInfo.jsx'
import _ from 'lodash'


type Props = {|
  links: Array<LinkInfo>,
  elementid: string
|};
type State = {|
  showAddEditModal: boolean,
  showDeleteModal: boolean,
  existingLink: LinkInfo,
  linkToDelete: LinkInfo,
  links: Array<LinkInfo>
|};

/**
 * Lists hyperlinks and provides add/edit functionality for them
 */
class LinkList extends React.PureComponent<Props,State>  {
  constructor(props: Props): void {
    super(props);
    this.state = {
      links: this.props.links || [],
      showAddEditModal: false,
      showDeleteModal: false,
      existingLink: null,
      linkToDelete: null
    };
  }
  
  componentWillReceiveProps(nextProps: Props): void {
    if(nextProps.links) {
      this.setState({links: nextProps.links || []});
      this.updateLinkField();
    }
  }

  createNewLink(): void {
    this.state.existingLink = null;
    this.openModal();
  }
  
  onModalCancel(): void {
    this.setState({showAddEditModal: false})
  }
  
  editLink(linkData: LinkInfo): void {
    this.state.existingLink = linkData;
    this.openModal();
  }
  
  saveLink(linkData: LinkInfo): void {
    if(!this.state.existingLink) {
      this.state.links.push(linkData);
    } else {
      _.assign(this.state.existingLink, linkData);
    }
  
    this.setState({showAddEditModal: false});
    this.updateLinkField();
  }
  
  updateLinkField(): void {
    this.refs.hiddenFormField.value = JSON.stringify(this.state.links);
  }

  openModal(): void {
    this.setState({showAddEditModal: true});
  }
  
  askForDeleteConfirmation(linkToDelete: LinkInfo): void {
    this.setState({
      linkToDelete: linkToDelete,
      showDeleteModal: true
    })
  }
  
  confirmDelete(confirmed: boolean): void {
    if(confirmed) {
      _.remove(this.state.links, (link) => link.linkUrl === this.state.linkToDelete.linkUrl);
      this.updateLinkField();
    }
    this.setState({
      showDeleteModal: false,
      linkToDelete: null
    })
  }
  
  render(): React$Node {
    return (
      <div>
        <input type="hidden" ref="hiddenFormField" id={this.props.elementid} name={this.props.elementid}/>
        
        {this._renderLinks()}
        
        <Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.createNewLink.bind(this)}
        >
          Add
        </Button>

        <LinkEntryModal showModal={this.state.showAddEditModal}
          existingLink={this.state.existingLink}
          onSaveLink={this.saveLink.bind(this)}
          onCancelLink={this.onModalCancel.bind(this)}
        />
        
        <ConfirmationModal
          showModal={this.state.showDeleteModal}
          message="Do you want to delete this link?"
          onSelection={this.confirmDelete.bind(this)}
        />
      </div>
    );
  }
  
  _renderLinks(): Array<React$Node> {
    return this.state.links.map((link,i) =>
      <div key={i}>
        <a href={link.linkUrl}>{link.linkName}</a>
        <i className="fa fa-pencil-square-o fa-1" aria-hidden="true" onClick={this.editLink.bind(this,link)}></i>
        <i className="fa fa-trash-o fa-1" aria-hidden="true" onClick={this.askForDeleteConfirmation.bind(this,link)}></i>
      </div>
    );
  }
}

export default LinkList;

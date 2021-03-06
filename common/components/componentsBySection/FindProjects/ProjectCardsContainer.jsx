// @flow

import type {Project} from '../../stores/ProjectSearchStore.js';
import type {FluxReduceStore} from 'flux/utils';

import {Container} from 'flux/utils';
import {List} from 'immutable'
import ProjectCard from './ProjectCard.jsx';
import ProjectSearchStore from '../../stores/ProjectSearchStore.js';
import React from 'react';

type State = {|
  projects: List<Project>
|};

class ProjectCardsContainer extends React.Component<{||}, State> {
  
  static getStores(): $ReadOnlyArray<FluxReduceStore> {
    return [ProjectSearchStore];
  }
  
  static calculateState(prevState: State): State {
    return {
      projects: ProjectSearchStore.getProjects(),
    };
  }
  
  render(): React$Node {
    return (
      <div>
        {this._renderCards()}
      </div>
    );
  }
  
  _renderCards(): React$Node {
    return !this.state.projects
      ? 'Loading projects ...'
      : this.state.projects.size === 0
        ? 'No projects match the provided criteria'
        : this.state.projects.map(
          (project, index) =>
            <ProjectCard
              project={project}
              key={index}
            />
        );
  }
}

export default Container.create(ProjectCardsContainer);
